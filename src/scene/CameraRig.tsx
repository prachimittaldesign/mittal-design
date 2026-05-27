import { useEffect, useRef, type ElementRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { easing } from 'maath'
import { CITY_BOUNDS } from './lib/cityModel'
import type { CameraCmd, ViewMode } from '../types'

export const DEFAULT_CAMERA_TUPLE: [number, number, number] = [0, 92, 118]
export const DEFAULT_CAMERA_POS = new Vector3(...DEFAULT_CAMERA_TUPLE)

// Camera offset (from the pan target) per view mode.
const VIEW_OFFSET: Record<ViewMode, Vector3> = {
  '3d':      new Vector3(0,  92, 118),
  iso:       new Vector3(82, 104, 82),
  // Skyline: far back on Z, low-ish Y — like standing at the edge of
  // Marine Drive looking at the wall of buildings.
  skyline:   new Vector3(0,  22, 155),
}
const ORIGIN: [number, number, number] = [0, 0, 0]
const { minX, maxX, minZ, maxZ } = CITY_BOUNDS

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// Google-Maps-style controls: drag to pan, wheel/pinch to zoom, drag-rotate to
// orbit/tilt within limits. Double-click eases the camera back to the opening
// aerial. Panning is clamped so you can't drift off the city.
export interface FocusTarget {
  x: number
  z: number
  nonce: number
}

export function CameraRig({
  focus,
  cmd,
  view,
}: {
  focus: FocusTarget | null
  cmd: CameraCmd | null
  view: ViewMode
}) {
  const ref = useRef<ElementRef<typeof MapControls>>(null)
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const recentering = useRef(false)
  const flying = useRef(false)
  const flyTarget = useRef(new Vector3())
  const flyPos = useRef(new Vector3())
  const lastNonce = useRef(0)
  const zooming = useRef(false)
  const zoomTarget = useRef(0)
  const lastCmd = useRef(0)
  const viewing = useRef(false)
  const viewPos = useRef(new Vector3())
  const lastView = useRef(view)

  useEffect(() => {
    const el = gl.domElement
    const onDouble = () => {
      recentering.current = true
      if (ref.current) ref.current.enabled = false
    }
    el.addEventListener('dblclick', onDouble)
    return () => el.removeEventListener('dblclick', onDouble)
  }, [gl])

  useFrame((_, dt) => {
    const c = ref.current
    if (!c) return

    // Fly-to a searched/recommended place (preserve viewing angle).
    if (focus && focus.nonce !== lastNonce.current) {
      lastNonce.current = focus.nonce
      flying.current = true
      flyTarget.current.set(focus.x, 0, focus.z)
      const dir = camera.position.clone().sub(c.target)
      dir.y = Math.max(dir.y, 34)
      dir.setLength(96)
      flyPos.current.copy(flyTarget.current).add(dir)
      c.enabled = false
    }

    // Toolbar zoom / recenter (DOM buttons).
    if (cmd && cmd.nonce !== lastCmd.current) {
      lastCmd.current = cmd.nonce
      if (cmd.type === 'recenter') {
        recentering.current = true
        c.enabled = false
      } else {
        const cur = camera.position.distanceTo(c.target)
        zoomTarget.current = Math.min(230, Math.max(45, cur * (cmd.type === 'zoomIn' ? 0.78 : 1.28)))
        zooming.current = true
        c.enabled = false
      }
    }

    // View change — ease to the matching vantage.
    if (view !== lastView.current) {
      lastView.current = view
      viewing.current = true
      // Skyline: reset pan target to origin so all buildings are in frame.
      if (view === 'skyline') {
        c.target.set(0, 0, 0)
        c.update()
      }
      viewPos.current.copy(c.target).add(VIEW_OFFSET[view])
    }

    if (flying.current) {
      easing.damp3(camera.position, flyPos.current, 0.3, dt)
      easing.damp3(c.target, flyTarget.current, 0.3, dt)
      c.update()
      if (camera.position.distanceTo(flyPos.current) < 0.8) {
        flying.current = false
        c.enabled = true
      }
      return
    }

    if (zooming.current) {
      const dir = camera.position.clone().sub(c.target)
      const dist = { d: dir.length() }
      easing.damp(dist, 'd', zoomTarget.current, 0.16, dt)
      dir.setLength(dist.d)
      camera.position.copy(c.target).add(dir)
      c.update()
      if (Math.abs(dist.d - zoomTarget.current) < 0.4) {
        zooming.current = false
        c.enabled = true
      }
      return
    }

    if (viewing.current) {
      easing.damp3(camera.position, viewPos.current, 0.3, dt)
      c.update()
      if (camera.position.distanceTo(viewPos.current) < 0.8) viewing.current = false
      return
    }

    if (recentering.current) {
      easing.damp3(camera.position, DEFAULT_CAMERA_POS, 0.28, dt)
      easing.damp3(c.target, ORIGIN, 0.28, dt)
      c.update()
      if (camera.position.distanceTo(DEFAULT_CAMERA_POS) < 0.6) {
        recentering.current = false
        c.enabled = true
      }
    } else {
      // Keep the pan target inside the city; shift the camera by the same delta
      // so clamping doesn't alter the zoom/angle at the boundary.
      const tx = clamp(c.target.x, minX, maxX)
      const tz = clamp(c.target.z, minZ, maxZ)
      const dx = tx - c.target.x
      const dz = tz - c.target.z
      if (dx !== 0 || dz !== 0) {
        c.target.x = tx
        c.target.z = tz
        camera.position.x += dx
        camera.position.z += dz
      }
    }
  })

  return (
    <MapControls
      ref={ref}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      // Skyline: screen-space pan lets the user slide left/right along the
      // row; orbit is disabled so the cinematic front-facing angle is locked.
      screenSpacePanning={view === 'skyline'}
      enableRotate={view === '3d'}
      minDistance={view === 'skyline' ? 60 : 45}
      maxDistance={view === 'skyline' ? 220 : 230}
      minPolarAngle={view === 'skyline' ? 1.18 : 0.32}
      maxPolarAngle={view === 'skyline' ? 1.45 : 1.15}
    />
  )
}

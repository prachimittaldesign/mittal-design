import { useEffect, useRef, type ElementRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { easing } from 'maath'
import { CITY_BOUNDS } from './lib/cityModel'
import type { CameraCmd, ViewMode } from '../types'

export const DEFAULT_CAMERA_TUPLE: [number, number, number] = [0, 138, 177]
export const DEFAULT_CAMERA_POS = new Vector3(...DEFAULT_CAMERA_TUPLE)

// Camera offset (from the pan target) per view mode.
const VIEW_OFFSET: Record<ViewMode, Vector3> = {
  '3d':      new Vector3(0,  138, 177),
  iso:       new Vector3(123, 156, 123),
  // Skyline: far back on Z, low-ish Y — like standing at the edge of
  // Marine Drive looking at the wall of buildings.
  skyline:   new Vector3(0,  33, 233),
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

// How much to push the camera back as the viewport gets narrower than this
// reference (wide-desktop) aspect. A tall phone screen fits far less width at a
// given distance, so 2D/skyline would clip without this — hence per-view caps.
const REF_ASPECT = 1.5
const FIT_CAP: Record<ViewMode, number> = { '3d': 1.55, iso: 2.45, skyline: 2.7 }

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
  const size = useThree((s) => s.size)
  const aspect = size.width / Math.max(1, size.height)

  // Distance multiplier for the current aspect (1 on desktop, grows on mobile).
  // Uniform scaling preserves each view's angle while fitting more content.
  const fit = (v: ViewMode) => clamp(REF_ASPECT / aspect, 1, FIT_CAP[v])
  const offsetFor = (v: ViewMode) => VIEW_OFFSET[v].clone().multiplyScalar(fit(v))
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

  // Frame the city responsively on first paint — on mobile the fixed opening
  // tuple (from the Canvas) would sit too close and clip the edges.
  useEffect(() => {
    const c = ref.current
    if (!c) return
    camera.position.copy(offsetFor('3d'))
    c.target.set(0, 0, 0)
    c.update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        zoomTarget.current = Math.min(345, Math.max(68, cur * (cmd.type === 'zoomIn' ? 0.78 : 1.28)))
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
      viewPos.current.copy(c.target).add(offsetFor(view))
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
      // Recenter to the current view's vantage (responsive), framed on origin.
      const rp = offsetFor(view)
      easing.damp3(camera.position, rp, 0.28, dt)
      easing.damp3(c.target, ORIGIN, 0.28, dt)
      c.update()
      if (camera.position.distanceTo(rp) < 0.6) {
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
      minDistance={view === 'skyline' ? 90 : 68}
      // Raise the zoom-out ceiling on narrow screens so the responsive
      // pulled-back framing isn't clamped back in (which caused the clipping).
      maxDistance={(view === 'skyline' ? 330 : 345) * fit(view)}
      minPolarAngle={view === 'skyline' ? 1.18 : 0.32}
      maxPolarAngle={view === 'skyline' ? 1.45 : 1.15}
    />
  )
}

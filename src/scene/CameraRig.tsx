import { useEffect, useRef, type ElementRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { easing } from 'maath'
import { CITY_BOUNDS } from './lib/cityModel'

export const DEFAULT_CAMERA_TUPLE: [number, number, number] = [0, 92, 118]
export const DEFAULT_CAMERA_POS = new Vector3(...DEFAULT_CAMERA_TUPLE)
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

export function CameraRig({ focus }: { focus: FocusTarget | null }) {
  const ref = useRef<ElementRef<typeof MapControls>>(null)
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const recentering = useRef(false)
  const flying = useRef(false)
  const flyTarget = useRef(new Vector3())
  const flyPos = useRef(new Vector3())
  const lastNonce = useRef(0)

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
      screenSpacePanning={false}
      minDistance={45}
      maxDistance={230}
      minPolarAngle={0.32}
      maxPolarAngle={1.15}
    />
  )
}

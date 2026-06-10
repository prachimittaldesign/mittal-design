import { useEffect, useRef, type ElementRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { easing } from 'maath'
import { CITY_BOUNDS } from './lib/cityModel'
import type { CameraCmd, ViewMode } from '../types'

export const DEFAULT_CAMERA_TUPLE: [number, number, number] = [0, 125, 215]
export const DEFAULT_CAMERA_POS = new Vector3(...DEFAULT_CAMERA_TUPLE)

// Camera offset (from the pan target) per view mode.
const VIEW_OFFSET: Record<ViewMode, Vector3> = {
  // 3D: a scenic coastal overview — pitched ~30° so the sea around the town and
  // the dusk horizon read behind it, while the city layout stays legible.
  '3d':      new Vector3(0,  125, 215),
  // 2D ("bird's-eye"): a high, steeply-angled overhead view (~52° below
  // horizontal) — clearly looking down on the town and its coastline, with the
  // sea ring fading to the dusk horizon around it.
  iso:       new Vector3(0,  235, 185),
  // Street view: a low eye, pushed OUT over the water (past the LAND_R≈206
  // coastline) so shimmering reflections fill the foreground and the lit town
  // rises across the bay against the dusk sky — the closest match to Amalfi.
  skyline:   new Vector3(0,  34, 245),
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
// reference (wide-desktop) aspect.
// iso: modest pull-back on narrow screens so the coastal townscape still fits.
// skyline: capped at 1.85× so mobile portrait fits all buildings in the narrow
//   horizontal FOV (fov=40° → hFOV≈23° at aspect 0.56) without pushing the
//   camera so far back that enterprise buildings (z=−72) hit the fog.
const REF_ASPECT = 1.5
const FIT_CAP: Record<ViewMode, number> = { '3d': 1.55, iso: 1.5, skyline: 1.85 }

// Google-Earth-style idle orbit: the city drifts slowly on its own until the
// user touches the canvas, then resumes after this much idle time.
const IDLE_RESUME_MS = 10_000
const AUTO_ROTATE_SPEED = 0.4 // OrbitControls units: 2.0 ≈ 30 s/orbit → ~150 s/orbit

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
  // Negative start time → the idle orbit is already running on first paint.
  const lastInteract = useRef(-IDLE_RESUME_MS)

  useEffect(() => {
    const el = gl.domElement
    const onDouble = () => {
      recentering.current = true
      if (ref.current) ref.current.enabled = false
    }
    const onInteract = () => {
      lastInteract.current = performance.now()
    }
    el.addEventListener('dblclick', onDouble)
    el.addEventListener('pointerdown', onInteract)
    el.addEventListener('wheel', onInteract, { passive: true })
    el.addEventListener('touchstart', onInteract, { passive: true })
    return () => {
      el.removeEventListener('dblclick', onDouble)
      el.removeEventListener('pointerdown', onInteract)
      el.removeEventListener('wheel', onInteract)
      el.removeEventListener('touchstart', onInteract)
    }
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

    // Idle auto-orbit: the city drifts on its own (from first paint) whenever
    // the user hasn't touched the canvas recently and no programmatic camera
    // motion is in flight. Skyline locks its cinematic angle, so it's exempt.
    const busy = flying.current || zooming.current || viewing.current || recentering.current
    c.autoRotate =
      view !== 'skyline' && !busy && performance.now() - lastInteract.current > IDLE_RESUME_MS

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
        const zMin = view === 'skyline' ? 90 : view === 'iso' ? 120 : 26
        const zMax = view === 'skyline' ? 480 : view === 'iso' ? 520 : 345
        zoomTarget.current = Math.min(zMax, Math.max(zMin, cur * (cmd.type === 'zoomIn' ? 0.78 : 1.28)))
        zooming.current = true
        c.enabled = false
      }
    }

    // View change — ease to the matching vantage.
    if (view !== lastView.current) {
      lastView.current = view
      viewing.current = true
      // Skyline / iso: reset pan to origin so the full city is in frame.
      if (view === 'skyline' || view === 'iso') {
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
      autoRotateSpeed={AUTO_ROTATE_SPEED}
      // Skyline locks its cinematic front angle via screen-space pan. 3D and the
      // coastal 2D view both allow free orbit so you can sweep the bay.
      screenSpacePanning={view === 'skyline'}
      enableRotate={view !== 'skyline'}
      // 3D: allow getting right down near street level (26) so the headland
      //   hills behind the town can be admired from a low, dramatic angle.
      minDistance={view === 'skyline' ? 90 : view === 'iso' ? 120 : 26}
      maxDistance={view === 'skyline' ? 480 : view === 'iso' ? 520 : 345 * fit(view)}
      // 2D bird's-eye stays steeply overhead; 3D can drop almost to the horizon
      // (1.46 ≈ 84°) for that low waterfront angle, or rise to a high aerial.
      minPolarAngle={view === 'skyline' ? 1.18 : view === 'iso' ? 0.32 : 0.3}
      maxPolarAngle={view === 'skyline' ? 1.45 : view === 'iso' ? 1.0 : 1.46}
    />
  )
}

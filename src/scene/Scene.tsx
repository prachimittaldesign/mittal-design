import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Loader } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { Points } from 'three'
import { CameraRig, DEFAULT_CAMERA_TUPLE, type FocusTarget } from './CameraRig'
import { CoachAnchorProbe } from './CoachAnchorProbe'
import { CityWorld } from './CityWorld'
import { DayNight } from './DayNight'
import { DaySky } from './DaySky'
import { EnvBalloons } from './CityLife'
import { Hero } from '../components/Hero'
import { WeatherClock } from '../components/WeatherClock'
import { useHyderabad } from '../lib/useHyderabad'
import type { Appearance, CameraCmd, LayerState, ViewMode, Project, Landmark } from '../types'

interface SceneProps {
  appearance: Appearance
  layers: LayerState
  view: ViewMode
  focus: FocusTarget | null
  cameraCmd: CameraCmd | null
  onSelect: (project: Project, rect: DOMRect) => void
  onSelectLandmark: (landmark: Landmark, rect: DOMRect) => void
}

// Slowly drifting golden motes — atmosphere that catches the light.
function AmbientParticles() {
  const ref = useRef<Points>(null)
  const [positions] = useState(() => {
    const count = 280
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 200
      arr[i * 3 + 1] = Math.random() * 60 + 2
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    return arr
  })

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime * 0.04
    ref.current.rotation.y = t * 0.15
    ref.current.position.y = Math.sin(t * 0.5) * 1.5
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        color="#ffd27a"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function Scene({ appearance, layers, view, focus, cameraCmd, onSelect, onSelectLandmark }: SceneProps) {
  const [docked, setDocked] = useState(false)
  const { time, weather } = useHyderabad()
  useEffect(() => {
    const t = setTimeout(() => setDocked(true), 2400)
    return () => clearTimeout(t)
  }, [])

  // Detect small/touch screens once so the heavier passes (high DPR, the
  // every-frame reflection cube map) scale down on phones for smoother fps.
  const [isMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches,
  )

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper animate-[worldFadeIn_900ms_100ms_both]">
      <div
        className="absolute inset-0"
        role="application"
        aria-label="Interactive 3D map of Prachi Mittal's projects. Each building is a project — use the search box to find one, or the project index (first link on the page) for a text version."
      >
        <Canvas
          className="scene-canvas"
          shadows
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          // near=2 (was 0.5): the ground/road layers are stacked only
          // 0.01-0.02 apart in y. With a 24-bit depth buffer those gaps fall
          // below the buffer's resolution once the camera is ~150+ units
          // away, causing the road network to z-fight/flicker on zoom-out.
          // A larger near plane (still well inside minDistance=26) quarters
          // that error at typical viewing distances.
          camera={{ position: DEFAULT_CAMERA_TUPLE, fov: 40, near: 2, far: 2000 }}
          gl={{ toneMappingExposure: 0.6 }}
        >
          {/* Lights, fog and time-of-day cycle. */}
          <DayNight weather={weather} view={view} />
          {/* Visible sky + clouds in the main scene. */}
          <DaySky weather={weather} />
          {/* Live environment map — captures a second copy of the sky, clouds
              and balloons into a cube map so the glass facades mirror them.
              far must exceed the Sky dome's distance (45000) or the sky gets
              clipped out of the cube and the glass reflects only darkness.
              Half resolution on mobile (256 vs 512) to cut the per-frame cost. */}
          <Environment
            frames={Infinity}
            resolution={isMobile ? 256 : 512}
            background={false}
            near={1}
            far={100000}
          >
            <DaySky weather={weather} />
            {/* colourful balloons drifting in the reflected sky */}
            <EnvBalloons />
          </Environment>

          <Suspense fallback={null}>
            <CityWorld
              appearance={appearance}
              layers={layers}
              view={view}
              weather={weather}
              onSelect={onSelect}
              onSelectLandmark={onSelectLandmark}
            />
            <AmbientParticles />
          </Suspense>

          <CameraRig focus={focus} cmd={cameraCmd} view={view} />
          <CoachAnchorProbe />

          {/* Bloom — only the brightest pixels (lit windows, accents, monument
              tip) bloom, so it stays subtle by day and glows after dark. */}
          <EffectComposer>
            <Bloom
              mipmapBlur
              luminanceThreshold={0.97}
              luminanceSmoothing={0.9}
              intensity={0.18}
            />
          </EffectComposer>
        </Canvas>
      </div>
      <Loader />

      {/* DOM HUD over the canvas */}
      <Hero docked={docked} />
      <WeatherClock time={time} weather={weather} />
      <Hint />
    </div>
  )
}

// Persistent control hint — no background at all; plain white text with a soft
// dark shadow so it stays readable over the (light or dark) scene without a
// panel. Desktop only; on touch the first-visit coachmarks carry the gestures.
function Hint() {
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-[15] hidden -translate-x-1/2 sm:block">
      <div className="flex items-center gap-[9px] whitespace-nowrap px-[15px] py-[7px]">
        <span
          className="h-[5px] w-[5px] rounded-full bg-white"
          style={{ animation: 'pulseDot 1.8s ease-in-out infinite', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.55))' }}
        />
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-white"
          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 10px rgba(0,0,0,0.35)' }}
        >
          Drag to pan · Scroll to zoom · Right-drag to orbit · Click a building
        </span>
      </div>
    </div>
  )
}

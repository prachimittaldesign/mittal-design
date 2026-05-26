import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { CameraRig, DEFAULT_CAMERA_TUPLE, type FocusTarget } from './CameraRig'
import { CityWorld } from './CityWorld'
import { Hero } from '../components/Hero'
import { AboutPanel } from '../components/AboutPanel'
import { SKY } from './lib/cityTheme'
import type { Project, Landmark } from '../types'

interface SceneProps {
  onSelect: (project: Project, rect: DOMRect) => void
  onSelectLandmark: (landmark: Landmark, rect: DOMRect) => void
  focus: FocusTarget | null
}

export function Scene({ onSelect, onSelectLandmark, focus }: SceneProps) {
  const [docked, setDocked] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDocked(true), 2400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper animate-[worldFadeIn_900ms_100ms_both]">
      <Canvas
        className="scene-canvas"
        shadows
        dpr={[1, 2]}
        camera={{ position: DEFAULT_CAMERA_TUPLE, fov: 40, near: 0.5, far: 2000 }}
      >
        <color attach="background" args={[SKY]} />
        <fog attach="fog" args={[SKY, 180, 420]} />

        <hemisphereLight args={[SKY, '#cdbfa6', 0.85]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[60, 95, 42]}
          intensity={1.15}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={10}
          shadow-camera-far={320}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0004}
        />

        <Suspense fallback={null}>
          <CityWorld onSelect={onSelect} onSelectLandmark={onSelectLandmark} />
        </Suspense>

        <CameraRig focus={focus} />
      </Canvas>

      <Loader />

      {/* DOM HUD over the canvas */}
      <Hero docked={docked} />
      <AboutPanel />
      <Hint />
    </div>
  )
}

function Hint() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-7 z-[15] flex items-center gap-[7px] font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft opacity-50">
      <span
        className="h-[5px] w-[5px] rounded-full bg-ink-soft"
        style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
      />
      Drag to pan · Scroll to zoom · Right-drag to orbit · Click a building or landmark
    </div>
  )
}

import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Loader, Sky, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CameraRig, DEFAULT_CAMERA_TUPLE, type FocusTarget } from './CameraRig'
import { CityWorld } from './CityWorld'
import { Hero } from '../components/Hero'
import { SKY } from './lib/cityTheme'
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

// Slowly drifting ambient particles — like golden dust in the air
function AmbientParticles() {
  const ref = useRef<THREE.Points>(null)
  const count = 280

  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 200
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
        color="#ffcc66"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export function Scene({ appearance, layers, view, focus, cameraCmd, onSelect, onSelectLandmark }: SceneProps) {
  const [docked, setDocked] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setDocked(true), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#c9a87c] animate-[worldFadeIn_1200ms_100ms_both]">
      <Canvas
        className="scene-canvas"
        shadows
        dpr={[1, 2]}
        camera={{ position: DEFAULT_CAMERA_TUPLE, fov: 40, near: 0.5, far: 2000 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        {/* Warm sunset sky */}
        <Sky
          sunPosition={[80, 12, -60]}
          turbidity={8}
          rayleigh={3}
          mieCoefficient={0.008}
          mieDirectionalG={0.82}
          inclination={0.52}
          azimuth={0.25}
        />

        <Stars radius={160} depth={40} count={800} factor={3} saturation={0.6} fade speed={0.4} />

        {/* Fog matches warm sky horizon */}
        <fog attach="fog" args={[SKY, 180, 420]} />

        {/* Warm golden-hour sun — strong directional from west/low angle */}
        <directionalLight
          position={[80, 55, -60]}
          intensity={3.8}
          color="#ffcc88"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={10}
          shadow-camera-far={380}
          shadow-camera-left={-130}
          shadow-camera-right={130}
          shadow-camera-top={130}
          shadow-camera-bottom={-130}
          shadow-bias={-0.0003}
        />

        {/* Cool blue-sky fill from above */}
        <hemisphereLight args={['#6699cc', '#7a5a3a', 1.2]} />

        {/* Subtle warm ambient fill */}
        <ambientLight intensity={0.4} color="#ffd4a0" />

        {/* A few warm point lights scattered through the city — street glow */}
        <pointLight position={[0, 18, 0]}   color="#ffaa44" intensity={60}  distance={80}  decay={2} />
        <pointLight position={[40, 14, 30]}  color="#ff8844" intensity={40}  distance={60}  decay={2} />
        <pointLight position={[-40, 14, -30]} color="#ffcc66" intensity={40} distance={60}  decay={2} />
        <pointLight position={[30, 14, -40]}  color="#44aaff" intensity={30} distance={50}  decay={2} />
        <pointLight position={[-30, 14, 40]}  color="#ff6644" intensity={30} distance={50}  decay={2} />

        <Suspense fallback={null}>
          <CityWorld
            appearance={appearance}
            layers={layers}
            view={view}
            onSelect={onSelect}
            onSelectLandmark={onSelectLandmark}
          />
          <AmbientParticles />
        </Suspense>

        <CameraRig focus={focus} cmd={cameraCmd} view={view} />

        {/* Bloom post-processing — makes windows and bright surfaces glow */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.75}
            luminanceSmoothing={0.85}
            intensity={0.6}
            height={400}
          />
        </EffectComposer>
      </Canvas>

      <Loader />
      <Hero docked={docked} />
      <Hint />
    </div>
  )
}

function Hint() {
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-[15] flex -translate-x-1/2 items-center gap-[7px] whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-white/60">
      <span
        className="h-[5px] w-[5px] rounded-full bg-white/60"
        style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
      />
      Drag to pan · Scroll to zoom · Right-drag to orbit · Click a building
    </div>
  )
}

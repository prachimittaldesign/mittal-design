import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AmbientLight, Color, DirectionalLight, Fog, HemisphereLight } from 'three'
import { easing } from 'maath'
import { Rain } from './Rain'
import type { Weather } from '../lib/weather'
import type { ViewMode } from '../types'

// Fixed deep-blue coastal-dusk palette, applied in every view so the city
// always reads as a warm-lit Amalfi-style town against a blue sea and sky. The
// fog colour matches the sky so the surrounding sea melts into the horizon.
const DUSK_SKY = new Color('#1d3a66')
const DUSK_HEMI_SKY = new Color('#2c4d7e')
const DUSK_HEMI_GROUND = new Color('#16243a')
const DUSK_DIR = new Color('#ffd9a0')

// Owns the scene lights, background, and fog, easing them toward the coastal
// dusk profile every frame. Only the fog distances differ per camera framing.
export function DayNight({ weather, view }: { weather: Weather | null; view: ViewMode }) {
  const scene = useThree((s) => s.scene)
  const hemi = useRef<HemisphereLight>(null)
  const amb = useRef<AmbientLight>(null)
  const dir = useRef<DirectionalLight>(null)

  useEffect(() => {
    if (!(scene.background instanceof Color)) scene.background = new Color(DUSK_SKY)
    if (!scene.fog) scene.fog = new Fog(DUSK_SKY.getHex(), 380, 1500)
  }, [scene])

  useFrame((_, dt) => {
    // Per-camera fog distances: keep the town crisp while the far sea fades into
    // the dusk-blue horizon. The low skyline camera needs the nearest pull-in;
    // the high 2D aerial the farthest.
    const fogNear = view === 'iso' ? 480 : view === 'skyline' ? 300 : 360
    const fogFar = view === 'skyline' ? 1400 : 1500

    if (scene.background instanceof Color) easing.dampC(scene.background, DUSK_SKY, 0.6, dt)
    const fog = scene.fog
    if (fog instanceof Fog) {
      easing.dampC(fog.color, DUSK_SKY, 0.6, dt)
      easing.damp(fog, 'near', fogNear, 0.6, dt)
      easing.damp(fog, 'far', fogFar, 0.6, dt)
    }
    if (hemi.current) {
      easing.dampC(hemi.current.color, DUSK_HEMI_SKY, 0.6, dt)
      easing.dampC(hemi.current.groundColor, DUSK_HEMI_GROUND, 0.6, dt)
      easing.damp(hemi.current, 'intensity', 0.6, 0.6, dt)
    }
    if (amb.current) easing.damp(amb.current, 'intensity', 0.32, 0.6, dt)
    if (dir.current) {
      easing.dampC(dir.current.color, DUSK_DIR, 0.6, dt)
      easing.damp(dir.current, 'intensity', 0.6, 0.6, dt)
    }
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={['#2c4d7e', '#16243a', 0.6]} />
      <ambientLight ref={amb} intensity={0.32} />
      <directionalLight
        ref={dir}
        position={[105, 150, 75]}
        intensity={0.6}
        color="#ffd9a0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={360}
        shadow-camera-left={-130}
        shadow-camera-right={130}
        shadow-camera-top={130}
        shadow-camera-bottom={-130}
        // normalBias offsets the shadow lookup along the surface normal — the
        // correct cure for the diagonal "acne" shimmer the coarse shadow map
        // was raking across the near-flat ground / pave overlays.
        shadow-bias={-0.0004}
        shadow-normalBias={0.12}
      />
      {weather?.rain && view === '3d' && <Rain />}
    </>
  )
}

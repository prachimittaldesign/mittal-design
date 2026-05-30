import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AmbientLight, Color, DirectionalLight, Fog, HemisphereLight } from 'three'
import { easing } from 'maath'
import { getHyderabadTime, skyProfile } from '../lib/sky'
import { SKY } from './lib/cityTheme'
import { Rain } from './Rain'
import type { Weather } from '../lib/weather'
import type { ViewMode } from '../types'

// Owns the scene lights, background, and fog, easing them toward the time-of-day
// + weather profile every frame. No sun mesh — just the ambient/key light shift.
export function DayNight({ weather, view }: { weather: Weather | null; view: ViewMode }) {
  const scene = useThree((s) => s.scene)
  const hemi = useRef<HemisphereLight>(null)
  const amb = useRef<AmbientLight>(null)
  const dir = useRef<DirectionalLight>(null)

  useEffect(() => {
    if (!(scene.background instanceof Color)) scene.background = new Color(SKY)
    // Pull fog in slightly so the grass field fades gracefully before the hard horizon
    if (!scene.fog) scene.fog = new Fog(SKY, 300, 620)
  }, [scene])

  useFrame((_, dt) => {
    const p = skyProfile(getHyderabadTime().frac, weather)
    if (scene.background instanceof Color) easing.dampC(scene.background, p.background, 0.6, dt)
    const fog = scene.fog
    if (fog instanceof Fog) {
      easing.dampC(fog.color, p.fog, 0.6, dt)
      // In top-down 2D mode the camera is ~320 units above the ground, so the
      // normal fog values would haze the entire city. Push them way out so the
      // overhead map reads sharp and clear.
      const fogNear = view === 'iso' ? 600 : p.fogNear
      const fogFar  = view === 'iso' ? 900 : p.fogFar
      easing.damp(fog, 'near', fogNear, 0.6, dt)
      easing.damp(fog, 'far',  fogFar,  0.6, dt)
    }
    if (hemi.current) {
      easing.dampC(hemi.current.color, p.hemiSky, 0.6, dt)
      easing.dampC(hemi.current.groundColor, p.hemiGround, 0.6, dt)
      easing.damp(hemi.current, 'intensity', p.hemiIntensity, 0.6, dt)
    }
    if (amb.current) easing.damp(amb.current, 'intensity', p.ambient, 0.6, dt)
    if (dir.current) {
      easing.dampC(dir.current.color, p.dirColor, 0.6, dt)
      easing.damp(dir.current, 'intensity', p.dirIntensity, 0.6, dt)
    }
  })

  return (
    <>
      <hemisphereLight ref={hemi} args={[SKY, '#cdbfa6', 0.85]} />
      <ambientLight ref={amb} intensity={0.35} />
      <directionalLight
        ref={dir}
        position={[105, 150, 75]}
        intensity={1.15}
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
        // was raking across the near-flat ground / pave overlays. Tightening the
        // frustum to ±90 (the city footprint) also shrinks each shadow texel.
        shadow-bias={-0.0004}
        shadow-normalBias={0.12}
      />
      {weather?.rain && view === '3d' && <Rain />}
    </>
  )
}

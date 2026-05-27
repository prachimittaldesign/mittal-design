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
    if (!scene.fog) scene.fog = new Fog(SKY, 140, 380)
  }, [scene])

  useFrame((_, dt) => {
    const p = skyProfile(getHyderabadTime().frac, weather)
    if (scene.background instanceof Color) easing.dampC(scene.background, p.background, 0.6, dt)
    const fog = scene.fog
    if (fog instanceof Fog) {
      easing.dampC(fog.color, p.fog, 0.6, dt)
      easing.damp(fog, 'near', p.fogNear, 0.6, dt)
      easing.damp(fog, 'far', p.fogFar, 0.6, dt)
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
        position={[70, 110, 50]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={10}
        shadow-camera-far={360}
        shadow-camera-left={-110}
        shadow-camera-right={110}
        shadow-camera-top={110}
        shadow-camera-bottom={-110}
        shadow-bias={-0.0004}
      />
      {weather?.rain && view === '3d' && <Rain />}
    </>
  )
}

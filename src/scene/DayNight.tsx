import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AmbientLight, Color, DirectionalLight, Fog, HemisphereLight } from 'three'
import { easing } from 'maath'
import { getHyderabadTime, skyProfile } from '../lib/sky'
import { SKY } from './lib/cityTheme'
import { Rain } from './Rain'
import type { Weather } from '../lib/weather'
import type { ViewMode } from '../types'

// Fixed deep-blue dusk palette for the 2D coastal view — applied regardless of
// Hyderabad time so the city always reads as a warm-lit town against a blue sea
// and sky. The fog colour matches the sky so the sea melts into the horizon.
const DUSK_SKY = new Color('#1d3a66')
const DUSK_HEMI_SKY = new Color('#2c4d7e')
const DUSK_HEMI_GROUND = new Color('#16243a')
const DUSK_DIR = new Color('#ffd9a0')

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
    const coast = view === 'iso'

    if (scene.background instanceof Color) {
      easing.dampC(scene.background, coast ? DUSK_SKY : p.background, 0.6, dt)
    }
    const fog = scene.fog
    if (fog instanceof Fog) {
      easing.dampC(fog.color, coast ? DUSK_SKY : p.fog, 0.6, dt)
      // Coastal 2D: fog colour = sky colour and far≈1500, so the sea dissolves
      //   seamlessly into the dusk horizon while the city (≤~110 u) stays crisp.
      // skyline: camera pulls back to ~360 u on mobile; push fog out so the
      //   far enterprise buildings stay visible.
      const fogNear = coast ? 480 : view === 'skyline' ? 450 : p.fogNear
      const fogFar  = coast ? 1500 : view === 'skyline' ? 750 : p.fogFar
      easing.damp(fog, 'near', fogNear, 0.6, dt)
      easing.damp(fog, 'far',  fogFar,  0.6, dt)
    }
    if (hemi.current) {
      easing.dampC(hemi.current.color, coast ? DUSK_HEMI_SKY : p.hemiSky, 0.6, dt)
      easing.dampC(hemi.current.groundColor, coast ? DUSK_HEMI_GROUND : p.hemiGround, 0.6, dt)
      easing.damp(hemi.current, 'intensity', coast ? 0.55 : p.hemiIntensity, 0.6, dt)
    }
    if (amb.current) easing.damp(amb.current, 'intensity', coast ? 0.3 : p.ambient, 0.6, dt)
    if (dir.current) {
      easing.dampC(dir.current.color, coast ? DUSK_DIR : p.dirColor, 0.6, dt)
      easing.damp(dir.current, 'intensity', coast ? 0.55 : p.dirIntensity, 0.6, dt)
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

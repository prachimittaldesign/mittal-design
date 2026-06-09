/**
 * DayNight — drives the Hyderabad local-time sky cycle while keeping coastal
 * fog distances large enough for the sea to dissolve into the horizon.
 * skyProfile() provides the 24h colour/lighting keyframes; fog near/far are
 * overridden here to the coastal scale regardless of weather.
 */

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AmbientLight, Color, DirectionalLight, Fog, HemisphereLight } from 'three'
import { easing } from 'maath'
import { Rain } from './Rain'
import { getHyderabadTime, skyProfile, nightFactor } from '../lib/sky'
import type { Weather } from '../lib/weather'
import type { ViewMode } from '../types'

export function DayNight({ weather, view }: { weather: Weather | null; view: ViewMode }) {
  const scene = useThree((s) => s.scene)
  const hemi = useRef<HemisphereLight>(null)
  const amb = useRef<AmbientLight>(null)
  const dir = useRef<DirectionalLight>(null)

  useEffect(() => {
    const p = skyProfile(getHyderabadTime().frac, weather)
    if (!(scene.background instanceof Color)) scene.background = new Color().copy(p.background)
    if (!scene.fog) scene.fog = new Fog(p.fog.getHex(), 380, 1500)
  }, [scene, weather])

  useFrame((_, dt) => {
    const p = skyProfile(getHyderabadTime().frac, weather)
    const nf = nightFactor() // 0 = full day, 1 = full night

    // Clear Amalfi daytime: push fog far out so buildings read crisp and vivid.
    // Rain/storm: override dramatically — city dissolves into grey mist.
    const baseFogNear = view === 'iso' ? 480 : view === 'skyline' ? 300 : 360
    const baseFogFar  = view === 'skyline' ? 1400 : 1500
    let fogNear: number
    let fogFar:  number
    if (weather?.rain) {
      // Heavy rain: fog clamps within the city block so buildings fade at distance
      fogNear = weather.condition === 'storm' ? 60  : 80
      fogFar  = weather.condition === 'storm' ? 220 : 300
    } else {
      fogNear = baseFogNear + (1 - nf) * 700   // up to 1060 in clear day
      fogFar  = baseFogFar  + (1 - nf) * 2000  // up to 3500 in clear day
    }

    if (scene.background instanceof Color) easing.dampC(scene.background, p.background, 0.6, dt)
    const fog = scene.fog
    if (fog instanceof Fog) {
      easing.dampC(fog.color, p.fog, 0.6, dt)
      easing.damp(fog, 'near', fogNear, 0.6, dt)
      easing.damp(fog, 'far', fogFar, 0.6, dt)
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
        shadow-bias={-0.0004}
        shadow-normalBias={0.12}
      />
      {weather?.rain && view === '3d' && <Rain />}
    </>
  )
}

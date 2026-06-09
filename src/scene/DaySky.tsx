/**
 * DaySky — physically-based sky + cumulus clouds.
 * Weather-aware: during rain/storm the clear-sky shader is suppressed so the
 * dark grey scene.background shows through.  Clouds shift from bright white
 * toward dark pewter to match the overcast.
 */

import { useMemo } from 'react'
import { Sky, Clouds, Cloud } from '@react-three/drei'
import { getHyderabadTime, nightFactor } from '../lib/sky'
import type { Weather } from '../lib/weather'

// Multi-lobe cumulus puff sprite — 18 overlapping lobes produce the
// cauliflower silhouette of a real cloud puff. Canvas-generated so it
// never depends on an external CDN.
function makeCloudTexture(): string {
  if (typeof document === 'undefined') return ''
  const N = 256
  const c = document.createElement('canvas')
  c.width = c.height = N
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, N, N)

  const lobes: [number, number, number, number][] = [
    [128, 185,  72, 0.82], [ 76, 175,  52, 0.78], [180, 175,  52, 0.78],
    [ 44, 162,  36, 0.70], [213, 162,  36, 0.70],
    [128, 138,  60, 0.86], [ 88, 130,  48, 0.82], [170, 130,  48, 0.82],
    [ 58, 148,  36, 0.74], [200, 148,  36, 0.74],
    [128,  92,  50, 0.84], [ 96, 100,  40, 0.80], [162, 100,  40, 0.80],
    [ 72, 116,  30, 0.72], [186, 116,  30, 0.72],
    [128,  52,  36, 0.76], [106,  66,  28, 0.70], [152,  66,  28, 0.70],
  ]

  for (const [x, y, r, a] of lobes) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0,    `rgba(255,255,255,${a})`)
    g.addColorStop(0.45, `rgba(255,255,255,${(a * 0.65).toFixed(2)})`)
    g.addColorStop(1,    'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  // Subtle base shadow for volume/depth.
  const shadow = ctx.createLinearGradient(0, 150, 0, N)
  shadow.addColorStop(0, 'rgba(170,185,210,0)')
  shadow.addColorStop(1, 'rgba(150,168,200,0.22)')
  ctx.fillStyle = shadow
  ctx.fillRect(0, 0, N, N)

  return c.toDataURL()
}

function sunPos(frac: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, (frac - 6) / 12))
  const elev = Math.max(0.08, Math.sin(t * Math.PI))
  const azi  = 1 - 2 * t
  return [azi * 80, elev * 120, 100]
}

export function DaySky({ weather }: { weather?: Weather | null }) {
  const cloudTex = useMemo(makeCloudTexture, [])
  const nf = nightFactor()
  if (nf > 0.95) return null

  const { frac } = getHyderabadTime()
  const pos      = sunPos(frac)
  const turbidity = 7 + nf * 4

  const isRain  = weather?.condition === 'rain'  || weather?.condition === 'storm'
  const isCloud = weather?.condition === 'cloudy' || weather?.condition === 'fog'

  // Cloud tint: white in clear sky → dark pewter in storms
  const cloudNear = isRain  ? '#424e58' : isCloud ? '#9aabb8' : '#f8f8ff'
  const cloudMid  = isRain  ? '#3c4850' : isCloud ? '#8a9caa' : '#f4f6ff'
  const cloudFar  = isRain  ? '#363e46' : isCloud ? '#7c8e9a' : '#eef2ff'
  const cloudOpa  = isRain  ? 0.98      : 0.90
  const cloudSpd  = isRain  ? 0.28      : 0.12   // faster in wind

  return (
    <>
      {/* Clear-sky Preetham shader — hidden during rain/storm so the dark
          scene.background (set by skyProfile) shows through as overcast sky. */}
      {!isRain && (
        <Sky
          distance={45000}
          sunPosition={pos}
          turbidity={isCloud ? turbidity + 4 : turbidity}
          rayleigh={isCloud ? 0.8 : 1.5}
          mieCoefficient={0.003}
          mieDirectionalG={0.75}
        />
      )}

      {nf < 0.5 && (
        <Clouds texture={cloudTex} limit={700}>
          {/* Ring 1 — close overhead, maximum sky coverage */}
          <Cloud position={[ 40,  300,   60]} seed={1}  segments={28} bounds={[160,32,160]} volume={22} color={cloudNear} opacity={cloudOpa}      speed={cloudSpd}        fade={150} />
          <Cloud position={[-60,  280,  -80]} seed={11} segments={24} bounds={[140,28,140]} volume={20} color={cloudNear} opacity={cloudOpa-0.02}  speed={cloudSpd*0.9}    fade={150} />
          <Cloud position={[180,  260,  180]} seed={12} segments={22} bounds={[120,26, 90]} volume={19} color={cloudNear} opacity={cloudOpa-0.04}  speed={cloudSpd*1.08}   fade={150} />
          <Cloud position={[-160, 270,  160]} seed={13} segments={22} bounds={[110,26, 80]} volume={18} color={cloudNear} opacity={cloudOpa-0.06}  speed={cloudSpd*0.92}   fade={150} />
          {/* Ring 2 — mid-distance, all azimuths */}
          <Cloud position={[ 340, 200,  240]} seed={2}  segments={22} bounds={[130,28, 90]} volume={20} color={cloudMid}  opacity={cloudOpa-0.06}  speed={cloudSpd*1.16}   fade={150} />
          <Cloud position={[-320, 210,  220]} seed={3}  segments={20} bounds={[120,26, 80]} volume={18} color={cloudMid}  opacity={cloudOpa-0.08}  speed={cloudSpd*0.92}   fade={150} />
          <Cloud position={[ 300, 175, -480]} seed={4}  segments={22} bounds={[130,26, 80]} volume={20} color={cloudMid}  opacity={cloudOpa-0.06}  speed={cloudSpd*1.08}   fade={150} />
          <Cloud position={[-300, 185, -440]} seed={5}  segments={20} bounds={[110,24, 70]} volume={18} color={cloudMid}  opacity={cloudOpa-0.10}  speed={cloudSpd}        fade={150} />
          <Cloud position={[ 120, 230,  520]} seed={6}  segments={22} bounds={[130,28, 80]} volume={20} color={cloudMid}  opacity={cloudOpa-0.06}  speed={cloudSpd*1.24}   fade={150} />
          <Cloud position={[-140, 240, -560]} seed={7}  segments={20} bounds={[120,26, 76]} volume={18} color={cloudMid}  opacity={cloudOpa-0.10}  speed={cloudSpd}        fade={150} />
          <Cloud position={[ 480, 160,   40]} seed={8}  segments={20} bounds={[120,24, 90]} volume={17} color={cloudMid}  opacity={cloudOpa-0.12}  speed={cloudSpd*0.75}   fade={150} />
          <Cloud position={[-470, 165,  -40]} seed={9}  segments={20} bounds={[120,24, 90]} volume={17} color={cloudMid}  opacity={cloudOpa-0.12}  speed={cloudSpd*0.83}   fade={150} />
          {/* Ring 3 — horizon wrap for glass-facade reflections */}
          <Cloud position={[ 220, 140,  380]} seed={21} segments={18} bounds={[100,22, 70]} volume={15} color={cloudFar}  opacity={cloudOpa-0.16}  speed={cloudSpd*0.92}   fade={150} />
          <Cloud position={[-240, 145,  360]} seed={22} segments={18} bounds={[ 95,20, 65]} volume={14} color={cloudFar}  opacity={cloudOpa-0.18}  speed={cloudSpd*0.83}   fade={150} />
          <Cloud position={[ 380, 150, -220]} seed={23} segments={18} bounds={[100,22, 70]} volume={15} color={cloudFar}  opacity={cloudOpa-0.16}  speed={cloudSpd*1.0}    fade={150} />
          <Cloud position={[-360, 155, -200]} seed={24} segments={18} bounds={[ 95,20, 65]} volume={14} color={cloudFar}  opacity={cloudOpa-0.18}  speed={cloudSpd*0.75}   fade={150} />
          <Cloud position={[   0, 130,  440]} seed={25} segments={18} bounds={[110,20, 60]} volume={15} color={cloudFar}  opacity={cloudOpa-0.16}  speed={cloudSpd*1.08}   fade={150} />
          <Cloud position={[   0, 135, -480]} seed={26} segments={18} bounds={[110,20, 60]} volume={15} color={cloudFar}  opacity={cloudOpa-0.16}  speed={cloudSpd*0.92}   fade={150} />
        </Clouds>
      )}
    </>
  )
}

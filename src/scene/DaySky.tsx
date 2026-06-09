/**
 * DaySky — physically-based atmospheric sky and fluffy Mediterranean clouds
 * during Hyderabad daytime.
 *
 * Sun is placed in the +Z direction (south / behind the city camera) so it
 * stays out of the main view frustum — the camera looks toward −Z (The Future)
 * and sees clear cerulean sky, not a blown-out sun disk.
 * turbidity 7-9 gives the realistic hazy-blue Mediterranean look without
 * overexposing the scene.
 */

import { useMemo } from 'react'
import { Sky, Clouds, Cloud } from '@react-three/drei'
import { getHyderabadTime, nightFactor } from '../lib/sky'

// Realistic cumulus puff sprite — multiple overlapping lobes create the
// cauliflower silhouette of a real cloud puff.  Each <Cloud> segments= instance
// renders one of these sprites; many overlapping sprites → a full cloud bank.
// Canvas-generated so it never depends on an external CDN.
function makeCloudTexture(): string {
  if (typeof document === 'undefined') return ''
  const N = 256
  const c = document.createElement('canvas')
  c.width = c.height = N
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, N, N)

  // Puffs arranged as a cumulus cloud: broad base that tapers to rounded top.
  // Each entry is [cx, cy, radius, peakAlpha].
  const lobes: [number, number, number, number][] = [
    // ── base tier — widest, densest
    [128, 185,  72, 0.82],
    [ 76, 175,  52, 0.78],
    [180, 175,  52, 0.78],
    [ 44, 162,  36, 0.70],
    [213, 162,  36, 0.70],
    // ── mid tier
    [128, 138,  60, 0.86],
    [ 88, 130,  48, 0.82],
    [170, 130,  48, 0.82],
    [ 58, 148,  36, 0.74],
    [200, 148,  36, 0.74],
    // ── upper tier — smaller, cauliflower bumps
    [128,  92,  50, 0.84],
    [ 96,  100, 40, 0.80],
    [162,  100, 40, 0.80],
    [ 72,  116, 30, 0.72],
    [186,  116, 30, 0.72],
    // ── top knobs
    [128,  52,  36, 0.76],
    [106,  66,  28, 0.70],
    [152,  66,  28, 0.70],
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

  // Subtle blue-grey shadow at the base — gives the cloud volumetric depth.
  const shadow = ctx.createLinearGradient(0, 150, 0, N)
  shadow.addColorStop(0, 'rgba(170,185,210,0)')
  shadow.addColorStop(1, 'rgba(150,168,200,0.22)')
  ctx.fillStyle = shadow
  ctx.fillRect(0, 0, N, N)

  return c.toDataURL()
}

// Sun sweeps east (+X) at sunrise → south (+Z, behind camera) at noon → west (−X) at sunset.
// Keeping Z positive ensures the sun disk stays behind the camera when looking at the city.
function sunPos(frac: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, (frac - 6) / 12)) // 0=sunrise, 0.5=noon, 1=sunset
  const elev = Math.max(0.08, Math.sin(t * Math.PI))   // arc: 0→1→0
  const azi = 1 - 2 * t                                 // +1 east → 0 south → −1 west
  // +Z keeps sun behind the camera (camera looks −Z toward The Future)
  return [azi * 80, elev * 120, 100]
}

export function DaySky() {
  const cloudTex = useMemo(makeCloudTexture, [])
  const nf = nightFactor() // 0=full day, 1=full night
  if (nf > 0.95) return null

  const { frac } = getHyderabadTime()
  const pos = sunPos(frac)

  // turbidity 7-9: realistic Mediterranean sky — saturated light blue,
  // not the harsh overexposed look of very low turbidity.
  // Rises slightly at dusk for a warm golden-haze feel.
  const turbidity = 7 + nf * 4

  return (
    <>
      <Sky
        distance={45000}
        sunPosition={pos}
        turbidity={turbidity}
        rayleigh={1.5}
        mieCoefficient={0.003}
        mieDirectionalG={0.75}
      />

      {/* Plenty of soft white clouds spread across the whole dome — front (+Z),
          back (−Z), sides, overhead AND down near the horizon — so the glass
          facades are full of drifting cloud reflections from any camera angle. */}
      {nf < 0.5 && (
        <Clouds texture={cloudTex} limit={700}>
          {/* Ring 1 — close overhead cumulus — dense segments, tighter volume so
              puffs overlap and merge into solid cloud masses */}
          <Cloud position={[ 40,  300,   60]} seed={1}  segments={28} bounds={[160, 32, 160]} volume={22} opacity={0.90} speed={0.12} fade={150} color="#f8f8ff" />
          <Cloud position={[-60,  280,  -80]} seed={11} segments={24} bounds={[140, 28, 140]} volume={20} opacity={0.88} speed={0.10} fade={150} color="#f8f8ff" />
          <Cloud position={[180,  260,  180]} seed={12} segments={22} bounds={[120, 26,  90]} volume={19} opacity={0.86} speed={0.13} fade={150} color="#f8f8ff" />
          <Cloud position={[-160, 270,  160]} seed={13} segments={22} bounds={[110, 26,  80]} volume={18} opacity={0.84} speed={0.11} fade={150} color="#f8f8ff" />
          {/* Ring 2 — mid-distance, all azimuths */}
          <Cloud position={[ 340, 200,  240]} seed={2}  segments={22} bounds={[130, 28,  90]} volume={20} opacity={0.84} speed={0.14} fade={150} color="#f4f6ff" />
          <Cloud position={[-320, 210,  220]} seed={3}  segments={20} bounds={[120, 26,  80]} volume={18} opacity={0.82} speed={0.11} fade={150} color="#f4f6ff" />
          <Cloud position={[ 300, 175, -480]} seed={4}  segments={22} bounds={[130, 26,  80]} volume={20} opacity={0.84} speed={0.13} fade={150} color="#f4f6ff" />
          <Cloud position={[-300, 185, -440]} seed={5}  segments={20} bounds={[110, 24,  70]} volume={18} opacity={0.80} speed={0.10} fade={150} color="#f4f6ff" />
          <Cloud position={[ 120, 230,  520]} seed={6}  segments={22} bounds={[130, 28,  80]} volume={20} opacity={0.84} speed={0.15} fade={150} color="#f4f6ff" />
          <Cloud position={[-140, 240, -560]} seed={7}  segments={20} bounds={[120, 26,  76]} volume={18} opacity={0.80} speed={0.12} fade={150} color="#f4f6ff" />
          <Cloud position={[ 480, 160,   40]} seed={8}  segments={20} bounds={[120, 24,  90]} volume={17} opacity={0.78} speed={0.09} fade={150} color="#f0f4ff" />
          <Cloud position={[-470, 165,  -40]} seed={9}  segments={20} bounds={[120, 24,  90]} volume={17} opacity={0.78} speed={0.10} fade={150} color="#f0f4ff" />
          {/* Ring 3 — horizon wrap for glass-facade reflections */}
          <Cloud position={[ 220, 140,  380]} seed={21} segments={18} bounds={[100, 22,  70]} volume={15} opacity={0.74} speed={0.11} fade={150} color="#eef2ff" />
          <Cloud position={[-240, 145,  360]} seed={22} segments={18} bounds={[ 95, 20,  65]} volume={14} opacity={0.72} speed={0.10} fade={150} color="#eef2ff" />
          <Cloud position={[ 380, 150, -220]} seed={23} segments={18} bounds={[100, 22,  70]} volume={15} opacity={0.74} speed={0.12} fade={150} color="#eef2ff" />
          <Cloud position={[-360, 155, -200]} seed={24} segments={18} bounds={[ 95, 20,  65]} volume={14} opacity={0.72} speed={0.09} fade={150} color="#eef2ff" />
          <Cloud position={[   0, 130,  440]} seed={25} segments={18} bounds={[110, 20,  60]} volume={15} opacity={0.74} speed={0.13} fade={150} color="#eef2ff" />
          <Cloud position={[   0, 135, -480]} seed={26} segments={18} bounds={[110, 20,  60]} volume={15} opacity={0.74} speed={0.11} fade={150} color="#eef2ff" />
        </Clouds>
      )}
    </>
  )
}

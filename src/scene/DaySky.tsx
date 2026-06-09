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

// Self-contained soft cloud puff texture (radial alpha falloff), generated on a
// canvas as a data URL. drei's <Cloud> otherwise pulls its sprite from an
// external CDN (githack), which fails silently behind strict network policies —
// then no clouds render at all (and nothing to reflect). This guarantees they
// always appear.
function makeCloudTexture(): string {
  if (typeof document === 'undefined') return ''
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.85)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(64, 64, 64, 0, Math.PI * 2)
  ctx.fill()
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
        <Clouds texture={cloudTex} limit={400}>
          <Cloud position={[40, 300, 60]} seed={1} segments={18} bounds={[140, 34, 140]} volume={34} opacity={0.8} speed={0.12} fade={120} />
          <Cloud position={[340, 200, 240]} seed={2} segments={16} bounds={[120, 30, 80]} volume={30} opacity={0.78} speed={0.14} fade={120} />
          <Cloud position={[-320, 210, 220]} seed={3} segments={16} bounds={[110, 28, 76]} volume={28} opacity={0.75} speed={0.11} fade={120} />
          <Cloud position={[300, 175, -480]} seed={4} segments={16} bounds={[120, 30, 70]} volume={30} opacity={0.78} speed={0.13} fade={120} />
          <Cloud position={[-300, 185, -440]} seed={5} segments={14} bounds={[100, 28, 64]} volume={26} opacity={0.75} speed={0.1} fade={120} />
          <Cloud position={[120, 230, 520]} seed={6} segments={16} bounds={[120, 30, 76]} volume={30} opacity={0.78} speed={0.15} fade={120} />
          <Cloud position={[-140, 240, -560]} seed={7} segments={14} bounds={[110, 28, 70]} volume={28} opacity={0.75} speed={0.12} fade={120} />
          <Cloud position={[480, 160, 40]} seed={8} segments={14} bounds={[110, 26, 80]} volume={26} opacity={0.72} speed={0.09} fade={120} />
          <Cloud position={[-470, 165, -40]} seed={9} segments={14} bounds={[110, 26, 80]} volume={26} opacity={0.72} speed={0.1} fade={120} />
        </Clouds>
      )}
    </>
  )
}

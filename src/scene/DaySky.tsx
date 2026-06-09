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

import { Sky, Clouds, Cloud } from '@react-three/drei'
import { getHyderabadTime, nightFactor } from '../lib/sky'

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

      {/* Soft white Mediterranean clouds — mid-sky, off to the sides */}
      {nf < 0.5 && (
        <Clouds>
          <Cloud
            position={[260, 220, -560]}
            seed={1}
            segments={14}
            bounds={[100, 30, 60]}
            volume={24}
            opacity={0.55}
            speed={0.14}
            fade={50}
          />
          <Cloud
            position={[-200, 250, -480]}
            seed={2}
            segments={12}
            bounds={[80, 24, 48]}
            volume={20}
            opacity={0.50}
            speed={0.11}
            fade={45}
          />
          <Cloud
            position={[80, 240, -720]}
            seed={3}
            segments={10}
            bounds={[90, 26, 54]}
            volume={22}
            opacity={0.45}
            speed={0.17}
            fade={50}
          />
          <Cloud
            position={[-340, 230, -560]}
            seed={4}
            segments={10}
            bounds={[70, 20, 42]}
            volume={16}
            opacity={0.40}
            speed={0.09}
            fade={40}
          />
        </Clouds>
      )}
    </>
  )
}

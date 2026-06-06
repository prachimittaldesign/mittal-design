/**
 * DaySky — physically-based atmospheric sky and fluffy Mediterranean clouds
 * during Hyderabad daytime. The drei <Sky> shader renders proper Rayleigh
 * scattering (deep cerulean zenith, lighter horizon) driven by a sun position
 * that sweeps east→noon→west over the 12-hour day. At night this component
 * returns null and DayNight's solid dark background takes over.
 */

import { Sky, Clouds, Cloud } from '@react-three/drei'
import { getHyderabadTime, nightFactor } from '../lib/sky'

// Map the current hour to a sun position vector.
// Hyderabad sunrise ≈ 6 h (east, +X), solar noon ≈ 12 h (high, +Y), sunset ≈ 18 h (west, −X).
function sunPos(frac: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, (frac - 6) / 12)) // 0 at sunrise, 1 at sunset
  const elev = Math.max(0.05, Math.sin(t * Math.PI))   // 0→1→0 arc across the sky
  const azi = 1 - 2 * t                                 // +1 east → 0 south → −1 west
  return [azi * 100, elev * 100, -30]
}

export function DaySky() {
  const nf = nightFactor() // 0 = full day, 1 = full night
  if (nf > 0.95) return null

  const { frac } = getHyderabadTime()
  const pos = sunPos(frac)

  // Amalfi coast has exceptionally clear Mediterranean air.
  // turbidity 2 = crystal clear; rises toward dusk for warm haze.
  const turbidity = 2 + nf * 8

  return (
    <>
      <Sky
        distance={45000}
        sunPosition={pos}
        turbidity={turbidity}
        rayleigh={2}
        mieCoefficient={0.004}
        mieDirectionalG={0.85}
      />

      {/* Fluffy white clouds — only visible well into daytime, not at dusk */}
      {nf < 0.5 && (
        <Clouds>
          <Cloud
            position={[220, 210, -600]}
            seed={1}
            segments={16}
            bounds={[90, 28, 55]}
            volume={22}
            opacity={0.6}
            speed={0.15}
            fade={40}
          />
          <Cloud
            position={[-185, 255, -520]}
            seed={2}
            segments={12}
            bounds={[70, 22, 45]}
            volume={18}
            opacity={0.55}
            speed={0.12}
            fade={35}
          />
          <Cloud
            position={[55, 230, -760]}
            seed={3}
            segments={14}
            bounds={[80, 24, 52]}
            volume={20}
            opacity={0.50}
            speed={0.18}
            fade={40}
          />
        </Clouds>
      )}
    </>
  )
}

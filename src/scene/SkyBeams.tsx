/**
 * SkyBeam — a single, subtle searchlight shaft rising from the central monument
 * and leaning toward "The Future" (the −Z gateway). Additive, low-opacity light
 * that drifts gently, so it reads as a quiet beacon rather than a spectacle.
 * The beam is hidden during Hyderabad daytime and fades in at dusk.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Group } from 'three'
import { nightFactor } from '../lib/sky'

const BEAM_H = 150
const COLOR = '#cfe4ff'
// Base lean toward the future (−Z). Rotating −θ about X tilts the shaft so its
// top points into −Z while it climbs into the sky.
const LEAN = -0.42

export function SkyBeams() {
  const beamGroupRef = useRef<Group>(null)
  const shaftRef = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const nf = nightFactor()

    // Hide entirely during daylight — no beam in Amalfi sunshine.
    if (beamGroupRef.current) beamGroupRef.current.visible = nf > 0.01

    if (shaftRef.current) {
      // Gentle drift around the future-ward lean — barely-there motion.
      shaftRef.current.rotation.x = LEAN + Math.sin(t * 0.25) * 0.05
      shaftRef.current.rotation.z = Math.sin(t * 0.18) * 0.04
    }
  })

  return (
    <group ref={beamGroupRef} position={[0, 12.5, 0]}>
      {/* faint emitter at the base */}
      <mesh>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color={COLOR} emissive={COLOR} emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {/* the shaft — pivots at the monument, leaning toward the future */}
      <group ref={shaftRef} rotation={[LEAN, 0, 0]}>
        <mesh position={[0, BEAM_H / 2, 0]}>
          {/* narrow at the base, softly flaring toward the sky */}
          <cylinderGeometry args={[4.2, 0.7, BEAM_H, 20, 1, true]} />
          <meshBasicMaterial
            color={COLOR}
            transparent
            opacity={0.05}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {/* a slightly brighter inner core */}
        <mesh position={[0, BEAM_H / 2, 0]}>
          <cylinderGeometry args={[1.3, 0.3, BEAM_H, 16, 1, true]} />
          <meshBasicMaterial
            color={COLOR}
            transparent
            opacity={0.07}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

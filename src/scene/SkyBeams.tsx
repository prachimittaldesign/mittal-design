/**
 * SkyBeams — searchlight shafts rising into the dusk sky (a "bat-signal" beam).
 * Each beam is a tall cone of additive, translucent light that slowly sweeps,
 * with a bright emitter at its base. Additive blending + bloom make them read
 * as real volumetric light against the deep-blue sky.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Group } from 'three'

interface BeamSpec {
  x: number
  z: number
  baseY: number
  color: string
  sway: number // max tilt in radians
  speed: number
  phase: number
}

const BEAMS: BeamSpec[] = [
  { x: 0, z: 0, baseY: 12, color: '#cfe4ff', sway: 0.32, speed: 0.5, phase: 0.0 },
  { x: 44, z: 44, baseY: 8, color: '#bfe0ff', sway: 0.4, speed: 0.4, phase: 1.6 },
  { x: -52, z: 38, baseY: 8, color: '#e7d6ff', sway: 0.36, speed: 0.55, phase: 3.1 },
  { x: 30, z: -58, baseY: 8, color: '#cfe4ff', sway: 0.42, speed: 0.45, phase: 4.7 },
]

const BEAM_H = 150

function Beam({ spec }: { spec: BeamSpec }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      // Sweep the beam around two axes so it traces a slow lissajous in the sky.
      ref.current.rotation.z = Math.sin(t * spec.speed + spec.phase) * spec.sway
      ref.current.rotation.x = Math.cos(t * spec.speed * 0.7 + spec.phase) * spec.sway * 0.6
    }
  })
  return (
    <group position={[spec.x, spec.baseY, spec.z]}>
      {/* bright emitter at the base */}
      <mesh>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color={spec.color} emissive={spec.color} emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* the swaying shaft — pivots at its base */}
      <group ref={ref}>
        <mesh position={[0, BEAM_H / 2, 0]}>
          {/* narrow at the base, flaring wide toward the sky */}
          <cylinderGeometry args={[7, 1.1, BEAM_H, 20, 1, true]} />
          <meshBasicMaterial
            color={spec.color}
            transparent
            opacity={0.12}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {/* a brighter inner core shaft */}
        <mesh position={[0, BEAM_H / 2, 0]}>
          <cylinderGeometry args={[2.6, 0.5, BEAM_H, 16, 1, true]} />
          <meshBasicMaterial
            color={spec.color}
            transparent
            opacity={0.16}
            blending={AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

export function SkyBeams() {
  const beams = useMemo(() => BEAMS, [])
  return (
    <group>
      {beams.map((spec, i) => (
        <Beam key={i} spec={spec} />
      ))}
    </group>
  )
}

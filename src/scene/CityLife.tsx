/**
 * CityLife — motion that makes the city feel inhabited:
 *   • Hot-air balloons drifting on lazy circular paths high above, gently
 *     bobbing, each with a glowing burner.
 *   • A festoon-light canopy strung from the central monument out to eight
 *     plaza poles — sagging strings of warm bulbs that twinkle after dark.
 *   • Pedestrians strolling the ring promenades (instanced, animated).
 *
 * Glowing parts use emissive + toneMapped:false so they bloom at night.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Group, InstancedMesh, Object3D } from 'three'

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Hot-air balloons ──────────────────────────────────────────────────────────
interface BalloonSpec {
  r: number
  y: number
  speed: number
  phase: number
  bob: number
  size: number
  top: string
  band: string
}

const BALLOONS: BalloonSpec[] = [
  { r: 70, y: 56, speed: 0.05, phase: 0.0, bob: 2.5, size: 1.0, top: '#e0594c', band: '#f2d06b' },
  { r: 95, y: 64, speed: 0.04, phase: 2.1, bob: 3.0, size: 1.25, top: '#5a86c9', band: '#e9e2cf' },
  { r: 58, y: 72, speed: 0.06, phase: 4.0, bob: 2.0, size: 0.85, top: '#6fae8a', band: '#e0594c' },
  { r: 110, y: 60, speed: 0.035, phase: 5.4, bob: 3.5, size: 1.1, top: '#c98a74', band: '#5a86c9' },
]

function Balloon({ spec }: { spec: BalloonSpec }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const a = spec.phase + t * spec.speed
    if (ref.current) {
      ref.current.position.set(
        Math.cos(a) * spec.r,
        spec.y + Math.sin(t * 0.5 + spec.phase) * spec.bob,
        Math.sin(a) * spec.r,
      )
      ref.current.rotation.y = a
    }
  })
  const s = spec.size
  return (
    <group ref={ref} scale={s}>
      {/* Envelope — sphere tapered to a point at the bottom */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color={spec.top} roughness={0.6} metalness={0.05} />
      </mesh>
      {/* Decorative band */}
      <mesh position={[0, -0.4, 0]} scale={[1.01, 0.34, 1.01]}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshStandardMaterial color={spec.band} roughness={0.6} />
      </mesh>
      {/* Tapered neck */}
      <mesh position={[0, -3.1, 0]}>
        <coneGeometry args={[1.6, 1.8, 12]} />
        <meshStandardMaterial color={spec.top} roughness={0.6} />
      </mesh>
      {/* Burner glow */}
      <mesh position={[0, -3.8, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* Basket */}
      <mesh position={[0, -4.7, 0]} castShadow>
        <boxGeometry args={[1.1, 1.0, 1.1]} />
        <meshStandardMaterial color="#7a5a32" roughness={0.95} />
      </mesh>
      {/* Suspension lines */}
      {[
        [-0.5, -0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
      ].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, -3.7, dz]}>
          <cylinderGeometry args={[0.03, 0.03, 2.0, 4]} />
          <meshStandardMaterial color="#3a3026" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

// Lightweight balloons rendered INTO the reflection environment map, so the
// glass facades mirror colourful balloons drifting through the sky. Just the
// envelope + band (no basket/lines) to keep the per-frame cube render cheap.
function EnvBalloon({ spec }: { spec: BalloonSpec }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const a = spec.phase + t * spec.speed
    if (ref.current) {
      ref.current.position.set(
        Math.cos(a) * spec.r,
        spec.y + Math.sin(t * 0.5 + spec.phase) * spec.bob,
        Math.sin(a) * spec.r,
      )
    }
  })
  return (
    <group ref={ref} scale={spec.size * 1.6}>
      <mesh>
        <sphereGeometry args={[3, 14, 14]} />
        <meshStandardMaterial color={spec.top} roughness={0.5} emissive={spec.top} emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0, -0.4, 0]} scale={[1.02, 0.34, 1.02]}>
        <sphereGeometry args={[3, 14, 14]} />
        <meshStandardMaterial color={spec.band} roughness={0.5} emissive={spec.band} emissiveIntensity={0.2} />
      </mesh>
    </group>
  )
}

export function EnvBalloons() {
  return (
    <group>
      {BALLOONS.map((spec, i) => (
        <EnvBalloon key={i} spec={spec} />
      ))}
    </group>
  )
}

// ─── Festoon-light canopy ────────────────────────────────────────────────────────
// Strings of warm bulbs from the monument tip out to eight plaza poles, each
// string sagging in a gentle catenary.
const POLE_COUNT = 8
const POLE_R = 24
const POLE_H = 6
const APEX: [number, number, number] = [0, 12.2, 0]
const BULBS_PER_STRING = 11

interface Bulb {
  x: number
  y: number
  z: number
}

function festoonBulbs(): Bulb[] {
  const bulbs: Bulb[] = []
  for (let p = 0; p < POLE_COUNT; p++) {
    const ang = ((22.5 + p * 45) * Math.PI) / 180 // between avenues + diagonals
    const tx = Math.cos(ang) * POLE_R
    const tz = Math.sin(ang) * POLE_R
    for (let b = 1; b < BULBS_PER_STRING; b++) {
      const t = b / BULBS_PER_STRING
      const sag = Math.sin(Math.PI * t) * 3.2
      bulbs.push({
        x: APEX[0] + (tx - APEX[0]) * t,
        y: APEX[1] + (POLE_H - APEX[1]) * t - sag,
        z: APEX[2] + (tz - APEX[2]) * t,
      })
    }
  }
  return bulbs
}

const BULB_WARM = '#ffd98a'

function Festoon() {
  const bulbs = useMemo(festoonBulbs, [])
  const poles = useMemo(
    () =>
      Array.from({ length: POLE_COUNT }, (_, p) => {
        const ang = ((22.5 + p * 45) * Math.PI) / 180
        return { x: Math.cos(ang) * POLE_R, z: Math.sin(ang) * POLE_R }
      }),
    [],
  )
  const ref = useRef<InstancedMesh>(null)
  const baseScale = useRef<number[]>([])

  useFrame((state) => {
    const m = ref.current
    if (!m) return
    const t = state.clock.elapsedTime
    const dummy = new Object3D()
    if (baseScale.current.length === 0) {
      baseScale.current = bulbs.map((_, i) => 0.85 + ((i * 37) % 30) / 100)
    }
    bulbs.forEach((b, i) => {
      const tw = 0.85 + 0.15 * Math.sin(t * 2 + i * 0.9)
      dummy.position.set(b.x, b.y, b.z)
      dummy.scale.setScalar(baseScale.current[i] * tw)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* Poles around the plaza */}
      {poles.map((p, i) => (
        <mesh key={i} position={[p.x, POLE_H / 2, p.z]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, POLE_H, 8]} />
          <meshStandardMaterial color="#4a4438" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}
      {/* Glowing bulbs */}
      <instancedMesh ref={ref} args={[undefined, undefined, bulbs.length]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color={BULB_WARM} emissive={BULB_WARM} emissiveIntensity={2.2} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}

// ─── Pedestrians ────────────────────────────────────────────────────────────────
// Small figures strolling the ring promenades. Instanced bodies + heads, with a
// walking bob, orbiting at a few radii in both directions.
const PED_COUNT = 56
const PED_COLORS = ['#c0654f', '#5a86c9', '#d89a4e', '#7ab870', '#b06090', '#cdcdd2', '#e0a0b0', '#6fae8a']

interface Ped {
  r: number
  ang: number
  speed: number
  bobPhase: number
}

function Pedestrians() {
  const peds = useMemo<Ped[]>(() => {
    const rnd = mulberry32(7012)
    const rings = [30, 60, 90]
    return Array.from({ length: PED_COUNT }, () => {
      const r = rings[Math.floor(rnd() * rings.length)] + (rnd() - 0.5) * 4
      return {
        r,
        ang: rnd() * Math.PI * 2,
        speed: (0.06 + rnd() * 0.05) * (rnd() > 0.5 ? 1 : -1),
        bobPhase: rnd() * Math.PI * 2,
      }
    })
  }, [])

  const bodyRef = useRef<InstancedMesh>(null)
  const headRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const colored = useRef(false)

  useFrame((state) => {
    const bm = bodyRef.current
    const hm = headRef.current
    if (!bm || !hm) return
    const t = state.clock.elapsedTime

    // Apply per-figure colours once, up front (setColorAt lazily allocates the
    // instanceColor buffer, so do it for every instance in one pass).
    if (!colored.current) {
      const color = new Color()
      peds.forEach((_, i) => {
        color.set(PED_COLORS[i % PED_COLORS.length])
        bm.setColorAt(i, color)
      })
      if (bm.instanceColor) bm.instanceColor.needsUpdate = true
      colored.current = true
    }

    peds.forEach((p, i) => {
      const a = p.ang + t * p.speed
      const x = Math.cos(a) * p.r
      const z = Math.sin(a) * p.r
      const bob = Math.abs(Math.sin(t * 4 + p.bobPhase)) * 0.12
      const heading = a + (p.speed > 0 ? Math.PI / 2 : -Math.PI / 2)

      dummy.position.set(x, 0.65 + bob, z)
      dummy.rotation.set(0, heading, 0)
      dummy.scale.set(1, 1, 1)
      dummy.updateMatrix()
      bm.setMatrixAt(i, dummy.matrix)

      dummy.position.set(x, 1.45 + bob, z)
      dummy.rotation.set(0, heading, 0)
      dummy.updateMatrix()
      hm.setMatrixAt(i, dummy.matrix)
    })
    bm.instanceMatrix.needsUpdate = true
    hm.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* Bodies — slim tapered torsos */}
      <instancedMesh ref={bodyRef} args={[undefined, undefined, PED_COUNT]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.2, 6]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      {/* Heads */}
      <instancedMesh ref={headRef} args={[undefined, undefined, PED_COUNT]} castShadow>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#d8b89a" roughness={0.85} />
      </instancedMesh>
    </group>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────
export function CityLife() {
  return (
    <group>
      {BALLOONS.map((spec, i) => (
        <Balloon key={i} spec={spec} />
      ))}
      <Festoon />
      <Pedestrians />
    </group>
  )
}

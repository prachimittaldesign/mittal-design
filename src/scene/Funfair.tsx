import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MeshStandardMaterial } from 'three'
import { nightFactor } from '../lib/sky'

// ── Ferris wheel ──────────────────────────────────────────────────────────────
// A slowly turning wheel on the beach headland — the city's funfair. The rim
// and spokes rotate; each gondola is positioned on the rim per-frame but kept
// upright (real gondolas swing free), and their lamps glow after dark.
const WHEEL_POS: [number, number, number] = [-96, 0, 136]
const WHEEL_R = 9
const GONDOLAS = 10
const GONDOLA_COLORS = ['#e8856a', '#5fa0aa', '#f0dca0', '#dfa6b0', '#8fd0c6']

export function FerrisWheel() {
  const rimRef = useRef<Group>(null)
  const carRefs = useRef<Array<Group | null>>([])
  const lampMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#fff0c0',
        emissive: '#ffcc66',
        emissiveIntensity: 0,
        toneMapped: false,
      }),
    [],
  )
  useEffect(() => () => lampMat.dispose(), [lampMat])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const angle = t * 0.14 // one revolution ≈ 45s — fairground pace
    if (rimRef.current) rimRef.current.rotation.z = angle
    for (let i = 0; i < GONDOLAS; i++) {
      const g = carRefs.current[i]
      if (!g) continue
      const a = angle + (i / GONDOLAS) * Math.PI * 2
      g.position.set(Math.cos(a) * WHEEL_R, WHEEL_R + 2.4 + Math.sin(a) * WHEEL_R, 0)
      g.rotation.z = Math.sin(t * 1.4 + i) * 0.06 // gentle free swing
    }
    // Lamps fade up with the night.
    lampMat.emissiveIntensity += (nightFactor() * 2.6 - lampMat.emissiveIntensity) * Math.min(1, dt * 3)
  })

  // Fairground rim bulbs — a ring of lights riding the wheel so it reads as a
  // lit ferris wheel from across the bay (the tiny gondola lamps alone vanish
  // at city distance). They share lampMat, so they fade with the night too.
  const RIM_BULBS = 20

  return (
    <group position={WHEEL_POS} rotation={[0, 0.5, 0]}>
      {/* A-frame legs */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 2.2, (WHEEL_R + 2.4) / 2, 0.9 * s]} rotation={[0, 0, s * 0.18]} castShadow>
          <cylinderGeometry args={[0.28, 0.42, WHEEL_R + 2.6, 6]} />
          <meshStandardMaterial color="#c95d54" roughness={0.8} />
        </mesh>
      ))}
      {/* axle */}
      <mesh position={[0, WHEEL_R + 2.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 2.4, 10]} />
        <meshStandardMaterial color="#8a8378" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* rotating rim + spokes */}
      <group ref={rimRef} position={[0, WHEEL_R + 2.4, 0]}>
        <mesh>
          <torusGeometry args={[WHEEL_R, 0.22, 10, 48]} />
          <meshStandardMaterial color="#e9e2cf" roughness={0.7} />
        </mesh>
        <mesh>
          <torusGeometry args={[WHEEL_R * 0.55, 0.14, 8, 36]} />
          <meshStandardMaterial color="#e9e2cf" roughness={0.7} />
        </mesh>
        {Array.from({ length: GONDOLAS }, (_, i) => {
          const a = (i / GONDOLAS) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * WHEEL_R * 0.5, Math.sin(a) * WHEEL_R * 0.5, 0]} rotation={[0, 0, a]}>
              <boxGeometry args={[WHEEL_R, 0.12, 0.12]} />
              <meshStandardMaterial color="#cfc5ae" roughness={0.8} />
            </mesh>
          )
        })}
        {/* ring of fairground bulbs around the rim — glow after dark */}
        {Array.from({ length: RIM_BULBS }, (_, i) => {
          const a = (i / RIM_BULBS) * Math.PI * 2
          return (
            <mesh key={`b${i}`} position={[Math.cos(a) * WHEEL_R, Math.sin(a) * WHEEL_R, 0.34]} material={lampMat}>
              <sphereGeometry args={[0.26, 6, 6]} />
            </mesh>
          )
        })}
        {/* hub lamp */}
        <mesh position={[0, 0, 1.3]} material={lampMat}>
          <sphereGeometry args={[0.4, 8, 8]} />
        </mesh>
      </group>

      {/* upright gondolas riding the rim */}
      {Array.from({ length: GONDOLAS }, (_, i) => (
        <group key={i} ref={(el) => (carRefs.current[i] = el)}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 1.1, 1.2]} />
            <meshStandardMaterial color={GONDOLA_COLORS[i % GONDOLA_COLORS.length]} roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <coneGeometry args={[0.95, 0.6, 4]} />
            <meshStandardMaterial color="#f6f1e4" roughness={0.85} />
          </mesh>
          {/* lamp under the roof — glows at night */}
          <mesh position={[0, 0.35, 0]} material={lampMat}>
            <sphereGeometry args={[0.2, 6, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Tram ──────────────────────────────────────────────────────────────────────
// A two-car tram circling the middle ring road (drawn as an exact circle at
// r=60, so the loop tracks the visible tarmac). Windows glow after dark.
const TRAM_R = 60
const CAR_GAP = 0.075 // radians between cars

export function Tram() {
  const carsRef = useRef<Array<Group | null>>([])
  const winMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#cfe4ee',
        emissive: '#ffd27a',
        emissiveIntensity: 0,
        toneMapped: false,
      }),
    [],
  )
  useEffect(() => () => winMat.dispose(), [winMat])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const base = t * 0.055 // ~115s per lap — an unhurried city loop
    for (let i = 0; i < 2; i++) {
      const g = carsRef.current[i]
      if (!g) continue
      const a = base - i * CAR_GAP
      g.position.set(Math.cos(a) * TRAM_R, 0.75, Math.sin(a) * TRAM_R)
      // orient the car along the circle's tangent
      g.rotation.y = -a - Math.PI / 2
    }
    winMat.emissiveIntensity += (nightFactor() * 1.6 - winMat.emissiveIntensity) * Math.min(1, dt * 3)
  })

  return (
    <group>
      {[0, 1].map((i) => (
        <group key={i} ref={(el) => (carsRef.current[i] = el)}>
          {/* body */}
          <mesh castShadow>
            <boxGeometry args={[4.4, 1.5, 1.7]} />
            <meshStandardMaterial color={i === 0 ? '#c95d54' : '#e9e2cf'} roughness={0.7} />
          </mesh>
          {/* window band */}
          <mesh position={[0, 0.25, 0]} material={winMat}>
            <boxGeometry args={[4.5, 0.55, 1.72]} />
          </mesh>
          {/* roof */}
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[4.2, 0.2, 1.5]} />
            <meshStandardMaterial color="#8a8378" roughness={0.8} />
          </mesh>
          {/* pantograph on the lead car */}
          {i === 0 && (
            <mesh position={[0.8, 1.25, 0]} rotation={[0, 0, 0.5]}>
              <cylinderGeometry args={[0.04, 0.04, 1.1, 4]} />
              <meshStandardMaterial color="#4a4438" roughness={1} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

// ── Shooting stars ────────────────────────────────────────────────────────────
// Occasional meteor streaks across the night sky. Each streak's path is
// re-seeded per cycle from its cycle index (deterministic — no Math.random in
// the frame loop), fades in/out over its brief life, and only exists at night.
function seeded(n: number): () => number {
  let s = (n * 2654435761) >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STREAKS = [
  { period: 9.5, seedBase: 11 },
  { period: 14.3, seedBase: 47 },
]

export function ShootingStars() {
  const refs = useRef<Array<Group | null>>([])
  const mats = useMemo(
    () =>
      STREAKS.map(
        () =>
          new MeshStandardMaterial({
            color: '#ffffff',
            emissive: '#eaf1ff',
            emissiveIntensity: 2.5,
            transparent: true,
            opacity: 0,
            toneMapped: false,
          }),
      ),
    [],
  )
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const nf = nightFactor()
    STREAKS.forEach((spec, i) => {
      const g = refs.current[i]
      const m = mats[i]
      if (!g || !m) return
      const cycle = Math.floor(t / spec.period)
      const p = (t % spec.period) / spec.period
      const LIFE = 0.12 // fraction of the period the meteor is alive
      if (nf < 0.05 || p > LIFE) {
        m.opacity = 0
        return
      }
      const rand = seeded(cycle * 97 + spec.seedBase)
      const x0 = (rand() - 0.5) * 700
      const y0 = 220 + rand() * 160
      const z0 = -300 - rand() * 250
      const dx = 90 + rand() * 120
      const dy = -(40 + rand() * 40)
      const k = p / LIFE
      g.position.set(x0 + dx * k, y0 + dy * k, z0)
      g.rotation.z = Math.atan2(dy, dx)
      m.opacity = Math.sin(k * Math.PI) * 0.9 * nf
    })
  })

  return (
    <group>
      {STREAKS.map((_, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <mesh material={mats[i]} frustumCulled={false}>
            <boxGeometry args={[14, 0.35, 0.35]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

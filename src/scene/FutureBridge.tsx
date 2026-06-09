/**
 * FutureBridge — a fancy cable-stayed bridge launching out of the city along
 * "The Future" avenue (−Z) and rising into a distant mountain peak. Symbolic:
 * the journey from the present at the city edge to the goals on the horizon.
 *
 * Two tall pylon towers carry fans of steel cables that suspend a stone deck
 * arcing upward. Warm lanterns line the railings and glow at dusk.
 */

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { easing } from 'maath'
import { nightFactor } from '../lib/sky'

// ── Path endpoints — start at end of The Future gateway avenue (z = −200) and
// climb into a distant mountain peak deep in the −Z direction. ────────────────
const START = new Vector3(0,  1.6, -200)
const END   = new Vector3(0, 72,   -320)

const SEGMENTS      = 56     // deck segment count
const DECK_W        = 6.4    // road surface width
const RAIL_H        = 1.4    // railing height
const PYLON1        = 0.30   // pylon #1 at 30% along the deck
const PYLON2        = 0.66   // pylon #2 at 66% along the deck
const PYLON_H       = 26     // tower height above the deck
const LANTERN_EVERY = 4      // a lantern post every Nth segment

// Parametric path point at fraction t ∈ [0,1].
// X/Z lerp linearly; Y mixes a linear ramp with a smoothstep so the deck
// climbs gracefully — gentle off the gateway, steeper near the peak.
function pathAt(t: number, out = new Vector3()): Vector3 {
  const e = t * t * (3 - 2 * t)
  out.x = START.x + (END.x - START.x) * t
  out.z = START.z + (END.z - START.z) * t
  out.y = START.y + (END.y - START.y) * (0.18 * t + 0.82 * e)
  return out
}
function tangentAt(t: number): Vector3 {
  const a = pathAt(Math.max(0, t - 0.001), new Vector3())
  const b = pathAt(Math.min(1, t + 0.001), new Vector3())
  return b.sub(a).normalize()
}

export function FutureBridge() {
  // Build all geometry once.
  const data = useMemo(() => {
    const deck:     Array<{ p: Vector3; left: Vector3; right: Vector3 }> = []
    const pylons:   Array<{ base: Vector3; top: Vector3; left: Vector3; right: Vector3 }> = []
    const lanterns: Array<{ p: Vector3 }> = []
    const cables:   Array<{ a: Vector3; b: Vector3 }> = []

    const half = DECK_W / 2

    for (let i = 0; i <= SEGMENTS; i++) {
      const t   = i / SEGMENTS
      const p   = pathAt(t, new Vector3())
      const tan = tangentAt(t)
      const lat = new Vector3(-tan.z, 0, tan.x).normalize()
      const left  = p.clone().addScaledVector(lat,  half)
      const right = p.clone().addScaledVector(lat, -half)
      deck.push({ p, left, right })

      if (i > 0 && i < SEGMENTS && i % LANTERN_EVERY === 0) {
        lanterns.push({ p: left.clone() })
        lanterns.push({ p: right.clone() })
      }
    }

    // Pylons + fan stays
    for (const tp of [PYLON1, PYLON2]) {
      const p   = pathAt(tp, new Vector3())
      const tan = tangentAt(tp)
      const lat = new Vector3(-tan.z, 0, tan.x).normalize()
      const base  = p.clone()
      const top   = base.clone().add(new Vector3(0, PYLON_H, 0))
      const left  = base.clone().addScaledVector(lat,  half * 0.92)
      const right = base.clone().addScaledVector(lat, -half * 0.92)
      pylons.push({ base, top, left, right })

      const SPAN = 0.18
      const N = 6
      for (let i = 1; i <= N; i++) {
        for (const ti of [Math.min(1, tp + (SPAN * i) / N), Math.max(0, tp - (SPAN * i) / N)]) {
          const dp  = pathAt(ti, new Vector3())
          const dtn = tangentAt(ti)
          const dlt = new Vector3(-dtn.z, 0, dtn.x).normalize()
          cables.push({ a: top.clone(), b: dp.clone().addScaledVector(dlt,  half * 0.92) })
          cables.push({ a: top.clone(), b: dp.clone().addScaledVector(dlt, -half * 0.92) })
        }
      }
    }

    return { deck, pylons, lanterns, cables }
  }, [])

  // Lantern emissive — fades in at dusk via shared material.
  const lanternMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ffcf78',
        emissive: '#ffcf78',
        emissiveIntensity: 0,
        roughness: 0.6,
      }),
    [],
  )
  useFrame((_, dt) => {
    const nf = nightFactor()
    easing.damp(lanternMat, 'emissiveIntensity', nf > 0.05 ? nf * 2.6 : 0, 0.6, dt)
  })

  // Entrance arch frame at the city end.
  const startTan = tangentAt(0)
  const startLat = new Vector3(-startTan.z, 0, startTan.x).normalize()
  const archPos  = START.clone().addScaledVector(startTan, -1.2)
  const archH    = 12

  return (
    <group>

      {/* ── Grand entrance arch ───────────────────────────────────────── */}
      <group position={archPos}>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[startLat.x * side * (DECK_W / 2 + 0.6), archH / 2, startLat.z * side * (DECK_W / 2 + 0.6)]}
            castShadow
          >
            <boxGeometry args={[1.2, archH, 1.2]} />
            <meshStandardMaterial color="#f0ebe0" roughness={0.78} />
          </mesh>
        ))}
        <mesh position={[0, archH + 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[DECK_W / 2 + 0.6, 0.5, 8, 18, Math.PI]} />
          <meshStandardMaterial color="#f0ebe0" roughness={0.78} />
        </mesh>
        <mesh position={[0, archH + 1.5, 0]} castShadow>
          <coneGeometry args={[0.7, 1.6, 4]} />
          <meshStandardMaterial color="#c4a868" roughness={0.5} metalness={0.45} />
        </mesh>
      </group>

      {/* ── Deck segments — boxes oriented along the path ─────────────── */}
      {data.deck.slice(0, -1).map((seg, i) => {
        const next = data.deck[i + 1]
        const mid  = new Vector3().addVectors(seg.p, next.p).multiplyScalar(0.5)
        const dir  = new Vector3().subVectors(next.p, seg.p)
        const len  = dir.length()
        const yaw   =  Math.atan2(dir.x, dir.z)
        const pitch = -Math.atan2(dir.y, Math.hypot(dir.x, dir.z))
        return (
          <mesh key={`d${i}`} position={mid} rotation={[pitch, yaw, 0]} castShadow receiveShadow>
            <boxGeometry args={[DECK_W, 0.5, len + 0.05]} />
            <meshStandardMaterial color="#d8c8a8" roughness={0.82} />
          </mesh>
        )
      })}

      {/* ── Side parapets ─────────────────────────────────────────────── */}
      {data.deck.slice(0, -1).flatMap((seg, i) => {
        const next = data.deck[i + 1]
        return (['left', 'right'] as const).map((side) => {
          const a = side === 'left' ? seg.left  : seg.right
          const b = side === 'left' ? next.left : next.right
          const mid = new Vector3().addVectors(a, b).multiplyScalar(0.5)
          const dir = new Vector3().subVectors(b, a)
          const len = dir.length()
          const yaw   =  Math.atan2(dir.x, dir.z)
          const pitch = -Math.atan2(dir.y, Math.hypot(dir.x, dir.z))
          return (
            <mesh key={`r${i}${side}`} position={[mid.x, mid.y + RAIL_H / 2, mid.z]} rotation={[pitch, yaw, 0]}>
              <boxGeometry args={[0.22, RAIL_H, len + 0.05]} />
              <meshStandardMaterial color="#5a4a3a" roughness={0.72} metalness={0.18} />
            </mesh>
          )
        })
      })}

      {/* ── Pylon towers ──────────────────────────────────────────────── */}
      {data.pylons.map((py, i) => {
        const h = py.top.y - py.base.y
        return (
          <group key={`py${i}`}>
            {[py.left, py.right].map((leg, k) => (
              <mesh key={k} position={[leg.x, py.base.y + h / 2, leg.z]} castShadow>
                <boxGeometry args={[0.95, h, 0.95]} />
                <meshStandardMaterial color="#f0ebe0" roughness={0.78} />
              </mesh>
            ))}
            <mesh
              position={[
                (py.left.x + py.right.x) / 2,
                py.base.y + 1.2,
                (py.left.z + py.right.z) / 2,
              ]}
            >
              <boxGeometry args={[DECK_W * 0.95 + 0.6, 0.5, 0.6]} />
              <meshStandardMaterial color="#f0ebe0" roughness={0.78} />
            </mesh>
            <mesh position={py.top} castShadow>
              <cylinderGeometry args={[0.8, 1.0, 1.2, 10]} />
              <meshStandardMaterial color="#c4a868" roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[py.top.x, py.top.y + 1.2, py.top.z]} castShadow>
              <coneGeometry args={[0.6, 1.6, 6]} />
              <meshStandardMaterial color="#c4a868" roughness={0.5} metalness={0.5} />
            </mesh>
          </group>
        )
      })}

      {/* ── Cable fans ────────────────────────────────────────────────── */}
      {data.cables.map((c, i) => (
        <Cable key={`c${i}`} a={c.a} b={c.b} />
      ))}

      {/* ── Lantern posts ────────────────────────────────────────────── */}
      {data.lanterns.map((lp, i) => (
        <group key={`lp${i}`} position={[lp.p.x, lp.p.y, lp.p.z]}>
          <mesh position={[0, RAIL_H + 0.9, 0]}>
            <cylinderGeometry args={[0.07, 0.09, RAIL_H + 1.0, 6]} />
            <meshStandardMaterial color="#3a3028" roughness={0.7} />
          </mesh>
          <mesh position={[0, RAIL_H + 1.7, 0]}>
            <sphereGeometry args={[0.28, 10, 10]} />
            <primitive object={lanternMat} attach="material" />
          </mesh>
          <mesh position={[0, RAIL_H + 2.05, 0]}>
            <coneGeometry args={[0.08, 0.25, 5]} />
            <meshStandardMaterial color="#3a3028" roughness={0.6} metalness={0.2} />
          </mesh>
        </group>
      ))}

    </group>
  )
}

// A taut cable cylinder stretched from a → b.  Quaternion is set via the ref
// callback so we don't need a wrapping group or per-frame work.
function Cable({ a, b }: { a: Vector3; b: Vector3 }) {
  const mid = useMemo(() => new Vector3().addVectors(a, b).multiplyScalar(0.5), [a, b])
  const dir = useMemo(() => new Vector3().subVectors(b, a), [a, b])
  const len = dir.length()
  const ref = (m: Mesh | null) => {
    if (!m) return
    const v = dir.clone().normalize()
    const up = new Vector3(0, 1, 0)
    const axis = up.clone().cross(v)
    if (axis.lengthSq() < 1e-6) return
    const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(v))))
    m.quaternion.setFromAxisAngle(axis.normalize(), angle)
  }
  return (
    <mesh ref={ref} position={mid}>
      <cylinderGeometry args={[0.045, 0.045, len, 6]} />
      <meshStandardMaterial color="#3a3835" roughness={0.45} metalness={0.6} />
    </mesh>
  )
}

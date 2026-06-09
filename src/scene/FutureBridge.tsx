/**
 * FutureBridge — a fancy cable-stayed sea bridge running flat over the water
 * from "The Future" gateway end (−Z) toward the distant mountain peaks. At the
 * end, a ferry slowly drifts onward toward the peak — the journey continues
 * past where the bridge can reach.
 *
 * Two tall pylon towers carry fans of steel cables that suspend a stone deck
 * just above the water. Stone piers descend into the sea at intervals. Warm
 * lanterns line the railings and glow at dusk.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { easing } from 'maath'
import { nightFactor } from '../lib/sky'

// ── Geometry ─────────────────────────────────────────────────────────────────
// Flat causeway: starts at the end of "The Future" avenue (z = −200), runs
// horizontally across the water toward the mountain peaks (z = −260).
const DECK_Y    = 2.0
const SEA_FLOOR = -3.0
const START = new Vector3(0, DECK_Y, -200)
const END   = new Vector3(0, DECK_Y, -260)

const SEGMENTS      = 36
const DECK_W        = 6.4
const RAIL_H        = 1.4
const PYLON1        = 0.30
const PYLON2        = 0.66
const PYLON_H       = 22
const LANTERN_EVERY = 4
const PIER_EVERY    = 6     // stone support every N segments

function pathAt(t: number, out = new Vector3()): Vector3 {
  out.x = START.x + (END.x - START.x) * t
  out.y = DECK_Y
  out.z = START.z + (END.z - START.z) * t
  return out
}
function tangentAt(t: number): Vector3 {
  const a = pathAt(Math.max(0, t - 0.001), new Vector3())
  const b = pathAt(Math.min(1, t + 0.001), new Vector3())
  return b.sub(a).normalize()
}

export function FutureBridge() {
  // Build all static geometry once.
  const data = useMemo(() => {
    const deck:     Array<{ p: Vector3; left: Vector3; right: Vector3 }> = []
    const pylons:   Array<{ base: Vector3; top: Vector3; left: Vector3; right: Vector3 }> = []
    const lanterns: Array<{ p: Vector3 }> = []
    const cables:   Array<{ a: Vector3; b: Vector3 }> = []
    const piers:    Array<{ p: Vector3; radius: number }> = []

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
      // Supporting pier every PIER_EVERY (but skip where a pylon will sit)
      if (i > 0 && i < SEGMENTS && i % PIER_EVERY === 0) {
        piers.push({ p: p.clone(), radius: 0.55 })
      }
    }

    // Two A-frame pylons + fans of cables
    for (const tp of [PYLON1, PYLON2]) {
      const p   = pathAt(tp, new Vector3())
      const tan = tangentAt(tp)
      const lat = new Vector3(-tan.z, 0, tan.x).normalize()
      const base  = p.clone()
      const top   = base.clone().add(new Vector3(0, PYLON_H, 0))
      const left  = base.clone().addScaledVector(lat,  half * 0.92)
      const right = base.clone().addScaledVector(lat, -half * 0.92)
      pylons.push({ base, top, left, right })

      // Stone foundation piers under each pylon leg
      piers.push({ p: left.clone(),  radius: 0.85 })
      piers.push({ p: right.clone(), radius: 0.85 })

      const SPAN = 0.18, N = 6
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

    return { deck, pylons, lanterns, cables, piers }
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

      {/* ── Deck segments ────────────────────────────────────────────── */}
      {data.deck.slice(0, -1).map((seg, i) => {
        const next = data.deck[i + 1]
        const mid  = new Vector3().addVectors(seg.p, next.p).multiplyScalar(0.5)
        const dir  = new Vector3().subVectors(next.p, seg.p)
        const len  = dir.length()
        const yaw  = Math.atan2(dir.x, dir.z)
        return (
          <mesh key={`d${i}`} position={mid} rotation={[0, yaw, 0]} castShadow receiveShadow>
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
          const yaw = Math.atan2(dir.x, dir.z)
          return (
            <mesh key={`r${i}${side}`} position={[mid.x, mid.y + RAIL_H / 2, mid.z]} rotation={[0, yaw, 0]}>
              <boxGeometry args={[0.22, RAIL_H, len + 0.05]} />
              <meshStandardMaterial color="#5a4a3a" roughness={0.72} metalness={0.18} />
            </mesh>
          )
        })
      })}

      {/* ── Stone piers descending into the water ────────────────────── */}
      {data.piers.map((pier, i) => {
        const h = DECK_Y - SEA_FLOOR
        return (
          <mesh key={`pi${i}`} position={[pier.p.x, (DECK_Y + SEA_FLOOR) / 2, pier.p.z]} castShadow>
            <cylinderGeometry args={[pier.radius, pier.radius * 1.25, h, 10]} />
            <meshStandardMaterial color="#9a8878" roughness={0.92} />
          </mesh>
        )
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
      {data.cables.map((c, i) => <Cable key={`c${i}`} a={c.a} b={c.b} />)}

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

      {/* ── Ferry drifting past the bridge end toward the peak ───────── */}
      <Ferry from={new Vector3(END.x, 0.45, END.z - 6)} travelDist={62} />

    </group>
  )
}

// Steam ferry — slowly drifts in −Z (toward the peaks), bobs and rolls on the
// water, then loops back. The cycle is long enough that the snap-back is
// inconspicuous at this distance from the camera.
function Ferry({ from, travelDist }: { from: Vector3; travelDist: number }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const r = ref.current
    if (!r) return
    const t = state.clock.elapsedTime
    const cycle = 140
    const phase = (t % cycle) / cycle  // 0..1
    r.position.x = from.x
    r.position.z = from.z - phase * travelDist
    r.position.y = from.y + Math.sin(t * 1.1) * 0.12
    r.rotation.z = Math.sin(t * 0.65) * 0.035
    r.rotation.y = Math.PI  // bow points in −Z (toward the peak)
  })

  return (
    <group ref={ref}>
      {/* hull — light cream painted wood */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.7, 0.55, 4.4]} />
        <meshStandardMaterial color="#f4ecdc" roughness={0.72} />
      </mesh>
      {/* trim line along the gunwale */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[1.74, 0.1, 4.45]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.7} />
      </mesh>
      {/* pointed bow (diamond box from above) */}
      <mesh position={[0, 0.3, 2.5]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.55, 1.2]} />
        <meshStandardMaterial color="#f4ecdc" roughness={0.72} />
      </mesh>
      {/* cabin */}
      <mesh position={[0, 1.0, -0.4]} castShadow>
        <boxGeometry args={[1.35, 0.95, 2.2]} />
        <meshStandardMaterial color="#5a86c9" roughness={0.6} />
      </mesh>
      {/* dark window band */}
      <mesh position={[0, 1.18, -0.4]}>
        <boxGeometry args={[1.37, 0.3, 2.22]} />
        <meshStandardMaterial color="#16243a" roughness={0.4} />
      </mesh>
      {/* cabin roof */}
      <mesh position={[0, 1.55, -0.4]}>
        <boxGeometry args={[1.45, 0.1, 2.3]} />
        <meshStandardMaterial color="#3a3028" roughness={0.7} />
      </mesh>
      {/* smokestack */}
      <mesh position={[0, 2.2, -0.9]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 10]} />
        <meshStandardMaterial color="#3a3028" roughness={0.65} />
      </mesh>
      {/* smokestack red band */}
      <mesh position={[0, 2.55, -0.9]}>
        <cylinderGeometry args={[0.19, 0.19, 0.18, 10]} />
        <meshStandardMaterial color="#c44040" roughness={0.7} />
      </mesh>
      {/* aft flagpole */}
      <mesh position={[0, 1.95, -1.8]}>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 5]} />
        <meshStandardMaterial color="#3a3028" />
      </mesh>
      {/* pennant flag */}
      <mesh position={[0.32, 2.4, -1.8]}>
        <planeGeometry args={[0.6, 0.32]} />
        <meshStandardMaterial color="#c44040" roughness={0.7} side={DoubleSide} />
      </mesh>
    </group>
  )
}

// A taut cable cylinder stretched from a → b. Quaternion is set via the ref
// callback so no wrapping group or per-frame work is needed.
function Cable({ a, b }: { a: Vector3; b: Vector3 }) {
  const mid = useMemo(() => new Vector3().addVectors(a, b).multiplyScalar(0.5), [a, b])
  const dir = useMemo(() => new Vector3().subVectors(b, a), [a, b])
  const len = dir.length()
  const cb = (m: Mesh | null) => {
    if (!m) return
    const v = dir.clone().normalize()
    const up = new Vector3(0, 1, 0)
    const axis = up.clone().cross(v)
    if (axis.lengthSq() < 1e-6) return
    const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(v))))
    m.quaternion.setFromAxisAngle(axis.normalize(), angle)
  }
  return (
    <mesh ref={cb} position={mid}>
      <cylinderGeometry args={[0.045, 0.045, len, 6]} />
      <meshStandardMaterial color="#3a3835" roughness={0.45} metalness={0.6} />
    </mesh>
  )
}

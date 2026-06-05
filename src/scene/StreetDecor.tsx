/**
 * StreetDecor — the Amalfi-Coast street dressing:
 *   • Festoon string-lights draped in catenary swags along every street, warm
 *     bulbs that bloom at dusk (the signature Mediterranean evening look).
 *   • Terracotta flower planters lining the sidewalks, bursting with vivid
 *     bougainvillea / geranium colour.
 *   • Café terraces — striped parasols over little round tables — scattered
 *     through the inner streets.
 *
 * Repeated elements are instanced (one draw call each) and placed from a seeded
 * RNG so the layout is stable.
 */

import { useEffect, useMemo, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import { ROAD_SEGS } from './lib/cityModel'
import { POND_CENTER, POND_CLEAR } from './Pond'

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function nearPond(x: number, z: number) {
  const dx = x - POND_CENTER[0]
  const dz = z - POND_CENTER[1]
  return dx * dx + dz * dz < (POND_CLEAR * 1.2) ** 2
}
function nearOrigin(x: number, z: number, r: number) {
  return x * x + z * z < r * r
}

interface SidePoint {
  x: number
  z: number
  angle: number
}
function roadSidePoints(step: number, off: number): SidePoint[] {
  const pts: SidePoint[] = []
  for (const s of ROAD_SEGS) {
    const dx = s.bx - s.ax
    const dz = s.bz - s.az
    const len = Math.hypot(dx, dz)
    if (len < step * 0.8) continue
    const ux = dx / len
    const uz = dz / len
    const nx = -uz
    const nz = ux
    const angle = Math.atan2(-dz, dx)
    const totalOff = s.width * 0.5 + off
    const count = Math.floor(len / step)
    for (let k = 0; k < count; k++) {
      const t = (k + 0.5) / count
      const bx = s.ax + dx * t
      const bz = s.az + dz * t
      for (const side of [-1, 1] as const) {
        const x = bx + nx * totalOff * side
        const z = bz + nz * totalOff * side
        if (nearOrigin(x, z, 14) || nearPond(x, z)) continue
        pts.push({ x, z, angle })
      }
    }
  }
  return pts
}

// ─── Festoon string-lights over the streets ──────────────────────────────────
// Warm bulbs running down the centre of each street, sagging between unseen
// crossings so they read as strung lights. Static (no per-frame cost) — they
// bloom on their own at dusk.
const BULB_WARM = '#ffd98a'
function StreetFestoon() {
  const bulbs = useMemo(() => {
    const out: { x: number; y: number; z: number }[] = []
    const SPAN = 16 // distance between "posts" the string hangs from
    for (const s of ROAD_SEGS) {
      const dx = s.bx - s.ax
      const dz = s.bz - s.az
      const len = Math.hypot(dx, dz)
      if (len < 14) continue
      const spans = Math.max(1, Math.round(len / SPAN))
      const perSpan = 5
      for (let sp = 0; sp < spans; sp++) {
        for (let b = 0; b < perSpan; b++) {
          const t = (sp + b / perSpan) / spans
          const lt = b / perSpan // 0..1 within this span
          const sag = Math.sin(Math.PI * lt) * 1.1
          const x = s.ax + dx * t
          const z = s.az + dz * t
          if (nearOrigin(x, z, 13) || nearPond(x, z)) continue
          out.push({ x, y: 6.2 - sag, z })
        }
      }
    }
    return out
  }, [])

  const ref = useRef<InstancedMesh>(null)
  useEffect(() => {
    const m = ref.current
    if (!m) return
    const dummy = new Object3D()
    bulbs.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z)
      dummy.scale.setScalar(0.85 + ((i * 13) % 7) / 18)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    })
    m.count = bulbs.length
    m.instanceMatrix.needsUpdate = true
  }, [bulbs])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, bulbs.length]}>
      <sphereGeometry args={[0.17, 6, 6]} />
      <meshStandardMaterial color={BULB_WARM} emissive={BULB_WARM} emissiveIntensity={2.2} toneMapped={false} />
    </instancedMesh>
  )
}

// ─── Flower planters lining the sidewalks ────────────────────────────────────
const BLOOMS = ['#d6447a', '#e85d8a', '#c43c6e', '#e0556f', '#b5409a', '#e86a4a', '#ece4d8']
function Planters() {
  const pts = useMemo(() => {
    const rng = mulberry32(6041)
    return roadSidePoints(20, 1.3).filter(() => rng() > 0.45)
  }, [])
  const rng = useMemo(() => mulberry32(881), [])

  const potRef = useRef<InstancedMesh>(null)
  const flowerRef = useRef<InstancedMesh>(null)

  useEffect(() => {
    const pm = potRef.current
    const fm = flowerRef.current
    if (!pm || !fm) return
    const dummy = new Object3D()
    const color = new Color()
    pts.forEach((p, i) => {
      // terracotta pot
      dummy.position.set(p.x, 0.35, p.z)
      dummy.rotation.set(0, p.angle, 0)
      dummy.scale.setScalar(0.9 + rng() * 0.3)
      dummy.updateMatrix()
      pm.setMatrixAt(i, dummy.matrix)

      // flower mound
      dummy.position.set(p.x, 0.95, p.z)
      dummy.rotation.set(0, rng() * Math.PI, 0)
      const sc = 0.9 + rng() * 0.4
      dummy.scale.set(sc, sc * 0.8, sc)
      dummy.updateMatrix()
      fm.setMatrixAt(i, dummy.matrix)
      color.set(BLOOMS[Math.floor(rng() * BLOOMS.length)])
      fm.setColorAt(i, color)
    })
    pm.count = pts.length
    fm.count = pts.length
    pm.instanceMatrix.needsUpdate = true
    fm.instanceMatrix.needsUpdate = true
    if (fm.instanceColor) fm.instanceColor.needsUpdate = true
  }, [pts, rng])

  return (
    <group>
      <instancedMesh ref={potRef} args={[undefined, undefined, pts.length]} castShadow>
        <cylinderGeometry args={[0.42, 0.3, 0.7, 8]} />
        <meshStandardMaterial color="#b5673f" roughness={0.92} />
      </instancedMesh>
      <instancedMesh ref={flowerRef} args={[undefined, undefined, pts.length]} castShadow>
        <sphereGeometry args={[0.5, 8, 7]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
    </group>
  )
}

// ─── Café terraces — striped parasols over little tables ──────────────────────
const PARASOL = ['#d65a4e', '#e0b84e', '#5f93c4', '#e4ddcf', '#c97b54']
function CafeTerraces() {
  const cafes = useMemo(() => {
    const r = mulberry32(3390)
    return Array.from({ length: 18 }, (_, i) => {
      const a = r() * Math.PI * 2
      const dist = 20 + r() * 30
      return {
        x: Math.cos(a) * dist,
        z: Math.sin(a) * dist,
        rot: r() * Math.PI * 2,
        color: PARASOL[i % PARASOL.length],
      }
    }).filter((c) => !nearOrigin(c.x, c.z, 16) && !nearPond(c.x, c.z))
  }, [])

  return (
    <group>
      {cafes.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]} rotation={[0, c.rot, 0]}>
          {/* table */}
          <mesh position={[0, 0.7, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 16]} />
            <meshStandardMaterial color="#e8e0d2" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.7, 6]} />
            <meshStandardMaterial color="#6a5640" roughness={0.9} />
          </mesh>
          {/* parasol pole */}
          <mesh position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2.0, 6]} />
            <meshStandardMaterial color="#7a6748" roughness={0.9} />
          </mesh>
          {/* parasol canopy */}
          <mesh position={[0, 2.7, 0]} castShadow>
            <coneGeometry args={[1.5, 0.7, 12]} />
            <meshStandardMaterial color={c.color} roughness={0.85} side={2} />
          </mesh>
          {/* two chairs */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.85, 0.45, 0]} castShadow>
              <boxGeometry args={[0.4, 0.5, 0.4]} />
              <meshStandardMaterial color="#cdbfa6" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export function StreetDecor() {
  return (
    <group>
      <StreetFestoon />
      <Planters />
      <CafeTerraces />
    </group>
  )
}

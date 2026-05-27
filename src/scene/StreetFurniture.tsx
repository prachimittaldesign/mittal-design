/**
 * StreetFurniture — dense city-life layer:
 *   • Round-canopy trees lining every road (the dominant visual from the reference)
 *   • Street lamps with emissive warm heads
 *   • Park benches
 *   • Small shop kiosks / market carts
 *   • Art installations near the central plaza
 *
 * All repeated elements use InstancedMesh (single draw-call each).
 * Position generation is seeded/deterministic so the layout is stable.
 */

import { useEffect, useMemo, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import { ROAD_SEGS } from './lib/cityModel'
import { FOLIAGE, TRUNK } from './lib/cityTheme'
import { POND_CENTER, POND_CLEAR } from './Pond'

// ─── Seeded RNG ───────────────────────────────────────────────────────────────
function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function nearPond(x: number, z: number) {
  const dx = x - POND_CENTER[0]
  const dz = z - POND_CENTER[1]
  return dx * dx + dz * dz < (POND_CLEAR * 1.2) ** 2
}

function nearOrigin(x: number, z: number, r = 10) {
  return x * x + z * z < r * r
}

// Walk every road segment, yield positions every `step` units on one or both
// sides (offset `off` perpendicular to the road).
interface RoadPoint {
  x: number
  z: number
  angle: number // road heading (radians)
}

function roadSidePoints(step: number, off: number, bothSides = true): RoadPoint[] {
  const pts: RoadPoint[] = []
  for (const s of ROAD_SEGS) {
    const dx = s.bx - s.ax
    const dz = s.bz - s.az
    const len = Math.hypot(dx, dz)
    if (len < step * 0.8) continue
    const ux = dx / len
    const uz = dz / len
    const nx = -uz            // left normal
    const nz =  ux
    const angle = Math.atan2(-dz, dx)
    const totalOff = s.width * 0.5 + off
    const count = Math.floor(len / step)
    for (let k = 0; k < count; k++) {
      const t = (k + 0.5) / count
      const bx = s.ax + dx * t
      const bz = s.az + dz * t
      const sides = bothSides ? [-1, 1] : [1]
      for (const side of sides) {
        const x = bx + nx * totalOff * side
        const z = bz + nz * totalOff * side
        if (nearOrigin(x, z, 11) || nearPond(x, z)) continue
        pts.push({ x, z, angle })
      }
    }
  }
  return pts
}

// ─── Road-lining trees ───────────────────────────────────────────────────────
// These are the most impactful visual element in the reference: round green
// canopies every ~14 u along every footpath, creating the tree-lined boulevard look.
function RoadTrees() {
  const pts = useMemo(() => roadSidePoints(14, 2.4, true), [])
  const rand = useMemo(() => mulberry32(8811), [])

  const canopyRef = useRef<InstancedMesh>(null)
  const trunkRef  = useRef<InstancedMesh>(null)

  useEffect(() => {
    const cm = canopyRef.current
    const tm = trunkRef.current
    if (!cm || !tm) return
    const dummy = new Object3D()
    const color = new Color()

    pts.forEach((p, i) => {
      const scale = 0.72 + rand() * 0.36
      const h = 3.0 * scale

      // canopy
      dummy.position.set(p.x, h + 1.5 * scale, p.z)
      dummy.rotation.set(0, rand() * Math.PI * 2, 0)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      cm.setMatrixAt(i, dummy.matrix)
      color.set(FOLIAGE[Math.floor(rand() * FOLIAGE.length)])
      cm.setColorAt(i, color)

      // trunk
      dummy.position.set(p.x, h * 0.5, p.z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      tm.setMatrixAt(i, dummy.matrix)
    })

    cm.count = pts.length
    tm.count = pts.length
    cm.instanceMatrix.needsUpdate = true
    tm.instanceMatrix.needsUpdate = true
    if (cm.instanceColor) cm.instanceColor.needsUpdate = true
  }, [pts, rand])

  return (
    <group>
      <instancedMesh ref={canopyRef} args={[undefined, undefined, pts.length]} castShadow>
        <sphereGeometry args={[1.55, 8, 7]} />
        <meshStandardMaterial roughness={0.9} metalness={0} vertexColors />
      </instancedMesh>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, pts.length]}>
        <cylinderGeometry args={[0.16, 0.22, 3.0, 6]} />
        <meshStandardMaterial color={TRUNK} roughness={1} />
      </instancedMesh>
    </group>
  )
}

// ─── Street lamps ────────────────────────────────────────────────────────────
// One side of the road every ~22 u. Warm emissive head so they bloom after dark.
function StreetLamps() {
  const pts = useMemo(() => roadSidePoints(22, 1.8, false), [])
  const rand = useMemo(() => mulberry32(3311), [])

  const poleRef = useRef<InstancedMesh>(null)
  const headRef = useRef<InstancedMesh>(null)

  useEffect(() => {
    const pm = poleRef.current
    const hm = headRef.current
    if (!pm || !hm) return
    const dummy = new Object3D()

    pts.forEach((p, i) => {
      // pole
      dummy.position.set(p.x, 3.5, p.z)
      dummy.rotation.set(0, rand() * 0.4, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      pm.setMatrixAt(i, dummy.matrix)

      // head (offset tip of arm)
      const armLen = 1.2
      dummy.position.set(
        p.x + Math.cos(p.angle + Math.PI * 0.5) * armLen,
        7.2,
        p.z + Math.sin(p.angle + Math.PI * 0.5) * armLen,
      )
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      hm.setMatrixAt(i, dummy.matrix)
    })

    pm.count = pts.length
    hm.count = pts.length
    pm.instanceMatrix.needsUpdate = true
    hm.instanceMatrix.needsUpdate = true
  }, [pts, rand])

  return (
    <group>
      {/* Pole */}
      <instancedMesh ref={poleRef} args={[undefined, undefined, pts.length]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 7, 6]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} metalness={0.3} />
      </instancedMesh>
      {/* Warm glowing head — toneMapped:false so it blooms */}
      <instancedMesh ref={headRef} args={[undefined, undefined, pts.length]}>
        <sphereGeometry args={[0.38, 8, 8]} />
        <meshStandardMaterial
          color="#ffe8a0"
          emissive="#ffcc55"
          emissiveIntensity={2.2}
          roughness={0.2}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  )
}

// ─── Park benches ─────────────────────────────────────────────────────────────
// Scattered along footpaths every ~30 u, one side only.
function Benches() {
  const pts = useMemo(() => roadSidePoints(30, 2.0, false), [])
  const rand = useMemo(() => mulberry32(7722), [])

  const seatRef = useRef<InstancedMesh>(null)
  const legRef  = useRef<InstancedMesh>(null)

  useEffect(() => {
    const sm = seatRef.current
    const lm = legRef.current
    if (!sm || !lm) return
    const dummy = new Object3D()

    pts.forEach((p, i) => {
      // seat plank — aligned with road
      dummy.position.set(p.x, 0.55, p.z)
      dummy.rotation.set(0, p.angle + Math.PI * 0.5, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      sm.setMatrixAt(i, dummy.matrix)

      // legs (same rotation, slightly lower)
      dummy.position.set(p.x, 0.28, p.z)
      dummy.updateMatrix()
      lm.setMatrixAt(i, dummy.matrix)
    })

    sm.count = pts.length
    lm.count = pts.length
    sm.instanceMatrix.needsUpdate = true
    lm.instanceMatrix.needsUpdate = true
  }, [pts, rand])

  return (
    <group>
      <instancedMesh ref={seatRef} args={[undefined, undefined, pts.length]} castShadow>
        <boxGeometry args={[2.4, 0.14, 0.7]} />
        <meshStandardMaterial color="#8c6a3e" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={legRef} args={[undefined, undefined, pts.length]} castShadow>
        <boxGeometry args={[2.0, 0.56, 0.12]} />
        <meshStandardMaterial color="#5a4020" roughness={0.95} />
      </instancedMesh>
    </group>
  )
}

// ─── Market kiosks / carts ───────────────────────────────────────────────────
// 18 small shop stalls scattered at road junctions near the inner rings.
const KIOSK_COLORS = ['#e07b52', '#5a86c9', '#c9ad5a', '#7ab870', '#c96f8a']

function Kiosks() {
  const kiosks = useMemo(() => {
    const r = mulberry32(5544)
    // Place at random points near the inner ring (r 18..40) — busy market area
    return Array.from({ length: 18 }, (_, i) => {
      const a = r() * Math.PI * 2
      const dist = 18 + r() * 22
      const x = Math.cos(a) * dist
      const z = Math.sin(a) * dist
      return { x, z, angle: r() * Math.PI * 2, color: KIOSK_COLORS[i % KIOSK_COLORS.length] }
    }).filter((k) => !nearOrigin(k.x, k.z, 12) && !nearPond(k.x, k.z))
  }, [])

  const bodyRef = useRef<InstancedMesh>(null)
  const roofRef = useRef<InstancedMesh>(null)

  useEffect(() => {
    const bm = bodyRef.current
    const rm = roofRef.current
    if (!bm || !rm) return
    const dummy = new Object3D()
    const color = new Color()

    kiosks.forEach((k, i) => {
      dummy.position.set(k.x, 1.1, k.z)
      dummy.rotation.set(0, k.angle, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      bm.setMatrixAt(i, dummy.matrix)
      color.set(k.color)
      bm.setColorAt(i, color)

      dummy.position.set(k.x, 2.5, k.z)
      dummy.rotation.set(0, k.angle + Math.PI / 4, 0)
      dummy.updateMatrix()
      rm.setMatrixAt(i, dummy.matrix)
      rm.setColorAt(i, color)
    })

    bm.count = kiosks.length
    rm.count = kiosks.length
    bm.instanceMatrix.needsUpdate = true
    rm.instanceMatrix.needsUpdate = true
    if (bm.instanceColor) bm.instanceColor.needsUpdate = true
    if (rm.instanceColor) rm.instanceColor.needsUpdate = true
  }, [kiosks])

  return (
    <group>
      {/* Body */}
      <instancedMesh ref={bodyRef} args={[undefined, undefined, kiosks.length]} castShadow>
        <boxGeometry args={[2.2, 2.2, 2.2]} />
        <meshStandardMaterial roughness={0.85} vertexColors />
      </instancedMesh>
      {/* Canopy / roof */}
      <instancedMesh ref={roofRef} args={[undefined, undefined, kiosks.length]} castShadow>
        <coneGeometry args={[1.8, 1.0, 4]} />
        <meshStandardMaterial roughness={0.8} vertexColors />
      </instancedMesh>
    </group>
  )
}

// ─── Art installations ────────────────────────────────────────────────────────
// 6 abstract sculptural forms placed near the plaza and key intersections.
const ART_SPOTS = [
  { x:  22, z:  0  },
  { x: -22, z:  0  },
  { x:  0,  z:  22 },
  { x:  0,  z: -22 },
  { x:  16, z:  16 },
  { x: -16, z: -16 },
]

function ArtInstallations() {
  return (
    <group>
      {ART_SPOTS.map((pos, i) => {
        const angle = (i / ART_SPOTS.length) * Math.PI * 2
        const c1 = ['#c0654f','#5a86c9','#d89a4e','#7ab870','#b06090','#c0a048'][i]
        return (
          <group key={i} position={[pos.x, 0, pos.z]} rotation={[0, angle, 0]}>
            {/* Base plinth */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[1.2, 0.6, 1.2]} />
              <meshStandardMaterial color="#8a8070" roughness={0.9} />
            </mesh>
            {/* Sculpture body — alternates between sphere, torus, abstract box cluster */}
            {i % 3 === 0 && (
              <mesh position={[0, 1.8, 0]} castShadow>
                <sphereGeometry args={[0.8, 10, 10]} />
                <meshStandardMaterial color={c1} roughness={0.4} metalness={0.6} />
              </mesh>
            )}
            {i % 3 === 1 && (
              <mesh position={[0, 2.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.7, 0.22, 10, 24]} />
                <meshStandardMaterial color={c1} roughness={0.35} metalness={0.65} />
              </mesh>
            )}
            {i % 3 === 2 && (
              <group position={[0, 1.6, 0]}>
                <mesh position={[0, 0.5, 0]} castShadow>
                  <boxGeometry args={[0.4, 1.6, 0.4]} />
                  <meshStandardMaterial color={c1} roughness={0.5} metalness={0.5} />
                </mesh>
                <mesh position={[0.5, 0.2, 0]} rotation={[0, 0.8, 0]} castShadow>
                  <boxGeometry args={[0.35, 0.9, 0.35]} />
                  <meshStandardMaterial color={c1} roughness={0.5} metalness={0.5} />
                </mesh>
              </group>
            )}
          </group>
        )
      })}
    </group>
  )
}

// ─── Root export ─────────────────────────────────────────────────────────────
export function StreetFurniture() {
  return (
    <group>
      <RoadTrees />
      <StreetLamps />
      <Benches />
      <Kiosks />
      <ArtInstallations />
    </group>
  )
}

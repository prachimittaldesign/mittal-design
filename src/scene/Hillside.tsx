/**
 * Hillside — the terraced green cliffs that ring the city, turning the flat
 * island into an Amalfi-style amphitheatre. A continuous green slope rises from
 * the city's edge up to a sea-cliff rim, dotted with stacked pastel houses and
 * cypress trees, and dropping straight into the turquoise water at the back.
 *
 * The front arc (toward the harbour / camera, +Z) is left open so the town reads
 * as a cove cradled by hills, exactly like Amalfi from the water.
 */

import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { LAND_R } from './CoastEnvironment'

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Geometry of the bowl ─────────────────────────────────────────────────────
const R_MIN = 132 // slope begins just past the city core / grass field
const R_MAX = LAND_R - 2 // ...and meets the sea cliff near the coastline (≈204)
const H_TOP = 34 // height of the cliff rim above the town

// Opening faces +Z (the harbour / default camera). CylinderGeometry places its
// seam at θ=0 → +Z, so we draw everything EXCEPT a gap centred there.
const GAP = Math.PI * 0.62 // ~112° of open harbour front
const THETA_START = GAP / 2
const THETA_LEN = Math.PI * 2 - GAP

const heightAt = (r: number) => H_TOP * Math.min(1, Math.max(0, (r - R_MIN) / (R_MAX - R_MIN)))

// Warm Amalfi house tones + a couple of sage / soft-blue accents.
const HOUSE_TONES = ['#f4eee2', '#f3d9b0', '#eec9a0', '#ecb89a', '#e8a99a', '#cdd3a8', '#a9c4cc', '#f0d68a', '#e9b3a0']
const ROOF_TONES = ['#b5683f', '#a8553a', '#c0703a', '#9c5236', '#c98a52']

interface HouseSpec {
  x: number
  z: number
  y: number
  ry: number
  s: number
  body: string
  roof: string
}
interface TreeSpec {
  x: number
  z: number
  y: number
  s: number
}

export function Hillside() {
  const { houses, trees } = useMemo(() => {
    const rnd = mulberry32(77123)
    const houses: HouseSpec[] = []
    const trees: TreeSpec[] = []

    // Stacked rows of houses climbing the slope.
    const ROWS = 7
    for (let row = 0; row < ROWS; row++) {
      const rr = R_MIN + 6 + (row / (ROWS - 1)) * (R_MAX - R_MIN - 12)
      const circumference = THETA_LEN * rr
      const count = Math.max(4, Math.floor(circumference / 13))
      for (let i = 0; i < count; i++) {
        const jitter = (rnd() - 0.5) * (THETA_LEN / count) * 0.7
        const theta = THETA_START + ((i + 0.5) / count) * THETA_LEN + jitter
        const rj = rr + (rnd() - 0.5) * 5
        const yj = heightAt(rj)
        const x = rj * Math.sin(theta)
        const z = rj * Math.cos(theta)
        if (rnd() < 0.12) {
          // occasional cypress instead of a house
          trees.push({ x, z, y: yj, s: 0.8 + rnd() * 0.7 })
          continue
        }
        houses.push({
          x,
          z,
          y: yj,
          ry: theta + Math.PI, // face inward toward the town
          s: 0.85 + rnd() * 0.7,
          body: HOUSE_TONES[Math.floor(rnd() * HOUSE_TONES.length)],
          roof: ROOF_TONES[Math.floor(rnd() * ROOF_TONES.length)],
        })
      }
    }

    // A scattering of extra cypress trees between the rows.
    for (let i = 0; i < 40; i++) {
      const rr = R_MIN + 4 + rnd() * (R_MAX - R_MIN - 8)
      const theta = THETA_START + rnd() * THETA_LEN
      trees.push({ x: rr * Math.sin(theta), z: rr * Math.cos(theta), y: heightAt(rr), s: 0.7 + rnd() * 0.8 })
    }

    return { houses, trees }
  }, [])

  return (
    <group>
      {/* ── Green slope ── a flaring cone wall from the town edge up to the rim */}
      <mesh position={[0, H_TOP / 2, 0]}>
        <cylinderGeometry args={[R_MAX, R_MIN, H_TOP, 72, 1, true, THETA_START, THETA_LEN]} />
        <meshStandardMaterial color="#56743f" roughness={1} side={2} flatShading />
      </mesh>

      {/* ── Sea cliff ── a limestone wall dropping from the rim into the water,
          closing the back of the bowl */}
      <mesh position={[0, (H_TOP - 2) / 2, 0]}>
        <cylinderGeometry args={[R_MAX, R_MAX, H_TOP + 2, 72, 1, true, THETA_START, THETA_LEN]} />
        <meshStandardMaterial color="#9a9080" roughness={0.96} side={2} flatShading />
      </mesh>

      {/* ── Green rim cap ── a thin disc closing the top so no edge is open */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, H_TOP, 0]}>
        <ringGeometry args={[R_MAX - 8, R_MAX, 72, 1, THETA_START, THETA_LEN]} />
        <meshStandardMaterial color="#4f6b3a" roughness={1} side={2} />
      </mesh>

      {/* ── Stacked houses ── */}
      <Instances limit={Math.max(houses.length, 1)} castShadow receiveShadow>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial roughness={0.85} />
        {houses.map((h, i) => (
          <Instance
            key={i}
            position={[h.x, h.y + 1.5 * h.s, h.z]}
            scale={[h.s * 1.1, h.s * 1.4, h.s * 1.1]}
            rotation={[0, h.ry, 0]}
            color={h.body}
          />
        ))}
      </Instances>
      {/* House roofs */}
      <Instances limit={Math.max(houses.length, 1)} castShadow>
        <coneGeometry args={[2.5, 1.7, 4]} />
        <meshStandardMaterial roughness={0.9} />
        {houses.map((h, i) => (
          <Instance
            key={i}
            position={[h.x, h.y + 3.0 * h.s, h.z]}
            scale={[h.s * 1.05, h.s, h.s * 1.05]}
            rotation={[0, h.ry + Math.PI / 4, 0]}
            color={h.roof}
          />
        ))}
      </Instances>

      {/* ── Cypress trees ── tall slim Mediterranean spires */}
      <Instances limit={Math.max(trees.length, 1)} castShadow>
        <coneGeometry args={[0.9, 6, 7]} />
        <meshStandardMaterial color="#3a5530" roughness={1} />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.x, t.y + 3 * t.s, t.z]} scale={[t.s, t.s * 1.3, t.s]} />
        ))}
      </Instances>
    </group>
  )
}

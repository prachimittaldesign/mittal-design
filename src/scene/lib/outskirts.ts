/**
 * Outskirts — the planned countryside between the urban core (r≈96) and the
 * coastline (LAND_R=206). Without it the city floated in a dead lawn; with it
 * the island reads like a real coastal town that tapers naturally:
 *
 *   urban core → suburban hamlets → orchards/countryside → coast road →
 *   harbor & beach → open sea.
 *
 * Everything here is deterministic (seeded) so the town never reshuffles
 * between visits. Pure data — rendering lives in Outskirts/Marina/Beach.
 */

import { polar, pointToSegDist, type Pt } from './project3d'
import type { RoadSeg } from './cityModel'

const D2R = Math.PI / 180

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── The coastal ring road ────────────────────────────────────────────────────
// One continuous corniche circling the island just inside the shore. The four
// diagonal boulevards extend out to meet it, and the two gateway avenues cross
// it — six connections, so it never reads as an orphaned ring.
export const COAST_ROAD_R = 172
export const COAST_ROAD_W = 4.0

// Diagonal boulevard extensions: from the urban edge (r=96) out to the coast road.
export const DIAG_EXT_SEGS: RoadSeg[] = [45, 135, 225, 315].map((deg) => {
  const a = polar(0, 0, 97, deg * D2R)
  const b = polar(0, 0, COAST_ROAD_R, deg * D2R)
  return { ax: a.x, az: a.z, bx: b.x, bz: b.z, width: 3.4 }
})

// ─── Waterfront sectors ───────────────────────────────────────────────────────
// Marina sits beside the lighthouse (θ≈82°) at the end of the Past gateway;
// the beach takes the next bay west. Angles in world space: θ = atan2(z, x).
export const MARINA_T0 = 40 * D2R
export const MARINA_T1 = 76 * D2R
export const BEACH_T0 = 104 * D2R
export const BEACH_T1 = 140 * D2R

// ─── Hamlets ─────────────────────────────────────────────────────────────────
// Hand-placed clusters (a planner places villages; RNG only roughs up the
// details). Each is a piazza ringed by houses, linked to the road network by
// a stone lane — inward to the outer ring road, or outward to the coast road.
interface HamletSpec {
  deg: number
  r: number
  houses: number
}

const HAMLET_SPECS: HamletSpec[] = [
  { deg: 22, r: 132, houses: 8 },
  { deg: 60, r: 118, houses: 9 },  // harbor village above the marina
  { deg: 122, r: 128, houses: 7 }, // beach town
  { deg: 155, r: 140, houses: 8 },
  { deg: 205, r: 150, houses: 6 },
  { deg: 245, r: 130, houses: 8 },
  { deg: 300, r: 142, houses: 7 },
  { deg: 338, r: 125, houses: 8 },
]

export interface OutskirtHouse {
  id: string
  position: [number, number, number]
  rotationY: number
  scale: number
  hash: number
}

export interface Piazza {
  x: number
  z: number
  r: number
}

export interface OutskirtTree {
  id: string
  position: [number, number, number]
  scale: number
}

const HAMLET_CLEAR = 13 // grass/scenery keep-out radius around each hamlet

interface BuiltHamlet {
  cx: number
  cz: number
  houses: OutskirtHouse[]
  trees: OutskirtTree[]
  piazza: Piazza
  lane: RoadSeg
}

function buildHamlet(spec: HamletSpec, index: number): BuiltHamlet {
  const rng = mulberry32(7700 + index * 131)
  const theta = spec.deg * D2R
  const c = polar(0, 0, spec.r, theta)

  const houses: OutskirtHouse[] = []
  for (let i = 0; i < spec.houses; i++) {
    // Houses circle the piazza facing inward, with jitter so no two hamlets rhyme.
    const a = (i / spec.houses) * Math.PI * 2 + rng() * 0.7
    const d = 5.5 + rng() * 3.5
    const p = polar(c.x, c.z, d, a)
    houses.push({
      id: `oh-${index}-${i}`,
      position: [p.x, 0, p.z],
      rotationY: -a + Math.PI / 2 + (rng() - 0.5) * 0.4, // face the piazza, roughly
      scale: 0.85 + rng() * 0.5,
      hash: Math.floor(rng() * 997),
    })
  }

  const trees: OutskirtTree[] = []
  const treeCount = 3 + Math.floor(rng() * 3)
  for (let i = 0; i < treeCount; i++) {
    const a = rng() * Math.PI * 2
    const d = 9 + rng() * 5
    const p = polar(c.x, c.z, d, a)
    trees.push({ id: `oht-${index}-${i}`, position: [p.x, 0, p.z], scale: 0.7 + rng() * 0.5 })
  }

  // Lane: radial — inward to the outer ring road for inner hamlets, outward to
  // the coast road for the far ones.
  const inward = spec.r <= 134
  const target = polar(0, 0, inward ? 89 : COAST_ROAD_R, theta)
  const lane: RoadSeg = { ax: c.x, az: c.z, bx: target.x, bz: target.z, width: 2.6 }

  return { cx: c.x, cz: c.z, houses, trees, piazza: { x: c.x, z: c.z, r: 4.2 }, lane }
}

const HAMLETS: BuiltHamlet[] = HAMLET_SPECS.map(buildHamlet)

export const OUTSKIRT_HOUSES: OutskirtHouse[] = HAMLETS.flatMap((h) => h.houses)
export const PIAZZAS: Piazza[] = HAMLETS.map((h) => h.piazza)
export const HAMLET_LANES: RoadSeg[] = HAMLETS.map((h) => h.lane)

// ─── Orchards ────────────────────────────────────────────────────────────────
// Regular planted rows — agriculture reads as intent, not noise. Three groves
// fill the largest empty wedges between hamlets.
interface OrchardSpec {
  deg: number
  r: number
  rows: number
  cols: number
}

const ORCHARD_SPECS: OrchardSpec[] = [
  { deg: 110, r: 152, rows: 4, cols: 5 },
  { deg: 215, r: 148, rows: 4, cols: 5 },
  { deg: 352, r: 148, rows: 3, cols: 5 },
]

const ORCHARD_SPACING = 5.5
const ORCHARD_CLEAR = 17

function buildOrchard(spec: OrchardSpec, index: number): OutskirtTree[] {
  const theta = spec.deg * D2R
  const c = polar(0, 0, spec.r, theta)
  // Rows run along the tangent so the grove follows the land's curve.
  const tx = -Math.sin(theta)
  const tz = Math.cos(theta)
  const rx = Math.cos(theta)
  const rz = Math.sin(theta)
  const trees: OutskirtTree[] = []
  for (let row = 0; row < spec.rows; row++) {
    for (let col = 0; col < spec.cols; col++) {
      const u = (col - (spec.cols - 1) / 2) * ORCHARD_SPACING
      const v = (row - (spec.rows - 1) / 2) * ORCHARD_SPACING
      trees.push({
        id: `orc-${index}-${row}-${col}`,
        position: [c.x + tx * u + rx * v, 0, c.z + tz * u + rz * v],
        scale: 0.55, // uniform pruned fruit trees
      })
    }
  }
  return trees
}

export const ORCHARD_TREES: OutskirtTree[] = ORCHARD_SPECS.flatMap(buildOrchard)
const ORCHARD_CENTERS: Pt[] = ORCHARD_SPECS.map((o) => polar(0, 0, o.r, o.deg * D2R))

// ─── Belt scatter ────────────────────────────────────────────────────────────
// A light free-growing scatter of trees between the hamlets so the countryside
// isn't only villages and crops.
function buildBeltTrees(): OutskirtTree[] {
  const rng = mulberry32(551234)
  const out: OutskirtTree[] = []
  let placed = 0
  for (let attempt = 0; placed < 56 && attempt < 600; attempt++) {
    const theta = rng() * Math.PI * 2
    const r = 104 + rng() * 60
    const p = polar(0, 0, r, theta)
    if (isOutskirtsOccupied(p.x, p.z)) continue
    if (Math.abs(p.x) < 10) continue // gateway corridors
    const pdx = p.x + 104
    const pdz = p.z + 42
    if (pdx * pdx + pdz * pdz < 30 * 30) continue // pond
    out.push({ id: `belt-${placed}`, position: [p.x, 0, p.z], scale: 0.6 + rng() * 0.6 })
    placed++
  }
  return out
}

// ─── Occupancy test ──────────────────────────────────────────────────────────
// Ground's grass/flower scatter calls this so turf never pokes through lanes,
// piazzas, sand, or boardwalk.
const ALL_LANES: RoadSeg[] = [...DIAG_EXT_SEGS]

function thetaOf(x: number, z: number): number {
  let t = Math.atan2(z, x)
  if (t < 0) t += Math.PI * 2
  return t
}

export function isOutskirtsOccupied(x: number, z: number): boolean {
  const r = Math.hypot(x, z)
  // Coast road band (carriageway + verge)
  if (Math.abs(r - COAST_ROAD_R) < COAST_ROAD_W / 2 + 3.5) return true
  // Waterfront sectors — sand and boardwalk own the shore strip
  if (r > 179) {
    const t = thetaOf(x, z)
    if (t > MARINA_T0 - 0.04 && t < MARINA_T1 + 0.04) return true
    if (t > BEACH_T0 - 0.04 && t < BEACH_T1 + 0.04) return true
  }
  // Hamlets
  for (const h of HAMLETS) {
    const dx = x - h.cx
    const dz = z - h.cz
    if (dx * dx + dz * dz < HAMLET_CLEAR * HAMLET_CLEAR) return true
  }
  // Orchards
  for (const c of ORCHARD_CENTERS) {
    const dx = x - c.x
    const dz = z - c.z
    if (dx * dx + dz * dz < ORCHARD_CLEAR * ORCHARD_CLEAR) return true
  }
  // Lanes (hamlet lanes + boulevard extensions)
  for (const s of ALL_LANES) {
    if (pointToSegDist(x, z, s.ax, s.az, s.bx, s.bz) < s.width / 2 + 2.5) return true
  }
  for (const s of HAMLET_LANES) {
    if (pointToSegDist(x, z, s.ax, s.az, s.bx, s.bz) < s.width / 2 + 2) return true
  }
  return false
}

export const BELT_TREES: OutskirtTree[] = buildBeltTrees()
export const OUTSKIRT_TREES: OutskirtTree[] = [
  ...HAMLETS.flatMap((h) => h.trees),
  ...ORCHARD_TREES,
  ...BELT_TREES,
]

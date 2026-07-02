import { PROJECTS, FILLER } from '../../data/projects'
import { LANDMARKS } from '../../data/landmarks'
import type { Project, Landmark, RoofStyle } from '../../types'
import {
  gridToWorld,
  heightFor,
  footprintFor,
  districtFor,
  resolveRoofStyle,
  polar,
  sampleCatmullRom,
  LOT,
  type District,
  type Pt,
} from './project3d'

export interface BuildingDef {
  project: Project
  position: [number, number, number]
  height: number
  footprint: number
  district: District
  roofStyle: RoofStyle
}

// Vertical scale of the world group in 2D/iso view (1 = full 3D height).
export const ISO_FLATTEN = 0.3

export const BUILDINGS: BuildingDef[] = PROJECTS.map((p) => {
  const height = heightFor(p.gx, p.gy, p.scale, p.height)
  const footprint = footprintFor(p.scale, p.footprint)
  return {
    project: p,
    position: gridToWorld(p.gx, p.gy),
    height,
    footprint,
    district: districtFor(p.gy, p.roofStyle),
    roofStyle: resolveRoofStyle(height, p.roofStyle),
  }
})

export const HUB_POS = gridToWorld(0, 0)

// --- Civic landmarks ---------------------------------------------------------
export interface LandmarkDef {
  landmark: Landmark
  position: [number, number, number]
  footprint: number
}

export const LANDMARK_DEFS: LandmarkDef[] = LANDMARKS.map((l) => ({
  landmark: l,
  position: gridToWorld(l.gx, l.gy),
  footprint: l.kind === 'stadium' ? 12 : 7,
}))

// Civic clock tower — a fixed monument near the plaza that keeps Hyderabad time.
export const CLOCK_TOWER = { position: [LOT * 3, 0, LOT * 2] as [number, number, number], footprint: 5 }

// Lighthouse — stands near The Past gateway (z ≈ 175), throws a rotating beam
// at night. Placed slightly off the central avenue so the gateway label reads.
export const LIGHTHOUSE = { position: [22, 0, 158] as [number, number, number], footprint: 7 }

// Fixed plots the roads must avoid and scenery must not occupy.
interface Anchor {
  x: number
  z: number
  clearance: number
}
const ANCHORS: Anchor[] = [
  ...BUILDINGS.map((b) => ({ x: b.position[0], z: b.position[2], clearance: b.footprint * 0.5 + 3 })),
  ...LANDMARK_DEFS.map((l) => ({ x: l.position[0], z: l.position[2], clearance: l.footprint * 0.5 + 3 })),
  { x: CLOCK_TOWER.position[0], z: CLOCK_TOWER.position[2], clearance: CLOCK_TOWER.footprint * 0.5 + 1 },
  { x: LIGHTHOUSE.position[0],  z: LIGHTHOUSE.position[2],  clearance: LIGHTHOUSE.footprint * 0.5 + 2 },
]

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// --- Organic road network: straight cardinal avenues + deformed rings + bowed
// spokes, all centered on the roundabout. Buildings keep their grid positions;
// conflicting road segments are dropped so the road skirts each plot. ----------
export interface RoadSeg {
  ax: number
  az: number
  bx: number
  bz: number
  width: number
}

export interface RoadPath {
  id: string
  kind: 'avenue' | 'ring' | 'spoke'
  pts: Pt[]
  width: number
  closed: boolean
}

export interface Parcel {
  id: string
  cx: number
  cz: number
  ringIndex: number
  sectorIndex: number
  rInner: number
  rOuter: number
  thetaMid: number
  approxW: number
  approxD: number
  occupied: boolean
}

const PLAZA_R = 14
export const RING_RADII = [30, 60, 90]
export const RING_ROAD_W = 3.8   // width of each ring road (= STREET_W)
const SECTORS = 12
const OUTER = 96
const AVENUE_W = 5.5
const STREET_W = RING_ROAD_W

function buildRoadNetwork(): { roads: RoadPath[]; parcels: Parcel[] } {
  const rng = mulberry32(13371)
  const roads: RoadPath[] = []

  // Avenues — the named cardinals. Split around the central roundabout so they
  // FEED it from four sides instead of crossing straight through the monument
  // (which left two coplanar road slabs fighting over the plaza centre).
  // East/west avenues terminate ON the outer ring (junction), not past it;
  // the north/south pair runs to OUTER where the gateway fades take over.
  const RING_END = 92
  roads.push({ id: 'ave-x-w', kind: 'avenue', width: AVENUE_W, closed: false, pts: [{ x: -RING_END, z: 0 }, { x: -PLAZA_R, z: 0 }] })
  roads.push({ id: 'ave-x-e', kind: 'avenue', width: AVENUE_W, closed: false, pts: [{ x: PLAZA_R, z: 0 }, { x: RING_END, z: 0 }] })
  roads.push({ id: 'ave-z-n', kind: 'avenue', width: AVENUE_W, closed: false, pts: [{ x: 0, z: -OUTER }, { x: 0, z: -PLAZA_R }] })
  roads.push({ id: 'ave-z-s', kind: 'avenue', width: AVENUE_W, closed: false, pts: [{ x: 0, z: PLAZA_R }, { x: 0, z: OUTER }] })

  // Rings — jittered closed loops (organic, not perfect circles).
  RING_RADII.forEach((R, ri) => {
    const ctrl: Pt[] = []
    for (let i = 0; i < SECTORS; i++) {
      const theta = (i / SECTORS) * Math.PI * 2
      ctrl.push(polar(0, 0, R + (rng() - 0.5) * 5, theta))
    }
    roads.push({ id: `ring-${ri}`, kind: 'ring', width: STREET_W, closed: true, pts: sampleCatmullRom(ctrl, 9, true) })
  })

  // Diagonal grand boulevards — four clean 45-degree avenues radiating from
  // the plaza, like La Diagonal in Barcelona. Perfectly straight (no bow) so
  // they read as deliberate planned infrastructure.
  const diagonalAngles = [45, 135, 225, 315].map((d) => (d * Math.PI) / 180)
  diagonalAngles.forEach((base, si) => {
    const pts: Pt[] = []
    const steps = 12
    // End exactly on the outer ring so each boulevard terminates in a proper
    // junction instead of a stub trailing into the grass.
    const DIAG_END = 92
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const r = PLAZA_R + t * (DIAG_END - PLAZA_R)
      pts.push(polar(0, 0, r, base))
    }
    roads.push({ id: `diag-${si}`, kind: 'spoke', width: AVENUE_W, closed: false, pts })
  })

  // Parcels — annular sectors between consecutive rings.
  const parcels: Parcel[] = []
  const step = (Math.PI * 2) / SECTORS
  for (let b = 0; b < RING_RADII.length - 1; b++) {
    const rInner = RING_RADII[b]
    const rOuter = RING_RADII[b + 1]
    const rMid = (rInner + rOuter) / 2
    for (let s = 0; s < SECTORS; s++) {
      const thetaMid = (s + 0.5) * step
      const c = polar(0, 0, rMid, thetaMid)
      const occupied = ANCHORS.some((a) => {
        const ar = Math.hypot(a.x, a.z)
        let at = Math.atan2(a.z, a.x)
        if (at < 0) at += Math.PI * 2
        return ar >= rInner && ar < rOuter && at >= s * step && at < (s + 1) * step
      })
      parcels.push({
        id: `p-${b}-${s}`,
        cx: c.x,
        cz: c.z,
        ringIndex: b,
        sectorIndex: s,
        rInner,
        rOuter,
        thetaMid,
        approxW: rOuter - rInner,
        approxD: rMid * step,
        occupied,
      })
    }
  }

  return { roads, parcels }
}

function pathToSegs(p: RoadPath): RoadSeg[] {
  const segs: RoadSeg[] = []
  const n = p.closed ? p.pts.length : p.pts.length - 1
  for (let i = 0; i < n; i++) {
    const a = p.pts[i]
    const b = p.pts[(i + 1) % p.pts.length]
    segs.push({ ax: a.x, az: a.z, bx: b.x, bz: b.z, width: p.width })
  }
  return segs
}

// Clip a segment against the plot-clearance discs. The old behaviour DROPPED
// any segment that grazed a plot, which punched visible holes in the diagonal
// boulevards — roads that just stopped and restarted mid-field. Instead, keep
// the parts of each segment that lie OUTSIDE every disc, so the carriageway
// runs right up to the building's forecourt and ends there deliberately (the
// walkway/apron layer bridges the last few metres to the entrance).
function clipSegToAnchors(s: RoadSeg): RoadSeg[] {
  const dx = s.bx - s.ax
  const dz = s.bz - s.az
  const len2 = dx * dx + dz * dz || 1
  const len = Math.sqrt(len2)
  const holes: Array<[number, number]> = []
  for (const a of ANCHORS) {
    const r = a.clearance + s.width * 0.5
    const t = ((a.x - s.ax) * dx + (a.z - s.az) * dz) / len2
    const d = Math.hypot(a.x - (s.ax + dx * t), a.z - (s.az + dz * t))
    if (d >= r) continue // segment's line misses this disc
    const half = Math.sqrt(r * r - d * d) / len
    const t0 = t - half
    const t1 = t + half
    if (t1 <= 0 || t0 >= 1) continue
    holes.push([Math.max(0, t0), Math.min(1, t1)])
  }
  if (holes.length === 0) return [s]
  holes.sort((h1, h2) => h1[0] - h2[0])
  const merged: Array<[number, number]> = []
  for (const h of holes) {
    const last = merged[merged.length - 1]
    if (last && h[0] <= last[1]) last[1] = Math.max(last[1], h[1])
    else merged.push([h[0], h[1]])
  }
  const out: RoadSeg[] = []
  const MIN_LEN = 1.6 // drop unreadable slivers
  let cur = 0
  for (const [h0, h1] of merged) {
    if ((h0 - cur) * len >= MIN_LEN)
      out.push({ ax: s.ax + dx * cur, az: s.az + dz * cur, bx: s.ax + dx * h0, bz: s.az + dz * h0, width: s.width })
    cur = Math.max(cur, h1)
  }
  if ((1 - cur) * len >= MIN_LEN)
    out.push({ ax: s.ax + dx * cur, az: s.az + dz * cur, bx: s.bx, bz: s.bz, width: s.width })
  return out
}

const NETWORK = buildRoadNetwork()
export const ROADS: RoadPath[] = NETWORK.roads
export const PARCELS: Parcel[] = NETWORK.parcels
export const ROAD_SEGS: RoadSeg[] = ROADS.flatMap(pathToSegs).flatMap(clipSegToAnchors)
// Non-ring segments only — rings are rendered as flat ringGeometry in Roads.tsx for smooth circles.
export const ROAD_SEGS_DRAW: RoadSeg[] = ROADS.filter((r) => r.kind !== 'ring').flatMap(pathToSegs).flatMap(clipSegToAnchors)

// --- Connector driveways: tie every building & landmark to the road network ---
// Buildings live on a square grid; the roads are a polar ring/spoke system, so
// most plots don't sit on a road. For each plot we drop a short footpath from
// its edge to the closest point on the nearest road, so nothing reads as
// "floating" and the network visibly reaches every door.
const CONNECTOR_W = 2.8

function nearestPointOnSegs(px: number, pz: number, segs: RoadSeg[]): { x: number; z: number; dist: number } {
  let bx = 0
  let bz = 0
  let best = Infinity
  for (const s of segs) {
    const dx = s.bx - s.ax
    const dz = s.bz - s.az
    const len2 = dx * dx + dz * dz || 1
    let t = ((px - s.ax) * dx + (pz - s.az) * dz) / len2
    t = Math.max(0, Math.min(1, t))
    const cx = s.ax + dx * t
    const cz = s.az + dz * t
    const d = Math.hypot(px - cx, pz - cz)
    if (d < best) {
      best = d
      bx = cx
      bz = cz
    }
  }
  return { x: bx, z: bz, dist: best }
}

function buildConnectors(): RoadSeg[] {
  const out: RoadSeg[] = []
  const plots = [
    ...BUILDINGS.map((b) => ({ x: b.position[0], z: b.position[2], r: b.footprint * 0.5 })),
    ...LANDMARK_DEFS.map((l) => ({ x: l.position[0], z: l.position[2], r: l.footprint * 0.5 })),
  ]
  for (const p of plots) {
    const near = nearestPointOnSegs(p.x, p.z, ROAD_SEGS)
    const dx = near.x - p.x
    const dz = near.z - p.z
    const d = Math.hypot(dx, dz)
    if (d < p.r + 1) continue // already meets a road
    if (d > 52) continue // unreachably far — don't draw a runway across the map
    const ux = dx / d
    const uz = dz / d
    out.push({
      ax: p.x + ux * p.r, // start flush at the building edge
      az: p.z + uz * p.r,
      bx: near.x, // end on the road centre-line (forms a clean T-join)
      bz: near.z,
      width: CONNECTOR_W,
    })
  }
  return out
}

export const CONNECTOR_SEGS: RoadSeg[] = buildConnectors()

// Gateway avenues — the main Z axis runs out of the city in both directions:
// the future recedes ahead (−Z, into the fog), the past trails behind (+Z).
// Kept out of ROAD_SEGS so they don't pull the camera bounds or spawn traffic.
export const GATEWAY_LEN = 200
export const GATEWAY_SEGS: RoadSeg[] = [
  { ax: 0, az: -OUTER, bx: 0, bz: -GATEWAY_LEN, width: AVENUE_W },
  { ax: 0, az: OUTER, bx: 0, bz: GATEWAY_LEN, width: AVENUE_W },
]
// World-space label anchors for the two gateway ends (near the reachable edge so
// they read at the avenue's vanishing point before fading into the fog beyond).
export const GATEWAYS = [
  { id: 'future', label: 'The Future', z: -175 },
  { id: 'past', label: 'The Past', z: 175 },
] as const

// --- Richer city: grey scenery buildings filling empty parcels ---------------
export interface SceneryDef {
  id: string
  position: [number, number, number]
  w: number
  d: number
  h: number
  rotationY: number
  greyIndex: number
}

function buildScenery(): SceneryDef[] {
  const rng = mulberry32(990126)
  const out: SceneryDef[] = []
  for (const parcel of PARCELS) {
    if (parcel.occupied) continue
    if (rng() < 0.12) continue
    const count = 2 + Math.floor(rng() * 3) // 2..4 per parcel — a denser Amalfi town
    for (let i = 0; i < count; i++) {
      const r = (parcel.rInner + parcel.rOuter) / 2 + (rng() - 0.5) * parcel.approxW * 0.75
      const theta = parcel.thetaMid + (rng() - 0.5) * ((parcel.approxD * 0.75) / Math.max(parcel.rInner, 1))
      const p = polar(0, 0, r, theta)
      const w = 2.4 + rng() * 2.4
      const d = w * (0.7 + rng() * 0.3)
      const coreFactor = 1 - parcel.ringIndex * 0.24
      const h = Math.min(24, (4 + rng() * 8) * (0.85 + coreFactor * 0.7))
      out.push({
        id: `sc-${parcel.id}-${i}`,
        position: [p.x, 0, p.z],
        w,
        d,
        h,
        rotationY: theta + Math.PI / 2 + (rng() - 0.5) * 0.5,
        greyIndex: Math.floor(rng() * 5),
      })
    }
  }
  return out
}

export const SCENERY: SceneryDef[] = buildScenery()

// --- Decorative fabric: FILLER + procedural fill of empty lots ---------------
export type PropKind = 'tree' | 'rock' | 'house'

export interface PropDef {
  id: string
  kind: PropKind
  position: [number, number, number]
  rotationY: number
  scale: number
}

const GRID_STEPS = [-6, -4, -2, 0, 2, 4, 6]

// Exclusion zone around the central plaza — trees inside this radius are skipped.
// Slightly larger than TERRACE_R=27 so props from inner grid positions can't scatter in.
const PROP_EXCL_R2 = 30 * 30

function buildProps(): PropDef[] {
  const rng = mulberry32(20260526)
  const occupied = new Set<string>([
    ...PROJECTS.map((p) => `${p.gx},${p.gy}`),
    ...LANDMARKS.map((l) => `${l.gx},${l.gy}`),
    '0,0',
  ])
  const props: PropDef[] = []

  // Anchored greenery from the existing FILLER data.
  for (const f of FILLER) {
    occupied.add(`${f.gx},${f.gy}`)
    const [x, , z] = gridToWorld(f.gx, f.gy)
    const kind: PropKind = f.glyph === 'rocks' ? 'rock' : 'tree'
    const count = kind === 'tree' ? 3 : 2
    for (let i = 0; i < count; i++) {
      const px = x + (rng() - 0.5) * LOT * 0.9
      const pz = z + (rng() - 0.5) * LOT * 0.9
      const ry = rng() * Math.PI * 2
      const sc = 0.7 + rng() * 0.6
      if (px * px + pz * pz < PROP_EXCL_R2) continue
      props.push({ id: `${f.id}-${i}`, kind, position: [px, 0, pz], rotationY: ry, scale: sc })
    }
  }

  // Procedural greenery on remaining empty lots (skip the avenue axes).
  for (const gx of GRID_STEPS) {
    for (const gy of GRID_STEPS) {
      if (gx === 0 || gy === 0) continue
      if (occupied.has(`${gx},${gy}`)) continue
      if (rng() < 0.6) continue
      const [x, , z] = gridToWorld(gx, gy)
      const count = 1 + Math.floor(rng() * 2)
      for (let i = 0; i < count; i++) {
        const px = x + (rng() - 0.5) * LOT
        const pz = z + (rng() - 0.5) * LOT
        const ry = rng() * Math.PI * 2
        const sc = 0.6 + rng() * 0.5
        if (px * px + pz * pz < PROP_EXCL_R2) continue
        props.push({ id: `t-${gx}-${gy}-${i}`, kind: 'tree', position: [px, 0, pz], rotationY: ry, scale: sc })
      }
    }
  }
  return props
}

export const PROPS: PropDef[] = buildProps()

// --- Skyline view: buildings packed into a single neat horizontal row ---------
// Sorted left-to-right by natural world-X so the simple←→complex axis is
// preserved in the silhouette. All buildings move to Z = 0 so the camera
// can read the full skyline head-on, Marine-Drive style.
function buildSkylinePositions(): Map<string, number> {
  const sorted = [...BUILDINGS].sort((a, b) => a.position[0] - b.position[0])
  const GAP = 2.5
  const totalW = sorted.reduce((s, b) => s + b.footprint + GAP, -GAP)
  let curX = -totalW / 2
  const out = new Map<string, number>()
  for (const b of sorted) {
    out.set(b.project.id, curX + b.footprint / 2)
    curX += b.footprint + GAP
  }
  return out
}
export const SKYLINE_POSITIONS = buildSkylinePositions()

// --- Camera pan bounds -------------------------------------------------------
function computeBounds() {
  const xs: number[] = []
  const zs: number[] = []
  for (const b of BUILDINGS) {
    xs.push(b.position[0])
    zs.push(b.position[2])
  }
  for (const s of ROAD_SEGS) {
    xs.push(s.ax, s.bx)
    zs.push(s.az, s.bz)
  }
  const pad = 14
  // Extend the Z range so the camera can follow the gateway avenues a little way
  // out of the city; their far ends still recede unreachably into the fog.
  const gatewayReach = 40
  return {
    minX: Math.min(...xs) - pad,
    maxX: Math.max(...xs) + pad,
    minZ: Math.min(...zs) - pad - gatewayReach,
    maxZ: Math.max(...zs) + pad + gatewayReach,
  }
}

export const CITY_BOUNDS = computeBounds()
export const CITY_RADIUS = Math.max(
  CITY_BOUNDS.maxX - CITY_BOUNDS.minX,
  CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ,
)

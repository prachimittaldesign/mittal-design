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
  pointToSegDist,
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

// Fixed plots the roads must avoid and scenery must not occupy.
interface Anchor {
  x: number
  z: number
  clearance: number
}
const ANCHORS: Anchor[] = [
  ...BUILDINGS.map((b) => ({ x: b.position[0], z: b.position[2], clearance: b.footprint * 0.5 + 3 })),
  ...LANDMARK_DEFS.map((l) => ({ x: l.position[0], z: l.position[2], clearance: l.footprint * 0.5 + 3 })),
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

const PLAZA_R = 9
const RING_RADII = [15, 30, 45, 60]
const SECTORS = 12
const OUTER = 64
const AVENUE_W = 3.6
const STREET_W = 2.0

function buildRoadNetwork(): { roads: RoadPath[]; parcels: Parcel[] } {
  const rng = mulberry32(13371)
  const roads: RoadPath[] = []

  // Avenues — the two straight axes through the roundabout (the named cardinals).
  roads.push({ id: 'ave-x', kind: 'avenue', width: AVENUE_W, closed: false, pts: [{ x: -OUTER, z: 0 }, { x: OUTER, z: 0 }] })
  roads.push({ id: 'ave-z', kind: 'avenue', width: AVENUE_W, closed: false, pts: [{ x: 0, z: -OUTER }, { x: 0, z: OUTER }] })

  // Rings — jittered closed loops (organic, not perfect circles).
  RING_RADII.forEach((R, ri) => {
    const ctrl: Pt[] = []
    for (let i = 0; i < SECTORS; i++) {
      const theta = (i / SECTORS) * Math.PI * 2
      ctrl.push(polar(0, 0, R + (rng() - 0.5) * 5, theta))
    }
    roads.push({ id: `ring-${ri}`, kind: 'ring', width: STREET_W, closed: true, pts: sampleCatmullRom(ctrl, 5, true) })
  })

  // Spokes — non-cardinal radials with a gentle lateral bow.
  const spokeAngles = [30, 60, 120, 150, 210, 240, 300, 330].map((d) => (d * Math.PI) / 180)
  spokeAngles.forEach((base, si) => {
    const pts: Pt[] = []
    const steps = 6
    const bow = (rng() - 0.5) * 0.18
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const r = PLAZA_R + t * (OUTER - PLAZA_R)
      pts.push(polar(0, 0, r, base + Math.sin(t * Math.PI) * bow))
    }
    roads.push({ id: `spoke-${si}`, kind: 'spoke', width: STREET_W, closed: false, pts })
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

function segClearsAnchors(s: RoadSeg): boolean {
  for (const a of ANCHORS) {
    if (pointToSegDist(a.x, a.z, s.ax, s.az, s.bx, s.bz) < a.clearance + s.width * 0.5) return false
  }
  return true
}

const NETWORK = buildRoadNetwork()
export const ROADS: RoadPath[] = NETWORK.roads
export const PARCELS: Parcel[] = NETWORK.parcels
export const ROAD_SEGS: RoadSeg[] = ROADS.flatMap(pathToSegs).filter(segClearsAnchors)

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
    const count = 2 + Math.floor(rng() * 3) // 2..4 per parcel
    for (let i = 0; i < count; i++) {
      const r = (parcel.rInner + parcel.rOuter) / 2 + (rng() - 0.5) * parcel.approxW * 0.6
      const theta = parcel.thetaMid + (rng() - 0.5) * ((parcel.approxD * 0.6) / Math.max(parcel.rInner, 1))
      const p = polar(0, 0, r, theta)
      const w = 2.2 + rng() * 2.0
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
      props.push({
        id: `${f.id}-${i}`,
        kind,
        position: [x + (rng() - 0.5) * LOT * 0.9, 0, z + (rng() - 0.5) * LOT * 0.9],
        rotationY: rng() * Math.PI * 2,
        scale: 0.7 + rng() * 0.6,
      })
    }
  }

  // Procedural greenery on remaining empty lots (skip the avenue axes).
  for (const gx of GRID_STEPS) {
    for (const gy of GRID_STEPS) {
      if (gx === 0 || gy === 0) continue
      if (occupied.has(`${gx},${gy}`)) continue
      if (rng() < 0.4) continue
      const [x, , z] = gridToWorld(gx, gy)
      const count = 2 + Math.floor(rng() * 2)
      for (let i = 0; i < count; i++) {
        props.push({
          id: `t-${gx}-${gy}-${i}`,
          kind: 'tree',
          position: [x + (rng() - 0.5) * LOT, 0, z + (rng() - 0.5) * LOT],
          rotationY: rng() * Math.PI * 2,
          scale: 0.6 + rng() * 0.5,
        })
      }
    }
  }
  return props
}

export const PROPS: PropDef[] = buildProps()

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
  return {
    minX: Math.min(...xs) - pad,
    maxX: Math.max(...xs) + pad,
    minZ: Math.min(...zs) - pad,
    maxZ: Math.max(...zs) + pad,
  }
}

export const CITY_BOUNDS = computeBounds()
export const CITY_RADIUS = Math.max(
  CITY_BOUNDS.maxX - CITY_BOUNDS.minX,
  CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ,
)

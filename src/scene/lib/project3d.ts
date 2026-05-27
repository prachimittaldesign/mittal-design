import type { RoofStyle } from '../../types'

// Grid → 3D. Three is Y-up; the city sits on the X/Z ground plane. The
// isometric "look" comes from the camera angle, NOT from foreshortening here.
//   gx = complexity  (+right)  → world +X
//   gy = enterprise(+)/consumer(-) → world -Z (enterprise reads "north/away")
export const LOT = 8

export function gridToWorld(gx: number, gy: number): [number, number, number] {
  return [gx * LOT, 0, -gy * LOT]
}

export type District = 'glass' | 'warm'

// Importance (scale) drives plan bulk.
export function footprintFor(scale: number, override?: number): number {
  return override ?? 4.5 + scale * 1.6
}

// Locked meaning rule: HEIGHT grows with COMPLEXITY (|gx|); the enterprise side
// reads as tall glass towers, the consumer side as low, warm buildings.
export function heightFor(gx: number, gy: number, scale: number, override?: number): number {
  if (override !== undefined) return override
  const complexity = Math.abs(gx)
  const base = 5 + complexity * 2.6
  const enterpriseBoost = gy > 0 ? 1.55 : 1.0
  const consumerDamp = gy < 0 ? 0.6 : 1.0
  const importance = 0.85 + scale * 0.4
  return base * enterpriseBoost * consumerDamp * importance
}

export function districtFor(gy: number, roofStyle?: RoofStyle): District {
  if (roofStyle === 'pitched') return 'warm' // the cottage stays warm, never glass
  return gy > 0 ? 'glass' : 'warm'
}

// Tall towers get a tiered silhouette; short buildings stay flat-roofed.
export function resolveRoofStyle(height: number, explicit?: RoofStyle): RoofStyle {
  if (explicit) return explicit
  return height > 26 ? 'setback' : 'flat'
}

// --- Organic-road geometry helpers (pure) ------------------------------------
export interface Pt {
  x: number
  z: number
}

export function polar(cx: number, cz: number, r: number, theta: number): Pt {
  return { x: cx + Math.cos(theta) * r, z: cz + Math.sin(theta) * r }
}

// Distance from point (px,pz) to segment (a→b). Used to keep roads clear of
// the fixed project/landmark plots.
export function pointToSegDist(
  px: number,
  pz: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const dx = bx - ax
  const dz = bz - az
  const len2 = dx * dx + dz * dz || 1
  let t = ((px - ax) * dx + (pz - az) * dz) / len2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t))
}

function catmull(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t
  const t3 = t2 * t
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
  return { x: f(p0.x, p1.x, p2.x, p3.x), z: f(p0.z, p1.z, p2.z, p3.z) }
}

// Sample a (closed) CatmullRom spline through control points → smooth polyline.
export function sampleCatmullRom(ctrl: Pt[], segmentsPerSpan: number, closed: boolean): Pt[] {
  const n = ctrl.length
  const out: Pt[] = []
  const spans = closed ? n : n - 1
  for (let i = 0; i < spans; i++) {
    const p0 = ctrl[(i - 1 + n) % n]
    const p1 = ctrl[i % n]
    const p2 = ctrl[(i + 1) % n]
    const p3 = ctrl[(i + 2) % n]
    for (let s = 0; s < segmentsPerSpan; s++) {
      out.push(catmull(p0, p1, p2, p3, s / segmentsPerSpan))
    }
  }
  if (!closed) out.push(ctrl[n - 1])
  return out
}

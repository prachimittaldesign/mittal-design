import { BIOME } from '../../lib/iso'
import type { MapLayer, Ownership, Project, Quadrant } from '../../types'
import type { District } from './project3d'

// ─── Atmosphere ─────────────────────────────────────────────────────────────
// Fog horizon colour – matches the Sky component's near-horizon hue at sunset.
export const SKY = '#c9a87c'          // warm amber horizon for fog
export const GROUND   = '#b8935a'     // rich honey-amber earth
export const PLAZA    = '#c9a06a'     // terracotta plaza
export const ROAD     = '#dcc89a'     // cream/sand roads
export const ROAD_EDGE = '#c4a880'    // slightly darker road edge

// ─── Project buildings ──────────────────────────────────────────────────────
// Two clear visual identities: deep ocean-blue enterprise vs warm coral consumer
export const BODY = {
  glass: '#1e4976',   // deep midnight-ocean blue — enterprise glass towers
  warm:  '#c05a35',   // rich terracotta-coral — consumer buildings
} as const

export const ROOF = {
  glass: '#152f52',   // darker navy cap
  warm:  '#943e24',   // deep burnt-sienna
} as const

// Emissive window glow colours — warm amber sunlight pouring out
export const GLASS_WINDOW = '#a8d4ff'  // cool blue tinted windows
export const WARM_WINDOW  = '#ffa850'  // warm amber windows

export function bodyColor(d: District): string { return BODY[d] }
export function roofColor(d: District): string { return ROOF[d] }

// District tints stay close to the 2D biome but amped up in saturation
export function districtTint(q: Quadrant): string {
  return BIOME[q].fill
}

// Scenery buildings — deeper, more varied, richer than before
export const SCENERY_BODY = ['#4a7a6d', '#5a6e9a', '#8a5a4e', '#6a7a4a', '#7a5a7a']
export const DIM_GREY = '#5a5a6a'

// ─── Map layer colours ───────────────────────────────────────────────────────
// Effort ramp — vivid teal to deep indigo
export const EFFORT_RAMP = ['#6fcfb0', '#3ab88a', '#1a9470', '#0e6e8a', '#0a4a6e']

export const OWNERSHIP_COLORS: Record<Ownership, string> = {
  solo:    '#e05a3a',  // vibrant coral-red
  lead:    '#e8a020',  // rich amber-gold
  collab:  '#3a72cc',  // bright cobalt blue
  support: '#7a8a9a',  // muted blue-grey
}

export function layerColor(project: Project, layer: MapLayer): string {
  if (layer === 'effort') {
    const e = Math.min(5, Math.max(1, project.effort ?? 3))
    return EFFORT_RAMP[e - 1]
  }
  return OWNERSHIP_COLORS[project.ownership ?? 'support']
}

// ─── Decorative fabric ───────────────────────────────────────────────────────
// Very vivid, saturated foliage — like a Miyazaki forest
export const FOLIAGE = ['#2db84d', '#3acc5a', '#1aa038', '#45c464', '#25d050']
export const TRUNK   = '#7a4a2a'
export const ROCK    = '#8a7a6e'
export const HOUSE   = ['#e85a4a', '#f0a830', '#4a90d4', '#5ab870', '#d45a90']  // vivid house colours
export const CAR     = ['#e03a2a', '#2a70e0', '#e8a820', '#2ab860', '#e040b0', '#8020e0']

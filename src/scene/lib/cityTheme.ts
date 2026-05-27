import { BIOME, PAPER } from '../../lib/iso'
import type { MapLayer, Ownership, Project, Quadrant } from '../../types'
import type { District } from './project3d'

// Atmosphere — SKY stays in the warm paper family so the DayNight system can
// ease the 3D background/fog from this daytime base toward dusk/night.
export const SKY = PAPER
export const GROUND = '#4a5736'   // muted sage-green meadow base
export const PLAZA = '#3f4a30'    // calm moss circle
export const ROAD = '#d3cbb9'
export const ROAD_EDGE = '#bdb4a2'

// Project buildings — muted, sophisticated identities. Desaturated slate-blue
// and soft clay so the city reads calm and cohesive (not toy-bright), while the
// emissive windows still pop after dark.
export const BODY = {
  glass: '#5b7488', // muted slate-blue — enterprise glass towers
  warm: '#bb957a', // soft clay-tan — consumer buildings
} as const

export const ROOF = {
  glass: '#47596a',
  warm: '#9c7a5e',
} as const

// Emissive window glow — windows light up warm/cool and bloom after dark.
export const GLASS_WINDOW = '#a8d4ff' // cool blue enterprise windows
export const WARM_WINDOW = '#ffb866' // warm amber consumer windows

export function bodyColor(d: District): string {
  return BODY[d]
}
export function roofColor(d: District): string {
  return ROOF[d]
}

// Ground district tint pulled straight from the 2D BIOME so the 3D ground
// encodes the same Enterprise/Consumer × Simple/Complex quadrants.
export function districtTint(q: Quadrant): string {
  return BIOME[q].fill
}

// Scenery buildings — muted, flatter/darker than the project towers so the
// labelled towers still pop. + a dim grey for tag-filtered dimming.
export const SCENERY_BODY = ['#a8a294', '#b3ac9e', '#9d9788', '#bab3a4', '#a29c8e']
export const DIM_GREY = '#9a948a'

// Map layers: recolor project towers by a metric.
export const EFFORT_RAMP = ['#cfe0c3', '#9cc6a0', '#6fae8a', '#4f8fb0', '#3f6aa0'] // 1..5
export const OWNERSHIP_COLORS: Record<Ownership, string> = {
  solo: '#c0654f',
  lead: '#d89a4e',
  collab: '#5a86c9',
  support: '#9aa2ad',
}

export function layerColor(project: Project, layer: MapLayer): string {
  if (layer === 'effort') {
    const e = Math.min(5, Math.max(1, project.effort ?? 3))
    return EFFORT_RAMP[e - 1]
  }
  return OWNERSHIP_COLORS[project.ownership ?? 'support']
}

// Decorative fabric — clearly "nature/minor", never grey like a project.
export const FOLIAGE = ['#7faa5e', '#8cb86a', '#6f9d54']
export const TRUNK = '#8a6b4a'
export const ROCK = '#b7b0a2'
export const HOUSE = ['#e4cdd0', '#e9d6b8', '#dcd2c4'] // warm low houses
export const CAR = ['#c96f5a', '#5a86c9', '#e0b65a', '#6fae8a', '#cdcdd2']

// Distant terrain ringing the city — snowcap for the mesh peaks.
export const MOUNTAIN_SNOW = '#e9eadf' // soft snowcap

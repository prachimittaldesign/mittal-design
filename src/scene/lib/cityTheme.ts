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

// ─── Corporate glass tower palette ──────────────────────────────────────────
// Buildings are categorised by their first tag. Each category gets a family of
// dark tinted-glass tones: deep navy for enterprise, warm bronze for consumer,
// teal for spatial/robotics, graphite for research. Paired with roughness≈0.12
// and metalness≈0.75 so they read as genuine glass curtain walls, not stucco.
export type BuildingCategory = 'enterprise' | 'consumer' | 'spatial' | 'research'

export function buildingCategory(tags: string[]): BuildingCategory {
  const s = new Set(tags)
  if (s.has('Architecture') || s.has('Residential') || s.has('Robotics') || s.has('Spatial')) return 'spatial'
  if (s.has('Consumer') || s.has('TV') || s.has('Mobile') || s.has('Healthcare') || s.has('Social') || s.has('Fundraising') || s.has('Politics')) return 'consumer'
  if (s.has('UX Research') || s.has('Information Architecture')) return 'research'
  return 'enterprise' // Enterprise, AI, B2B, DITA, Governance, Workflow, Documents …
}

// Tight hue-families — enough variation to tell buildings apart, all dark-glass premium.
const CORP_ENTERPRISE = ['#1a3a5c', '#22446a', '#1e3d58', '#2a4870', '#243e64', '#1c3858']
const CORP_CONSUMER   = ['#5c3020', '#6a3a24', '#5e3418', '#703028', '#622e1c', '#582c18']
const CORP_SPATIAL    = ['#1a3e3a', '#224848', '#1e4040', '#2a4e4a', '#1c3c38', '#263e3e']
const CORP_RESEARCH   = ['#2a2c3e', '#303248', '#282a3c', '#2c2e44', '#26283a', '#2e3042']

const CORP_ROOF_ENTERPRISE = ['#142e4a', '#1a3858', '#12284e', '#183254']
const CORP_ROOF_CONSUMER   = ['#3a1e10', '#481e12', '#4a2614', '#3c1e0e']
const CORP_ROOF_SPATIAL    = ['#12302e', '#183838', '#143030', '#1a3c38']
const CORP_ROOF_RESEARCH   = ['#1e2038', '#22223e', '#1c1e34', '#20223c']

// Window glow — each category has a signature colour that reads in all light.
export const WINDOW_COLORS: Record<BuildingCategory, string> = {
  enterprise: '#a0c8ff', // crisp corporate sky-blue
  consumer:   '#ffb870', // warm amber-champagne
  spatial:    '#70e8d8', // bright teal-cyan
  research:   '#c8d8ff', // soft neutral blue-white
}

export function glassFacade(cat: BuildingCategory, hash: number): string {
  switch (cat) {
    case 'consumer': return CORP_CONSUMER[hash % CORP_CONSUMER.length]
    case 'spatial':  return CORP_SPATIAL[hash % CORP_SPATIAL.length]
    case 'research': return CORP_RESEARCH[hash % CORP_RESEARCH.length]
    default:         return CORP_ENTERPRISE[hash % CORP_ENTERPRISE.length]
  }
}
export function glassRoof(cat: BuildingCategory, hash: number): string {
  switch (cat) {
    case 'consumer': return CORP_ROOF_CONSUMER[hash % CORP_ROOF_CONSUMER.length]
    case 'spatial':  return CORP_ROOF_SPATIAL[hash % CORP_ROOF_SPATIAL.length]
    case 'research': return CORP_ROOF_RESEARCH[hash % CORP_ROOF_RESEARCH.length]
    default:         return CORP_ROOF_ENTERPRISE[hash % CORP_ROOF_ENTERPRISE.length]
  }
}

// ─── Amalfi Coast palette (kept for scenery / CityFill buildings) ────────────
// The town is a vivid Mediterranean cliff village (think Burano / Positano):
// saturated stucco facades in every joyful colour, terracotta roofs, and warm
// lamplit windows. The enterprise (glass) district leans to the sunny golds and
// pastels of the upper town; the consumer (warm) district takes the bold corals,
// pinks, blues and greens nearer the water. Each building self-illuminates its
// own hue a touch so the colours stay exciting against the dusk.
const AMALFI_PALE = ['#f2cf63', '#f4b85f', '#f7d98a', '#ecd06a', '#f6c878', '#8fd0c6', '#f0dca0', '#f5a65a']
const AMALFI_WARM = ['#e8533c', '#e0457a', '#ef6aa0', '#3f9bd6', '#3fae93', '#e8923a', '#c8438a', '#dd6a3a', '#9b5fc0', '#e0c64a']
export const AMALFI_ROOFS = ['#a8553a', '#b5683f', '#9c5236', '#c07a4e', '#94472f']
export const AMALFI_WINDOW = '#ffcf8a' // warm lamplit windows

// Deterministic facade colour for a building from its hash + district.
export function amalfiFacade(d: District, hash: number): string {
  const pal = d === 'glass' ? AMALFI_PALE : AMALFI_WARM
  return pal[hash % pal.length]
}
export function amalfiRoof(hash: number): string {
  return AMALFI_ROOFS[hash % AMALFI_ROOFS.length]
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

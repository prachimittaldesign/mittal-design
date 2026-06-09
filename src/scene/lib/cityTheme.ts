import { BIOME, PAPER } from '../../lib/iso'
import type { MapLayer, Ownership, Project, Quadrant } from '../../types'
import type { District } from './project3d'

// Atmosphere — SKY stays in the warm paper family so the DayNight system can
// ease the 3D background/fog from this daytime base toward dusk/night.
export const SKY = PAPER
export const GROUND = '#566b3c'   // lush Mediterranean meadow green
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
// One cohesive cool-blue / silver-glass family — like a modern financial
// district photographed under a Mediterranean sky. All buildings sit in the
// same chic tonal range; category just shifts the temperature subtly so the
// skyline reads as one mature corporate ensemble, not a colour-block grid.
//   Enterprise → silver-blue mid-tone   (the city's "default" look)
//   Consumer   → slightly warmer pewter
//   Spatial    → cool teal-leaning grey
//   Research   → near-graphite cool grey
// Pair with roughness≈0.06 + metalness≈0.95 + envMapIntensity≈1.4 for a true
// mirror-glass curtain wall that picks up the live sky and clouds.
export type BuildingCategory = 'enterprise' | 'consumer' | 'spatial' | 'research'

export function buildingCategory(tags: string[]): BuildingCategory {
  const s = new Set(tags)
  if (s.has('Architecture') || s.has('Residential') || s.has('Robotics') || s.has('Spatial')) return 'spatial'
  if (s.has('Consumer') || s.has('TV') || s.has('Mobile') || s.has('Healthcare') || s.has('Social') || s.has('Fundraising') || s.has('Politics')) return 'consumer'
  if (s.has('UX Research') || s.has('Information Architecture')) return 'research'
  return 'enterprise'
}

// Every building reads as sleek cool-blue curtain-wall glass — the chic
// mirror-glass skyline that reflects the live sky and clouds.
export function isGlassTower(_cat: BuildingCategory, _height: number): boolean {
  return true
}

// Warm sunlit stucco families per category — every family vibrant but cohesive,
// like the pastel houses stacked up the Amalfi cliffs.
//   consumer  → bold lively waterfront: coral, peach, rose, soft blue
//   spatial   → garden tones: sage, soft teal, terracotta, butter
//   research  → calm creams, butter-yellows, warm whites
//   enterprise→ sunny golds & pale stone (the non-tower ones)
const STUCCO_CONSUMER   = ['#ec9f7e', '#e9b3a0', '#eec0bb', '#f0c194', '#e8a07a', '#dfa6b0', '#f2cda3', '#e59a86']
const STUCCO_SPATIAL    = ['#cdd3a8', '#b9cdbf', '#a9c4cc', '#e0a878', '#d8c48a', '#c2cba0', '#a8c0b4', '#e6c78a']
const STUCCO_RESEARCH   = ['#f4ecdc', '#f2e0b8', '#eed8a4', '#f3e6c8', '#ecdcb0', '#f5ecd2', '#f0e2bc']
const STUCCO_ENTERPRISE = ['#f2d894', '#eecb78', '#f0dca0', '#ecd28a', '#f4e0a8', '#e8c878']

// Terracotta roof family — shared by all stucco buildings.
const TERRACOTTA = ['#b5683f', '#a8553a', '#c0703a', '#9c5236', '#c98a52', '#ab5e38']

// Warm lamplit windows for stucco; cool sky-blue for the glass towers.
export const STUCCO_WINDOW = '#ffd89a'
export const GLASS_TOWER_WINDOW = '#bcd8f4'

export function facadeColor(cat: BuildingCategory, hash: number): string {
  switch (cat) {
    case 'consumer': return STUCCO_CONSUMER[hash % STUCCO_CONSUMER.length]
    case 'spatial':  return STUCCO_SPATIAL[hash % STUCCO_SPATIAL.length]
    case 'research': return STUCCO_RESEARCH[hash % STUCCO_RESEARCH.length]
    default:         return STUCCO_ENTERPRISE[hash % STUCCO_ENTERPRISE.length]
  }
}
export function stuccoRoof(hash: number): string {
  return TERRACOTTA[hash % TERRACOTTA.length]
}

// Sleek curtain-wall glass, tinted by category so each district reads as its
// own family while staying cohesive and chic:
//   enterprise → cool steel blue
//   consumer   → warm aqua / cyan
//   spatial    → teal-green
//   research   → indigo-violet
const GLASS_TINTS: Record<BuildingCategory, string[]> = {
  enterprise: ['#5a7494', '#647e9c', '#52708e', '#6884a0', '#5c7896'],
  consumer:   ['#4e8a9a', '#589aa4', '#46808e', '#5ca0aa', '#4a8694'],
  spatial:    ['#4f8f7c', '#5a9a86', '#458072', '#5ea088', '#4a8a78'],
  research:   ['#6a6ea0', '#7478a6', '#5e6498', '#7c80aa', '#646a9c'],
}
const GLASS_ROOFS: Record<BuildingCategory, string[]> = {
  enterprise: ['#3a4e68', '#42566e', '#344862', '#3e526a'],
  consumer:   ['#2e5460', '#34606a', '#2a4e58', '#385c64'],
  spatial:    ['#2e5a4c', '#346254', '#2a5246', '#385e50'],
  research:   ['#3e3e68', '#46466e', '#383862', '#42426a'],
}
export function glassFacade(cat: BuildingCategory, hash: number): string {
  const pal = GLASS_TINTS[cat]
  return pal[hash % pal.length]
}
export function glassRoof(cat: BuildingCategory, hash: number): string {
  const pal = GLASS_ROOFS[cat]
  return pal[hash % pal.length]
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

// Warm Amalfi filler-house palette — sunlit pastel stucco + terracotta roofs,
// plus the white trim and ironwork shared across the backdrop town.
export const SCENERY_AMALFI = [
  '#f4ecdc', '#f2d9b0', '#eec9a0', '#ecb89a', '#e8a99a', '#dfa6b0',
  '#cdd3a8', '#b9cdbf', '#a9c4cc', '#f0d68a', '#e9b3a0', '#f3e0bc',
]
export const SCENERY_ROOFS = ['#b5683f', '#a8553a', '#c0703a', '#9c5236', '#c98a52', '#ab5e38']
export const SCENERY_TRIM = '#f4eee2'
export const SCENERY_GLASS = '#3a4a50'
export const SCENERY_IRON = '#544c42'

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

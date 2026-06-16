export type Quadrant = 'q1' | 'q2' | 'q3' | 'q4'

export type GlyphName =
  | 'robot'
  | 'scanner'
  | 'servers'
  | 'connector'
  | 'book'
  | 'tv'
  | 'heart'
  | 'bubble'
  | 'ballot'
  | 'sprout'
  | 'circles'
  | 'docs'
  | 'cottage'
  | 'trees'
  | 'rocks'
  | 'sign'

export type RoofStyle = 'flat' | 'setback' | 'pitched'

export type Ownership = 'solo' | 'lead' | 'collab' | 'support'

// --- Rich case study (for the featured hero projects) ------------------------
export interface CaseHighlight {
  title: string
  body: string
}
export interface CaseStudy {
  role: string
  timeline: string
  platform: string
  /** Short status/context badge, e.g. "Live in production" or "CES 2024". */
  context?: string
  /** One punchy positioning line shown as the lead paragraph. */
  summary: string
  problem: string
  /** Scannable key decisions / contributions. */
  approach: CaseHighlight[]
  /** Outcome bullets. */
  impact: string[]
  /** Hero stat callout. */
  metric?: { value: string; label: string }
}

export interface Project {
  id: string
  gx: number
  gy: number
  scale: number
  label: string
  sub: string
  glyph: GlyphName
  desc: string
  tags: string[]
  /** Optional 3D overrides; derived from the graph position when omitted. */
  height?: number
  footprint?: number
  roofStyle?: RoofStyle
  /** Path to a logo image; when set it replaces the wordmark on the building. */
  logo?: string
  /** Map-layer metrics. effort 1 (light) .. 5 (heavy); ownership of the work. */
  effort?: number
  ownership?: Ownership
  /** Hero projects get a floating star marker + a full case-study overlay. */
  featured?: boolean
  caseStudy?: CaseStudy
  /** Screenshots shown as a carousel in the project overlay. Paths served from public/. */
  images?: Array<{ src: string; caption?: string }>
}

export interface FillerTile {
  id: string
  gx: number
  gy: number
  glyph: GlyphName
  scale?: number
}

export type GridPoint = [number, number]

export type LandmarkKind = 'cinema' | 'stadium' | 'library' | 'gallery' | 'cafe' | 'music'

export interface LandmarkItem {
  primary: string
  secondary?: string
}

export interface Landmark {
  id: string
  gx: number
  gy: number
  kind: LandmarkKind
  label: string
  blurb: string
  accent: string
  items: LandmarkItem[]
}

// --- Google-Maps-style HUD state --------------------------------------------
/** How project buildings are coloured. 'tag' highlights matches, dims the rest;
 *  'layer' recolours every building by a metric. */
export type MapLayer = 'effort' | 'ownership'
export interface Appearance {
  mode: 'default' | 'tag' | 'layer'
  activeTag: string | null
  layer: MapLayer | null
}

export type ViewMode = '3d' | 'iso' | 'skyline'

export interface LayerState {
  showLabels: boolean
  showScenery: boolean
  showLandmarks: boolean
}

export type CameraCmd = { type: 'zoomIn' | 'zoomOut' | 'recenter'; nonce: number }

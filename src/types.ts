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
  /** Figma prototype URL — shown as an embedded iframe in the case study. */
  figmaPrototype?: string
  /** Design process phases shown between problem and solution. */
  process?: Array<{ phase: string; body: string }>
  /** Scannable What / Who / How overview block (shown under the summary). */
  tldr?: { what: string; who: string; how: string }
  /** Big-number stat band — scannable headline metrics. */
  stats?: Array<{ value: string; label: string }>
  /** Capability comparison matrix — the differentiation infographic. cells align to columns. */
  comparison?: {
    title?: string
    columns: string[]
    rows: Array<{ label: string; cells: boolean[] }>
    caption?: string
  }
  /** Numbered horizontal step-flow diagram for a signature interaction. */
  flow?: {
    title: string
    caption?: string
    steps: Array<{ title: string; detail?: string }>
  }
  /** Labeled anatomy diagram — breaks a core surface into named panels. */
  anatomy?: {
    title: string
    caption?: string
    toggles?: string[]
    panels: Array<{ label: string; role: string; items?: string[] }>
  }
  /** Before/after concept diagram — explains a reframing in two columns. */
  beforeAfter?: {
    title: string
    caption?: string
    before: { label: string; points: string[] }
    after: { label: string; points: string[] }
  }
  /** Discovery & research findings — competitive audit, user research insights. */
  research?: Array<{ label: string; body: string }>
  /** User personas — who this product is for. */
  users?: Array<{ role: string; description: string; needs: string }>
  /** Closing reflection — what I learned, what was hardest, what I'd revisit. */
  reflection?: string
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
  /** One or more named carousels shown in the project overlay. Each group gets its own heading + carousel. */
  imageGroups?: Array<{
    title: string
    /** CSS aspect-ratio for the carousel viewport (e.g. '16 / 9'). Fixes the box
        height so slides of differing dimensions don't jump. Defaults to '16 / 9'. */
    aspect?: string
    /** 'carousel' (default) or 'stack' — renders images one below the other. */
    layout?: 'carousel' | 'stack'
    images: Array<{ src: string; caption?: string }>
  }>
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

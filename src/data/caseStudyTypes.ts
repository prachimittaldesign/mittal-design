// Typed schema for the rich, Apple-style case studies (portfolio-schema v0.1).
// One RichCaseStudy per project, authored as TS data in src/data/projects/*.ts.
// Every section is optional — the renderer (components/CaseStudy) skips what a
// project doesn't have. Images are referenced by id; files live at
// `${imageBase}/${id}.png` and carry their alt/caption in images[].

export type CSOwnership = 'solo' | 'lead' | 'collab' | 'support'

export interface CSImageMeta {
  id: string
  /** 'received' → real <img>; 'planned' → placeholder until the file arrives. */
  status: 'received' | 'planned'
  highlight?: boolean
  feature: string
  alt: string
  caption?: string
  tags?: string[]
}

export interface CSModalSection {
  heading: string
  body: string
}
export interface CSModal {
  title: string
  image?: string | null
  sections: CSModalSection[]
}

export interface CSMeta {
  slug: string
  name: string
  category: string
  role: string
  ownershipType: CSOwnership
  year: string
  timeline: string
  status: string
  liveUrl: string
  featured: boolean
}

export interface CSHero {
  eyebrow: string
  title: string
  tagline: string
  cta: { label: string; url: string }
  image: string
}

export interface CSHighlightCard {
  kicker: string
  title: string
  body: string
}

export interface CSCloserLook {
  /** e.g. ['light','dark'] enables the theme toggle; [] = single gallery. */
  themes: string[]
  items: Array<{ image: string; caption: string }>
}

export interface CSStat {
  num: string
  label: string
}

export interface CSFlagship {
  eyebrow: string
  headline: string
  lead: string
  stats: CSStat[]
  image: string
  modal?: CSModal | null
}

export interface CSImpactBar {
  label: string
  before: string
  after: string
  beforePct: number
  afterPct: number
}
export interface CSImpact {
  eyebrow: string
  headline: string
  bars: CSImpactBar[]
}

export interface CSCard {
  title: string
  body: string
  image?: string | null
}

export interface CSCardSection {
  eyebrow: string
  headline: string
  lead?: string
  cards: CSCard[]
  modal?: CSModal | null
}

export interface CSProcessStep {
  no: string
  title: string
  body: string
}
export interface CSProcess {
  eyebrow: string
  headline: string
  lead: string
  steps: CSProcessStep[]
  modal?: CSModal | null
}

export interface CSInteractions {
  eyebrow: string
  headline: string
  cards: CSCard[]
  signatureFlow?: string[]
}

export interface CSCapabilitiesGrid {
  type: 'grid'
  headline?: string
  items: Array<{ icon: string; title: string; body: string }>
}
export interface CSCapabilitiesComparison {
  type: 'comparison'
  headline: string
  note?: string
  /** Index 0 is this project (the highlighted "us" column). */
  competitors: string[]
  /** values[] aligns with competitors[]; null = unknown / not documented. */
  rows: Array<{ feature: string; values: Array<boolean | null> }>
}
export type CSCapabilities = CSCapabilitiesGrid | CSCapabilitiesComparison

export interface CSTechHandoff {
  eyebrow: string
  headline: string
  body: string
  items: Array<{ title: string; body: string }>
  compliance?: string[]
  modal?: CSModal | null
}

export interface CSRole {
  role: string
  ownershipType: CSOwnership
  ownership: string
  timeline: string
  team: string
  tools: string[]
  responsibilities: string[]
}

export interface RichCaseStudy {
  meta: CSMeta
  /** Public path prefix for this project's screenshots, e.g. '/IMAGES/Ved'. */
  imageBase: string
  hero: CSHero
  highlights: CSHighlightCard[]
  closerLook?: CSCloserLook
  flagship?: CSFlagship
  impact?: CSImpact
  metrics?: CSStat[]
  designSystem?: CSCardSection
  aiLayer?: CSCardSection
  process?: CSProcess
  interactions?: CSInteractions
  capabilities?: CSCapabilities
  techHandoff?: CSTechHandoff
  role?: CSRole
  /** Project ids for the "Keep exploring" tiles. */
  related?: string[]
  images: CSImageMeta[]
}

/** Resolve an image id to its src + metadata (alt, caption, status). */
export function csImage(cs: RichCaseStudy, id: string | null | undefined) {
  if (!id) return null
  const meta = cs.images.find((i) => i.id === id)
  if (!meta) return null
  return { src: `${cs.imageBase}/${id}.png`, ...meta }
}

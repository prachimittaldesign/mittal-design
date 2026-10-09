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
  /** File extension without the dot. Defaults to 'png'. */
  ext?: string
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

/** A captioned conceptual diagram. `kind` selects the SVG the renderer draws. */
export type CSFigureKind = 'broadcast' | 'leanback' | 'besideNotOver' | 'extendedPanel'
export interface CSFigureItem {
  kind: CSFigureKind
  title: string
  body: string
}
/** A standalone section of conceptual diagrams (e.g. "the television context"). */
export interface CSFigures {
  eyebrow: string
  headline: string
  lead?: string
  items: CSFigureItem[]
}

export interface CSFlagship {
  eyebrow: string
  headline: string
  lead: string
  stats: CSStat[]
  image: string
  modal?: CSModal | null
  /** Optional conceptual diagrams rendered under the flagship story. */
  diagrams?: CSFigureItem[]
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
  /** Methodology caveat shown under the headline (e.g. what the numbers do/don't cover). */
  note?: string
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

/** One motivational drive on the Octalysis octagon. */
export interface CSDrive {
  /** Short drive name shown at its octagon vertex, e.g. 'Epic Meaning'. */
  name: string
  /** true = leaned into it; false = deliberately refused it. */
  used: boolean
  /** How it was applied, or why it was refused. */
  note: string
}
/**
 * A gamification / behavioural-design section rendered as an Octalysis octagon
 * (Yu-kai Chou's eight core drives) plus a "leaned in / refused" breakdown.
 * `drives` must hold exactly eight, authored clockwise from the top so the
 * renderer can place each at its vertex.
 */
export interface CSGamification {
  eyebrow: string
  headline: string
  lead: string
  /** Attribution / framing line under the headline. */
  framework?: string
  drives: CSDrive[]
  caption?: string
}

/** One stage in an end-to-end task walkthrough. */
export interface CSWalkStage {
  no: string
  title: string
  /** Who drives this stage. Must appear in CSWalkthrough.actors — the index
   *  there picks the lane colour, so the handoffs read down the rail. */
  actor: string
  body: string
  /** What this stage buys you when the job is 50 of these instead of one. */
  atScale?: string
}
/**
 * One screen in a depicted journey. `kind` selects the wireframe the renderer
 * draws — the point is that the flow is shown as screens, not described, so a
 * reader can see the path is continuous with no dead ends or detours.
 */
export type CSScreenKind =
  | 'invite'
  | 'workspace'
  | 'template'
  | 'canvas'
  | 'topic'
  | 'conditional'
  | 'media'
  | 'review'
  | 'export'
  | 'published'
export interface CSScreen {
  kind: CSScreenKind
  no: string
  title: string
  /** What the user does here. One sentence — the wireframe carries the rest. */
  body: string
  /** The single affordance that moves them to the next screen. */
  affordance?: string
}
/**
 * A swimlane read of the same journey: phases across, actors down. A null cell
 * means that actor is not involved in that phase, so the handoffs — and the
 * stretches the system covers on its own — are visible at a glance.
 */
export interface CSLanes {
  title?: string
  phases: string[]
  rows: Array<{ actor: string; cells: Array<string | null> }>
  caption?: string
}
/**
 * An end-to-end walkthrough of one concrete, named task — "walk me through how
 * a real user actually does this, at scale". Rendered as a scenario card, the
 * reuse-collapse diagram, a depicted screen flow, an actor-laned stage rail,
 * and a swimlane summary. Every part is optional except the stages.
 */
export interface CSWalkthrough {
  eyebrow: string
  headline: string
  lead: string
  /** The concrete task, shown as a framed scenario card above the rail. */
  scenario?: string
  /** Distinct actors in first-appearance order; the index drives lane colour. */
  actors?: string[]
  /** "N deliverables, but only M units of authoring" — the whole point. */
  collapse?: {
    title: string
    /** Deliverables the task names (e.g. 50 policies). */
    total: number
    /** Units of real authoring work the structured model actually needs. */
    sources: number
    flatLabel: string
    flatNote: string
    structuredLabel: string
    structuredNote: string
    caption?: string
  }
  /**
   * How the journey was derived: the jobs-to-be-done it serves, written as job
   * stories, and the process steps that produced it. Shown before the screens
   * so the reader meets the user's need before the interface.
   */
  method?: {
    title: string
    lead?: string
    jobs: Array<{ actor: string; when: string; want: string; so: string }>
    steps: Array<{ title: string; body: string }>
  }
  /** The journey depicted as a left-to-right run of screens. */
  screens?: { title: string; lead?: string; items: CSScreen[] }
  stages: CSWalkStage[]
  lanes?: CSLanes
  footnote?: string
}

/**
 * One brick of the explainer's master document. Text may carry {name}, {team},
 * {amount} and {tier} tokens, filled per reader when the letter is assembled.
 */
export interface CSExplainerBlock {
  id: string
  /** Plain-language name of the brick, e.g. 'Greeting'. */
  label: string
  /** 'none' = same for everyone; 'group' / 'tier' = versions keyed by id. */
  varies: 'none' | 'group' | 'tier'
  text?: string
  versions?: Record<string, string>
}
/**
 * An interactive, plain-language explainer of structured content for a reader
 * with no technical background: one master document of reusable bricks, a
 * population of readers, and the personal output each reader receives. Steps
 * light up one idea at a time; picking a reader assembles their copy live.
 */
export interface CSExplainer {
  eyebrow: string
  headline: string
  lead: string
  /** The one-line analogy that carries the concept. */
  analogy?: string
  steps: Array<{ focus: 'blocks' | 'blanks' | 'rules' | 'publish'; title: string; body: string }>
  /** Prompt shown before any step is chosen. */
  idle?: string
  /** Reader groups; each person is [name, tierId]. */
  groups: Array<{ id: string; label: string; people: Array<[string, string]> }>
  tiers: Array<{ id: string; label: string; amount: string }>
  blocks: CSExplainerBlock[]
  labels: {
    source: string
    readers: string
    /** May contain {name}. */
    result: string
    none: string
    group: string
    tier: string
    writtenOnce: string
    delivered: string
  }
  /** "Change it once": swaps one shared brick's text everywhere. */
  edit?: { blockId: string; button: string; undo: string; text: string; note: string }
  glossary?: Array<{ term: string; plain: string }>
  footnote?: string
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

/** Research: how we asked / what people said / where the tracks met. */
export interface CSResearchSnip {
  body: string
  cite: string
}
export interface CSResearchTrack {
  title: string
  count: string
  /** Themes; `shared: true` marks the ones both tracks surfaced. */
  themes: Array<{ label: string; shared?: boolean }>
}
export interface CSResearch {
  eyebrow: string
  headline: string
  lead?: string
  groups: Array<{ label: string; snips: CSResearchSnip[] }>
  converge?: { tracks: CSResearchTrack[]; conclusion: string }
}

/** A hypothesis plotted on an "aiding → replacing" four-rung scale. */
export interface CSHypothesis {
  title: string
  /** Word inside the title rendered in the accent, e.g. 'companion'. */
  emphasis?: string
  body: string
  rungs: string[]
  scaleStart: string
  scaleEnd: string
}
export interface CSHypotheses {
  eyebrow: string
  headline: string
  lead?: string
  items: CSHypothesis[]
}

/** A named design principle, colour-coded and categorised. */
export interface CSPrinciple {
  key: string
  name: string
  /** 'Core' | 'Emotional' | 'Functional' — kept open for other studies. */
  cat: string
  colour: string
  desc: string
  /** Readings at each level of consciousness (conscious → unconscious). */
  levels?: [string, string, string]
}
export interface CSPrinciples {
  eyebrow: string
  headline: string
  lead?: string
  items: CSPrinciple[]
}
/** The interactive wheel: principles × levels. Reuses `principles` data. */
export interface CSWheel {
  eyebrow: string
  headline: string
  lead: string[]
  levelNames: [string, string, string]
  hint?: string
  footnote?: string
  /** Optional artefact shown under the wheel — e.g. the framework in use. */
  image?: string
  imageCaption?: string
}

/** A scrollable matrix (e.g. a journey read row-by-row). */
export interface CSMatrix {
  eyebrow: string
  headline: string
  lead?: string
  columns: string[]
  /** `hot: true` highlights the rows where the framework does its work. */
  rows: Array<{ label: string; cells: string[]; hot?: boolean }>
  footnote?: string
  /** Optional artefact shown above the table — e.g. the source journey map. */
  image?: string
  imageCaption?: string
}

/** "We chose X instead of Y, and it cost Z." */
export interface CSDecisions {
  eyebrow: string
  headline: string
  lead?: string
  items: Array<{ title: string; chose: string; instead: string; cost: string }>
}

/** A plain outcome band: a claim, some numbers, and an honest footnote. */
export interface CSOutcome {
  eyebrow: string
  headline: string
  claim: string
  nums: CSStat[]
  footnote?: string
}

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
  figures?: CSFigures
  closerLook?: CSCloserLook
  flagship?: CSFlagship
  impact?: CSImpact
  metrics?: CSStat[]
  designSystem?: CSCardSection
  aiLayer?: CSCardSection
  process?: CSProcess
  research?: CSResearch
  hypotheses?: CSHypotheses
  principles?: CSPrinciples
  wheel?: CSWheel
  matrix?: CSMatrix
  decisions?: CSDecisions
  outcome?: CSOutcome
  interactions?: CSInteractions
  explainer?: CSExplainer
  walkthrough?: CSWalkthrough
  gamification?: CSGamification
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
  return { src: `${cs.imageBase}/${id}.${meta.ext ?? 'png'}`, ...meta }
}

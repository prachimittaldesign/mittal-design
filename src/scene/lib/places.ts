import { PROJECTS } from '../../data/projects'
import { LANDMARKS } from '../../data/landmarks'
import { quadrant, BIOME } from '../../lib/iso'
import { gridToWorld, heightFor } from './project3d'

// A unified registry of everything searchable / flyable in the city — projects
// and landmarks share one shape so search, recommendations, and fly-to iterate
// a single source.
export interface Place {
  id: string
  kind: 'project' | 'landmark'
  label: string
  sub: string
  x: number
  z: number
  accent: string
  /** Lowercased bag of words (label, sub, tags, description) for sentence search. */
  keywords: string
  /** Building height — lets the fly-to camera frame the whole tower. */
  h: number
}

export const PLACES: Place[] = [
  ...PROJECTS.map((p): Place => {
    const [x, , z] = gridToWorld(p.gx, p.gy)
    return {
      id: p.id,
      kind: 'project',
      label: p.label,
      sub: p.sub,
      x,
      z,
      accent: BIOME[quadrant(p.gx, p.gy)].fill,
      keywords: `${p.label} ${p.sub} ${p.tags.join(' ')} ${p.desc}`.toLowerCase(),
      h: heightFor(p.gx, p.gy, p.scale, p.height),
    }
  }),
  ...LANDMARKS.map((l): Place => {
    const [x, , z] = gridToWorld(l.gx, l.gy)
    return {
      id: l.id,
      kind: 'landmark',
      label: l.label,
      sub: l.blurb,
      x,
      z,
      accent: l.accent,
      keywords: `${l.label} ${l.kind} ${l.blurb} ${l.items.map((i) => `${i.primary} ${i.secondary ?? ''}`).join(' ')}`.toLowerCase(),
      h: 10,
    }
  }),
]

const byId = (id: string) => PLACES.find((p) => p.id === id)

// --- Sentence search -----------------------------------------------------------
// interpretQuery("show me your recent project") → [Ved, …]. Intent words map
// straight to places; everything else falls through to keyword scoring over
// the whole registry, so "AI cms" or "smart tv apps" also land correctly.

// Newest first — Ved (2025–ongoing), SnapLogic (2025), Impressio (2024),
// iZak, Revee & Mo (2023–24). Used by recency intents.
const RECENT_ORDER = ['paas', 'snaplogic', 'impressio', 'izak', 'revee']

const INTENTS: Array<{ words: string[]; ids: string[] }> = [
  { words: ['recent', 'latest', 'newest', 'current', 'ongoing', 'now'], ids: RECENT_ORDER },
  { words: ['oldest', 'earliest', 'first'], ids: ['revee', 'impressio', 'paas'] },
  { words: ['featured', 'star', 'starred', 'stars', 'best', 'top', 'hero', 'highlight', 'highlights'], ids: ['paas', 'snaplogic', 'revee'] },
  { words: ['architecture', 'architect', 'cottage', 'studio', 'house'], ids: ['arch'] },
]

// Filler words carry no signal — dropped before scoring.
const STOPWORDS = new Set([
  'show', 'me', 'the', 'a', 'an', 'my', 'your', 'her', 'his', 'their', 'this', 'that',
  'to', 'of', 'in', 'on', 'at', 'for', 'with', 'and', 'or', 'is', 'are', 'was', 'were',
  'go', 'take', 'find', 'open', 'see', 'view', 'visit', 'where', 'what', 'which', 'who',
  'please', 'can', 'you', 'i', 'want', 'like', 'about', 'tell', 'give', 'point', 'most',
  'project', 'projects', 'work', 'works', 'case', 'study', 'studies', 'building', 'buildings', 'place', 'places',
])

export function interpretQuery(raw: string): Place[] {
  const s = raw.toLowerCase().replace(/[^a-z0-9\s&]/g, ' ')
  const tokens = s.split(/\s+/).filter(Boolean)

  // Intent words win outright — "recent" means Ved even in a long sentence.
  for (const intent of INTENTS) {
    if (tokens.some((t) => intent.words.includes(t))) {
      return intent.ids.map(byId).filter((p): p is Place => Boolean(p)).slice(0, 3)
    }
  }

  // Keyword scoring: each meaningful token that appears in a place's bag of
  // words scores it; label hits count double.
  const meaningful = tokens.filter((t) => !STOPWORDS.has(t) && t.length > 1)
  if (meaningful.length === 0) return []
  const scored = PLACES.map((p) => {
    let score = 0
    for (const t of meaningful) {
      if (p.label.toLowerCase().includes(t)) score += 2
      else if (p.keywords.includes(t)) score += 1
    }
    return { p, score }
  })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, 5).map((e) => e.p)
}

// A short curated set shown when the search box is focused but empty. The three
// featured hero case studies lead, so they're the first thing a visitor sees.
const RECOMMENDED_IDS = ['snaplogic', 'paas', 'revee', 'arch', 'cinema']
export const RECOMMENDED: Place[] = RECOMMENDED_IDS.map((id) =>
  PLACES.find((p) => p.id === id),
).filter((p): p is Place => Boolean(p))

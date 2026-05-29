import { PROJECTS } from '../../data/projects'
import { LANDMARKS } from '../../data/landmarks'
import { quadrant, BIOME } from '../../lib/iso'
import { gridToWorld } from './project3d'

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
    }
  }),
  ...LANDMARKS.map((l): Place => {
    const [x, , z] = gridToWorld(l.gx, l.gy)
    return { id: l.id, kind: 'landmark', label: l.label, sub: l.blurb, x, z, accent: l.accent }
  }),
]

// A short curated set shown when the search box is focused but empty. The three
// featured hero case studies lead, so they're the first thing a visitor sees.
const RECOMMENDED_IDS = ['snaplogic', 'paas', 'revee', 'arch', 'cinema']
export const RECOMMENDED: Place[] = RECOMMENDED_IDS.map((id) =>
  PLACES.find((p) => p.id === id),
).filter((p): p is Place => Boolean(p))

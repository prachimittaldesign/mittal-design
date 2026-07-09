// Lean-back highlight reel — the best feature + image per project, with reel
// copy. Feeds the upcoming screensaver mode: after a period of inactivity the
// site auto-plays these as a full-screen reel (image + project name + headline
// + blurb, cross-fading on each item's `duration`), dismissed by any input.
// Source: highlight.json (session 3 — Ved + SnapLogic; Revee to follow as its
// images arrive). Image files live at `${imageBase(project)}/${image}.png`.

export interface ReelHighlight {
  /** Repo project id (matches PROJECTS / RICH_CASE_STUDIES keys). */
  project: string
  projectName: string
  order: number
  image: string
  feature: string
  headline: string
  blurb: string
  tags: string[]
  /** Suggested dwell time for the auto-advance, in ms. */
  duration: number
}

const BASES: Record<string, string> = { ved: '/IMAGES/Ved', snaplogic: '/IMAGES/Snap' }

export function highlightSrc(h: ReelHighlight): string {
  return `${BASES[h.project] ?? '/IMAGES'}/${h.image}.png`
}

export const REEL_HIGHLIGHTS: ReelHighlight[] = [
  {
    project: 'ved',
    projectName: 'Ved',
    order: 1,
    image: 'VED_canvas_01',
    feature: 'DITA Builder canvas',
    headline: 'Write like a document. Ship valid DITA.',
    blurb: 'A three-panel canvas that abstracts XML — outline, WYSIWYG editor, and drag-drop blocks, structurally valid underneath.',
    tags: ['canvas', 'DITA', 'WYSIWYG', 'authoring'],
    duration: 5000,
  },
  {
    project: 'ved',
    projectName: 'Ved',
    order: 2,
    image: 'VED_askkya_01',
    feature: 'Ask Kya — conversational layer',
    headline: 'Ask Kya. Answers, not links.',
    blurb: 'A governed, sessionized AI layer with variable-token chips, entity links, and suggested next actions — every prompt a reusable asset.',
    tags: ['Ask Kya', 'AI', 'conversational', 'prompt-as-a-service'],
    duration: 5000,
  },
  {
    project: 'ved',
    projectName: 'Ved',
    order: 3,
    image: 'VED_conditional_01',
    feature: 'No-code conditional content',
    headline: 'Conditional content, without a developer.',
    blurb: 'Mark a variable non-mandatory, select on the canvas, preview live, confirm — conditional logic at the Map, Topic, and Variable level.',
    tags: ['conditional', 'no-code', 'dynamic-content'],
    duration: 5000,
  },
  {
    project: 'ved',
    projectName: 'Ved',
    order: 4,
    image: 'VED_relationship_01',
    feature: 'Relationship view',
    headline: 'See the structure underneath.',
    blurb: 'A radial graph of the DITA map and its topics — reuse, keyrefs, and relationships at a glance.',
    tags: ['relationship', 'DITA map', 'visualization'],
    duration: 4500,
  },
  {
    project: 'ved',
    projectName: 'Ved',
    order: 5,
    image: 'VED_ops_01',
    feature: 'Operations / governance dashboard',
    headline: 'Content operations, at a glance.',
    blurb: 'A governance dashboard tracking documents, topics, content blocks, and activity across the workspace.',
    tags: ['operations', 'governance', 'analytics'],
    duration: 4500,
  },
  {
    project: 'snaplogic',
    projectName: 'SnapLogic Documentation',
    order: 6,
    image: 'SNAP_home_01',
    feature: 'dual-nav homepage',
    headline: 'Find it by product — or by task.',
    blurb: "A documentation homepage built around 'What do you want to do?' — Browse by Goals and Browse by Features, side by side.",
    tags: ['dual navigation', 'IA', 'homepage'],
    duration: 5000,
  },
  {
    project: 'snaplogic',
    projectName: 'SnapLogic Documentation',
    order: 7,
    image: 'SNAP_dualnav_01',
    feature: 'in-page dual-nav toggle',
    headline: 'Two ways through, one page.',
    blurb: 'A persistent in-page toggle between Browse by Feature and Browse by Goal — a differentiator no iPaaS competitor matches.',
    tags: ['dual navigation', 'toggle', 'differentiator'],
    duration: 5000,
  },
  {
    project: 'snaplogic',
    projectName: 'SnapLogic Documentation',
    order: 8,
    image: 'SNAP_aimode_01',
    feature: 'AI Overview search',
    headline: 'Ask a question. Get a cited answer.',
    blurb: 'An AI Overview that synthesizes an answer with a sources panel — public, no login required.',
    tags: ['AI search', 'cited answers', 'conversational'],
    duration: 5000,
  },
  {
    project: 'snaplogic',
    projectName: 'SnapLogic Documentation',
    order: 9,
    image: 'SNAP_docgpt_01',
    feature: 'DocGPT',
    headline: 'Summarize this page.',
    blurb: 'A page-level assistant that summarizes and answers follow-ups in context, with a downloadable summary.',
    tags: ['DocGPT', 'AI assistant', 'summarize'],
    duration: 4500,
  },
  {
    project: 'snaplogic',
    projectName: 'SnapLogic Documentation',
    order: 10,
    image: 'SNAP_mobile_01',
    feature: 'responsive',
    headline: 'Holds up on every screen.',
    blurb: 'The dual-nav model and the full 700-page tree collapse cleanly to mobile.',
    tags: ['responsive', 'mobile'],
    duration: 4500,
  },
]

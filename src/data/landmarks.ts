import type { Landmark } from '../types'

// Civic landmarks — clickable "about Prachi" places, distinct from projects and
// from purely decorative scenery. Content here is seeded placeholder copy meant
// to be edited. Coords are empty, off-axis, even grid plots (no project/filler
// collision); leisure venues skew to the consumer side (gy < 0).
export const LANDMARKS: Landmark[] = [
  {
    id: 'cinema',
    kind: 'cinema',
    gx: -4,
    gy: -4,
    label: 'The Roxy',
    blurb: 'Films Prachi keeps pressing on people.',
    accent: '#c96f5a',
    items: [
      { primary: 'Interstellar', secondary: 'Christopher Nolan' },
      { primary: 'Gravity', secondary: 'Alfonso Cuarón' },
      { primary: 'How to Train Your Dragon', secondary: 'Dean DeBlois' },
      { primary: 'Titanic', secondary: 'James Cameron' },
    ],
  },
  {
    id: 'stadium',
    kind: 'stadium',
    gx: 6,
    gy: -4,
    label: 'The Oval',
    blurb: 'Finish lines and weekend leagues.',
    accent: '#6fae8a',
    items: [
      { primary: '10K personal best', secondary: '2024' },
      { primary: 'Weekend badminton league', secondary: 'still undefeated, allegedly' },
      { primary: 'First half-marathon', secondary: 'on the calendar' },
    ],
  },
  {
    id: 'library',
    kind: 'library',
    gx: -4,
    gy: 2,
    label: 'Reading Room',
    blurb: 'Currently on the nightstand.',
    accent: '#5a86c9',
    items: [
      { primary: 'The Timeless Way of Building', secondary: 'Christopher Alexander' },
      { primary: 'Thinking in Systems', secondary: 'Donella Meadows' },
      { primary: 'The Design of Everyday Things', secondary: 'Don Norman' },
    ],
  },
  {
    id: 'gallery',
    kind: 'gallery',
    gx: 4,
    gy: 4,
    label: 'The Annex',
    blurb: 'Photography and things she makes by hand.',
    accent: '#8fb6d0',
    items: [
      { primary: '35mm street series', secondary: 'ongoing' },
      { primary: 'Risograph prints', secondary: 'small editions' },
      { primary: 'Sketchbook spreads', secondary: 'daily-ish' },
    ],
  },
  {
    id: 'cafe',
    kind: 'cafe',
    gx: 2,
    gy: -4,
    label: 'Now Brewing',
    blurb: 'What she is into right now.',
    accent: '#e0b65a',
    items: [
      { primary: 'Learning ceramics' },
      { primary: 'Pour-over obsession', secondary: 'currently: Ethiopian naturals' },
      { primary: 'Notion → Obsidian migration' },
    ],
  },
  {
    id: 'music',
    kind: 'music',
    gx: -2,
    gy: -6,
    label: 'The Shell',
    blurb: 'On repeat lately.',
    accent: '#b16fc9',
    items: [
      { primary: 'Deep focus', secondary: 'instrumental / ambient' },
      { primary: 'Sunday morning jazz' },
      { primary: 'Running playlist', secondary: 'BPM-matched' },
    ],
  },
]

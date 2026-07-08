import type { Project, FillerTile } from '../types'

// Twelve shipped surfaces + the architecture "Studio" cottage, mapped onto the
// complexity (x) / audience (y) graph.
export const PROJECTS: Project[] = [
  // Q1 — Enterprise + Complex
  {
    id: 'impressio',
    effort: 4,
    ownership: 'lead',
    gx: 2,
    gy: 4,
    scale: 1.3,
    label: 'Impressio',
    sub: 'AEON ROBOT · 2024',
    glyph: 'robot',
    desc: 'End-to-end UX/UI flows for casting MIAs on the Aeon humanoid robot — desktop and tablet. Included the World AI Summit live demo and tablet casting interface.',
    tags: ['Enterprise', 'Robotics', 'Tablet', 'B2B'],
  },
  {
    id: 'izak',
    effort: 5,
    ownership: 'lead',
    gx: 6,
    gy: 4,
    scale: 1.5,
    height: 34, // capped below the featured trio so the gold-star towers own the skyline
    label: 'iZak',
    sub: '3D SCANNING · LiDAR',
    glyph: 'scanner',
    desc: 'UX research and design for a LiDAR + photogrammetry 3D space scanning workflow. Deep research into spatial computing, sensor use cases, and professional scanning tools.',
    tags: ['Enterprise', 'Spatial', 'UX Research', 'Mobile'],
  },
  {
    id: 'paas',
    effort: 5,
    ownership: 'collab',
    gx: 4,
    gy: 2,
    scale: 1.5,
    height: 52, // the tallest tower in the city — newest featured work
    footprint: 8,
    label: 'Ved',
    sub: 'CMS · DITA BUILDER',
    glyph: 'servers',
    featured: true,
    desc: 'Designed the structured-authoring canvas and Prompt-as-a-Service conversational UX for a DITA-enabled enterprise CMS that treats prompts as first-class, governed content.',
    tags: ['Enterprise', 'AI', 'B2B', 'Conversational UX', 'DITA', 'Design Systems'],
    locked: true,
    teaser: {
      summary:
        'A DITA CMS that makes structured authoring feel like writing a document — with AI assistance, content governance, and monetization built into one stack no competitor matches.',
      metric: { value: 'V2', label: 'CEO-approved, in engineering build' },
    },
    imageGroups: [
      {
        title: 'The canvas',
        layout: 'stack',
        images: [
          {
            src: '/IMAGES/CMS-2025-DITA.png',
            caption: 'DITA Builder canvas — a three-panel workspace with outline tree, WYSIWYG editor, and drag-and-drop content blocks. Author / XML / Relationship view toggling abstracts the XML without losing structural validity.',
          },
          {
            src: '/IMAGES/CMS-2025-DITA2.png',
            caption: 'Variety of Topics to choose from for enriched metadata — Concept, Task, Reference, Map, and Basic topic types paired with flexible layout options (Full Width, 2×1, 3×1, 2×2) for richly structured DITA authoring.',
          },
        ],
      },
    ],
  },
  {
    id: 'snaplogic',
    effort: 4,
    ownership: 'solo',
    gx: 2,
    gy: 2,
    scale: 1.35,
    height: 44, // featured — second-tallest after Ved
    label: 'SnapLogic',
    sub: 'DOCUMENTATION REVAMP',
    glyph: 'connector',
    featured: true,
    desc: "Rebuilt SnapLogic's 700-page enterprise documentation from a Confluence tree into a dual-navigation portal — browse by product or by task intent — cutting clicks-to-target by 40%.",
    tags: ['Enterprise', 'UX Research', 'B2B', 'Information Architecture', 'DITA', 'Responsive'],
    locked: true,
    teaser: {
      summary:
        "SnapLogic's enterprise docs lived on Confluence — never built for external product documentation. I rebuilt the experience around a dual-navigation system that lets users browse by product taxonomy or by task intent, reducing clicks-to-target by a validated 40%.",
      metric: { value: '40%', label: 'fewer clicks to target' },
    },
    imageGroups: [
      {
        title: 'The portal',
        aspect: '1440 / 1024',
        images: [
          {
            src: '/IMAGES/Snaplogic-2026-internal page.png',
            caption: 'Internal documentation page — the dual-navigation system in context. Product taxonomy on the left, task-based browse on the right; both modes serve the same content without duplication.',
          },
        ],
      },
    ],
  },
  // Q2 — Enterprise + Simple
  {
    id: 'lms',
    effort: 2,
    ownership: 'lead',
    gx: -2,
    gy: 2,
    scale: 0.9,
    label: 'SnapLogic LMS',
    sub: 'ACADEMY · 6 COURSES',
    glyph: 'book',
    desc: 'Redesign of 6 internal SnapLogic Academy course pages. Ran weekly review cycles across stakeholders, built high-fidelity prototypes, and managed developer handoff.',
    tags: ['Enterprise', 'Education', 'B2B'],
  },
  {
    id: 'holacracy',
    effort: 3,
    ownership: 'collab',
    gx: -4,
    gy: 4,
    scale: 1.15,
    label: 'Holacracy',
    sub: 'INTERNAL TOOLING',
    glyph: 'circles',
    desc: 'Internal tooling for self-organising teams — circles, roles, tensions, and governance workflows. Where org design meets product design.',
    tags: ['Enterprise', 'Internal', 'Governance'],
  },
  {
    id: 'kya',
    effort: 3,
    ownership: 'lead',
    gx: -2,
    gy: 4,
    scale: 1.05,
    label: 'KYA',
    sub: 'DOCUMENT WORKFLOW',
    glyph: 'docs',
    desc: 'Know-your-anything: document workflow and management surfaces for enterprise compliance teams. Information architecture, flows, and UI design.',
    tags: ['Enterprise', 'Documents', 'Workflow'],
  },
  // Q4 — Consumer + Complex
  {
    id: 'amplyfund',
    effort: 3,
    ownership: 'collab',
    gx: 2,
    gy: -2,
    scale: 1.1,
    label: 'Amplyfund',
    sub: 'TV · FUNDRAISING',
    glyph: 'tv',
    desc: 'TV UI redesign for a crowdfunding and fundraising platform. Addressed core usability friction, updated design system alignment, and improved onboarding flows.',
    tags: ['Consumer', 'TV', 'Fundraising'],
  },
  {
    id: 'voteiq',
    effort: 4,
    ownership: 'collab',
    gx: 4,
    gy: -4,
    scale: 1.35,
    label: 'Vote IQ',
    sub: 'TV + WEB · CIVICS',
    glyph: 'ballot',
    desc: 'Civic engagement product spanning TV and web. Persona-based user flows for first-time voters; collaborated with Khushi and Cherry throughout design and research.',
    tags: ['Consumer', 'TV', 'Web', 'Politics'],
  },
  // Q3 — Consumer + Simple
  {
    id: 'mo',
    effort: 2,
    ownership: 'support',
    gx: -2,
    gy: -2,
    scale: 1.0,
    label: 'Circlehealth',
    sub: 'MOBILE · HEALTHCARE',
    glyph: 'heart',
    desc: 'Information architecture and UX/UI prototyping for a consumer healthcare app. Internal pilot — attended CEO and Head of Design reviews, supported QA handoff.',
    tags: ['Consumer', 'Mobile', 'Healthcare'],
  },
  {
    id: 'clink',
    effort: 2,
    ownership: 'collab',
    gx: -4,
    gy: -2,
    scale: 0.85,
    label: 'Clink',
    sub: 'UI REDESIGN',
    glyph: 'bubble',
    desc: 'UI redesign alongside Moon and Ritesh. Onboarded Ritesh to the design team, led refinement sessions, and shaped the overall visual direction.',
    tags: ['Consumer', 'Mobile', 'Social'],
  },
  {
    id: 'revee',
    effort: 5,
    ownership: 'lead',
    gx: 4,
    gy: -2,
    scale: 1.4,
    height: 40, // featured — towers over the consumer side
    label: 'Revee & Mo',
    sub: 'TV SUPER APPS · CES 2024',
    glyph: 'tv',
    featured: true,
    desc: 'End-to-end design of two smart-TV apps in a 12-app suite — Mo, a community home screen, and Revee, adaptive streaming with non-interruptive advertising. Showcased at CES 2024.',
    tags: ['Consumer', 'TV', 'Information Architecture', 'Lean-Back UX', 'Smart TV'],
    locked: true,
    teaser: {
      summary:
        'Two apps that reclaim the TV home screen for local communities and replace interruptive advertising with contextual companion experiences — part of a 12-app MIAs suite shown at CES 2024 and handed off for partnership.',
      metric: { value: 'CES 2024', label: 'showcased · Las Vegas' },
    },
    imageGroups: [
      {
        title: 'Mo',
        aspect: '4 / 3',
        images: [
          {
            src: '/IMAGES/Mo-2024-Home.png',
            caption: 'Home screen — a personalised daily hub: community greeting, real-time local updates, and cross-app "pick up where you left off" continuity.',
          },
          {
            src: '/IMAGES/Mo-2024-Map.png',
            caption: 'Map view — location-aware discovery of nearby community events, venues, and services, navigable with the TV remote.',
          },
        ],
      },
      {
        title: 'Revee',
        aspect: '16 / 9',
        images: [
          {
            src: '/IMAGES/Revee-2024-epg.png',
            caption: 'EPG — the Electronic Programme Guide surfaces live, catch-up, and on-demand content in a single lean-back scroll. Focus states scale the active tile so it reads clearly from 10 feet.',
          },
          {
            src: '/IMAGES/Revee-2024-Banner.png',
            caption: 'Companion banner ad — thematically matched creative sits beside the video stream, not over it. Viewers can engage or dismiss without the playback ever pausing.',
          },
          {
            src: '/IMAGES/Revee-2024-Interactive-Ad.png',
            caption: 'Interactive ad unit — an opt-in overlay that lets brands go deeper (product details, save-to-wishlist, QR to phone) while content continues in the background.',
          },
        ],
      },
    ],
  },
  // Easter egg — Architecture
  {
    id: 'arch',
    effort: 4,
    ownership: 'solo',
    gx: 6,
    gy: 6,
    scale: 1.1,
    label: 'Studio',
    sub: 'ARCHITECTURE · RES.',
    glyph: 'cottage',
    height: 8,
    roofStyle: 'pitched',
    desc: 'Residential architectural practice — the quiet cottage at the far edge of the map. Prachi brings the same spatial thinking she applies to physical buildings to every digital surface she designs.',
    tags: ['Architecture', 'Residential', 'Spatial'],
  },
]

// Decorative grass/rock patches that round out the empty quadrant corners.
export const FILLER: FillerTile[] = [
  { id: 'f0', gx: -6, gy: 2, glyph: 'trees' },
  { id: 'f1', gx: -6, gy: 4, glyph: 'rocks' },
  { id: 'f2', gx: -6, gy: -2, glyph: 'trees' },
  { id: 'f3', gx: -6, gy: -4, glyph: 'trees' },
  { id: 'f4', gx: 4, gy: 6, glyph: 'trees' },
  { id: 'f5', gx: -4, gy: 6, glyph: 'rocks' },
  { id: 'f6', gx: 6, gy: -6, glyph: 'trees' },
  { id: 'f7', gx: 4, gy: -6, glyph: 'rocks' },
  { id: 'f8', gx: -4, gy: -6, glyph: 'trees' },
  { id: 'f9', gx: 5, gy: 5, glyph: 'trees' },
]

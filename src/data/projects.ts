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
    label: 'Ved',
    sub: 'CMS · DITA BUILDER',
    glyph: 'servers',
    featured: true,
    desc: 'Designed the structured-authoring canvas and Prompt-as-a-Service conversational UX for a DITA-enabled enterprise CMS that treats prompts as first-class, governed content.',
    tags: ['Enterprise', 'AI', 'B2B', 'Conversational UX', 'DITA', 'Design Systems'],
    caseStudy: {
      role: 'Product Designer',
      timeline: 'Mid 2025 – Ongoing',
      platform: 'Web Application',
      context: 'V2 in development',
      summary:
        'Ved is a DITA-enabled CMS that bundles structured authoring, enterprise compliance, AI-assisted writing, and content monetization in one stack. I designed the core authoring canvas and the Prompt-as-a-Service conversational layer — a combination no competitor offers.',
      problem:
        "DITA gives enterprise teams reusable, multi-channel publishing — but its complexity is a steep authoring wall: writers must think in components, manage conditional logic and metadata, and navigate XML validation, all while trying to write clearly. A newer problem compounds it: as AI enters content operations, enterprises need to govern prompts with the same rigor as documentation — versioning, access control, quality scoring — yet no tool treats prompts as first-class content.",
      process: [
        {
          phase: 'Audit',
          body: 'Mapped the competitive landscape — AEM Guides, Heretto, Paligo, IXIASOFT — across six dimensions: authoring model, AI capability, governance layer, publishing targets, team collaboration, and pricing. Identified the universal gap: none treat prompts as governed content.',
        },
        {
          phase: 'Research',
          body: 'Ran JTBD sessions with enterprise tech writers and content managers. The recurring friction points: XML validation anxiety blocks non-technical authors, conditional logic requires a developer, and AI-generated content is ungoverned — pasted in, then immediately lost.',
        },
        {
          phase: 'Define',
          body: 'Defined two non-negotiable personas: the DITA-native tech writer who needs full XML fidelity, and the department author who needs WYSIWYG-first with XML hidden until needed. Scoped V2 to serve both from the same canvas without compromise or hidden mode-switches.',
        },
        {
          phase: 'Explore',
          body: 'Wireframed three canvas layouts — single-pane, floating palette, and three-panel split. Tested internally against real authoring tasks. The three-panel (outline tree + WYSIWYG editor + block palette) resolved context-switching friction the fastest and matched existing DITA tool muscle memory.',
        },
        {
          phase: 'Design',
          body: 'Built the full component library in Figma against the existing design system. Designed the Author / XML / Relationship view toggle, the "Ask Kya" inline AI chat with sessionized prompt chips, the Prompt-as-a-Service canvas, and the Non-Mandatory Variable four-step conditional wizard with live canvas preview.',
        },
        {
          phase: 'Handoff',
          body: 'Annotated every component with its DITA semantic mapping (topic, task, concept, reference). Dev handoff included a token map, a full interaction spec for every state, and a written IA rationale document — not just Figma links — so engineering understood the why behind every structural decision.',
        },
      ],
      approach: [
        {
          title: 'DITA Builder canvas',
          body: 'A three-panel workspace — outline tree, distraction-free WYSIWYG editor, and drag-and-drop content/layout blocks — with Author / XML / Relationship view toggling that abstracts XML while keeping structure valid.',
        },
        {
          title: '"Ask Kya" conversational authoring',
          body: 'An inline AI chat with sessionized prompts, inline variable token chips, entity-linked responses, and tappable follow-up actions — modeled on Quillbot and Scalenut in-context patterns.',
        },
        {
          title: 'Prompt-as-a-Service',
          body: 'Elevated prompts from disposable inputs to versioned, quality-scored, reusable assets — a new governed content category that reuses across the agent ecosystem.',
        },
        {
          title: 'Non-Mandatory Variable flow',
          body: 'A four-step visual interaction lets non-technical authors exclude conditional content by selecting it on the canvas with live preview — no conditional code required.',
        },
        {
          title: 'Media Library & governance',
          body: 'Multi-format asset system (video, audio, 3D, fonts, DITA) with marketplace monetization, plus encryption, watermarking, and GDPR-compliant lifecycle controls built in, not bolted on.',
        },
      ],
      impact: [
        'V2 design shipped and now in development',
        'Unique market position — structured authoring + AI + monetization in one stack, unmatched by Adobe AEM Guides, Heretto, Paligo, or IXIASOFT',
        'Holocracy marketplace integration turns the CMS from a cost center into a revenue channel',
        'Conditional rendering (Map → Topic → Variable) cuts content duplication from single-source topics',
      ],
      metric: { value: '3-in-1', label: 'authoring · AI · monetization' },
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
            caption: 'Prompt-as-a-Service layer — prompts surface as versioned, quality-scored assets alongside the document, governed with the same rigor as content. The "Ask Kya" inline chat sessions are saved, reusable, and entity-linked.',
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
    label: 'SnapLogic',
    sub: 'DOCUMENTATION REVAMP',
    glyph: 'connector',
    featured: true,
    desc: "Rebuilt SnapLogic's 700-page enterprise documentation from a Confluence tree into a dual-navigation portal — browse by product or by task intent — cutting clicks-to-target by 40%.",
    tags: ['Enterprise', 'UX Research', 'B2B', 'Information Architecture', 'DITA', 'Responsive'],
    caseStudy: {
      role: 'Sole Product Designer',
      timeline: 'Jan 2025 – Ongoing',
      platform: 'Responsive Web',
      context: 'V1 live in production',
      summary:
        "SnapLogic's enterprise docs lived on Confluence — never built for external product documentation. I rebuilt the experience around a dual-navigation system that lets users browse by product taxonomy or by task intent, reducing clicks-to-target by a validated 40%.",
      problem:
        "The site exposed the entire ~700-page tree in one scrollable sidebar, organized purely by product (AutoSync, Designer, Monitor, SnapGPT, Admin Manager). Users who arrived with a task — \"monitor my pipeline,\" \"set up a user\" — had to first guess which product held the answer, then drill through nested nodes. This worked for power users but systematically failed newcomers, cross-product admins, and anyone arriving from search. They bounced to support or abandoned the docs entirely. The content was comprehensive; the architecture was the barrier.",
      approach: [
        {
          title: 'Dual navigation',
          body: 'Designed parallel Browse-by-Product and Browse-by-Task systems over the same content, with in-page switching — serving power users and newcomers without compromise.',
        },
        {
          title: 'Task IA grounded in research',
          body: "Mapped task categories to user goals using Jobs-To-Be-Done and Rosenfeld & Morville's multiple-navigation principle; benchmarked against Stripe, AWS, and Microsoft Learn.",
        },
        {
          title: 'DITA map scoping',
          body: 'Each task scopes the view down to a self-contained DITA map — turning a 700-page tree into a focused, guide-like micro-experience instead of a filtered list.',
        },
        {
          title: 'Conversational search (DocGPT)',
          body: 'Designed a natural-language search that synthesizes answers with page references — meeting users who arrive with a question, not a navigation path.',
        },
        {
          title: 'Single-source content',
          body: 'Conref wrappers serve both browse modes from one content body — zero duplicate maintenance for the writing team.',
        },
      ],
      impact: [
        '40% reduction in clicks-to-target, validated across all five test scenarios with automated Playwright usability tests',
        'V1 shipped to production, replacing the Confluence-hosted site',
        'Sole designer — drove alignment with senior tech writers, department heads, and international managers; secured in-house design approvals',
        'Competitive edge: no direct iPaaS rival (MuleSoft, Boomi, Workato) offers dual-navigation or task-based browsing',
      ],
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
    height: 26,
    label: 'Revee & Mo',
    sub: 'TV SUPER APPS · CES 2024',
    glyph: 'tv',
    featured: true,
    desc: 'End-to-end design of two smart-TV apps in a 12-app suite — Mo, a community home screen, and Revee, adaptive streaming with non-interruptive advertising. Showcased at CES 2024.',
    tags: ['Consumer', 'TV', 'Information Architecture', 'Lean-Back UX', 'Smart TV'],
    caseStudy: {
      role: 'Product Designer — end-to-end',
      timeline: 'Nov 2023 – Jun 2024',
      platform: 'Smart TV · 10-foot UI',
      context: 'Showcased at CES 2024, Las Vegas',
      summary:
        'TV home screens are owned by OEMs and built around global content aggregation, leaving local communities no presence on the home’s most prominent screen. I owned the IA, flows, and UI for two apps that reclaim it — Mo and Revee — part of the 12-app MIAs suite shown at CES 2024.',
      problem:
        'Samsung, LG, and TCL shape the default TV experience around their own ecosystems, so local communities and contextual services have nowhere to appear. At the same time, TV advertising stays interruptive — pre-roll, mid-roll, and banners that break viewing and feel like a penalty for watching, while broadcasters still lack deep behavioral insight for targeting.',
      approach: [
        {
          title: 'Mo — community super app',
          body: 'Reimagined the home screen as a location-aware hub: personalized greeting, a daily timeline, real-time community updates, and cross-app "pick up where you left off" continuity across Netflix, NBC, and Sotheby’s.',
        },
        {
          title: 'Revee — pragmatic advertising',
          body: 'Full-screen content with companion ads beside, not over, the stream — thematically relevant and interactive, turning advertising into an opt-in enhancement rather than an interruption.',
        },
        {
          title: 'Remote-first interaction',
          body: 'Built the entire IA around d-pad navigation — directional flow, focus states, and selection patterns that feel natural from 8–10 feet with a remote, not a pointer.',
        },
        {
          title: 'Lean-back visual system',
          body: 'A dark, high-contrast theme tuned for living-room OLED/LED panels and legible at distance, built within Mobius’s design system with TV-specific extensions.',
        },
      ],
      impact: [
        'Showcased at CES 2024, Las Vegas — validating market readiness',
        'End-to-end ownership: information architecture, user flows, and UI through final handoff',
        'Designed for dual-market deployment across India and the USA',
        'Mo serves as the platform layer driving adoption of the entire 12-app MIAs ecosystem',
      ],
      metric: { value: 'CES 2024', label: 'showcased in Las Vegas' },
    },
    imageGroups: [
      {
        title: 'Mo',
        aspect: '4 / 3',
        images: [
          {
            src: '/IMAGES/Mo- 2024- Home.png',
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
            src: '/IMAGES/Revee-2024-epg',
            caption: 'EPG — the Electronic Programme Guide surfaces live, catch-up, and on-demand content in a single lean-back scroll. Focus states scale the active tile so it reads clearly from 10 feet.',
          },
          {
            src: '/IMAGES/Revee-2024-Banner.png',
            caption: 'Companion banner ad — thematically matched creative sits beside the video stream, not over it. Viewers can engage or dismiss without the playback ever pausing.',
          },
          {
            src: '/IMAGES/Revee-2024-Interactiv Ad.png',
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

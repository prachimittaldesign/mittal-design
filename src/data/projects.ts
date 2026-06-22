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
        'A DITA CMS that makes structured authoring feel like writing a document — with AI assistance, content governance, and monetization built into one stack no competitor matches.',
      tldr: {
        what: 'Ved — an enterprise DITA CMS pairing structured authoring with AI-assisted writing, governance, and a content marketplace.',
        who: 'Two opposed authors on one canvas: DITA-native tech writers and non-technical department SMEs.',
        how: 'I owned the authoring canvas, the "Ask Kya" conversational layer, the dynamic-content system, Media Library, and DRM — CEO-approved before handoff.',
      },
      stats: [
        { value: '~60%', label: 'less prompt-recreation overhead' },
        { value: '2-in-1', label: 'expert + non-technical authors, one canvas' },
        { value: 'days → <1hr', label: 'conditional content, no developer' },
        { value: 'V2', label: 'CEO-approved, now in engineering' },
      ],
      problem:
        'DITA gives enterprise teams reusable, multi-channel publishing — but its complexity is a wall. Writers must think in components, manage metadata and conditional logic, and fight XML validation. Non-technical authors are locked out entirely.\n\nA second gap is newer: as AI enters content ops, prompts need the same governance as docs — versioning, scoring, reuse. No tool treats them as first-class content. They get pasted in once, then lost.',
      comparison: {
        title: "Why it's different",
        columns: ['Ved', 'AEM Guides', 'Heretto', 'Paligo', 'IXIASOFT'],
        rows: [
          { label: 'Structured DITA authoring', cells: [true, true, true, true, true] },
          { label: 'WYSIWYG for non-technical authors', cells: [true, false, false, false, false] },
          { label: 'Conversational AI authoring', cells: [true, false, false, false, false] },
          { label: 'Governed prompts (Prompt-as-a-Service)', cells: [true, false, false, false, false] },
          { label: 'No-code conditional content', cells: [true, false, false, false, false] },
          { label: 'Content marketplace / monetization', cells: [true, false, false, false, false] },
        ],
        caption:
          'Structured authoring is table stakes. The combination of conversational AI, governed prompts, no-code conditionals, and monetization is unmatched across AEM Guides, Heretto, Paligo, and IXIASOFT.',
      },
      research: [
        {
          label: 'Competitive audit',
          body: 'Benchmarked AEM Guides, Heretto, Paligo & IXIASOFT. None govern prompts, all need a developer for conditional logic, none bundle monetization.',
        },
        {
          label: 'AI authoring patterns',
          body: 'Scalenut and Quillbot showed how to surface AI as contextual, in-line micro-actions — and template variables as visible, tappable tokens, not hidden syntax.',
        },
        {
          label: 'JTBD with content teams',
          body: 'Three frictions recurred: XML anxiety locks out SMEs, conditionals need dev turnaround, and AI output is ungoverned the moment it lands.',
        },
        {
          label: 'The core insight',
          body: 'A good prompt is as reusable as a content fragment. Prompts and content are structurally analogous — so both should be versioned, scored, and governed.',
        },
      ],
      users: [
        {
          role: 'DITA-native tech writer',
          description: 'Lives in XML and complex map hierarchies. The Author / XML / Relationship toggle and radial map graph are built for them.',
          needs: 'Full XML fidelity, relationship views, and validation without leaving the canvas.',
        },
        {
          role: 'Department author',
          description: 'A domain SME who thinks in documents, not DITA. The system keeps structure valid without their awareness.',
          needs: 'WYSIWYG-first, drag-and-drop blocks, no conditional code, inline AI.',
        },
        {
          role: 'Content manager',
          description: 'Owns governance: access, versions, compliance, and the publish/license lifecycle across the team.',
          needs: 'DRM, license management, GDPR audit logs, and marketplace monetization.',
        },
      ],
      process: [
        { phase: 'Audit', body: 'Mapped 4 DITA CMS competitors + AI tools. Found the blind spot: ungoverned prompts, dev-gated conditionals.' },
        { phase: 'Research', body: 'JTBD sessions surfaced 3 frictions and the prompt-governance insight.' },
        { phase: 'Define', body: 'Two opposed personas, one canvas — progressive disclosure, not a stripped "simple mode."' },
        { phase: 'Explore', body: 'Wireframed 3 canvas architectures against 4 real tasks; three-panel won.' },
        { phase: 'Design', body: 'Full Figma library: canvas, Ask Kya, PaaS, no-code conditionals, Media Library, DRM.' },
        { phase: 'Handoff', body: 'Annotated DITA semantics, token map, IA rationale doc; embedded in eng scrum.' },
      ],
      anatomy: {
        title: 'Anatomy of the canvas',
        toggles: ['Author', 'XML', 'Relationship'],
        panels: [
          { label: 'DITA Outline', role: 'Left — structure', items: ['Topic tree', 'Drag to reorder', 'Expand / collapse', 'Live topic count'] },
          { label: 'WYSIWYG Editor', role: 'Center — writing', items: ['Document-like surface', 'Formatting toolbar', 'XML stays valid underneath', 'Auto-save + presence'] },
          { label: 'Content Palette', role: 'Right — building blocks', items: ['Topic blocks', 'Content & layout blocks', 'Variable tokens', 'Integrations'] },
        ],
        caption:
          'One workspace, two mental models. The view toggle lets a writer stay visual or drop to raw XML — the structure never breaks.',
      },
      approach: [
        {
          title: 'DITA Builder canvas',
          body: 'Three-panel workspace with Author / XML / Relationship toggle. The Relationship view renders a radial graph of map connections; auto-save and live presence built in.',
        },
        {
          title: '"Ask Kya" conversational authoring',
          body: 'Sessionized AI chat with tappable variable token chips, entity-linked responses, and suggested follow-up actions that turn a conversation into a workflow.',
        },
        {
          title: 'Prompt-as-a-Service',
          body: 'Prompts become versioned, quality-scored, reusable assets — title, author, rating, artifact count — and publish to the marketplace for cross-product reuse.',
        },
        {
          title: 'No-code conditional content',
          body: 'A five-step canvas-selection flow lets non-technical authors exclude conditional content visually — no DITA conditional code, with live preview.',
        },
        {
          title: 'Media Library',
          body: 'Multi-format assets (video, audio, 3D, fonts, DITA, HTML) with grid/list, search, and a marketplace widget surfacing purchasable libraries in-workflow.',
        },
        {
          title: 'DRM & compliance',
          body: 'Encryption, dynamic watermarking, time-limited URLs, license management, GDPR audit logs, and retention policies — built into the lifecycle, not bolted on.',
        },
      ],
      flow: {
        title: 'Signature interaction — conditional content without code',
        steps: [
          { title: 'Mark non-mandatory', detail: 'Author flags a variable as optional via checkbox.' },
          { title: 'Selection panel', detail: 'A Content Selection Panel opens on the canvas.' },
          { title: 'Canvas select mode', detail: 'Editor highlights blocks; author clicks what to exclude.' },
          { title: 'Live preview', detail: 'Excluded content previews in real time.' },
          { title: 'Confirm', detail: 'Selection finalizes the conditional rule.' },
        ],
        caption: 'What used to require a developer now takes a non-technical author under a minute.',
      },
      beforeAfter: {
        title: 'Reframing the prompt',
        before: {
          label: 'Prompt as disposable input',
          points: ['Pasted into a box', 'Used once, then lost', 'No version or owner', 'No quality signal', 'No reuse path'],
        },
        after: {
          label: 'Prompt as governed asset',
          points: ['Authored & titled', 'Versioned & owned', 'Quality-scored (e.g. 4.5/5)', 'Sessionized & reusable', 'Publishable to marketplace'],
        },
        caption: 'Prompt-as-a-Service applies the content lifecycle to AI prompts — a new governed category inside the CMS.',
      },
      impact: [
        'V2 design complete and in active engineering build — approved through CEO and design-system review before handoff.',
        'Only CMS to combine structured DITA authoring + AI governance + monetization; no direct competitor offers all three.',
        'No-code conditional flow cuts conditional-content turnaround from days to under an hour, with zero developer dependency.',
        'Prompt-as-a-Service is projected to cut prompt-recreation overhead ~60% on teams of five or more authors.',
        'Compliance (GDPR, ISO 27001, NIST) designed into the lifecycle — no retrofitting.',
      ],
      metric: { value: '3-in-1', label: 'authoring · AI · monetization' },
      reflection:
        "The hard part wasn't the canvas — it was making two opposite authors share one workspace without either feeling shortchanged. Progressive disclosure, not dual modes, was the answer. The no-code conditional flow was the most rewarding piece: turning developer work into a point-and-click interaction genuinely changes who gets to author in DITA.",
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

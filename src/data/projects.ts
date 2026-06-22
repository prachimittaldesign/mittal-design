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
        'Ved is a DITA-enabled CMS that unites structured authoring, AI-assisted writing, content governance, and marketplace monetization in one stack — a combination no competitor offers. I designed the core authoring canvas, the Prompt-as-a-Service conversational layer, the dynamic content system, the Media Library, and the DRM & compliance surface. The full V2 design was reviewed by design leadership and the CEO before engineering handoff.',
      problem:
        'Enterprise documentation teams managing large-scale, multi-product content ecosystems face two compounding tensions. First: DITA provides the structural power needed for reusable, conditional, multi-channel publishing — but its complexity creates a steep authoring barrier. Writers must think in components rather than documents, manage conditional logic and metadata, understand reuse dependencies, and navigate XML validation, all while trying to write clearly. Non-technical authors are excluded entirely; even experienced DITA writers context-switch constantly between writing and structural management.\n\nSecond: as AI becomes central to content operations, enterprises need to manage prompts with the same governance rigor applied to documentation — versioning, access control, quality scoring, reuse tracking, compliance. No existing tool treats prompts as first-class content assets. They remain disposable: pasted in, used once, immediately lost from the content lifecycle.',
      research: [
        {
          label: 'Competitive audit — DITA CMS landscape',
          body: 'Mapped AEM Guides, Heretto, Paligo, and IXIASOFT across six dimensions: authoring model, AI capability, governance layer, publishing targets, team collaboration, and pricing. Universal gap: none treat prompts as governed content, all require developer involvement for conditional logic, and none bundle monetization into the authoring workflow.',
        },
        {
          label: 'AI authoring benchmarks — Oxygen XML, Scalenut, Quillbot',
          body: "Scalenut's micro-interaction patterns (Write / Command / Rephrase / Simplify) showed how AI assistance can manifest as contextual, discrete actions within a writing surface. Quillbot's paraphrasing-in-context approach directly informed the inline variable token chip design — surfacing template parameters as visible, tappable tokens rather than hiding them behind syntax.",
        },
        {
          label: 'JTBD sessions — enterprise content teams',
          body: 'Three friction categories surfaced universally: XML validation anxiety blocks non-technical authors entirely; conditional content exclusions require developer turnaround even for trivial changes; AI-generated content is ungoverned — pasted into documents with no version history, quality tracking, or reuse path back into the content lifecycle.',
        },
        {
          label: 'Core insight — the prompt governance gap',
          body: 'No tool in the market versions, scores, or governs AI prompts. In enterprise content operations, a well-crafted prompt for generating DITA-compliant topics is as valuable as a reusable content fragment — possibly more so. Prompts and content are structurally analogous. They should both be authored, versioned, quality-scored, and governed.',
        },
      ],
      users: [
        {
          role: 'DITA-native tech writer',
          description: 'Expert in DITA semantics and XML structure. Manages large, multi-version topic libraries and complex map hierarchies. Author / XML / Relationship view toggling — including the radial map graph — is designed for this user.',
          needs: 'Full XML access, relationship visualization, real-time collaboration, and validation feedback without switching to a separate XML editor.',
        },
        {
          role: 'Department author',
          description: 'Subject-matter expert writing in their domain but untrained in DITA or XML. Their mental model is a document editor — they write, format, and structure, and the system should maintain validity without their awareness.',
          needs: 'WYSIWYG-first experience where XML complexity is invisible. Drag-and-drop content blocks, no conditional code, and inline AI assistance for drafting.',
        },
        {
          role: 'Content manager / admin',
          description: 'Owns the governance layer: access control, version history, compliance auditing, and the content lifecycle across the team. Tracks what is published, licensed, and shared externally.',
          needs: 'DRM controls, license management, GDPR-compliant audit logs, retention policies, and marketplace integration to monetize the team\'s content assets.',
        },
      ],
      process: [
        {
          phase: 'Audit',
          body: 'Mapped the competitive landscape — AEM Guides, Heretto, Paligo, IXIASOFT — across six dimensions: authoring model, AI capability, governance layer, publishing targets, team collaboration, and pricing. Benchmarked AI authoring tools (Oxygen XML, Scalenut, Quillbot) for interaction patterns that could make AI feel native to a structured authoring workflow. Identified the universal blind spot: no tool governs prompts, and all require developer involvement for conditional logic.',
        },
        {
          phase: 'Research',
          body: 'Ran JTBD sessions with enterprise tech writers and content managers. Three friction categories emerged universally: XML validation anxiety blocks non-technical authors; conditional content exclusions require developer turnaround even for simple changes; AI-generated content is pasted in and immediately disconnected from the content lifecycle. Secondary insight: structured content fragments are already treated as reusable assets — prompts are structurally analogous and should be governed the same way.',
        },
        {
          phase: 'Define',
          body: 'Defined two non-negotiable personas that must co-exist on the same canvas: the DITA-native tech writer who needs full XML fidelity, and the department author who needs WYSIWYG-first with XML abstracted away entirely. Scoped V2 to serve both from a single three-panel workspace — not via a "simple mode" that strips features, but through progressive disclosure that reveals depth on demand. Also defined the prompt governance mandate: prompts must be versionable, quality-scored, and governed at the same level as DITA topics.',
        },
        {
          phase: 'Explore',
          body: 'Wireframed three canvas architectures: single-pane with floating tools, split-view with persistent palette, and three-panel with full-width editor. Tested each against four real authoring tasks: creating a DITA topic, inserting a conditional variable, running an AI rewrite, and organizing a multi-topic map. The three-panel layout (DITA outline tree + WYSIWYG editor + content/variable palette) resolved context-switching friction fastest and matched existing DITA tool muscle memory.',
        },
        {
          phase: 'Design',
          body: 'Built the full component library in Figma. Designed: Author / XML / Relationship view toggle with radial tree graph for DITA map visualization; "Ask Kya" sessionized AI chat with inline variable token chips; Prompt-as-a-Service canvas with session quality ratings and artifact tracking; the Non-Mandatory Variable five-step canvas selection flow with live preview; the Media Library with Holocracy marketplace sidebar widget; and the DRM compliance surface covering encryption, watermarking, license management, and retention policies. CEO review and design leadership approval secured before handoff.',
        },
        {
          phase: 'Handoff',
          body: 'Every component annotated with its DITA semantic mapping (topic, task, concept, reference, map). Dev handoff included a full token map, interaction specs for every state transition, a written IA rationale document explaining structural decisions — not just Figma artboards. Participated in scrum calls with engineering throughout, resolving implementation questions in real time. V2 design shipped to engineering; active build is now underway.',
        },
      ],
      approach: [
        {
          title: 'DITA Builder canvas',
          body: 'Three-panel workspace: DITA outline tree (left, drag-to-reorder, expand/collapse, topic count), distraction-free WYSIWYG editor (center, formatting toolbar), and a Content / Variable / Integrate palette (right, drag-and-drop blocks). Author / XML / Relationship view toggle — Relationship view renders a radial tree graph of map connections with hover-to-reveal metadata. Auto-save with visible timestamp. Real-time collaborator presence indicators.',
        },
        {
          title: '"Ask Kya" conversational authoring',
          body: 'Sessionized AI chat with inline variable token chips (Input Value, Specified Workflow, Instructions) — parameters surface as interactive, tappable tokens rather than syntax, drawn from Scalenut\'s parameterized content patterns. AI responses include embedded entity links back to CMS objects. Suggested follow-up actions ("Create campaign," "validate team structure") turn conversation into workflow triggers. Model selection dropdown supports multiple AI backends.',
        },
        {
          title: 'Prompt-as-a-Service',
          body: 'Elevated prompts from disposable inputs to versioned, quality-scored, reusable content assets. Each session shows: title, author, quality rating (e.g. 4.5/5), artifacts-produced count, and quality dimension trend indicators. Sessions are pinnable, rateable, and fully governable — the same content lifecycle applied to DITA topics, now applied to AI prompts for the first time. Published to the Holocracy marketplace for cross-product reuse.',
        },
        {
          title: 'Non-Mandatory Variable flow',
          body: 'A five-step visual interaction for conditional content exclusion without writing code: (1) mark variable as Non-Mandatory, (2) Content Selection Panel appears, (3) Canvas Content Selection mode highlights blocks for selection, (4) author clicks to select what to exclude, (5) Live Preview confirms the configuration in real time. What previously required a developer turnaround now takes a non-technical author under a minute.',
        },
        {
          title: 'Media Library',
          body: 'Multi-format asset system (Video, Audio, 3D Model, Image, Fonts, DITA Document, HTML) with grid/list toggle, search, sort, and asset cards showing thumbnail preview, filename, format tags (e.g. mp4, 720p), and contextual menu. Breadcrumb navigation (Dashboard → Media Library → Videos). Holocracy marketplace sidebar widget surfaces purchasable content libraries directly within the authoring workflow.',
        },
        {
          title: 'DRM & compliance surface',
          body: 'Content governance built into the lifecycle from the ground up: encryption workflows (at rest and in transit) integrated into the upload flow; dynamic watermarking with user-ID + timestamp injection; pre-signed time-limited URL generation with auto-copy; license management UI (CC / Proprietary / Time-Limited, create/renew/revoke); GDPR-compliant audit logging for ownership transfer; retention policies with automated archiving and asset expiration notifications.',
        },
      ],
      impact: [
        'V2 design complete and in active engineering development — approved through CEO review and design system validation before handoff',
        'Unique market positioning: the only CMS combining structured DITA authoring + AI governance + content monetization — no direct competitor (AEM Guides, Heretto, Paligo, IXIASOFT) offers all three',
        'Non-Mandatory Variable flow replaces developer dependency for conditional content — estimated to cut conditional logic turnaround from days to under an hour for non-technical authors',
        'Prompt-as-a-Service creates a new governed content category, projected to reduce prompt recreation overhead by ~60% in teams managing five or more concurrent authors',
        'Holocracy marketplace integration positions the CMS as a revenue channel, not a cost center — authored content and prompt libraries publishable directly from the authoring canvas',
        'Enterprise compliance surface (GDPR, ISO 27001, NIST) designed into the content lifecycle from the ground up — eliminating the compliance retrofitting that burdens teams using general-purpose tools',
      ],
      metric: { value: 'V2', label: 'CEO-approved · in engineering' },
      reflection:
        "The most significant challenge was not the canvas itself — it was designing for two audiences with fundamentally different mental models who must share the same workspace without either feeling compromised. Progressive disclosure, not dual modes, was the answer: one canvas that reveals structural depth on demand rather than forcing a choice between two versions. The Non-Mandatory Variable flow was the most rewarding individual contribution: turning what required developer involvement into a visual, point-and-click canvas selection experience genuinely changes who can author conditional content in a DITA environment — and that felt like the kind of friction worth solving.",
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
            src: '/IMAGES/CMS-2025-DITA2%20.png',
            caption: 'Flexible layout system — a 2×1 layout block with drag-and-drop placement, alongside the full Content palette: five DITA topic types (Concept, Task, Reference, Map, Basic) for enriched metadata, content blocks (Text, Video, Image, Table, Watermark, Tag, Code, URL), and four layout options (Full Width, 2×1, 3×1, 2×2) for richly structured authoring.',
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

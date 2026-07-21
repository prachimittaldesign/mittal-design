import type { RichCaseStudy } from '../caseStudyTypes'

// SnapLogic Documentation — rich case-study content (portfolio-schema v0.1,
// session 3). Source: snaplogic.json + manifest.json (captions/alt). All 23
// screenshots received and living in public/IMAGES/Snap/, including the UX
// audit deliverable (SNAP_audit_01).
// The competitor matrix's non-SnapLogic cells were researched Jul 2026 from
// vendor documentation and release notes: help.boomi.com (goal-based homepage,
// Boomi Answers AI search — login-gated), docs.mulesoft.com (lifecycle
// homepage, external-LLM hand-off via Open in ChatGPT/Claude/Perplexity),
// docs.workato.com (keyword-only public docs; AssistIQ is in-product only).

export const SNAPLOGIC_CASE_STUDY: RichCaseStudy = {
  meta: {
    slug: 'snaplogic',
    name: 'SnapLogic Documentation',
    category: 'Enterprise Documentation · Information Architecture',
    role: 'Sole Product Designer',
    ownershipType: 'solo',
    year: '2025',
    timeline: 'Jan 2025 – Ongoing',
    status: 'Live in production — dual navigation, AI search & DocGPT shipped',
    liveUrl: '',
    featured: true,
  },
  imageBase: '/IMAGES/Snap',

  hero: {
    eyebrow: 'Enterprise Documentation · Information Architecture · 2025',
    title: 'SnapLogic Docs',
    tagline: '700 pages of enterprise docs, rebuilt around one question: what are you trying to do?',
    cta: { label: 'View live', url: '' },
    image: 'SNAP_home_01',
  },

  highlights: [
    {
      kicker: 'The problem',
      title: '700 pages in one scrollable sidebar.',
      body: "SnapLogic's docs lived on Confluence — a platform never built for external product documentation — with the whole tree exposed at once, organized only by product.",
    },
    {
      kicker: 'The insight',
      title: 'Users think in tasks, not product names.',
      body: "Someone who wants to 'monitor a pipeline' or 'set up a user' shouldn't have to first decode which of five products holds the answer.",
    },
    {
      kicker: 'The intervention',
      title: 'Browse by product, or by task.',
      body: 'A dual-navigation system: two parallel ways through the same content, with a persistent in-page toggle between them.',
    },
    {
      kicker: 'Why DITA mattered',
      title: 'Each task is its own micro-guide.',
      body: "Because every task maps to a self-contained DITA map, picking a task doesn't filter the 700-page tree — it scopes the view to a purpose-built guide.",
    },
    {
      kicker: 'AI in the docs',
      title: 'Ask a question. Get a cited answer.',
      body: 'An AI Overview search that synthesizes answers with sources, plus DocGPT — a page-level assistant that summarizes and answers in context.',
    },
    {
      kicker: 'The result',
      title: '40% fewer clicks to target.',
      body: 'Validated with automated testing across all five scenarios — now live, replacing the Confluence-hosted site.',
    },
  ],

  closerLook: {
    themes: [],
    items: [
      { image: 'SNAP_glossary_01', caption: 'Glossary — A–Z, with Export-PDF and the persistent top-bar search.' },
      { image: 'SNAP_faq_01', caption: 'FAQ — task-grouped, scannable, export-ready.' },
      { image: 'SNAP_table_01', caption: 'A field/field-set reference table — a reusable content component.' },
      { image: 'SNAP_rightrail_01', caption: "'On this page' + related links, with inline feedback." },
      { image: 'SNAP_search_01', caption: 'Global command search across snaps, pipelines, patterns, and APIs.' },
      { image: 'SNAP_nav_01', caption: 'One-click product access from the top navigation.' },
      { image: 'SNAP_feedback_01', caption: 'Structured feedback captured in context.' },
      { image: 'SNAP_mobile_01', caption: 'Fully responsive — the dual-nav model holds up on mobile.' },
    ],
  },

  flagship: {
    eyebrow: 'The idea',
    headline: 'Dual navigation.',
    lead:
      'The old site had one way in: the product tree. But users arrive two different ways. So the redesign runs **two parallel navigation schemes** over the same content — **browse by product** when you know where you are, **browse by task** when you only know what you want to do — with a **persistent in-page toggle** no iPaaS competitor matches.',
    stats: [
      { num: '40%', label: 'fewer clicks to any target' },
      { num: '700+', label: 'pages, made navigable two ways' },
    ],
    image: 'SNAP_dualnav_01',
    modal: {
      title: 'How task-based navigation works',
      image: 'SNAP_goalcards_01',
      sections: [
        {
          heading: 'Two schemes, one source',
          body: 'Browse by Product filters the sidebar to a single product (AutoSync, Designer, Monitor, SnapGPT, Admin Manager). Browse by Goal groups goals across products — Get Started, Develop Integrations, Develop Agents, Monitor the Runtime, Manage APIs, Administer the Environment, Troubleshoot.',
        },
        {
          heading: 'DITA makes it real',
          body: 'Each task maps to a self-contained DITA map, so selecting a task scopes the entire view to a focused micro-guide instead of a filtered version of a 700-page tree.',
        },
        {
          heading: 'Grounded in IA research',
          body: "The strategy follows Jobs-to-be-Done, Rosenfeld & Morville's multiple-navigation principle, and NN/g's finding that task-based labels beat feature-based labels in first-click testing.",
        },
      ],
    },
  },

  impact: {
    eyebrow: 'Impact',
    headline: 'Fewer clicks on every path.',
    note:
      'Validated with automated Playwright tests across five representative goals: 25 clicks → 15 total. These are floor numbers — the minimum a user who already knows the product taxonomy needs. For a user who doesn\'t, the product-nav path runs higher (wrong guesses, backtracking) while task-nav stays flat.',
    bars: [
      { label: 'Monitor a pipeline execution', before: '5 clicks', after: '3 clicks', beforePct: 100, afterPct: 60 },
      { label: 'Set up a new user account', before: '5 clicks', after: '3 clicks', beforePct: 100, afterPct: 60 },
      { label: 'Generate expressions with SnapGPT', before: '5 clicks', after: '3 clicks', beforePct: 100, afterPct: 60 },
      { label: 'Create a data sync pipeline', before: '5 clicks', after: '3 clicks', beforePct: 100, afterPct: 60 },
      { label: 'Learn the Designer toolbar', before: '5 clicks', after: '3 clicks', beforePct: 100, afterPct: 60 },
    ],
  },

  metrics: [
    { num: '700+', label: 'pages of documentation' },
    { num: '40%', label: 'fewer clicks to target' },
    { num: '9', label: 'IA problems found in the audit' },
    { num: '7', label: 'goal-based entry points' },
    { num: '5', label: 'products, one unified navigation' },
    { num: '1', label: 'designer, end to end' },
  ],

  designSystem: {
    eyebrow: 'The visual system',
    headline: 'A consistent visual language.',
    lead:
      "Not a formal design system, but a disciplined one — a **clean, blue-anchored language** aligned to SnapLogic's brand, plus an **illustration and component style guide** I defined and art-directed across every documentation page.",
    cards: [
      { title: 'Blue-anchored & on-brand', body: 'A clean visual language with generous whitespace, disciplined type, and card-based discovery replacing text-heavy lists.', image: 'SNAP_productcards_01' },
      { title: 'Goal & feature cards', body: 'Task categories and products surfaced as visual cards and quick-action grids on graphical landing pages.', image: 'SNAP_goalcards_01' },
      { title: 'Illustration guide', body: "Defined the style, rules, icon taxonomy, and card components; art-directed a Sr. Graphic Designer's output — from icon specs to step-flow and architecture diagrams.", image: 'SNAP_illustration_01' },
    ],
    modal: null,
  },

  aiLayer: {
    eyebrow: 'The intelligence layer',
    headline: 'Two ways to ask.',
    lead:
      "Users arrive with a question, not a navigation path. So the docs answer in two modes: an **AI Overview** search that synthesizes a response with cited sources, and **DocGPT**, a page-level assistant that summarizes the current page and answers follow-ups in context.",
    cards: [
      { title: 'AI Overview', body: 'Ask in plain language and get a synthesized answer with a sources panel citing the exact pages — no login required.', image: 'SNAP_aimode_01' },
      { title: 'DocGPT', body: 'A docked assistant that summarizes the current page, answers questions, and lets you download the summary.', image: 'SNAP_docgpt_01' },
      { title: 'Meets intent', body: 'No need to know which product holds the answer before you can find it.', image: null },
    ],
  },

  process: {
    eyebrow: 'Process',
    headline: 'Audit to validation.',
    lead:
      'A research-led redesign of a live enterprise documentation site — grounded in an audit, competitor benchmarking, and established IA literature, then proven with automated testing.',
    steps: [
      { no: '01', title: 'Audit', body: 'A structured UX audit of docs.snaplogic.com surfaced nine core IA problems and documented the fixes — a persistent type-ahead search, a collapsible multi-level sidebar, left-aligned chevrons, and consistent heading iconography.' },
      { no: '02', title: 'Listen', body: 'Worked with senior tech writers who held the community feedback repository; the recurring theme was users unable to find content and over-relying on search.' },
      { no: '03', title: 'Benchmark', body: 'Studied iPaaS rivals (MuleSoft, Boomi, Workato) and best-in-class docs (Stripe, AWS, Microsoft Learn, Twilio).' },
      { no: '04', title: 'Ground', body: "Anchored the strategy in IA research: Jobs-to-be-Done, Rosenfeld & Morville's multiple-navigation principle, and NN/g's task-label findings." },
      { no: '05', title: 'Design', body: 'The dual-navigation system, graphical landing pages, AI Overview, and DocGPT — across desktop, tablet, and mobile breakpoints.' },
      { no: '06', title: 'Validate', body: 'Automated Playwright tests proved a 40% reduction in clicks-to-target across five representative goals.' },
    ],
    modal: {
      title: 'The IA foundation & the audit',
      image: 'SNAP_audit_01',
      sections: [
        {
          heading: 'The org-chart anti-pattern',
          body: 'Structuring navigation around internal product boundaries rather than user mental models is a well-documented IA failure mode (Spencer, McGovern). The old site was organized entirely by product.',
        },
        {
          heading: 'Multiple navigation schemes',
          body: "Rosenfeld & Morville recommend exact navigation for users who know the system and exploratory navigation for users who know their goal but not the structure. Dual navigation gives both, without compromise.",
        },
        {
          heading: 'From audit to spec',
          body: 'The UX audit turned findings into concrete, marked-up recommendations — good-to-haves vs. not — covering search placement, sidebar collapse behavior, chevron placement in tree structures, and iconography for main headings.',
        },
      ],
    },
  },

  interactions: {
    eyebrow: 'The details',
    headline: 'The moves that reduce friction.',
    cards: [
      { title: 'In-page nav switching', body: 'Flip between Browse by Feature and Browse by Goal without leaving the page — a persistent toggle right in the sidebar.', image: 'SNAP_dualnav_01' },
      { title: 'One-click product access', body: 'A top-nav mega-menu (Integration platform / Administration and governance / Observability) jumps to any product and auto-filters the sidebar.', image: 'SNAP_nav_01' },
      { title: 'Responsive dual-nav', body: 'The Browse by Feature / Goal model — and the whole tree — collapses cleanly to mobile.', image: 'SNAP_dualnav_02' },
    ],
    signatureFlow: ['Land on the homepage', 'Pick a goal card', 'Sidebar scopes to that DITA map', 'Reach the target page'],
  },

  capabilities: {
    type: 'comparison',
    headline: "Where SnapLogic's docs still lead.",
    note:
      "Competitor cells reflect Jul 2026 research into each vendor's public documentation and release notes. The landscape moved since the original audit: MuleSoft (lifecycle homepage) and Boomi (goals-oriented homepage redesign) now offer goal-based browsing, and Boomi ships a native AI search (Boomi Answers) — but it requires platform login. MuleSoft's docs-AI is an external-LLM hand-off (Open in ChatGPT/Claude/Perplexity), and Workato's public docs stay keyword-only (its conversational AssistIQ is in-product only). None offers a persistent in-page product↔task toggle, public no-login in-page cited answers, or DITA single-source scoping — SnapLogic's genuine differentiators.",
    competitors: ['SnapLogic Docs', 'MuleSoft', 'Boomi', 'Workato'],
    rows: [
      { feature: 'Goal / task-based browsing', values: [true, true, true, false] },
      { feature: 'Persistent in-page product↔task toggle', values: [true, false, false, false] },
      { feature: 'AI-assisted docs search (any form)', values: [true, true, true, false] },
      { feature: 'Public, no-login, in-page cited AI answers', values: [true, false, false, false] },
      { feature: 'DITA single-source (per-task map scoping)', values: [true, false, false, false] },
    ],
  },

  techHandoff: {
    eyebrow: 'Craft & handoff',
    headline: 'Shipped, not just designed.',
    body: 'A strategic UX intervention on a live enterprise site — designed to add zero authoring burden and to be provable.',
    items: [
      { title: 'DITA + conref single-sourcing', body: 'Dual navigation adds no content-maintenance cost — one topic body serves both browse modes.' },
      { title: 'Playwright-validated', body: 'Automated usability tests measured the 40% reduction, goal by goal.' },
      { title: 'Replaced Confluence', body: 'Migrated off a platform never meant for external-facing product documentation.' },
      { title: 'In the scrum', body: 'Bug resolution, developer handoffs, and calls with senior tech writers, department heads, and international managers.' },
    ],
    modal: null,
  },

  role: {
    role: 'Sole Product Designer — Documentation Team',
    ownershipType: 'solo',
    ownership:
      "Owned the IA, dual-navigation system, AI Overview & DocGPT surfaces, illustration guide, and responsive design end to end. Drove alignment with senior tech writers, department heads, and international managers, and secured approvals from SnapLogic's in-house design team.",
    timeline: 'Jan 2025 – Ongoing',
    team: 'Sole designer on the docs team; art-directed a Sr. Graphic Designer',
    tools: ['Figma', 'Claude', 'HTML/CSS (POC)', 'Playwright'],
    responsibilities: [
      'Information architecture',
      'Dual-navigation system',
      'Conversational search (AI Overview + DocGPT)',
      'Illustration guide (art direction)',
      'Responsive design',
      'Usability validation',
    ],
  },

  // Repo project ids (not content slugs) — Ved's repo id is 'paas'.
  related: ['paas', 'revee'],

  images: [
    { id: 'SNAP_home_01', status: 'received', highlight: true, feature: 'dual-nav homepage', alt: "SnapLogic documentation homepage 'What do you want to do?' with Browse by Goals, Browse by Features, and Trending topics", caption: 'The dual-nav homepage.', tags: ['homepage', 'dual navigation', 'browse by goal', 'browse by feature', 'IA'] },
    { id: 'SNAP_dualnav_01', status: 'received', highlight: true, feature: 'dual navigation (in-page toggle)', alt: 'SnapLogic docs internal page with a Browse by Feature / Browse by Goal sidebar toggle and a goal-based breadcrumb', caption: 'Dual navigation with a persistent in-page toggle.', tags: ['dual navigation', 'toggle', 'browse by goal', 'sidebar', 'breadcrumb'] },
    { id: 'SNAP_aimode_01', status: 'received', highlight: true, feature: 'AI Overview search', alt: "SnapLogic docs AI Overview search answering 'Explain Snaps in brief' with a synthesized answer and a cited Sources panel", caption: 'AI Overview — synthesized answers with cited sources.', tags: ['AI search', 'AI overview', 'conversational', 'sources', 'cited answers'] },
    { id: 'SNAP_docgpt_01', status: 'received', highlight: true, feature: 'DocGPT page assistant', alt: 'DocGPT assistant summarizing the current SnapLogic documentation page with a download-summary option', caption: 'DocGPT — page-level summarize and ask.', tags: ['DocGPT', 'AI assistant', 'summarize', 'page-level'] },
    { id: 'SNAP_mobile_01', status: 'received', highlight: true, feature: 'responsive mobile', alt: 'SnapLogic documentation on mobile — a Snap template page with collapsed navigation and footer', caption: 'Responsive to mobile.', tags: ['responsive', 'mobile', 'collapsed nav'] },

    { id: 'SNAP_goalcards_01', status: 'received', feature: 'Browse-by-Goal cards', alt: 'Platform Components and Workflow goal cards in the SnapLogic docs', caption: 'Goal cards.', tags: ['cards', 'browse by goal', 'landing page'] },
    { id: 'SNAP_productcards_01', status: 'received', feature: 'product feature cards', alt: 'Admin Manager, AutoSync, and Monitor product cards with gradient tiles', caption: 'Product cards.', tags: ['cards', 'browse by feature', 'products', 'visual language'] },
    { id: 'SNAP_nav_01', status: 'received', feature: 'top-nav mega menu', alt: 'Observability dropdown in the SnapLogic docs top navigation with Data lineage, Monitor, and OpenTelemetry', caption: 'One-click product access.', tags: ['navigation', 'mega menu', 'one-click access'] },
    { id: 'SNAP_dualnav_02', status: 'received', feature: 'mobile dual-nav sidebar', alt: 'Mobile Browse by Feature / Browse by Goal sidebar in the SnapLogic docs', caption: 'Dual nav on mobile.', tags: ['dual navigation', 'mobile', 'sidebar', 'responsive'] },
    { id: 'SNAP_aimode_02', status: 'received', feature: 'Ask in AI Mode entry', alt: "'Ask in AI Mode' banner explaining Snaps with suggested questions", caption: "The 'Ask in AI Mode' entry point.", tags: ['AI search', 'entry point', 'suggested questions'] },
    { id: 'SNAP_search_01', status: 'received', feature: 'global command search', alt: "Global search modal 'Search docs, tasks, products' with keyboard navigation hints", caption: 'Global command search.', tags: ['search', 'command palette', 'keyboard'] },
    { id: 'SNAP_glossary_01', status: 'received', feature: 'glossary', alt: 'SnapLogic docs Glossary page with an A–Z index and term definitions', caption: 'The Glossary.', tags: ['glossary', 'A-Z', 'reference'] },
    { id: 'SNAP_faq_01', status: 'received', feature: 'FAQ page', alt: 'SnapLogic docs Frequently Asked Questions page with a Getting Started section and Export PDF', caption: 'The FAQ.', tags: ['FAQ', 'getting started', 'export pdf'] },
    { id: 'SNAP_table_01', status: 'received', feature: 'reference table component', alt: 'A field / field-set reference table with Label and Snap execution rows', caption: 'A reference-table component.', tags: ['table', 'reference', 'content component'] },
    { id: 'SNAP_rightrail_01', status: 'received', feature: 'on-this-page rail', alt: "'On this page' and Related Information right rail with an inline 'Did this content help?' prompt", caption: "'On this page' + related links.", tags: ['on this page', 'related', 'feedback', 'right rail'] },
    { id: 'SNAP_feedback_01', status: 'received', feature: 'feedback modal', alt: "'Send Feedback to Snaplogic' modal with email, feedback type, and description fields", caption: 'Feedback, captured in context.', tags: ['feedback', 'modal', 'engagement'] },
    { id: 'SNAP_mobilenav_01', status: 'received', feature: 'mobile nav drawer', alt: 'SnapLogic docs mobile navigation drawer with Product, Features, Getting Started, and Support', caption: 'Mobile nav drawer.', tags: ['mobile', 'navigation drawer', 'responsive'] },
    { id: 'SNAP_video_01', status: 'received', feature: 'video walkthrough CTA', alt: "'Watch quick walkthrough videos for Snaplogic' call-to-action banner", caption: 'Video walkthrough CTA.', tags: ['video', 'CTA', 'banner'] },
    { id: 'SNAP_agentcreator_01', status: 'received', feature: 'Agent Creator promo banner', alt: "'Introducing Agent Creator' beta banner in the SnapLogic docs", caption: 'Agent Creator promo banner.', tags: ['banner', 'promo', 'agent creator', 'beta'] },
    { id: 'SNAP_illustration_01', status: 'received', feature: 'illustration card components', alt: 'Illustration guide — main component sheet for illustration cards with labels and node icons', caption: 'Illustration guide — card components.', tags: ['illustration guide', 'components', 'cards', 'icons'] },
    { id: 'SNAP_illustration_02', status: 'received', feature: 'icon system specs', alt: 'Illustration guide icon specifications for Database, Customer application, FeedMaster Node, and Execution Node', caption: 'Illustration guide — icon specs.', tags: ['illustration guide', 'icons', 'specs', 'iconography'] },
    { id: 'SNAP_illustration_03', status: 'received', ext: 'jpg', feature: 'step-flow diagram', alt: 'Five-step arrow diagram for setting up a Snap Account: Create, Define, Locate, Authorize, Validate', caption: 'A step-flow diagram from the guide.', tags: ['illustration guide', 'diagram', 'step flow'] },
    { id: 'SNAP_illustration_04', status: 'received', ext: 'jpg', feature: 'architecture diagram', alt: 'SnapLogic control-plane / data-plane architecture diagram with Cloudplex, Groundplex, and firewall', caption: 'A control/data-plane architecture diagram.', tags: ['illustration guide', 'diagram', 'architecture', 'control plane', 'data plane'] },
    { id: 'SNAP_audit_01', status: 'received', feature: 'UX audit deliverable', alt: 'UX audit of the SnapLogic documentation side navigation panel with marked good-to-have and not-to-have feedback', caption: 'The UX audit deliverable.', tags: ['UX audit', 'process', 'IA', 'feedback'] },
  ],
}

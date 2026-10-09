import type { RichCaseStudy } from '../caseStudyTypes'

// Ved — rich case-study content (portfolio-schema v0.1, session 2).
// Source: ved.json + manifest.json (captions/alt). All 23 images received and
// living in public/IMAGES/Ved/. The competitor matrix's non-Ved cells were
// researched Jul 2026 from vendor docs + analyst reports:
//   adobe.com (AEM Guides AI assistant + features), heretto.com (AI, creating),
//   paligo.net (next-gen editor, AI in tech docs), madcapsoftware.com (IXIA CCMS),
//   verifiedmarketresearch.com (best CCMS roundup).
// The Impact (before/after bars) section is deliberately omitted — no validated
// deltas exist for Ved yet; unverified figures stay out of the portfolio.

export const VED_CASE_STUDY: RichCaseStudy = {
  meta: {
    slug: 'ved',
    name: 'Ved',
    category: 'Enterprise CMS · DITA Builder',
    role: 'Product Designer',
    ownershipType: 'collab',
    year: '2025',
    timeline: 'Mid 2025 – Ongoing',
    status: 'V2 shipped 2026 · in engineering build',
    liveUrl: '',
    featured: true,
  },
  imageBase: '/IMAGES/Ved',

  hero: {
    eyebrow: 'Enterprise CMS · DITA Builder · Product Design · 2025',
    title: 'Ved',
    tagline: 'Author, converse, monetize. One canvas.',
    cta: { label: 'View live', url: '' },
    image: 'VED_canvas_01',
  },

  highlights: [
    {
      kicker: 'The problem',
      title: 'Structured authoring locked out the people who write.',
      body: "DITA's power lived in developer-grade tools. The department authors who owned the content couldn't touch it — and prompts had no governance at all.",
    },
    {
      kicker: 'The approach',
      title: 'Two opposed authors, one canvas.',
      body: 'A single surface with progressive disclosure — full XML control when you want it, a clean WYSIWYG when you don\'t.',
    },
    {
      kicker: 'No-code conditionals',
      title: 'Conditional content, without a developer.',
      body: 'Mark, select on the canvas, preview live, confirm — conditional logic at the Map, Topic, and Variable level with no rules to write.',
    },
    {
      kicker: 'Ask Aeon',
      title: 'An AI layer that speaks your content.',
      body: 'Sessionized chat with tappable variable chips, entity-linked answers, and suggested next actions — every prompt a rateable, reusable asset.',
    },
    {
      kicker: 'Prompt-as-a-Service',
      title: 'Prompts as first-class, governed assets.',
      body: 'Versioned, quality-scored, and publishable to a marketplace — a content category none of the incumbents offer.',
    },
    {
      kicker: 'The outcome',
      title: 'Three products in one canvas.',
      body: 'Authoring, AI, and monetization on a single surface — V2 shipped 2026 and in engineering build.',
    },
  ],

  closerLook: {
    themes: [],
    items: [
      { image: 'VED_media_01', caption: 'The Media Library — multi-format assets, collections, and one-click publish to the marketplace.' },
      { image: 'VED_ops_01', caption: 'The Operations view — a governance dashboard for content activity across the workspace.' },
      { image: 'VED_dashboard_01', caption: 'Content analytics — reuse rate, quality score, validation errors, and AI-detected gaps.' },
      { image: 'VED_html_01', caption: 'A built-in HTML editor with live browser preview and console.' },
      { image: 'VED_video_01', caption: 'In-context video editing, with animation and playback controls.' },
      { image: 'VED_pdftheme_01', caption: 'Configure PDF themes in YAML or JSON, with a live document preview.' },
      { image: 'VED_metadata_01', caption: 'Rich asset metadata — technical, performance, and CMS-specific, with version history.' },
      { image: 'VED_fonts_01', caption: 'Fonts as managed, versioned assets alongside video, audio, 3D, and DITA.' },
    ],
  },

  flagship: {
    eyebrow: 'The idea',
    headline: 'No-code conditional content.',
    lead:
      'Structured authoring usually treats conditional content as a developer task — profiling attributes, DITAVAL files, raw XML. Ved makes it visual. Mark a variable **non-mandatory**, choose what to include or exclude **right on the canvas**, preview it **live**, and confirm — conditional logic at the Map, Topic, and Variable level, without writing a single rule.',
    stats: [
      { num: '3-in-1', label: 'authoring · AI · monetization, one canvas' },
      { num: '3-tier', label: 'conditional rendering — Map · Topic · Variable' },
    ],
    image: 'VED_conditional_01',
    modal: {
      title: 'How conditional content works',
      image: 'VED_conditional_01',
      sections: [
        {
          heading: 'Reframing the prompt',
          body: "The old model treated conditional logic as configuration. We reframed it as writing: start from the content you're authoring, mark what's optional, and let the system handle the rule underneath.",
        },
        {
          heading: 'The five-step flow',
          body: 'Mark a variable non-mandatory → the content-selection panel appears → select the content on the canvas → preview the resolved output live → confirm. No code, no context-switching.',
        },
        {
          heading: 'Three levels, one model',
          body: 'Map-level conditions swap whole structures (Region = USA), Topic-level conditions toggle topics within a map (Plan = Premium), and Variable-level conditions — the most nuanced — nest independent rules inside topics.',
        },
        {
          heading: 'Why it holds up',
          body: 'Underneath the WYSIWYG, DITA/XML validation stays intact — authors get simplicity without breaking the structure engineering depends on.',
        },
      ],
    },
  },

  metrics: [
    { num: '3-in-1', label: 'authoring · AI · monetization' },
    { num: '3-tier', label: 'conditional rendering (Map · Topic · Variable)' },
    { num: '7', label: 'asset formats in the Media Library' },
    { num: '4.5/5', label: 'example prompt quality score (Prompt-as-a-Service)' },
    { num: '0', label: 'XML the author has to touch' },
    { num: 'V2', label: 'shipped 2026, in engineering build' },
  ],

  designSystem: {
    eyebrow: 'The system',
    headline: 'One library, every surface.',
    lead:
      'A full Figma component library — **canvas, Ask Aeon, PaaS, no-code conditionals, Media Library, and DRM** — that passed design-system review before handoff, with a complete token map delivered to engineering.',
    cards: [
      { title: 'Blocks that assemble', body: 'Topic Blocks, Content Blocks, and Layout Blocks (Full-Width, 2×1, 3×1, 2×2) drag straight onto the canvas.', image: 'VED_block_01' },
      { title: 'Card-based everything', body: 'Assets, documents, and prompts share one card language — thumbnail, type badge, metadata, and a contextual menu.', image: 'VED_media_02' },
      { title: 'Consistent across views', body: 'Marketplace Front, Immersive View, and Operations view stay coherent through one set of tokens and iconography.', image: 'VED_nav_01' },
    ],
    modal: null,
  },

  aiLayer: {
    eyebrow: 'The intelligence layer',
    headline: 'Ask Aeon.',
    lead:
      'Most tools bolt AI on as a side panel. Ved makes it a **governed, sessionized layer**. Ask in plain language, steer the answer with **tappable variable chips**, follow **entity links** back to your content, and act on **suggested next steps** — with every prompt saved as a rateable, reusable asset.',
    cards: [
      { title: 'Sessionized & scored', body: 'Each conversation is a prompt session with a quality rating, an artifacts-produced count, and trend metrics — not a disposable chat.', image: 'VED_askkya_01' },
      { title: 'Chips, links & actions', body: 'Variable-token chips make parameters visible and editable; entity links connect answers to content objects; suggested actions turn talk into workflow.', image: null },
      { title: 'Prompt-as-a-Service', body: 'Prompts become versioned, governed assets you can reuse across the agent ecosystem or publish to the marketplace.', image: null },
    ],
  },

  process: {
    eyebrow: 'Process',
    headline: 'From two personas to one canvas.',
    lead:
      'An audit-to-handoff arc anchored on one hard question: how do you serve a tech writer and a department author on the same surface without compromising either?',
    steps: [
      { no: '01', title: 'Audit', body: 'Competitive teardown of AEM Guides, Heretto, Paligo, and IXIASOFT — mapping where structured power and everyday usability stop overlapping.' },
      { no: '02', title: 'Research', body: 'Jobs-to-be-done interviews across three roles: tech writer, department author, and content manager; studied Quillbot, Scalenut, and Oxygen XML for in-context AI patterns.' },
      { no: '03', title: 'Define', body: 'Two opposed personas, one canvas — resolved through progressive disclosure.' },
      { no: '04', title: 'Explore', body: 'Three canvas architectures, each tested against four core authoring tasks.' },
      { no: '05', title: 'Design', body: 'The canvas, Ask Aeon, and the no-code conditional flow — reframed from the author\'s point of view.' },
      { no: '06', title: 'Handoff', body: 'Annotated DITA semantics, a token map, and an IA rationale doc, delivered inside the engineering scrum.' },
    ],
    modal: {
      title: 'The personas and the reframe',
      image: null,
      sections: [
        {
          heading: 'Three roles, one surface',
          body: 'Tech writer (structure and reuse), department author (speed and clarity), content manager (governance and quality). The canvas had to make all three feel at home.',
        },
        {
          heading: 'Why chat, not inline suggestions',
          body: 'DITA authoring involves multi-step reasoning — conditional logic, variables, cross-references — that benefits from conversational back-and-forth over single-shot suggestions. Chat also let each interaction become a reusable, governed prompt session.',
        },
      ],
    },
  },

  interactions: {
    eyebrow: 'The details',
    headline: 'The moves that make it feel effortless.',
    cards: [
      { title: 'Author / XML / Relationship', body: 'Toggle between a WYSIWYG author view, raw XML for power users, and a radial Relationship graph of the map and its topics.', image: 'VED_relationship_01' },
      { title: 'Review in place', body: 'Threaded comments, @mentions, and real-time presence keep review inside the document instead of scattered across email.', image: 'VED_comments_01' },
      { title: 'Publish to the marketplace', body: 'Save as template, export to HTML or PDF, share with granular access, or publish straight to the Holocracy marketplace.', image: 'VED_export_01' },
    ],
    signatureFlow: ['Mark variable non-mandatory', 'Content-selection panel appears', 'Select on the canvas', 'Preview live', 'Confirm'],
  },

  explainer: {
    eyebrow: 'DITA, simply',
    headline: 'One Diwali letter. Fifty people. Written once.',
    lead:
      'An example for anyone who has never heard of DITA. HR wants to send a **Diwali bonus letter** to two departments, Design and Finance, with 25 people in each. Every letter is personal: it names the person, thanks their team for its own year, and pays a bonus that depends on the output they delivered.',
    analogy:
      '**Think of LEGO.** Instead of typing 50 letters by hand, you build one small set of bricks and a set of rules. Ved snaps the right bricks together for each person, so everyone gets their own letter.',
    idle: 'Tap a step to walk through it, or tap any person to see the letter they receive.',
    steps: [
      {
        focus: 'blocks',
        title: 'Break it into bricks',
        body: 'The letter is not one long document. It is five small bricks, which DITA calls **topics**. Each brick is written once, and the master letter (a **map**) lists them in order.',
      },
      {
        focus: 'blanks',
        title: 'Leave blanks to fill',
        body: 'Anything personal, like a name or an amount, is a **blank** that DITA calls a **variable**. The author never types 50 names; each one is filled in automatically.',
      },
      {
        focus: 'rules',
        title: 'Say who gets which brick',
        body: 'Some bricks come in versions. A **condition** says that Design people get the Design brick, and that the bonus brick follows each person’s output. Colours show which rule each person falls under.',
      },
      {
        focus: 'publish',
        title: 'Press publish once',
        body: 'Ved snaps the right bricks together for every reader at once: **50 personal letters from one source**, without copying and pasting.',
      },
    ],
    groups: [
      {
        id: 'design',
        label: 'Design',
        people: [
          ['Aarav', 'met'], ['Ishita', 'ex'], ['Kabir', 'met'], ['Meera', 'grow'], ['Rohan', 'met'],
          ['Ananya', 'ex'], ['Vihaan', 'met'], ['Diya', 'met'], ['Arjun', 'grow'], ['Saanvi', 'ex'],
          ['Reyansh', 'met'], ['Tara', 'met'], ['Aditya', 'ex'], ['Kiara', 'grow'], ['Dev', 'met'],
          ['Nisha', 'met'], ['Kunal', 'ex'], ['Pooja', 'met'], ['Yash', 'grow'], ['Riya', 'met'],
          ['Neel', 'ex'], ['Sana', 'met'], ['Varun', 'grow'], ['Zoya', 'met'], ['Aryan', 'grow'],
        ],
      },
      {
        id: 'finance',
        label: 'Finance',
        people: [
          ['Priya', 'ex'], ['Rahul', 'met'], ['Sneha', 'met'], ['Vikram', 'grow'], ['Aisha', 'met'],
          ['Karan', 'met'], ['Divya', 'ex'], ['Nikhil', 'met'], ['Ritu', 'grow'], ['Siddharth', 'met'],
          ['Neha', 'ex'], ['Manav', 'met'], ['Kavya', 'met'], ['Harsh', 'grow'], ['Isha', 'met'],
          ['Amit', 'ex'], ['Shreya', 'met'], ['Pranav', 'grow'], ['Tanvi', 'met'], ['Rishi', 'met'],
          ['Anjali', 'ex'], ['Gaurav', 'met'], ['Mira', 'grow'], ['Om', 'met'], ['Leela', 'grow'],
        ],
      },
    ],
    tiers: [
      { id: 'ex', label: 'Went beyond targets', amount: '₹40,000' },
      { id: 'met', label: 'Hit every target', amount: '₹25,000' },
      { id: 'grow', label: 'Growing into the role', amount: '₹15,000' },
    ],
    blocks: [
      { id: 'greet', label: 'Greeting', varies: 'none', text: 'Happy Diwali, {name}!' },
      {
        id: 'note',
        label: 'Note from leadership',
        varies: 'none',
        text: 'This year was built by people like you. Thank you for the light you brought to it.',
      },
      {
        id: 'team',
        label: 'Your team’s year',
        varies: 'group',
        versions: {
          design: 'The {team} team rebuilt the design system and shipped it across four products.',
          finance: 'The {team} team closed the books five days faster, every single quarter.',
        },
      },
      {
        id: 'bonus',
        label: 'Your bonus',
        varies: 'tier',
        versions: {
          ex: 'You went beyond your targets, so your Diwali bonus is {amount}.',
          met: 'You hit every target you set, so your Diwali bonus is {amount}.',
          grow: 'You grew fast this year, and your Diwali bonus is {amount}.',
        },
      },
      { id: 'pay', label: 'When it arrives', varies: 'none', text: 'It arrives with your October salary.' },
    ],
    labels: {
      source: '1 · The master letter, written once',
      readers: '2 · The rules pick each person’s bricks',
      result: '3 · What {name} receives',
      none: 'Same for everyone',
      group: 'Changes by team',
      tier: 'Changes by output',
      writtenOnce: 'pieces of text written once',
      delivered: 'personal letters delivered',
    },
    edit: {
      blockId: 'pay',
      button: 'Try it: move the payment date',
      undo: 'Undo the change',
      text: 'It arrives early, on 30 October, before the festival.',
      note: '**One edit, fifty letters updated.** With 50 separate files, that is 50 edits, and the one you miss.',
    },
    glossary: [
      { term: 'Topic', plain: 'One brick. A small piece of content that makes sense on its own.' },
      { term: 'Map', plain: 'The instruction sheet: which bricks go in, and in what order.' },
      { term: 'Variable', plain: 'A blank to fill in, like the name on a birthday card.' },
      { term: 'Condition', plain: 'A rule that decides which version of a brick each reader gets.' },
      { term: 'Publish', plain: 'Snapping the bricks together, for every reader at once.' },
    ],
    footnote:
      'An illustrative example: names, teams, achievements, and amounts are invented to show how the system works, not taken from a real organisation.',
  },

  walkthrough: {
    eyebrow: 'Worked example · end to end',
    headline: 'Onboarding an HR author, from invite to published.',
    lead:
      'An example of how the onboarding workflow can run for a new department author — here, someone in HR. It follows one person from the invite they receive to the moment employees are reading their work, and it turns on one idea: **50 policies are not 50 documents.**',
    scenario:
      '**The example.** A new HR author joins the workspace. Their first job: publish 50 company policies, illustrated from the Media Library, to the point where employees can read them. Chosen because it touches every part of the system at once — onboarding, structure, variants, assets, review, and secure sharing.',
    actors: ['HR author', 'Content manager', 'Reviewer', 'System'],
    method: {
      title: 'Start from the job, not the screen',
      lead:
        "The journey is built on the same method as the rest of Ved: **jobs-to-be-done** interviews across the three roles, written here as job stories. Each screen that follows exists to serve one of these jobs.",
      jobs: [
        {
          actor: 'HR author',
          when: 'a policy has to be written or changed,',
          want: 'do it myself, in an editor that feels familiar,',
          so: 'publish without raising a ticket to a specialist.',
        },
        {
          actor: 'Content manager',
          when: 'many authors publish into one library,',
          want: 'see quality, reuse, and validation in one place,',
          so: 'stop problems before they reach employees.',
        },
        {
          actor: 'Tech writer',
          when: 'non-specialists start authoring structured content,',
          want: 'the DITA structure and reuse to stay intact,',
          so: 'I am not repairing broken XML afterwards.',
        },
      ],
      steps: [
        { title: 'JTBD interviews', body: 'Three roles — tech writer, department author, content manager. Produced the job stories above.' },
        { title: 'Competitive teardown', body: 'AEM Guides, Heretto, Paligo, IXIASOFT. Showed where the journey usually breaks: the handoff to a specialist.' },
        { title: 'Define', body: 'Two opposed authors, one canvas, resolved through **progressive disclosure**.' },
        { title: 'Explore', body: 'Three canvas architectures, each tested against four core authoring tasks.' },
        { title: 'Journey in screens', body: 'The path below, one screen per step, with no exit to email or a developer.' },
        { title: 'Handoff', body: 'Annotated DITA semantics, a token map, and an IA rationale, inside the engineering scrum.' },
      ],
    },
    screens: {
      title: 'The journey, screen by screen',
      lead: 'Low-fidelity, to show the flow rather than the finish. The **accent** marks what the author acts on in each screen — follow it across and you have the path.',
      items: [
        { kind: 'invite', no: '01', title: 'The invite', body: 'The HR author receives an invite already scoped to the policy project and their role.', affordance: 'Accept and land inside the project' },
        { kind: 'workspace', no: '02', title: 'A guided empty state', body: 'The project opens on an empty state that names the first move instead of a blank canvas.', affordance: 'Create the first DITA file' },
        { kind: 'template', no: '03', title: 'Start from the house template', body: 'The content manager’s saved policy template sets structure, topic types, and layout.', affordance: 'Use template' },
        { kind: 'canvas', no: '04', title: 'Author on the canvas', body: 'Outline on the left, the page in the middle, blocks on the right. Author view only — no XML.', affordance: 'Drag in a content block' },
        { kind: 'topic', no: '05', title: 'Add or edit a topic', body: 'Inside the content block, add a new topic, such as Eligibility, or edit an existing one’s text. The content is in place before any variation is set.', affordance: 'Save the topic' },
        { kind: 'conditional', no: '06', title: 'Variants without rules', body: 'With the topic written, mark a variable non-mandatory, select the regional content on the canvas, and preview it live.', affordance: 'Confirm the condition' },
        { kind: 'media', no: '07', title: 'Pick, don’t upload', body: 'Images come from the Media Library by reference, so one change reaches every policy.', affordance: 'Insert asset' },
        { kind: 'review', no: '08', title: 'Review in place', body: 'Legal comments on the exact clause; the author resolves threads without leaving the page.', affordance: 'Resolve and request sign-off' },
        { kind: 'export', no: '09', title: 'Export and share', body: 'One menu for template, HTML, branded PDF, granular sharing, or the marketplace.', affordance: 'Share with access control' },
        { kind: 'published', no: '10', title: 'Employees read it', body: 'Delivered on a pre-signed, time-limited link, watermarked to the reader who opened it.', affordance: 'Done — and next year starts from the source' },
      ],
    },
    lanes: {
      title: 'Who does what, phase by phase',
      phases: ['Invite', 'Set up', 'Author', 'Illustrate', 'Review', 'Publish', 'Maintain'],
      rows: [
        { actor: 'HR author', cells: [null, 'Accepts the invite, lands in the project', 'Builds from the template, sets conditions', 'Pulls assets from the library', 'Resolves comments', 'Exports and shares', null] },
        { actor: 'Content manager', cells: ['Creates the project, sets access', 'Saves the house template', null, 'Curates the collection', 'Gates on the quality dashboard', null, 'Watches the Operations view'] },
        { actor: 'Reviewer', cells: [null, null, null, null, 'Comments in place, @mentions', null, null] },
        { actor: 'System', cells: ['Sends the scoped invite', null, 'Validates DITA on every edit', 'Versions every asset', null, 'Watermarks and signs the link', 'Archives on the retention window'] },
      ],
      caption:
        'Dashed cells are deliberate: each role steps in only where it adds judgment, and the system carries validation, versioning, and protection continuously. There is no step where the author has to leave the product — no email round-trip, no ticket to a developer.',
    },
    collapse: {
      title: 'Where the fifty actually goes',
      total: 50,
      sources: 18,
      flatLabel: 'Flat editor — one document per policy',
      flatNote: '50 documents authored, 50 to review, 50 to revise every cycle.',
      structuredLabel: 'Ved — reusable topics + three-level conditionals',
      structuredNote: '18 source maps authored; conditionals resolve the rest at publish time.',
      caption:
        'Illustrative, not measured — the ratio depends on how many policies share a clause set. What was designed is the mechanism: topic reuse plus Map/Topic/Variable conditions, so authoring cost tracks *distinct content* rather than document count.',
    },
    stages: [
      {
        no: '01',
        title: 'Open the workspace',
        actor: 'Content manager',
        body:
          "A project is created for the policy set. The Projects view tracks draft and deployed counts, and a new project's empty state prompts the first DITA file — so the opening move is obvious instead of a blank canvas. The share modal sets collaborator emails, an access link, and access type, so HR authors, legal reviewers, and the content manager each enter with the permissions their role needs.",
        atScale: 'Access is configured once for the whole set, not renegotiated per policy.',
      },
      {
        no: '02',
        title: 'Structure the first policy',
        actor: 'HR author',
        body:
          'A policy is not one blob. It decomposes into DITA topic types — **Concept** for what the policy is and why it exists, **Task** for what the employee has to do, **Reference** for eligibility tables, entitlements, and escalation contacts. Topic, content, and layout blocks (Full-Width, 2×1, 3×1, 2×2) drag straight onto the canvas, and a DITA Map assembles them into the handbook.',
        atScale: 'Saved as a template, so policies 2–50 inherit the structure instead of re-deciding it 49 times.',
      },
      {
        no: '03',
        title: 'Let conditionals absorb the variants',
        actor: 'HR author',
        body:
          'Most policies differ only by region, legal entity, grade, or employment type. Conditions handle that at three levels: **Map** swaps whole structures, **Topic** toggles topics inside a map, **Variable** nests rules inside a topic. The author writes no rules — mark the variable non-mandatory, select the content on the canvas, preview the resolved output live, confirm.',
        atScale:
          'A leave policy that varies across four regions stays one source, not four near-identical documents drifting out of sync.',
      },
      {
        no: '04',
        title: 'Pull the assets, don’t paste them',
        actor: 'HR author',
        body:
          'Assets are referenced, not embedded. An image block pulls from the Media Library rather than re-uploading, across seven asset formats — including fonts as versioned assets, so the handbook’s typography is governed like content. Each asset carries technical, performance, and CMS metadata plus version history, and video can be edited in context for something like an induction explainer.',
        atScale:
          'Replace the org chart once and every policy referencing it updates — no 50-document find-and-replace.',
      },
      {
        no: '05',
        title: 'Hold one voice across the set',
        actor: 'Content manager',
        body:
          'At this volume the hard problem is not typing, it is consistency of tone and reading level. Ask Aeon is a governed, sessionized layer — ask in plain language, steer the answer with tappable variable chips, follow entity links back into the content, act on suggested next steps. Prompt-as-a-Service then turns the instruction itself into a versioned, quality-scored asset.',
        atScale:
          'Legal approves one governed prompt instead of auditing 50 unpredictable rewrites.',
      },
      {
        no: '06',
        title: 'Review inside the document',
        actor: 'Reviewer',
        body:
          'Threaded comments, @mentions, and real-time presence keep review in the document instead of scattered across email. The content manager can flip to the Relationship view — a radial graph of the map — to check reuse and cross-references, or drop to raw XML; the HR author stays in Author view and never touches markup. DITA validation stays intact under the WYSIWYG, so a non-technical author cannot silently break structure.',
        atScale:
          'The analytics dashboard gates the batch: reuse rate, quality score, validation errors, and AI-detected gaps.',
      },
      {
        no: '07',
        title: 'Publish and share',
        actor: 'HR author',
        body:
          'One menu: save as template, export to HTML, export to PDF, share with granular access, or publish to the marketplace. PDF themes are configured in YAML or JSON against a live preview, so the handbook comes out branded rather than generic, and external sharing goes out on pre-signed, time-limited URLs.',
        atScale:
          'Dynamic watermarking injects user ID and timestamp, so a leaked policy is traceable to the download that produced it.',
      },
      {
        no: '08',
        title: 'Govern the lifecycle',
        actor: 'System',
        body:
          'Licences are created, renewed, and revoked across CC, proprietary, and time-limited terms. Retention policies archive and expire content automatically. Ownership transfer carries GDPR-compliant audit logging for when a policy owner changes role. After publication the Operations view reports activity and success-rate trends.',
        atScale:
          'Retention windows map onto the annual review cycle — so next year’s revision edits the source topic and re-resolves every variant.',
      },
    ],
    footnote:
      'Ved V2 shipped 2026 and is in engineering build, so this is the **designed** flow rather than measured production throughput. No HR team has yet pushed 50 policies through it end to end; reuse rate and time-to-publish are the first two metrics I would instrument at launch.',
  },

  capabilities: {
    type: 'comparison',
    headline: 'Where Ved actually differs.',
    note:
      'Ved column from the case study; competitor cells researched Jul 2026 from vendor documentation and analyst reports. Honest read: incumbents match Ved on structured authoring, a familiar editor, and (increasingly) an AI assistant — Ved differentiates on prompt governance, a no-code visual conditional flow for non-technical authors, and marketplace monetization. Paligo is DocBook-based, not DITA. All four competitors support conditional content via DITA/profiling attributes; the no-code row refers specifically to a visual flow. *Not documented — MadCap IXIA (IXIASOFT) AI is mainly delivery/search-side.',
    competitors: ['Ved', 'Adobe AEM Guides', 'Heretto', 'Paligo', 'MadCap IXIA (IXIASOFT)'],
    rows: [
      { feature: 'Structured DITA / XML authoring', values: [true, true, true, true, true] },
      { feature: 'Familiar editor for non-technical authors', values: [true, true, true, true, false] },
      { feature: 'Conversational AI authoring assistant', values: [true, true, true, true, null] },
      { feature: 'Governed, reusable prompts (Prompt-as-a-Service)', values: [true, false, false, false, false] },
      { feature: 'No-code visual conditional content (non-technical)', values: [true, false, false, false, false] },
      { feature: 'Content marketplace / monetization', values: [true, false, false, false, false] },
    ],
  },

  techHandoff: {
    eyebrow: 'Craft & handoff',
    headline: 'Built to survive the handoff.',
    body: 'Design decisions that hold up in production — the structured integrity engineers need, wrapped in an interface authors actually enjoy.',
    items: [
      { title: 'DITA/XML integrity', body: 'Validation stays intact under the WYSIWYG layer — nothing breaks the structure.' },
      { title: 'Annotated semantics', body: 'DITA semantics, a token map, and an IA rationale doc, documented for engineering.' },
      { title: 'Governance built in', body: 'Encryption, dynamic watermarking, pre-signed URLs, license management, and retention flows — GDPR, ISO 27001, and NIST considered from the first sketch.' },
      { title: 'In the scrum', body: 'Embedded in the engineering sprint — designed with the build, not thrown over the wall.' },
    ],
    compliance: ['GDPR', 'ISO 27001', 'NIST'],
    modal: {
      title: 'DRM & compliance, by design',
      image: null,
      sections: [
        {
          heading: 'Protecting the asset',
          body: 'Content encryption at rest and in transit, dynamic watermarking with user-ID + timestamp injection, and pre-signed, time-limited URLs with auto-copy for secure sharing.',
        },
        {
          heading: 'Governing the lifecycle',
          body: 'License management (create, renew, revoke) with CC / Proprietary / Time-Limited support, ownership transfer with GDPR-compliant audit logging, and retention policies with automated archiving and expiration.',
        },
      ],
    },
  },

  role: {
    role: 'Product Designer',
    ownershipType: 'collab',
    ownership:
      'Owned the authoring canvas, the Ask Aeon conversational layer, the dynamic-content system, the Media Library, and DRM — CEO-approved before handoff.',
    timeline: 'Mid 2025 – Ongoing',
    team: 'Collaborated with one other designer; embedded in the engineering scrum',
    tools: ['Figma', 'Confluence'],
    responsibilities: [
      'DITA Builder canvas',
      'Conversational UX (Ask Aeon / Prompt-as-a-Service)',
      'No-code conditional content',
      'Media Library',
      'DRM & compliance',
    ],
  },

  related: ['snaplogic', 'revee'],

  images: [
    { id: 'VED_canvas_01', status: 'received', highlight: true, feature: 'authoring canvas', alt: 'The Ved DITA Builder canvas with DITA Outline, WYSIWYG editor, and the Content/Variable/Integrate panel', caption: 'The three-panel DITA Builder canvas.', tags: ['canvas', 'DITA', 'WYSIWYG', 'authoring', 'three-panel'] },
    { id: 'VED_conditional_01', status: 'received', highlight: true, feature: 'no-code conditional content', alt: 'Editing a variable in Ved and marking it non-mandatory for no-code conditional content', caption: 'Marking a variable non-mandatory for no-code conditional content.', tags: ['conditional', 'no-code', 'variable', 'dynamic-content'] },
    { id: 'VED_askkya_01', status: 'received', highlight: true, feature: 'Ask Aeon conversational layer', alt: 'Ask Aeon conversational panel with prompt sessions, variable-token chips, entity links, and suggested actions', caption: 'Ask Aeon — sessionized, governed, conversational authoring.', tags: ['Ask Aeon', 'AI', 'conversational', 'prompt-as-a-service'] },
    { id: 'VED_relationship_01', status: 'received', highlight: true, feature: 'Relationship view (radial DITA graph)', alt: 'Radial relationship graph of a DITA map in Ved showing topic types, reuse, and keyref relationships', caption: 'The Relationship view — a radial graph of the DITA map.', tags: ['relationship', 'DITA map', 'graph', 'visualization'] },
    { id: 'VED_ops_01', status: 'received', highlight: true, feature: 'Operations / governance dashboard', alt: 'Ved Operations view governance dashboard with document, topic, and content-block metrics and activity breakdowns', caption: 'The Operations view governance dashboard.', tags: ['operations', 'governance', 'dashboard', 'analytics'] },
    { id: 'VED_block_01', status: 'received', feature: 'content & layout blocks (drag-drop)', alt: 'Dragging an Image content block onto a topic in the Ved canvas', caption: 'Drag-and-drop content and layout blocks.', tags: ['content blocks', 'drag-drop', 'layout blocks'] },
    { id: 'VED_block_02', status: 'received', feature: 'topic block empty state', alt: 'Empty topic block with layout-block options in the Ved canvas', caption: 'Topic block empty state.', tags: ['topic block', 'empty state', 'canvas'] },
    { id: 'VED_marketplace_01', status: 'received', feature: 'Holocracy marketplace widget', alt: 'Holocracy marketplace widget promoting purchasable icon libraries inside the Ved Media Library', caption: 'Marketplace monetization, surfaced in the Media Library.', tags: ['marketplace', 'monetization', 'libraries'] },
    { id: 'VED_ops_02', status: 'received', feature: 'activity breakdown chart', alt: 'Brick Activity Breakdown chart in the Ved Operations view with success-rate trends', caption: 'An activity-breakdown chart from the Operations view.', tags: ['operations', 'chart', 'analytics'] },
    { id: 'VED_media_02', status: 'received', feature: 'audio asset card', alt: 'Audio (MP3) asset card in the Ved Media Library with tags and duration', caption: 'An audio asset card.', tags: ['media library', 'asset card', 'audio'] },
    { id: 'VED_nav_01', status: 'received', feature: 'top navigation views', alt: 'Ved top navigation with Marketplace Front, Immersive View, and Operations view', caption: 'The three top-level views.', tags: ['navigation', 'views', 'information architecture'] },
    { id: 'VED_export_01', status: 'received', feature: 'export & publish menu', alt: 'Ved export and publish menu with Save as Template, Export HTML/PDF, Share, and Publish to Marketplace', caption: 'Export, share, or publish to the marketplace.', tags: ['export', 'publish', 'marketplace'] },
    { id: 'VED_video_01', status: 'received', feature: 'built-in video editor', alt: 'Ved built-in video editor with animation and playback controls', caption: 'In-context video editing.', tags: ['video', 'editor', 'media'] },
    { id: 'VED_html_01', status: 'received', feature: 'HTML editor', alt: 'Ved HTML editor with live browser preview and console', caption: 'A built-in HTML editor with live preview.', tags: ['HTML', 'code editor', 'preview'] },
    { id: 'VED_metadata_01', status: 'received', feature: 'asset overview & metadata', alt: 'Asset overview in Ved with technical, performance, and CMS-specific metadata and version history', caption: 'Rich asset metadata and version history.', tags: ['metadata', 'asset', 'versioning'] },
    { id: 'VED_media_01', status: 'received', feature: 'Media Library (main view)', alt: 'The Ved Media Library with multi-format assets, upload, collections, and a rename/publish context menu', caption: 'The Media Library.', tags: ['media library', 'assets', 'multi-format'] },
    { id: 'VED_dashboard_01', status: 'received', feature: 'content analytics dashboard', alt: 'Ved content analytics dashboard with DITA topics, reuse rate, quality score, and validation errors', caption: 'The content analytics dashboard.', tags: ['dashboard', 'analytics', 'content-ops'] },
    { id: 'VED_projects_01', status: 'received', feature: 'projects view', alt: 'Ved Projects view with draft and deployed counts and a success toast', caption: 'The Projects view.', tags: ['projects', 'management'] },
    { id: 'VED_projects_02', status: 'received', feature: 'project empty state', alt: 'New project empty state in Ved prompting to create the first DITA file', caption: 'A project empty state.', tags: ['projects', 'empty state', 'onboarding'] },
    { id: 'VED_share_01', status: 'received', feature: 'share & access control', alt: 'Share-document modal in Ved with collaborator emails, access link, and read-only access type', caption: 'Sharing with granular access control.', tags: ['share', 'collaboration', 'access control'] },
    { id: 'VED_comments_01', status: 'received', feature: 'review comments & threads', alt: 'In-context review comments and threaded discussions on a Ved document', caption: 'In-context review and threaded comments.', tags: ['comments', 'review', 'collaboration'] },
    { id: 'VED_pdftheme_01', status: 'received', feature: 'PDF theme configuration', alt: 'Configure PDF Theme in Ved with a base theme, YAML/JSON toggle, and live preview', caption: 'Configuring a PDF export theme.', tags: ['PDF', 'theme', 'export'] },
    { id: 'VED_fonts_01', status: 'received', feature: 'Media Library — Fonts', alt: 'Fonts view in the Ved Media Library showing font families as versioned assets', caption: 'Fonts as versioned assets.', tags: ['fonts', 'media library', 'assets'] },
  ],
}

/** Registry: repo project id → rich case study. The Ved building's repo id is
 *  'paas' (route /projects/paas) — the content slug 'ved' attaches to it here. */
export const RICH_CASE_STUDIES: Record<string, RichCaseStudy> = {
  paas: VED_CASE_STUDY,
}

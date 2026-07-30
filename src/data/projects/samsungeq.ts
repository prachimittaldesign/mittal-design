import type { RichCaseStudy } from '../caseStudyTypes'

// Samsung EQ — "Building Emotional Quality". A Samsung PRISM research programme
// run with MIT Institute of Design, Pune. Unlike the featured trio this study
// ships PUBLICLY (no password): it is academic research Prachi is free to show,
// so it hangs off `Project.richCaseStudy` rather than the encrypted store.
//
// Content ported verbatim from the authored source page. The programme produced
// a framework and a final presentation — there is no validated before/after
// metric, and none is claimed here.
//
// ── Author notes ───────────────────────────────────────────────────────────
//  1. ROLE — resolved: Prachi led the project, built the framework, ran the
//     foyer field research, and held the Samsung stakeholder relationship.
//  2. OUTCOME — resolved as unknown: whether Samsung adopted or extended the
//     framework isn't known, so no adoption claim is made.
//  3. WHEEL READINGS — the 24 conscious/preconscious/unconscious cell texts are
//     an interpretation (the deck gives the 8 principles and the 3 levels, not
//     the cells). Reviewed and left to stand for now; revisit if it matters.
//  4. DECISIONS — resolved: the real cost was the fixed four-month deadline,
//     which kept the research scoped.
// ───────────────────────────────────────────────────────────────────────────

export const SAMSUNG_EQ_CASE_STUDY: RichCaseStudy = {
  meta: {
    slug: 'samsungeq',
    name: 'Samsung EQ',
    category: 'Emotional UX · Samsung PRISM',
    role: 'Researcher & designer, team of four',
    ownershipType: 'collab',
    year: '2022',
    timeline: 'September – December',
    status: 'Programme concluded · framework + final presentation to Samsung',
    liveUrl: '',
    featured: false,
  },
  // No screenshots yet — this study is type + the interactive wheel. Image ids
  // resolve here if research-board photos or journey exports are added later.
  imageBase: '/IMAGES/SamsungEQ',

  hero: {
    eyebrow: 'Samsung PRISM · Emotional UX research',
    title: 'Building emotional quality.',
    tagline:
      'Four months asking what actually makes someone bond with a phone — and turning the answer into a framework a design team can use.',
    cta: { label: '', url: '' },
    image: 'SAMEQ_board_01',
  },

  closerLook: {
    themes: [],
    items: [
      { image: 'SAMEQ_ballot_01', caption: 'The ballot-box activity, end to end — building the boxes, siting them at the registration desk and the library, then sorting the answers into themes on the wall.' },
      { image: 'SAMEQ_worksheet_01', caption: 'The worksheet: who you identify as, word association for and against the phone, then image association — run alongside the new-city scenario.' },
      { image: 'SAMEQ_genz_01', caption: 'What the research kept returning: asked what the phone *is* to them, people reached for people-words before feature-words — therapist, alter ego, portal to family and friends.' },
    ],
  },

  highlights: [
    {
      kicker: '01 · Ground',
      title: 'Read the theory before touching a screen',
      body: "Don Norman's three levels, emotion as a cognitive process, and Freud's model of consciousness — the last of which quietly became the framework's second axis.",
    },
    {
      kicker: '02 · Ask',
      title: 'Put a ballot box where students actually walk',
      body: '"I wish my phone could…" — boxes at the registration desk and the library, plus write-on boards, a survey, and worksheets.',
    },
    {
      kicker: '03 · Converge',
      title: 'Two research tracks, one overlap',
      body: 'Five themes from desk research, six from primary. Two appeared in both: connection and consciousness. That intersection became the thesis.',
    },
    {
      kicker: '04 · Name',
      title: 'Eight principles, sorted by what triggers them',
      body: 'Serendipity, assurance, nostalgia, rewarding, familiarity, control, closure, connection — grouped as core, emotional, or functional.',
    },
    {
      kicker: '05 · Apply',
      title: 'A framework you can plot a journey on',
      body: 'Each principle crossed with a level of consciousness, so an existing journey and an improved one can be drawn on the same wheel and compared.',
    },
  ],

  flagship: {
    eyebrow: 'The brief',
    headline: 'Define an emotional digital experience for the smartphone.',
    lead:
      "Samsung's ask was unusually open. Not \"fix this screen\" — but work out **what attributes of a digital experience actually evoke emotion**, positive or negative, and what creates the bond between a person and their device: visual, animation, haptic, sound, feedback.\n\nThen find the gaps in satisfaction, and define new guidelines for mobile interactions with worked examples. An open brief is a gift and a trap — the work only counts if it lands on something a team can actually pick up and use.",
    stats: [
      { num: '4', label: 'months, four researchers' },
      { num: '8', label: 'principles · 1 framework' },
    ],
    image: '',
  },

  process: {
    eyebrow: 'Process',
    headline: 'Five moves, in order.',
    lead: 'The sequence mattered more than any single method. Each step existed to make the next one possible.',
    steps: [
      { no: '01', title: 'Understand human behaviour', body: 'Desk research into what emotional design means, the existing principles and frameworks, and what is known about Gen Z as an audience.' },
      { no: '02', title: 'Develop empathy towards the target audience', body: 'Primary research on campus — ballot boxes, open boards, a survey, and worksheets that asked people to associate words and images with their phone.' },
      { no: '03', title: 'Create a framework that validates evaluation', body: 'Turn the recurring themes into named principles, then structure them so a journey can be assessed against them rather than described loosely.' },
      { no: '04', title: 'Evaluate emotional triggers', body: 'Walk a real journey — homescreen customisation — stage by stage, marking which sense is active and which principle is firing at each step.' },
      { no: '05', title: 'Create emotion-specific visualisations', body: 'Plot the journey as it exists against the journey as it could be, so the gap is visible rather than argued.' },
    ],
  },

  research: {
    eyebrow: 'Research',
    headline: 'Two tracks, run in parallel.',
    lead:
      'Desk research established what the field already knew. Primary research tested whether any of it held for the people the phone is actually for. The interesting part was where they agreed.',
    groups: [
      {
        label: 'How we asked',
        snips: [
          { body: 'Ballot boxes placed at the registration desk and the library, asking one question: *I wish my phone could…*', cite: 'Primary — campus intercept, two locations' },
          { body: 'Open write-on boards: *What is your phone to you?* — answered publicly, in front of other people, which changed what people wrote.', cite: 'Primary — public board activity' },
          { body: 'Worksheets pairing word and image association with a scenario: you have moved to a new city for work, away from home. Explain the role of your phone.', cite: 'Primary — worksheet, sketch and mindmap' },
          { body: 'A short survey on usage and irritation — what people love, what annoys them, and the first and last thing they do on the phone each day.', cite: 'Primary — survey, 18 respondents' },
        ],
      },
      {
        label: 'What people actually said',
        snips: [
          { body: 'The phone is an important connection between me and the world. A helping hand. A saviour. Support.', cite: 'Worksheet response, new-city scenario' },
          { body: "Shoos loneliness · helps me pass my time · can't feel alone with it · my only friend.", cite: 'Worksheet mindmap, new-city scenario' },
          { body: 'Asked what the phone *is* to them, people reached for people-words before feature-words: therapist, alter ego, portal to family and friends, escape from reality.', cite: 'Board activity, synthesised' },
        ],
      },
    ],
    converge: {
      tracks: [
        {
          title: 'Desk research',
          count: 'Five themes',
          themes: [
            { label: 'Connection', shared: true },
            { label: 'Cognitive process' },
            { label: 'Consciousness', shared: true },
            { label: 'Control' },
            { label: 'Senses' },
          ],
        },
        {
          title: 'Primary research',
          count: 'Six themes',
          themes: [
            { label: 'Connection', shared: true },
            { label: 'Comfort' },
            { label: 'Simple' },
            { label: 'Nostalgia' },
            { label: 'Familiarity' },
            { label: 'Consciousness', shared: true },
          ],
        },
      ],
      conclusion:
        '**A conscious effort to stay connected — to the outside world and to their own emotions — is what drives the attachment.** Not the hardware, and not any single feature. That sentence is what the rest of the work is built on.',
    },
  },

  hypotheses: {
    eyebrow: 'Hypotheses',
    headline: 'Two ways a phone can matter.',
    lead:
      'Both were plotted on the same scale — from aiding a person to replacing one — because the further right a product travels, the more carefully it has to be designed.',
    items: [
      {
        title: 'Phone as a companion',
        emphasis: 'companion',
        body: 'Gen Z visualise their phone as a companion, for emotional comfort and other desires.',
        rungs: ['Features to bluff', 'Provides distraction', 'A mood identifier and changer', 'Therapist — relieve anxiety and depression'],
        scaleStart: 'Aiding humans',
        scaleEnd: 'Replacing humans',
      },
      {
        title: 'Phone as a transformer',
        emphasis: 'transformer',
        body: 'If the phone could be more than itself physically, and perform humanlike activities and beyond, people would attach to it more.',
        rungs: ['Meetings', 'Entertainment', 'Photo albums and memory collectables', 'Personal assistant that acts without being asked'],
        scaleStart: 'Aiding humans',
        scaleEnd: 'Replacing humans',
      },
    ],
  },

  principles: {
    eyebrow: 'The deliverable',
    headline: 'Eight principles for emotional design.',
    lead:
      'Each one came out of the research rather than the literature, and each is tagged by what triggers it. **Core** principles sit closest to identity. **Emotional** ones are felt in the moment. **Functional** ones are earned through use.',
    // Order here is the wheel order (clockwise from the top).
    // TODO(3): the `levels` readings are an interpretation — confirm or replace.
    items: [
      {
        key: 'connection', name: 'Connection', cat: 'Emotional', colour: '#e86fd8',
        desc: 'Attachment with other people or objects, through the device.',
        levels: [
          'Deliberately reaching for someone — placing a call, sending a photo.',
          'Keeping the thread warm: a glance at a chat, a story half-watched.',
          'The reflex to carry it from room to room without deciding to.',
        ],
      },
      {
        key: 'assurance', name: 'Assurance', cat: 'Functional', colour: '#8b5cf6',
        desc: 'Affirmation, or guarantee — the system telling you it heard you.',
        levels: [
          'A confirmation you actively look for before you move on.',
          'Noticing only its absence — the pause where a response should be.',
          'Trusting the tap landed, with no conscious check at all.',
        ],
      },
      {
        key: 'nostalgia', name: 'Nostalgia', cat: 'Core', colour: '#3b82f6',
        desc: 'The emotional take-me-backs — memory surfaced rather than stored.',
        levels: [
          'Opening the gallery to look for a specific memory.',
          'A resurfaced photo you were not looking for but recognise.',
          'Attachment to an old device or sound, without articulating why.',
        ],
      },
      {
        key: 'closure', name: 'Closure', cat: 'Emotional', colour: '#22b8cf',
        desc: 'A sense of completion — knowing the thing is finished.',
        levels: [
          'Seeing the result and knowing the task is done.',
          'Mild unease at something left half-configured.',
          'Returning to finish a thing without registering the pull.',
        ],
      },
      {
        key: 'rewarding', name: 'Rewarding', cat: 'Functional', colour: '#34d399',
        desc: 'A productive feeling. Achievement, however small the task.',
        levels: [
          'Enjoying the result you set out to get.',
          'A small lift from a task going smoothly.',
          'Repeating a satisfying interaction with no goal in mind.',
        ],
      },
      {
        key: 'serendipity', name: 'Serendipity', cat: 'Emotional', colour: '#f5d94e',
        desc: 'Exploring new things that lead to an unexpected positive reaction.',
        levels: [
          'Deliberately going looking for something new.',
          'Noticing an option you did not know existed.',
          'Delight at a detail you could not name afterwards.',
        ],
      },
      {
        key: 'familiarity', name: 'Familiarity', cat: 'Core', colour: '#fdba74',
        desc: 'A sense of relatedness to real-world scenarios and objects.',
        levels: [
          'Recognising a metaphor and knowing what it will do.',
          'Moving through a known layout without reading it.',
          'Muscle memory — the thumb arriving before the eye.',
        ],
      },
      {
        key: 'control', name: 'Control', cat: 'Functional', colour: '#f4564c',
        desc: 'The ability to perform a task according to your own preference.',
        levels: [
          'Actively choosing a setting to suit yourself.',
          'Assuming the option is there when you want it.',
          'Comfort that comes from the device being yours, not generic.',
        ],
      },
    ],
  },

  wheel: {
    eyebrow: 'A closer look',
    headline: 'The framework.',
    lead: [
      'A list of principles is a poster. What makes this usable is the second axis: **every principle is felt at a level of consciousness.** Some land where the user can name them. Most do not.',
      "So the eight principles are crossed with Freud's three levels — conscious, preconscious, unconscious — giving twenty-four positions instead of eight. A journey gets plotted on it, and the shape of the plot is the finding.",
    ],
    levelNames: ['Conscious', 'Preconscious', 'Unconscious'],
    hint: 'Select a principle to read how it behaves at each level.',
    image: 'SAMEQ_wheelplot_01',
    imageCaption:
      'The framework doing the work it was built for: the homescreen-customisation journey as it exists (black) plotted against the same journey with the proposed enhancements (red). The gap between the two lines is the argument.',
    footnote: 'The level readings describe how each principle typically surfaces.',
  },

  matrix: {
    eyebrow: 'In practice',
    headline: 'One journey, read through the framework.',
    lead:
      'Homescreen customisation — a small, ordinary thing people do constantly. Each stage was marked with the senses in play, the principle firing, and how consciously it was felt. The dip in the middle is where the design work is.',
    image: 'SAMEQ_journey_01',
    imageCaption:
      'The journeys as mapped: each stage carried its own screen, thinking, emotion, sensorial touchpoints, pain points and opportunities before any of it was read through the framework.',
    columns: ['Stage', 'Discover', 'Explore', 'Decide', 'Explore', 'Decide', 'Final output'],
    rows: [
      {
        label: 'Action',
        cells: ['Long press on homescreen', 'Customise wallpaper; select from gallery or built-in', 'Set theme according to wallpaper', 'Select and place widgets', 'Set layout and grid', 'Return to home screen'],
      },
      {
        label: 'Thinking',
        cells: ['Excited to make it your own', 'Curious, then confused — too many options', 'Anxious to see the result', 'Anxious about how to place what, and where', 'Excited about permutations', 'Content with the final result'],
      },
      {
        label: 'Senses',
        cells: ['Touch, sight', 'Touch, sight', 'Touch, sight', 'Touch, sight, sound', 'Touch, sight', 'Touch, sight'],
      },
      {
        label: 'Principle firing',
        hot: true,
        cells: ['Familiarity, control', 'Serendipity, control', '**Assurance, rewarding**', 'Familiarity, assurance', 'Control, assurance', 'Closure'],
      },
      {
        label: 'Felt at level',
        hot: true,
        cells: ['1 · 2', '1 · 1', '**3 · 1**', '2 · 3', '1 · 3', '1'],
      },
      {
        label: 'Pain point',
        cells: ['—', 'I wish my wallpaper was more interactive', 'Did I do everything in the correct manner?', 'No preview — I have to drag around to see', 'I wish I could align in different ways', '—'],
      },
      {
        label: 'Opportunity',
        cells: ['—', 'Customisable sound options; themes feature', 'Motivational feedback and micro-interactions while applying', 'Animated preview on hover; custom widget sizes', 'Let icons be moved and placed at will', '—'],
      },
    ],
    footnote:
      'The highlighted rows are the framework doing its job: naming which principle is at stake, and whether the user could tell you about it if you asked.',
  },

  designSystem: {
    eyebrow: 'The worked example',
    headline: 'Where the decide stage falls down.',
    lead:
      'Setting a theme and pressing back is the lowest point on the emotion graph. Read through the framework, the reason is specific rather than vague: **assurance is firing unconsciously while rewarding is firing consciously.** The person is consciously chasing a result they will enjoy, while the system quietly fails to confirm that anything happened. They are left asking whether they did it right — which is an assurance failure, not a layout problem. That diagnosis points at feedback, not at the settings tree.',
    cards: [
      { title: 'Split-second preview', body: 'Show the chosen theme the instant it is picked, before it is applied.' },
      { title: 'Touch feedback in colour', body: "Let the touch response shift to the theme's colour as it applies." },
      { title: 'Haptics on confirm', body: 'A physical acknowledgement that the change landed.' },
      { title: 'Theme-matched sounds', body: 'Notification sounds that change with the theme, closing the loop across senses.' },
    ],
    modal: null,
  },

  decisions: {
    eyebrow: 'Decisions',
    headline: 'What we chose, and what it cost.',
    lead: 'Every framework is a set of arguments that got settled. These are the ones worth naming.',
    items: [
      {
        title: 'Consciousness as the second axis, rather than intensity.',
        chose: "Freud's three levels — how aware the user is of the feeling.",
        instead: 'A simple strength or valence rating, which is easier to score.',
        // TODO(4): confirm this was the real trade-off.
        cost: 'Harder to assess reliably, and impossible to validate directly — you cannot ask someone about a feeling they are unaware of.',
      },
      {
        title: 'Eight principles, not four and not twenty.',
        chose: 'Eight, grouped into core, emotional and functional.',
        instead: 'A tighter set that would be easier to remember and teach.',
        cost: 'The programme ran to a fixed four-month deadline, so the set was named from the research we had time to run rather than pruned and re-tested across more. Eight is also harder to hold in your head than a four-principle model, so it has to earn its keep every time it is taught.',
      },
    ],
  },

  outcome: {
    eyebrow: 'Outcome',
    headline: 'Where it landed.',
    claim: 'A vocabulary and a method for a conversation design teams usually have in adjectives.',
    nums: [
      { num: '8', label: 'Principles, each traced to research rather than literature' },
      { num: '3', label: 'Levels of consciousness as the second axis' },
      { num: '24', label: 'Positions a journey stage can occupy' },
      { num: '4', label: 'Months, from desk research to final presentation' },
    ],
    // Whether Samsung carried the framework further isn't known to us, so no
    // adoption claim is made — the footnote states the limit plainly instead.
    footnote:
      'These describe the shape of the work, not its impact. The programme concluded in a framework and a final presentation to Samsung — there is no validated before-and-after metric here, and none is claimed. A fixed four-month deadline also kept the research scoped to what the team could run in that window.',
  },

  role: {
    role: 'Project lead · researcher and designer',
    ownershipType: 'lead',
    ownership:
      'Led the project across a four-person team — ran the field research in the foyer, built the framework, and held the working relationship with the Samsung stakeholders through to the final presentation.',
    timeline: 'September – December',
    team: 'Four students, Samsung PRISM with MIT Institute of Design, Pune',
    tools: ['Primary research', 'Synthesis', 'Framework design', 'Stakeholder management'],
    responsibilities: [
      'Led the project end to end — direction, sequencing, and the final presentation',
      'Built the framework: the eight principles crossed with levels of consciousness',
      'Ran the field research in the foyer — ballot boxes, open boards, worksheets',
      'Held the stakeholder relationship with Samsung through review cycles',
      'Synthesis of the desk and primary tracks into the named principles',
    ],
  },

  related: ['impressio', 'izak', 'revee'],

  // Artefacts lifted from the programme deck (Samsung × MIT ID). The Samsung
  // wordmark and slide numbers are masked out so they read as artefacts rather
  // than slides.
  images: [
    {
      id: 'SAMEQ_board_01', status: 'received', highlight: true, feature: 'open board activity',
      alt: 'Students writing answers to "What is your phone to you?" and "I wish my phone could…" on large open boards in a college corridor',
      caption: 'The open board activity, answered in public.',
      tags: ['primary research', 'board activity', 'campus', 'Gen Z'],
    },
    {
      // Original illustration (not deck material) — the one drawn asset on the
      // page, standing in for the finding rather than evidencing it.
      id: 'SAMEQ_genz_01', status: 'received', ext: 'svg', feature: 'the phone as a companion',
      alt: 'Illustration of a young person sitting cross-legged, absorbed in their phone and lit by its screen, ringed by the eight principle colours, with heart, message and music signals floating beside them',
      caption: 'The phone as a companion, not a device.',
      tags: ['illustration', 'Gen Z', 'attachment', 'companion'],
    },
    {
      id: 'SAMEQ_ballot_01', status: 'received', highlight: true, feature: 'ballot-box activity process',
      alt: 'Five-step process: building the ballot boxes, siting them at the registration desk and the library, then sorting sticky notes into themes and assigning headings',
      caption: 'The ballot-box activity, end to end.',
      tags: ['primary research', 'ballot box', 'synthesis', 'affinity mapping'],
    },
    {
      id: 'SAMEQ_worksheet_01', status: 'received', feature: 'research worksheet',
      alt: 'The "Smartphones & You" worksheet — identity checkboxes, a word-association table, and an image-association activity',
      caption: 'The worksheet instrument.',
      tags: ['primary research', 'worksheet', 'word association', 'image association'],
    },
    {
      id: 'SAMEQ_journey_01', status: 'received', feature: 'customer journey maps',
      alt: 'Two annotated customer journey maps across phone screens, each row marking action, thinking, emotion, sensorial touchpoints, pain points and opportunities',
      caption: 'The journeys as mapped.',
      tags: ['journey map', 'emotion graph', 'touchpoints', 'opportunities'],
    },
    {
      id: 'SAMEQ_wheelplot_01', status: 'received', highlight: true, feature: 'framework in use — existing vs enhanced journey',
      alt: 'The framework wheel with two journeys plotted on it: the existing journey in black and the enhanced journey in red, across the eight principles and three levels of consciousness',
      caption: 'Existing journey against enhanced journey, on the same wheel.',
      tags: ['framework', 'evaluation', 'before and after', 'consciousness'],
    },
  ],
}

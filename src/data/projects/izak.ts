import type { RichCaseStudy } from '../caseStudyTypes'

// iZak — a TV-first smart home on NextGenTV (ATSC 3.0). Ships PUBLICLY, like
// Samsung EQ: concept-stage work with no client metrics, hung off
// `Project.richCaseStudy` rather than the encrypted store.
//
// Written fresh from the project's facts — the structure, wording and every
// illustration are original to this portfolio. The illustrations in
// public/IMAGES/iZak are drawn diagrams of the concepts, not product screens.
//
// No client or platform-owner names (NDA rule). Public standards (ATSC 3.0,
// NextGenTV), public guidance (tvOS HIG, Android TV) and the benchmarked
// consumer products are named, as Ved names its competitors.
//
// ── Author notes ───────────────────────────────────────────────────────────
//  1. ROLE — taken only from what the portfolio already states for iZak (lead;
//     UX research and design; the LiDAR/photogrammetry feature). Confirm the
//     exact split of the research, personas and design rounds before this is
//     promoted, and add specifics to role.responsibilities.
//  2. LIDAR — the scan card describes the scanning workflow only. It does not
//     claim the scan feeds the ambient 3D home view; add that link only if it
//     is true.
//  3. TIMELINE — not known; role.timeline describes the phase instead.
//  4. OUTCOME — concept stage. No usability results exist and none are claimed;
//     the planned tests are presented as planned.
// ───────────────────────────────────────────────────────────────────────────

export const IZAK_CASE_STUDY: RichCaseStudy = {
  meta: {
    slug: 'izak',
    name: 'iZak',
    category: 'Smart home · AIoT platform',
    role: 'UX research & product design',
    ownershipType: 'lead',
    year: '',
    timeline: '',
    status: 'Concept · three design rounds to final screens',
    liveUrl: '',
    featured: false,
  },
  imageBase: '/IMAGES/iZak',

  hero: {
    eyebrow: 'AIoT · Smart home · NextGenTV',
    title: 'iZak',
    tagline:
      'A smart home run from the screen the whole household already shares — with software updates that reach every device at once, over the air.',
    cta: { label: '', url: '' },
    image: 'IZAK_hero_01',
  },

  highlights: [
    {
      kicker: 'The starting point',
      title: 'A capability looking for a product.',
      body: 'Broadcast TV could push software updates over the air to every receiver in range. The open question was which product deserved that — and “none” stayed on the table as a real answer.',
    },
    {
      kicker: 'Insight one',
      title: 'One person runs the smart home. Everyone else lives in it.',
      body: 'The controls sat on whoever installed the devices, on their private phone, and the rest of the household depended on them. Any phone-first product would inherit that.',
    },
    {
      kicker: 'Insight two',
      title: 'Updates get skipped because they cost effort.',
      body: 'Every device updates on its own, the benefit is invisible and the timing is bad. An out-of-date home is a design outcome, not careless owners.',
    },
    {
      kicker: 'The decision',
      title: 'Put the home on the shared screen.',
      body: 'The TV is communal by default and already holds the broadcast tuner. Watch and run the home from the couch; set it up and act on the move from the phone.',
    },
    {
      kicker: 'The model',
      title: 'Devices, Spaces, Playbooks.',
      body: 'What a thing is, where it lives, and what the home does — replacing manufacturer-shaped silos with the way households talk about their homes.',
    },
    {
      kicker: 'The differentiator',
      title: 'Make invisible updates visible.',
      body: 'Broadcast updates succeed when nobody notices, so trust had to be designed in: a live Updating card, a version history for every device, and a visible fallback when a broadcast is missed.',
    },
  ],

  closerLook: {
    themes: [],
    items: [
      {
        image: 'IZAK_broadcast_01',
        caption:
          'The premise. Today every device fetches its own update over the internet. One broadcast signal can reach every receiver in range at the same moment.',
      },
      {
        image: 'IZAK_dashboard_01',
        caption:
          'The home on the TV: eight cards, arranged around the four questions a household asks from the couch.',
      },
    ],
  },

  flagship: {
    eyebrow: 'The decision',
    headline: 'Where should a home’s interface live?',
    lead:
      'Three places were on the table. A **phone app** is the default and the cheapest to ship, but it adds one more app and keeps the home tied to whoever installed it. A **hub or wall panel** is shared and always on, but it is new hardware and one more object in the room. The **television** is the one screen a household already shares, it carries the broadcast tuner, and its size suits a smart home’s real daily job: checking on it, not configuring it.\n\nWe chose the TV, and wrote down a rule every later screen was tested against: **understand and run the home from the couch; set it up and act in the moment from the phone.**',
    stats: [
      { num: '1', label: 'screen the whole household already shares' },
      { num: '10 ft', label: 'viewing distance every TV screen was designed for' },
    ],
    image: 'IZAK_split_01',
    modal: {
      title: 'Why the TV, and what it cost',
      image: null,
      sections: [
        {
          heading: 'Why it won',
          body: 'It is communal by default, the broadcast differentiator physically lives inside it, and most smart-home moments are glances rather than edits.',
        },
        {
          heading: 'Cost one · a TV mostly idles',
          body: 'So iZak needed a resting state of its own — an ambient view of the home rather than a blank screen.',
        },
        {
          heading: 'Cost two · a remote is a poor authoring tool',
          body: 'Anything that needed typing or long chains of logic was rebuilt from pickers, or handed to the phone.',
        },
        {
          heading: 'Cost three · a shared screen is not private',
          body: 'Profiles, permissions and guest access became launch requirements instead of later features.',
        },
      ],
    },
  },

  metrics: [
    { num: '3', label: 'design rounds to final screens' },
    { num: '4', label: 'questions the dashboard answers at a glance' },
    { num: '8', label: 'cards on the home dashboard' },
    { num: '6', label: 'ten-foot rules audited (tvOS · Android TV)' },
    { num: '22–25', label: 'connected devices per U.S. home (Deloitte, 2021–22)' },
    { num: '1', label: 'broadcast signal for every home in range' },
  ],

  designSystem: {
    eyebrow: 'Information architecture',
    headline: 'The nouns and verbs of a home.',
    lead:
      'Early rounds split the home into Rooms, Scenes and Devices — the way manufacturers organise products, not the way people talk. The final model has three parts: **Devices** are what a thing is, **Spaces** are where it lives, and **Playbooks** are what the home does. Two nouns and a verb. “Scenes” was renamed too: the word came from AV presets and suggested something you switch on, while these automations coordinate devices and spaces over time.',
    cards: [
      {
        title: 'Devices',
        body: 'Every connected thing, filterable by type or maker, controllable directly, with its version history one step away.',
        image: 'IZAK_model_01',
      },
      {
        title: 'Spaces',
        body: 'Rooms and floors, each controllable as a whole — and seen all at once rather than one at a time.',
      },
      {
        title: 'Playbooks',
        body: 'What the home does: triggers, conditions, spaces and devices assembled into one readable sentence.',
      },
    ],
    modal: null,
  },

  aiLayer: {
    eyebrow: 'The differentiator',
    headline: 'Updates you can see.',
    lead:
      'Broadcast updates are iZak’s technical edge and its biggest UX risk at once: when they work, nothing happens on screen. An update nobody notices earns no credit, and one that interrupts a film earns resentment. So the update system was designed as a **trust surface**, not a background job.',
    cards: [
      {
        title: 'Updating is a dashboard card',
        body: 'Rollouts are visible from the couch, next to energy and security — not buried in settings.',
        image: 'IZAK_update_01',
      },
      {
        title: 'Every device keeps a receipt',
        body: 'A version history for each device on the phone, so “is this up to date?” has a concrete answer.',
      },
      {
        title: 'Never mid-use, and failure is designed',
        body: 'Quiet hours and in-use rules hold an update back. A device that misses the broadcast falls back to Wi-Fi, with a visible retry until it is current.',
      },
    ],
  },

  process: {
    eyebrow: 'Process',
    headline: 'From a capability to a product.',
    lead: 'Working backwards from a technology is risky, so every step had to be able to say no.',
    steps: [
      { no: '01', title: 'Frame the question', body: 'Start from the broadcast capability and ask which consumer product justifies it — keeping “none” as a legitimate answer.' },
      { no: '02', title: 'Map the whole journey', body: 'A service blueprint from the shop floor to the first firmware update: actions, channels, actors and the emotional arc.' },
      { no: '03', title: 'Personas and use cases', body: 'Three relationships to the same home — the admin who runs it, the parent who wants outcomes, and the person who runs the household’s routines.' },
      { no: '04', title: 'Benchmark the field', body: 'SmartThings, Home Assistant, openHAB, Wink and others, sorted into table stakes, partly present, potential and genuinely new.' },
      { no: '05', title: 'Decide the surface', body: 'Phone, hub or TV — compared on who each serves, what each costs, and whether it connects to the broadcast advantage.' },
      { no: '06', title: 'Three design rounds', body: 'Each round removed a desktop or mobile habit until the screens worked at ten feet with a remote.' },
      { no: '07', title: 'Audit against the platforms', body: 'The final round checked against Apple’s tvOS and Google’s Android TV guidance, rule by rule.' },
      { no: '08', title: 'Map the platform', body: 'A two-sided platform canvas — device makers, broadcasters, homeowners — and a minimum viable platform with testable assumptions.' },
    ],
  },

  research: {
    eyebrow: 'Research',
    headline: 'What the journey and the field showed.',
    lead:
      'Fragmented apps were a real problem, but competitors already owned it. The research looked for what nobody owned — and was honest about what is still untested.',
    groups: [
      {
        label: 'From the service blueprint',
        snips: [
          { body: 'Effort peaks before any value arrives: sign-up and login took around five minutes and rated as very high effort.', cite: 'Service blueprint · onboarding' },
          { body: 'Creating each automation took eight to ten minutes — the longest task anywhere in the journey.', cite: 'Service blueprint · authoring' },
          { body: 'The TV is one channel of six: phone, laptop, TV, tablet, watch and QR codes all carry part of the journey.', cite: 'Service blueprint · channels' },
          { body: 'The journey begins in the shop, more than a week before setup — and a salesperson, the household and device makers all appear in it.', cite: 'Service blueprint · actors' },
        ],
      },
      {
        label: 'Three relationships to one home',
        snips: [
          { body: 'Runs everything, enjoys the technology, and is worn down by maintaining it. Needs device-level depth, update history, and rules that never interrupt.', cite: 'Persona · the admin' },
          { body: 'A busy parent who wants results, not a system to manage. Needs cost shown in money, and automation without programming.', cite: 'Persona · the outcome-seeker' },
          { body: 'Runs the household’s routines, but the smart home does not speak their language. Needs routine-shaped automation and shared profiles.', cite: 'Persona · the orchestrator' },
        ],
      },
      {
        label: 'The competitive gap',
        snips: [
          { body: 'Table stakes everywhere: device groups, direct control, routines and schedules.', cite: 'Benchmark · existing' },
          { body: 'Owned by nobody: the shared household experience, and the work of keeping devices current.', cite: 'Benchmark · the gap' },
        ],
      },
      {
        label: 'Still to test — concept stage',
        snips: [
          { body: 'The glance test: can a first-time viewer answer the four couch questions in five seconds?', cite: 'Planned · timed-exposure comprehension test' },
          { body: 'Authoring on a remote: does playbook editing on a D-pad reach a usable completion rate, or should it move to the phone entirely?', cite: 'Planned · comparative usability test' },
          { body: 'Update trust: do the Updating card and version history change how secure people feel?', cite: 'Planned · concept test, with and without' },
          { body: 'The TV-first bet itself: where do people reach to check the home, and where to change it? This is the test that could disprove the premise.', cite: 'Planned · two-week diary study' },
        ],
      },
    ],
  },

  principles: {
    eyebrow: 'Ten-foot design',
    headline: 'Six rules for the couch.',
    lead:
      'A TV is read from across a room and driven by a five-button remote. These rules came out of the design rounds — most were learned by breaking them first.',
    items: [
      { key: 'readable', name: 'Readable across the room', cat: 'Legibility', colour: '#5b4bde', desc: 'Type, spacing and cards sized for ten feet, with labels kept short.' },
      { key: 'remote', name: 'Remote first', cat: 'Input', colour: '#0071e3', desc: 'Every primary action reachable by directional focus. No cursor, ever.' },
      { key: 'glance', name: 'One glance', cat: 'Legibility', colour: '#5b4bde', desc: 'Energy, security and device state readable without opening anything.' },
      { key: 'calm', name: 'Calm, then detailed', cat: 'Legibility', colour: '#5b4bde', desc: 'A quiet surface at rest; density only when someone asks for it.' },
      { key: 'alerts', name: 'Alerts lead', cat: 'Input', colour: '#0071e3', desc: 'Critical states come first in focus order and get the strongest contrast.' },
      { key: 'shared', name: 'Built for many people', cat: 'Household', colour: '#1d8a6a', desc: 'One screen, many readers — so profiles and permissions sit underneath everything.' },
    ],
  },

  matrix: {
    eyebrow: 'Iteration',
    headline: 'Three rounds to ten feet.',
    lead: 'Each round removed a habit borrowed from desktop or mobile. Read across a row to watch one surface grow up.',
    columns: ['Surface', 'Round one', 'Round two', 'Round three'],
    rows: [
      { label: 'Dashboard', cells: ['Dense panels with no clear path through them', 'Dark, but small type and mismatched cards', '**Eight cards, four questions, one reading order**'] },
      { label: 'Devices', cells: ['A long, tab-driven list', 'Dense cards with pointer-style controls', '**Grouped, paged and filterable**'] },
      { label: 'Spaces', cells: ['A list with a device side panel', 'One space visible at a time', '**All spaces at once, with floors and groups**'] },
      { label: 'Adding a device', cells: ['QR pairing buried in a dense list', 'A long manual form, and no QR', '**QR first; details confirmed on screen**'], hot: true },
      { label: 'Automations', cells: ['Scene cards you toggle on and off', 'Scene cards you toggle on and off', '**Playbooks assembled from pickers, templates first**'], hot: true },
    ],
    footnote: 'Two ideas survived from round one into the final design: the focus ring and QR pairing. The highlighted rows are where input, not layout, drove the change.',
  },

  decisions: {
    eyebrow: 'Decisions',
    headline: 'What we chose, and what it cost.',
    lead: 'The calls that shaped everything after them.',
    items: [
      {
        title: 'The TV as the home’s main interface.',
        chose: 'The shared screen that already carries the broadcast tuner.',
        instead: 'A phone-first hub app — the default, and the cheapest to ship.',
        cost: 'An idle screen to design for, a remote that is poor at authoring, and no privacy by default — each became its own piece of work.',
      },
      {
        title: 'Author on the phone, run on the TV.',
        chose: 'Deep automation editing on the phone; running, adjusting and playing playbooks on the TV.',
        instead: 'Full authoring on the TV, to keep one surface complete.',
        cost: 'The TV is not self-sufficient — the experience depends on the companion app being there.',
      },
      {
        title: 'Text entry off the TV entirely.',
        chose: 'QR pairing: scan and type on the phone, confirm on the TV.',
        instead: 'Field-by-field entry with the remote, as round two had it.',
        cost: 'Setting up a device needs two screens in hand.',
      },
      {
        title: 'Playbooks, not Scenes.',
        chose: 'A new name for automations that coordinate devices and spaces over time.',
        instead: '“Scenes”, the term most smart-home products already use.',
        cost: 'An unfamiliar word that has to teach itself through templates and examples.',
      },
    ],
  },

  outcome: {
    eyebrow: 'Outcome',
    headline: 'Where it landed.',
    claim: 'A product vision for a TV-first smart home — and a way to make a background technology feel like care.',
    nums: [
      { num: '3', label: 'Design rounds, from desktop habits to a ten-foot system' },
      { num: '3', label: 'Parts to the home model: Devices, Spaces, Playbooks' },
      { num: '4', label: 'Couch questions the dashboard answers' },
      { num: '4', label: 'Risky assumptions, each with a planned test' },
    ],
    footnote:
      'This is concept-stage work. It delivered a product vision, a ten-foot design language, the home model and the update trust system, grounded in personas, use cases and competitor research. No usability outcomes are claimed — the planned tests above are what would prove or disprove the TV-first bet.',
  },

  interactions: {
    eyebrow: 'The details',
    headline: 'Moves that make a remote feel capable.',
    cards: [
      {
        title: 'Pair on the phone, confirm on the TV',
        body: 'The TV shows a QR code; the phone does the scanning and the typing; the TV confirms the device and asks which space it lives in.',
      },
      {
        title: 'Automation in five buttons',
        body: 'Pick a template, then a trigger, a condition, the spaces and the devices — each from a short list a D-pad can move through. The result reads as a sentence.',
      },
      {
        title: 'Scan a room into a model',
        body: 'A LiDAR and photogrammetry scanning workflow captures a real space and turns it into a usable spatial model.',
        image: 'IZAK_scan_01',
      },
    ],
    signatureFlow: ['Pick a template', 'Choose a trigger', 'Add a condition', 'Pick the spaces', 'Pick the devices', 'Run it'],
  },

  techHandoff: {
    eyebrow: 'Platform & craft',
    headline: 'Built for the platforms it runs on.',
    body: 'The final round was audited against Apple’s tvOS Human Interface Guidelines and Google’s Android TV design guidance, each rule mapped to the round that first broke it. Underneath sits a two-sided platform the product has to serve.',
    items: [
      { title: 'One focus treatment', body: 'Shared by cards, chips and the navigation rail. Round one had no focus state defined at all.' },
      { title: 'One surface, one accent', body: 'Light text on a single dark surface, with one restrained accent used to rank — not to decorate.' },
      { title: 'Inside the safe zone', body: 'Content kept inside the overscan-safe area, about 5% of the frame on Android TV. Round one ran to the edges.' },
      { title: 'Few presses to anywhere', body: 'A labelled rail, aligned grids, pagination and a filter sheet, so any destination is a few presses away.' },
      { title: 'Three sides, one platform', body: 'Device makers automate deployment and watch device health; broadcasters push updates and content; homeowners get automation, control and insight.' },
      { title: 'A minimum viable platform', body: 'Device management, software updates and automations — with three assumptions written as tests: most interactions start on the dashboard, template playbooks stay in use, and people undo iZak’s automatic actions less over time.' },
    ],
  },

  role: {
    role: 'UX research & product design',
    ownershipType: 'lead',
    // TODO(1): confirm the split of research, personas and design rounds, then
    // add specifics here.
    ownership:
      'UX research and design for the platform, including its LiDAR and photogrammetry feature — a scanning workflow that turns a real space into a usable spatial model.',
    timeline: 'Concept phase',
    team: 'Cross-functional team working on NextGenTV (ATSC 3.0)',
    tools: ['Service blueprinting', 'Personas & use cases', 'Competitive benchmarking', '10-ft TV UI', 'Mobile UX'],
    responsibilities: [
      'UX research for the platform',
      'Product design for the platform, across the TV and the phone',
      'LiDAR and photogrammetry scanning workflow: from sensor capture to a usable spatial model',
    ],
  },

  related: ['revee', 'paas', 'samsungeq'],

  // Every asset here is an original illustration drawn for this portfolio — a
  // diagram of a concept, not a product screenshot.
  images: [
    {
      id: 'IZAK_hero_01', status: 'received', ext: 'svg', highlight: true, feature: 'TV-first smart home',
      alt: 'Illustration of a living room: a wall-mounted TV showing a dark home dashboard of eight cards, a sofa in front of it, and a phone showing the companion app',
      caption: 'The home, run from the shared screen.',
      tags: ['illustration', 'smart home', 'TV', 'companion app'],
    },
    {
      id: 'IZAK_broadcast_01', status: 'received', ext: 'svg', highlight: true, feature: 'broadcast updates vs per-device updates',
      alt: 'Diagram comparing two models: on the left, each device in a home fetches its own update from the internet; on the right, one broadcast tower reaches every home in range at once',
      caption: 'One device at a time, or every home at once.',
      tags: ['diagram', 'broadcast', 'OTA updates', 'ATSC 3.0'],
    },
    {
      id: 'IZAK_split_01', status: 'received', ext: 'svg', highlight: true, feature: 'TV and phone division of labour',
      alt: 'Diagram of the division of labour: the TV, from the couch, is for understanding and running the home; the phone, in the pocket, is for setting up and acting in the moment; both share one home profile',
      caption: 'The couch and the pocket.',
      tags: ['diagram', 'TV', 'mobile', 'information architecture'],
    },
    {
      id: 'IZAK_dashboard_01', status: 'received', ext: 'svg', feature: 'ten-foot home dashboard',
      alt: 'Wireframe of the TV home dashboard: eight cards grouped under four questions — what is it costing, what is the home doing, is everything safe, and what needs me',
      caption: 'Eight cards, four questions.',
      tags: ['wireframe', 'dashboard', 'ten-foot UI'],
    },
    {
      id: 'IZAK_model_01', status: 'received', ext: 'svg', feature: 'Devices, Spaces, Playbooks',
      alt: 'Diagram of the home model: devices such as a light, blind, thermostat, speaker, camera and lock are placed in spaces such as the living room and bedroom, and a playbook coordinates them on a schedule',
      caption: 'Two nouns and a verb.',
      tags: ['diagram', 'information architecture', 'automation'],
    },
    {
      id: 'IZAK_update_01', status: 'received', ext: 'svg', feature: 'update trust path',
      alt: 'Flow diagram of an update: broadcast sent, then either received and installed in quiet hours, or missed and retried over Wi-Fi with a visible retry state, both ending with the device current and a receipt logged',
      caption: 'Every path ends with a receipt.',
      tags: ['flow', 'OTA updates', 'trust', 'failure states'],
    },
    {
      id: 'IZAK_scan_01', status: 'received', ext: 'svg', feature: 'LiDAR and photogrammetry scan',
      alt: 'Illustration of the scanning workflow: a phone scans a room, the capture becomes a point cloud, and the point cloud becomes a clean spatial model of the room',
      caption: 'From a scan to a spatial model.',
      tags: ['illustration', 'LiDAR', 'photogrammetry', 'spatial'],
    },
  ],
}

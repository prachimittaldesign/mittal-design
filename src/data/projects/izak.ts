import type { RichCaseStudy } from '../caseStudyTypes'

// iZak — a TV-first smart home on NextGenTV (ATSC 3.0). A complete, long-form
// UX case study, shipped PUBLICLY like Samsung EQ (concept-stage, no client
// metrics), hung off `Project.richCaseStudy`.
//
// Prachi was a core member of the iZak team, involved across the work — the
// research, IA, design rounds and final TV and mobile screens — plus the
// storyboard connecting iZak into Mo, and (for a shorter stretch) the LiDAR /
// photogrammetry scanning feature. Written in the team's voice ("we"), with
// first person only where the work was hers.
//
// Every fact here comes from the project; the wording, structure and every
// illustration are original to this portfolio. No client or platform-owner
// names (NDA rule). Public standards and benchmarked products are named.
//
// ── Author notes — check before promoting ──────────────────────────────────
//  1. STORYBOARD — the five Mo frames are reconstructed from the Mo design
//     language and the iZak flows. Replace with the real storyboard frames
//     when the screens arrive, and correct any frame that differs.
//  2. DASHBOARD SCHEMATIC — IZAK_dashboard_01 groups the eight cards under the
//     four questions as a reading aid; the real layout comes with the screens.
//  3. 3D HOME — an interactive illustration of the scanning direction, not
//     product code. Its rooms, devices and events are illustrative.
//  4. FEATURE TIERS — "Partially present" and "Potential" carry definitions
//     only; add their items if you have the benchmark sheet.
// ───────────────────────────────────────────────────────────────────────────

export const IZAK_CASE_STUDY: RichCaseStudy = {
  order: [
    'hero',
    'snapshot',
    'highlights',
    'process',
    'flagship',
    'research',
    'personas',
    'featureTiers',
    'table:surface',
    'cards:rule',
    'principles',
    'designSystem',
    'ia',
    'walkthrough',
    'cards:onboarding',
    'cards:spacesflow',
    'rounds',
    'matrix',
    'table:alignment',
    'cards:dashboard',
    'cards:devicectl',
    'interactions',
    'cards:agentic',
    'aiLayer',
    'cards:surfaces',
    'spatial',
    'cards:mobile',
    'storyboard',
    'cards:platform',
    'cards:business',
    'table:mvp',
    'table:metrics',
    'table:validation',
    'decisions',
    'outcome',
    'cards:learnings',
    'role',
    'related',
  ],
  nav: [
    { id: 'cs-highlights', label: 'Overview' },
    { id: 'cs-research', label: 'Discovery' },
    { id: 'cs-personas', label: 'Personas' },
    { id: 'cs-ia', label: 'IA' },
    { id: 'cs-walkthrough', label: 'Flows' },
    { id: 'cs-rounds', label: 'Iterations' },
    { id: 'cs-spatial', label: '3D home' },
    { id: 'cs-c-business', label: 'Business' },
    { id: 'cs-role', label: 'Role' },
  ],

  meta: {
    slug: 'izak',
    name: 'iZak',
    category: 'Smart home · AIoT platform',
    role: 'Product designer · core iZak team',
    ownershipType: 'collab',
    year: '',
    timeline: '',
    status: 'Concept · three design rounds to final screens',
    liveUrl: '',
    featured: false,
  },
  imageBase: '/IMAGES/iZak',

  hero: {
    eyebrow: 'AIoT · Smart home · NextGenTV / ATSC 3.0',
    title: 'iZak',
    tagline:
      'Come home to intelligence: a smart home run from the screen the whole household shares, with software updates that reach every device at once.',
    cta: { label: '', url: '' },
    image: 'IZAK_scr_dashboard',
  },

  snapshot: {
    eyebrow: 'Project snapshot',
    items: [
      { k: 'Product', v: 'iZak, an AIoT intelligent-apps platform for the home' },
      { k: 'Primary surface', v: 'The television (NextGenTV), with a mobile companion that carries real weight' },
      { k: 'Technology', v: 'Broadcast internet · ATSC 3.0 · next-gen TV tuner' },
      { k: 'Data model', v: 'Devices → Spaces → Playbooks, under one household profile' },
      { k: 'My role', v: 'Product designer on the core team: research, IA, TV and mobile UI, the Mo storyboard, LiDAR scanning' },
      { k: 'Methods', v: 'Service blueprint · personas · use cases · competitor analysis · ten-foot UI · platform mapping' },
      { k: 'Business model', v: 'A two-sided platform: households, device makers and broadcasters' },
      { k: 'Status', v: 'Concept, taken through three design rounds to final screens' },
      { k: 'Tagline', v: '“Come home to intelligence.”' },
    ],
  },

  highlights: [
    {
      kicker: 'The starting point',
      title: 'A capability looking for a product.',
      body: 'Broadcast TV could push software updates over the air to every receiver in range. The question was which product deserved that, and “none” stayed on the table as a real answer.',
    },
    {
      kicker: 'Insight one',
      title: 'One person runs the smart home. Everyone else lives in it.',
      body: 'The controls sat with whoever installed the devices, on a private phone, and the rest of the household depended on them. A phone-first product inherits that.',
    },
    {
      kicker: 'Insight two',
      title: 'Updates get skipped because they cost effort.',
      body: 'Every device updates on its own, the benefit is invisible and the timing is bad. An out-of-date home is a design outcome, not careless owners.',
    },
    {
      kicker: 'The decision',
      title: 'Put the home on the shared screen.',
      body: 'The TV is communal by default and already holds the broadcast tuner. Understand the home from the couch; set it up and act from the phone.',
    },
    {
      kicker: 'The model',
      title: 'Devices, Spaces, Playbooks.',
      body: 'What a thing is, where it lives, and what the home does. It replaced manufacturer-shaped silos with the way households talk about their homes.',
    },
    {
      kicker: 'The differentiator',
      title: 'Make invisible updates visible.',
      body: 'Broadcast updates succeed when nobody notices, so trust had to be designed in: a live Updating card, a receipt for every device, and a visible fallback when a broadcast is missed.',
    },
  ],

  process: {
    eyebrow: 'Design process',
    headline: 'From a capability to a product.',
    lead: 'Working backwards from a technology is risky, so every step had to be able to say no.',
    steps: [
      { no: '01', title: 'Frame the question', body: 'Start from the broadcast capability and ask which consumer product justifies it, keeping “no product” as a legitimate answer.' },
      { no: '02', title: 'Map the whole journey', body: 'A service blueprint from the shop floor to the first firmware update: stages, actions, channels, actors, effort and the emotional arc.' },
      { no: '03', title: 'Personas and use cases', body: 'Three relationships to the same home: the admin, the locked-out optimizer and the orchestrator.' },
      { no: '04', title: 'Benchmark the field', body: 'SmartThings, Home Assistant, openHAB, Wink and others, every capability sorted into four tiers.' },
      { no: '05', title: 'Decide the surface', body: 'Phone, hub or TV, compared on who each serves, what each costs, and whether it connects to the broadcast advantage.' },
      { no: '06', title: 'Information architecture', body: 'Collapse rooms, scenes and devices into one model: Devices, Spaces, Playbooks.' },
      { no: '07', title: 'Three design rounds', body: 'Each round removed a desktop or mobile habit until the screens worked at ten feet with a remote, followed by an audit against tvOS and Android TV guidance.' },
      { no: '08', title: 'Map the platform', body: 'A two-sided ecosystem canvas and a minimum viable platform, with its riskiest assumptions written as tests.' },
    ],
  },

  flagship: {
    eyebrow: '01 · The starting point',
    headline: 'A technology looking for a product.',
    lead:
      'iZak began inside NextGenTV (ATSC 3.0) broadcast work, when the team realised the broadcast channel could carry **software and firmware updates to every receiver in range at once**.\n\nThat mattered because of scale. Deloitte’s connectivity survey put the average U.S. home at about 25 connected devices in 2021 and 22 in 2022, each fetching its own updates over its own connection. One broadcast signal could serve every home in range at once, which moves the unit economics from **cost per device to cost per broadcast minute**.\n\nSo the real question was never *can we?* but **which consumer product earns this?** We kept “no product” as a legitimate answer, and that discipline shaped every decision after it.',
    stats: [
      { num: '22–25', label: 'connected devices per U.S. home (Deloitte, 2021–22)' },
      { num: '1', label: 'broadcast signal for every home in range, at once' },
    ],
    image: 'IZAK_broadcast_01',
    modal: null,
  },

  research: {
    eyebrow: '02 · Discovery',
    headline: 'The home is shared. Its interface isn’t.',
    lead:
      'Fragmentation (too many apps) was real, but competitors already owned that problem. Research went a layer deeper and found two problems nobody owned, then mapped the full journey in a **service blueprint**, from the shop floor to the first firmware update.',
    image: 'IZAK_blueprint_01',
    imageCaption:
      'The journey as the blueprint mapped it: stages, channels and actors, with effort across the top. The two peaks, signing in and authoring automations, became design targets.',
    groups: [
      {
        label: 'Two problems nobody owned',
        snips: [
          {
            body: '**One user, many inhabitants.** Whoever installed the devices controls them from a private phone, and everyone else depends on that person. A phone-first product inherits the flaw.',
            cite: 'Insight · the shared home',
          },
          {
            body: '**Updates are neglected because updating is costly.** Each device takes its own effort, the benefit is invisible, and updates land at bad moments. An insecure home is a UX outcome, not careless owners. The broadcast tuner removes the per-device cost.',
            cite: 'Insight · the update gap',
          },
        ],
      },
      {
        label: 'Five blueprint findings, and what each changed',
        snips: [
          {
            body: 'Effort peaks before any value arrives: signing in took about five minutes and rated very high effort, next to an empty first dashboard. → **Credentials moved to the phone, and the first-run dashboard got something to show.**',
            cite: 'Finding 1 · onboarding',
          },
          {
            body: 'Authoring is the longest task: building each automation took 8–10 minutes. → **Template-first playbooks turn it into a short edit, with a blank canvas as the fallback.**',
            cite: 'Finding 2 · authoring',
          },
          {
            body: 'The TV is one channel of six: phone, laptop, TV, tablet, watch and QR codes all carry part of the journey. → **The couch-and-pocket division of labour.**',
            cite: 'Finding 3 · channels',
          },
          {
            body: 'The journey starts in the shop, more than a week before setup. → **The storefront lives inside the product.**',
            cite: 'Finding 4 · the shop',
          },
          {
            body: 'The platform’s other sides show up in the consumer journey: a salesperson, the house owner, the household, and manufacturers, at setup and again at updates. → **Manufacturer deployment and device health are designed into the platform.**',
            cite: 'Finding 5 · the other actors',
          },
        ],
      },
    ],
  },

  personas: {
    eyebrow: '03 · Personas',
    headline: 'Three relationships to the same home.',
    lead:
      'Each persona is defined less by demographics than by how they relate to the home, and each one forced specific requirements into the product.',
    items: [
      {
        name: 'Harvesh S',
        title: 'IoT enthusiast · Product manager',
        archetype: 'The admin',
        about: 'Runs everything in the house and enjoys the technology, but is worn down by keeping it all maintained. Values innovation, security and efficiency.',
        needs: ['The same control for less maintenance work', 'Security he can verify, device by device', 'One place instead of a dozen apps'],
        forced: ['Device-level depth on the phone', 'Firmware histories and rollout visibility', 'Update rules that never interrupt what is in use'],
        colour: '#5b4bde',
      },
      {
        name: 'Mike Foss',
        title: 'Busy professional · Family of four',
        archetype: 'The locked-out optimizer',
        about: 'Wants outcomes, not systems: a home that runs itself, saves energy and keeps the family informed, without him becoming its administrator.',
        needs: ['Benefit without setup work', 'Energy in money he understands', 'To stay informed, not in charge'],
        forced: ['A money-first energy surface', 'Automation that gives benefit without programming'],
        colour: '#0071e3',
      },
      {
        name: 'Diana Hilton',
        title: 'Writer · Community host',
        archetype: 'The orchestrator',
        about: 'Runs the household’s routines (mornings, bedtime, guests), but the smart home doesn’t speak her language.',
        needs: ['Automations shaped like routines', 'Room for family members and guests', 'Words, not logic'],
        forced: ['Playbooks shaped like routines', 'Profiles, permissions and guest access as launch requirements'],
        colour: '#1d8a6a',
      },
    ],
  },

  featureTiers: {
    eyebrow: '04 · Feature analysis',
    headline: 'Control is table stakes. Two jobs were unowned.',
    lead:
      'We benchmarked the leading smart-home platforms and sorted every capability into four tiers. The conclusion set the strategy: **direct control is table stakes; nobody owned the shared household experience, or the work of keeping devices current.**',
    benchmarked: ['SmartThings', 'Home Assistant', 'openHAB', 'Wink', 'and others'],
    tiers: [
      { name: 'Existing', note: 'Standard everywhere, iZak included.', items: ['Device groups', 'Direct controls', 'Routines', 'Schedules'] },
      { name: 'Partially present', note: 'Where iZak offered less than the broader field.', items: [] },
      { name: 'Potential', note: 'Competitor features not yet in iZak.', items: [] },
      {
        name: 'Innovative',
        note: 'Unique to iZak.',
        items: ['Broadcast software updates', 'Community intelligence', 'A TV-first household experience'],
        highlight: true,
      },
    ],
    baseline: {
      title: 'Minimum viable platform',
      items: ['Smart device management', 'Software updates', 'Automations'],
      note: 'The three capabilities the first release had to prove.',
    },
    footnote:
      'Tiers as sorted during the project. The market has moved since: some TV makers now put a home dashboard on the TV. That is why the case rests on designing for the shared household and on broadcast delivery, not on “the TV” alone.',
  },

  tables: {
    metrics: {
      eyebrow: 'Measuring success',
      headline: 'The metrics we would run it on.',
      lead:
        'A proposed measurement framework, set before launch, that ties each design bet to a business number. The North Star is **weekly active households**: a household, not a user, because the product is shared.',
      columns: ['Metric', 'What it tells the business', 'Design bet it tests'],
      rows: [
        { label: 'Activation: time to first playbook', cells: ['How fast a new household gets value. The blueprint showed effort peaking before value arrives.', 'Sign-in on the phone, devices found on first run, templates first'] },
        { label: 'Onboarding completion rate', cells: ['Where households drop out before the product gets a chance.', 'QR sign-in and QR pairing'] },
        { label: 'Dashboard share of interactions', cells: ['Whether the home surface is enough on its own. Target: above 70%.', 'Eight cards, four questions'] },
        { label: 'Retention: D30 and D90 households', hot: true, cells: ['Whether the home becomes a habit; the strongest predictor of lifetime value (LTV).', 'A TV-first, shared surface'] },
        { label: 'Playbook survival at 30 days', cells: ['Whether automation sticks: an early retention signal.', 'Templates first'] },
        { label: 'Counter-action rate', cells: ['Whether people trust the agent. It should fall over time.', 'Act, then report; guardrails'] },
        { label: 'Devices current · update success rate', cells: ['Fleet security, and the value manufacturers pay for.', 'Updating card, Wi-Fi fallback'] },
        { label: 'Cost per device updated', hot: true, cells: ['Delivery unit economics: broadcast cost per minute against per-gigabyte internet delivery.', 'Broadcast updates'] },
        { label: 'Storefront attach rate', cells: ['Revenue per household, kept honest by the completeness guardrail.', 'Recommendations from gaps'] },
      ],
      footnote: 'Proposed, not measured. iZak is concept-stage work, so these are the numbers it would be judged on, not results.',
    },
    surface: {
      tone: 'gray',
      eyebrow: '05 · The decision',
      headline: 'Where should the home’s interface live?',
      lead: 'Three candidates, judged on who they serve, what they cost, and whether they connect to the broadcast advantage.',
      columns: ['Option', 'Why it’s attractive', 'Why it falls short', 'Verdict'],
      rows: [
        {
          label: 'Phone-first hub app',
          cells: [
            'The default move: best for in-the-moment control, and the cheapest to ship.',
            'One more app in the pile; inherits the one-admin problem; no link to the broadcast asset.',
            'Not the main surface; kept as the companion',
          ],
        },
        {
          label: 'Hub or wall panel',
          cells: ['Communal and always on.', 'New hardware and another object in the home; still no link to the broadcast asset.', 'Rejected'],
        },
        {
          label: 'The television',
          hot: true,
          cells: [
            'The only screen a household shares by default; it already houses the tuner; a big canvas for lean-back monitoring.',
            'It idles most of the day; a remote is hostile to authoring; a shared screen has no privacy by default.',
            '**Chosen, with three costs accepted**',
          ],
        },
      ],
      footnote:
        'Why the TV won: communal by default, the differentiator lives inside it, and a smart home’s daily job is monitoring, not configuring.',
    },
    alignment: {
      tone: 'gray',
      eyebrow: '10 · Platform alignment',
      headline: 'Checked against the ten-foot rulebooks.',
      lead:
        'The final round was audited against Apple’s tvOS Human Interface Guidelines and Google’s Android TV design guidance. Each rule is mapped to the final answer and to the round that first broke it.',
      columns: ['Rule', 'Guidance', 'The final answer', 'First broken in'],
      rows: [
        { label: 'Focus & selection', cells: ['tvOS', 'One focus treatment across cards, chips and the rail', 'Round one: no focus state at all'] },
        { label: 'Colour', cells: ['Android TV', 'One dark surface, one restrained accent', 'Round one (saturated purple everywhere) and round two (a colour per tile)'] },
        { label: 'Typography', cells: ['Android TV', 'Display-scale titles and short labels, with no paragraph that has to survive the couch', 'Round two: small type, dense rows'] },
        {
          label: 'Layout & overscan',
          cells: [
            'Android TV · tvOS',
            'Generous insets: about 5% on Android TV (48 px sides, 27 px top and bottom at 1080p); roughly 60 pt vertical and 80–90 pt horizontal on tvOS',
            'Round one: content to the edges',
          ],
        },
        { label: 'Navigation', cells: ['tvOS', 'A labelled rail, aligned grids, pagination and a filter sheet, for the fewest presses', 'Round two: dozens of equal tiles on one screen'] },
        { label: 'Text entry', cells: ['tvOS', 'Pairing hands typing to the phone by QR', 'Round two: a form filled field by field with the remote'], hot: true },
      ],
    },
    mvp: {
      eyebrow: '18 · The minimum viable platform',
      headline: 'Three assumptions, written as tests.',
      lead:
        'The first release (device management, software updates and automations) was framed with its riskiest assumptions stated as tests, each with a clear validation criterion.',
      columns: ['Assumption', 'How we’d test it', 'Validated when'],
      rows: [
        {
          label: 'The personalised dashboard is enough for quick actions.',
          cells: ['Make it the default entry surface.', 'Over 70% of interactions happen on the dashboard rather than through navigation.'],
        },
        {
          label: 'Playbook templates help people start automating.',
          cells: ['Offer predefined templates and guide the customisation.', 'Template playbooks stay in regular use, and new playbooks get created.'],
        },
        {
          label: 'iZak’s automatic actions make daily life easier.',
          cells: ['Track the counter-actions people take to undo them.', 'Counter-actions fall over time.'],
        },
      ],
    },
    validation: {
      tone: 'gray',
      eyebrow: '19 · Validation plan',
      headline: 'What still needs proving, and how.',
      lead:
        'This is concept-stage work, so no outcomes are claimed. These are the four riskiest assumptions, the test for each, and what the result would decide.',
      columns: ['Assumption', 'Method', 'What it decides'],
      rows: [
        {
          label: 'The glance test',
          cells: ['Timed-exposure comprehension test: can a first-time viewer read energy, activity, safety and attention in five seconds?', 'Whether the dashboard keeps its core promise.'],
        },
        {
          label: 'Authoring on a remote',
          cells: ['Comparative usability test: completion and time editing a playbook template by D-pad versus phone.', 'Below a usable threshold, authoring moves entirely to the phone and the TV only plays.'],
        },
        {
          label: 'Update trust',
          cells: ['Comparative concept test, with and without the Updating card and version history.', 'Whether the trust surfaces earn their space, or are noise.'],
        },
        {
          label: 'The TV-first bet',
          hot: true,
          cells: ['Two-week diary study: where do people reach to check the home, and where to change it?', 'The honest kill-test: the one result that could disprove the premise.'],
        },
      ],
    },
  },

  cardSets: {
    onboarding: {
      tone: 'gray',
      eyebrow: 'User flows · the real screens',
      headline: 'Onboarding, as designed.',
      lead:
        'The final onboarding runs in five steps, and every one keeps typing off the remote: **the TV shows a QR code, and the phone does the writing.**',
      cards: [
        { title: '1/5 · Sign up by QR', body: 'Scan to sign up on the phone, or use the form, with Apple, Facebook and Google sign-in as shortcuts.', image: 'IZAK_scr_onboard21' },
        { title: 'Inline validation', body: 'Password rules check as you type, so errors never reach the next screen.', image: 'IZAK_scr_onboard24' },
        { title: '2/5 · Personal details', body: 'Name, date of birth and address, with the same QR route to the phone.', image: 'IZAK_scr_onboard22' },
        { title: '3/5 · Add your spaces', body: 'Predefined areas to start from, so the home has a shape before any device arrives.', image: 'IZAK_scr_onboard11' },
        { title: '4/5 · Watch for new devices', body: 'The household chooses whether iZak scans for devices automatically or adds them by hand.', image: 'IZAK_scr_onboard12' },
        { title: '5/5 · Devices found', body: 'Three devices already detected and ready to configure, so the first dashboard is never empty.', image: 'IZAK_scr_onboard13' },
      ],
    },
    spacesflow: {
      eyebrow: 'Spaces · the real screens',
      headline: 'Making a space.',
      cards: [
        { title: 'Name it', body: 'Give the space a name, and add your own photo by scanning a QR code with the phone.', image: 'IZAK_scr_onboard27' },
        { title: 'Assign its devices', body: 'Pick the devices that live there, filtered by type, and the floor it sits on.', image: 'IZAK_scr_spaces1' },
        { title: 'Confirmed', body: 'The new space appears with its devices, ready to control as one.', image: 'IZAK_scr_spaces1b' },
      ],
    },
    devicectl: {
      tone: 'gray',
      eyebrow: 'Device control · the real screens',
      headline: 'One device, from the couch.',
      cards: [
        { title: 'Direct control', body: 'Blinds set by preset or by step, with large targets a remote reaches in a press or two.', image: 'IZAK_scr_blinds' },
        { title: 'A new device, with an update waiting', body: 'Rename it, add it to a space, and see at once that a newer version is available.', image: 'IZAK_scr_newdevice' },
      ],
    },
    agentic: {
      tone: 'dark',
      eyebrow: 'Agentic behaviour',
      headline: 'A home that acts on its own has to earn it.',
      lead:
        'iZak doesn’t only wait for commands. Playbooks run on triggers, and iZak’s AI takes routine actions by itself, which makes the home an **agent acting on the household’s behalf**. Autonomy without trust gets switched off, so the design treats every automatic action as something the system has to justify.',
      cards: [
        { title: 'Act, then report', body: 'The home says what it did, in plain words (“Siri turned the bedroom lights off”), so nothing happens behind anyone’s back.' },
        { title: 'Guardrails before speed', body: 'Quiet hours and in-use rules decide when the system may act. An update or an automation never interrupts what the household is doing.' },
        { title: 'Undo is the trust metric', body: 'Every automatic action can be reversed, and the rate of reversals is tracked. If people undo iZak less over time, the agent is earning its autonomy.' },
        { title: 'Autonomy that matches the risk', body: 'The next step we’d take: let autonomy scale with what is at stake. Lights can act and report; a door lock should ask first.' },
      ],
    },
    business: {
      tone: 'gray',
      eyebrow: 'Business strategy',
      headline: 'Why the model works, not just the screens.',
      lead:
        'Design choices only matter if the business underneath holds. These are the strategic arguments behind iZak, and the design decisions that serve each one.',
      cards: [
        {
          title: 'Unit economics: per broadcast, not per device',
          body: 'Over the internet, every device update is a separate download, so the delivery bill grows with each device and each home. Broadcast capacity is bought as airtime, a **cost per minute**, whether it reaches ten homes or a million. The marginal cost of the next home is close to zero.',
        },
        {
          title: 'Distribution and acquisition cost',
          body: 'iZak lives on a screen the household already owns. Phone-first rivals have to buy every install through app stores; a TV surface gives a structurally lower **customer acquisition cost (CAC)**.',
        },
        {
          title: 'Retention through the household',
          body: 'A phone app is retained by one person; a TV surface is used by everyone in the room. Spaces and playbooks set up over weeks become **switching costs**, and templates that stay in use are the earliest retention signal.',
        },
        {
          title: 'Network effects as the moat',
          body: 'More supported devices make iZak more useful to households; more households make it more valuable to manufacturers and broadcasters. That two-sided loop, plus broadcast delivery that rivals can’t copy without spectrum, is the moat.',
        },
        {
          title: 'Monetisation levers',
          body: 'The platform map opens several: storefront **attach rate** and bundles, deployment and device-health services for manufacturers, broadcast capacity for broadcasters, and partner playbooks. Each must serve the home first, the same guardrail as the storefront.',
        },
      ],
    },
    rule: {
      eyebrow: 'The rule',
      headline: 'Understand from the couch. Act from the pocket.',
      lead:
        'Every later screen was tested against one division of labour: **understand and orchestrate the home from the TV; configure and act in the moment from the phone.** Choosing the TV meant accepting three costs, and each became its own piece of design.',
      image: 'IZAK_split_01',
      imageCaption: 'The couch and the pocket: one home profile, two jobs.',
      cards: [
        { title: 'A TV idles more than it plays', body: 'So iZak needed a resting state of its own: ambient mode, a living map of the home instead of a black screen.' },
        { title: 'A remote is a hostile authoring tool', body: 'Creation was rebuilt from constrained pickers and templates, or routed to the phone.' },
        { title: 'A shared screen has no privacy by default', body: 'Profiles, permissions and guest access became launch requirements, not features.' },
      ],
    },
    dashboard: {
      eyebrow: '11 · The home dashboard',
      headline: 'Everything the home is doing, in one glance.',
      lead:
        'The dashboard answers the four questions a household asks from the couch: **how much energy are we using, what is the home doing right now, is everything safe, and what needs my attention?** Primary answers sit a few directional presses away, and alerts come first in focus order. Round one’s dashboards were mission control; the final one is calm at rest and dense on demand.',
      image: 'IZAK_dashboard_01',
      imageCaption: 'Schematic: the eight cards read against the four questions.',
      cards: [
        { title: 'Energy', body: 'Live consumption split across grid and solar, with a per-room breakdown.' },
        { title: 'Devices', body: 'All 24 connected devices, grouped and controllable at a glance.' },
        { title: 'Cameras', body: 'Live security feeds, right on the home surface.' },
        { title: 'Playbooks', body: 'What is running now, like Morning Meditation or Party Mode.' },
        { title: 'Updating', body: 'Firmware rollouts in progress across the TV and devices, with live status.' },
        { title: 'Climate', body: 'Temperature and comfort for every space in the home.' },
        { title: 'Speakers', body: 'What is playing, ready for playbook control.' },
        { title: 'Profiles', body: 'A shared identity, so the home adapts to who is home.' },
      ],
    },
    surfaces: {
      tone: 'gray',
      eyebrow: '14 · Supporting surfaces',
      headline: 'Energy, a storefront, and a home that idles well.',
      cards: [
        {
          title: 'Energy: money first, kilowatt-hours second',
          body: 'Meter data only matters if it changes a decision. The weekly report leads with predicted cost, splits use by space and appliance, and compares carbon against solar for households motivated by green. Built for Mike.',
        },
        {
          title: 'Storefront: completing the home, not farming it',
          body: 'Recommendations come from gaps in the home’s device graph, with bundles at one total price; discovery and checkout stay in the same ten-foot experience. The guardrail: serve the home’s completeness, not engagement targets.',
        },
        {
          title: 'Ambient mode: the home as a living map',
          body: 'When the TV is on but idle, iZak shows a live spatial view of the home, with events appearing where they happen: the main door unlocking, lights coming on.',
        },
      ],
    },
    mobile: {
      eyebrow: '16 · Mobile companion',
      headline: 'The other half of the rule.',
      lead:
        'Committing to the TV made the phone essential, not optional. It carries configuration, device-level depth, away-from-home moments and space setup, using the TV’s dark visual system and components, sized for the hand.',
      cards: [
        { title: 'Home', body: 'A welcome-home overview of what the house is doing.' },
        { title: 'Device detail', body: 'Versions, controls, and one-tap update: the receipt Harvesh needs.' },
        { title: 'The deep scroll', body: 'Every space and device within reach of a thumb.' },
        { title: 'Spaces', body: 'Rooms and their devices, ready to edit, including scanning a room into a model.' },
      ],
    },
    platform: {
      tone: 'gray',
      eyebrow: '18 · The platform behind the product',
      headline: 'A two-sided platform, mapped before it was designed.',
      lead:
        'iZak only works if every side gets something. **Manufacturers** automate deployment and watch device health across their installed base. **Broadcasters** push updates and content over spectrum. **Homeowners** get automation, control and real-time insight.',
      image: 'IZAK_ecosystem_01',
      imageCaption: 'The ecosystem canvas: who governs, supplies, consumes, extends and owns the platform.',
      cards: [
        { title: 'Govern', body: 'Government and standards bodies (ATSC, NAB) regulate and govern the platform.' },
        { title: 'Supply', body: 'Peer producers (device manufacturers, service providers, businesses) supply value into the ecosystem.' },
        { title: 'Consume', body: 'Peer consumers (citizens, businesses, service providers) use the value the platform creates.' },
        { title: 'Extend', body: 'Partners (broadcasters, franchise owners, retail) extend and distribute that value.' },
        { title: 'Own', body: 'The platform owner holds the vision and keeps the platform existing and evolving.' },
      ],
    },
    learnings: {
      eyebrow: 'What it taught us',
      headline: 'Three lessons I’d take to any connected product.',
      cards: [
        { title: 'Working backwards from a technology', body: 'It is risky and generative at once. What keeps the research honest is being genuinely willing to conclude “no product”.' },
        { title: 'A shared screen is a social system', body: 'Profiles, permissions and privacy are what separate a household product from an admin tool with spectators.' },
        { title: 'An invisible feature is a UX problem first', body: 'Updates only create value if people can feel the care behind them. That comes before the engineering achievement.' },
      ],
    },
  },

  principles: {
    eyebrow: '06 · Designing for ten feet',
    headline: 'Bringing dashboard-style control to the couch.',
    lead:
      'A TV is read from across a room and driven by a five-button remote. These six principles came out of the design rounds, and most were learned by breaking them first.',
    items: [
      { key: 'readable', name: 'Ten-foot readability', cat: 'Legibility', colour: '#5b4bde', desc: 'Type, spacing and cards sized to read from across the room.' },
      { key: 'remote', name: 'Remote-first navigation', cat: 'Input', colour: '#0071e3', desc: 'Every primary action reachable by directional focus. Never a cursor.' },
      { key: 'glance', name: 'Glanceable status', cat: 'Legibility', colour: '#5b4bde', desc: 'Energy, security and device state readable in one look.' },
      { key: 'density', name: 'Progressive density', cat: 'Legibility', colour: '#5b4bde', desc: 'A calm surface at rest; detail only when someone asks for it.' },
      { key: 'contrast', name: 'High-contrast hierarchy', cat: 'Input', colour: '#0071e3', desc: 'Alerts and critical states take priority instantly.' },
      { key: 'shared', name: 'Household-shared', cat: 'Household', colour: '#1d8a6a', desc: 'One surface many people read, with profiles and permissions underneath.' },
    ],
  },

  designSystem: {
    eyebrow: '07 · Information architecture',
    headline: 'The nouns and verbs of a home.',
    lead:
      'Round one split the home into silos (Rooms, Scenes, Devices), the way manufacturers organise products, not the way households talk. The final model has three parts: **Devices** are what a thing is, **Spaces** are where it lives, and **Playbooks** are what the home does. Two nouns and a verb. “Scenes” was renamed too: the word came from AV presets and suggested something you switch on, while these automations orchestrate devices, spaces and conditions over time.',
    cards: [
      {
        title: 'Devices',
        body: 'Filter by type or maker, control any device directly, or switch the whole home on or off, with its version history one step away.',
        image: 'IZAK_scr_filter',
      },
      { title: 'Spaces', body: 'Floors, groups and rooms all at once, each controllable as one, instead of one space visible at a time.', image: 'IZAK_scr_spaces' },
      { title: 'Playbooks', body: 'Running, available, and offered by partners, filterable by type, provider and space.', image: 'IZAK_model_01' },
    ],
    modal: null,
  },

  ia: {
    eyebrow: 'Information architecture · by surface',
    headline: 'Where everything lives, on each screen.',
    lead:
      'The same model, split by the rule: the TV carries what a household reads together; the phone carries what one person sets up.',
    trees: [
      {
        surface: 'TV',
        role: 'Understand and run, from the couch',
        nodes: [
          {
            label: 'Home',
            note: 'The dashboard: four questions, eight cards',
            children: [
              { label: 'Energy' },
              { label: 'Devices' },
              { label: 'Cameras' },
              { label: 'Playbooks' },
              { label: 'Updating', note: 'Rollouts visible from the couch' },
              { label: 'Climate' },
              { label: 'Speakers' },
              { label: 'Profiles' },
            ],
          },
          {
            label: 'Devices',
            note: 'Grouped, paged, filterable',
            children: [
              { label: 'Filter sheet', note: 'Type · maker' },
              { label: 'New devices detected' },
              { label: 'QR pairing', note: 'Typing moves to the phone' },
              { label: 'Device detail', note: 'Warranty · addresses · spaces' },
            ],
          },
          {
            label: 'Spaces',
            note: 'Floors, groups and rooms at once',
            children: [{ label: 'Space detail', note: 'Devices · playbooks' }, { label: 'Add a space', note: 'Name · photo · devices' }],
          },
          {
            label: 'Playbooks',
            note: 'Running · available · from partners',
            children: [
              { label: 'Create', note: 'Templates first, blank canvas last' },
              { label: 'Edit', note: 'Triggers · conditions · spaces · devices' },
              { label: 'Trigger picker', note: 'Built for a D-pad' },
            ],
          },
          { label: 'Energy', note: 'Weekly report, cost first' },
          { label: 'Store', note: 'Recommendations from gaps · bundles' },
          { label: 'Ambient mode', note: 'A living map while the TV idles' },
          { label: 'Profiles', note: 'Who is home · permissions · guests' },
        ],
      },
      {
        surface: 'Phone',
        role: 'Set up and act, in the pocket',
        nodes: [
          { label: 'Home', note: 'Welcome-home overview' },
          {
            label: 'Devices',
            children: [
              { label: 'Device detail', note: 'Controls · one-tap update' },
              { label: 'Version history', note: 'The receipt for every update' },
            ],
          },
          {
            label: 'Spaces',
            note: 'Rooms and devices, ready to edit',
            children: [{ label: 'Scan a room', note: 'LiDAR + photogrammetry' }],
          },
          { label: 'Playbooks', note: 'Deep authoring' },
          { label: 'Sign-in & pairing', note: 'Typing happens here, by QR from the TV' },
          { label: 'Away from home', note: 'Alerts and quick actions' },
        ],
      },
    ],
    footnote: 'Assembled from the final-round screens.',
  },

  walkthrough: {
    eyebrow: '08 · User flows',
    headline: 'From the box to a home that runs itself.',
    lead:
      'The core flow, end to end, designed so **every typed field lands on the phone and every glance stays on the TV.**',
    scenario:
      '**A worked example.** Mike’s family brings home a NextGenTV and a handful of smart devices. The flow follows them from first switch-on to a home that runs itself.',
    actors: ['On the TV', 'On the phone', 'iZak', 'Partners'],
    method: {
      title: 'Start from the job',
      lead: 'Each flow serves a job one of the personas came with, written here as job stories.',
      jobs: [
        {
          actor: 'Harvesh · the admin',
          when: 'something in the house needs maintaining,',
          want: 'see every device’s state and update history in one place,',
          so: 'stay in control without chasing a dozen apps.',
        },
        {
          actor: 'Mike · the locked-out optimizer',
          when: 'I sit down after work,',
          want: 'know what the home is costing and doing at a glance,',
          so: 'get the benefit without becoming its administrator.',
        },
        {
          actor: 'Diana · the orchestrator',
          when: 'the household’s routines change (mornings, bedtime, guests),',
          want: 'set them up in words that match how we live,',
          so: 'the home follows the family, not the other way round.',
        },
      ],
      steps: [
        { title: 'Blueprint the journey', body: 'Find where effort peaks before value arrives.' },
        { title: 'Write the rule', body: 'Decide what belongs on the couch, and what in the pocket.' },
        { title: 'One flow per job', body: 'Design each path against the persona who needs it.' },
        { title: 'Test it on a remote', body: 'Every step must work with five buttons, or move to the phone.' },
      ],
    },
    screens: {
      title: 'The core flow, screen by screen',
      lead: 'Low-fidelity, to show the path rather than the pixels. The **accent** marks what the person acts on. TV screens are dark, phone screens light.',
      items: [
        { kind: 'tv-signin', no: '01', title: 'Sign in by QR', body: 'The first run never asks the remote to type. The TV shows a code.', affordance: 'Scan it with the phone' },
        { kind: 'ph-signin', no: '02', title: 'Credentials on the phone', body: 'Typing happens where typing is easy, and the household profile is created.', affordance: 'Back to the TV' },
        { kind: 'tv-detected', no: '03', title: 'Not an empty dashboard', body: 'iZak has already found devices, so the first screen has something useful to do.', affordance: 'Configure the first device' },
        { kind: 'tv-pair', no: '04', title: 'Pair by QR', body: 'The device and its pairing code side by side, legible from the couch.', affordance: 'Scan with the phone' },
        { kind: 'ph-pair', no: '05', title: 'Details on the phone', body: 'The phone scans the code and fills in anything the device needs.', affordance: 'Confirm' },
        { kind: 'tv-space', no: '06', title: 'Give it a place', body: 'Confirm the details on the TV and choose its space with a few presses.', affordance: 'Assign to a space' },
        { kind: 'tv-templates', no: '07', title: 'Templates first', body: 'The first playbook starts from a template; a blank canvas is the last option.', affordance: 'Pick a template' },
        { kind: 'tv-sentence', no: '08', title: 'Adjust with pickers', body: 'Trigger, condition, spaces, devices: each a short list a D-pad can move through.', affordance: 'Run it' },
        { kind: 'tv-home', no: '09', title: 'A home that runs itself', body: 'The playbook is running and the first update is rolling out, visible from the couch.', affordance: 'Back to the evening' },
      ],
    },
    lanes: {
      title: 'Who does what, phase by phase',
      phases: ['Shop', 'Sign in', 'Find', 'Pair', 'Organise', 'Automate', 'Live', 'Update'],
      rows: [
        {
          actor: 'On the TV',
          cells: [null, 'Shows a QR to sign in', '“New devices found”', 'Shows the pairing QR', 'Confirm details, pick a space', 'Template, then pickers', 'Glance at the dashboard; ambient map when idle', 'Updating card shows the rollout'],
        },
        {
          actor: 'On the phone',
          cells: [null, 'Signs in; typing stays here', null, 'Scans, fills in details', 'Sets up spaces in depth', 'Authors playbooks in depth', 'Acts when away from home', 'Version history per device'],
        },
        {
          actor: 'iZak',
          cells: [null, 'Creates the household profile', 'Detects devices', 'Registers the device', null, 'Runs playbooks, reports back', 'Voice actions reported back', 'Broadcast, quiet hours, Wi-Fi fallback'],
        },
        {
          actor: 'Partners',
          cells: ['Salesperson helps choose the TV and devices', null, null, 'Manufacturer’s device joins', null, 'Partner playbooks offered', null, 'Makers deploy; the broadcaster transmits'],
        },
      ],
      caption:
        'Dashed cells are deliberate: the TV never asks for typing, the phone never has to be the dashboard, and the system carries detection, reporting and updates on its own.',
    },
    stages: [],
    footnote: 'Assembled from the blueprint findings and the final-round screens.',
  },

  rounds: {
    eyebrow: '09 · Iterations',
    headline: 'Three rounds to ten feet.',
    lead:
      'Each round stripped out a habit borrowed from desktop or mobile. The mistakes sit next to the fixes, because the fixes only make sense beside them.',
    items: [
      {
        name: 'Round one',
        title: '“A desktop dashboard in a TV costume.”',
        problems: [
          'No clear navigation path',
          'Poor use of the big canvas',
          'Exploration without a grid or component system',
          'Content running to the screen edges',
          'Hover and touch furniture, with no focus state',
        ],
        kept: ['The focus ring', 'QR pairing'],
      },
      {
        name: 'Round two',
        title: '“Dark, but a poster, not an instrument.”',
        problems: [
          'Hard to read at distance: small type, tight rows, mixed card sizes, no reading order',
          'Interactions undefined for a remote: sliders, colour pickers, multi-state chips',
          'One option at a time: comparing rooms meant paging blind',
          'Long manual forms with no QR alternative',
          'Every tile its own colour',
        ],
      },
      {
        name: 'Round three',
        title: '“The ten-foot system.”',
        problems: ['Purple chrome and rainbow tiles', 'Missing navigation and dense grids', 'Desktop density', 'Text entry on the TV', 'Toggle-flip automations'],
        fixes: [
          'One muted surface, one restrained accent, colour used to rank',
          'A labelled rail, pagination and a filter sheet, for fewer focus stops',
          'Distance-scaled type and chunked labels',
          'QR pairing hands typing to the phone',
          'Pickers and templates; presence and time as structured conditions',
        ],
        kept: ['The ten-foot design system', 'QR pairing from the phone', 'Playbook pickers and templates'],
      },
    ],
  },

  matrix: {
    eyebrow: 'Iterations · surface by surface',
    headline: 'Watch one surface grow up.',
    lead: 'Read across a row to see how each surface changed over the three rounds.',
    columns: ['Surface', 'Round one', 'Round two', 'Round three'],
    rows: [
      { label: 'Dashboard', cells: ['Dense panels, unclear navigation path', 'Dark palette, small type, mixed card sizes', '**Eight cards, four questions, one reading order**'] },
      { label: 'Devices', cells: ['A dense, tab-driven list', 'Dense cards with pointer-based controls', '**Grouped, paged and filterable**'] },
      { label: 'Rooms → Spaces', cells: ['Rooms as a list with a device panel', 'One space visible at a time', '**All spaces at once, with floors and groups**'] },
      { label: 'Adding a device', cells: ['QR pairing inside a dense list screen', 'A long manual form, no QR option', '**QR first; details confirmed on screen**'], hot: true },
      { label: 'Automations', cells: ['Scene cards behind toggles', 'Scene cards behind toggles', '**Playbooks from pickers, templates first**'], hot: true },
    ],
    footnote: 'The highlighted rows are where input (the remote) drove the change, not layout.',
  },

  interactions: {
    eyebrow: '12 · Playbooks',
    headline: 'Automation you can author with five buttons.',
    cards: [
      {
        title: 'A sentence, not a flowchart',
        body: 'Trigger, condition and action logic is assembled from constrained pickers, each a few D-pad presses away, and it reads back as a sentence. Deep editing moves to the phone; the TV runs, adjusts and plays.',
      },
      {
        title: 'Templates first, blank canvas last',
        body: 'Starting from a template turns the longest task in the journey into a short edit. Presence and time are structured conditions, not free text.',
      },
      {
        title: 'The home reports back',
        body: 'Voice assistants can trigger playbooks, and the home says what it did (“Siri turned the bedroom lights off”), so it never acts behind anyone’s back.',
      },
    ],
    signatureFlow: ['Whenever', 'every Monday', 'after 17:57', 'run Morning Meditation', 'across Bedroom · Living room', 'with 5 devices'],
  },

  aiLayer: {
    eyebrow: '13 · The differentiator',
    headline: 'Designing an invisible feature.',
    lead:
      'Broadcast updates are iZak’s technical edge and its biggest UX risk at once: when they work perfectly, nobody notices. **Security people can’t see earns no trust; care they can see does.** So the update system was designed as a trust surface, not a background job.',
    cards: [
      {
        title: 'Updating is a first-class card',
        body: 'Rollouts across the home are visible from the couch, next to energy and safety, not buried in settings.',
        image: 'IZAK_update_01',
      },
      { title: 'Every device carries its receipt', body: 'Firmware history and version detail on the device page, so “current” can be checked rather than assumed.', image: 'IZAK_scr_blinds1' },
      { title: 'Rollouts never interrupt use', body: 'Quiet hours and in-use rules protect whatever the household is doing.' },
      {
        title: 'Failure is designed, not ignored',
        body: 'A device that misses the broadcast (offline, no signal) falls back to Wi-Fi for the same package, with a visible retry on the Updating card until it is current and the receipt is logged.',
      },
    ],
  },

  spatial: {
    eyebrow: '15 · Spatial capture',
    headline: 'Scan the home once. See it as a place.',
    lead:
      'An added feature I worked on for a shorter stretch: a **LiDAR and photogrammetry scanning workflow** that captures a real room and turns it into a usable spatial model. Explore it: drag to rotate, explode the floors, tap a room. Then follow the pipeline from scan to model to a living home.',
    footprint: { w: 12, d: 8 },
    floors: [
      {
        id: 'ground',
        label: 'Ground',
        rooms: [
          {
            id: 'living', label: 'Living room', x: 0, y: 0, w: 7, d: 5,
            devices: [
              { kind: 'light', label: 'Ceiling light', state: 'On · 80%', x: 3.6, y: 2.6 },
              { kind: 'tv', label: 'TV', state: 'On · Mo home screen', x: 3.4, y: 0.5 },
              { kind: 'speaker', label: 'Speaker', state: 'Playing · 30%', x: 6.3, y: 0.7 },
              { kind: 'blind', label: 'Blind', state: 'Open', x: 0.5, y: 3.6 },
            ],
          },
          {
            id: 'kitchen', label: 'Kitchen', x: 7, y: 0, w: 5, d: 4,
            devices: [
              { kind: 'light', label: 'Kitchen lights', state: 'On', x: 9.5, y: 2 },
              { kind: 'speaker', label: 'Speaker', state: 'Idle', x: 11.4, y: 0.6, on: false },
              { kind: 'thermo', label: 'Thermostat', state: '21° · holding', x: 7.6, y: 3.3 },
            ],
          },
          {
            id: 'entrance', label: 'Entrance', x: 7, y: 4, w: 5, d: 4,
            devices: [
              { kind: 'lock', label: 'Main door lock', state: 'Unlocked · 7:42 pm', x: 11.4, y: 6 },
              { kind: 'camera', label: 'Door camera', state: 'Live', x: 8, y: 7.4 },
              { kind: 'light', label: 'Porch light', state: 'On', x: 10, y: 7.4 },
            ],
          },
          {
            id: 'study', label: 'Study', x: 0, y: 5, w: 7, d: 3,
            devices: [
              { kind: 'light', label: 'Desk light', state: 'Off', x: 2, y: 6.5, on: false },
              { kind: 'blind', label: 'Blind', state: 'Closed', x: 5.8, y: 7.4 },
            ],
          },
        ],
      },
      {
        id: 'first',
        label: 'First',
        rooms: [
          {
            id: 'bedroom', label: 'Bedroom', x: 0, y: 0, w: 6, d: 5,
            devices: [
              { kind: 'light', label: 'Ceiling light', state: 'Dimmed · 30%', x: 3, y: 2.5 },
              { kind: 'blind', label: 'Blind', state: 'Closing', x: 0.5, y: 2 },
              { kind: 'thermo', label: 'Thermostat', state: '20°', x: 5.4, y: 4.4 },
              { kind: 'speaker', label: 'Speaker', state: 'Idle', x: 0.8, y: 4.4, on: false },
            ],
          },
          {
            id: 'kids', label: 'Kids’ room', x: 6, y: 0, w: 6, d: 4,
            devices: [
              { kind: 'light', label: 'Light', state: 'Off', x: 9, y: 2, on: false },
              { kind: 'thermo', label: 'Thermostat', state: '22°', x: 11.4, y: 3.4 },
              { kind: 'camera', label: 'Room camera', state: 'Updated · v3.1', x: 6.6, y: 0.6 },
            ],
          },
          {
            id: 'guest', label: 'Guest room', x: 0, y: 5, w: 6, d: 3,
            devices: [
              { kind: 'light', label: 'Light', state: 'Off', x: 3, y: 6.5, on: false },
              { kind: 'blind', label: 'Blind', state: 'Open', x: 5.4, y: 7.4 },
            ],
          },
          {
            id: 'bath', label: 'Bathroom', x: 6, y: 4, w: 3, d: 4,
            devices: [{ kind: 'light', label: 'Light', state: 'Off', x: 7.5, y: 6, on: false }],
          },
          {
            id: 'landing', label: 'Landing', x: 9, y: 4, w: 3, d: 4,
            devices: [
              { kind: 'light', label: 'Light', state: 'On', x: 10.5, y: 5.2 },
              { kind: 'sensor', label: 'Motion sensor', state: 'Motion · 2 min ago', x: 11.4, y: 7.4 },
            ],
          },
        ],
      },
    ],
    events: [
      { room: 'entrance', text: 'Main door unlocked' },
      { room: 'living', text: 'Lights turning on' },
      { room: 'bedroom', text: 'Bedroom blind closing' },
      { room: 'kids', text: 'Camera updated over the air' },
    ],
    modes: {
      scan: '**Scan.** The phone’s LiDAR sensor measures depth while its camera captures texture, so each room becomes a cloud of measured points.',
      model: '**Model.** Photogrammetry and the depth points resolve into clean geometry: walls, rooms and floors, to scale. Tap a room for its size.',
      live: '**Live home.** Place the devices and the model becomes a map a household can read: every device where it really is, and events shown where they happen.',
    },
    footnote:
      'An interactive illustration of the direction, built for this portfolio rather than taken from product code. The rooms, 24 devices and events are illustrative.',
  },

  storyboard: {
    eyebrow: '17 · iZak inside Mo',
    headline: 'Storyboarding the home into the TV’s home screen.',
    lead:
      'iZak didn’t live on its own. **Mo**, the NextGenTV home screen I designed (see Revee & Mo), is the shell that launches the whole app ecosystem. I storyboarded how iZak plugs into it, so the home becomes part of the evening rather than one more app to go and find.',
    frames: [
      { no: '01', title: 'An ordinary evening', body: 'The family is on Mo’s home screen, each signed in to their own profile.', image: 'IZAK_sb_01' },
      { no: '02', title: 'The home taps in', body: 'An iZak card appears in Mo’s updates row: the front door was unlocked, and three devices updated overnight.', image: 'IZAK_sb_02' },
      { no: '03', title: 'Straight to the answer', body: 'Selecting it opens iZak at the right place, not its front door. It’s the same hand-off Mo makes to every app.', image: 'IZAK_sb_03' },
      { no: '04', title: 'One press, back to the film', body: 'Run a playbook (lights dim, blinds close) and land back on Mo where they left off.', image: 'IZAK_sb_04' },
      { no: '05', title: 'When nobody is watching', body: 'The idle TV becomes the home’s living map, events appearing where they happen.', image: 'IZAK_sb_05' },
    ],
  },

  decisions: {
    eyebrow: '20 · Decisions',
    headline: 'What we chose, and what it cost.',
    lead: 'The calls that shaped everything after them.',
    items: [
      {
        title: 'The TV as the home’s main interface.',
        chose: 'The shared screen that already carries the broadcast tuner.',
        instead: 'A phone-first hub app: the default, and the cheapest to ship.',
        cost: 'An idle screen to design for, a remote that is poor at authoring, and no privacy by default. Each became its own piece of work.',
      },
      {
        title: 'Author on the phone, run on the TV.',
        chose: 'Deep automation editing on the phone; running, adjusting and playing playbooks on the TV.',
        instead: 'Full authoring on the TV, to keep one surface complete.',
        cost: 'The TV is not self-sufficient: the experience depends on the companion app being there.',
      },
      {
        title: 'Text entry off the TV entirely.',
        chose: 'QR pairing and sign-in: scan and type on the phone, confirm on the TV.',
        instead: 'Field-by-field entry with the remote, as round two had it.',
        cost: 'Setting up a device needs two screens in hand.',
      },
      {
        title: 'Playbooks, not Scenes.',
        chose: 'A new name for automations that orchestrate devices and spaces over time.',
        instead: '“Scenes”, the term most smart-home products already use.',
        cost: 'An unfamiliar word that has to teach itself through templates and examples.',
      },
    ],
  },

  outcome: {
    eyebrow: 'Outcome',
    headline: 'Where it landed.',
    claim: 'A product vision for a TV-first smart home, and a way to make a background technology feel like care.',
    nums: [
      { num: '3', label: 'Design rounds, from desktop habits to a ten-foot system' },
      { num: '3', label: 'Personas, each forcing requirements into the product' },
      { num: '6', label: 'Platform rules audited against tvOS and Android TV' },
      { num: '4', label: 'Risky assumptions, each with a planned test' },
    ],
    footnote:
      'This is concept-stage work. It delivered a product vision and strategy, a TV-first dashboard and ten-foot design language, the Devices–Spaces–Playbooks model, an energy surface that turns meter data into decisions, and a broadcast-update concept designed as a trust system, all grounded in personas, use cases and competitor research. No usability outcomes are claimed; the validation plan is what would prove or disprove the TV-first bet.',
  },

  role: {
    role: 'Product designer · core iZak team',
    ownershipType: 'collab',
    ownership:
      'A core member of the iZak team, involved across the whole project: research, personas, information architecture, the three design rounds and the final TV and mobile screens. I also storyboarded how iZak connects into Mo, and worked for a shorter stretch on the LiDAR scanning feature.',
    timeline: 'Concept phase · three design rounds',
    team: 'iZak product team, within the NextGenTV (ATSC 3.0) programme',
    tools: ['Service blueprinting', 'Personas & use cases', 'Competitive benchmarking', 'Information architecture', '10-ft TV UI', 'Mobile UX', 'Storyboarding'],
    responsibilities: [
      'Research and synthesis: service blueprint, personas and use cases, competitor benchmark',
      'Information architecture: the Devices, Spaces, Playbooks model',
      'TV and mobile UI across three design rounds to final screens',
      'Storyboarding iZak into Mo, the NextGenTV home screen',
      'LiDAR and photogrammetry scanning feature (a shorter engagement)',
    ],
  },

  related: ['revee', 'paas', 'samsungeq'],

  // Every asset is an original illustration drawn for this portfolio — a
  // diagram of a concept, not a product screenshot. Screens arrive later.
  images: [
    { id: 'IZAK_scr_dashboard', status: 'received', ext: 'jpg', feature: 'final TV home dashboard', alt: 'The final iZak TV dashboard: energy consumption, all devices, cameras, running playbooks and an Updating row showing firmware rollouts', caption: 'The final home dashboard.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_filter', status: 'received', ext: 'jpg', feature: 'devices grid with filters', alt: 'The Devices screen filtered by device type, with curtains, blinds, thermostat and light cards and a turn-all-on-or-off switch', caption: 'Devices, filtered by type.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_spaces', status: 'received', ext: 'jpg', feature: 'spaces overview', alt: 'The Spaces screen with floor and group filters and room cards for living room, bedroom, washroom and garage', caption: 'Spaces: floors, groups and rooms at once.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_blinds1', status: 'received', ext: 'jpg', feature: 'device detail with version history', alt: 'Blinds device detail: last used, the next scheduled playbook, warranty, IP and MAC address, with Version History and Update Device buttons', caption: 'The receipt: version history and update.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_onboard21', status: 'received', ext: 'jpg', feature: 'sign up by QR', alt: 'Onboarding step 1 of 5: a QR code to sign up on the phone, beside an email, phone and password form', caption: 'Sign up by QR.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_onboard24', status: 'received', ext: 'jpg', feature: 'inline password validation', alt: 'The sign-up form showing password rules checked inline as the user types', caption: 'Inline validation.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_onboard22', status: 'received', ext: 'jpg', feature: 'personal details', alt: 'Onboarding step 2 of 5: personal details form beside a QR code to continue on the phone', caption: 'Personal details.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_onboard11', status: 'received', ext: 'jpg', feature: 'add spaces', alt: 'Onboarding step 3 of 5: predefined spaces such as living room, studio and kid’s room, plus create new', caption: 'Add your spaces.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_onboard12', status: 'received', ext: 'jpg', feature: 'device scanning opt-in', alt: 'Onboarding step 4 of 5: choosing whether iZak keeps an eye out for new devices automatically', caption: 'Watch for new devices.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_onboard13', status: 'received', ext: 'jpg', feature: 'devices found', alt: 'Onboarding step 5 of 5: three devices found and ready to configure', caption: 'Devices found.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_onboard27', status: 'received', ext: 'jpg', feature: 'name a space', alt: 'A dialog to name a new space, with a QR code to add your own photo from the phone', caption: 'Name the space.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_spaces1', status: 'received', ext: 'jpg', feature: 'add new space', alt: 'Add New Space: name, photo, devices assigned by type, and the floor it belongs to', caption: 'Assign its devices.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_spaces1b', status: 'received', ext: 'jpg', feature: 'space created', alt: 'Confirmation that the new bedroom space has been created with its devices', caption: 'Space created.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_blinds', status: 'received', ext: 'jpg', feature: 'blinds control', alt: 'Blinds control with preset positions and up and down controls', caption: 'Direct control.', tags: ['screen', 'TV'] },
    { id: 'IZAK_scr_newdevice', status: 'received', ext: 'jpg', feature: 'new device detail', alt: 'A new device detail screen with a new-update-available badge, rename and add-to-space options', caption: 'A new device, update waiting.', tags: ['screen', 'TV'] },
    { id: 'IZAK_hero_01', status: 'received', ext: 'svg', highlight: true, feature: 'TV-first smart home', alt: 'Illustration of a living room: a wall-mounted TV showing a dark home dashboard of eight cards, a sofa in front of it, and a phone showing the companion app', caption: 'The home, run from the shared screen.', tags: ['illustration', 'smart home', 'TV'] },
    { id: 'IZAK_broadcast_01', status: 'received', ext: 'svg', highlight: true, feature: 'broadcast vs per-device updates', alt: 'Diagram comparing two models: each device in a home fetching its own update from the internet, versus one broadcast tower reaching every home in range at once', caption: 'One device at a time, or every home at once.', tags: ['diagram', 'broadcast', 'OTA'] },
    { id: 'IZAK_blueprint_01', status: 'received', ext: 'svg', highlight: true, feature: 'service blueprint summary', alt: 'Service blueprint summary across journey stages from store to updates, with rows for effort, channels and actors; effort peaks at sign-in and at authoring automations', caption: 'The journey, its channels, its actors, and where effort peaks.', tags: ['service blueprint', 'journey', 'research'] },
    { id: 'IZAK_split_01', status: 'received', ext: 'svg', highlight: true, feature: 'TV and phone division of labour', alt: 'Diagram of the division of labour: the TV for understanding and running the home, the phone for setting up and acting in the moment, joined by one home profile', caption: 'The couch and the pocket.', tags: ['diagram', 'TV', 'mobile'] },
    { id: 'IZAK_dashboard_01', status: 'received', ext: 'svg', feature: 'ten-foot home dashboard schematic', alt: 'Schematic of the TV home dashboard: eight cards read against four questions: what is it costing, what is it doing, is it safe, and what needs me', caption: 'Eight cards, four questions.', tags: ['wireframe', 'dashboard'] },
    { id: 'IZAK_model_01', status: 'received', ext: 'svg', feature: 'Devices, Spaces, Playbooks', alt: 'Diagram of the home model: devices placed in spaces such as the living room, bedroom and entrance, with a playbook coordinating them on a schedule', caption: 'Two nouns and a verb.', tags: ['diagram', 'information architecture'] },
    { id: 'IZAK_update_01', status: 'received', ext: 'svg', feature: 'update trust path', alt: 'Flow of an update: broadcast sent; received and installed when not in use, or missed and retried over Wi-Fi with a visible retry; both ending current with a receipt logged', caption: 'Every path ends with a receipt.', tags: ['flow', 'OTA', 'trust'] },
    { id: 'IZAK_ecosystem_01', status: 'received', ext: 'svg', highlight: true, feature: 'platform ecosystem canvas', alt: 'Ecosystem canvas with iZak at the centre, surrounded by those who govern, supply, consume, extend and own the platform', caption: 'Who governs, supplies, consumes, extends and owns.', tags: ['platform', 'ecosystem', 'strategy'] },
    { id: 'IZAK_sb_01', status: 'received', ext: 'svg', feature: 'storyboard: Mo home screen', alt: 'Storyboard frame: a family on the sofa with the TV showing Mo’s home screen', caption: 'An ordinary evening.', tags: ['storyboard', 'Mo'] },
    { id: 'IZAK_sb_02', status: 'received', ext: 'svg', feature: 'storyboard: iZak card in Mo', alt: 'Storyboard frame: an iZak card appears in Mo’s updates row on the TV', caption: 'The home taps in.', tags: ['storyboard', 'Mo'] },
    { id: 'IZAK_sb_03', status: 'received', ext: 'svg', feature: 'storyboard: hand-off to iZak', alt: 'Storyboard frame: iZak opens on the TV at the relevant place', caption: 'Straight to the answer.', tags: ['storyboard', 'iZak'] },
    { id: 'IZAK_sb_04', status: 'received', ext: 'svg', feature: 'storyboard: run a playbook', alt: 'Storyboard frame: the room dims as a playbook runs, and the TV returns to the film', caption: 'One press, back to the film.', tags: ['storyboard', 'playbook'] },
    { id: 'IZAK_sb_05', status: 'received', ext: 'svg', feature: 'storyboard: ambient home map', alt: 'Storyboard frame: an idle TV shows a living map of the home with an event callout', caption: 'When nobody is watching.', tags: ['storyboard', 'ambient'] },
  ],
}

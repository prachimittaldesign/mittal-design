import type { RichCaseStudy } from '../caseStudyTypes'

// Revee & Mo — rich case-study content (portfolio-schema v0.1, session 7).
// Source: revee.json + manifest.json (captions/alt). All 29 screenshots
// received and living in public/IMAGES/Revee-Mo/. This study covers TWO apps:
// Mo (the community TV home screen) and Revee (the streaming / EPG app with
// non-interruptive companion advertising). aiLayer is intentionally null — the
// renderer skips that section.
// The competitor matrix was re-verified Jul 2026 against vendor announcements:
// Samsung has since shipped interactive TV Plus ads (with Amazon Ads) and runs
// an ACR data business across ~77M TVs, and Apple's 'Up Next' spans apps — so
// interactivity, advertiser insight, and cross-app continuity are no longer
// Mo/Revee-only. The community home screen, hyper-local intelligence, and
// non-interruptive companion advertising rows remain unmatched.

export const REVEE_CASE_STUDY: RichCaseStudy = {
  meta: {
    slug: 'revee',
    name: 'Revee & Mo',
    category: 'Smart TV · TV SuperApps',
    role: 'Product Designer, end-to-end',
    ownershipType: 'lead',
    year: '2024',
    timeline: 'Nov 2023 – Jun 2024',
    status: 'Showcased at CES 2024 · final handoff complete',
    liveUrl: '',
    featured: true,
  },
  imageBase: '/IMAGES/Revee-Mo',

  hero: {
    eyebrow: 'Smart TV · Lean-Back UX · CES 2024',
    title: 'Revee & Mo',
    tagline: 'The TV home screen, reclaimed for the community.',
    cta: { label: 'View live', url: '' },
    image: 'REV_mohome_01',
  },

  highlights: [
    {
      kicker: 'The problem',
      title: 'The TV home screen belongs to OEMs, not you.',
      body: 'Samsung, LG, and TCL shape the default TV experience around global content aggregation. Local communities have no presence on the most prominent screen in the home.',
    },
    {
      kicker: 'The other problem',
      title: "TV advertising interrupts. It doesn't inform.",
      body: 'Pre-roll, mid-roll, and banner ads break the viewing experience — while broadcasters still need deeper targeting insight.',
    },
    {
      kicker: 'Mo',
      title: 'A home screen that knows where you live.',
      body: 'Location-aware, community-first — hyper-local events, advisories, and real-time updates, and a launchpad into the whole 12-app ecosystem.',
    },
    {
      kicker: 'Revee',
      title: 'Streaming with companion ads, not interruptions.',
      body: 'Full-screen content stays full-screen. Ads sit beside the stream, contextually relevant, never over it.',
    },
    {
      kicker: 'Lean-back, remote-first',
      title: 'Built for 8-10 feet and a d-pad.',
      body: 'Every screen designed for legibility at distance and navigation with up/down/left/right/select — nothing assumes a pointer.',
    },
    {
      kicker: 'The outcome',
      title: 'Showcased at CES 2024, Las Vegas.',
      body: 'Two apps, end-to-end, inside a 12-app TV ecosystem (MIAs) — designed for dual-market deployment across India and the USA.',
    },
  ],

  figures: {
    eyebrow: 'Why television',
    headline: 'Why a community belongs on the biggest screen.',
    lead:
      'Two things make a 12-app civic ecosystem on TV possible — and both shaped every decision in Mo and Revee.',
    items: [
      {
        kind: 'broadcast',
        title: 'One signal, every home.',
        body: "NextGenTV (ATSC 3.0) lets app data ride alongside the video on a single broadcast — at zero per-user delivery cost — and adds a broadband return path so the TV can answer back. That economics is what lets local institutions reach every household on the most prominent screen in the home.",
      },
      {
        kind: 'leanback',
        title: 'The couch is not a pocket.',
        body: 'A phone is at arm’s length, typed on, and private. A television is across the room, driven by five keys, and shared by the whole household. Every Mo and Revee screen is built for that reality — legible at distance, navigable by d-pad, and safe to show to everyone in the room.',
      },
    ],
  },

  closerLook: {
    themes: [],
    items: [
      { image: 'REV_momap_01', caption: "Mo's community map — badges, presence, and local activity, filterable by reward type." },
      { image: 'REV_moprofile_01', caption: 'Multi-user profiles — the TV is a shared device, so identity comes first.' },
      { image: 'REV_moavatar_01', caption: 'Avatar selection — personality without a keyboard.' },
      { image: 'REV_mostoryboard_01', caption: 'Storyboarding — compose your own home layout from apps, widgets, and photos.' },
      { image: 'REV_moambient_01', caption: "Ambient Mode — the TV becomes art when nobody's watching." },
      { image: 'REV_mocalendar_01', caption: "Mo's calendar — Day / Week / Month, with community alerts layered right in." },
      { image: 'REV_morewards_01', caption: "Mo's rewards system — badges, points, and in-progress quests." },
      { image: 'REV_epg_02', caption: "Revee's program guide grid — channels, time slots, and what's on next." },
    ],
  },

  flagship: {
    eyebrow: 'The idea',
    headline: 'Non-interruptive companion advertising.',
    lead:
      'Television advertising is built on a bad trade: reach, in exchange for breaking the thing people are watching. Revee refuses the trade. **Content stays full-screen.** Ads appear as a **contextual companion element** beside the stream — sized and positioned to be visible **without ever covering what\'s playing**.',
    stats: [
      { num: '2', label: 'apps owned end-to-end (Mo + Revee)' },
      { num: '12-app', label: 'MIAs ecosystem, showcased at CES 2024' },
    ],
    image: 'REV_bannerad_01',
    modal: {
      title: 'How companion advertising works',
      image: 'REV_interactivead_01',
      sections: [
        {
          heading: "The 'Hunger Handoff' example",
          body: "During Sunday NFL Countdown, a Snickers 'Hunger Handoff' companion campaign appears beside the broadcast — never overlapping the live content — and can expand into an interactive poll ('Who won Super Bowl One?') that viewers can answer without leaving the stream.",
        },
        {
          heading: 'Opt-in, not imposed',
          body: "Viewers can engage with the companion ad — vote, tap through, learn more — without leaving the stream. It's an enhancement they choose, not an interruption they endure.",
        },
        {
          heading: 'The broadcaster side',
          body: 'Beyond viewer experience, the format gives broadcasters a deeper behavioral-insight layer for targeting, addressing the industry need for TV advertising to compete with digital-grade measurement.',
        },
      ],
    },
    diagrams: [
      {
        kind: 'besideNotOver',
        title: 'Beside, not over.',
        body: "Traditional TV advertising takes the screen. The companion format keeps the content full-screen and places the ad in a panel beside it — visible, contextual, but never covering what's playing.",
      },
      {
        kind: 'extendedPanel',
        title: "Killing the 'sticker' effect.",
        body: "A team call I helped shape on the rendering side: rather than dropping a creative onto a clashing panel, the ad's dominant colour is pulled into a full-width background — so it reads as part of the broadcast, not a sticker slapped on top.",
      },
    ],
  },

  metrics: [
    { num: '2', label: 'apps owned end-to-end' },
    { num: '12-app', label: 'MIAs ecosystem at CES 2024' },
    { num: '2', label: 'markets — India + USA' },
    { num: '10 ft', label: 'lean-back viewing distance, designed for' },
    { num: '1', label: 'remote, d-pad only' },
    { num: 'CES', label: '2024 showcase, Las Vegas' },
  ],

  designSystem: {
    eyebrow: 'The visual system',
    headline: 'Built within Mobius, extended for TV.',
    lead:
      'Not a from-scratch system — a **disciplined extension**. Mo and Revee sit inside the Mobius design system, with **TV-specific additions** for a lean-back, 10-foot, remote-first context: typography, focus states, and a dark theme tuned for living-room panels.',
    cards: [
      { title: '10-foot typography', body: 'High-contrast type sized and weighted for legibility at 8-10 feet — no assumption of close reading.', image: 'REV_mohome_01' },
      { title: 'Community-driven UI', body: 'Badges, quests, and map presence make Mo feel alive — a shared space, not just a settings menu.', image: 'REV_morewards_01' },
      { title: 'Dark, panel-tuned theme', body: 'Optimized for living-room ambient conditions and OLED/LED panel characteristics, minimizing eye strain over long sessions.', image: 'REV_mocalendar_01' },
    ],
    modal: null,
  },

  // aiLayer intentionally null — Revee & Mo has no AI layer; the renderer skips it.

  process: {
    eyebrow: 'Process',
    headline: 'From OEM audit to CES stage.',
    lead:
      'Six months, end-to-end ownership of IA, flows, and UI for two apps — grounded in research most TV products skip: how people actually behave 8 feet from a screen, remote in hand.',
    steps: [
      { no: '01', title: 'Discover', body: 'Audited OEM home screens (Samsung, LG, TCL) and TV-advertising models — including the NFL × Snickers companion-ad approach — plus 10-foot UX standards and the cross-app continuity gap.' },
      { no: '02', title: 'Define', body: 'Three personas: the resident, the passive viewer, the broadcaster — each pulling the design in a different direction.' },
      { no: '03', title: 'IA', body: "Reframed TV advertising from interruption to companion; structured Mo's home screen around greeting, hero content, timeline, and continuity." },
      { no: '04', title: 'Design', body: 'Full UI for both apps — lean-back layouts, remote-first interaction, dark theme, community/rewards system, and the companion-ad format.' },
      { no: '05', title: 'Validate', body: 'Tested against 10-foot UX standards and remote-control constraints before final handoff.' },
      { no: '06', title: 'Handoff', body: 'Annotated Figma within the Mobius system; assets prepped for the CES 2024 demo and the Nexus Connect partnership handoff.' },
    ],
    modal: {
      title: 'Reframing TV advertising',
      image: null,
      sections: [
        {
          heading: 'Three personas, one screen',
          body: "The resident wants local relevance. The passive viewer wants continuity across services. The broadcaster wants targeting depth. Mo's home screen had to serve all three without becoming cluttered.",
        },
        {
          heading: 'The before/after',
          body: 'Before: TV advertising as a tax on attention — interruptive, untargeted, resented. After: advertising as a companion — contextual, opt-in, and measurable, without ever taking over the screen.',
        },
      ],
    },
  },

  interactions: {
    eyebrow: 'The details',
    headline: 'Designed for a d-pad, not a pointer.',
    cards: [
      { title: 'Storyboard your own home', body: 'Rather than accept a fixed layout, users compose the home screen themselves — choosing among app, widget, and photo layouts, then tuning brightness, auto-off, and transitions.', image: 'REV_mostoryboard_01' },
      { title: 'Ambient Mode', body: "When nobody's watching, the TV stops being a black rectangle — it becomes art, a photo, or a widget surface, tuned for a living room that's always in view.", image: 'REV_moambient_01' },
      { title: 'Profiles built for a shared screen', body: 'The TV is a household device, so Mo starts with identity — pick an account, choose an avatar, and the whole home screen personalizes around you.', image: 'REV_moprofile_01' },
      { title: 'Mo as the shell', body: "Mo isn't just a home screen — it's the entry point to the whole 12-app ecosystem. Click a community event and HEAR, Here! opens straight into the preview, ticketing and all, then hands an unfinished booking back to Mo as a continuity card.", image: 'REV_moevent_01' },
      { title: 'Pick up where you left off', body: "Cross-app continuity cards resume Netflix, a Sotheby's auction, or The Tonight Show — stitching fragmented apps into one flow.", image: 'REV_mohome_01' },
      { title: 'Switch channels, keep your place', body: 'A dedicated channel switcher — Back / Previous / Next — with live thumbnails, so browsing never loses the thread of what\'s playing.', image: 'REV_channelswitch_01' },
      { title: 'On-demand playback overlay', body: 'TV Guide, X-Ray, and Close surface only when summoned, staying out of the way of the content the rest of the time.', image: 'REV_playercontrols_01' },
    ],
    signatureFlow: [
      'Content plays full-screen',
      'Companion ad loads contextually',
      'Viewer selects to engage',
      'Interactive overlay appears',
      'Dismiss or convert',
    ],
  },

  gamification: {
    eyebrow: 'The rewards system',
    headline: 'Recognition that never manipulates.',
    lead:
      "Mo rewards real civic participation — reporting an issue, giving to a local cause, saving energy, showing up. The risk with any points system is that it curdles into a slot machine: streaks you can't miss, timers that pressure, rewards that hook. I mapped Mo's rewards against the **eight core drives of motivation** and drew a hard line — lean only on the drives that recognise genuine contribution, and refuse the ones that manufacture compulsion.",
    framework: 'Framework: Octalysis (Yu-kai Chou). The application, the cut, and the reasoning are mine.',
    drives: [
      // Authored clockwise from the top; the three refused sit toward the bottom.
      { name: 'Epic Meaning', used: true, note: 'Points attach to acts that matter — reporting, donating, conserving, participating — so the reward means something.' },
      { name: 'Accomplishment', used: true, note: 'A visible level and progress path; DoGooder points tally up as you contribute over time.' },
      { name: 'Empowerment', used: true, note: 'Quests suggest a next action but never require one — skipping costs nothing.' },
      { name: 'Ownership', used: true, note: 'A badge shelf on the profile: earned badges in colour, the rest visible but locked, so progress is yours to see.' },
      { name: 'Scarcity', used: false, note: 'No countdown timers on civic actions. Nothing here expires, so urgency is never manufactured.' },
      { name: 'Loss & Avoidance', used: false, note: 'No streaks, no decaying points. Missing a week never punishes you — participation stays voluntary.' },
      { name: 'Unpredictability', used: false, note: "No random reward drops. Every reward states its condition up front, so nothing nudges compulsive checking." },
      { name: 'Social Influence', used: true, note: 'Ambassador standing shows on the profile card, visible to everyone around the shared TV — recognition, not competition.' },
    ],
    caption:
      'The result is a system that makes contributing feel worthwhile on a screen the whole household shares — without borrowing the dark patterns that make people resent the apps on their phones.',
  },

  capabilities: {
    type: 'comparison',
    headline: 'Where Mo & Revee still lead.',
    note:
      "Re-verified Jul 2026, replacing the original ~2023-24 audit. The landscape moved: Samsung has since shipped remote-enabled interactive ads on TV Plus (built with Amazon Ads) and runs an industry-leading ACR data business across ~77M TVs, and Apple's 'Up Next' now spans apps — so interactivity, advertiser insight, and cross-app continuity are no longer Mo/Revee-only. What no mainstream platform has matched is the core thesis: a TV home screen built as a community and hyper-local intelligence hub. The 2026 OEM race is display tech and AI upscaling; 'local' still means local news channels, not neighborhood alerts, events, or neighbor presence. Companion advertising also holds: Samsung's ad units are home-screen placements and standard in-stream breaks, not ads running beside uninterrupted live content.",
    competitors: ['Mo / Revee', 'Samsung TV', 'Apple TV', 'YouTube TV', 'Traditional TV'],
    rows: [
      { feature: 'Community-first home screen', values: [true, false, false, false, false] },
      { feature: 'Hyper-local community intelligence (alerts, events, presence)', values: [true, false, false, false, false] },
      { feature: 'Non-interruptive companion advertising (beside live content)', values: [true, false, false, false, false] },
      { feature: 'Cross-app continuity', values: [true, true, true, false, false] },
      { feature: 'Interactive ad format', values: [true, true, false, true, false] },
      { feature: 'Broadcaster / advertiser behavioral insights', values: [true, true, false, true, false] },
    ],
  },

  techHandoff: {
    eyebrow: 'Craft & handoff',
    headline: 'Built for two markets, one system.',
    body: 'End-to-end design decisions made to survive both a CES demo floor and a real dual-market rollout.',
    items: [
      { title: 'Remote-first from the ground up', body: 'IA and navigation built around d-pad constraints — directional focus, not pointer assumptions.' },
      { title: 'Dual-market design', body: 'India and USA deployment considered from the first sketch — cultural and content localization built in, not bolted on.' },
      { title: 'TV ad-spec compliant', body: 'Designed to published television advertising UI standards for placement, sizing, and timing.' },
      { title: 'Handed off for partnership', body: 'Annotated Figma inside the Mobius system, with assets prepped for the CES 2024 demo and the Nexus Connect handoff.' },
    ],
    compliance: [],
    modal: null,
  },

  role: {
    role: 'Product Designer, end-to-end',
    ownershipType: 'lead',
    ownership: 'Owned IA, user flows, and final UI for both Mo and Revee through handoff.',
    timeline: 'Nov 2023 – Jun 2024',
    team: 'End-to-end ownership within the Mobius design system; part of the 12-app MIAs ecosystem',
    tools: ['Figma', 'Mobius Design System'],
    responsibilities: [
      'Information architecture (both apps)',
      'User flows',
      'Lean-back / 10-foot UI design',
      'Remote-control interaction model',
      'Companion advertising system',
      'Mo as ecosystem shell (app launch & cross-app continuity)',
      'Community & rewards system (Mo)',
      'Profiles, storyboarding & Ambient Mode (Mo)',
      'Dual-market design (India + USA)',
    ],
  },

  // Repo project ids (not content slugs) — Ved's repo id is 'paas'.
  related: ['paas', 'snaplogic'],

  images: [
    { id: 'REV_mohome_01', status: 'received', highlight: true, feature: 'Mo home screen', alt: "Mo's TV home screen — 'Welcome David!' with location-aware weather, a hero content card, the daily timeline, 'Updates for you', continuity cards, and the apps row", caption: "Mo's home screen.", tags: ['Mo', 'home screen', 'community', 'personalization', 'timeline', 'continuity'] },
    { id: 'REV_momap_01', status: 'received', highlight: true, feature: 'Mo community map', alt: "Mo's community map with a badge filter (Eco Champion, Frequent Flyer, Level Up, Heart of Gold) and neighbor presence pins across New York City", caption: 'The community map.', tags: ['Mo', 'map', 'community', 'badges', 'presence'] },
    { id: 'REV_epg_01', status: 'received', highlight: true, feature: 'Revee EPG (full)', alt: "Revee's Electronic Program Guide — live preview, show details, timeline scrubber, and a channel category rail", caption: 'The full EPG experience.', tags: ['Revee', 'EPG', 'channels', 'timeline', 'guide'] },
    { id: 'REV_bannerad_01', status: 'received', highlight: true, feature: 'companion banner ad', alt: "A 'Hunger Handoff' Snickers companion banner ad positioned beside full-screen NFL content in Revee, never covering the broadcast", caption: 'Non-interruptive companion advertising.', tags: ['Revee', 'advertising', 'companion ad', 'non-interruptive'] },
    { id: 'REV_interactivead_01', status: 'received', highlight: true, feature: 'interactive ad format', alt: "An interactive companion ad in Revee expanding into a poll — 'Who won Super Bowl One?' — that viewers can answer without leaving the stream", caption: 'An interactive companion ad.', tags: ['Revee', 'advertising', 'interactive', 'poll', 'engagement'] },
    { id: 'REV_moevent_01', status: 'received', highlight: true, feature: 'event preview (HEAR, Here! opened from Mo)', alt: 'The HEAR, Here! event app opened from Mo — an event preview with venue, pricing, and Book Tickets, launched straight from the community home screen', caption: 'The HEAR, Here! event app, opened from Mo.', tags: ['Mo', 'event preview', 'app launch', 'MIAs ecosystem', 'HEAR Here', 'community', 'shell'] },
    { id: 'REV_moprofile_01', status: 'received', highlight: true, feature: 'profile / account selection', alt: "Mo's 'Choose an account' screen with household profiles and an Add user option — built for a shared TV", caption: 'Profiles for a shared screen.', tags: ['Mo', 'profile', 'accounts', 'multi-user', 'onboarding', 'household'] },
    { id: 'REV_mostoryboard_01', status: 'received', highlight: true, feature: 'storyboarding (layout composition)', alt: "Mo's storyboarding screen — 'Select layout to continue' — letting users compose their home screen from app, widget, and photo layouts", caption: 'Storyboarding your own home screen.', tags: ['Mo', 'storyboarding', 'layout', 'customization', 'widgets', 'composition'] },
    { id: 'REV_moambient_01', status: 'received', highlight: true, feature: 'Ambient Mode', alt: "Mo's Ambient Mode picker — switching the idle TV into artwork, photography, or a widget surface", caption: 'Ambient Mode.', tags: ['Mo', 'ambient mode', 'idle state', 'art', 'photo', 'living room'] },

    { id: 'REV_mocalendar_01', status: 'received', feature: 'Mo calendar', alt: "Mo's calendar with Day / Week / Month views, showing a community alert and scheduled events across the month", caption: "Mo's calendar.", tags: ['Mo', 'calendar', 'schedule', 'alerts'] },
    { id: 'REV_motimeline_01', status: 'received', feature: 'daily timeline row', alt: "Mo's horizontal daily timeline of icons and times, from a community alert to The Tonight Show to Sotheby's", caption: 'The daily timeline.', tags: ['Mo', 'timeline', 'schedule', 'icons'] },
    { id: 'REV_moalert_01', status: 'received', feature: 'community alert card', alt: 'A community advisory alert card in Mo, with location detail', caption: 'A community alert card.', tags: ['Mo', 'alert', 'community', 'safety'] },
    { id: 'REV_morewards_01', status: 'received', feature: 'rewards & quests', alt: "Mo's 'All rewards' screen with a points map, earned badges, and in-progress quests with point values", caption: 'Rewards and quests.', tags: ['Mo', 'rewards', 'badges', 'quests', 'gamification'] },
    { id: 'REV_morewards_02', status: 'received', feature: 'rewards badges', alt: "Mo's 'All rewards' screen focused on earned badges and total points", caption: 'Earned badges.', tags: ['Mo', 'rewards', 'badges', 'points'] },
    { id: 'REV_morewardsearch_01', status: 'received', feature: 'badge search', alt: "Searching for a badge by name ('Eco Champion') in Mo's rewards system", caption: 'Searching for a badge.', tags: ['Mo', 'rewards', 'search', 'badges'] },
    { id: 'REV_molevelup_01', status: 'received', feature: 'level-up celebration', alt: "A 'Congratulations! You just levelled up' celebration card in Mo's rewards system", caption: 'A level-up celebration.', tags: ['Mo', 'rewards', 'celebration', 'gamification'] },
    { id: 'REV_moreminder_01', status: 'received', feature: 'rewards reminder nudge', alt: "A reminder nudge in Mo: 'Set reminder for your favourite show to earn rewards!'", caption: 'A rewards reminder nudge.', tags: ['Mo', 'reminder', 'rewards', 'nudge'] },
    { id: 'REV_channelswitch_01', status: 'received', feature: 'channel switcher', alt: "Revee's channel switcher with Back / Previous / Next controls and live channel thumbnails (CNBC, CNN, HBO)", caption: 'Switching channels.', tags: ['Revee', 'channel switching', 'navigation', 'd-pad'] },
    { id: 'REV_epg_02', status: 'received', feature: 'EPG grid detail', alt: "A detail view of Revee's program guide grid across ESPN, CNN, and CNBC with live time markers", caption: 'The program guide grid.', tags: ['Revee', 'EPG', 'guide grid', 'channels'] },
    { id: 'REV_reminder_01', status: 'received', feature: 'show reminder modal', alt: "Revee's 'Set a Reminder' modal with send-reminder timing, auto-tune, and confirm options over a program guide background", caption: 'Setting a show reminder.', tags: ['Revee', 'reminder', 'scheduling', 'modal'] },
    { id: 'REV_reminder_02', status: 'received', feature: 'show reminder modal (alt)', alt: "An alternate rendering of the 'Set a Reminder' modal", caption: 'An alternate reminder-modal state.', tags: ['Revee', 'reminder', 'scheduling', 'modal'] },
    { id: 'REV_xray_01', status: 'received', feature: 'X-Ray cast info', alt: "Revee's X-Ray panel showing supporting cast information over a live ESPN broadcast", caption: 'X-Ray cast information.', tags: ['Revee', 'X-Ray', 'cast info', 'overlay'] },
    { id: 'REV_playercontrols_01', status: 'received', feature: 'minimal playback overlay', alt: "Revee's minimal on-demand playback overlay with X-Ray and Close controls during live playback", caption: 'The minimal playback overlay.', tags: ['Revee', 'overlay', 'playback controls', 'minimal UI'] },
    { id: 'REV_tvguide_01', status: 'received', feature: 'TV Guide overlay hint', alt: "Revee's TV Guide overlay control shown alongside Sunday NFL Countdown", caption: 'The TV Guide entry point.', tags: ['Revee', 'TV guide', 'overlay', 'navigation'] },
    { id: 'REV_companionad_01', status: 'received', feature: 'companion ad (Burger King)', alt: 'A Burger King companion ad positioned beside live ESPN content in Revee', caption: 'A companion ad example.', tags: ['Revee', 'advertising', 'companion ad', 'example'] },
    { id: 'REV_companionad_02', status: 'received', feature: 'companion ad (Nike)', alt: "A Nike companion ad with a 'store near you' call-to-action over Revee playback", caption: 'A location-aware companion ad example.', tags: ['Revee', 'advertising', 'companion ad', 'example', 'location-aware'] },
    { id: 'REV_moevent_02', status: 'received', feature: 'event continuity card (continue booking)', alt: "A 'Continue booking' card for a community event — cross-app continuity carrying an unfinished booking back to Mo", caption: 'An unfinished booking returns as a continuity card.', tags: ['Mo', 'continuity', 'booking', 'cross-app', 'HEAR Here'] },
    { id: 'REV_moavatar_01', status: 'received', feature: 'avatar selection', alt: "Mo's 'Choose an avatar for your profile' screen with 3D character options, navigable by remote", caption: 'Choosing an avatar.', tags: ['Mo', 'avatar', 'profile', 'onboarding', 'personalization'] },
    { id: 'REV_moconfigure_01', status: 'received', feature: 'ambient / layout configuration', alt: "Mo's configuration screen for brightness, widget visibility, auto-turn-off, and notifications in ambient/storyboard mode", caption: 'Configuring ambient mode.', tags: ['Mo', 'configuration', 'settings', 'ambient mode', 'brightness'] },
  ],
}

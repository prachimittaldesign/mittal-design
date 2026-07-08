import type { CaseStudy } from '../types'
import type { LockedPayload } from '../types'
import { VED_CASE_STUDY } from './projects/ved'

// NODE-ONLY. This module is imported solely by scripts/seoPlugin.ts at build
// time to produce the encrypted blobs in dist/locked/. It is NEVER imported by
// any client module, so this plaintext never enters the browser bundle.

const SNAPLOGIC: CaseStudy = {
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
    }

const REVEE: CaseStudy = {
      role: 'Product Designer — end-to-end',
      timeline: 'Nov 2023 – Jun 2024',
      platform: 'Smart TV · 10-foot UI',
      context: 'Showcased at CES 2024, Las Vegas',
      summary:
        'Two apps that reclaim the TV home screen for local communities and replace interruptive advertising with contextual companion experiences — part of a 12-app MIAs suite shown at CES 2024 and handed off to Nexus Connect for partnership.',
      metric: { value: 'CES 2024', label: 'showcased · Las Vegas' },
      tldr: {
        what: 'Mo — a community super app making the TV home screen a local intelligence hub. Revee — adaptive streaming where ads companion the content instead of interrupting it.',
        who: 'Local community residents wanting a useful home screen; passive viewers tired of forced ads; broadcasters needing richer behavioral targeting.',
        how: 'End-to-end ownership of IA, user flows, and UI for both apps — all built around d-pad remote-first interaction, dark OLED-optimized visuals, and 10-foot legibility standards.',
      },
      stats: [
        { value: '2 apps', label: 'Mo + Revee, fully owned end-to-end' },
        { value: '12-app', label: 'MIAs ecosystem at CES 2024' },
        { value: 'India + USA', label: 'dual-market deployment' },
        { value: '10 ft', label: 'lean-back UX, d-pad remote only' },
      ],
      problem:
        'TV home screens are controlled by Samsung, LG, and TCL — shaped around their own ecosystems and global content aggregation. Local communities, regional organizations, and contextual services have no presence on the most prominent multimedia screen in the home.\n\nSimultaneously, television advertising remains interruptive — pre-roll, mid-roll, and banner overlays that break the viewing experience and feel like a penalty for watching. Broadcasters lack behavioral depth for effective targeting, and viewers have no way to engage without leaving the stream.',
      comparison: {
        title: 'What makes the MIAs approach different',
        columns: ['Mo / Revee', 'Samsung TV', 'Apple TV', 'YouTube TV', 'Traditional TV'],
        rows: [
          { label: 'Community-first home screen', cells: [true, false, false, false, false] },
          { label: 'Hyper-local real-time content', cells: [true, false, false, false, false] },
          { label: 'Cross-app "pick up where you left off"', cells: [true, false, false, false, false] },
          { label: 'Non-interruptive companion ads', cells: [true, false, false, false, false] },
          { label: 'Interactive ad (no stream pause)', cells: [true, false, false, false, false] },
          { label: 'Broadcaster behavioral insights', cells: [true, false, false, true, false] },
        ],
        caption: 'Community presence on the TV home screen and non-interruptive companion advertising are unmatched across Samsung, Apple TV, YouTube TV, and traditional linear broadcasting.',
      },
      research: [
        {
          label: 'OEM home screen audit',
          body: 'Benchmarked Samsung Tizen, LG webOS, and TCL home screens. All prioritize OEM content aggregation — local events, advisories, and community services are completely absent.',
        },
        {
          label: 'TV advertising model analysis',
          body: 'Traditional pre-roll and mid-roll ads create viewer resentment. Studied companion banner formats from sports broadcasting — the NFL + Snickers model showed non-interruptive placement is viable.',
        },
        {
          label: 'Lean-back UX standards',
          body: '10-foot UI principles: 60px+ type at distance, d-pad directional constraints, high-contrast focus states, and minimal cognitive load for passive consumption contexts.',
        },
        {
          label: 'Cross-app continuity gap',
          body: 'Users switch between Netflix, NBC, and Sotheby\'s but the TV has no memory across apps. "Pick up where you left off" across app boundaries was Mo\'s defining insight.',
        },
      ],
      users: [
        {
          role: 'Community resident',
          description: 'Wants the TV to surface what\'s relevant to their day — road closures, local events, fundraising updates — without switching apps or checking their phone.',
          needs: 'Hyper-local, real-time community intelligence on the home screen without active search.',
        },
        {
          role: 'Passive TV viewer',
          description: 'Watching live TV or streaming. Frustrated by pre-roll and mid-roll ads that force a pause. Will engage with relevant content but won\'t tolerate forced interruption.',
          needs: 'Uninterrupted viewing with opt-in access to ads that feel contextual — never forced.',
        },
        {
          role: 'Broadcaster / Advertiser',
          description: 'Needs to reach audiences effectively without destroying brand perception. Wants behavioral engagement data that traditional linear TV simply cannot provide.',
          needs: 'A contextual ad format that preserves viewer goodwill while generating measurable interaction signals.',
        },
      ],
      process: [
        { phase: 'Discover', body: 'Audited Samsung, LG, and TCL home screens; mapped TV ad formats; studied 10-foot UI standards and d-pad constraints.' },
        { phase: 'Define', body: 'Scoped two distinct app roles: Mo as the community home screen shell, Revee as the streaming and advertising experience accessible from it.' },
        { phase: 'IA', body: 'Mapped Mo\'s home screen hierarchy (greeting → hero → timeline → updates → continuity → apps) and Revee\'s content-first layout with companion ad zones.' },
        { phase: 'Design', body: 'Built full Figma flows — dark OLED-optimized theme, TV-spec typography, focus states, EPG, interactive ad unit, and the full MIAs app launcher.' },
        { phase: 'Validate', body: 'Reviewed d-pad navigation at simulated 10-foot distance; iterated focus states and text scale to meet lean-back legibility standards.' },
        { phase: 'Handoff', body: 'Annotated Figma delivery within Mobius design system; prepared assets for CES 2024 demo showcase and Nexus Connect partnership handoff.' },
      ],
      anatomy: {
        title: 'Anatomy of the Mo home screen',
        caption: 'Every row answers a different question: "What\'s happening now?" (context), "What matters in my community?" (feed), "Where was I?" (continuity).',
        panels: [
          {
            label: 'Greeting & Context',
            role: 'Top — location awareness',
            items: ['Personalized welcome ("Welcome David!")', 'Location: Lower Manhattan, NYC', 'Live weather, time, and date', 'TV becomes a contextually intelligent device'],
          },
          {
            label: 'Community Feed',
            role: 'Middle — local intelligence',
            items: ['Hero card: curated local story', 'Daily timeline: scrollable schedule', '"Updates for you": real-time alerts', 'Road closures, events, advisories'],
          },
          {
            label: 'Continuity & Apps',
            role: 'Bottom — cross-app layer',
            items: ['"Pick up where you left off"', 'Netflix, NBC, Sotheby\'s continuity', 'App launcher: full MIAs suite', 'Mo as the navigational shell'],
          },
        ],
      },
      approach: [
        {
          title: 'Mo — community home screen',
          body: 'Location-aware personalization from the first frame: greeting, weather, and date establish context. A hero card surfaces curated local stories; a horizontal daily timeline shows scheduled events; "updates for you" extends the TV from entertainment into household awareness.',
        },
        {
          title: 'Revee — companion advertising',
          body: 'Content plays full-screen; UI retreats to a thin bottom bar. Companion banner ads appear contextually beside — not over — the stream (NFL broadcast → sports-themed Snickers campaign). Viewers engage or dismiss; the content never pauses.',
        },
        {
          title: 'Cross-app continuity',
          body: '"Pick up where you left off" stitches Netflix, NBC, and Sotheby\'s into a single resumable flow on the Mo home screen — the first time these fragmented services appear as one continuous experience on TV.',
        },
        {
          title: 'Remote-first interaction model',
          body: 'Every screen built around d-pad constraints — directional navigation flows, visible focus states, and selection patterns that feel natural from 8–10 feet. No gesture, no pointer, no text input assumed anywhere in the flow.',
        },
        {
          title: 'EPG — Electronic Programme Guide',
          body: 'Timeline-based programme guide for live and scheduled content. Focus states scale the active tile for 10-foot legibility; left/right remote buttons drive smooth horizontal scrolling across channels.',
        },
        {
          title: 'Interactive ad format',
          body: 'An opt-in overlay that lets brands go deeper — product details, save-to-wishlist, QR to phone — while content continues in the background. Advertising becomes an enhancement and generates measurable engagement signals for broadcasters.',
        },
      ],
      flow: {
        title: 'Signature interaction — Revee companion ad',
        caption: 'The ad never pauses the content. Every interaction is opt-in and reversible — a viewer who ignores the banner loses nothing.',
        steps: [
          { title: 'Content plays', detail: 'Full-screen broadcast; UI retreats to a thin bottom bar.' },
          { title: 'Ad loads contextually', detail: 'Banner appears beside the stream, thematically matched to content genre.' },
          { title: 'Viewer selects', detail: 'D-pad focus moves to banner; viewer presses Select to engage.' },
          { title: 'Interactive overlay', detail: 'Product detail, save-to-wishlist, and QR appear — content continues.' },
          { title: 'Dismiss or convert', detail: 'Viewer exits overlay; stream resumes full-screen. No interruption.' },
        ],
      },
      beforeAfter: {
        title: 'Reframing TV advertising',
        caption: 'Pragmatic advertising: the viewer keeps control, the broadcaster gets engagement data, and the brand avoids the skip.',
        before: {
          label: 'Traditional interruptive model',
          points: [
            'Pre-roll or mid-roll: content stops',
            'Forced 15–30 second exposure',
            'No viewer agency or choice',
            'Brand associated with frustration',
            'No behavioral engagement signal',
          ],
        },
        after: {
          label: 'Revee companion model',
          points: [
            'Ad beside stream — content never pauses',
            'Viewer chooses to engage or ignore',
            'Interactive: details, wishlist, QR to phone',
            'Brand visible without creating resentment',
            'Rich behavioral signals for broadcasters',
          ],
        },
      },
      impact: [
        'Showcased at CES 2024, Las Vegas — validating market readiness for the full 12-app MIAs suite.',
        'Both apps handed off to Nexus Connect for partnership and commercial deployment.',
        'Mo serves as the navigational shell and platform layer that drives adoption of the entire MIAs ecosystem.',
        'End-to-end ownership: IA, user flows, and final UI for both Mo and Revee through handoff.',
        'Dual-market design (India + USA) built within Mobius\'s design system, with TV-specific extensions for lean-back UX.',
      ],
      reflection:
        'The hardest constraint was also the most clarifying: d-pad only, 10 feet away. Every design decision filtered through that lens — which meant information hierarchy had to be self-evident before any interaction. Mo\'s answer was to layer by temporal relevance: what\'s happening now, what matters today, where was I. That order felt obvious once the remote constraint removed everything a pointer and click could rescue.',
    }

export const LOCKED_CASE_STUDIES: Record<string, LockedPayload> = {
  paas: { kind: 'rich', data: VED_CASE_STUDY },
  snaplogic: { kind: 'standard', data: SNAPLOGIC },
  revee: { kind: 'standard', data: REVEE },
}

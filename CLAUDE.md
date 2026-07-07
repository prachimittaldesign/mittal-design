# mittal.design — Project Guide (CLAUDE.md)

This file is the durable memory for the repo: what the site **is**, what's **done**,
what's **pending**, and the **vision** behind it. Read it first when picking up work.

---

## 1. What this is

**mittal.design** is Prachi Mittal's portfolio, reimagined as an **explorable 3D city**.
Every building is a shipped design project; you walk the city, click a building, and a
full case study takes over the screen. It is a real, production website — not a demo —
and the owner reviews every change on her own phone and laptop.

**The one-line pitch:** *An explorable 3D portfolio city. Every building is a project.*

### Stack
- **React 18** + **TypeScript** + **Vite**
- **three.js** via **@react-three/fiber** (r3f) + **@react-three/drei** + **@react-three/postprocessing**
- **Tailwind** for the HUD / DOM overlay layer
- No backend. Everything is static; content lives in `src/data/*.ts`.

### Build & run
```bash
npm run dev      # vite dev server
npm run build    # tsc && vite build  (also runs the SEO prerender plugin)
npm run preview  # serve the production build
```
Dev-only URL overrides for testing: `?hour=<0-24>` (force time of day, `src/lib/sky.ts`),
`?weather=<condition>` (`src/lib/weather.ts`).

---

## 2. Architecture map

The app is a **thin shell** that lazy-loads a **heavy 3D experience**, with a **DOM HUD**
floating over the canvas and a **static prerendered layer** underneath for crawlers and
slow/broken loads.

```
index.html ──▶ src/main.tsx ──▶ src/App.tsx  (the shell, ~84KB)
                                   │
                                   ├─ routing /projects/:id ↔ overlay
                                   ├─ React.lazy(CityExperience)  ← the ~1.4MB three.js stack
                                   │     └─ Suspense fallback + WebGL check
                                   │           └─ no WebGL / error / slow → <Coverflow> (HTML gallery)
                                   └─ HUD overlay (DOM, Tailwind)
```

### Layers, from back to front
1. **Static / prerendered** (`scripts/seoPlugin.ts`) — real HTML for every project, plus
   `llms.txt`, sitemap, robots, JSON-LD, noscript reveal. Invisible to a normal visitor,
   essential for crawlers, AI assistants, and no-JS / slow connections.
2. **3D city** (`src/scene/`) — the canvas world, camera rig, day/night, weather.
3. **DOM HUD** (`src/components/`) — search, legend, layers control, map controls, music
   player, weather/clock, coachmarks, tooltips, the case-study takeover.
4. **Resilience gallery** (`src/components/Coverflow.tsx`) — an HTML coverflow that stands
   in for the canvas when WebGL is unavailable, the load errors, or the device is too slow.

### Key directories
- `src/scene/` — every 3D object is its own component (`Building`, `Landmark`, `Lighthouse`,
  `Pond`, `Rainbow`, `Aurora`, `Funfair`, `Roads`, `CoastEnvironment`, …). `CityWorld.tsx`
  composes them; `Scene.tsx` / `CameraRig.tsx` own the camera and view modes.
- `src/scene/lib/` — `cityModel` (building/landmark placement), `places.ts` (NLP search,
  position overrides), `iso.ts` helpers.
- `src/components/` — the DOM HUD and overlays.
- `src/lib/` — cross-canvas/DOM bridges and hooks (`markerStore`, `sky`, `weather`,
  `useLowFps`, `useIsMobile`, `coachAnchor`).
- `src/data/` — `projects.ts` (13 projects), `landmarks.ts` (6 civic landmarks), `music.ts`.
- `scripts/seoPlugin.ts` — the Vite build plugin that generates the static layer.

### Cross-canvas → DOM bridges (important pattern)
The canvas is WebGL; the HUD is DOM. To sync them at 60fps **without per-frame React
state**, we use **mutable module stores + requestAnimationFrame loops**:
- `src/lib/markerStore.ts` (`markerPositions`) — `MapMarkerProbe` (in-scene) writes each
  project's projected screen position every frame; `MapMarkers` (DOM) reads it in a rAF
  loop and sets `transform` directly. Panning the 2D map never touches React state.
- Same pattern for the building hover tooltip and the coachmark anchor.

---

## 3. The content model

- **13 projects** in `src/data/projects.ts`, each with a full case study structured as
  **Problem / Role / Process / Solution / Impact / Skills**, plus infographics
  (comparison tables, metric tiles, process steps, panel breakdowns).
- **Featured (star) projects:** `paas` (**Ved** — newest & tallest building, DITA CMS),
  `snaplogic` (enterprise docs, 40% fewer clicks), `revee` (**Revee & Mo** — smart-TV apps,
  CES 2024). These get the tallest buildings, gold star pins, and pulsing halos.
- **6 landmarks** in `src/data/landmarks.ts`: cinema (The Roxy), stadium (The Oval),
  library (Reading Room), gallery (The Annex), cafe (Now Brewing), music (The Shell).
  These are civic flavour, not projects.
- **NDA constraint:** case-study copy must not name client companies. Keep it to roles,
  outcomes, and abstractions. (Some display labels like "SnapLogic" are cleared; do not
  add new company names to case-study body copy.)

### The two views
- **3D** — the default cinematic cityscape. Low, filmic default camera angle.
- **2D (iso)** — a top-down, **game/Google-Maps-style map**: each building wears a big
  clickable pin (SVG glyph + name), quadrant-coloured, with a stem pointing at the
  building. Featured trio get gold stars; Ved carries a **NEW** badge and the largest pin.

---

## 4. Status — what's DONE

### Case studies & content
- ✅ Ved, Revee & Mo, SnapLogic and the rest built with explanatory **infographics**
  (the rule: visuals must *explain*, not decorate — Ved was reworked from "too much text"
  into comparison tables, metric tiles, and panel breakdowns).
- ✅ Image-loading bugs fixed.

### Onboarding
- ✅ First-visit **coachmark tour**, each step anchored to its real target element.
- ✅ **About-menu auto-peek** on every visit — and it finishes *before* the tour starts,
  so two popups never share the screen.

### The city (visuals)
- ✅ Pond reflection flicker fixed; pond beautified.
- ✅ Star buildings are tallest, **Ved tallest of all**.
- ✅ Diagonal roads completed to building entrances, with pavements.
- ✅ **Aurora** over the mountains at night — deliberately *subtle*.
- ✅ **Funfair life:** a turning **ferris wheel** on the beach headland (upright swinging
  gondolas, lamps that glow at night), a two-car **tram** circling the ring road (lit
  windows at night), and occasional **shooting stars** — all night-gated via `nightFactor()`.
- ✅ Rainbow, birds, campfires, marina/boats, clock tower, future bridge, city life, etc.

### 2D map
- ✅ Usable game-style map with big, clear, clickable icons; newest project highlighted.
- ✅ **`MapGlyph.tsx`** — one **stroke-based SVG icon set** (22 glyphs) for every pin and
  landmark, replacing platform-dependent emoji so the map looks identical on iOS/Android/
  desktop. `StarBadge` (gold SVG star) for featured pins.

### HUD & accessibility
- ✅ Legend + bottom control hint tuned for **readability** (final state: hint has no
  background — plain white text with a shadow). Accessibility was never compromised.
- ✅ **Tooltips** on every HUD micro-frontend *and* on buildings ("click to open"), via a
  singleton tooltip layer (`TooltipLayer.tsx`, `.tt-chip`, `data-tip` attributes).
- ✅ Cinematic default 3D camera angle (matched to owner's screenshot reference).

### Search
- ✅ **Natural-language search** (`src/scene/lib/places.ts` `interpretQuery`): e.g.
  "show me recent project" → flies to Ved. Enter executes. Functions as an NLP search.

### SEO / AI-crawlability / resilience  (`scripts/seoPlugin.ts`)
- ✅ **13 prerendered project pages** at `/projects/:id` with real HTML case-study content,
  a noscript reveal, and a seo-mirror.
- ✅ **Sitemap** (15 URLs), **robots.txt** with explicit allowances for GPTBot / ClaudeBot /
  PerplexityBot / CCBot, **404.html**.
- ✅ **JSON-LD**: Person, WebSite, CreativeWork (per project), BreadcrumbList.
- ✅ **`llms.txt`** — a markdown digest of the whole site (summary, featured case studies,
  all projects with links, about) generated from `PROJECTS` at build time so it never
  drifts; robots.txt points AI crawlers to it. **`humans.txt`** credits, linked via
  `<link rel="author">`.
- ✅ **Smooth loading:** `modulepreload` links for the `three` / `r3f` / `CityExperience`
  chunks injected into the index and all 13 project pages, so the 3D stack downloads in
  parallel with the shell.
- ✅ **Client routing** `/projects/:id` ↔ overlay, WebGL fallback → Coverflow, low-FPS
  prompt, a11y pass — **with zero visual change** to the live site.

### Resilience
- ✅ **HTML coverflow gallery** for slow / error / no-WebGL / laggy states, with proper
  error states (`Coverflow.tsx`, `SceneErrorBoundary.tsx`, `useLowFps.ts`).

### Mobile
- ✅ Fixed: 2D pin-name overlap (phones collapse plain pins to icon-only), search sitting
  behind the filters, gallery cards overlapping case-study text after clicking.

### Working method
- ✅ `.claude/skills/live-3d-portfolio-iteration/SKILL.md` — the distilled working method
  for this kind of live, owner-in-the-loop 3D-site iteration.

---

## 5. Status — what's PENDING / next candidates

Nothing is *broken* or half-finished as of the latest commit (`53ee3f3`). The following
are **opportunities**, not obligations — the owner drives priority:

- **Real-device polish pass** — the owner reviews on her own phone/laptop; expect small
  corrective rounds on spacing, tap targets, and legibility after each big change.
- **Performance headroom** — the three.js bundle is large (build warns on chunk size).
  Options: `manualChunks` tuning, deferring non-critical scene layers, texture budget.
- **Content** — new projects get added as new buildings; keep `projects.ts`, the city
  model placement, and the 2D glyph in sync when adding one.
- **Continued a11y / crawlability audits** as content grows.

> If you add a project: give it an entry in `src/data/projects.ts` (with a `glyph` name
> that exists in `MapGlyph.tsx`), place its building in `src/scene/lib/cityModel`, and the
> SEO plugin + llms.txt + sitemap will pick it up automatically on the next build.

---

## 6. The vision

**Make a portfolio that is an experience, not a PDF.** The city is the argument: breadth
of work shown as a skyline, depth shown by walking up to any building and reading the full
story. It should feel *alive* (weather, day/night, traffic, a funfair, an aurora) and
*inviting* (coachmarks, tooltips, a game-like map) so a visitor explores instead of
scanning.

Non-negotiables that define the vision:
- **Top-notch on every device.** Phone and desktop both get first-class treatment;
  loading must feel smooth even on a slow connection.
- **Usable, interactive, humanitarian.** Every interactive thing tells the user it's
  clickable. Accessibility is never traded for aesthetics.
- **Crawlable & AI-review-friendly.** Search engines and AI assistants can read the whole
  portfolio without executing WebGL — via prerendered pages, JSON-LD, and `llms.txt`.
- **Visually ecstatic, but never gaudy.** Effects are tuned *down* until they read as
  tasteful (the aurora, the legend glass, the hint background were all softened on note).
- **Consistent visual language.** One icon system, one set of design tokens, one feel.

---

## 7. Conventions & gotchas (read before you commit)

- **Branch:** work on `claude/keen-ride-34AKG`. Every commit is pushed to **both** the
  branch **and** `main` (`git push origin HEAD:main`) — the owner's convention.
- **Commit trailer:** end messages with the session URL line the repo has been using.
- **Verification without screenshots:** the owner's current directive is *don't take
  screenshots, push to main directly*. Verify with `tsc` + `vite build` + grepping the
  `dist/` output (e.g. confirm `llms.txt`, `humans.txt`, `modulepreload` count). Dark night
  screenshots were also being rejected by the image API — another reason to lean on build
  output over captures.
- **Ephemeral container:** the working tree can be **wiped on restart**. **Commit as soon
  as `tsc` passes** — uncommitted work has been lost this way.
- **Never chain `pkill … && git commit`** — a killed process yields exit 144 which silently
  eats the commit. Run `pkill` on its own line, then verify `git log`.
- **StrictMode:** don't ref-guard a mount effect whose cleanup cancels its own timers
  (it broke the auto-peek once). Prefer idempotent effects with real cleanup.
- **60fps canvas↔DOM sync:** use the mutable-store + rAF pattern, never per-frame
  `setState`.
- **Headless/SwiftShader testing** starves timers — instrument in-page before blaming app
  code; false "missing"/"not firing" failures usually mean the test env stalled, not a bug.

---

*Last updated: 2026-07-07. Latest commit at time of writing: `53ee3f3`
("AI-crawlable digest, consistent SVG map icons, funfair life, faster loads").*

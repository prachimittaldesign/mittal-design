---
name: live-3d-portfolio-iteration
description: Working method for long, owner-in-the-loop iteration on a custom WebGL/React site (three.js + r3f + Vite) that ships to main continuously and is verified headlessly under software GL. Use when debugging visual/timing bugs in a canvas app, adding HUD/overlay features around a 3D scene, or hardening such a site (SEO, fallbacks, mobile) without changing its look.
---

# Iterating on a live 3D portfolio with the owner in the loop

Distilled from a multi-day session on mittal.design: a three.js/react-three-fiber city where every building is a project. The owner reviewed every change on her real devices and pushed back fast; all verification ran through headless Chromium on SwiftShader (software GL). These are the rules that were actually load-bearing. Each is falsifiable — if you can't check it the stated way, you haven't followed it.

## 1. Reproduce the user's exact conditions before diagnosing

**Add cheap dev-only levers for every environmental input, then set them to match the bug report.**

The site's sky/weather follow live Hyderabad time, so most visual bugs only exist at some hour or weather. We added `?hour=22.5` and `?weather=rain` URL overrides (ignored unless present, so production is untouched) purely to reproduce reports. The "blue chunks in the sky" screenshot showed 11:46 AM + rain; reproducing at `?hour=11.75&weather=rain` showed the artifact in one shot — without that, the bug is invisible at most times of day and you'd "fix" nothing.

Rule: if a behavior depends on wall-clock, network, weather, or device state, you must be able to force that state from a URL or flag before you start diagnosing. If your repro screenshot doesn't show the artifact from the user's screenshot, stop — you're not looking at the bug.

## 2. Localize visual artifacts by subtraction before reading any code

**Toggle the suspected subsystem off; only read source once the toggle proves the culprit.**

For the sky chunks, we didn't start in shader code. We added a temporary `?noclouds` param that skipped `<Clouds>`, re-shot: chunks gone → clouds guilty. Only then did we read drei's `Cloud.js` and find the real bug — our canvas cloud texture painted its "base shadow" with a full-width `fillRect`, stamping a translucent blue rectangle onto every sprite (fixed with `globalCompositeOperation = 'source-atop'`). The same pattern earlier: pond flicker was confirmed as `MeshReflectorMaterial` by knowing it re-renders the scene to an FBO per frame, then replacing it wholesale.

Rule: for "what is that thing on screen" bugs, your first commit-worthy evidence is a screenshot pair (subsystem on/off), not a code theory. Remove the toggle after.

## 3. Fix the mechanism, not the pixels

**A fix must name the mechanism that produced the symptom; a magic-number tweak without one means keep digging.**

Three examples where the tempting patch was wrong: (a) pond flicker — not "tune blur/resolution" but "planar reflector re-renders the city into a low-res FBO every frame; replace with env-map gloss, which the glass towers already prove stable"; (b) boats "sinking in sand" — not "raise y" but read `CoastEnvironment` and find the shore is *rings above sea level out to r≈228* (stone 213, rocks 224, surf 228), so moor boats at r≥230 on open water; (c) stale resume on phone — not "re-upload the PDF" but "same filename = cached; version the filename" (`Prachi-Mittal-Resume-2026.pdf`). The earlier counter-example: URL-encoding a space in an image filename (`%20`) was a pixel-level patch and failed (commit c19029c); renaming the file (02e28ee) was the mechanism fix.

Rule: the commit message must be able to state the causal chain in one sentence. If it can only say what changed, not why that produced the symptom, the fix is a guess.

## 4. Separate app time from harness time before touching app code

**Under software GL, JS timers fire seconds late; a test that samples "too early" produces false app bugs.**

This burned us three separate times: the About-peek "never opened" (it opened at t=21s wall-clock because WebGL saturated the main thread; a 26-sample timeline poll proved open→close→localStorage-set in order); overlay close "didn't update the URL" (instrumenting `history.pushState` with a console wrapper showed it firing right after the 650ms close animation — my test just read pathname before title in a starved run); tooltip "shown: NONE" at 650ms (synthetic `dispatchEvent(new PointerEvent('pointerover'))` + polling up to 8s showed the whole pipeline worked).

Rule: when a headless test fails on anything timer-adjacent, do NOT edit app code until you've done one of: (a) wrapped the API in-page and logged its firing, (b) polled the DOM/localStorage on a timeline instead of a single sample, (c) dispatched the event synthetically. If instrumentation shows the app acted, fix the test, not the app.

## 5. Headless-WebGL Playwright needs its own idioms — codify them once

**Actionability checks, hover-transform buttons, and chained `pkill` all hang or lie under SwiftShader.**

Session-proven idioms (we wrote 30+ scratch `.mjs` harnesses): `click({ force: true })` because buttons with `hover:-translate-y` never pass Playwright's stability check; when even force-click hangs on "waiting for scheduled navigations", drive via `page.evaluate(() => el.click())` or `page.keyboard.type(...)`; wrap every script in `timeout N node x.mjs` and end with `process.exit(0)` (browser close stalls); disambiguate `getByRole('button', {name:'Next'})` with `exact: true` (the music player has "Next track"); retry state-changing clicks in a loop checking for their effect (`map4.mjs` clicked "2D" up to 3× and polled for `[data-mk]`). And never chain `pkill ... && git commit ...` — the pkill returns 144 and silently eats the commit; this happened twice; always check `git log --oneline -1` after any chain containing pkill.

Rule: a flaky harness step gets one of the listed substitutions, not a longer sleep. If you added a sleep >8s, you've misdiagnosed (see §4).

## 6. Never ref-guard a mount effect whose cleanup cancels the work

**StrictMode double-invokes effects: guard-ref sets on pass one, cleanup cancels the timers, pass two bails — net result: nothing runs.**

The About auto-peek was written as `if (peeked.current) return; peeked.current = true; setTimeout(...)` with cleanup clearing the timers. In dev StrictMode the peek simply never fired, and it looked exactly like a timing bug (§4 nearly ate the blame). The fix was deleting the ref and letting idempotent re-runs + cleanup handle it.

Rule: grep any effect that both sets a `ref.current` guard and returns a cleanup cancelling its own side effects — that pattern is a bug under StrictMode, full stop. Persistence belongs in localStorage (set it *inside* the timer callback), not in a ref checked before scheduling.

## 7. Bridge canvas→DOM through a mutable store + rAF, never per-frame React state

**Anything that must track the 3D camera at 60fps writes to a plain module object; DOM readers poll it in their own requestAnimationFrame.**

Three features used the identical pattern: the coachmark anchored to Ved's star (`vedAnchor`), the cursor-following "click to open" building tooltip (`posRef`, mousemove writes to a ref and mutates `el.style` directly), and the 19 game-map markers (`markerPositions: Map<string, {x,y,visible}>` written by a `useFrame` probe inside the Canvas, read by an rAF loop that sets `el.style.transform`). Zero React renders during pan/zoom.

Rule: if a `useFrame` or `mousemove` handler calls `setState`, that's the defect. The React boundary is crossed only when the *identity* of the tracked thing changes (hovered project id), never its coordinates.

## 8. When a thing renders somewhere other than its data says, grep for the override before positioning anything against the data

**One model (`arch`/Studio) rendered at a hard-coded spot (`LIGHTHOUSE.position = [22, 158]`), not its grid cell (`gridToWorld(6,6) = [72,-72]`) — and every feature that trusted the data broke the same way.**

Search "go to studio" flew users to an empty corner. The fix was a `POSITION_OVERRIDES` map in the places registry — and the very next feature (map markers) needed the same override, which we applied preemptively in `MapMarkerProbe`. The general failure: coordinates in the data model are a claim, not a fact.

Rule: before building anything that positions UI relative to model coordinates, grep the render path of every entity for hard-coded positions or filtered-out ids (here: `BUILDINGS.filter(id !== 'arch')` was the tell). Any entity excluded from the generic render loop needs an explicit entry in your positional feature.

## 9. When two layers fight, find the shared stacking context before raising a z-index

**Three stacking bugs, three different correct fixes — only one of them was "raise z".**

(a) Search dropdown behind filter pills: both at `z-30`, pills later in DOM → later sibling wins; fix = raise search to `z-40` (legitimate, they're peers with a real priority). (b) Coverflow cards floating *over* the opened case study: the cover-flow effect assigns cards `z-index` up to 100 as static-positioned flex items, which escaped to the page context and beat the portaled overlay's `z-50`; fix = `isolation: isolate` on the gallery root so its internal z war can't leave the gallery. (c) Tour "Next" button unclickable on the monogram step: the About menu's invisible full-screen backdrop (`z-[50]`) sat over the coachmark (`z-30`); force-clicks in tests "clicked" but the backdrop swallowed them — a real-user bug found because the test failed; fix = lift the tour to `z-[60]` with a comment stating why.

Rule: diagnose by identifying which stacking context both combatants resolve in (portal target vs inline, `isolation`, DOM order among equal z). If your fix is a bigger number without that sentence, you've moved the collision, not removed it. Prove the fix with `document.elementFromPoint(x, y)` at the contested spot — that's how (b) was verified.

## 10. Readability over a live 3D scene comes from the text, not the panel

**Never dim text to make a background subtler; give full-contrast text a theme-flipped halo (or drop the panel entirely).**

The legend/hint saga took four rounds: solid HUD panel ("too loud") → light frosted glass with dimmed `hud-soft` text (user: "Don't compromise on accessibility. The text isn't readable") → full-contrast text + `text-shadow` halo that flips with the theme (pale halo behind dark day text, dark halo behind light night text, as CSS vars) → for the control hint, the user still wanted the panel gone, so: pure white text + dark shadow, no container. The halo is the transferable trick: it makes legibility independent of whatever the 3D scene renders behind it.

Rule: any text floating over the canvas must be verified with screenshots in BOTH day (`?hour=13`) and night (`?hour=22.5`) states before claiming it readable — the scene inverts, and a treatment that passes one usually fails the other. Opacity below ~0.85 on overlay text is an automatic fail.

## 11. Aesthetic adjectives name a pattern plus an invariant — satisfy both or expect the second correction

**"Make it visual" / "subtle" / "like a game map" pick a design pattern; the unstated invariant (it must still teach / still read / still be clickable) is what the follow-up message tests.**

Two-step corrections happened whenever the first response satisfied the adjective but not the invariant: "introduce infographics" → decorative visuals → "in shubhashree's casestudy the visuals are also all about explaining, look properly" → rebuilt as anatomy/before-after/flow diagrams that each carry an argument. "Make it subtle" → so subtle it failed contrast → explicit a11y pushback (see §10). The aurora went right first time only because "don't overdo it, subtle is great" was implemented as edge-fades + a 0.62 global multiplier while keeping it clearly visible at night.

Rule: after implementing an aesthetic correction, re-verify the artifact still performs its original job (readable, explanatory, clickable) and say so with evidence in the reply. If you only verified the adjective, the next message will be the invariant.

## 12. New sections ride optional data + conditional render, so untouched entities are provably untouched

**Extend the type with optional fields; components return null without them; the blast-radius check is that other entities' output didn't change.**

The Ved infographic redesign added `tldr/stats/comparison/anatomy/flow/beforeAfter/research/users/reflection` to `CaseStudy` — every field optional, every new component gated on presence (`{cs.comparison && <ComparisonMatrix/>}`). SnapLogic and Revee & Mo rendered byte-identically until they were deliberately given their own data. Same later for `Project.height` overrides and marker tiers.

Rule: when asked to enrich ONE entity in a homogeneous collection, the diff must not force any change in sibling entities' rendered output. Check it: open a sibling's overlay/screenshot after the change. Required fields added to a shared type = you've made the next request harder.

## 13. Do the occlusion/layout arithmetic before another render-verify lap

**A screenshot loop costs minutes under software GL; sightline and frame math costs seconds and gets the constant right the first time.**

Search fly-to framing failed twice visually (landed face-to-face with Vote IQ; then Ved behind Revee & Mo — both towers on x=48). Instead of a third guess we computed: approach from outside along the centre→building ray (nothing taller beyond the perimeter), hover `y = max(56, h·1.35)`, look at `y = h·0.42`, standoff `92 + h·0.8`, and checked the blocking tower against the sightline (`75·(72/95) ≈ 57 » 13`) and the star against the frustum (`tan20° · 139 ≈ 51` half-height covers y≈66). Third run framed perfectly. Same discipline for marker stagger: char-code-parity of the actually-colliding id pairs (`paas`/`snaplogic`, `revee`/`amplyfund`) was computed to differ *before* shipping the stagger.

Rule: after the second failed visual iteration on geometry, stop screenshotting and write the inequality down. If you can't state which inequality your constant satisfies, the next screenshot is a coin flip.

## 14. "Done" means an artifact from the user's viewport, delivered to them

**Every claim ships its evidence: screenshot at the reporting device's size, hit-test for stacking, grep of generated output, HTTP status for assets.**

Phone bugs were verified at 390×844 with `isMobile/hasTouch`, not desktop; the gallery-over-overlay fix was proven with `elementFromPoint(195,500)` returning overlay content; prerendered SEO pages were grepped for `<title>`/canonical — which is exactly how the `Ved — Cms · Dita Builder` acronym-mangling bug was caught before the user saw it; image fixes were `curl -sI …/IMAGES/<name>` → 200 before commit. Screenshots went to the user via file-send with every visual change, which repeatedly earned same-message corrections instead of a next-day bug report.

Rule: no visual/behavioral claim in the final reply without naming its artifact. If verification was only "typecheck passed + it should work", say that honestly instead — but expect to do the lap anyway.

## 15. Fold a mid-task message into the open pass if it touches the same system; batch it, don't queue it

**Interruptions that hit the file you have open get integrated now — with their own line in the commit.**

"Handed off to nexus connect" arrived while writing Revee & Mo's impact section → landed as an impact bullet in the same commit. "Buildings are looking so small in 2d" arrived mid-marker-build → the marker system *was* the fix, plus an 18% closer camera, one commit. "Show stars in skyline view as well" arrived during the 2D-stars fix → one gate change covered both. The one standing-order flip ("NO PUSH TO MAIN" → "I mean push to main") was treated as the later message winning, then became the session's convention (every commit pushed to branch + main thereafter).

Rule: read the queued message before your current edit lands. Same file/system → integrate and mention it in the same reply; different system → finish, ship, then start it. Never let a queued correction ship *after* a commit that it contradicts.

## 16. Generated surfaces import the runtime source of truth; hand-rolled transforms are where the bugs live

**The SEO prerenderer, search registry, fallback gallery, and map markers all derive from the same `PROJECTS` array — drift is structurally impossible; the one bespoke transform is the one that broke.**

The Vite `closeBundle` plugin imports `src/data/projects.ts` directly to emit 13 static pages + sitemap; the crawlable home-page index, the coverflow cards, and the marker pins all map over the same array. Nothing was ever out of sync across ~40 commits of content churn. The single bug in that pipeline was the one piece of hand-written transformation — `titleCase()` lowercasing acronyms ("CMS"→"Cms") — caught by grepping the built HTML (§14).

Rule: a derived artifact (prerendered page, fallback UI, marker layer) may not restate content; it must import it. When reviewing such a pipeline, spend your attention exclusively on the transforms, and verify them against built output, not source.

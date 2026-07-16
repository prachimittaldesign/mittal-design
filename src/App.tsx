import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { ProjectOverlay } from './components/ProjectOverlay'
import { PlaceOverlay } from './components/PlaceOverlay'
import { ProjectsFallback } from './components/ProjectsFallback/ProjectsFallback'
import { BootLoader } from './components/BootLoader'
import { SceneErrorBoundary } from './components/SceneErrorBoundary'
import { TooltipLayer } from './components/TooltipLayer'
import { PROJECTS } from './data/projects'
import { PLACES } from './scene/lib/places'
import type { FocusTarget } from './scene/CameraRig'
import { useIsNight } from './lib/useIsNight'
import { useLowFps } from './lib/useLowFps'
import { useCityBoot } from './lib/useCityBoot'
import { parseEmbed } from './lib/viewStore'
import type { Project, Landmark } from './types'

// The heavy three.js / react-three stack lives behind a lazy boundary, so the
// initial download is the tiny shell + the on-brand boot loader. The 3D city
// streams in after; a 3-second watchdog (useCityBoot) falls back to the fast
// /projects page — ported from index-fallback.html — on a slow load, a real
// error, or no WebGL at all. See useCityBoot.ts for the full state machine.
const CityExperience = lazy(() => import('./CityExperience'))

type Overlay =
  | { type: 'project'; project: Project; rect: DOMRect }
  | { type: 'landmark'; landmark: Landmark; rect: DOMRect }
  | null

const DEFAULT_TITLE = 'Prachi Mittal — Portfolio'

function projectFromPath(pathname: string): Project | null {
  const m = pathname.match(/^\/projects\/([\w-]+)\/?$/)
  return m ? PROJECTS.find((p) => p.id === m[1]) ?? null : null
}
const titleFor = (p: Project) => `${p.label} — ${p.sub} | Prachi Mittal`

// Deep links / gallery picks have no clicked tile — grow from screen centre.
function centerRect(): DOMRect {
  const w = typeof window === 'undefined' ? 1200 : window.innerWidth
  const h = typeof window === 'undefined' ? 800 : window.innerHeight
  return new DOMRect(w / 2 - 60, h / 2 - 60, 120, 120)
}

function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

// SceneErrorBoundary's fallback renders during the CATCHING component's
// render phase — calling setState on a different component (App, via
// showProjects/retry) from in there is an unsafe cross-component update.
// Deferring the actual transition to an effect makes it safe.
function CityCrashFallback({ onCrash }: { onCrash: () => void }) {
  useEffect(() => {
    onCrash()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

export default function App() {
  // Embed mode (Share → "Embed a map"): boot straight to a captured angle with
  // no HUD. Detected once from the URL; short-circuits all the interactive shell.
  const [embed] = useState(() => parseEmbed(window.location.search))
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [focusRequest, setFocusRequest] = useState<FocusTarget | null>(null)
  const [hasWebGL] = useState(webglSupported)
  const [retryKey, setRetryKey] = useState(0)
  const [lagDismissed, setLagDismissed] = useState(false)

  const { route, cityReady, mountCity, handleFirstFrame, enterCity, showProjects } = useCityBoot(hasWebGL)

  // Watch FPS only once the city is actually the foregrounded experience.
  const lagging = useLowFps(hasWebGL && route === 'city')

  // Flip the whole HUD to dark "night glass" when Hyderabad is dark.
  const night = useIsNight()
  useEffect(() => {
    document.body.classList.toggle('night', night)
    return () => document.body.classList.remove('night')
  }, [night])

  const openProject = useCallback((project: Project, rect: DOMRect, push: boolean) => {
    setOverlay({ type: 'project', project, rect })
    document.title = titleFor(project)
    if (push) history.pushState({ project: project.id }, '', `/projects/${project.id}`)
    const place = PLACES.find((pl) => pl.id === project.id)
    if (place) setFocusRequest({ x: place.x, z: place.z, h: place.h, nonce: performance.now() })
  }, [])

  const closeOverlay = useCallback((push: boolean) => {
    setOverlay(null)
    document.title = DEFAULT_TITLE
    if (push && projectFromPath(location.pathname)) history.pushState({}, '', '/')
  }, [])

  // ProjectsFallback rows/cards open the case study over the city backdrop —
  // matches a building click: bring the city to front, then layer the overlay.
  const openProjectById = useCallback(
    (id: string) => {
      const project = PROJECTS.find((p) => p.id === id)
      if (!project) return
      enterCity()
      openProject(project, centerRect(), true)
    },
    [enterCity, openProject],
  )

  // Deep link on load + back/forward buttons.
  useEffect(() => {
    const initial = projectFromPath(location.pathname)
    if (initial) openProject(initial, centerRect(), false)
    const onPop = () => {
      const p = projectFromPath(location.pathname)
      if (p) openProject(p, centerRect(), false)
      else closeOverlay(false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [openProject, closeOverlay])

  // The shared case-study / place overlays (plain DOM — work over either the
  // city or the fallback page).
  const overlays = (
    <>
      {overlay?.type === 'project' && (
        <ProjectOverlay project={overlay.project} tileRect={overlay.rect} onClose={() => closeOverlay(true)} />
      )}
      {overlay?.type === 'landmark' && (
        <PlaceOverlay landmark={overlay.landmark} onClose={() => setOverlay(null)} />
      )}
    </>
  )

  // ── Embed mode: just the clean captured scene, no shell, no overlays ─────────
  if (embed) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-paper">
        <SceneErrorBoundary
          resetKey={retryKey}
          fallback={() => (
            <div className="grid h-full place-items-center text-[13px] text-ink-soft">Preview unavailable</div>
          )}
        >
          <Suspense fallback={null}>
            <CityExperience
              overlayActive={false}
              focusRequest={null}
              onSelectProject={() => {}}
              onSelectLandmark={() => {}}
              embed={embed}
            />
          </Suspense>
        </SceneErrorBoundary>
      </div>
    )
  }

  // ── The /projects fallback page: no WebGL, a real crash, a confirmed-laggy
  //    device, a slow load past the 3s watchdog, or a direct visit to the URL.
  //    The city may still be mounted underneath (see mountCity below) if the
  //    watchdog is what sent us here — it just isn't shown until asked for.
  const showFallback = route === 'projects'

  return (
    <div className="relative h-full w-full overflow-hidden">
      <TooltipLayer />

      {showFallback && (
        <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden bg-white">
          <ProjectsFallback onOpenProject={openProjectById} onEnterCity={enterCity} />
        </div>
      )}

      {mountCity && (
        <div className={showFallback ? 'pointer-events-none absolute inset-0 opacity-0' : 'absolute inset-0'} aria-hidden={showFallback}>
          <SceneErrorBoundary
            resetKey={retryKey}
            fallback={(retry) => (
              // A real crash: unmount for good (don't keep a broken instance
              // limping along hidden) and surface the fallback page. Retry
              // clears the boundary so the next "Enter the 3D city" gets a
              // fresh mount instead of re-throwing immediately.
              <CityCrashFallback
                onCrash={() => {
                  showProjects({ keepWarm: false, push: route === 'city' })
                  retry()
                  setRetryKey((k) => k + 1)
                }}
              />
            )}
          >
            <Suspense fallback={null}>
              <CityExperience
                key={retryKey}
                overlayActive={overlay !== null}
                focusRequest={focusRequest}
                onSelectProject={(project, rect) => openProject(project, rect, true)}
                onSelectLandmark={(landmark, rect) => setOverlay({ type: 'landmark', landmark, rect })}
                onFirstFrame={handleFirstFrame}
              />
            </Suspense>
          </SceneErrorBoundary>

          {!showFallback && !cityReady && <BootLoader />}

          {/* Persistent escape hatch — always available while the city is
              the foregrounded experience, not just on a slow/lagging load. */}
          {!showFallback && cityReady && overlay === null && (
            <button
              type="button"
              onClick={() => showProjects({ keepWarm: true })}
              data-tip="Browse everything as a fast page"
              data-tip-pos="bottom"
              className="hud hud-text pointer-events-auto absolute left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-20 rounded-full border px-[14px] py-[8px] text-[12.5px] font-bold shadow-[0_3px_14px_rgba(0,0,0,0.14)] backdrop-blur-md sm:left-4"
            >
              View Projects
            </button>
          )}

          {/* Lag rescue: a device struggling to render can drop to the fast
              page — this fully unmounts the city to actually free the GPU. */}
          {lagging && !lagDismissed && !showFallback && overlay === null && (
            <div className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom)+56px)] left-1/2 z-[40] w-[min(340px,calc(100vw-24px))] -translate-x-1/2 sm:bottom-[70px]">
              <div className="hud-strong flex items-center gap-3 rounded-[16px] border p-[14px] shadow-[0_14px_44px_rgba(0,0,0,0.18)] backdrop-blur-md">
                <div className="min-w-0 flex-1">
                  <div className="hud-text text-[13.5px] font-bold">Running slowly?</div>
                  <div className="hud-soft text-[12px] leading-[1.45]">View the projects as a fast page instead.</div>
                </div>
                <button
                  type="button"
                  onClick={() => showProjects({ keepWarm: false })}
                  className="hud-on flex-shrink-0 rounded-full px-[13px] py-[7px] text-[12px] font-bold"
                >
                  View Projects
                </button>
                <button
                  type="button"
                  onClick={() => setLagDismissed(true)}
                  aria-label="Dismiss"
                  className="hud-soft flex-shrink-0 text-[16px] leading-none transition-opacity hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {overlays}
    </div>
  )
}

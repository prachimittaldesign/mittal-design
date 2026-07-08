import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { ProjectOverlay } from './components/ProjectOverlay'
import { PlaceOverlay } from './components/PlaceOverlay'
import { Coverflow } from './components/Coverflow'
import { SceneErrorBoundary } from './components/SceneErrorBoundary'
import { TooltipLayer } from './components/TooltipLayer'
import { PROJECTS } from './data/projects'
import { PLACES } from './scene/lib/places'
import type { FocusTarget } from './scene/CameraRig'
import { useIsNight } from './lib/useIsNight'
import { useLowFps } from './lib/useLowFps'
import { parseEmbed } from './lib/viewStore'
import type { Project, Landmark } from './types'

// The heavy three.js / react-three stack lives behind a lazy boundary, so the
// initial download is the tiny shell + HTML gallery. The 3D city streams in
// after; on slow/broken/laggy loads the gallery carries the experience.
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

export default function App() {
  // Embed mode (Share → "Embed a map"): boot straight to a captured angle with
  // no HUD. Detected once from the URL; short-circuits all the interactive shell.
  const [embed] = useState(() => parseEmbed(window.location.search))
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [focusRequest, setFocusRequest] = useState<FocusTarget | null>(null)
  const [hasWebGL] = useState(webglSupported)
  const [retryKey, setRetryKey] = useState(0)
  // The lag prompt → user chose the gallery over the (laggy) 3D city.
  const [galleryOverride, setGalleryOverride] = useState(false)
  const [lagDismissed, setLagDismissed] = useState(false)

  // Watch FPS only once the city is actually the active experience.
  const cityActive = hasWebGL && !galleryOverride
  const lagging = useLowFps(cityActive)

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

  // The shared case-study / place overlays (plain DOM — work in every mode).
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

  // ── Fallback modes: no WebGL, or the user escaped a laggy scene ──────────────
  if (!hasWebGL) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <TooltipLayer />
        <Coverflow mode="nowebgl" onOpen={(p) => openProject(p, centerRect(), true)} />
        {overlays}
      </div>
    )
  }
  if (galleryOverride) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <TooltipLayer />
        <Coverflow
          mode="gallery"
          onOpen={(p) => openProject(p, centerRect(), true)}
          onClose={() => setGalleryOverride(false)}
        />
        {overlays}
      </div>
    )
  }

  // ── The 3D city (lazy) with gallery fallbacks for slow load + errors ─────────
  return (
    <div className="relative h-full w-full overflow-hidden">
      <TooltipLayer />
      <SceneErrorBoundary
        resetKey={retryKey}
        fallback={(retry) => (
          <Coverflow
            mode="error"
            onOpen={(p) => openProject(p, centerRect(), true)}
            onRetry={() => {
              retry()
              setRetryKey((k) => k + 1)
            }}
          />
        )}
      >
        <Suspense fallback={<Coverflow mode="loading" onOpen={(p) => openProject(p, centerRect(), true)} />}>
          <CityExperience
            key={retryKey}
            overlayActive={overlay !== null}
            focusRequest={focusRequest}
            onSelectProject={(project, rect) => openProject(project, rect, true)}
            onSelectLandmark={(landmark, rect) => setOverlay({ type: 'landmark', landmark, rect })}
          />
        </Suspense>
      </SceneErrorBoundary>

      {/* Lag rescue: a device struggling to render can drop to the gallery. */}
      {lagging && !lagDismissed && overlay === null && (
        <div className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom)+56px)] left-1/2 z-[40] w-[min(340px,calc(100vw-24px))] -translate-x-1/2 sm:bottom-[70px]">
          <div className="hud-strong flex items-center gap-3 rounded-[16px] border p-[14px] shadow-[0_14px_44px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <div className="min-w-0 flex-1">
              <div className="hud-text text-[13.5px] font-bold">Running slowly?</div>
              <div className="hud-soft text-[12px] leading-[1.45]">View the projects as a fast gallery instead.</div>
            </div>
            <button
              type="button"
              onClick={() => setGalleryOverride(true)}
              className="hud-on flex-shrink-0 rounded-full px-[13px] py-[7px] text-[12px] font-bold"
            >
              Open gallery
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

      {overlays}
    </div>
  )
}

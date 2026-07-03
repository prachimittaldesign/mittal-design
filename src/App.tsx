import { useCallback, useEffect, useMemo, useState } from 'react'
import { Scene } from './scene/Scene'
import { ProjectOverlay } from './components/ProjectOverlay'
import { PlaceOverlay } from './components/PlaceOverlay'
import { SearchExplore } from './components/SearchExplore'
import { TagPills } from './components/TagPills'
import { LayersControl } from './components/LayersControl'
import { MapControlsHud } from './components/MapControlsHud'
import { MusicPlayer } from './components/MusicPlayer'
import { Legend } from './components/Legend'
import { Coachmarks } from './components/Coachmarks'
import { NoWebGL } from './components/NoWebGL'
import { PROJECTS } from './data/projects'
import type { FocusTarget } from './scene/CameraRig'
import { PLACES, type Place } from './scene/lib/places'
import { useIsNight } from './lib/useIsNight'
import type { Appearance, CameraCmd, LayerState, MapLayer, ViewMode, Project, Landmark } from './types'

type Overlay =
  | { type: 'project'; project: Project; rect: DOMRect }
  | { type: 'landmark'; landmark: Landmark; rect: DOMRect }
  | null

// ── Shareable URLs ────────────────────────────────────────────────────────────
// Every project has a real URL (/projects/<id>) — prerendered at build time
// for crawlers, and handled here for humans: deep links open the case study
// over the city, opening a case study updates the address bar, and the back
// button closes it again.
const DEFAULT_TITLE = 'Prachi Mittal — Portfolio'

function projectFromPath(pathname: string): Project | null {
  const m = pathname.match(/^\/projects\/([\w-]+)\/?$/)
  return m ? PROJECTS.find((p) => p.id === m[1]) ?? null : null
}
function titleFor(p: Project): string {
  return `${p.label} — ${p.sub} | Prachi Mittal`
}
// Deep links have no clicked tile to expand from — grow from screen centre.
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
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [focus, setFocus] = useState<FocusTarget | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [layers, setLayers] = useState<LayerState>({
    showLabels: true,
    showScenery: true,
    showLandmarks: true,
  })
  const [layer, setLayer] = useState<MapLayer | null>(null)
  const [view, setView] = useState<ViewMode>('3d')
  const [cameraCmd, setCameraCmd] = useState<CameraCmd | null>(null)
  const [hasWebGL] = useState(webglSupported)

  // Flip the whole HUD to dark "night glass" when Hyderabad is dark. Toggled on
  // <body> so portaled menus (About) inherit the tokens too.
  const night = useIsNight()
  useEffect(() => {
    document.body.classList.toggle('night', night)
    return () => document.body.classList.remove('night')
  }, [night])

  const openProject = useCallback((project: Project, rect: DOMRect, push: boolean) => {
    setOverlay({ type: 'project', project, rect })
    document.title = titleFor(project)
    if (push) history.pushState({ project: project.id }, '', `/projects/${project.id}`)
    // Aim the camera at the building too, so closing the overlay leaves the
    // visitor standing in front of what they were reading about.
    const place = PLACES.find((pl) => pl.id === project.id)
    if (place) setFocus({ x: place.x, z: place.z, h: place.h, nonce: performance.now() })
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

  const appearance = useMemo<Appearance>(
    () => ({ mode: layer ? 'layer' : activeTag ? 'tag' : 'default', activeTag, layer }),
    [layer, activeTag],
  )

  // Graceful fallback: no WebGL → an accessible project list instead of a
  // blank canvas. The case-study overlays are plain DOM, so they still work.
  if (!hasWebGL) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <NoWebGL onOpen={(p) => openProject(p, centerRect(), true)} />
        {overlay?.type === 'project' && (
          <ProjectOverlay
            project={overlay.project}
            tileRect={overlay.rect}
            onClose={() => closeOverlay(true)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Scene
        appearance={appearance}
        layers={layers}
        view={view}
        focus={focus}
        cameraCmd={cameraCmd}
        onSelect={(project, rect) => openProject(project, rect, true)}
        onSelectLandmark={(landmark, rect) => setOverlay({ type: 'landmark', landmark, rect })}
      />

      <SearchExplore onFocus={(p: Place) => setFocus({ x: p.x, z: p.z, h: p.h, nonce: performance.now() })} />
      <TagPills activeTag={activeTag} onChange={setActiveTag} />
      <LayersControl layers={layers} onChange={setLayers} layer={layer} onLayerChange={setLayer} />
      <MapControlsHud
        view={view}
        onSetView={setView}
        onCmd={(type) => setCameraCmd({ type, nonce: performance.now() })}
      />
      <MusicPlayer />
      {layer && <Legend layer={layer} />}
      <Coachmarks suppressed={overlay !== null} />

      {overlay?.type === 'project' && (
        <ProjectOverlay
          project={overlay.project}
          tileRect={overlay.rect}
          onClose={() => closeOverlay(true)}
        />
      )}
      {overlay?.type === 'landmark' && (
        <PlaceOverlay landmark={overlay.landmark} onClose={() => setOverlay(null)} />
      )}
    </div>
  )
}

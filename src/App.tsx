import { useEffect, useMemo, useState } from 'react'
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
import type { FocusTarget } from './scene/CameraRig'
import type { Place } from './scene/lib/places'
import { useIsNight } from './lib/useIsNight'
import type { Appearance, CameraCmd, LayerState, MapLayer, ViewMode, Project, Landmark } from './types'

type Overlay =
  | { type: 'project'; project: Project; rect: DOMRect }
  | { type: 'landmark'; landmark: Landmark; rect: DOMRect }
  | null

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

  // Flip the whole HUD to dark "night glass" when Hyderabad is dark. Toggled on
  // <body> so portaled menus (About) inherit the tokens too.
  const night = useIsNight()
  useEffect(() => {
    document.body.classList.toggle('night', night)
    return () => document.body.classList.remove('night')
  }, [night])

  const appearance = useMemo<Appearance>(
    () => ({ mode: layer ? 'layer' : activeTag ? 'tag' : 'default', activeTag, layer }),
    [layer, activeTag],
  )

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Scene
        appearance={appearance}
        layers={layers}
        view={view}
        focus={focus}
        cameraCmd={cameraCmd}
        onSelect={(project, rect) => setOverlay({ type: 'project', project, rect })}
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
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.type === 'landmark' && (
        <PlaceOverlay landmark={overlay.landmark} onClose={() => setOverlay(null)} />
      )}
    </div>
  )
}

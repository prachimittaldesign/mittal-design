import { useMemo, useState } from 'react'
import { Scene } from './scene/Scene'
import { ProjectOverlay } from './components/ProjectOverlay'
import { PlaceOverlay } from './components/PlaceOverlay'
import { SearchExplore } from './components/SearchExplore'
import { TagPills } from './components/TagPills'
import { LayersControl } from './components/LayersControl'
import { MapControlsHud } from './components/MapControlsHud'
import { Legend } from './components/Legend'
import type { FocusTarget } from './scene/CameraRig'
import type { Place } from './scene/lib/places'
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

      <SearchExplore onFocus={(p: Place) => setFocus({ x: p.x, z: p.z, nonce: performance.now() })} />
      <TagPills activeTag={activeTag} onChange={setActiveTag} />
      <LayersControl layers={layers} onChange={setLayers} layer={layer} onLayerChange={setLayer} />
      <MapControlsHud
        view={view}
        onToggleView={() => setView((v) => (v === '3d' ? 'iso' : '3d'))}
        onCmd={(type) => setCameraCmd({ type, nonce: performance.now() })}
      />
      {layer && <Legend layer={layer} />}

      {overlay?.type === 'project' && (
        <ProjectOverlay
          project={overlay.project}
          tileRect={overlay.rect}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.type === 'landmark' && (
        <PlaceOverlay
          landmark={overlay.landmark}
          tileRect={overlay.rect}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  )
}

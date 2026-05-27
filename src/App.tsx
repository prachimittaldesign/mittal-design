import { useMemo, useState } from 'react'
import { Scene } from './scene/Scene'
import { ProjectOverlay } from './components/ProjectOverlay'
import { PlaceOverlay } from './components/PlaceOverlay'
import { SearchExplore } from './components/SearchExplore'
import { TagPills } from './components/TagPills'
import { LayersControl } from './components/LayersControl'
import { MapControlsHud } from './components/MapControlsHud'
import type { FocusTarget } from './scene/CameraRig'
import type { Place } from './scene/lib/places'
import type { Appearance, CameraCmd, LayerState, Project, Landmark } from './types'

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
  const [cameraCmd, setCameraCmd] = useState<CameraCmd | null>(null)

  const appearance = useMemo<Appearance>(
    () => ({ mode: activeTag ? 'tag' : 'default', activeTag }),
    [activeTag],
  )

  return (
    <div className="h-full">
      <Scene
        appearance={appearance}
        layers={layers}
        focus={focus}
        cameraCmd={cameraCmd}
        onSelect={(project, rect) => setOverlay({ type: 'project', project, rect })}
        onSelectLandmark={(landmark, rect) => setOverlay({ type: 'landmark', landmark, rect })}
      />

      <SearchExplore onFocus={(p: Place) => setFocus({ x: p.x, z: p.z, nonce: performance.now() })} />
      <TagPills activeTag={activeTag} onChange={setActiveTag} />
      <LayersControl layers={layers} onChange={setLayers} />
      <MapControlsHud onCmd={(type) => setCameraCmd({ type, nonce: performance.now() })} />

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

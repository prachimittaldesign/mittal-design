import { useEffect, useMemo, useState } from 'react'
import { Scene } from './scene/Scene'
import { SearchExplore } from './components/SearchExplore'
import { TagPills } from './components/TagPills'
import { LayersControl } from './components/LayersControl'
import { MapControlsHud } from './components/MapControlsHud'
import { MusicPlayer } from './components/MusicPlayer'
import { Legend } from './components/Legend'
import { Coachmarks } from './components/Coachmarks'
import { WorkWithMe } from './components/WorkWithMe'
import { ShareMenu } from './components/ShareMenu'
import type { FocusTarget } from './scene/CameraRig'
import type { Place } from './scene/lib/places'
import type { EmbedConfig } from './lib/viewStore'
import type { Appearance, CameraCmd, LayerState, MapLayer, ViewMode, Project, Landmark } from './types'

export interface CityExperienceProps {
  onSelectProject: (project: Project, rect: DOMRect) => void
  onSelectLandmark: (landmark: Landmark, rect: DOMRect) => void
  /** Suppress the coachmark tour while a case-study overlay is open. */
  overlayActive: boolean
  /** External "fly here" request (deep link / gallery pick); nonce triggers it. */
  focusRequest: FocusTarget | null
  /** When set, boot to a captured angle with no HUD (a shareable embed). */
  embed?: EmbedConfig | null
}

// The full interactive 3D city + its HUD. Lazy-loaded (React.lazy) so the heavy
// three.js / react-three stack downloads only when a capable, connected device
// is ready for it — the app shell and the HTML gallery fallback ship in the
// tiny initial bundle and paint instantly on slow networks.
export default function CityExperience({
  onSelectProject,
  onSelectLandmark,
  overlayActive,
  focusRequest,
  embed = null,
}: CityExperienceProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [layers, setLayers] = useState<LayerState>({
    showLabels: true,
    showScenery: true,
    showLandmarks: true,
  })
  const [layer, setLayer] = useState<MapLayer | null>(null)
  const [view, setView] = useState<ViewMode>(embed?.initial.view ?? '3d')
  const [cameraCmd, setCameraCmd] = useState<CameraCmd | null>(null)
  const [focus, setFocus] = useState<FocusTarget | null>(null)

  // Honour fly-to requests routed from the shell (deep links, gallery picks).
  useEffect(() => {
    if (focusRequest) setFocus(focusRequest)
  }, [focusRequest])

  const appearance = useMemo<Appearance>(
    () => ({ mode: layer ? 'layer' : activeTag ? 'tag' : 'default', activeTag, layer }),
    [layer, activeTag],
  )

  return (
    <>
      <Scene
        appearance={appearance}
        layers={layers}
        view={view}
        focus={focus}
        cameraCmd={cameraCmd}
        onSelect={onSelectProject}
        onSelectLandmark={onSelectLandmark}
        embed={embed}
      />

      {!embed && (
        <>
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
          <Coachmarks suppressed={overlayActive} />
          <WorkWithMe />
          <ShareMenu />
        </>
      )}
    </>
  )
}

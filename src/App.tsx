import { useState } from 'react'
import { Scene } from './scene/Scene'
import { ProjectOverlay } from './components/ProjectOverlay'
import { PlaceOverlay } from './components/PlaceOverlay'
import { SearchExplore } from './components/SearchExplore'
import type { FocusTarget } from './scene/CameraRig'
import type { Place } from './scene/lib/places'
import type { Project, Landmark } from './types'

type Overlay =
  | { type: 'project'; project: Project; rect: DOMRect }
  | { type: 'landmark'; landmark: Landmark; rect: DOMRect }
  | null

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [focus, setFocus] = useState<FocusTarget | null>(null)

  return (
    <div className="h-full">
      <Scene
        onSelect={(project, rect) => setOverlay({ type: 'project', project, rect })}
        onSelectLandmark={(landmark, rect) => setOverlay({ type: 'landmark', landmark, rect })}
        focus={focus}
      />
      <SearchExplore onFocus={(p: Place) => setFocus({ x: p.x, z: p.z, nonce: performance.now() })} />
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

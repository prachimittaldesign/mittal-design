import { useCallback, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Box3, Camera, Vector3, type Object3D } from 'three'
import { Ground } from './Ground'
import { Roads } from './Roads'
import { Props } from './Props'
import { CityFill } from './CityFill'
import { Building } from './Building'
import { Landmark } from './Landmark'
import { StreetSigns } from './StreetSigns'
import { BUILDINGS, LANDMARK_DEFS } from './lib/cityModel'
import type { Appearance, LayerState, Project, Landmark as LandmarkData } from '../types'

interface CityWorldProps {
  appearance: Appearance
  layers: LayerState
  onSelect: (project: Project, rect: DOMRect) => void
  onSelectLandmark: (landmark: LandmarkData, rect: DOMRect) => void
}

// Project a building's world bounding box to a screen-space rect, so the DOM
// takeover can expand from where the building sits on screen.
function projectRect(object: Object3D, camera: Camera, canvas: HTMLCanvasElement): DOMRect {
  const box = new Box3().setFromObject(object)
  const corners = [
    new Vector3(box.min.x, box.min.y, box.min.z),
    new Vector3(box.min.x, box.min.y, box.max.z),
    new Vector3(box.min.x, box.max.y, box.min.z),
    new Vector3(box.min.x, box.max.y, box.max.z),
    new Vector3(box.max.x, box.min.y, box.min.z),
    new Vector3(box.max.x, box.min.y, box.max.z),
    new Vector3(box.max.x, box.max.y, box.min.z),
    new Vector3(box.max.x, box.max.y, box.max.z),
  ]
  const r = canvas.getBoundingClientRect()
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const v = new Vector3()
  for (const corner of corners) {
    v.copy(corner).project(camera)
    const px = r.left + (v.x * 0.5 + 0.5) * r.width
    const py = r.top + (1 - (v.y * 0.5 + 0.5)) * r.height
    minX = Math.min(minX, px)
    maxX = Math.max(maxX, px)
    minY = Math.min(minY, py)
    maxY = Math.max(maxY, py)
  }
  minX = Math.max(r.left, minX)
  minY = Math.max(r.top, minY)
  maxX = Math.min(r.right, maxX)
  maxY = Math.min(r.bottom, maxY)
  return new DOMRect(minX, minY, Math.max(8, maxX - minX), Math.max(8, maxY - minY))
}

export function CityWorld({ appearance, layers, onSelect, onSelectLandmark }: CityWorldProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)

  const handleSelect = useCallback(
    (project: Project, object: Object3D) => {
      onSelect(project, projectRect(object, camera, gl.domElement))
    },
    [camera, gl, onSelect],
  )

  const handleSelectLandmark = useCallback(
    (landmark: LandmarkData, object: Object3D) => {
      onSelectLandmark(landmark, projectRect(object, camera, gl.domElement))
    },
    [camera, gl, onSelectLandmark],
  )

  return (
    <group>
      <Ground />
      <Roads />
      <Props />
      {layers.showScenery && <CityFill />}
      <StreetSigns />
      {BUILDINGS.map((def) => (
        <Building
          key={def.project.id}
          def={def}
          hovered={hovered === def.project.id}
          appearance={appearance}
          showLabel={layers.showLabels}
          onHover={setHovered}
          onSelect={handleSelect}
        />
      ))}
      {layers.showLandmarks &&
        LANDMARK_DEFS.map((def) => (
          <Landmark
            key={def.landmark.id}
            def={def}
            hovered={hovered === def.landmark.id}
            showLabel={layers.showLabels}
            onHover={setHovered}
            onSelect={handleSelectLandmark}
          />
        ))}
    </group>
  )
}

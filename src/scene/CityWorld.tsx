import { useCallback, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Box3, Camera, Group, Vector3, type Object3D } from 'three'
import { easing } from 'maath'
import { Ground } from './Ground'
import { Roads } from './Roads'
import { Props } from './Props'
import { CityFill } from './CityFill'
import { Building } from './Building'
import { Landmark } from './Landmark'
import { StreetSigns, AvenueLabels, GatewayLabels } from './StreetSigns'
import { StreetFurniture } from './StreetFurniture'
import { Mountains } from './Mountains'
import { Pond } from './Pond'
import { Birds } from './Birds'
import { ClockTower } from './ClockTower'
import { Billboards } from './Billboards'
import { CityLife } from './CityLife'
import { BUILDINGS, LANDMARK_DEFS, SKYLINE_POSITIONS, ISO_FLATTEN } from './lib/cityModel'
import type { Appearance, LayerState, ViewMode, Project, Landmark as LandmarkData } from '../types'

interface CityWorldProps {
  appearance: Appearance
  layers: LayerState
  view: ViewMode
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

export function CityWorld({ appearance, layers, view, onSelect, onSelectLandmark }: CityWorldProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const worldRef = useRef<Group>(null)
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)

  // 2D/iso view flattens the city vertically.
  useFrame((_, dt) => {
    if (worldRef.current) easing.damp(worldRef.current.scale, 'y', view === 'iso' ? ISO_FLATTEN : 1, 0.22, dt)
  })

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

  // The user toggle gates the name labels; they stay visible in 2D too, where
  // Building / Landmark counter-scale them so the flatten doesn't squash them.
  const showLabel = layers.showLabels

  return (
    <>
      <group ref={worldRef}>
        <Ground />
        <Roads />
        <Props />
        <StreetFurniture />
        <Mountains view={view} />
        {layers.showScenery && <CityFill />}
        {view === '3d' && <StreetSigns />}
        {view === '3d' && <Pond />}
        {view === '3d' && <Birds />}
        {view === '3d' && <ClockTower />}
        {view === '3d' && <Billboards />}
        {view === '3d' && <CityLife />}
        {view === 'iso' && <AvenueLabels />}
        {BUILDINGS.map((def) => (
          <Building
            key={def.project.id}
            def={def}
            hovered={hovered === def.project.id}
            appearance={appearance}
            showLabel={showLabel}
            view={view}
            skylineX={SKYLINE_POSITIONS.get(def.project.id) ?? 0}
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
            showLabel={showLabel}
            view={view}
            onHover={setHovered}
            onSelect={handleSelectLandmark}
          />
        ))}
      </group>

      {/* Outside the iso-flatten group so the markers stay upright in 2D. */}
      <GatewayLabels />
    </>
  )
}

import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { BUILDINGS, LIGHTHOUSE, LANDMARK_DEFS } from './lib/cityModel'
import { markerPositions } from '../lib/markerStore'
import type { ViewMode } from '../types'

// Projects every building's and landmark's world position into screen space
// each frame while the 2D map is active, feeding the DOM marker layer. The
// Studio renders as the lighthouse at a fixed spot, so its anchor follows it.
export function MapMarkerProbe({ view }: { view: ViewMode }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)

  const anchors = useMemo(() => {
    const list: Array<{ id: string; p: Vector3 }> = []
    for (const b of BUILDINGS) {
      const p =
        b.project.id === 'arch'
          ? new Vector3(LIGHTHOUSE.position[0], 30, LIGHTHOUSE.position[2])
          : new Vector3(b.position[0], b.height, b.position[2])
      list.push({ id: b.project.id, p })
    }
    for (const l of LANDMARK_DEFS) {
      list.push({ id: l.landmark.id, p: new Vector3(l.position[0], 8, l.position[2]) })
    }
    return list
  }, [])
  const v = useMemo(() => new Vector3(), [])

  useFrame(() => {
    if (view !== 'iso') {
      if (markerPositions.size) markerPositions.clear()
      return
    }
    for (const a of anchors) {
      v.copy(a.p).project(camera)
      markerPositions.set(a.id, {
        x: (v.x * 0.5 + 0.5) * size.width,
        y: (-v.y * 0.5 + 0.5) * size.height,
        visible: v.z > -1 && v.z < 1,
      })
    }
  })

  return null
}

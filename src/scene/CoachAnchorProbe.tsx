import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { BUILDINGS } from './lib/cityModel'
import { vedAnchor } from '../lib/coachAnchor'

// Projects a point just above the Ved tower (where its gold star floats) into
// screen space every frame, so the DOM coachmark can sit right next to the
// building it is talking about — even while the camera moves.
export function CoachAnchorProbe() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)

  const target = useMemo(() => {
    const ved = BUILDINGS.find((b) => b.project.id === 'paas')
    return ved
      ? new Vector3(ved.position[0], ved.height + 7, ved.position[2])
      : new Vector3(0, 40, 0)
  }, [])
  const v = useMemo(() => new Vector3(), [])

  useFrame(() => {
    v.copy(target).project(camera)
    vedAnchor.x = (v.x * 0.5 + 0.5) * size.width
    vedAnchor.y = (-v.y * 0.5 + 0.5) * size.height
    vedAnchor.visible = v.z > -1 && v.z < 1
  })

  return null
}

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

const COUNT  = 1800     // dense heavy-rain curtain
const SPREAD = 200      // half-extent X/Z
const TOP    = 115      // respawn ceiling
const SPEED  = 98       // base fall speed (units/s)
const WIND_X =  0.13    // wind lean along X (radians)
const WIND_Z = -0.05    // subtle depth lean

// Instanced falling streaks — one draw call for the full downpour.
// Mounted only while it's raining in Hyderabad (see DayNight).
export function Rain() {
  const ref   = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const drops = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * SPREAD * 2,
        z: (Math.random() - 0.5) * SPREAD * 2,
        y: Math.random() * TOP,
        v: SPEED * (0.8 + Math.random() * 0.45),
      })),
    [],
  )

  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    for (let i = 0; i < COUNT; i++) {
      const d = drops[i]
      d.y -= d.v * dt
      if (d.y < 0) {
        d.y = TOP
        d.x = (Math.random() - 0.5) * SPREAD * 2
        d.z = (Math.random() - 0.5) * SPREAD * 2
      }
      dummy.position.set(d.x, d.y, d.z)
      dummy.rotation.set(WIND_X, 0, WIND_Z)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.026, 2.8, 0.026]} />
      <meshBasicMaterial color="#8ab2cc" transparent opacity={0.64} depthWrite={false} />
    </instancedMesh>
  )
}

import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { PROPS, ROAD_SEGS } from './lib/cityModel'
import { FOLIAGE, TRUNK, ROCK, HOUSE, CAR } from './lib/cityTheme'

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

const TREES = PROPS.filter((p) => p.kind === 'tree')
const ROCKS = PROPS.filter((p) => p.kind === 'rock')
const HOUSES = PROPS.filter((p) => p.kind === 'house')

// Decorative city fabric: short, colourful, never grey, never interactive — it
// fills negative space so the eye still locks onto the tall labelled towers.
export function Props() {
  const cars = useMemo(() => {
    const list: { id: string; x: number; z: number; angle: number; color: string }[] = []
    ROAD_SEGS.forEach((s, i) => {
      const dx = s.bx - s.ax
      const dz = s.bz - s.az
      const len = Math.hypot(dx, dz)
      if (len < 22) return
      const count = Math.min(2, Math.floor(len / 44) + 1)
      const nx = -dz / len
      const nz = dx / len
      for (let k = 0; k < count; k++) {
        const t = (k + 0.5) / count
        const off = s.width * 0.24
        list.push({
          id: `car-${i}-${k}`,
          x: s.ax + dx * t + nx * off,
          z: s.az + dz * t + nz * off,
          angle: Math.atan2(-dz, dx),
          color: CAR[(i + k) % CAR.length],
        })
      }
    })
    return list
  }, [])

  return (
    <group>
      {/* Tree canopies — round spheres, Bruno-Simon style */}
      <Instances limit={Math.max(TREES.length, 1)} castShadow>
        <sphereGeometry args={[1.6, 8, 7]} />
        <meshStandardMaterial roughness={0.95} />
        {TREES.map((t) => (
          <Instance
            key={t.id}
            position={[t.position[0], (1.6 + 1.6) * t.scale, t.position[2]]}
            scale={t.scale}
            color={FOLIAGE[hash(t.id) % FOLIAGE.length]}
          />
        ))}
      </Instances>

      {/* Tree trunks */}
      <Instances limit={Math.max(TREES.length, 1)}>
        <cylinderGeometry args={[0.18, 0.24, 3.2, 6]} />
        <meshStandardMaterial color={TRUNK} roughness={1} />
        {TREES.map((t) => (
          <Instance key={t.id} position={[t.position[0], 1.6 * t.scale, t.position[2]]} scale={t.scale} />
        ))}
      </Instances>

      {/* Rocks */}
      <Instances limit={Math.max(ROCKS.length, 1)}>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color={ROCK} roughness={1} flatShading />
        {ROCKS.map((r) => (
          <Instance
            key={r.id}
            position={[r.position[0], 0.45 * r.scale, r.position[2]]}
            scale={r.scale}
            rotation={[0, r.rotationY, 0]}
          />
        ))}
      </Instances>

      {/* House bodies */}
      <Instances limit={Math.max(HOUSES.length, 1)} castShadow>
        <boxGeometry args={[3, 2.2, 3]} />
        <meshStandardMaterial roughness={0.95} />
        {HOUSES.map((h) => (
          <Instance
            key={h.id}
            position={[h.position[0], 1.1 * h.scale, h.position[2]]}
            scale={h.scale}
            rotation={[0, h.rotationY, 0]}
            color={HOUSE[hash(h.id) % HOUSE.length]}
          />
        ))}
      </Instances>

      {/* House roofs */}
      <Instances limit={Math.max(HOUSES.length, 1)} castShadow>
        <coneGeometry args={[2.3, 1.6, 4]} />
        <meshStandardMaterial color="#b6764f" roughness={0.95} />
        {HOUSES.map((h) => (
          <Instance
            key={h.id}
            position={[h.position[0], 3.0 * h.scale, h.position[2]]}
            scale={h.scale}
            rotation={[0, h.rotationY + Math.PI / 4, 0]}
          />
        ))}
      </Instances>

      {/* Cars */}
      <Instances limit={Math.max(cars.length, 1)} castShadow>
        <boxGeometry args={[1.7, 0.7, 0.95]} />
        <meshStandardMaterial roughness={0.6} metalness={0.1} />
        {cars.map((c) => (
          <Instance key={c.id} position={[c.x, 0.42, c.z]} rotation={[0, c.angle, 0]} color={c.color} />
        ))}
      </Instances>
    </group>
  )
}

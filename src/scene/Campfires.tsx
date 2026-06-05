/**
 * Campfires — warm gathering spots dotted around the town's open ground.
 * A ring of stones, crossed logs, and animated flames that flicker and bloom
 * against the dusk. The fire glow is emissive (toneMapped:false) so it punches
 * through the bloom pass; no per-fire point light is used, to stay cheap.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

// Open spots on the land, out past the built core, near the coastline.
const SPOTS: [number, number][] = [
  [150, 44],
  [-138, 70],
  [64, -150],
  [-96, -128],
  [128, -96],
]

function Flame({ phase }: { phase: number }) {
  const outer = useRef<Group>(null)
  const inner = useRef<Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const f = 0.8 + Math.abs(Math.sin(t * 9 + phase)) * 0.3 + Math.sin(t * 23 + phase) * 0.06
    if (outer.current) {
      outer.current.scale.set(1, f, 1)
      outer.current.position.x = Math.sin(t * 7 + phase) * 0.05
    }
    if (inner.current) inner.current.scale.set(1, 0.8 + (f - 0.8) * 1.4, 1)
  })
  return (
    <group>
      <group ref={outer}>
        <mesh position={[0, 0.7, 0]}>
          <coneGeometry args={[0.5, 1.6, 8]} />
          <meshStandardMaterial color="#ff8a2a" emissive="#ff6a18" emissiveIntensity={2.6} toneMapped={false} />
        </mesh>
      </group>
      <group ref={inner}>
        <mesh position={[0, 0.55, 0]}>
          <coneGeometry args={[0.28, 1.1, 8]} />
          <meshStandardMaterial color="#ffe08a" emissive="#ffd24a" emissiveIntensity={3.2} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function Campfire({ x, z, seed }: { x: number; z: number; seed: number }) {
  const stones = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2
      return { sx: Math.cos(a) * 1.05, sz: Math.sin(a) * 1.05, ry: (seed + i) * 1.3 }
    })
  }, [seed])

  return (
    <group position={[x, 0, z]}>
      {/* stone ring */}
      {stones.map((s, i) => (
        <mesh key={i} position={[s.sx, 0.16, s.sz]} rotation={[0, s.ry, 0]} castShadow>
          <dodecahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial color="#9a9082" roughness={1} flatShading />
        </mesh>
      ))}
      {/* crossed logs */}
      {[0.5, -0.5].map((r, i) => (
        <mesh key={i} position={[0, 0.2, 0]} rotation={[0, r + i, Math.PI / 2.3]} castShadow>
          <cylinderGeometry args={[0.14, 0.16, 1.5, 6]} />
          <meshStandardMaterial color="#5a4028" roughness={0.95} />
        </mesh>
      ))}
      {/* ember bed */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.1, 12]} />
        <meshStandardMaterial color="#ff7a30" emissive="#ff5a1a" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
      <Flame phase={seed} />
    </group>
  )
}

export function Campfires() {
  return (
    <group>
      {SPOTS.map(([x, z], i) => (
        <Campfire key={i} x={x} z={z} seed={i * 1.7} />
      ))}
    </group>
  )
}

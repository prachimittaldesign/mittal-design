/**
 * Beach — the sand bay on the western shore: a two-tone sand arc (dry sand
 * fading to a wet band where the water laps), parasols with towels beneath,
 * and a few shore palms. The land now meets the sea the way a real coast
 * does — through a beach, not a hard stone ring.
 */

import { useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { BEACH_T0, BEACH_T1 } from './lib/outskirts'
import { LAND_R } from './CoastEnvironment'

const SAND_DRY = '#e8d5a8'
const SAND_WET = '#d4ba8e'
const PARASOLS = ['#e8856a', '#5fa0aa', '#f0dca0', '#dfa6b0', '#8fd0c6']
const TOWELS = ['#f2cda3', '#a9c4cc', '#eec0bb', '#cdd3a8']

// World θ → ringGeometry θ (meshes rotated [-π/2,0,0] mirror the angle).
const ARC_START = -BEACH_T1
const ARC_LEN = BEACH_T1 - BEACH_T0

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface BeachSpot {
  x: number
  z: number
  ry: number
  parasol: number
  towel: number
}

function buildSpots(): BeachSpot[] {
  const rng = mulberry32(88431)
  const out: BeachSpot[] = []
  for (let i = 0; i < 9; i++) {
    // Even spread along the arc, varied depth up the sand.
    const t = BEACH_T0 + ((i + 0.5) / 9) * (BEACH_T1 - BEACH_T0) + (rng() - 0.5) * 0.03
    const r = 187 + rng() * 10
    out.push({
      x: Math.cos(t) * r,
      z: Math.sin(t) * r,
      ry: rng() * Math.PI * 2,
      parasol: Math.floor(rng() * PARASOLS.length),
      towel: Math.floor(rng() * TOWELS.length),
    })
  }
  return out
}

export function Beach() {
  const spots = useMemo(buildSpots, [])

  const palms = useMemo(() => {
    const rng = mulberry32(7261)
    return [109, 122, 136].map((deg) => {
      const t = (deg * Math.PI) / 180
      const r = 182 + rng() * 2
      return { x: Math.cos(t) * r, z: Math.sin(t) * r, scale: 0.75 + rng() * 0.2, lean: (rng() - 0.5) * 0.14 }
    })
  }, [])

  return (
    <group>
      {/* Dry sand — laps over the meadow edge and under the stone ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]} renderOrder={4}>
        <ringGeometry args={[183, LAND_R - 2, 64, 1, ARC_START, ARC_LEN]} />
        <meshStandardMaterial color={SAND_DRY} roughness={1} depthWrite={false} />
      </mesh>
      {/* Wet band where the water reaches */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} renderOrder={5}>
        <ringGeometry args={[LAND_R - 7.5, LAND_R - 2, 64, 1, ARC_START, ARC_LEN]} />
        <meshStandardMaterial color={SAND_WET} roughness={0.85} depthWrite={false} />
      </mesh>

      {/* Parasol poles */}
      <Instances limit={spots.length}>
        <cylinderGeometry args={[0.06, 0.08, 2.6, 5]} />
        <meshStandardMaterial color="#e9e2cf" roughness={0.9} />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x, 1.3, s.z]} />
        ))}
      </Instances>
      {/* Parasol canopies */}
      <Instances limit={spots.length} castShadow>
        <coneGeometry args={[1.7, 0.8, 8]} />
        <meshStandardMaterial roughness={0.9} />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x, 2.6, s.z]} rotation={[0, s.ry, 0]} color={PARASOLS[s.parasol]} />
        ))}
      </Instances>
      {/* Towels beside each parasol */}
      <Instances limit={spots.length}>
        <boxGeometry args={[1.1, 0.06, 2.0]} />
        <meshStandardMaterial roughness={0.95} />
        {spots.map((s, i) => (
          <Instance
            key={i}
            position={[s.x + Math.cos(s.ry) * 1.9, 0.09, s.z + Math.sin(s.ry) * 1.9]}
            rotation={[0, s.ry, 0]}
            color={TOWELS[s.towel]}
          />
        ))}
      </Instances>

      {/* Shore palms at the top of the sand */}
      {palms.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation={[0, 0, p.lean]} scale={p.scale}>
          <mesh position={[0, 3.2, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.3, 6.4, 6]} />
            <meshStandardMaterial color="#8a6b4a" roughness={1} />
          </mesh>
          {Array.from({ length: 7 }, (_, j) => (j / 7) * Math.PI * 2).map((a, j) => (
            <mesh
              key={j}
              position={[Math.cos(a) * 1.1, 6.4, Math.sin(a) * 1.1]}
              rotation={[Math.sin(a) * 0.9, -a, Math.cos(a) * 0.9]}
              castShadow
            >
              <coneGeometry args={[0.42, 2.8, 4]} />
              <meshStandardMaterial color="#5d8c44" roughness={0.95} flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

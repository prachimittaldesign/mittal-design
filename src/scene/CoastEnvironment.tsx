/**
 * CoastEnvironment — the descriptive backdrop shown only in 2D view.
 *
 * Turns the flat map into a cinematic coastal town at dusk (Amalfi-style):
 *   • A vast reflective sea around the city that mirrors the warm window glow.
 *   • A pale stone coastline ring at the land's edge.
 *   • Distant headland silhouettes across the bay, dotted with town lights.
 *   • A few small boats with warm lanterns bobbing on the water.
 *
 * The deep-blue dusk sky + fog (so sea blends seamlessly into the horizon) is
 * driven by DayNight when view==='iso'. This component only owns the geometry.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { Group } from 'three'

// Radius of the land disc rendered by Ground in 2D — the sea begins past this.
export const LAND_R = 206

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Distant headland across the bay ─────────────────────────────────────────────
function Headland({
  x,
  z,
  scale,
  seed,
}: {
  x: number
  z: number
  scale: number
  seed: number
}) {
  const lights = useMemo(() => {
    const r = mulberry32(seed)
    return Array.from({ length: 16 }, () => ({
      lx: (r() - 0.5) * 70 * scale,
      ly: 2 + r() * 26 * scale,
      lz: (r() - 0.5) * 24 * scale,
    }))
  }, [seed, scale])

  return (
    <group position={[x, 0, z]}>
      {/* Hill silhouette — dusk-dark, hazed by fog into the horizon */}
      <mesh position={[0, 14 * scale, 0]}>
        <coneGeometry args={[60 * scale, 40 * scale, 14]} />
        <meshStandardMaterial color="#14233c" roughness={1} />
      </mesh>
      <mesh position={[42 * scale, 9 * scale, 6 * scale]}>
        <coneGeometry args={[40 * scale, 28 * scale, 12]} />
        <meshStandardMaterial color="#162844" roughness={1} />
      </mesh>
      {/* Warm town lights scattered on the slope */}
      {lights.map((l, i) => (
        <mesh key={i} position={[l.lx, l.ly, l.lz]}>
          <sphereGeometry args={[0.7, 6, 6]} />
          <meshStandardMaterial
            color="#ffd27a"
            emissive="#ffb347"
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Small boat with a warm lantern ──────────────────────────────────────────────
interface BoatSpec {
  x: number
  z: number
  ry: number
  bobPhase: number
}

function Boat({ spec }: { spec: BoatSpec }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.position.y = -0.2 + Math.sin(t * 0.8 + spec.bobPhase) * 0.18
      ref.current.rotation.z = Math.sin(t * 0.6 + spec.bobPhase) * 0.04
    }
  })
  return (
    <group position={[spec.x, 0, spec.z]} rotation={[0, spec.ry, 0]}>
      <group ref={ref}>
        {/* Hull */}
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[4.2, 0.7, 1.5]} />
          <meshStandardMaterial color="#d8cfc0" roughness={0.8} />
        </mesh>
        {/* Cabin */}
        <mesh position={[-0.4, 0.6, 0]}>
          <boxGeometry args={[1.6, 0.7, 1.1]} />
          <meshStandardMaterial color="#8a6a48" roughness={0.85} />
        </mesh>
        {/* Mast */}
        <mesh position={[0.8, 1.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 3, 5]} />
          <meshStandardMaterial color="#5a4a36" roughness={1} />
        </mesh>
        {/* Lantern glow */}
        <mesh position={[0.8, 3.0, 0]}>
          <sphereGeometry args={[0.26, 8, 8]} />
          <meshStandardMaterial
            color="#fff0c0"
            emissive="#ffcc66"
            emissiveIntensity={2.6}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

export function CoastEnvironment() {
  const boats = useMemo<BoatSpec[]>(() => {
    const r = mulberry32(4821)
    return Array.from({ length: 6 }, () => {
      const a = (-0.5 + r()) * Math.PI // mostly toward the open water (−z side)
      const dist = 250 + r() * 180
      return {
        x: Math.sin(a) * dist,
        z: -Math.abs(Math.cos(a)) * dist - 40,
        ry: r() * Math.PI * 2,
        bobPhase: r() * Math.PI * 2,
      }
    })
  }, [])

  return (
    <group>
      {/* ── The sea ── a vast reflective disc just below the land. It mirrors the
          lit city, so the warm windows and lamps streak gold across the water. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <circleGeometry args={[1800, 96]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.62}
          blur={[480, 120]}
          mixBlur={12}
          mixStrength={2.4}
          depthScale={1.1}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.5}
          color="#13243d"
          roughness={0.65}
          metalness={0.55}
        />
      </mesh>

      {/* Pale stone coastline ring at the land's edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[LAND_R - 4, LAND_R + 7, 96]} />
        <meshStandardMaterial color="#b8a88a" roughness={0.95} />
      </mesh>
      {/* A darker wet band just below the stone, where the water laps the shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <ringGeometry args={[LAND_R + 7, LAND_R + 16, 96]} />
        <meshStandardMaterial color="#1a3047" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Distant headlands across the bay, hazing into the dusk horizon */}
      <Headland x={-120} z={-820} scale={3.0} seed={101} />
      <Headland x={420} z={-760} scale={2.4} seed={202} />
      <Headland x={-560} z={-640} scale={2.0} seed={303} />

      {/* Boats on the water */}
      {boats.map((b, i) => (
        <Boat key={i} spec={b} />
      ))}
    </group>
  )
}

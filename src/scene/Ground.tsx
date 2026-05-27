import { useEffect, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import type { Quadrant } from '../types'
import { GROUND, PLAZA, ROAD, districtTint } from './lib/cityTheme'
import { CITY_BOUNDS, CITY_RADIUS } from './lib/cityModel'
import { LOT } from './lib/project3d'

const { minX, maxX, minZ, maxZ } = CITY_BOUNDS

interface Quad {
  q: Quadrant
  cx: number
  cz: number
  sx: number
  sz: number
}

const QUADS: Quad[] = [
  { q: 'q1', cx: maxX / 2, cz: minZ / 2, sx: maxX,  sz: -minZ },
  { q: 'q2', cx: minX / 2, cz: minZ / 2, sx: -minX, sz: -minZ },
  { q: 'q3', cx: minX / 2, cz: maxZ / 2, sx: -minX, sz: maxZ  },
  { q: 'q4', cx: maxX / 2, cz: maxZ / 2, sx: maxX,  sz: maxZ  },
]

// ─── Grass tufts ─────────────────────────────────────────────────────────────
// 4 000 low-poly cone instances scattered across the city outside the plaza.
// Instance colours vary across 5 greens; slight random tilt makes them feel
// organic. InstancedMesh keeps this to a single draw-call.
const TUFT_GREENS = ['#2d6b1e', '#3a7f28', '#4a9035', '#226018', '#53a040']
const TUFT_COUNT  = 4000
const PLAZA_CLEAR = LOT * 1.6   // radius to leave clean around the monument

function GrassTufts() {
  const ref = useRef<InstancedMesh>(null)

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    let placed = 0

    for (let attempt = 0; placed < TUFT_COUNT && attempt < TUFT_COUNT * 6; attempt++) {
      const angle = Math.random() * Math.PI * 2
      const r     = PLAZA_CLEAR + Math.random() * CITY_RADIUS * 1.1
      const x     = Math.cos(angle) * r
      const z     = Math.sin(angle) * r

      // Keep clear of the central monument
      if (x * x + z * z < PLAZA_CLEAR * PLAZA_CLEAR) continue

      const h = 0.5 + Math.random() * 2.0
      dummy.position.set(x, h * 0.5, z)
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.35,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.35,
      )
      dummy.scale.set(0.4 + Math.random() * 0.7, h, 0.4 + Math.random() * 0.7)
      dummy.updateMatrix()
      mesh.setMatrixAt(placed, dummy.matrix)
      color.set(TUFT_GREENS[Math.floor(Math.random() * TUFT_GREENS.length)])
      mesh.setColorAt(placed, color)
      placed++
    }

    mesh.count = placed
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, TUFT_COUNT]} castShadow receiveShadow>
      <coneGeometry args={[0.55, 2, 5]} />
      <meshStandardMaterial roughness={0.88} metalness={0} vertexColors />
    </instancedMesh>
  )
}

// ─── Wildflowers ─────────────────────────────────────────────────────────────
// 600 tiny bright spheres scattered sparsely in the grass — white, pale yellow,
// and soft lavender — adding the colour variety of a real meadow.
const FLOWER_COLORS = ['#f5f0e0', '#fce97a', '#e8e8f8', '#ffd6e0', '#c8f0c0']
const FLOWER_COUNT  = 600

function Wildflowers() {
  const ref = useRef<InstancedMesh>(null)

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    let placed = 0

    for (let attempt = 0; placed < FLOWER_COUNT && attempt < FLOWER_COUNT * 8; attempt++) {
      const angle = Math.random() * Math.PI * 2
      const r     = PLAZA_CLEAR + Math.random() * CITY_RADIUS * 1.0
      const x     = Math.cos(angle) * r
      const z     = Math.sin(angle) * r
      if (x * x + z * z < PLAZA_CLEAR * PLAZA_CLEAR) continue

      const h = 0.6 + Math.random() * 1.4
      dummy.position.set(x, h + 0.18, z)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      dummy.scale.setScalar(0.18 + Math.random() * 0.22)
      dummy.updateMatrix()
      mesh.setMatrixAt(placed, dummy.matrix)
      color.set(FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)])
      mesh.setColorAt(placed, color)
      placed++
    }

    mesh.count = placed
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, FLOWER_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        roughness={0.5}
        metalness={0}
        vertexColors
        emissiveIntensity={0.3}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

// ─── Ground ──────────────────────────────────────────────────────────────────
export function Ground() {
  const span = CITY_RADIUS * 2.4

  return (
    <group>
      {/* Deep-green base — the dark soil beneath the grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[span, span]} />
        <meshStandardMaterial color={GROUND} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* Mid-tone grass layer — slightly lighter green for surface variation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[span * 0.85, span * 0.85]} />
        <meshStandardMaterial color="#3d7228" roughness={0.92} metalness={0.0} />
      </mesh>

      {/* District tints — very subtle over the green, just enough to hint zones */}
      {QUADS.map((qd) => (
        <mesh
          key={qd.q}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[qd.cx, 0.03, qd.cz]}
        >
          <planeGeometry args={[qd.sx, qd.sz]} />
          <meshBasicMaterial
            color={districtTint(qd.q)}
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Instanced grass tufts — 4 000 low-poly cone blades across the field */}
      <GrassTufts />

      {/* Wildflowers — 600 tiny bright spheres like a real meadow */}
      <Wildflowers />

      {/* Central plaza — deep moss circle, clean of grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[LOT * 1.1, 64]} />
        <meshStandardMaterial color={PLAZA} roughness={0.9} />
      </mesh>

      {/* Roundabout ring road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[LOT * 0.52, LOT * 0.76, 64]} />
        <meshBasicMaterial color={ROAD} />
      </mesh>

      {/* Central obelisk / monument */}
      {/* Base */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 3.0, 1.6, 8]} />
        <meshStandardMaterial color="#8a7050" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Middle plinth */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[2.8, 1.2, 2.8]} />
        <meshStandardMaterial color="#7a6040" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 6.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.9, 7.8, 4]} />
        <meshStandardMaterial color="#c8a870" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Glowing golden tip */}
      <mesh position={[0, 10.6, 0]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ffaa00"
          emissiveIntensity={3.5}
          roughness={0.1}
          metalness={0.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

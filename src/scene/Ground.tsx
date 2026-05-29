import { useEffect, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import type { Quadrant } from '../types'
import { GROUND, PLAZA, ROAD, districtTint } from './lib/cityTheme'
import { CITY_BOUNDS, CITY_RADIUS } from './lib/cityModel'
import { LOT } from './lib/project3d'
import { POND_CENTER, POND_CLEAR } from './Pond'

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

// ─── Grass ───────────────────────────────────────────────────────────────────
// Short, soft, low-saturation tufts laid densely so the field reads as turf
// texture — not spiky toy blades. Greens are muted sage/olive for a calm,
// cohesive (Bruno-Simon-like) palette. Tufts reach out to the fog distance so
// the field's edge dissolves into the horizon rather than ending in a hard ring.
const TUFT_GREENS = ['#5c6b45', '#697a50', '#52613c', '#5f7048', '#737f5a']
const TUFT_COUNT  = 6000
const PLAZA_CLEAR = LOT * 1.5
const FIELD_R     = CITY_RADIUS * 1.7   // sits inside the fog so the rim fades out

function GrassTufts() {
  const ref = useRef<InstancedMesh>(null)

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    let placed = 0

    for (let attempt = 0; placed < TUFT_COUNT && attempt < TUFT_COUNT * 6; attempt++) {
      // sqrt() distribution → even density across the disc (no centre clumping)
      const angle = Math.random() * Math.PI * 2
      const r     = PLAZA_CLEAR + Math.sqrt(Math.random()) * FIELD_R
      const x     = Math.cos(angle) * r
      const z     = Math.sin(angle) * r
      if (x * x + z * z < PLAZA_CLEAR * PLAZA_CLEAR) continue
      const pdx = x - POND_CENTER[0]
      const pdz = z - POND_CENTER[1]
      if (pdx * pdx + pdz * pdz < POND_CLEAR * POND_CLEAR) continue

      // Short and soft — gentle bumps of turf, not tall spikes.
      const h = 0.28 + Math.random() * 0.55
      dummy.position.set(x, h * 0.5, z)
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.18,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.18,
      )
      dummy.scale.set(0.6 + Math.random() * 0.5, h, 0.6 + Math.random() * 0.5)
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
      <coneGeometry args={[0.7, 1, 6]} />
      <meshStandardMaterial roughness={0.95} metalness={0} flatShading />
    </instancedMesh>
  )
}

// ─── Wildflowers ─────────────────────────────────────────────────────────────
// A restrained scatter — just two soft tones (warm cream + pale gold), tiny and
// matte. Enough to suggest life without the rainbow-confetti look.
const FLOWER_COLORS = ['#e9e2cf', '#dcd0a6']
const FLOWER_COUNT  = 130

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
      const r     = PLAZA_CLEAR + Math.sqrt(Math.random()) * CITY_RADIUS * 1.1
      const x     = Math.cos(angle) * r
      const z     = Math.sin(angle) * r
      if (x * x + z * z < PLAZA_CLEAR * PLAZA_CLEAR) continue
      const pdx = x - POND_CENTER[0]
      const pdz = z - POND_CENTER[1]
      if (pdx * pdx + pdz * pdz < POND_CLEAR * POND_CLEAR) continue

      dummy.position.set(x, 0.5, z)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      dummy.scale.setScalar(0.12 + Math.random() * 0.12)
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
      <meshStandardMaterial roughness={0.7} metalness={0} />
    </instancedMesh>
  )
}

// ─── Ground ──────────────────────────────────────────────────────────────────
export function Ground() {
  const span = CITY_RADIUS * 2.4

  return (
    <group>
      {/* Soft matte meadow base — muted, cohesive green */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[span, span]} />
        <meshStandardMaterial color={GROUND} roughness={1} metalness={0.0} />
      </mesh>

      {/* District tints — barely there, just a whisper of zone colour */}
      {QUADS.map((qd) => (
        <mesh
          key={qd.q}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[qd.cx, 0.02, qd.cz]}
        >
          <planeGeometry args={[qd.sx, qd.sz]} />
          <meshBasicMaterial
            color={districtTint(qd.q)}
            transparent
            opacity={0.05}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Dense, short, muted grass — reads as soft turf, fades into the fog */}
      <GrassTufts />

      {/* A restrained two-tone wildflower scatter */}
      <Wildflowers />

      {/* Central plaza — calm moss circle, clear of grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[LOT * 1.1, 64]} />
        <meshStandardMaterial color={PLAZA} roughness={0.95} />
      </mesh>

      {/* Roundabout ring road — circles the monument inside the plaza island.
          depthWrite:false + renderOrder keeps it in the road layer's paint
          stack so it never z-fights the carriageway feeding the roundabout. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} renderOrder={2}>
        <ringGeometry args={[LOT * 0.52, LOT * 0.76, 64]} />
        <meshBasicMaterial color={ROAD} depthWrite={false} />
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
      {/* Glowing golden tip — softer than before */}
      <mesh position={[0, 10.6, 0]}>
        <sphereGeometry args={[0.32, 12, 12]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ffaa00"
          emissiveIntensity={2.0}
          roughness={0.2}
          metalness={0.7}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import { Color, InstancedMesh, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry } from 'three'

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Pond placement — sits where the old waterfall peak stood (back-left, in the
// grass). Exported so the grass field can clear a circle for it.
export const POND_CENTER: [number, number] = [-78, -68]
export const POND_CLEAR = 24

const RX = 15 // pond radius along x
const RZ = 11 // pond radius along z

// An organic, wobbly blob outline — never a clean circle, so it reads natural.
function makeBlob(rx: number, rz: number, seed: number): ShapeGeometry {
  const rand = mulberry32(seed)
  const shape = new Shape()
  const segs = 56
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2
    const w =
      1 + Math.sin(a * 3 + 0.6) * 0.1 + Math.sin(a * 5 + 2.0) * 0.06 + (rand() - 0.5) * 0.04
    const x = Math.cos(a) * rx * w
    const y = Math.sin(a) * rz * w
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  return new ShapeGeometry(shape, 36)
}

// ─── Reeds ───────────────────────────────────────────────────────────────────
// Tall thin blades clustered just outside the water's edge.
const REED_GREENS = ['#4e6b32', '#5d7a3c', '#6b8347', '#46602e', '#74824a']

function Reeds() {
  const ref = useRef<InstancedMesh>(null)
  const COUNT = 220

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    const rand = mulberry32(9931)
    let placed = 0

    for (let i = 0; i < COUNT; i++) {
      const a = rand() * Math.PI * 2
      const edge = 1.0 + rand() * 0.42 // ring just beyond the shoreline
      const x = Math.cos(a) * RX * edge + (rand() - 0.5) * 2.2
      const z = Math.sin(a) * RZ * edge + (rand() - 0.5) * 2.2
      const h = 2.4 + rand() * 3.6
      dummy.position.set(x, h * 0.5, z)
      dummy.rotation.set((rand() - 0.5) * 0.42, rand() * Math.PI * 2, (rand() - 0.5) * 0.42)
      dummy.scale.set(0.5 + rand() * 0.5, h, 0.5 + rand() * 0.5)
      dummy.updateMatrix()
      mesh.setMatrixAt(placed, dummy.matrix)
      color.set(REED_GREENS[Math.floor(rand() * REED_GREENS.length)])
      mesh.setColorAt(placed, color)
      placed++
    }
    mesh.count = placed
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} castShadow>
      <coneGeometry args={[0.13, 1, 4]} />
      <meshStandardMaterial roughness={0.9} metalness={0} vertexColors flatShading />
    </instancedMesh>
  )
}

// ─── Ripples ─────────────────────────────────────────────────────────────────
function ripple(m: Mesh | null, p: number) {
  if (!m) return
  const s = 1.5 + p * 7
  m.scale.set(s, s, 1)
  ;(m.material as MeshBasicMaterial).opacity = (1 - p) * 0.28
}

// ─── Pond ────────────────────────────────────────────────────────────────────
export function Pond() {
  const r1 = useRef<Mesh>(null)
  const r2 = useRef<Mesh>(null)

  const waterGeom = useMemo(() => makeBlob(RX, RZ, 4242), [])
  const mudGeom = useMemo(() => makeBlob(RX * 1.16, RZ * 1.18, 4242), [])

  // A handful of cattails — thin stalks with a soft brown head near the top.
  const cattails = useMemo(() => {
    const rand = mulberry32(5577)
    return Array.from({ length: 14 }, () => {
      const a = rand() * Math.PI * 2
      const edge = 1.05 + rand() * 0.32
      return {
        x: Math.cos(a) * RX * edge,
        z: Math.sin(a) * RZ * edge,
        h: 4 + rand() * 2.8,
        lean: (rand() - 0.5) * 0.3,
        rot: rand() * Math.PI * 2,
      }
    })
  }, [])

  // Lily pads floating on the surface; a few carry a small flower.
  const pads = useMemo(() => {
    const rand = mulberry32(2243)
    return Array.from({ length: 7 }, () => {
      const a = rand() * Math.PI * 2
      const rr = rand() * 0.66
      return {
        x: Math.cos(a) * RX * rr,
        z: Math.sin(a) * RZ * rr,
        s: 0.8 + rand() * 1.0,
        flower: rand() > 0.6,
        rot: rand() * Math.PI * 2,
      }
    })
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ripple(r1.current, (t % 4) / 4)
    ripple(r2.current, ((t + 2) % 4) / 4)
  })

  return (
    <group position={[POND_CENTER[0], 0, POND_CENTER[1]]}>
      {/* Wet mud / sand shoreline band around the water */}
      <mesh geometry={mudGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} receiveShadow>
        <meshStandardMaterial color="#46412c" roughness={1} metalness={0} />
      </mesh>

      {/* Reflective water surface — mirrors the world for a real wet look */}
      <mesh geometry={waterGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.26, 0]}>
        <MeshReflectorMaterial
          resolution={256}
          mirror={0.55}
          blur={[200, 60]}
          mixBlur={10}
          mixStrength={1.6}
          depthScale={0.7}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.2}
          color="#43594c"
          roughness={0.85}
          metalness={0.2}
        />
      </mesh>

      {/* Expanding ripple rings for gentle surface life */}
      <mesh ref={r1} rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.3, -1]}>
        <ringGeometry args={[0.82, 1, 32]} />
        <meshBasicMaterial color="#dfeae4" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={r2} rotation={[-Math.PI / 2, 0, 0]} position={[-3, 0.3, 2]}>
        <ringGeometry args={[0.82, 1, 32]} />
        <meshBasicMaterial color="#dfeae4" transparent opacity={0} depthWrite={false} />
      </mesh>

      <Reeds />

      {/* Cattails */}
      {cattails.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]} rotation={[c.lean, c.rot, c.lean * 0.6]}>
          <mesh position={[0, c.h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, c.h, 5]} />
            <meshStandardMaterial color="#5c7038" roughness={0.9} />
          </mesh>
          <mesh position={[0, c.h - 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 1.1, 8]} />
            <meshStandardMaterial color="#6b4a28" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Lily pads */}
      {pads.map((p, i) => (
        <group key={i} position={[p.x, 0.3, p.z]} rotation={[0, p.rot, 0]}>
          <mesh scale={[p.s, 1, p.s]}>
            <cylinderGeometry args={[1, 1, 0.06, 14]} />
            <meshStandardMaterial color="#2f5135" roughness={0.7} metalness={0} />
          </mesh>
          {p.flower && (
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.22, 8, 8]} />
              <meshStandardMaterial color="#e7c6d6" roughness={0.6} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Group, InstancedMesh, Mesh, MeshBasicMaterial, Object3D, Shape, ShapeGeometry } from 'three'

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
export const POND_CENTER: [number, number] = [-104, -42]
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
      <meshStandardMaterial roughness={0.9} metalness={0} flatShading />
    </instancedMesh>
  )
}

// ─── Ripples ─────────────────────────────────────────────────────────────────
function ripple(m: Mesh | null, p: number) {
  if (!m) return
  const s = 1.2 + p * 6
  m.scale.set(s, s, 1)
  ;(m.material as MeshBasicMaterial).opacity = Math.sin(Math.min(p, 1) * Math.PI) * 0.3
}

// ─── Ducks ───────────────────────────────────────────────────────────────────
// Two tiny stylised ducks paddling a lazy ellipse, leaving the ripples behind.
function Duck({ phase, dir, tint }: { phase: number; dir: 1 | -1; tint: string }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime * 0.14 * dir + phase
    const x = Math.cos(t) * RX * 0.52
    const z = Math.sin(t) * RZ * 0.5
    g.position.set(x, 0.42 + Math.sin(state.clock.elapsedTime * 1.7 + phase) * 0.05, z)
    // face along the direction of travel
    g.rotation.y = -t + (dir === 1 ? Math.PI : 0)
  })
  return (
    <group ref={ref}>
      {/* body */}
      <mesh castShadow scale={[1.15, 0.75, 0.8]}>
        <sphereGeometry args={[0.62, 10, 8]} />
        <meshStandardMaterial color={tint} roughness={0.85} />
      </mesh>
      {/* tail flick */}
      <mesh position={[-0.62, 0.18, 0]} rotation={[0, 0, 0.7]} scale={[0.5, 0.28, 0.3]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={tint} roughness={0.85} />
      </mesh>
      {/* head */}
      <mesh position={[0.52, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.32, 10, 8]} />
        <meshStandardMaterial color={tint} roughness={0.85} />
      </mesh>
      {/* beak */}
      <mesh position={[0.88, 0.48, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.12, 0.3, 6]} />
        <meshStandardMaterial color="#e8933a" roughness={0.7} />
      </mesh>
    </group>
  )
}

// ─── Pond ────────────────────────────────────────────────────────────────────
// The water is deliberately NOT a planar reflector: MeshReflectorMaterial
// re-renders the whole city into a low-res FBO every frame, and its depth-blur
// pass broke into flickering blocky artifacts (the glass towers' window
// rectangles). Instead the surface is a glossy physical material that picks up
// the live sky/cloud environment cube — soft, stable reflections at zero extra
// render cost — layered over a darker depth blob so the middle reads deep.
export function Pond() {
  const r1 = useRef<Mesh>(null)
  const r2 = useRef<Mesh>(null)
  const r3 = useRef<Mesh>(null)
  const padsRef = useRef<Group>(null)

  const waterGeom = useMemo(() => makeBlob(RX, RZ, 4242), [])
  const foamGeom = useMemo(() => makeBlob(RX, RZ, 4242), []) // same outline, scaled up a hair
  const depthGeom = useMemo(() => makeBlob(RX * 0.6, RZ * 0.58, 4243), [])
  const sandGeom = useMemo(() => makeBlob(RX * 1.09, RZ * 1.1, 4242), [])
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
        bob: rand() * Math.PI * 2,
      }
    })
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ripple(r1.current, (t % 5) / 5)
    ripple(r2.current, ((t + 1.7) % 5) / 5)
    ripple(r3.current, ((t + 3.4) % 5) / 5)
    // Lily pads ride a slow swell — tiny bob + drift-in-place rotation.
    const g = padsRef.current
    if (g) {
      g.children.forEach((pad, i) => {
        const p = pads[i]
        if (!p) return
        pad.position.y = Math.sin(t * 0.9 + p.bob) * 0.045
        pad.rotation.y = p.rot + Math.sin(t * 0.22 + p.bob) * 0.12
      })
    }
  })

  return (
    <group position={[POND_CENTER[0], 0, POND_CENTER[1]]}>
      {/* Wet mud shoreline band around the water */}
      <mesh geometry={mudGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <meshStandardMaterial color="#46412c" roughness={1} metalness={0} />
      </mesh>

      {/* Damp sand ring — a lighter waterline between mud and water */}
      <mesh geometry={sandGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.16, 0]} receiveShadow>
        <meshStandardMaterial color="#7c7250" roughness={1} metalness={0} />
      </mesh>

      {/* Foam rim — pale sliver peeking out around the water's edge */}
      <mesh geometry={foamGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.2, 0]} scale={[1.045, 1.045, 1]}>
        <meshBasicMaterial color="#dcebe2" transparent opacity={0.85} />
      </mesh>

      {/* Water surface — glossy, sky-reflecting, slightly transparent */}
      <mesh geometry={waterGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.26, 0]}>
        <meshPhysicalMaterial
          color="#3d7a8c"
          roughness={0.08}
          metalness={0.1}
          envMapIntensity={1.25}
          clearcoat={1}
          clearcoatRoughness={0.12}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Deep centre — darker blob just above the surface so the middle reads deep */}
      <mesh geometry={depthGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <meshBasicMaterial color="#1e4a5c" transparent opacity={0.5} depthWrite={false} />
      </mesh>

      {/* Expanding ripple rings for gentle surface life */}
      <mesh ref={r1} rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.34, -1]}>
        <ringGeometry args={[0.86, 1, 40]} />
        <meshBasicMaterial color="#e6f2ec" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={r2} rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, 0.34, 2]}>
        <ringGeometry args={[0.86, 1, 40]} />
        <meshBasicMaterial color="#e6f2ec" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={r3} rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.34, 3]}>
        <ringGeometry args={[0.86, 1, 40]} />
        <meshBasicMaterial color="#e6f2ec" transparent opacity={0} depthWrite={false} />
      </mesh>

      <Reeds />

      {/* Ducks — one white, one mallard-brown, paddling opposite ways */}
      <Duck phase={0.8} dir={1} tint="#f2ede2" />
      <Duck phase={3.6} dir={-1} tint="#8a6a4a" />

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

      {/* Lily pads — bobbed and drifted from useFrame via padsRef */}
      <group ref={padsRef}>
        {pads.map((p, i) => (
          <group key={i} position={[p.x, 0.36, p.z]} rotation={[0, p.rot, 0]}>
            <mesh scale={[p.s, 1, p.s]}>
              <cylinderGeometry args={[1, 1, 0.06, 14]} />
              <meshStandardMaterial color="#3a6b42" roughness={0.55} />
            </mesh>
            {/* notch highlight — a lighter wedge makes each pad read as a leaf */}
            <mesh position={[p.s * 0.3, 0.045, 0]} scale={[p.s * 0.5, 1, p.s * 0.5]}>
              <cylinderGeometry args={[0.5, 0.5, 0.02, 10]} />
              <meshStandardMaterial color="#4d8354" roughness={0.6} />
            </mesh>
            {p.flower && (
              <group position={[0, 0.16, 0]}>
                <mesh>
                  <sphereGeometry args={[0.24, 8, 8]} />
                  <meshStandardMaterial color="#f0c9dc" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.14, 0]}>
                  <sphereGeometry args={[0.1, 6, 6]} />
                  <meshStandardMaterial color="#f5df6e" roughness={0.5} emissive="#f5df6e" emissiveIntensity={0.25} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>
    </group>
  )
}

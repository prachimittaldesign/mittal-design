/**
 * Constellations — a quiet field of stars across the dusk/night sky, plus a
 * line-connected Orion hung high in the −Z sky, over "The Future" gateway.
 *
 * Star materials disable fog and toneMapping so the points stay crisp and bloom
 * gently against the deep-blue sky instead of fading into the haze.
 * Stars fade out during Hyderabad daytime and appear only at dusk/night.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  Mesh,
  PointsMaterial,
} from 'three'
import { nightFactor } from '../lib/sky'

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Scattered star field across the upper sky ───────────────────────────────
function StarField() {
  const geom = useMemo(() => {
    const N = 360
    const pos = new Float32Array(N * 3)
    const rnd = mulberry32(20260605)
    for (let i = 0; i < N; i++) {
      const theta = rnd() * Math.PI * 2
      const cosPhi = 0.18 + rnd() * 0.82 // bias toward the upper dome
      const sinPhi = Math.sqrt(1 - cosPhi * cosPhi)
      const R = 820 + rnd() * 240
      pos[i * 3] = R * sinPhi * Math.cos(theta)
      pos[i * 3 + 1] = R * cosPhi
      pos[i * 3 + 2] = R * sinPhi * Math.sin(theta)
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(pos, 3))
    return g
  }, [])

  const matRef = useRef<PointsMaterial>(null)
  useFrame((state) => {
    if (!matRef.current) return
    const nf = nightFactor()
    // Whole-field shimmer — barely-there breathing of brightness, scaled by night factor.
    matRef.current.opacity = nf * (0.72 + Math.sin(state.clock.elapsedTime * 0.6) * 0.12)
    matRef.current.visible = nf > 0.01
  })

  return (
    <points geometry={geom}>
      <pointsMaterial
        ref={matRef}
        color="#eaf1ff"
        size={2.0}
        sizeAttenuation={false}
        transparent
        opacity={0.8}
        depthWrite={false}
        toneMapped={false}
        fog={false}
      />
    </points>
  )
}

// ─── Orion ────────────────────────────────────────────────────────────────────
// Local star-map coords (x right, y up), scaled and hung in the −Z sky.
interface OStar {
  name: string
  lx: number
  ly: number
  size: number
  color: string
}
const ORION: OStar[] = [
  { name: 'Bellatrix', lx: -0.5, ly: 0.92, size: 0.95, color: '#cfe0ff' },
  { name: 'Betelgeuse', lx: 0.52, ly: 0.88, size: 1.35, color: '#ffb38a' },
  { name: 'Mintaka', lx: -0.18, ly: 0.06, size: 0.9, color: '#dbe6ff' },
  { name: 'Alnilam', lx: 0.0, ly: 0.0, size: 1.05, color: '#e6efff' },
  { name: 'Alnitak', lx: 0.18, ly: -0.05, size: 0.95, color: '#dbe6ff' },
  { name: 'Saiph', lx: 0.4, ly: -0.9, size: 1.0, color: '#cfe0ff' },
  { name: 'Rigel', lx: -0.5, ly: -0.95, size: 1.3, color: '#dbeaff' },
]
// Classic stick-figure edges (indices into ORION).
const EDGES: [number, number][] = [
  [0, 1], // shoulders
  [0, 2], // Bellatrix → belt
  [1, 4], // Betelgeuse → belt
  [2, 3], [3, 4], // the belt
  [2, 6], // belt → Rigel
  [4, 5], // belt → Saiph
  [5, 6], // feet
]

// Hung high in the sky toward the future (−Z).
const CENTER: [number, number, number] = [0, 240, -660]
const SCALE = 78

function Orion() {
  const starRefs = useRef<(Mesh | null)[]>([])
  const lineMatRef = useRef<LineBasicMaterial>(null)

  const lineGeom = useMemo(() => {
    const pts: number[] = []
    for (const [a, b] of EDGES) {
      for (const idx of [a, b]) {
        pts.push(CENTER[0] + ORION[idx].lx * SCALE, CENTER[1] + ORION[idx].ly * SCALE, CENTER[2])
      }
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(pts, 3))
    return g
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const nf = nightFactor()
    starRefs.current.forEach((m, i) => {
      if (m) m.scale.setScalar(nf * (1 + Math.sin(t * 1.4 + i * 1.7) * 0.12))
    })
    if (lineMatRef.current) {
      lineMatRef.current.opacity = nf * 0.3
      lineMatRef.current.visible = nf > 0.01
    }
  })

  return (
    <group>
      {/* faint connecting lines */}
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          ref={lineMatRef}
          color="#9fc0ff"
          transparent
          opacity={0.3}
          depthWrite={false}
          toneMapped={false}
          fog={false}
        />
      </lineSegments>

      {/* stars */}
      {ORION.map((s, i) => (
        <mesh
          key={s.name}
          ref={(el) => (starRefs.current[i] = el)}
          position={[CENTER[0] + s.lx * SCALE, CENTER[1] + s.ly * SCALE, CENTER[2]]}
        >
          <sphereGeometry args={[s.size * 2.2, 12, 12]} />
          <meshBasicMaterial color={s.color} toneMapped={false} fog={false} />
        </mesh>
      ))}
    </group>
  )
}

export function Constellations() {
  const ref = useRef<Group>(null)
  return (
    <group ref={ref}>
      <StarField />
      <Orion />
    </group>
  )
}

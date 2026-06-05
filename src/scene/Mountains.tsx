import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  MathUtils,
  MeshStandardMaterial,
  Vector3,
} from 'three'
import { easing } from 'maath'
import { MOUNTAIN_SNOW } from './lib/cityTheme'
import type { ViewMode } from '../types'

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface V {
  x: number
  y: number
  z: number
}

// Cool, hazy slate tones — atmospheric perspective reads as "far away".
const ROCK = ['#7a8694', '#6f7b8a', '#84909d', '#727e8c', '#7e8a98']

// Build one merged geometry of jagged peaks. Each peak is an irregular pyramid:
// a jittered base ring, a jittered mid ring (the "shoulders"), and an
// off-centre apex — so no two peaks share a silhouette and none read as a clean
// cone. Snow is blended into the vertex colours above each peak's snowline, and
// the base is darkened for a faked ambient-occlusion gradient.
function buildRange(): BufferGeometry {
  const positions: number[] = []
  const colors: number[] = []
  const rand = mulberry32(70771)
  const snow = new Color(MOUNTAIN_SNOW)
  const rockC = new Color()
  const tmp = new Color()
  const count = 34

  const colorFor = (y: number, height: number, snowline: number): Color => {
    const shade = 0.58 + 0.42 * (y / height) // darker at the base
    tmp.copy(rockC).multiplyScalar(shade)
    if (snowline < height) {
      let t = (y - snowline) / (height - snowline)
      t = Math.max(0, Math.min(1, t))
      t = t * t * (3 - 2 * t) // smoothstep
      tmp.lerp(snow, t * 0.9)
    }
    return tmp
  }

  const addVert = (p: V, height: number, snowline: number) => {
    const c = colorFor(p.y, height, snowline)
    positions.push(p.x, p.y, p.z)
    colors.push(c.r, c.g, c.b)
  }
  const addTri = (a: V, b: V, c: V, height: number, snowline: number) => {
    addVert(a, height, snowline)
    addVert(b, height, snowline)
    addVert(c, height, snowline)
  }

  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.12
    const r = 168 + rand() * 80
    const px = Math.cos(a) * r
    const pz = Math.sin(a) * r
    const height = 42 + rand() * 76
    const baseR = 26 + rand() * 32
    const snowline = height * (0.64 + rand() * 0.12)
    rockC.set(ROCK[i % ROCK.length])

    const nSeg = 7 + Math.floor(rand() * 3)
    const a0 = rand() * Math.PI * 2
    const ax = (rand() - 0.5) * baseR * 0.6 // apex lean
    const az = (rand() - 0.5) * baseR * 0.6
    const mid = height * (0.4 + (rand() - 0.5) * 0.12)

    const ring0: V[] = []
    const ring1: V[] = []
    for (let s = 0; s < nSeg; s++) {
      const ang = a0 + (s / nSeg) * Math.PI * 2
      const rad0 = baseR * (0.78 + rand() * 0.46)
      ring0.push({ x: px + Math.cos(ang) * rad0, y: -4, z: pz + Math.sin(ang) * rad0 })
      const rad1 = baseR * (0.3 + rand() * 0.28)
      ring1.push({
        x: px + ax * 0.5 + Math.cos(ang) * rad1,
        y: mid * (0.82 + rand() * 0.36),
        z: pz + az * 0.5 + Math.sin(ang) * rad1,
      })
    }
    const apex: V = { x: px + ax, y: height, z: pz + az }

    for (let s = 0; s < nSeg; s++) {
      const n = (s + 1) % nSeg
      // lower band (base ring → mid ring)
      addTri(ring0[s], ring1[s], ring0[n], height, snowline)
      addTri(ring0[n], ring1[s], ring1[n], height, snowline)
      // upper band (mid ring → apex)
      addTri(ring1[s], apex, ring1[n], height, snowline)
    }
  }

  const geom = new BufferGeometry()
  geom.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geom.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geom.computeVertexNormals()
  return geom
}

// A jagged peak range ringing the city. It stays hidden in the aerial/map
// vantage and fades in only as the camera tilts down toward the horizon, so it
// reveals itself like a real range coming into view rather than always sitting
// there as obvious cones.
export function Mountains({ view }: { view: ViewMode }) {
  const geom = useMemo(buildRange, [])
  const matRef = useRef<MeshStandardMaterial>(null)
  const camera = useThree((s) => s.camera)
  const dir = useMemo(() => new Vector3(), [])

  useFrame((_, dt) => {
    const m = matRef.current
    if (!m) return
    // Hidden in skyline (would hide the buildings) and in 2D coastal view
    // (would block the sea / dusk horizon). Mountains belong to the 3D vantage.
    if (view === 'skyline' || view === 'iso') {
      easing.damp(m, 'opacity', 0, 0.2, dt)
      m.visible = m.opacity > 0.02
      return
    }
    camera.getWorldDirection(dir)
    // dir.y ≈ -0.95 straight-down, ≈ -0.41 at the most horizontal tilt allowed.
    // Reveal as the view tilts past the default aerial toward the horizon.
    const target = MathUtils.smoothstep(dir.y, -0.6, -0.44)
    easing.damp(m, 'opacity', target, 0.3, dt)
    m.visible = m.opacity > 0.02
  })

  return (
    <mesh geometry={geom} frustumCulled={false}>
      <meshStandardMaterial
        ref={matRef}
        vertexColors
        flatShading
        roughness={1}
        metalness={0}
        side={DoubleSide}
        transparent
        opacity={0}
      />
    </mesh>
  )
}

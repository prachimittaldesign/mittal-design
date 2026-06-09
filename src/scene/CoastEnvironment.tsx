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
import { AdditiveBlending, Group, ShaderMaterial } from 'three'

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

// ─── Subtle animated wave overlay ────────────────────────────────────────────
// A wide thin disc above the reflector that paints scrolling wave bands and
// caustic glints. Two layers of slow sine noise modulate a soft turquoise
// highlight — gives the static reflector a living, breathing sea surface
// without breaking the bloom budget.
const WAVE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`
const WAVE_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uLandR;
  varying vec2 vUv;
  varying vec3 vWorld;

  // smooth pseudo-noise from layered sines — cheap, no texture
  float wave(vec2 p, float t) {
    float a = sin(p.x * 0.06 + t * 0.45) + sin(p.y * 0.05 - t * 0.38);
    float b = sin((p.x + p.y) * 0.04 + t * 0.32) + sin((p.x - p.y) * 0.045 - t * 0.28);
    return (a + b) * 0.25; // ~[-1, 1]
  }

  void main() {
    float r = length(vWorld.xz);
    // Stay completely off the land/stone/wet rings — fade in past the
    // outer wet-band edge (LAND_R + 16) so the overlay never z-fights any
    // opaque ring near the coastline.
    float landFade = smoothstep(uLandR + 18.0, uLandR + 42.0, r);
    // Atmospheric falloff toward the deep horizon so the wave glints don't
    // tile across the entire 1800u sea.
    float farFade = 1.0 - smoothstep(450.0, 1100.0, r);

    float w1 = wave(vWorld.xz, uTime);
    float w2 = wave(vWorld.xz * 2.4 + vec2(120.0, -80.0), uTime * 1.3);

    // Slow large-scale tonal variation — turquoise deepens / lightens.
    float tonal = 0.5 + 0.5 * w1;
    vec3 deep = vec3(0.05, 0.32, 0.42);   // deep Amalfi teal
    vec3 shallow = vec3(0.18, 0.55, 0.62); // brighter turquoise crest
    vec3 sea = mix(deep, shallow, tonal * 0.7);

    // Crisp wave crests — additive highlights, very subtle.
    float crest = smoothstep(0.55, 0.95, w2);
    sea += vec3(0.35, 0.55, 0.55) * crest * 0.4;

    float alpha = landFade * farFade * 0.55;
    gl_FragColor = vec4(sea, alpha);
  }
`

function SeaWaves({ landR }: { landR: number }) {
  const matRef = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uLandR: { value: landR } }),
    [landR],
  )
  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} renderOrder={0}>
      <circleGeometry args={[1700, 96]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={WAVE_VERT}
        fragmentShader={WAVE_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Soft white surf ring along the coastline ─────────────────────────────────
// A thin animated band that pulses just outside the stone shore — the foam that
// laps the rocks. Two staggered sine pulses keep it from looking metronomic.
function CoastSurf({ landR }: { landR: number }) {
  const matRef = useRef<ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })
  const surfVert = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  const surfFrag = /* glsl */ `
    precision highp float;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      // vUv.y = 0 (inner edge / shore) → 1 (outer edge / open sea)
      float band = smoothstep(0.0, 0.35, vUv.y) * (1.0 - smoothstep(0.5, 1.0, vUv.y));
      // Angular sine — gentle, irregular pulse around the ring
      float a = vUv.x * 6.2831853;
      float pulse = 0.5 + 0.5 * sin(a * 18.0 + uTime * 0.7);
      pulse *= 0.5 + 0.5 * sin(a * 7.0 - uTime * 0.45);
      float alpha = band * (0.18 + 0.4 * pulse);
      gl_FragColor = vec4(0.9, 0.97, 1.0, alpha);
    }
  `
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.12, 0]} renderOrder={5}>
      {/* Begins past the stone outer edge (LAND_R + 7) so it never overlaps
          the stone ring. Sits above the wet band — foam reads on top of the
          rocks, where waves crash. */}
      <ringGeometry args={[landR + 8, landR + 22, 128, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={surfVert}
        fragmentShader={surfFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  )
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
      {/* Hill silhouette — warm Amalfi limestone cliffs */}
      <mesh position={[0, 14 * scale, 0]}>
        <coneGeometry args={[60 * scale, 40 * scale, 14]} />
        <meshStandardMaterial color="#8a7860" roughness={0.9} />
      </mesh>
      <mesh position={[42 * scale, 9 * scale, 6 * scale]}>
        <coneGeometry args={[40 * scale, 28 * scale, 12]} />
        <meshStandardMaterial color="#9e8a6e" roughness={0.92} />
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
      {/* ── The sea ── a vast reflective disc just below the land. Tuned to a
          deep Amalfi turquoise; the wave overlay above paints the lighter
          turquoise highlights and gentle scrolling crests on top. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
        <circleGeometry args={[1800, 96]} />
        <MeshReflectorMaterial
          resolution={512}
          mirror={0.55}
          blur={[520, 140]}
          mixBlur={14}
          mixStrength={2.0}
          depthScale={1.1}
          minDepthThreshold={0.3}
          maxDepthThreshold={1.5}
          color="#0a3e54"
          roughness={0.7}
          metalness={0.45}
        />
      </mesh>

      {/* Animated wave overlay — slow turquoise tonal shift + crisp crest glints. */}
      <SeaWaves landR={LAND_R} />

      {/* Pale stone coastline ring at the land's edge. depthWrite:false +
          renderOrder so it paints cleanly over the ground disc without
          z-fighting the matte meadow underneath. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} renderOrder={3}>
        <ringGeometry args={[LAND_R - 4, LAND_R + 7, 96]} />
        <meshStandardMaterial color="#b8a88a" roughness={0.95} depthWrite={false} />
      </mesh>
      {/* Darker wet band just below sea level, past the stone — submerged
          rocks where the waves lap. No radial overlap with the ground disc
          (which ends at LAND_R + 6), so no z-fight with the meadow. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} renderOrder={1}>
        <ringGeometry args={[LAND_R + 7, LAND_R + 18, 96]} />
        <meshStandardMaterial color="#1d4250" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* Animated white surf pulse along the shoreline */}
      <CoastSurf landR={LAND_R} />

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

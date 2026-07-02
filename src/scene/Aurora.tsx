/**
 * Aurora — northern lights draped across the −Z sky, above the headlands
 * beyond the bay. Only visible at night (driven by nightFactor); fades in at
 * dusk and out at dawn just like the stars.
 *
 * Built as three overlapping curved curtains (cylinder-arc geometry centred on
 * the city) at slightly different radii, colours and drift speeds, so from any
 * orbit angle toward the north the bands read as layered, shifting light. The
 * shader draws vertical aurora "rays" that flicker and sway, with a green base
 * grading up through teal to a magenta crown, and soft fades top and bottom.
 * Additive blending + no fog uniforms means it glows over the night sky and is
 * never dimmed by the scene haze.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, ShaderMaterial, AdditiveBlending } from 'three'
import { easing } from 'maath'
import { nightFactor } from '../lib/sky'
import type { ViewMode } from '../types'

// A curved vertical curtain: an arc of the sky sphere's "wall" spanning the
// northern (−Z) horizon. thetaMid points at −Z (270°); the arc sweeps ±span.
function buildCurtain(radius: number, yBottom: number, yTop: number, span: number): BufferGeometry {
  const nU = 96 // segments around the arc
  const nV = 10 // segments up the height
  const thetaMid = -Math.PI / 2 // −Z
  const t0 = thetaMid - span
  const t1 = thetaMid + span
  const pos: number[] = []
  const uv: number[] = []

  const vert = (iu: number, iv: number) => {
    const u = iu / nU
    const v = iv / nV
    const theta = t0 + (t1 - t0) * u
    // Gentle draped waviness so the curtain isn't a perfect cylinder.
    const r = radius * (1 + Math.sin(u * Math.PI * 3) * 0.04)
    const y = yBottom + (yTop - yBottom) * v
    pos.push(Math.cos(theta) * r, y, Math.sin(theta) * r)
    uv.push(u, v)
  }

  for (let iu = 0; iu < nU; iu++) {
    for (let iv = 0; iv < nV; iv++) {
      // two triangles per quad
      vert(iu, iv); vert(iu + 1, iv); vert(iu, iv + 1)
      vert(iu + 1, iv); vert(iu + 1, iv + 1); vert(iu, iv + 1)
    }
  }

  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2))
  return g
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Cheap value-noise-ish flicker from layered sines — no textures needed.
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform float uSpeed;
  uniform vec3  uLow;   // base colour (green)
  uniform vec3  uMid;   // teal
  uniform vec3  uHigh;  // magenta crown

  void main() {
    float u = vUv.x;
    float v = vUv.y;

    // Vertical "rays": bright columns that drift and vary across the arc.
    float t = uTime * uSpeed;
    float rays =
        0.55 + 0.45 * sin(u * 60.0 + t * 2.0)
      + 0.30 * sin(u * 23.0 - t * 1.3)
      + 0.20 * sin(u * 133.0 + t * 3.1);
    rays = clamp(rays * 0.5 + 0.35, 0.0, 1.0);

    // Slow curtain folds — broad bright/dark hangs that migrate sideways.
    float folds = 0.6 + 0.4 * sin(u * 7.0 + t * 0.5);

    // Vertical shape: rises from a soft base, tapers to wispy tips. A little
    // upward flow makes the light seem to stream skyward.
    float flow = v + 0.06 * sin(u * 40.0 + t * 2.5);
    float bottom = smoothstep(0.0, 0.22, flow);
    float top = 1.0 - smoothstep(0.42, 1.0, flow);
    float shape = bottom * top;

    // Horizontal end fade — the left/right tips of the arc dissolve into the
    // sky instead of stopping on a hard vertical edge. A drifting waver keeps
    // the fade organic rather than a clean gradient.
    float ends = smoothstep(0.0, 0.22, u) * (1.0 - smoothstep(0.78, 1.0, u));
    ends *= 0.9 + 0.1 * sin(u * 9.0 + t * 0.7);

    float intensity = rays * folds * shape * ends;

    // Colour grades green → teal → magenta as it climbs.
    vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.5, v));
    col = mix(col, uHigh, smoothstep(0.55, 1.0, v));

    float alpha = intensity * uOpacity;
    gl_FragColor = vec4(col * (0.6 + intensity * 0.7), alpha);
  }
`

interface CurtainSpec {
  radius: number
  yBottom: number
  yTop: number
  span: number
  speed: number
  low: [number, number, number]
  mid: [number, number, number]
  high: [number, number, number]
  order: number
}

const CURTAINS: CurtainSpec[] = [
  // Back curtain — widest, coolest, slowest.
  { radius: 1040, yBottom: 70, yTop: 470, span: 1.5, speed: 0.5,
    low: [0.10, 0.85, 0.55], mid: [0.16, 0.7, 0.9], high: [0.55, 0.3, 0.85], order: 1 },
  // Mid curtain — the brightest emerald sheet.
  { radius: 960, yBottom: 80, yTop: 430, span: 1.25, speed: 0.75,
    low: [0.20, 1.0, 0.55], mid: [0.20, 0.8, 0.85], high: [0.7, 0.35, 0.95], order: 2 },
  // Front wisps — narrow, faster, a touch of rose.
  { radius: 880, yBottom: 90, yTop: 380, span: 0.95, speed: 1.05,
    low: [0.35, 1.0, 0.6], mid: [0.4, 0.85, 0.9], high: [0.9, 0.4, 0.8], order: 3 },
]

function Curtain({ spec }: { spec: CurtainSpec }) {
  const geom = useMemo(
    () => buildCurtain(spec.radius, spec.yBottom, spec.yTop, spec.span),
    [spec.radius, spec.yBottom, spec.yTop, spec.span],
  )
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        depthTest: true,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0 },
          uSpeed: { value: spec.speed },
          uLow: { value: spec.low },
          uMid: { value: spec.mid },
          uHigh: { value: spec.high },
        },
      }),
    [spec],
  )
  return <mesh geometry={geom} material={mat} renderOrder={spec.order} frustumCulled={false} />
}

export function Aurora({ view }: { view: ViewMode }) {
  const groupRef = useRef<{ children: { material: ShaderMaterial }[] }>(null)

  useFrame((state, dt) => {
    const g = groupRef.current
    if (!g) return
    // Northern lights belong to the horizon-facing views; the top-down 2D map
    // never sees the sky, so skip the work there.
    // Keep it subtle — a gentle glow, not a light show.
    const target = view === 'iso' ? 0 : nightFactor() * 0.62
    for (const child of g.children) {
      const m = child.material
      if (!m?.uniforms) continue
      m.uniforms.uTime.value = state.clock.elapsedTime
      easing.damp(m.uniforms.uOpacity, 'value', target, 0.5, dt)
    }
  })

  return (
    <group ref={groupRef as never}>
      {CURTAINS.map((spec, i) => (
        <Curtain key={i} spec={spec} />
      ))}
    </group>
  )
}

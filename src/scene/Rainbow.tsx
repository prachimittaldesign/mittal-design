/**
 * Rainbow — a soft semicircular arc that appears in the eastern sky for a few
 * minutes after the rain stops, but only while the sun is still up.  Built as
 * a single half-ring with a custom radial-gradient shader so the spectrum is
 * smooth and the edges fade out instead of sitting on hard rectangular bands.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ShaderMaterial } from 'three'
import { easing } from 'maath'
import { getHyderabadTime } from '../lib/sky'
import type { Weather } from '../lib/weather'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// vUv.y goes 0 at the inner edge of the ring to 1 at the outer edge — we map
// it across the visible spectrum (violet inside → red outside, as in the sky).
const FRAG = /* glsl */ `
  varying vec2 vUv;
  uniform float uOpacity;

  vec3 spectrum(float t) {
    float st = t * 6.0;
    if (st < 1.0) return mix(vec3(0.45, 0.08, 0.70), vec3(0.18, 0.20, 0.95), st);
    if (st < 2.0) return mix(vec3(0.18, 0.20, 0.95), vec3(0.15, 0.75, 0.95), st - 1.0);
    if (st < 3.0) return mix(vec3(0.15, 0.75, 0.95), vec3(0.30, 0.85, 0.30), st - 2.0);
    if (st < 4.0) return mix(vec3(0.30, 0.85, 0.30), vec3(0.96, 0.90, 0.22), st - 3.0);
    if (st < 5.0) return mix(vec3(0.96, 0.90, 0.22), vec3(1.00, 0.55, 0.08), st - 4.0);
    return            mix(vec3(1.00, 0.55, 0.08), vec3(0.95, 0.18, 0.10), st - 5.0);
  }

  void main() {
    float t = vUv.y;
    vec3 c = spectrum(t);
    // Soften the inner and outer band edges so the arc doesn't look like a
    // stamp; same for the two angular tips so it gently dissolves into the sky.
    float edgeFade = smoothstep(0.0, 0.10, t) * smoothstep(1.0, 0.90, t);
    float angFade  = smoothstep(0.0, 0.14, vUv.x) * smoothstep(1.0, 0.86, vUv.x);
    gl_FragColor = vec4(c, uOpacity * edgeFade * angFade * 0.5);
  }
`

export function Rainbow({ weather }: { weather: Weather | null }) {
  const wasRain   = useRef(false)
  const stoppedAt = useRef(-9999)

  const mat = useMemo(
    () => new ShaderMaterial({
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    }),
    [],
  )

  useEffect(() => () => mat.dispose(), [mat])

  useFrame((state, dt) => {
    const isRain = weather?.condition === 'rain' || weather?.condition === 'storm'
    if (wasRain.current && !isRain) stoppedAt.current = state.clock.elapsedTime
    wasRain.current = isRain

    const { frac } = getHyderabadTime()
    const sunUp    = frac > 6.5 && frac < 18.5
    const sinceEnd = state.clock.elapsedTime - stoppedAt.current
    // Rainbow lingers ~3 min after rain stops, only while the sun is still up.
    const show     = !isRain && sunUp && sinceEnd > 1 && sinceEnd < 180

    easing.damp(mat.uniforms.uOpacity, 'value', show ? 1 : 0, 2.5, dt)
  })

  // Sun is in the west late-day → rainbow opposite, toward the east horizon.
  // The half-ring sits upright in the sky, ringGeometry from 0 to π gives the
  // top half above the horizon.
  return (
    <mesh position={[-220, 30, -360]} rotation={[0, Math.PI * 0.35, 0]}>
      <ringGeometry args={[260, 308, 96, 1, 0, Math.PI]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

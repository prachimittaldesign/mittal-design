/**
 * Billboards — the city's "lively" layer:
 *   • Animated LED video walls (real CanvasTexture animations: equalizer bars,
 *     gradient sweeps, a scrolling marquee) mounted on poles around the plaza.
 *   • Freestanding twin-post billboards flanking the cardinal avenues.
 *   • Small neon storefront signs glowing along the inner streets.
 *
 * Everything bright uses meshBasicMaterial + toneMapped:false so it punches
 * through the bloom threshold and genuinely glows after dark. The three shared
 * canvas textures are updated once per frame (throttled) and reused across many
 * screens, so the whole layer stays cheap.
 */

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CanvasTexture, type Group } from 'three'

// ─── Animated canvas textures ──────────────────────────────────────────────────
interface AnimTex {
  texture: CanvasTexture
  draw: (t: number) => void
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D, CanvasTexture] {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const texture = new CanvasTexture(canvas)
  return [canvas, ctx, texture]
}

// Bouncing colour equalizer — reads as a music / data visualiser.
function makeEqualizer(): AnimTex {
  const [, ctx, texture] = makeCanvas(160, 90)
  const bars = 18
  const phase = Array.from({ length: bars }, (_, i) => i * 0.7)
  return {
    texture,
    draw(t) {
      ctx.fillStyle = '#0b0d1a'
      ctx.fillRect(0, 0, 160, 90)
      const bw = 160 / bars
      for (let i = 0; i < bars; i++) {
        const amp = 0.22 + 0.78 * Math.abs(Math.sin(t * 2.2 + phase[i]) * Math.cos(t * 0.7 + i))
        const bh = amp * 88
        const hue = (i / bars) * 90 + 180 + t * 26
        ctx.fillStyle = `hsl(${hue % 360}, 85%, 62%)`
        ctx.fillRect(i * bw + 1.5, 90 - bh, bw - 3, bh)
      }
      texture.needsUpdate = true
    },
  }
}

// Diagonal gradient sweep — soft, abstract "ad spot" motion.
function makeSweep(): AnimTex {
  const [, ctx, texture] = makeCanvas(160, 90)
  return {
    texture,
    draw(t) {
      const hue = (t * 30) % 360
      const g = ctx.createLinearGradient(0, 0, 160, 90)
      const shift = (Math.sin(t * 0.8) * 0.5 + 0.5)
      g.addColorStop(0, `hsl(${hue}, 80%, 55%)`)
      g.addColorStop(Math.max(0.05, Math.min(0.95, shift)), `hsl(${(hue + 60) % 360}, 80%, 60%)`)
      g.addColorStop(1, `hsl(${(hue + 140) % 360}, 75%, 50%)`)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 160, 90)
      // moving light band
      const bx = ((t * 60) % 220) - 30
      const bg = ctx.createLinearGradient(bx, 0, bx + 40, 90)
      bg.addColorStop(0, 'rgba(255,255,255,0)')
      bg.addColorStop(0.5, 'rgba(255,255,255,0.5)')
      bg.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, 160, 90)
      texture.needsUpdate = true
    },
  }
}

// Scrolling marquee — a glowing text ticker.
function makeMarquee(text: string, bg: string, fg: string): AnimTex {
  const [, ctx, texture] = makeCanvas(256, 90)
  const phrase = `${text}   ★   `
  ctx.font = 'bold 46px monospace'
  const unit = ctx.measureText(phrase).width
  return {
    texture,
    draw(t) {
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, 256, 90)
      ctx.font = 'bold 46px monospace'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = fg
      const offset = (t * 70) % unit
      for (let x = -offset; x < 256; x += unit) {
        ctx.fillText(phrase, x, 48)
      }
      texture.needsUpdate = true
    },
  }
}

// ─── Layout data ────────────────────────────────────────────────────────────────
// Big video walls ring the plaza on poles, angled to face the centre. They sit
// between the diagonal boulevards (which run at 45/135/225/315°) so they never
// straddle a road. Channel 0=equalizer, 1=sweep, 2=marquee.
interface ScreenSpot {
  x: number
  z: number
  faceY: number // yaw so the screen faces the city centre
  w: number
  h: number
  y: number // panel centre height
  channel: number
}

function ringScreens(): ScreenSpot[] {
  const spots: ScreenSpot[] = []
  // angles between the diagonals: 0, 90, 180, 270 (the cardinal avenue ends),
  // pulled out to r≈50 and set beside the avenue so they flank it.
  const cfg = [
    { ang: 0, ch: 0 },
    { ang: 90, ch: 2 },
    { ang: 180, ch: 1 },
    { ang: 270, ch: 2 },
  ]
  cfg.forEach(({ ang, ch }, i) => {
    const a = (ang * Math.PI) / 180
    const r = 50
    // offset to the side of the avenue so it doesn't sit on the carriageway
    const side = i % 2 === 0 ? 9 : -9
    const px = Math.cos(a) * r + Math.cos(a + Math.PI / 2) * side
    const pz = Math.sin(a) * r + Math.sin(a + Math.PI / 2) * side
    // face toward centre
    const faceY = Math.atan2(px, pz) + Math.PI
    spots.push({ x: px, z: pz, faceY, w: 9, h: 5, y: 8.5, channel: ch })
  })
  return spots
}

// Freestanding twin-post billboards further out along the cardinal avenues.
function avenueBillboards(): ScreenSpot[] {
  const spots: ScreenSpot[] = []
  const cfg = [
    { ang: 0, r: 82, ch: 1 },
    { ang: 90, r: 78, ch: 0 },
    { ang: 180, r: 82, ch: 2 },
    { ang: 270, r: 78, ch: 1 },
  ]
  cfg.forEach(({ ang, r, ch }) => {
    const a = (ang * Math.PI) / 180
    const side = 11
    const px = Math.cos(a) * r + Math.cos(a + Math.PI / 2) * side
    const pz = Math.sin(a) * r + Math.sin(a + Math.PI / 2) * side
    // face back toward the avenue (toward centre line)
    const faceY = Math.atan2(-Math.cos(a + Math.PI / 2), -Math.sin(a + Math.PI / 2))
    spots.push({ x: px, z: pz, faceY, w: 8, h: 4, y: 7.5, channel: ch })
  })
  return spots
}

// Small neon storefront signs on short posts at inner-street corners.
const NEON_COLORS = ['#ff5c8a', '#46d8ff', '#ffd24a', '#8aff6a', '#c98aff']
function neonSpots() {
  const out: { x: number; z: number; color: string; y: number }[] = []
  const r = mulberry32(2024)
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2
    const dist = 24 + r() * 28
    const x = Math.cos(a) * dist
    const z = Math.sin(a) * dist
    if (x * x + z * z < 20 * 20) continue
    out.push({ x, z, color: NEON_COLORS[i % NEON_COLORS.length], y: 2.6 + r() * 1.6 })
  }
  return out
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── A single screen on a frame + support poles ──────────────────────────────────
function Screen({ spot, texture, twinPost }: { spot: ScreenSpot; texture: CanvasTexture; twinPost: boolean }) {
  const { x, z, faceY, w, h, y } = spot
  const baseY = y - h / 2 - 0.6
  return (
    <group position={[x, 0, z]} rotation={[0, faceY, 0]}>
      {/* Support posts */}
      {twinPost ? (
        <>
          <mesh position={[-w * 0.32, baseY / 2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, baseY + h, 8]} />
            <meshStandardMaterial color="#3a3d44" roughness={0.7} metalness={0.4} />
          </mesh>
          <mesh position={[w * 0.32, baseY / 2, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, baseY + h, 8]} />
            <meshStandardMaterial color="#3a3d44" roughness={0.7} metalness={0.4} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, baseY / 2, 0]} castShadow>
          <cylinderGeometry args={[0.32, 0.4, baseY, 10]} />
          <meshStandardMaterial color="#33363d" roughness={0.7} metalness={0.45} />
        </mesh>
      )}

      {/* Dark bezel behind the screen */}
      <mesh position={[0, y, -0.12]} castShadow>
        <boxGeometry args={[w + 0.5, h + 0.5, 0.3]} />
        <meshStandardMaterial color="#15171f" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* The glowing animated panel — basic + toneMapped:false so it blooms */}
      <mesh position={[0, y, 0.06]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* Back face shows a dim version so it isn't a black void from behind */}
      <mesh position={[0, y, -0.13]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#1b1e28" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────
export function Billboards() {
  const eq = useMemo(makeEqualizer, [])
  const sweep = useMemo(makeSweep, [])
  const marquee = useMemo(() => makeMarquee('MITTAL DESIGN', '#101326', '#7fe9ff'), [])
  const channels = useMemo(() => [eq, sweep, marquee], [eq, sweep, marquee])

  const ring = useMemo(ringScreens, [])
  const avenues = useMemo(avenueBillboards, [])
  const neons = useMemo(neonSpots, [])

  const acc = useRef(0)
  const tRef = useRef(0)
  useFrame((_, dt) => {
    tRef.current += dt
    acc.current += dt
    // Throttle canvas redraws to ~20fps — plenty for the bloom-blurred motion.
    if (acc.current < 0.05) return
    acc.current = 0
    for (const c of channels) c.draw(tRef.current)
  })

  useEffect(
    () => () => {
      for (const c of channels) c.texture.dispose()
    },
    [channels],
  )

  const neonRef = useRef<Group>(null)
  useFrame(() => {
    // Gentle neon flicker/pulse.
    if (!neonRef.current) return
    const t = tRef.current
    neonRef.current.children.forEach((child, i) => {
      child.scale.y = 0.92 + 0.08 * Math.sin(t * 3 + i)
    })
  })

  return (
    <group>
      {ring.map((s, i) => (
        <Screen key={`ring-${i}`} spot={s} texture={channels[s.channel].texture} twinPost={false} />
      ))}
      {avenues.map((s, i) => (
        <Screen key={`ave-${i}`} spot={s} texture={channels[s.channel].texture} twinPost />
      ))}

      {/* Neon storefront signs — small glowing emissive bars on slim posts */}
      <group ref={neonRef}>
        {neons.map((n, i) => (
          <group key={`neon-${i}`} position={[n.x, 0, n.z]}>
            <mesh position={[0, n.y * 0.5, 0]}>
              <cylinderGeometry args={[0.07, 0.09, n.y, 6]} />
              <meshStandardMaterial color="#2c2e36" roughness={0.7} metalness={0.4} />
            </mesh>
            <mesh position={[0, n.y, 0]}>
              <boxGeometry args={[1.8, 0.5, 0.14]} />
              <meshBasicMaterial color={n.color} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshBasicMaterial, MeshStandardMaterial, PointLight } from 'three'
import { easing } from 'maath'
import { LIGHTHOUSE } from './lib/cityModel'
import { nightFactor } from '../lib/sky'

// ── Palette ───────────────────────────────────────────────────────────────────
const STONE   = '#e8e0d0'   // warm limestone
const STONE_D = '#c8bfb0'   // shadow / base steps
const STRIPE  = '#c44040'   // red band
const CAP     = '#b83838'   // terracotta cap
const FRAME   = '#9a8878'   // lantern room metal frame
const LENS    = '#fff8e0'   // lantern centre glow

const TOWER_BOT_R = 3.2    // tower base radius
const TOWER_TOP_R = 1.9    // tower top radius
const TOWER_BASE  = 2.4    // y where tower shaft starts (after plinth)
const TOWER_TOP   = 26     // y where tower shaft ends (gallery floor)
const GALLERY_Y   = TOWER_TOP
const LANTERN_Y   = GALLERY_Y + 1.4   // lantern room floor
const LANTERN_H   = LANTERN_Y + 2.0   // lantern room mid (light source)
const CAP_Y       = LANTERN_Y + 4.0   // cone cap base

const BEAM_LEN    = 220     // beam length (units)
const ROT_SPEED   = 0.85    // radians / second (≈ 7 s / full revolution)

export function Lighthouse() {
  const beamRef  = useRef<import('three').Group>(null)
  const beamMat  = useMemo(
    () => new MeshBasicMaterial({ color: LENS, transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  const beam2Mat = useMemo(
    () => new MeshBasicMaterial({ color: LENS, transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  const lampRef  = useRef<PointLight>(null)
  const glowMat  = useMemo(
    () => new MeshStandardMaterial({ color: LENS, emissive: LENS, emissiveIntensity: 0, roughness: 1 }),
    [],
  )

  useEffect(() => () => {
    beamMat.dispose()
    beam2Mat.dispose()
    glowMat.dispose()
  }, [beamMat, beam2Mat, glowMat])

  useFrame((_, dt) => {
    const nf = nightFactor()
    const evening = nf > 0.05   // dusk onward

    // Rotate the beam group continuously once it's evening
    if (beamRef.current) {
      beamRef.current.rotation.y += dt * ROT_SPEED * (evening ? 1 : 0)
    }

    // Fade beam and lamp in/out with dusk
    const targetOpacity = evening ? nf * 0.11 : 0
    easing.damp(beamMat,  'opacity', targetOpacity, 0.8, dt)
    easing.damp(beam2Mat, 'opacity', targetOpacity * 0.7, 0.8, dt)
    if (lampRef.current) {
      easing.damp(lampRef.current, 'intensity', evening ? nf * 10 : 0, 0.8, dt)
    }
    easing.damp(glowMat, 'emissiveIntensity', evening ? nf * 2.8 : 0, 0.8, dt)
  })

  const TWO_PI = Math.PI * 2

  return (
    <group position={LIGHTHOUSE.position}>

      {/* ── Rocky stone plinth — 3 stepped circles ─────────────────────── */}
      <mesh position={[0, 0.35, 0]} receiveShadow>
        <cylinderGeometry args={[5.8, 6.4, 0.7, 14]} />
        <meshStandardMaterial color={STONE_D} roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.9, 0]} receiveShadow>
        <cylinderGeometry args={[4.6, 5.4, 0.6, 12]} />
        <meshStandardMaterial color={STONE_D} roughness={0.96} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[3.8, 4.4, 0.5, 12]} />
        <meshStandardMaterial color={FRAME} roughness={0.9} />
      </mesh>

      {/* ── Tapered tower shaft ─────────────────────────────────────────── */}
      <mesh position={[0, (TOWER_BASE + TOWER_TOP) / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[TOWER_TOP_R, TOWER_BOT_R, TOWER_TOP - TOWER_BASE, 14]} />
        <meshStandardMaterial color={STONE} roughness={0.88} />
      </mesh>

      {/* ── Red band stripe at ~55% height ──────────────────────────────── */}
      {(() => {
        const bandY = TOWER_BASE + (TOWER_TOP - TOWER_BASE) * 0.55
        const tR = TOWER_BOT_R + (TOWER_TOP_R - TOWER_BOT_R) * 0.55 + 0.14
        return (
          <mesh position={[0, bandY, 0]} castShadow>
            <cylinderGeometry args={[tR, tR + 0.06, 2.2, 14]} />
            <meshStandardMaterial color={STRIPE} roughness={0.82} />
          </mesh>
        )
      })()}

      {/* ── Vertical guide ribs — add character to the shaft ────────────── */}
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * TWO_PI
        const midH = (TOWER_BASE + TOWER_TOP) / 2
        const h = TOWER_TOP - TOWER_BASE
        const r = (TOWER_BOT_R + TOWER_TOP_R) / 2 + 0.05
        return (
          <mesh key={i} position={[Math.cos(ang) * r, midH, Math.sin(ang) * r]} rotation={[0, ang, 0]} castShadow>
            <boxGeometry args={[0.28, h * 0.96, 0.22]} />
            <meshStandardMaterial color={STONE_D} roughness={0.9} />
          </mesh>
        )
      })}

      {/* ── Gallery platform + railing ───────────────────────────────────── */}
      {/* Platform disk */}
      <mesh position={[0, GALLERY_Y + 0.25, 0]} castShadow>
        <cylinderGeometry args={[TOWER_TOP_R + 1.8, TOWER_TOP_R + 2.0, 0.5, 14]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      {/* Gallery edge ring */}
      <mesh position={[0, GALLERY_Y + 0.56, 0]}>
        <torusGeometry args={[TOWER_TOP_R + 1.8, 0.16, 8, 30]} />
        <meshStandardMaterial color={FRAME} roughness={0.7} />
      </mesh>
      {/* Railing posts */}
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * TWO_PI
        const pr  = TOWER_TOP_R + 1.8
        return (
          <mesh key={i} position={[Math.cos(ang) * pr, GALLERY_Y + 1.2, Math.sin(ang) * pr]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 1.4, 5]} />
            <meshStandardMaterial color={FRAME} roughness={0.72} />
          </mesh>
        )
      })}
      {/* Top handrail ring */}
      <mesh position={[0, GALLERY_Y + 1.92, 0]}>
        <torusGeometry args={[TOWER_TOP_R + 1.8, 0.12, 8, 30]} />
        <meshStandardMaterial color={FRAME} roughness={0.65} metalness={0.2} />
      </mesh>

      {/* ── Lantern room ─────────────────────────────────────────────────── */}
      {/* Bottom ledge */}
      <mesh position={[0, LANTERN_Y - 0.2, 0]}>
        <cylinderGeometry args={[TOWER_TOP_R + 0.6, TOWER_TOP_R + 0.8, 0.35, 10]} />
        <meshStandardMaterial color={FRAME} roughness={0.72} />
      </mesh>
      {/* Glass cylinder */}
      <mesh position={[0, LANTERN_Y + 2.0, 0]}>
        <cylinderGeometry args={[TOWER_TOP_R + 0.45, TOWER_TOP_R + 0.45, 4.0, 10]} />
        <meshStandardMaterial color="#c8e8f8" transparent opacity={0.38} roughness={0.05} metalness={0.1} />
      </mesh>
      {/* Vertical frame strips */}
      {Array.from({ length: 10 }).map((_, i) => {
        const ang = (i / 10) * TWO_PI
        const fr  = TOWER_TOP_R + 0.52
        return (
          <mesh key={i} position={[Math.cos(ang) * fr, LANTERN_Y + 2.0, Math.sin(ang) * fr]} rotation={[0, ang, 0]}>
            <boxGeometry args={[0.18, 4.1, 0.18]} />
            <meshStandardMaterial color={FRAME} roughness={0.6} metalness={0.25} />
          </mesh>
        )
      })}
      {/* Top ring of lantern room */}
      <mesh position={[0, LANTERN_Y + 4.1, 0]}>
        <cylinderGeometry args={[TOWER_TOP_R + 0.6, TOWER_TOP_R + 0.5, 0.3, 10]} />
        <meshStandardMaterial color={FRAME} roughness={0.65} />
      </mesh>

      {/* ── Lens / glow inside the lantern ──────────────────────────────── */}
      <mesh position={[0, LANTERN_H, 0]}>
        <sphereGeometry args={[0.62, 12, 12]} />
        <primitive object={glowMat} />
      </mesh>

      {/* ── Conical cap + finial ─────────────────────────────────────────── */}
      <mesh position={[0, CAP_Y + 2.2, 0]} rotation={[0, Math.PI / 10, 0]} castShadow>
        <coneGeometry args={[TOWER_TOP_R + 0.65, 4.4, 10]} />
        <meshStandardMaterial color={CAP} roughness={0.8} />
      </mesh>
      <mesh position={[0, CAP_Y + 4.7, 0]} castShadow>
        <coneGeometry args={[0.12, 1.2, 6]} />
        <meshStandardMaterial color={FRAME} roughness={0.55} metalness={0.45} />
      </mesh>

      {/* ── Night lighting ───────────────────────────────────────────────── */}
      {/* Warm amber point light inside the lantern room */}
      <pointLight ref={lampRef} position={[0, LANTERN_H, 0]} color="#ffdd88" intensity={0} distance={280} decay={1.5} castShadow={false} />

      {/* Rotating beam group — two opposite beams like a real Fresnel lens */}
      <group ref={beamRef} position={[0, LANTERN_H, 0]}>
        {/* Primary beam — extends in +Z */}
        <mesh position={[0, -0.4, BEAM_LEN * 0.5]}>
          <boxGeometry args={[2.2, 1.4, BEAM_LEN]} />
          <primitive object={beamMat} />
        </mesh>
        {/* Secondary beam — opposite direction (−Z), slightly dimmer */}
        <mesh position={[0, -0.4, -BEAM_LEN * 0.5]}>
          <boxGeometry args={[2.2, 1.4, BEAM_LEN]} />
          <primitive object={beam2Mat} />
        </mesh>
      </group>

    </group>
  )
}

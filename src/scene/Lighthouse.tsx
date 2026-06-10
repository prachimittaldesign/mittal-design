import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, DoubleSide, Group, MeshBasicMaterial, MeshStandardMaterial, PointLight, SpotLight, type Object3D } from 'three'
import { easing } from 'maath'
import { LIGHTHOUSE } from './lib/cityModel'
import { getHyderabadTime } from '../lib/sky'
import { Label } from './Label'

// Lamp on at 17:20 IST → full by 18:30 → stays on through the night,
// fades out at dawn (5:30 → 6:30 IST).
function lampFactor(): number {
  const { frac } = getHyderabadTime()
  if (frac >= 17.333 && frac < 18.5) return (frac - 17.333) / (18.5 - 17.333)
  if (frac >= 18.5 || frac < 5.5) return 1
  if (frac < 6.5) return 1 - (frac - 5.5)
  return 0
}

// Beam texture — soft length-wise gradient so both the lamp-end and the far
// end fade away. Combined with a cone the beam reads as a rounded, tapering
// volume of light rather than a hard box.
function makeBeamTexture(): CanvasTexture {
  const W = 64, H = 256
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const ctx = c.getContext('2d')!
  const img = ctx.createImageData(W, H)
  for (let y = 0; y < H; y++) {
    // Cone UV: V=0 at base (far end), V=1 at apex (lamp)
    const v = y / (H - 1)
    const vp = 0.86                                  // peak just below apex
    let along: number
    if (v >= vp) along = (1 - v) / (1 - vp)          // soft fade right at the lamp
    else along = Math.pow(v / vp, 0.55)              // long gentle fade to far end
    const a = Math.max(0, Math.min(1, along)) * 255
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4
      img.data[i]   = 255
      img.data[i+1] = 248
      img.data[i+2] = 222
      img.data[i+3] = a
    }
  }
  ctx.putImageData(img, 0, 0)
  const tex = new CanvasTexture(c)
  // flipY would invert the gradient: canvas row 0 carries the far-end fade and
  // must land at cone V=0 (the base), so the bright peak stays at the lamp.
  tex.flipY = false
  tex.needsUpdate = true
  return tex
}

import type { Project } from '../types'

// ── Palette ───────────────────────────────────────────────────────────────────
const STONE   = '#e8e0d0'
const STONE_D = '#c8bfb0'
const STRIPE  = '#c44040'
const CAP     = '#b83838'
const FRAME   = '#9a8878'
const LENS    = '#fff8e0'

// ── Dimensions ────────────────────────────────────────────────────────────────
const TOWER_BOT_R = 3.2
const TOWER_TOP_R = 1.9
const TOWER_BASE  = 2.4
const TOWER_TOP   = 26
const GALLERY_Y   = TOWER_TOP
const LANTERN_Y   = GALLERY_Y + 1.4
const LANTERN_H   = LANTERN_Y + 2.0
const CAP_Y       = LANTERN_Y + 4.0
const LABEL_Y     = CAP_Y + 6.8    // float label above the finial
const TWO_PI      = Math.PI * 2

const BEAM_LEN    = 220
const BEAM_R      = 14            // cone radius at far end — diverging searchlight
const BEAM_TILT   = 0.12          // ~7° down so the cone grazes the sea surface
const SWEEP_SPEED = 0.16          // rad/s on the sin oscillator (slow scan)
const SWEEP_HALF  = Math.PI / 4   // ±45° — sweeps across the sea-facing arc only

interface LighthouseProps {
  project: Project
  hovered: boolean
  showLabel: boolean
  onHover: (id: string | null) => void
  onSelect: (project: Project, object: Object3D) => void
}

export function Lighthouse({ project, hovered, showLabel, onHover, onSelect }: LighthouseProps) {
  const gl      = useThree((s) => s.gl)
  const beamRef = useRef<Group>(null)

  const beamTex = useMemo(makeBeamTexture, [])
  const beamMat = useMemo(
    () => new MeshBasicMaterial({
      map: beamTex,
      color: LENS,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    }),
    [beamTex],
  )
  const lampRef    = useRef<PointLight>(null)
  const spotRef    = useRef<SpotLight>(null)
  const spotTgtRef = useRef<Object3D>(null)
  const glowMat = useMemo(
    () => new MeshStandardMaterial({ color: LENS, emissive: LENS, emissiveIntensity: 0, roughness: 1 }),
    [],
  )
  // Hover glow on the tower shaft
  const hoverMat = useMemo(
    () => new MeshStandardMaterial({ color: '#ffd090', emissive: '#ffd090', emissiveIntensity: 0, transparent: true, opacity: 0, roughness: 0.5 }),
    [],
  )

  // The spotLight needs an explicit target Object3D so the cast direction
  // follows the rotating beam group.
  useEffect(() => {
    if (spotRef.current && spotTgtRef.current) spotRef.current.target = spotTgtRef.current
  }, [])

  useEffect(() => () => {
    beamMat.dispose(); glowMat.dispose(); hoverMat.dispose(); beamTex.dispose()
  }, [beamMat, glowMat, hoverMat, beamTex])

  useFrame((state, dt) => {
    const lf  = lampFactor()
    const lit = lf > 0.02

    // Slow back-and-forth sweep across the sea-facing arc — feels more like a
    // real coastal beacon scanning the water than a full carousel rotation.
    if (beamRef.current) {
      beamRef.current.rotation.y = Math.sin(state.clock.elapsedTime * SWEEP_SPEED) * SWEEP_HALF
    }

    const targetOpa = lit ? lf * 0.65 : 0
    easing.damp(beamMat, 'opacity', targetOpa, 0.8, dt)
    if (lampRef.current) easing.damp(lampRef.current, 'intensity', lit ? lf * 10 : 0, 0.8, dt)
    if (spotRef.current) easing.damp(spotRef.current, 'intensity', lit ? lf * 110 : 0, 0.8, dt)
    easing.damp(glowMat, 'emissiveIntensity', lit ? lf * 2.8 : 0, 0.8, dt)

    // Hover shimmer
    easing.damp(hoverMat, 'opacity',          hovered ? 0.18 : 0, 0.14, dt)
    easing.damp(hoverMat, 'emissiveIntensity', hovered ? 1.2 : 0, 0.14, dt)
  })

  return (
    <group
      position={LIGHTHOUSE.position}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        onHover(project.id)
        gl.domElement.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        gl.domElement.style.cursor = ''
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onSelect(project, e.eventObject)
      }}
    >

      {/* ── 3-step stone plinth ─────────────────────────────────────────── */}
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

      {/* Hover glow shell over the shaft */}
      <mesh position={[0, (TOWER_BASE + TOWER_TOP) / 2, 0]}>
        <cylinderGeometry args={[TOWER_TOP_R + 0.12, TOWER_BOT_R + 0.12, TOWER_TOP - TOWER_BASE, 14]} />
        <primitive object={hoverMat} />
      </mesh>

      {/* ── Red stripe at 55% ───────────────────────────────────────────── */}
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

      {/* ── Vertical ribs ───────────────────────────────────────────────── */}
      {Array.from({ length: 6 }).map((_, i) => {
        const ang = (i / 6) * TWO_PI
        const midH = (TOWER_BASE + TOWER_TOP) / 2
        const h    = TOWER_TOP - TOWER_BASE
        const r    = (TOWER_BOT_R + TOWER_TOP_R) / 2 + 0.05
        return (
          <mesh key={i} position={[Math.cos(ang) * r, midH, Math.sin(ang) * r]} rotation={[0, ang, 0]} castShadow>
            <boxGeometry args={[0.28, h * 0.96, 0.22]} />
            <meshStandardMaterial color={STONE_D} roughness={0.9} />
          </mesh>
        )
      })}

      {/* ── Gallery platform + railing ───────────────────────────────────── */}
      <mesh position={[0, GALLERY_Y + 0.25, 0]} castShadow>
        <cylinderGeometry args={[TOWER_TOP_R + 1.8, TOWER_TOP_R + 2.0, 0.5, 14]} />
        <meshStandardMaterial color={STONE} roughness={0.85} />
      </mesh>
      <mesh position={[0, GALLERY_Y + 0.56, 0]}>
        <torusGeometry args={[TOWER_TOP_R + 1.8, 0.16, 8, 30]} />
        <meshStandardMaterial color={FRAME} roughness={0.7} />
      </mesh>
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
      <mesh position={[0, GALLERY_Y + 1.92, 0]}>
        <torusGeometry args={[TOWER_TOP_R + 1.8, 0.12, 8, 30]} />
        <meshStandardMaterial color={FRAME} roughness={0.65} metalness={0.2} />
      </mesh>

      {/* ── Lantern room ─────────────────────────────────────────────────── */}
      <mesh position={[0, LANTERN_Y - 0.2, 0]}>
        <cylinderGeometry args={[TOWER_TOP_R + 0.6, TOWER_TOP_R + 0.8, 0.35, 10]} />
        <meshStandardMaterial color={FRAME} roughness={0.72} />
      </mesh>
      <mesh position={[0, LANTERN_Y + 2.0, 0]}>
        <cylinderGeometry args={[TOWER_TOP_R + 0.45, TOWER_TOP_R + 0.45, 4.0, 10]} />
        <meshStandardMaterial color="#c8e8f8" transparent opacity={0.38} roughness={0.05} metalness={0.1} />
      </mesh>
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
      <mesh position={[0, LANTERN_Y + 4.1, 0]}>
        <cylinderGeometry args={[TOWER_TOP_R + 0.6, TOWER_TOP_R + 0.5, 0.3, 10]} />
        <meshStandardMaterial color={FRAME} roughness={0.65} />
      </mesh>

      {/* ── Fresnel lens glow ────────────────────────────────────────────── */}
      <mesh position={[0, LANTERN_H, 0]}>
        <sphereGeometry args={[0.62, 12, 12]} />
        <primitive object={glowMat} />
      </mesh>

      {/* ── Cap + finial ─────────────────────────────────────────────────── */}
      <mesh position={[0, CAP_Y + 2.2, 0]} rotation={[0, Math.PI / 10, 0]} castShadow>
        <coneGeometry args={[TOWER_TOP_R + 0.65, 4.4, 10]} />
        <meshStandardMaterial color={CAP} roughness={0.8} />
      </mesh>
      <mesh position={[0, CAP_Y + 4.7, 0]} castShadow>
        <coneGeometry args={[0.12, 1.2, 6]} />
        <meshStandardMaterial color={FRAME} roughness={0.55} metalness={0.45} />
      </mesh>

      {/* ── Project label (billboard, gated by showLabel) ────────────────── */}
      {showLabel && (
        <group position={[0, LABEL_Y, 0]}>
          <Label project={project} footprint={TOWER_BOT_R * 2} />
        </group>
      )}

      {/* ── Night lighting ───────────────────────────────────────────────── */}
      <pointLight ref={lampRef} position={[0, LANTERN_H, 0]} color="#ffdd88" intensity={0} distance={280} decay={1.5} castShadow={false} />

      {/* A single tapering cone of light, sweeping seaward. The cone is open
          and uses additive blending — light *adds* to the night air. A real
          spotLight rides along so whatever the cone passes over actually
          gets brightened: sea, mountains, ground. */}
      <group ref={beamRef} position={[0, LANTERN_H, 0]}>
        <group rotation={[BEAM_TILT, 0, 0]}>
          <mesh position={[0, 0, BEAM_LEN * 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[BEAM_R, BEAM_LEN, 32, 1, true]} />
            <primitive object={beamMat} />
          </mesh>
          <spotLight
            ref={spotRef}
            position={[0, 0, 0]}
            angle={0.075}
            penumbra={0.55}
            distance={BEAM_LEN * 1.4}
            decay={1.4}
            intensity={0}
            color="#fff0d0"
            castShadow={false}
          />
          <object3D ref={spotTgtRef} position={[0, 0, BEAM_LEN]} />
        </group>
      </group>

    </group>
  )
}

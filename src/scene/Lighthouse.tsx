import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Group, MeshBasicMaterial, MeshStandardMaterial, PointLight, type Object3D } from 'three'
import { easing } from 'maath'
import { LIGHTHOUSE } from './lib/cityModel'
import { nightFactor } from '../lib/sky'
import { Label } from './Label'
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

const BEAM_LEN  = 220
const ROT_SPEED = 0.85   // rad/s ≈ 7 s per revolution

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

  const beamMat = useMemo(
    () => new MeshBasicMaterial({ color: LENS, transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  const beam2Mat = useMemo(
    () => new MeshBasicMaterial({ color: LENS, transparent: true, opacity: 0, depthWrite: false }),
    [],
  )
  const lampRef = useRef<PointLight>(null)
  const glowMat = useMemo(
    () => new MeshStandardMaterial({ color: LENS, emissive: LENS, emissiveIntensity: 0, roughness: 1 }),
    [],
  )
  // Hover glow on the tower shaft
  const hoverMat = useMemo(
    () => new MeshStandardMaterial({ color: '#ffd090', emissive: '#ffd090', emissiveIntensity: 0, transparent: true, opacity: 0, roughness: 0.5 }),
    [],
  )

  useEffect(() => () => {
    beamMat.dispose(); beam2Mat.dispose(); glowMat.dispose(); hoverMat.dispose()
  }, [beamMat, beam2Mat, glowMat, hoverMat])

  useFrame((_, dt) => {
    const nf      = nightFactor()
    const evening = nf > 0.05

    if (beamRef.current) beamRef.current.rotation.y += dt * ROT_SPEED * (evening ? 1 : 0)

    const targetOpa = evening ? nf * 0.11 : 0
    easing.damp(beamMat,  'opacity', targetOpa,       0.8, dt)
    easing.damp(beam2Mat, 'opacity', targetOpa * 0.7, 0.8, dt)
    if (lampRef.current) easing.damp(lampRef.current, 'intensity', evening ? nf * 10 : 0, 0.8, dt)
    easing.damp(glowMat, 'emissiveIntensity', evening ? nf * 2.8 : 0, 0.8, dt)

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

      <group ref={beamRef} position={[0, LANTERN_H, 0]}>
        <mesh position={[0, -0.4, BEAM_LEN * 0.5]}>
          <boxGeometry args={[2.2, 1.4, BEAM_LEN]} />
          <primitive object={beamMat} />
        </mesh>
        <mesh position={[0, -0.4, -BEAM_LEN * 0.5]}>
          <boxGeometry args={[2.2, 1.4, BEAM_LEN]} />
          <primitive object={beam2Mat} />
        </mesh>
      </group>

    </group>
  )
}

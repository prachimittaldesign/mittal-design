import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DoubleSide, Group, MeshStandardMaterial } from 'three'
import { easing } from 'maath'
import { CLOCK_TOWER } from './lib/cityModel'
import { getHyderabadTime } from '../lib/sky'

// ── Palette ──────────────────────────────────────────────────────────────────
const STONE    = '#d2c4a8'   // warm Mediterranean limestone
const STONE_D  = '#bab09a'   // quoins / pilasters / base steps
const CORNICE  = '#9a8a72'   // string courses / trim / cornice
const OPENING  = '#18140e'   // belfry arch voids
const FACE_COL = '#fbf6e8'   // clock dial cream
const INK      = '#161009'   // hands / tick markers
const BRASS    = '#b89150'   // bezel / hands centre / finial
const SPIRE    = '#6a5440'   // terracotta spire
const STEM     = '#3a5425'   // vine stems
const LEAVES   = ['#4a8c3a','#548a3e','#3d7830','#5c9042','#487228','#72a848','#3e6a28','#4e7f32']

// ── Dimensions ───────────────────────────────────────────────────────────────
const TW      = 5.4               // tower footprint width
const HW      = TW / 2
const BW      = TW * 0.92         // belfry section width (slightly narrower)
const BHW     = BW / 2

const CW      = TW * 1.16         // clock-stage width (projects past the shaft)
const CHW     = CW / 2
const STAGE_Y = 14                // clock-stage centre height
const STAGE_H = 6                 // clock-stage height
const FACE_R  = 2.5               // clock dial radius
const FACE_LOCAL_Z = CHW + 0.05   // dial stands proud of the stage face

const TWO_PI = Math.PI * 2

// ── Vine creepers ────────────────────────────────────────────────────────────

type StemSeg = { y: number; dx: number; h: number }
type LeafPt  = { y: number; dx: number; rx: number; rz: number; ci: number; sc: number }

function VineTrack({ face, tx, maxH }: { face: number; tx: number; maxH: number }) {
  const wallZ = HW + 0.1  // stand slightly proud of the stone face

  const { segs, leafs } = useMemo<{ segs: StemSeg[]; leafs: LeafPt[] }>(() => {
    const sd = tx * 7.3 + face * 13.1  // deterministic seed per track
    const segs: StemSeg[] = []
    const leafs: LeafPt[] = []
    let cy = 0.5, dx = 0

    while (cy < maxH) {
      const h = 1.4 + Math.sin(cy * 1.3 + sd) * 0.35
      dx += Math.sin(cy * 0.9 + sd * 0.4) * 0.1   // gentle snaking
      segs.push({ y: cy + h / 2, dx, h })

      const n = 2 + (Math.abs(Math.floor(Math.sin(cy * 2 + sd))) % 2)  // 2–3 leaves
      for (let l = 0; l < n; l++) {
        leafs.push({
          y:  cy + h * 0.6 + l * 0.22,
          dx: dx + Math.sin(cy * 1.4 + l * 1.8) * 0.13,
          rx: Math.sin(cy * 1.7 + l * 2.3 + sd) * 0.55,
          rz: (l / n) * TWO_PI + cy * 0.28 + sd,
          ci: Math.abs(Math.floor(cy * 2.7 + l * 3 + sd * 5)) % LEAVES.length,
          sc: 0.66 + Math.abs(Math.sin(cy * 1.1 + l + sd)) * 0.44,
        })
      }
      cy += h
    }
    return { segs, leafs }
  }, [face, tx, maxH])

  return (
    <group rotation={[0, (face * Math.PI) / 2, 0]}>
      {/* thin snaking stem */}
      {segs.map((s, i) => (
        <mesh key={`s${i}`} position={[tx + s.dx, s.y, wallZ]}>
          <cylinderGeometry args={[0.04, 0.055, s.h + 0.12, 5]} />
          <meshStandardMaterial color={STEM} roughness={1} />
        </mesh>
      ))}
      {/* leaf pads fanning out from the stem */}
      {leafs.map((lf, i) => (
        <mesh
          key={`l${i}`}
          position={[tx + lf.dx, lf.y, wallZ + 0.05]}
          rotation={[lf.rx, 0, lf.rz]}
          scale={lf.sc}
        >
          <planeGeometry args={[0.54, 0.38]} />
          <meshStandardMaterial color={LEAVES[lf.ci]} roughness={0.95} side={DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function Creepers() {
  const tracks = useMemo(() => {
    const arr: Array<{ face: number; tx: number; maxH: number }> = []
    const offsets = [-1.55, 0.05, 1.60]
    // Keep ivy on the LOWER shaft only — below the clock stage (y ≈ 11) — so the
    // creepers frame the base and never grow across the clock faces.
    const maxHTable = [
      [9.5, 8.0, 10.0],
      [8.5, 10.0, 7.5],
      [10.0, 9.0, 8.0],
      [7.5, 8.5, 9.5],
    ]
    for (let f = 0; f < 4; f++) {
      offsets.forEach((tx, ti) => arr.push({ face: f, tx, maxH: maxHTable[f][ti] }))
    }
    return arr
  }, [])

  return <>{tracks.map((t, i) => <VineTrack key={i} {...t} />)}</>
}

// ── A single clock face (built facing local +Z) ──────────────────────────────
function ClockFace({
  faceIndex,
  dialMat,
  hourRefs,
  minRefs,
}: {
  faceIndex: number
  dialMat: MeshStandardMaterial
  hourRefs: React.MutableRefObject<(Group | null)[]>
  minRefs: React.MutableRefObject<(Group | null)[]>
}) {
  return (
    <group rotation={[0, (faceIndex * Math.PI) / 2, 0]}>
      <group position={[0, STAGE_Y, FACE_LOCAL_Z]}>
        {/* recessed square stone aedicule that frames the dial */}
        <mesh position={[0, 0, -0.22]} castShadow>
          <boxGeometry args={[FACE_R * 2 + 1.0, FACE_R * 2 + 1.0, 0.42]} />
          <meshStandardMaterial color={STONE_D} roughness={0.94} />
        </mesh>
        {/* moulded frame ring around the recess */}
        <mesh position={[0, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[FACE_R + 0.28, 0.16, 10, 40]} />
          <meshStandardMaterial color={CORNICE} roughness={0.8} />
        </mesh>

        {/* cream dial (shared material → night glow animates on every face) */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={dialMat}>
          <cylinderGeometry args={[FACE_R, FACE_R, 0.24, 48]} />
        </mesh>
        {/* polished brass bezel */}
        <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[FACE_R, 0.2, 12, 48]} />
          <meshStandardMaterial color={BRASS} roughness={0.42} metalness={0.6} />
        </mesh>

        {/* 12 tick marks — majors at 12/3/6/9, minors at the rest */}
        {Array.from({ length: 12 }).map((_, k) => {
          const ang   = (k / 12) * TWO_PI
          const major = k % 3 === 0
          return (
            <mesh
              key={k}
              position={[
                Math.sin(ang) * FACE_R * 0.84,
                Math.cos(ang) * FACE_R * 0.84,
                0.16,
              ]}
            >
              <boxGeometry args={major ? [0.26, 0.5, 0.1] : [0.12, 0.3, 0.08]} />
              <meshStandardMaterial color={INK} roughness={0.7} />
            </mesh>
          )
        })}
        {/* 60 fine minute pips around the rim */}
        {Array.from({ length: 60 }).map((_, k) => {
          if (k % 5 === 0) return null
          const ang = (k / 60) * TWO_PI
          return (
            <mesh
              key={`p${k}`}
              position={[
                Math.sin(ang) * FACE_R * 0.93,
                Math.cos(ang) * FACE_R * 0.93,
                0.16,
              ]}
            >
              <boxGeometry args={[0.045, 0.12, 0.05]} />
              <meshStandardMaterial color={INK} roughness={0.8} />
            </mesh>
          )
        })}

        {/* hour hand — stout, with a short counterweight tail */}
        <group ref={(el) => { hourRefs.current[faceIndex] = el }} position={[0, 0, 0.2]}>
          <mesh position={[0, FACE_R * 0.28, 0]}>
            <boxGeometry args={[0.24, FACE_R * 0.62, 0.11]} />
            <meshStandardMaterial color={INK} roughness={0.6} />
          </mesh>
          <mesh position={[0, -FACE_R * 0.13, 0]}>
            <boxGeometry args={[0.18, FACE_R * 0.26, 0.11]} />
            <meshStandardMaterial color={INK} roughness={0.6} />
          </mesh>
        </group>
        {/* minute hand — slimmer and longer, with its own tail */}
        <group ref={(el) => { minRefs.current[faceIndex] = el }} position={[0, 0, 0.26]}>
          <mesh position={[0, FACE_R * 0.47, 0]}>
            <boxGeometry args={[0.14, FACE_R * 0.96, 0.09]} />
            <meshStandardMaterial color={INK} roughness={0.6} />
          </mesh>
          <mesh position={[0, -FACE_R * 0.15, 0]}>
            <boxGeometry args={[0.11, FACE_R * 0.3, 0.09]} />
            <meshStandardMaterial color={INK} roughness={0.6} />
          </mesh>
        </group>
        {/* brass centre cap */}
        <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 16]} />
          <meshStandardMaterial color={BRASS} roughness={0.4} metalness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

// ── Main clock tower ─────────────────────────────────────────────────────────
export function ClockTower() {
  const hourRefs = useRef<(Group | null)[]>([])
  const minRefs  = useRef<(Group | null)[]>([])

  // One dial material shared across all four faces so the night glow drives them together.
  const dialMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color(FACE_COL),
        emissive: new Color('#ffe8b0'),
        emissiveIntensity: 0,
        roughness: 0.7,
      }),
    [],
  )

  useFrame((_, dt) => {
    const { hour: h, minute: m, frac } = getHyderabadTime()
    // Clockwise sweep as seen from +Z (camera side) → negative Z rotation.
    const minRot = -(m / 60) * TWO_PI
    const hrRot  = -(((h % 12) + m / 60) / 12) * TWO_PI
    for (const g of minRefs.current)  if (g) g.rotation.z = minRot
    for (const g of hourRefs.current) if (g) g.rotation.z = hrRot

    const night = frac < 6.8 || frac >= 18.3
    easing.damp(dialMat, 'emissiveIntensity', night ? 0.7 : 0, 0.5, dt)
  })

  const corners: [number, number][] = [[-HW, -HW], [HW, -HW], [HW, HW], [-HW, HW]]

  return (
    <group position={CLOCK_TOWER.position}>

      {/* ── Rusticated 3-step base plinth ─────────────────────────────── */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[TW * 1.72, 0.6, TW * 1.72]} />
        <meshStandardMaterial color={STONE_D} roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.87, 0]} receiveShadow>
        <boxGeometry args={[TW * 1.44, 0.54, TW * 1.44]} />
        <meshStandardMaterial color={STONE_D} roughness={0.97} />
      </mesh>
      <mesh position={[0, 1.32, 0]}>
        <boxGeometry args={[TW * 1.16, 0.36, TW * 1.16]} />
        <meshStandardMaterial color={CORNICE} roughness={0.92} />
      </mesh>

      {/* ── Main shaft (y ≈ 1.5 → 18.5) ──────────────────────────────── */}
      <mesh position={[0, 10, 0]} castShadow receiveShadow>
        <boxGeometry args={[TW, 17, TW]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>

      {/* ── Corner pilasters on shaft ─────────────────────────────────── */}
      {corners.map(([cx, cz], i) => (
        <mesh key={`cp${i}`} position={[cx, 10, cz]} castShadow>
          <boxGeometry args={[0.55, 17.1, 0.55]} />
          <meshStandardMaterial color={STONE_D} roughness={0.9} />
        </mesh>
      ))}

      {/* ── String course low on the shaft ────────────────────────────── */}
      <mesh position={[0, 6.0, 0]}>
        <boxGeometry args={[TW * 1.08, 0.4, TW * 1.08]} />
        <meshStandardMaterial color={CORNICE} roughness={0.9} />
      </mesh>

      {/* ── Clock stage — projecting band that houses the 4 dials ─────── */}
      {/* lower cornice */}
      <mesh position={[0, STAGE_Y - STAGE_H / 2 - 0.2, 0]}>
        <boxGeometry args={[CW + 0.3, 0.5, CW + 0.3]} />
        <meshStandardMaterial color={CORNICE} roughness={0.86} />
      </mesh>
      {/* stage body */}
      <mesh position={[0, STAGE_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[CW, STAGE_H, CW]} />
        <meshStandardMaterial color={STONE} roughness={0.88} />
      </mesh>
      {/* stage corner pilasters */}
      {corners.map(([cx, cz], i) => (
        <mesh key={`sp${i}`} position={[cx * (CW / TW), STAGE_Y, cz * (CW / TW)]} castShadow>
          <boxGeometry args={[0.6, STAGE_H + 0.05, 0.6]} />
          <meshStandardMaterial color={STONE_D} roughness={0.88} />
        </mesh>
      ))}
      {/* upper cornice */}
      <mesh position={[0, STAGE_Y + STAGE_H / 2 + 0.2, 0]}>
        <boxGeometry args={[CW + 0.3, 0.5, CW + 0.3]} />
        <meshStandardMaterial color={CORNICE} roughness={0.86} />
      </mesh>

      {/* ── Four clock faces, one per side ────────────────────────────── */}
      {[0, 1, 2, 3].map((f) => (
        <ClockFace
          key={`face${f}`}
          faceIndex={f}
          dialMat={dialMat}
          hourRefs={hourRefs}
          minRefs={minRefs}
        />
      ))}

      {/* ── Belfry section (y = 18 → 24) ──────────────────────────────── */}
      <mesh position={[0, 21, 0]} castShadow receiveShadow>
        <boxGeometry args={[BW, 6, BW]} />
        <meshStandardMaterial color={STONE} roughness={0.88} />
      </mesh>

      {/* Belfry corner pilasters */}
      {corners.map(([cx, cz], i) => (
        <mesh key={`bp${i}`} position={[cx * (BW / TW), 21, cz * (BW / TW)]} castShadow>
          <boxGeometry args={[0.48, 6.1, 0.48]} />
          <meshStandardMaterial color={STONE_D} roughness={0.88} />
        </mesh>
      ))}

      {/* Arched belfry openings — all 4 faces */}
      {[0, 1, 2, 3].map((f) => {
        const ang = (f * Math.PI) / 2
        const px  = Math.sin(ang) * (BHW + 0.02)
        const pz  = Math.cos(ang) * (BHW + 0.02)
        const ow  = BW * 0.44   // opening width
        const oh  = 3.2         // rect part height
        const ar  = ow / 2      // arch radius
        return (
          <group key={`arch${f}`} position={[px, 21, pz]} rotation={[0, ang, 0]}>
            {/* rectangular dark void */}
            <mesh>
              <boxGeometry args={[ow, oh, 0.3]} />
              <meshStandardMaterial color={OPENING} roughness={1} />
            </mesh>
            {/* semicircular arch void */}
            <mesh position={[0, oh / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[ar, ar, 0.3, 20, 1, false, 0, Math.PI]} />
              <meshStandardMaterial color={OPENING} roughness={1} />
            </mesh>
            {/* stone arch surround ring */}
            <mesh position={[0, oh / 2, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[ar, 0.14, 8, 22, Math.PI]} />
              <meshStandardMaterial color={CORNICE} roughness={0.82} />
            </mesh>
          </group>
        )
      })}

      {/* ── Belfry cornice ────────────────────────────────────────────── */}
      <mesh position={[0, 24.1, 0]}>
        <boxGeometry args={[TW * 1.16, 0.22, TW * 1.16]} />
        <meshStandardMaterial color={CORNICE} roughness={0.86} />
      </mesh>
      <mesh position={[0, 24.72, 0]} castShadow>
        <boxGeometry args={[TW * 1.08, 0.92, TW * 1.08]} />
        <meshStandardMaterial color={CORNICE} roughness={0.82} />
      </mesh>

      {/* ── Octagonal terracotta spire + finial ───────────────────────── */}
      <mesh position={[0, 28.5, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
        <coneGeometry args={[TW * 0.70, 7, 8]} />
        <meshStandardMaterial color={SPIRE} roughness={0.82} />
      </mesh>
      <mesh position={[0, 32.2, 0]} castShadow>
        <coneGeometry args={[0.14, 1.2, 6]} />
        <meshStandardMaterial color={BRASS} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* ── Vertical creeper vines on the lower shaft ─────────────────── */}
      <Creepers />

    </group>
  )
}

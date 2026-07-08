/**
 * FutureIsland — the destination at the far (−Z) end of the Future bridge.
 *
 * The bridge (FutureBridge.tsx) ends at z = −260; a short connector deck lands
 * on an island rising from the sea. On the island's hillside, "THE FUTURE" is
 * spelled out Hollywood-sign style. The flat lots around the landing are empty
 * plots with FOR SALE signs — the future is unbuilt, up for grabs. Guarding the
 * landing is a grand passport-control hall: hovering / tapping its glowing
 * "WORK WITH ME" sign dispatches `pm:workwithme`, which the DOM HUD catches to
 * open the Hire-me / Schedule-a-meeting panel.
 *
 * Everything is primitive geometry in the city's material palette (cream
 * #f0ebe0 walls, gold #c4a868 accents), and the two signs glow at dusk via the
 * shared nightFactor() ramp used across the scene.
 */

import { useMemo, useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, MeshStandardMaterial, Vector3 } from 'three'
import { easing } from 'maath'
import interSemi from '@fontsource/inter/files/inter-latin-700-normal.woff'
import { nightFactor } from '../lib/sky'

// ── Layout (world space) ─────────────────────────────────────────────────────
const GRASS_Y = 2.2                 // island top, flush with the bridge deck
const ISLAND_C = new Vector3(0, 0, -300)
const ISLAND_R = 30
const OFFICE_Z = -282               // passport hall sits at the landing
const HILL_Z = -320

const CREAM = '#f0ebe0'
const GOLD = '#c4a868'
const ROOF = '#3a3028'
const DARK = '#16243a'

function emit() {
  window.dispatchEvent(new CustomEvent('pm:workwithme'))
}
function pointer(on: boolean) {
  document.body.style.cursor = on ? 'pointer' : ''
}

export function FutureIsland() {
  // Shared emissive materials that warm up at dusk (signs + windows).
  const signMat = useMemo(
    () => new MeshStandardMaterial({ color: GOLD, emissive: GOLD, emissiveIntensity: 0, roughness: 0.5, metalness: 0.3 }),
    [],
  )
  const winMat = useMemo(
    () => new MeshStandardMaterial({ color: DARK, emissive: '#ffcf8a', emissiveIntensity: 0, roughness: 0.4 }),
    [],
  )
  const hovered = useRef(false)

  useFrame((_, dt) => {
    const nf = nightFactor()
    easing.damp(winMat, 'emissiveIntensity', nf > 0.05 ? nf * 1.4 : 0, 0.6, dt)
    // The WORK WITH ME sign glows a little always, brighter at night / on hover.
    const target = (hovered.current ? 1.6 : 0.5) + nf * 1.4
    easing.damp(signMat, 'emissiveIntensity', target, 0.3, dt)
  })

  return (
    <group>
      {/* ── Island landmass — a frustum rising out of the sea ──────────── */}
      <mesh position={[ISLAND_C.x, -0.4, ISLAND_C.z]} receiveShadow>
        <cylinderGeometry args={[ISLAND_R, ISLAND_R + 10, 5.2, 44]} />
        <meshStandardMaterial color="#c9b791" roughness={0.95} />
      </mesh>
      {/* grass cap */}
      <mesh position={[ISLAND_C.x, GRASS_Y, ISLAND_C.z]} receiveShadow>
        <cylinderGeometry args={[ISLAND_R, ISLAND_R, 0.35, 44]} />
        <meshStandardMaterial color="#93a86a" roughness={0.9} />
      </mesh>

      {/* ── Bridge connector deck: bridge end (z −260) → island (z −272) ── */}
      <mesh position={[0, 2.0, -267]} castShadow receiveShadow>
        <boxGeometry args={[6.4, 0.5, 14]} />
        <meshStandardMaterial color="#d8c8a8" roughness={0.82} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 3.2, 2.7, -267]}>
          <boxGeometry args={[0.22, 1.4, 14]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.72} metalness={0.18} />
        </mesh>
      ))}

      {/* ── Hillside + "THE FUTURE" sign ──────────────────────────────── */}
      <mesh position={[0, GRASS_Y + 17, HILL_Z]} castShadow receiveShadow>
        <coneGeometry args={[30, 34, 26]} />
        <meshStandardMaterial color="#6f7b5a" roughness={1} flatShading />
      </mesh>
      {/* scaffold ledge behind the letters */}
      <mesh position={[0, 20, -306.5]}>
        <boxGeometry args={[52, 0.5, 0.5]} />
        <meshStandardMaterial color="#8a8378" roughness={0.8} />
      </mesh>
      <Text
        font={interSemi}
        position={[0, 21.5, -305.8]}
        fontSize={7.5}
        letterSpacing={0.14}
        anchorX="center"
        anchorY="middle"
        color="#fbf7ee"
        outlineWidth={0.18}
        outlineColor="#2b2b2b"
      >
        THE FUTURE
      </Text>

      {/* ── Empty plots + FOR SALE signs ──────────────────────────────── */}
      {PLOTS.map((p, i) => (
        <Plot key={i} x={p.x} z={p.z} sign={p.sign} />
      ))}

      {/* ── Passport-control hall ─────────────────────────────────────── */}
      <group
        position={[0, 0, OFFICE_Z]}
        onClick={(e) => {
          e.stopPropagation()
          emit()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          hovered.current = true
          pointer(true)
        }}
        onPointerOut={() => {
          hovered.current = false
          pointer(false)
        }}
      >
        {/* stepped plinth */}
        <mesh position={[0, 2.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[27, 1.6, 16]} />
          <meshStandardMaterial color="#e5ddc9" roughness={0.85} />
        </mesh>
        <mesh position={[0, 3.5, 7.4]} receiveShadow>
          <boxGeometry args={[23, 0.6, 2.4]} />
          <meshStandardMaterial color="#d8cfb8" roughness={0.85} />
        </mesh>

        {/* main hall */}
        <mesh position={[0, 8.7, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[22, 10, 12]} />
          <meshStandardMaterial color={CREAM} roughness={0.8} />
        </mesh>

        {/* window band (glows at night) */}
        {[-7.5, -2.5, 2.5, 7.5].map((x) => (
          <mesh key={x} position={[x, 9.2, 5.55]}>
            <boxGeometry args={[2.6, 3.4, 0.3]} />
            <primitive object={winMat} attach="material" />
          </mesh>
        ))}
        {/* monumental doorway */}
        <mesh position={[0, 6.6, 6.2]}>
          <boxGeometry args={[4.4, 6.6, 0.5]} />
          <meshStandardMaterial color={DARK} roughness={0.4} />
        </mesh>

        {/* portico columns across the front */}
        {[-9, -5.4, -1.8, 1.8, 5.4, 9].map((x) => (
          <mesh key={x} position={[x, 8.6, 6.6]} castShadow>
            <cylinderGeometry args={[0.62, 0.68, 9.4, 14]} />
            <meshStandardMaterial color={CREAM} roughness={0.82} />
          </mesh>
        ))}
        {/* entablature over the columns */}
        <mesh position={[0, 13.9, 6.6]} castShadow>
          <boxGeometry args={[21, 1.6, 1.6]} />
          <meshStandardMaterial color="#e5ddc9" roughness={0.8} />
        </mesh>

        {/* attic + golden dome + finial */}
        <mesh position={[0, 14.6, -0.5]} castShadow>
          <boxGeometry args={[16, 1.6, 9]} />
          <meshStandardMaterial color="#e5ddc9" roughness={0.8} />
        </mesh>
        <mesh position={[0, 16.7, -0.5]} scale={[1, 0.72, 1]} castShadow>
          <sphereGeometry args={[3.4, 20, 16]} />
          <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.55} />
        </mesh>
        <mesh position={[0, 19.6, -0.5]}>
          <coneGeometry args={[0.5, 1.6, 8]} />
          <meshStandardMaterial color={GOLD} roughness={0.4} metalness={0.6} />
        </mesh>

        {/* flags flanking the hall */}
        {[-12.5, 12.5].map((x) => (
          <group key={x} position={[x, 0, 5]}>
            <mesh position={[0, 12, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 20, 6]} />
              <meshStandardMaterial color={ROOF} roughness={0.6} />
            </mesh>
            <mesh position={[Math.sign(x) * -0.9, 21, 0]}>
              <planeGeometry args={[1.8, 1.0]} />
              <meshStandardMaterial color="#c96f5a" roughness={0.7} side={DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* ── The clickable WORK WITH ME sign over the portico ─────────── */}
        <group position={[0, 15.3, 7.1]}>
          <mesh castShadow>
            <boxGeometry args={[14, 2.8, 0.5]} />
            <meshStandardMaterial color="#241d16" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.28]}>
            <boxGeometry args={[14.3, 3.1, 0.12]} />
            <primitive object={signMat} attach="material" />
          </mesh>
          <Text
            font={interSemi}
            position={[0, 0, 0.55]}
            fontSize={1.5}
            letterSpacing={0.1}
            anchorX="center"
            anchorY="middle"
            color="#1b1b1b"
          >
            WORK WITH ME
          </Text>
        </group>

        {/* engraved lintel over the door */}
        <Text
          font={interSemi}
          position={[0, 10.6, 6.5]}
          fontSize={0.72}
          letterSpacing={0.22}
          anchorX="center"
          anchorY="middle"
          color="#8a7d63"
        >
          ARRIVALS · THE FUTURE
        </Text>
      </group>
    </group>
  )
}

// ── Empty plot with an optional FOR SALE sign ────────────────────────────────
const PLOTS: Array<{ x: number; z: number; sign: boolean }> = [
  { x: -20, z: -281, sign: true },
  { x: 20, z: -283, sign: false },
  { x: -17, z: -296, sign: false },
  { x: 18, z: -296, sign: true },
]

function Plot({ x, z, sign }: { x: number; z: number; sign: boolean }) {
  return (
    <group position={[x, 0, z]}>
      {/* graded dirt pad */}
      <mesh position={[0, GRASS_Y + 0.12, 0]} receiveShadow>
        <boxGeometry args={[7, 0.24, 7]} />
        <meshStandardMaterial color="#c7b489" roughness={0.95} />
      </mesh>
      {/* corner stakes */}
      {[
        [-3.2, -3.2],
        [3.2, -3.2],
        [-3.2, 3.2],
        [3.2, 3.2],
      ].map(([sx, sz], i) => (
        <mesh key={i} position={[sx, GRASS_Y + 0.7, sz]}>
          <boxGeometry args={[0.16, 1.1, 0.16]} />
          <meshStandardMaterial color="#8a7a5a" roughness={0.8} />
        </mesh>
      ))}
      {sign && (
        <group position={[2.4, 0, 3]}>
          <mesh position={[0, GRASS_Y + 1.3, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2.6, 6]} />
            <meshStandardMaterial color="#6b5d45" roughness={0.8} />
          </mesh>
          <mesh position={[0, GRASS_Y + 2.6, 0.02]}>
            <boxGeometry args={[2.6, 1.5, 0.12]} />
            <meshStandardMaterial color="#fbf7ee" roughness={0.7} />
          </mesh>
          <Text
            font={interSemi}
            position={[0, GRASS_Y + 2.85, 0.1]}
            fontSize={0.42}
            letterSpacing={0.06}
            anchorX="center"
            anchorY="middle"
            color="#c0392b"
          >
            FOR SALE
          </Text>
          <Text
            font={interSemi}
            position={[0, GRASS_Y + 2.3, 0.1]}
            fontSize={0.24}
            letterSpacing={0.04}
            anchorX="center"
            anchorY="middle"
            color="#6b6660"
          >
            a plot in the future
          </Text>
        </group>
      )}
    </group>
  )
}

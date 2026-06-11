/**
 * Marina — the working harbor beside the lighthouse, at the seaward end of
 * the Past gateway. A timber boardwalk hugs the shore, three piers reach into
 * the bay with small boats moored alongside, palms and warm lanterns line the
 * promenade. Gives the waterfront the human activity the coast was missing.
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Instances, Instance } from '@react-three/drei'
import { Group } from 'three'
import { MARINA_T0, MARINA_T1 } from './lib/outskirts'
import { LAND_R } from './CoastEnvironment'

const WOOD = '#c2996b'
const WOOD_DARK = '#9a774e'
const PALM_GREEN = ['#4f7d3a', '#5d8c44', '#578540']

const D2R = Math.PI / 180

// World θ → ringGeometry θ: meshes rotated [-π/2,0,0] mirror the angle, so a
// world arc [T0,T1] is drawn with thetaStart=-T1, thetaLength=T1-T0.
const ARC_START = -MARINA_T1
const ARC_LEN = MARINA_T1 - MARINA_T0

const PIER_ANGLES = [47 * D2R, 58 * D2R, 69 * D2R]
const PIER_IN_R = 198
const PIER_OUT_R = 217

interface MooredBoat {
  x: number
  z: number
  ry: number
  phase: number
  hull: string
}

const HULLS = ['#d8cfc0', '#b9cdd6', '#d6b9a8', '#c9d6b9', '#d8cfc0', '#bfc8d8']

function buildBoats(): MooredBoat[] {
  // Two boats per pier, moored on alternating sides near the pier's outer half.
  const out: MooredBoat[] = []
  PIER_ANGLES.forEach((t, pi) => {
    for (let side = 0; side < 2; side++) {
      const r = 206 + side * 6 + pi * 1.5
      const lateral = (side === 0 ? 1 : -1) * 3.4
      // Perpendicular offset from the pier centerline
      const px = Math.cos(t) * r - Math.sin(t) * lateral
      const pz = Math.sin(t) * r + Math.cos(t) * lateral
      out.push({
        x: px,
        z: pz,
        ry: -t + (side === 0 ? 0.12 : -0.15),
        phase: pi * 2.1 + side * 1.3,
        hull: HULLS[(pi * 2 + side) % HULLS.length],
      })
    }
  })
  return out
}

function Boat({ spec }: { spec: MooredBoat }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      ref.current.position.y = -0.25 + Math.sin(t * 0.7 + spec.phase) * 0.14
      ref.current.rotation.z = Math.sin(t * 0.55 + spec.phase) * 0.035
    }
  })
  return (
    <group position={[spec.x, 0, spec.z]} rotation={[0, spec.ry, 0]}>
      <group ref={ref}>
        <mesh castShadow>
          <boxGeometry args={[3.6, 0.6, 1.4]} />
          <meshStandardMaterial color={spec.hull} roughness={0.8} />
        </mesh>
        <mesh position={[-0.3, 0.5, 0]}>
          <boxGeometry args={[1.3, 0.6, 1.0]} />
          <meshStandardMaterial color="#8a6a48" roughness={0.85} />
        </mesh>
        <mesh position={[0.7, 1.4, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2.6, 5]} />
          <meshStandardMaterial color="#5a4a36" roughness={1} />
        </mesh>
      </group>
    </group>
  )
}

function Palm({ x, z, scale, lean, hue }: { x: number; z: number; scale: number; lean: number; hue: number }) {
  const fronds = useMemo(() => Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2), [])
  const green = PALM_GREEN[hue % PALM_GREEN.length]
  return (
    <group position={[x, 0, z]} rotation={[0, 0, lean]} scale={scale}>
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.3, 6.4, 6]} />
        <meshStandardMaterial color="#8a6b4a" roughness={1} />
      </mesh>
      {fronds.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 1.1, 6.4, Math.sin(a) * 1.1]}
          rotation={[Math.sin(a) * 0.9, -a, Math.cos(a) * 0.9]}
          castShadow
        >
          <coneGeometry args={[0.42, 2.8, 4]} />
          <meshStandardMaterial color={green} roughness={0.95} flatShading />
        </mesh>
      ))}
    </group>
  )
}

export function Marina() {
  const boats = useMemo(buildBoats, [])

  // Promenade fixtures along the boardwalk's inner edge.
  const palms = useMemo(() => {
    return [44, 52, 61, 70].map((deg, i) => {
      const t = deg * D2R
      return { x: Math.cos(t) * 189, z: Math.sin(t) * 189, scale: 0.8 + (i % 3) * 0.14, lean: (i % 2 ? 1 : -1) * 0.05, hue: i }
    })
  }, [])

  const lanterns = useMemo(() => {
    return [46, 56, 66, 74].map((deg) => {
      const t = deg * D2R
      return { x: Math.cos(t) * 193, z: Math.sin(t) * 193 }
    })
  }, [])

  // Pilings along the boardwalk's sea edge.
  const pilings = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const t = MARINA_T0 + ((i + 0.5) / 12) * (MARINA_T1 - MARINA_T0)
      return { x: Math.cos(t) * (LAND_R - 4.5), z: Math.sin(t) * (LAND_R - 4.5) }
    })
  }, [])

  return (
    <group>
      {/* Timber boardwalk hugging the shore */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]} renderOrder={5}>
        <ringGeometry args={[192, LAND_R - 3, 64, 1, ARC_START, ARC_LEN]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} depthWrite={false} />
      </mesh>
      {/* Darker kerb plank at the sea edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.075, 0]} renderOrder={5}>
        <ringGeometry args={[LAND_R - 4.4, LAND_R - 3, 64, 1, ARC_START, ARC_LEN]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.9} depthWrite={false} />
      </mesh>

      {/* Boardwalk pilings */}
      <Instances limit={pilings.length}>
        <cylinderGeometry args={[0.28, 0.32, 2.4, 6]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={1} />
        {pilings.map((p, i) => (
          <Instance key={i} position={[p.x, 0.4, p.z]} />
        ))}
      </Instances>

      {/* Piers reaching into the bay */}
      {PIER_ANGLES.map((t, i) => {
        const midR = (PIER_IN_R + PIER_OUT_R) / 2
        const len = PIER_OUT_R - PIER_IN_R
        return (
          <group key={i}>
            <mesh
              position={[Math.cos(t) * midR, 0.55, Math.sin(t) * midR]}
              rotation={[0, -t, 0]}
              castShadow
            >
              <boxGeometry args={[len, 0.35, 2.6]} />
              <meshStandardMaterial color={WOOD} roughness={0.9} />
            </mesh>
            {/* Posts under the deck */}
            {[0.2, 0.5, 0.8].map((f, j) => {
              const r = PIER_IN_R + f * len
              return (
                <group key={j}>
                  <mesh position={[Math.cos(t) * r - Math.sin(t) * 1.1, -0.3, Math.sin(t) * r + Math.cos(t) * 1.1]}>
                    <cylinderGeometry args={[0.16, 0.18, 1.8, 5]} />
                    <meshStandardMaterial color={WOOD_DARK} roughness={1} />
                  </mesh>
                  <mesh position={[Math.cos(t) * r + Math.sin(t) * 1.1, -0.3, Math.sin(t) * r - Math.cos(t) * 1.1]}>
                    <cylinderGeometry args={[0.16, 0.18, 1.8, 5]} />
                    <meshStandardMaterial color={WOOD_DARK} roughness={1} />
                  </mesh>
                </group>
              )
            })}
          </group>
        )
      })}

      {/* Moored boats, bobbing */}
      {boats.map((b, i) => (
        <Boat key={i} spec={b} />
      ))}

      {/* Promenade palms */}
      {palms.map((p, i) => (
        <Palm key={i} {...p} />
      ))}

      {/* Warm harbor lanterns */}
      {lanterns.map((l, i) => (
        <group key={i} position={[l.x, 0, l.z]}>
          <mesh position={[0, 1.7, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 3.4, 6]} />
            <meshStandardMaterial color="#544c42" roughness={1} />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[0.24, 8, 8]} />
            <meshStandardMaterial
              color="#fff0c0"
              emissive="#ffcc66"
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

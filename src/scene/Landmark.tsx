import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import { Group, MeshStandardMaterial, type Object3D } from 'three'
import { easing } from 'maath'
import type { Landmark as LandmarkData, LandmarkKind } from '../types'
import { type LandmarkDef } from './lib/cityModel'
import interBold from '@fontsource/inter/files/inter-latin-800-normal.woff'

const CIVIC_GREY = '#bcb6a8'

interface LandmarkProps {
  def: LandmarkDef
  hovered: boolean
  showLabel: boolean
  onHover: (id: string | null) => void
  onSelect: (landmark: LandmarkData, object: Object3D) => void
}

export function Landmark({ def, hovered, showLabel, onHover, onSelect }: LandmarkProps) {
  const { landmark, footprint: w } = def
  const liftRef = useRef<Group>(null)
  const labelRef = useRef<Group>(null)
  const gl = useThree((s) => s.gl)

  const grey = useMemo(
    () =>
      new MeshStandardMaterial({
        color: CIVIC_GREY,
        roughness: 0.9,
        emissive: '#3a352c',
        emissiveIntensity: 0,
      }),
    [],
  )
  useEffect(() => () => grey.dispose(), [grey])

  useFrame((_, dt) => {
    // World keeps full height in every view now, so the sign needs no counter-scale.
    if (labelRef.current) easing.damp(labelRef.current.scale, 'y', 1, 0.22, dt)
    // Hover glows the landmark rather than lifting it.
    easing.damp(grey, 'emissiveIntensity', hovered ? 0.38 : 0, 0.12, dt)
  })

  const signY = landmarkTop(landmark.kind, w) + 1.5

  return (
    <group
      position={def.position}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        onHover(landmark.id)
        gl.domElement.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        gl.domElement.style.cursor = ''
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onSelect(landmark, e.eventObject)
      }}
    >
      <group ref={liftRef}>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[w * 1.12, 0.5, w * 1.12]} />
          <meshStandardMaterial color="#9a9488" roughness={0.95} />
        </mesh>
        <Silhouette kind={landmark.kind} w={w} grey={grey} accent={landmark.accent} />
        {showLabel && (
          <group position={[0, signY, 0]}>
            <group ref={labelRef}>
              <PlaceSign label={landmark.label} accent={landmark.accent} w={w} />
            </group>
          </group>
        )}
      </group>
    </group>
  )
}

function landmarkTop(kind: LandmarkKind, w: number): number {
  switch (kind) {
    case 'cinema':
      return 6.5
    case 'stadium':
      return 3.0
    case 'library':
      return 4.8
    case 'gallery':
      return 3.5
    case 'cafe':
      return 2.6
    case 'music':
      return 1.6 + w * 0.5
  }
}

function Silhouette({
  kind,
  w,
  grey,
  accent,
}: {
  kind: LandmarkKind
  w: number
  grey: MeshStandardMaterial
  accent: string
}) {
  switch (kind) {
    case 'cinema':
      return (
        <>
          <mesh position={[0, 2, 0]} material={grey} castShadow receiveShadow>
            <boxGeometry args={[w, 4, w * 0.8]} />
          </mesh>
          <mesh position={[0, 3, w * 0.4 + 0.16]} castShadow>
            <boxGeometry args={[w * 1.02, 1, 0.3]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
          <mesh position={[w * 0.5, 5.2, w * 0.3]} castShadow>
            <boxGeometry args={[0.35, 2.6, 0.35]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
        </>
      )
    case 'stadium':
      return (
        <group scale={[1, 1, 0.72]}>
          <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]} material={grey} castShadow receiveShadow>
            <torusGeometry args={[w * 0.42, w * 0.12, 10, 28]} />
          </mesh>
          <mesh position={[0, 2.6, 0]} rotation={[Math.PI / 2, 0, 0]} material={grey} castShadow>
            <torusGeometry args={[w * 0.3, w * 0.08, 10, 28]} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[w * 0.34, w * 0.34, 0.4, 28]} />
            <meshStandardMaterial color={accent} roughness={0.85} />
          </mesh>
        </group>
      )
    case 'library':
      return (
        <>
          <mesh position={[0, 1.7, 0]} material={grey} castShadow receiveShadow>
            <boxGeometry args={[w, 3.4, w * 0.8]} />
          </mesh>
          {[-0.4, -0.2, 0, 0.2, 0.4].map((fx, i) => (
            <mesh key={i} position={[fx * w, 1.4, w * 0.4]} material={grey} castShadow>
              <cylinderGeometry args={[w * 0.05, w * 0.05, 2.4, 10]} />
            </mesh>
          ))}
          <mesh position={[0, 3.5, w * 0.16]} castShadow>
            <boxGeometry args={[w * 1.06, 0.5, w * 0.9]} />
            <meshStandardMaterial color={accent} roughness={0.7} />
          </mesh>
          <mesh position={[0, 4.25, w * 0.16]} rotation={[0, Math.PI / 4, 0]} material={grey} castShadow>
            <coneGeometry args={[w * 0.5, 1.1, 4]} />
          </mesh>
        </>
      )
    case 'gallery':
      return (
        <>
          <mesh position={[0, 1.6, 0]} material={grey} castShadow receiveShadow>
            <boxGeometry args={[w, 3.2, w * 0.8]} />
          </mesh>
          <mesh position={[0, 1.6, w * 0.4 + 0.06]}>
            <boxGeometry args={[w * 0.9, 2.6, 0.12]} />
            <meshStandardMaterial color={accent} roughness={0.3} metalness={0.1} transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 3.3, 0]} material={grey} castShadow>
            <boxGeometry args={[w * 1.06, 0.3, w * 0.86]} />
          </mesh>
        </>
      )
    case 'cafe':
      return (
        <>
          <mesh position={[0, 1.2, 0]} material={grey} castShadow receiveShadow>
            <boxGeometry args={[w * 0.8, 2.4, w * 0.7]} />
          </mesh>
          <mesh position={[0, 2, w * 0.35 + 0.2]} rotation={[-0.4, 0, 0]} castShadow>
            <boxGeometry args={[w * 0.85, 0.12, 1.4]} />
            <meshStandardMaterial color={accent} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.9, w * 0.35 + 0.02]}>
            <boxGeometry args={[w * 0.22, 1.6, 0.1]} />
            <meshStandardMaterial color="#5a4b3a" roughness={0.8} />
          </mesh>
        </>
      )
    case 'music':
      return (
        <>
          <mesh position={[0, 0.8, 0]} material={grey} castShadow receiveShadow>
            <boxGeometry args={[w, 1.6, w * 0.7]} />
          </mesh>
          <mesh position={[0, 1.6, -w * 0.1]} rotation={[0, 0, Math.PI / 2]} material={grey} castShadow>
            <cylinderGeometry args={[w * 0.5, w * 0.5, w * 0.9, 20, 1, true, 0, Math.PI]} />
          </mesh>
          <mesh position={[0, 1.6 + w * 0.5, -w * 0.1]}>
            <boxGeometry args={[w * 0.92, 0.18, 0.18]} />
            <meshStandardMaterial color={accent} roughness={0.6} />
          </mesh>
        </>
      )
  }
}

function PlaceSign({ label, accent, w }: { label: string; accent: string; w: number }) {
  const width = Math.max(w * 0.95, 4)
  const h = 1.3
  return (
    <Billboard>
      <mesh>
        <planeGeometry args={[width, h]} />
        <meshBasicMaterial color={accent} toneMapped={false} />
      </mesh>
      <Text
        font={interBold}
        position={[0, 0, 0.03]}
        fontSize={h * 0.5}
        maxWidth={width * 0.9}
        anchorX="center"
        anchorY="middle"
        color="#1b1b1b"
      >
        {label}
      </Text>
    </Billboard>
  )
}

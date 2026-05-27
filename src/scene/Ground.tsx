import type { Quadrant } from '../types'
import { GROUND, PLAZA, ROAD, districtTint } from './lib/cityTheme'
import { CITY_BOUNDS, CITY_RADIUS } from './lib/cityModel'
import { LOT } from './lib/project3d'

const { minX, maxX, minZ, maxZ } = CITY_BOUNDS

interface Quad {
  q: Quadrant
  cx: number
  cz: number
  sx: number
  sz: number
}

const QUADS: Quad[] = [
  { q: 'q1', cx: maxX / 2, cz: minZ / 2, sx: maxX,   sz: -minZ }, // enterprise · complex
  { q: 'q2', cx: minX / 2, cz: minZ / 2, sx: -minX,  sz: -minZ }, // enterprise · simple
  { q: 'q3', cx: minX / 2, cz: maxZ / 2, sx: -minX,  sz: maxZ  }, // consumer · simple
  { q: 'q4', cx: maxX / 2, cz: maxZ / 2, sx: maxX,   sz: maxZ  }, // consumer · complex
]

export function Ground() {
  const span = CITY_RADIUS * 2.4

  return (
    <group>
      {/* Base ground — warm amber earth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[span, span]} />
        <meshStandardMaterial color={GROUND} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* District tints — much more saturated (0.28 opacity vs 0.12 before) */}
      {QUADS.map((qd) => (
        <mesh
          key={qd.q}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[qd.cx, 0.03, qd.cz]}
        >
          <planeGeometry args={[qd.sx, qd.sz]} />
          <meshBasicMaterial
            color={districtTint(qd.q)}
            transparent
            opacity={0.32}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Subtle grid overlay — gives depth and scale reference */}
      <gridHelper
        args={[span, Math.round(span / 8), '#a07840', '#a07840']}
        position={[0, 0.06, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Central plaza — warm terracotta circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[LOT * 1.1, 64]} />
        <meshStandardMaterial color={PLAZA} roughness={0.9} />
      </mesh>

      {/* Roundabout ring road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[LOT * 0.52, LOT * 0.76, 64]} />
        <meshBasicMaterial color={ROAD} />
      </mesh>

      {/* Central obelisk / monument — taller, more dramatic */}
      {/* Base */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 3.0, 1.6, 8]} />
        <meshStandardMaterial color="#8a7050" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Middle plinth */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[2.8, 1.2, 2.8]} />
        <meshStandardMaterial color="#7a6040" roughness={0.8} metalness={0.05} />
      </mesh>

      {/* Obelisk spire */}
      <mesh position={[0, 6.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.9, 7.8, 4]} />
        <meshStandardMaterial color="#c8a870" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Golden glowing tip */}
      <mesh position={[0, 10.6, 0]}>
        <sphereGeometry args={[0.35, 12, 12]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ffaa00"
          emissiveIntensity={3.5}
          roughness={0.1}
          metalness={0.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

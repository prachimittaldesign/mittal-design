import { Billboard, Text } from '@react-three/drei'
import interSemi from '@fontsource/inter/files/inter-latin-700-normal.woff'
import { GATEWAYS } from './lib/cityModel'

const INK = '#1b1b1b'
const PAPER = '#fbf7ee'
const POST = '#6b6660'
const ARM_Y = 7.6
const ARM_LEN = 6.4
const ARM_OFF = 3.9

// The four avenues, shared by the 3D fingerpost and the 2D flat labels.
// Axis meaning: +X = complex, -X = simple, -Z = enterprise, +Z = consumer.
const AVENUES = [
  { name: 'Complex Way', axis: 'x', dir: 1 },
  { name: 'Simple Lane', axis: 'x', dir: -1 },
  { name: 'Enterprise Ave', axis: 'z', dir: -1 },
  { name: 'Consumer St', axis: 'z', dir: 1 },
] as const
const AVENUE_LABEL_R = 24

// In-world wayfinding: a fingerpost at the roundabout names the four avenues.
// Fixed-oriented (not billboarded) so the signs read as part of the city; each
// arm carries text on both faces so it's legible from either approach.
// Axis meaning: +X = complex, -X = simple, -Z = enterprise (away), +Z = consumer.
export function StreetSigns() {
  return (
    <group>
      {/* Post */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 9, 10]} />
        <meshStandardMaterial color={POST} roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 9.1, 0]} castShadow>
        <sphereGeometry args={[0.34, 12, 10]} />
        <meshStandardMaterial color={POST} roughness={0.6} metalness={0.3} />
      </mesh>

      {AVENUES.map((a) =>
        a.axis === 'x' ? (
          <ArmX key={a.name} name={a.name} dir={a.dir} />
        ) : (
          <ArmZ key={a.name} name={a.name} dir={a.dir} />
        ),
      )}
    </group>
  )
}

// Flat, on-the-ground avenue names for 2D/iso view, where the 3D fingerpost is
// hidden. Text lies in the XZ plane, so the world's vertical flatten can't
// squash it. Each label runs along its avenue.
export function AvenueLabels() {
  return (
    <group>
      {AVENUES.map((a) => {
        const pos: [number, number, number] =
          a.axis === 'x' ? [AVENUE_LABEL_R * a.dir, 0.3, 0] : [0, 0.3, AVENUE_LABEL_R * a.dir]
        const yaw = a.axis === 'z' ? Math.PI / 2 : 0
        return (
          <group key={a.name} position={pos} rotation={[0, yaw, 0]}>
            <Text
              font={interSemi}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={2.4}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.06}
              color={INK}
              outlineWidth={0.05}
              outlineColor={PAPER}
            >
              {a.name}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

// Billboarded markers at the far ends of the gateway avenues. Mounted outside
// the iso-flatten group so they stay upright in both views. The −Z "Future"
// marker sits deep enough to read as receding into the fog.
export function GatewayLabels() {
  return (
    <group>
      {/* 'The Future' now reads as the Hollywood-style sign on the island
          hillside (FutureIsland.tsx), so only the +Z 'The Past' marker remains. */}
      {GATEWAYS.filter((g) => g.id !== 'future').map((g) => (
        <Billboard key={g.id} position={[0, 7, g.z]}>
          <Text
            font={interSemi}
            fontSize={4.5}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.18}
            color={POST}
            fillOpacity={0.55}
            outlineWidth={0}
          >
            {g.label.toUpperCase()}
          </Text>
        </Billboard>
      ))}
    </group>
  )
}

// Arm extending along X; broad faces toward ±Z.
function ArmX({ name, dir }: { name: string; dir: 1 | -1 }) {
  return (
    <group position={[ARM_OFF * dir, ARM_Y, 0]}>
      <mesh castShadow>
        <boxGeometry args={[ARM_LEN, 0.95, 0.14]} />
        <meshStandardMaterial color={INK} roughness={0.7} />
      </mesh>
      <SignText name={name} position={[0, 0, 0.09]} rotationY={0} />
      <SignText name={name} position={[0, 0, -0.09]} rotationY={Math.PI} />
    </group>
  )
}

// Arm extending along Z; broad faces toward ±X.
function ArmZ({ name, dir }: { name: string; dir: 1 | -1 }) {
  return (
    <group position={[0, ARM_Y, ARM_OFF * dir]}>
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.95, ARM_LEN]} />
        <meshStandardMaterial color={INK} roughness={0.7} />
      </mesh>
      <SignText name={name} position={[0.09, 0, 0]} rotationY={Math.PI / 2} />
      <SignText name={name} position={[-0.09, 0, 0]} rotationY={-Math.PI / 2} />
    </group>
  )
}

function SignText({
  name,
  position,
  rotationY,
}: {
  name: string
  position: [number, number, number]
  rotationY: number
}) {
  return (
    <Text
      font={interSemi}
      position={position}
      rotation={[0, rotationY, 0]}
      fontSize={0.6}
      maxWidth={ARM_LEN * 0.9}
      anchorX="center"
      anchorY="middle"
      color={PAPER}
      outlineWidth={0.012}
      outlineColor={INK}
    >
      {name}
    </Text>
  )
}

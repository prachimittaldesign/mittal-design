import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Color, Group, MeshStandardMaterial, type Object3D } from 'three'
import { easing } from 'maath'
import { Label } from './Label'
import { bodyColor, roofColor, DIM_GREY, layerColor, GLASS_WINDOW, WARM_WINDOW } from './lib/cityTheme'
import type { BuildingDef } from './lib/cityModel'
import type { Appearance, Project, RoofStyle } from '../types'

const DIM = new Color(DIM_GREY)

interface BuildingProps {
  def: BuildingDef
  hovered: boolean
  appearance: Appearance
  showLabel: boolean
  onHover: (id: string | null) => void
  onSelect: (project: Project, object: Object3D) => void
}

interface Tier {
  size: [number, number, number]
  y: number
}

function massing(w: number, height: number, roof: RoofStyle): Tier[] {
  if (roof === 'setback') {
    const h1 = height * 0.6
    const h2 = height * 0.28
    const h3 = height * 0.12
    const w2 = w * 0.72
    const w3 = w * 0.48
    return [
      { size: [w, h1, w], y: h1 / 2 },
      { size: [w2, h2, w2], y: h1 + h2 / 2 },
      { size: [w3, h3, w3], y: h1 + h2 + h3 / 2 },
    ]
  }
  return [{ size: [w, height, w], y: height / 2 }]
}

// Window strips — horizontal bands of glowing emissive panels on building faces
function WindowStrip({ w, y, district }: { w: number; y: number; district: 'glass' | 'warm' }) {
  const wColor = district === 'glass' ? GLASS_WINDOW : WARM_WINDOW
  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: wColor,
        emissive: wColor,
        emissiveIntensity: 1.4,
        roughness: 0.2,
        metalness: 0.1,
        toneMapped: false,
      }),
    [wColor],
  )
  useEffect(() => () => mat.dispose(), [mat])

  const stripH = 0.45
  const inset = 0.04
  return (
    <>
      {/* All four faces */}
      <mesh position={[0, y, w * 0.5 + inset]} material={mat}>
        <planeGeometry args={[w * 0.84, stripH]} />
      </mesh>
      <mesh position={[0, y, -(w * 0.5 + inset)]} rotation={[0, Math.PI, 0]} material={mat}>
        <planeGeometry args={[w * 0.84, stripH]} />
      </mesh>
      <mesh position={[w * 0.5 + inset, y, 0]} rotation={[0, -Math.PI / 2, 0]} material={mat}>
        <planeGeometry args={[w * 0.84, stripH]} />
      </mesh>
      <mesh position={[-(w * 0.5 + inset), y, 0]} rotation={[0, Math.PI / 2, 0]} material={mat}>
        <planeGeometry args={[w * 0.84, stripH]} />
      </mesh>
    </>
  )
}

export function Building({ def, hovered, appearance, showLabel, onHover, onSelect }: BuildingProps) {
  const { footprint: w, height, district, roofStyle, position, project } = def
  const liftRef = useRef<Group>(null)
  const gl = useThree((s) => s.gl)

  const baseEmissive = district === 'glass' ? 0.18 : 0.08
  const baseColor = useMemo(() => new Color(bodyColor(district)), [district])

  const body = useMemo(
    () =>
      new MeshStandardMaterial({
        color: bodyColor(district),
        roughness: district === 'glass' ? 0.28 : 0.78,
        metalness: district === 'glass' ? 0.35 : 0.04,
        emissive: district === 'glass' ? '#1a3a60' : '#602010',
        emissiveIntensity: baseEmissive,
      }),
    [district, baseEmissive],
  )
  useEffect(() => () => body.dispose(), [body])

  // Hover glow — an outer shell that brightens on hover
  const hoverGlow = useMemo(
    () =>
      new MeshStandardMaterial({
        color: district === 'glass' ? '#4a90e8' : '#ff7040',
        emissive: district === 'glass' ? '#4a90e8' : '#ff7040',
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
        roughness: 0.4,
        toneMapped: false,
      }),
    [district],
  )
  useEffect(() => () => hoverGlow.dispose(), [hoverGlow])

  const tiers = useMemo(() => massing(w, height, roofStyle), [w, height, roofStyle])
  const topWidth = tiers[tiers.length - 1].size[0]
  const roofH = w * 0.5
  const signY = roofStyle === 'pitched' ? height + roofH + 2.0 : height + 3.0

  const layerCol = useMemo(
    () =>
      appearance.mode === 'layer' && appearance.layer
        ? new Color(layerColor(project, appearance.layer))
        : null,
    [appearance.mode, appearance.layer, project],
  )
  const tagMatches = appearance.activeTag !== null && project.tags.includes(appearance.activeTag)

  // Number of window floors based on building height
  const windowFloors = useMemo(() => {
    const floors: number[] = []
    const step = 3.5
    const start = 2.5
    for (let y = start; y < height - 1; y += step) floors.push(y)
    return floors
  }, [height])

  useFrame((_, dt) => {
    let target = baseColor
    let em = hovered ? baseEmissive + 0.55 : baseEmissive
    let liftBonus = 0

    if (appearance.mode === 'layer' && layerCol) {
      target = layerCol
    } else if (appearance.mode === 'tag') {
      if (tagMatches) liftBonus = 0.8
      else {
        target = DIM
        em = 0
      }
    }

    if (liftRef.current) easing.damp(liftRef.current.position, 'y', (hovered ? 2.2 : 0) + liftBonus, 0.12, dt)
    easing.dampC(body.color, target, 0.18, dt)
    easing.damp(body, 'emissiveIntensity', em, 0.15, dt)

    // Hover glow shell fade
    easing.damp(hoverGlow, 'emissiveIntensity', hovered ? 1.8 : 0, 0.14, dt)
    easing.damp(hoverGlow, 'opacity', hovered ? 0.22 : 0, 0.14, dt)
  })

  return (
    <group
      position={position}
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
      <group ref={liftRef}>
        {/* Footing plinth */}
        <mesh position={[0, 0.35, 0]} receiveShadow>
          <boxGeometry args={[w * 1.1, 0.7, w * 1.1]} />
          <meshStandardMaterial color="#6a5a40" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Building massing */}
        {tiers.map((t, i) => (
          <mesh key={i} position={[0, t.y, 0]} material={body} castShadow receiveShadow>
            <boxGeometry args={t.size} />
          </mesh>
        ))}

        {/* Hover glow shell — slightly larger than top tier */}
        <mesh position={[0, tiers[0].y, 0]} material={hoverGlow}>
          <boxGeometry args={[tiers[0].size[0] * 1.04, tiers[0].size[1] * 1.01, tiers[0].size[2] * 1.04]} />
        </mesh>

        {/* Glowing window strips — the key "wow" detail */}
        {windowFloors.map((y, i) => (
          <WindowStrip key={i} w={tiers[0].size[0] * 0.9} y={y} district={district} />
        ))}

        {/* Roofline */}
        {roofStyle === 'pitched' ? (
          <mesh position={[0, height + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[w * 0.74, roofH, 4]} />
            <meshStandardMaterial color={roofColor('warm')} roughness={0.85} metalness={0.05} />
          </mesh>
        ) : (
          <>
            <mesh position={[0, height + 0.3, 0]} castShadow>
              <boxGeometry args={[topWidth * 1.06, 0.6, topWidth * 1.06]} />
              <meshStandardMaterial color={roofColor(district)} roughness={0.7} metalness={0.08} />
            </mesh>
            {/* Rooftop antenna / penthouse for tall glass towers */}
            {district === 'glass' && height > 20 && (
              <>
                <mesh position={[topWidth * 0.18, height + 1.5, -topWidth * 0.12]} castShadow>
                  <boxGeometry args={[topWidth * 0.38, 1.8, topWidth * 0.38]} />
                  <meshStandardMaterial color="#1a3a60" roughness={0.5} metalness={0.3} />
                </mesh>
                {/* Antenna spire with glowing tip */}
                <mesh position={[topWidth * 0.18, height + 3.5, -topWidth * 0.12]}>
                  <cylinderGeometry args={[0.06, 0.06, 2.4, 6]} />
                  <meshStandardMaterial color="#aaccff" emissive="#aaccff" emissiveIntensity={2} toneMapped={false} />
                </mesh>
              </>
            )}
          </>
        )}

        {showLabel && <Label project={project} y={signY} footprint={w} />}
      </group>
    </group>
  )
}

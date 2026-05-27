import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Color, Group, MeshStandardMaterial, Vector3, type Object3D } from 'three'
import { easing } from 'maath'
import { Label } from './Label'
import { bodyColor, roofColor, DIM_GREY, layerColor, GLASS_WINDOW, WARM_WINDOW } from './lib/cityTheme'
import { ISO_FLATTEN, type BuildingDef } from './lib/cityModel'
import type { Appearance, Project, RoofStyle, ViewMode } from '../types'

const DIM = new Color(DIM_GREY)

// A band of glowing emissive window panels wrapped around all four faces.
// toneMapped:false keeps them bright so the Bloom pass makes them glow after dark.
function WindowStrip({ w, y, district }: { w: number; y: number; district: 'glass' | 'warm' }) {
  const wColor = district === 'glass' ? GLASS_WINDOW : WARM_WINDOW
  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: wColor,
        emissive: wColor,
        emissiveIntensity: 1.3,
        roughness: 0.2,
        metalness: 0.1,
        toneMapped: false,
      }),
    [wColor],
  )
  useEffect(() => () => mat.dispose(), [mat])

  const stripH = 0.4
  const inset = 0.04
  const fw = w * 0.84
  return (
    <>
      <mesh position={[0, y, w * 0.5 + inset]} material={mat}>
        <planeGeometry args={[fw, stripH]} />
      </mesh>
      <mesh position={[0, y, -(w * 0.5 + inset)]} rotation={[0, Math.PI, 0]} material={mat}>
        <planeGeometry args={[fw, stripH]} />
      </mesh>
      <mesh position={[w * 0.5 + inset, y, 0]} rotation={[0, -Math.PI / 2, 0]} material={mat}>
        <planeGeometry args={[fw, stripH]} />
      </mesh>
      <mesh position={[-(w * 0.5 + inset), y, 0]} rotation={[0, Math.PI / 2, 0]} material={mat}>
        <planeGeometry args={[fw, stripH]} />
      </mesh>
    </>
  )
}

interface BuildingProps {
  def: BuildingDef
  hovered: boolean
  appearance: Appearance
  showLabel: boolean
  view: ViewMode
  skylineX: number   // target X position when view === 'skyline'
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
  // flat + pitched share a single box body
  return [{ size: [w, height, w], y: height / 2 }]
}

export function Building({ def, hovered, appearance, showLabel, view, skylineX, onHover, onSelect }: BuildingProps) {
  const { footprint: w, height, district, roofStyle, position, project } = def
  const outerRef  = useRef<Group>(null)
  const liftRef   = useRef<Group>(null)
  const labelRef  = useRef<Group>(null)
  const gl = useThree((s) => s.gl)

  // Pre-computed target positions — avoids per-frame allocations.
  const basePos    = useMemo(() => new Vector3(position[0], 0, position[2]), [position])
  const skylinePos = useMemo(() => new Vector3(skylineX, 0, 0), [skylineX])

  // Seed the group at the correct city position before first paint.
  useLayoutEffect(() => {
    outerRef.current?.position.copy(basePos)
  }, [basePos])

  const baseEmissive = district === 'glass' ? 0.14 : 0.05
  const baseColor = useMemo(() => new Color(bodyColor(district)), [district])
  const body = useMemo(() => {
    return new MeshStandardMaterial({
      color: bodyColor(district),
      roughness: district === 'glass' ? 0.42 : 0.88,
      metalness: district === 'glass' ? 0.18 : 0.0,
      emissive: district === 'glass' ? '#2b3742' : '#3a2f1e',
      emissiveIntensity: baseEmissive,
    })
  }, [district, baseEmissive])
  useEffect(() => () => body.dispose(), [body])

  // A coloured halo shell that fades in on hover for an extra glow cue.
  const hoverGlow = useMemo(
    () =>
      new MeshStandardMaterial({
        color: district === 'glass' ? '#5aa0e8' : '#ff8a50',
        emissive: district === 'glass' ? '#5aa0e8' : '#ff8a50',
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
        roughness: 0.4,
        toneMapped: false,
      }),
    [district],
  )
  useEffect(() => () => hoverGlow.dispose(), [hoverGlow])

  // Lit window floors, spaced up the tower height.
  const windowFloors = useMemo(() => {
    const floors: number[] = []
    for (let y = 2.5; y < height - 1; y += 3.5) floors.push(y)
    return floors
  }, [height])

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

  useFrame((_, dt) => {
    // Slide buildings into skyline formation or back to city position.
    if (outerRef.current) {
      easing.damp3(
        outerRef.current.position,
        view === 'skyline' ? skylinePos : basePos,
        0.2,
        dt,
      )
    }

    let target = baseColor
    let em = hovered ? baseEmissive + 0.5 : baseEmissive
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
    if (liftRef.current) easing.damp(liftRef.current.position, 'y', liftBonus, 0.12, dt)
    // Cancel iso y-flatten on the label; in skyline, labels stay upright too.
    const labelScale = view === 'iso' ? 1 / ISO_FLATTEN : 1
    if (labelRef.current) easing.damp(labelRef.current.scale, 'y', labelScale, 0.22, dt)
    easing.dampC(body.color, target, 0.18, dt)
    easing.damp(body, 'emissiveIntensity', em, 0.15, dt)
    easing.damp(hoverGlow, 'emissiveIntensity', hovered ? 1.6 : 0, 0.14, dt)
    easing.damp(hoverGlow, 'opacity', hovered ? 0.2 : 0, 0.14, dt)
  })

  return (
    <group
      ref={outerRef}
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
        {/* footing — grounds the tower */}
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <boxGeometry args={[w * 1.08, 0.6, w * 1.08]} />
          <meshStandardMaterial color="#9a9488" roughness={0.95} />
        </mesh>

        {/* massing */}
        {tiers.map((t, i) => (
          <mesh key={i} position={[0, t.y, 0]} material={body} castShadow receiveShadow>
            <boxGeometry args={t.size} />
          </mesh>
        ))}

        {/* hover halo — a slightly larger shell around the base tier */}
        <mesh position={[0, tiers[0].y, 0]} material={hoverGlow}>
          <boxGeometry args={[tiers[0].size[0] * 1.05, tiers[0].size[1] * 1.01, tiers[0].size[2] * 1.05]} />
        </mesh>

        {/* glowing window bands */}
        {windowFloors.map((y, i) => (
          <WindowStrip key={i} w={tiers[0].size[0]} y={y} district={district} />
        ))}

        {/* roofline */}
        {roofStyle === 'pitched' ? (
          <mesh position={[0, height + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[w * 0.74, roofH, 4]} />
            <meshStandardMaterial color={roofColor('warm')} roughness={0.9} />
          </mesh>
        ) : (
          <>
            <mesh position={[0, height + 0.25, 0]} castShadow>
              <boxGeometry args={[topWidth * 1.06, 0.5, topWidth * 1.06]} />
              <meshStandardMaterial color={roofColor(district)} roughness={0.8} />
            </mesh>
            {district === 'glass' && height > 20 && (
              <mesh position={[topWidth * 0.18, height + 1.3, -topWidth * 0.12]} castShadow>
                <boxGeometry args={[topWidth * 0.4, 1.6, topWidth * 0.4]} />
                <meshStandardMaterial color="#8a939c" roughness={0.7} />
              </mesh>
            )}
          </>
        )}

        {showLabel && (
          <group position={[0, signY, 0]}>
            <group ref={labelRef}>
              <Label project={project} footprint={w} />
            </group>
          </group>
        )}
      </group>
    </group>
  )
}

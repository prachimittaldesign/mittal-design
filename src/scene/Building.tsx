import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { Color, ExtrudeGeometry, Group, MeshPhysicalMaterial, MeshStandardMaterial, Shape as ThreeShape, Vector3, type Object3D } from 'three'
import { easing } from 'maath'
import { Label } from './Label'
import { nightFactor } from '../lib/sky'
import {
  buildingCategory,
  isGlassTower,
  facadeColor,
  stuccoRoof,
  glassFacade,
  glassRoof,
  glassWindow,
  STUCCO_WINDOW,
  DIM_GREY,
  layerColor,
  type BuildingCategory,
} from './lib/cityTheme'
import { type BuildingDef } from './lib/cityModel'
import type { Appearance, Project, RoofStyle, ViewMode } from '../types'

const DIM = new Color(DIM_GREY)

// Stable deterministic hash from a project ID → non-negative integer.
// Used to pick architectural shapes so each building has a consistent form.
function idHash(id: string): number {
  let h = 0
  for (const c of id) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0
  return h >>> 0
}

type Shape = 'box' | 'setback' | 'slab' | 'tapered'

function pickShape(id: string, district: 'glass' | 'warm', height: number): Shape {
  if (district !== 'glass') return 'box'
  const h = idHash(id)
  if (height > 30) return (['setback', 'slab', 'tapered', 'slab', 'setback', 'tapered'] as Shape[])[h % 6]
  if (height > 18) return (['setback', 'slab', 'box'] as Shape[])[h % 3]
  return 'box'
}

// Glowing window bands on all four faces, respecting rectangular footprints.
function WindowStrip({ w, d, y, color }: { w: number; d: number; y: number; color: string }) {
  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.8,
        roughness: 0.1,
        metalness: 0.2,
        toneMapped: false,
      }),
    [color],
  )
  useEffect(() => () => mat.dispose(), [mat])

  const stripH = 0.4
  const inset = 0.04
  const fw = w * 0.84
  const fd = d * 0.84
  return (
    <>
      <mesh position={[0, y, d * 0.5 + inset]} material={mat}>
        <planeGeometry args={[fw, stripH]} />
      </mesh>
      <mesh position={[0, y, -(d * 0.5 + inset)]} rotation={[0, Math.PI, 0]} material={mat}>
        <planeGeometry args={[fw, stripH]} />
      </mesh>
      <mesh position={[w * 0.5 + inset, y, 0]} rotation={[0, -Math.PI / 2, 0]} material={mat}>
        <planeGeometry args={[fd, stripH]} />
      </mesh>
      <mesh position={[-(w * 0.5 + inset), y, 0]} rotation={[0, Math.PI / 2, 0]} material={mat}>
        <planeGeometry args={[fd, stripH]} />
      </mesh>
    </>
  )
}

// ── Floating "enter me first" star for featured hero projects ──
function makeStarGeo(): ExtrudeGeometry {
  const shape = new ThreeShape()
  const spikes = 5
  const outer = 1
  const inner = 0.46
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return new ExtrudeGeometry(shape, {
    depth: 0.32,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 2,
  })
}

function StarMarker({ y }: { y: number }) {
  const ref = useRef<Group>(null)
  const geo = useMemo(makeStarGeo, [])
  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ffcf4d',
        emissive: '#ffb300',
        emissiveIntensity: 1.7,
        metalness: 0.5,
        roughness: 0.28,
        toneMapped: false,
      }),
    [],
  )
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  useFrame((state) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    g.position.y = y + Math.sin(t * 1.6) * 0.5 // gentle bob
    g.scale.setScalar(1.55 * (1 + Math.sin(t * 2.2) * 0.06)) // soft pulse
  })

  return (
    <group ref={ref} position={[0, y, 0]}>
      {/* Billboard keeps the 5-point silhouette facing the camera from any angle */}
      <Billboard>
        <mesh geometry={geo} material={mat} />
      </Billboard>
    </group>
  )
}

interface Tier {
  size: [number, number, number]
  y: number
}

function massing(w: number, height: number, roofStyle: RoofStyle, shape: Shape): Tier[] {
  if (roofStyle === 'pitched') return [{ size: [w, height, w], y: height / 2 }]

  switch (shape) {
    case 'slab': {
      // Wide curtain-wall slab — rectangular (2:1) footprint reads as a modern glass plate.
      const wd = w * 1.65
      const dp = w * 0.56
      const h1 = height * 0.88
      const h2 = height * 0.12
      return [
        { size: [wd, h1, dp], y: h1 / 2 },
        { size: [wd * 0.82, h2, dp * 0.82], y: h1 + h2 / 2 },
      ]
    }
    case 'tapered': {
      // Art-Deco 4-step taper — narrows toward the sky, like a crystal needle.
      const hF = [0.38, 0.28, 0.20, 0.14]
      const wF = [1.00, 0.80, 0.63, 0.48]
      const tiers: Tier[] = []
      let y = 0
      hF.forEach((hf, i) => {
        const h = height * hf
        const sw = w * wF[i]
        tiers.push({ size: [sw, h, sw], y: y + h / 2 })
        y += h
      })
      return tiers
    }
    case 'setback': {
      // Classic 3-tier stepped setback — Chrysler-style silhouette.
      const h1 = height * 0.60
      const h2 = height * 0.26
      const h3 = height * 0.14
      return [
        { size: [w, h1, w], y: h1 / 2 },
        { size: [w * 0.72, h2, w * 0.72], y: h1 + h2 / 2 },
        { size: [w * 0.46, h3, w * 0.46], y: h1 + h2 + h3 / 2 },
      ]
    }
    default:
      return [{ size: [w, height, w], y: height / 2 }]
  }
}

interface BuildingProps {
  def: BuildingDef
  hovered: boolean
  appearance: Appearance
  showLabel: boolean
  view: ViewMode
  skylineX: number
  onHover: (id: string | null) => void
  onSelect: (project: Project, object: Object3D) => void
}

export function Building({ def, hovered, appearance, showLabel, view, skylineX, onHover, onSelect }: BuildingProps) {
  const { footprint: w, height, district, roofStyle, position, project } = def
  const outerRef  = useRef<Group>(null)
  const liftRef   = useRef<Group>(null)
  const labelRef  = useRef<Group>(null)
  const gl = useThree((s) => s.gl)

  const basePos    = useMemo(() => new Vector3(position[0], 0, position[2]), [position])
  const skylinePos = useMemo(() => new Vector3(skylineX, 0, 0), [skylineX])

  useLayoutEffect(() => {
    outerRef.current?.position.copy(basePos)
  }, [basePos])

  const shape = useMemo(() => pickShape(project.id, district, height), [project.id, district, height])
  const tiers = useMemo(() => massing(w, height, roofStyle, shape), [w, height, roofStyle, shape])

  // Base footprint dimensions (may be rectangular for slabs).
  const baseW = tiers[0].size[0]
  const baseD = tiers[0].size[2]
  const topTier = tiers[tiers.length - 1]
  const topW = topTier.size[0]
  const topD = topTier.size[2]

  // Push label high enough to clear any crown/spire detail.
  const crownH = shape === 'tapered' ? w * 0.40 : shape === 'setback' && height > 28 ? height * 0.20 : 0
  const roofH  = w * 0.5
  const signY  = roofStyle === 'pitched' ? height + roofH + 2.0 : height + crownH + 3.0

  // Category drives colour; the tallest enterprise towers go glass, everything
  // else is warm sunlit Amalfi stucco with a terracotta roof.
  const category = useMemo<BuildingCategory>(() => buildingCategory(project.tags), [project.tags])
  const glass = useMemo(() => isGlassTower(category, height), [category, height])
  const facadeHex = useMemo(
    () => (glass ? glassFacade(category, idHash(project.id)) : facadeColor(category, idHash(project.id))),
    [glass, category, project.id],
  )
  const roofHex = useMemo(
    () => (glass ? glassRoof(category, idHash(project.id)) : stuccoRoof(idHash(project.id))),
    [glass, category, project.id],
  )
  // Windows carry the category colour — the main way to tell districts apart
  // after dark, when the mirror-glass facades stop reflecting the sky.
  const winColor = glass ? glassWindow(category) : STUCCO_WINDOW

  // Glass: a physical curtain-wall material. A glossy clearcoat layer over a
  // pale, lightly-metallic tint gives a strong glassy sheen with bright,
  // sky-coloured reflections (and Fresnel rim) instead of a dark flat mirror.
  // Stucco branch kept for completeness though every building is glass now.
  const baseEmissive = glass ? 0.0 : 0.14
  const baseColor = useMemo(() => new Color(facadeHex), [facadeHex])
  const body = useMemo(
    () =>
      glass
        ? new MeshPhysicalMaterial({
            color: facadeHex,
            roughness: 0.04,
            metalness: 0.82,
            envMapIntensity: 1.6,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04,
            reflectivity: 0.95,
            // Facade self-glow after dark (intensity driven per-frame from
            // nightFactor) — mirror glass reflects nothing at night, so the
            // tower keeps its category tint by emitting it softly instead.
            emissive: facadeHex,
            emissiveIntensity: 0,
          })
        : new MeshStandardMaterial({
            color: facadeHex,
            roughness: 0.7,
            metalness: 0.0,
            emissive: facadeHex,
            emissiveIntensity: baseEmissive,
            envMapIntensity: 0.5,
          }),
    [facadeHex, glass, baseEmissive],
  )
  useEffect(() => () => body.dispose(), [body])

  const hoverGlow = useMemo(
    () =>
      new MeshStandardMaterial({
        color: '#ffb24d',
        emissive: '#ffb24d',
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0,
        roughness: 0.4,
        toneMapped: false,
      }),
    [],
  )
  useEffect(() => () => hoverGlow.dispose(), [hoverGlow])

  const windowFloors = useMemo(() => {
    const floors: number[] = []
    for (let y = 2.5; y < height - 1; y += 3.5) floors.push(y)
    return floors
  }, [height])

  const layerCol = useMemo(
    () =>
      appearance.mode === 'layer' && appearance.layer
        ? new Color(layerColor(project, appearance.layer))
        : null,
    [appearance.mode, appearance.layer, project],
  )
  const tagMatches = appearance.activeTag !== null && project.tags.includes(appearance.activeTag)

  useFrame((_, dt) => {
    if (outerRef.current) {
      easing.damp3(outerRef.current.position, view === 'skyline' ? skylinePos : basePos, 0.2, dt)
    }

    let target = baseColor
    // Night: the glass towers self-illuminate their category tint (subtle —
    // the skyline should read lamplit, not neon). Day: emissive stays 0 for
    // glass so the daytime mirror look is byte-identical to before.
    const nf = nightFactor()
    let em = glass
      ? nf * (hovered ? 0.62 : 0.4)
      : hovered ? baseEmissive + 0.5 : baseEmissive
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
    // World keeps full height in every view now, so labels need no counter-scale.
    if (labelRef.current) easing.damp(labelRef.current.scale, 'y', 1, 0.22, dt)
    easing.dampC(body.color, target, 0.18, dt)
    // Keep the glow the same hue as whatever the facade currently shows
    // (facade tint, layer colour, or the tag-dim grey).
    easing.dampC(body.emissive, target, 0.18, dt)
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
        {/* footing — polished granite plinth under glass towers, warm stone
            base under stucco buildings */}
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <boxGeometry args={[baseW * 1.06, 0.6, baseD * 1.06]} />
          <meshStandardMaterial
            color={glass ? '#1c2230' : '#cbbd9c'}
            roughness={glass ? 0.18 : 0.92}
            metalness={glass ? 0.7 : 0.0}
            envMapIntensity={glass ? 1.2 : 0.4}
          />
        </mesh>

        {/* massing tiers */}
        {tiers.map((t, i) => (
          <mesh key={i} position={[0, t.y, 0]} material={body} castShadow receiveShadow>
            <boxGeometry args={t.size} />
          </mesh>
        ))}

        {/* hover halo — slightly larger shell around the base tier */}
        <mesh position={[0, tiers[0].y, 0]} material={hoverGlow}>
          <boxGeometry args={[baseW * 1.05, tiers[0].size[1] * 1.01, baseD * 1.05]} />
        </mesh>

        {/* window bands — use actual base footprint dimensions */}
        {windowFloors.map((y, i) => (
          <WindowStrip key={i} w={baseW} d={baseD} y={y} color={winColor} />
        ))}

        {/* ── Roofline ── glass towers get a polished cap; stucco gets matte
            terracotta tile. */}
        {roofStyle === 'pitched' ? (
          <mesh position={[0, height + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[w * 0.74, roofH, 4]} />
            <meshStandardMaterial color={roofHex} roughness={glass ? 0.1 : 0.85} metalness={glass ? 0.85 : 0.0} envMapIntensity={glass ? 1.4 : 0.4} />
          </mesh>
        ) : shape === 'tapered' ? (
          <mesh position={[0, height, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[topW * 0.62, w * 0.40, 4]} />
            <meshStandardMaterial color={roofHex} roughness={glass ? 0.06 : 0.82} metalness={glass ? 0.95 : 0.0} envMapIntensity={glass ? 1.5 : 0.4} />
          </mesh>
        ) : (
          <>
            <mesh position={[0, height + 0.25, 0]} castShadow>
              <boxGeometry args={[topW * 1.06, 0.5, topD * 1.06]} />
              <meshStandardMaterial color={roofHex} roughness={glass ? 0.08 : 0.85} metalness={glass ? 0.92 : 0.0} envMapIntensity={glass ? 1.4 : 0.4} />
            </mesh>
            {height > 20 && shape !== 'slab' && (
              <mesh position={[topW * 0.18, height + 1.3, -topD * 0.12]} castShadow>
                <boxGeometry args={[topW * 0.4, 1.6, topW * 0.4]} />
                <meshStandardMaterial color={glass ? roofHex : '#e7dcc4'} roughness={glass ? 0.18 : 0.85} metalness={glass ? 0.7 : 0.0} envMapIntensity={glass ? 1.2 : 0.4} />
              </mesh>
            )}
          </>
        )}

        {shape === 'setback' && height > 28 && (
          <mesh position={[0, height + height * 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.16, height * 0.14, 6]} />
            <meshStandardMaterial color={roofHex} roughness={glass ? 0.05 : 0.85} metalness={glass ? 0.95 : 0.0} envMapIntensity={glass ? 1.5 : 0.4} />
          </mesh>
        )}

        {shape === 'slab' && district === 'glass' && height > 20 && (
          <>
            {([-1, 1] as const).map((side) => (
              <mesh key={side} position={[baseW * 0.5 * side, tiers[0].size[1] * 0.5, 0]} castShadow>
                <boxGeometry args={[0.28, tiers[0].size[1] * 0.98, baseD * 1.1]} />
                <meshStandardMaterial color={roofHex} roughness={glass ? 0.1 : 0.85} metalness={glass ? 0.88 : 0.0} envMapIntensity={glass ? 1.4 : 0.4} />
              </mesh>
            ))}
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

      {/* Floating star marks the featured hero projects — "enter these first".
          Shown in every view: 3D, the top-down 2D map, and the skyline lineup. */}
      {project.featured && <StarMarker y={signY + (showLabel ? 4.5 : 2.5)} />}
    </group>
  )
}

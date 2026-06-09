import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import { Color, ExtrudeGeometry, Group, MeshStandardMaterial, Shape as ThreeShape, Vector3, type Object3D } from 'three'
import { easing } from 'maath'
import { Label } from './Label'
import {
  buildingCategory,
  facadeColor,
  stuccoRoof,
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

// Italian-chic palette for the facade trim, glazing and ironwork.
const TRIM = '#f4eee2' // warm Amalfi white — architraves, sills, pilasters, cornice
const GLASS_DARK = '#33454c' // recessed window glass (reads dark by day)
const GLASS_GLOW = '#ffca94' // faint warm lamp behind the glass
const IRON = '#544c42' // wrought-iron balcony railing
const SHUTTER_TONES = ['#7a9b6e', '#6f93b0', '#b07a5a', '#8a6f9b', '#9b8a5a'] // painted timber shutters

// One floor of Amalfi detailing wrapped around the building: a row of shuttered
// windows recessed into the wall, white architrave moldings (lintel + sill), and
// — on balcony floors — a projecting juliet balcony with an iron railing.
function AmalfiFloor({
  w,
  d,
  y,
  balcony,
  shutterColor,
}: {
  w: number
  d: number
  y: number
  balcony: boolean
  shutterColor: string
}) {
  const glassMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: GLASS_DARK,
        emissive: GLASS_GLOW,
        emissiveIntensity: 0.16,
        roughness: 0.25,
        metalness: 0.1,
      }),
    [],
  )
  useEffect(() => () => glassMat.dispose(), [glassMat])

  const winH = 1.5
  const winW = 1.0
  // Windows per face from the available width, capped so wide slabs don't
  // sprout a hundred openings.
  const perFace = (len: number) => Math.max(1, Math.min(2, Math.round(len / 4.0)))
  const nw = perFace(w)
  const nd = perFace(d)

  // Build the evenly-spaced window centre offsets for a face of given length.
  const offsets = (len: number, n: number) =>
    Array.from({ length: n }, (_, i) => (i + 0.5) / n - 0.5).map((f) => f * len * 0.82)

  // A single shuttered window unit, placed on a face. `axis` = 'z' for front/back
  // faces (varying x), 'x' for side faces (varying z).
  const windowUnit = (key: string, px: number, pz: number, ry: number) => (
    <group key={key} position={[px, 0, pz]} rotation={[0, ry, 0]}>
      {/* white architrave frame — a slim proud border box */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[winW + 0.26, winH + 0.3, 0.1]} />
        <meshStandardMaterial color={TRIM} roughness={0.85} />
      </mesh>
      {/* glass sits in front of the frame box so the border reads as a frame */}
      <mesh position={[0, 0, 0.1]} material={glassMat}>
        <planeGeometry args={[winW, winH]} />
      </mesh>
      {/* painted timber shutters flanking the opening */}
      {([-1, 1] as const).map((s) => (
        <mesh key={s} position={[s * (winW * 0.5 + 0.16), 0, 0.11]}>
          <boxGeometry args={[winW * 0.46, winH * 0.96, 0.06]} />
          <meshStandardMaterial color={shutterColor} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )

  return (
    <group position={[0, y, 0]}>
      {/* front (+z) and back (−z) faces */}
      {offsets(w, nw).map((ox, i) => windowUnit(`f${i}`, ox, d * 0.5 + 0.02, 0))}
      {offsets(w, nw).map((ox, i) => windowUnit(`b${i}`, ox, -(d * 0.5 + 0.02), Math.PI))}
      {/* right (+x) and left (−x) faces */}
      {offsets(d, nd).map((oz, i) => windowUnit(`r${i}`, w * 0.5 + 0.02, oz, Math.PI / 2))}
      {offsets(d, nd).map((oz, i) => windowUnit(`l${i}`, -(w * 0.5 + 0.02), oz, -Math.PI / 2))}

      {/* white architrave string-courses wrapping all four sides */}
      <mesh position={[0, winH * 0.5 + 0.28, 0]}>
        <boxGeometry args={[w + 0.22, 0.2, d + 0.22]} />
        <meshStandardMaterial color={TRIM} roughness={0.85} />
      </mesh>
      <mesh position={[0, -winH * 0.5 - 0.22, 0]}>
        <boxGeometry args={[w + 0.18, 0.16, d + 0.18]} />
        <meshStandardMaterial color={TRIM} roughness={0.85} />
      </mesh>

      {/* projecting juliet balcony + iron railing on balcony floors */}
      {balcony && (
        <group position={[0, -winH * 0.5 - 0.34, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[w + 1.0, 0.14, d + 1.0]} />
            <meshStandardMaterial color={TRIM} roughness={0.9} />
          </mesh>
          {/* top + mid iron rails */}
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[w + 1.0, 0.06, d + 1.0]} />
            <meshStandardMaterial color={IRON} roughness={0.55} metalness={0.45} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <boxGeometry args={[w + 0.98, 0.045, d + 0.98]} />
            <meshStandardMaterial color={IRON} roughness={0.55} metalness={0.45} />
          </mesh>
        </group>
      )}
    </group>
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

  // Every building is a warm sunlit Amalfi stucco house with a terracotta roof
  // — one cohesive Italian-chic town, no corporate glass.
  const category = useMemo<BuildingCategory>(() => buildingCategory(project.tags), [project.tags])
  const facadeHex = useMemo(() => facadeColor(category, idHash(project.id)), [category, project.id])
  const roofHex = useMemo(() => stuccoRoof(idHash(project.id)), [project.id])
  const shutterColor = useMemo(
    () => SHUTTER_TONES[idHash(project.id) % SHUTTER_TONES.length],
    [project.id],
  )

  // Matte lime-washed plaster with a faint warm self-glow so the pastel colours
  // stay sunlit and vivid without glaring.
  const baseEmissive = 0.1
  const baseColor = useMemo(() => new Color(facadeHex), [facadeHex])
  const body = useMemo(
    () =>
      new MeshStandardMaterial({
        color: facadeHex,
        roughness: 0.78,
        metalness: 0.0,
        emissive: facadeHex,
        emissiveIntensity: baseEmissive,
        envMapIntensity: 0.45,
      }),
    [facadeHex],
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
    // World keeps full height in every view now, so labels need no counter-scale.
    if (labelRef.current) easing.damp(labelRef.current.scale, 'y', 1, 0.22, dt)
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
        {/* footing — warm stone base */}
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <boxGeometry args={[baseW * 1.06, 0.6, baseD * 1.06]} />
          <meshStandardMaterial color="#cbbd9c" roughness={0.92} metalness={0.0} envMapIntensity={0.4} />
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

        {/* corner pilasters — slim white quoins articulating the verticals */}
        {([-1, 1] as const).flatMap((sx) =>
          ([-1, 1] as const).map((sz) => (
            <mesh key={`${sx}${sz}`} position={[sx * (baseW * 0.5 + 0.04), height * 0.5, sz * (baseD * 0.5 + 0.04)]} castShadow>
              <boxGeometry args={[0.32, height, 0.32]} />
              <meshStandardMaterial color={TRIM} roughness={0.85} />
            </mesh>
          )),
        )}

        {/* shuttered windows + architraves + balconies, floor by floor */}
        {windowFloors.map((y, i) => (
          <AmalfiFloor key={i} w={baseW} d={baseD} y={y} balcony={i % 2 === 0} shutterColor={shutterColor} />
        ))}

        {/* white cornice crowning the facade just under the roof */}
        <mesh position={[0, height - 0.2, 0]}>
          <boxGeometry args={[topW + 0.5, 0.4, topD + 0.5]} />
          <meshStandardMaterial color={TRIM} roughness={0.85} />
        </mesh>

        {/* ── Roofline ── matte terracotta tile */}
        {roofStyle === 'pitched' ? (
          <mesh position={[0, height + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[w * 0.74, roofH, 4]} />
            <meshStandardMaterial color={roofHex} roughness={0.85} metalness={0.0} envMapIntensity={0.4} />
          </mesh>
        ) : shape === 'tapered' ? (
          <mesh position={[0, height, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[topW * 0.62, w * 0.40, 4]} />
            <meshStandardMaterial color={roofHex} roughness={0.82} metalness={0.0} envMapIntensity={0.4} />
          </mesh>
        ) : (
          <>
            <mesh position={[0, height + 0.25, 0]} castShadow>
              <boxGeometry args={[topW * 1.06, 0.5, topD * 1.06]} />
              <meshStandardMaterial color={roofHex} roughness={0.85} metalness={0.0} envMapIntensity={0.4} />
            </mesh>
            {height > 20 && shape !== 'slab' && (
              <mesh position={[topW * 0.18, height + 1.3, -topD * 0.12]} castShadow>
                <boxGeometry args={[topW * 0.4, 1.6, topW * 0.4]} />
                <meshStandardMaterial color="#e7dcc4" roughness={0.85} metalness={0.0} envMapIntensity={0.4} />
              </mesh>
            )}
          </>
        )}

        {shape === 'setback' && height > 28 && (
          <mesh position={[0, height + height * 0.07, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.16, height * 0.14, 6]} />
            <meshStandardMaterial color={roofHex} roughness={0.85} metalness={0.0} envMapIntensity={0.4} />
          </mesh>
        )}

        {shape === 'slab' && district === 'glass' && height > 20 && (
          <>
            {([-1, 1] as const).map((side) => (
              <mesh key={side} position={[baseW * 0.5 * side, tiers[0].size[1] * 0.5, 0]} castShadow>
                <boxGeometry args={[0.28, tiers[0].size[1] * 0.98, baseD * 1.1]} />
                <meshStandardMaterial color="#e7dcc4" roughness={0.85} metalness={0.0} envMapIntensity={0.4} />
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
          3D view only; the iso flatten would squash it. */}
      {project.featured && view === '3d' && <StarMarker y={signY + (showLabel ? 4.5 : 2.5)} />}
    </group>
  )
}

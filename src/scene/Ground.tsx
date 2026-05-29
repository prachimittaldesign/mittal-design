import { useEffect, useRef } from 'react'
import { Color, InstancedMesh, Object3D } from 'three'
import { GROUND, PLAZA, ROAD } from './lib/cityTheme'
import { CITY_RADIUS } from './lib/cityModel'
import { LOT } from './lib/project3d'
import { POND_CENTER, POND_CLEAR } from './Pond'

// ─── Grass ───────────────────────────────────────────────────────────────────
// Short, soft, low-saturation tufts laid densely so the field reads as turf
// texture — not spiky toy blades. Greens are muted sage/olive for a calm,
// cohesive (Bruno-Simon-like) palette. Tufts reach out to the fog distance so
// the field's edge dissolves into the horizon rather than ending in a hard ring.
const TUFT_GREENS = ['#5c6b45', '#697a50', '#52613c', '#5f7048', '#737f5a']
const TUFT_COUNT  = 6000
const PLAZA_CLEAR = 30   // matches new TERRACE_R so grass doesn't grow on the plaza
const FIELD_R     = Math.min(CITY_RADIUS * 1.7, 180)   // capped so grass doesn't waste instances far in fog

function GrassTufts() {
  const ref = useRef<InstancedMesh>(null)

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    let placed = 0

    for (let attempt = 0; placed < TUFT_COUNT && attempt < TUFT_COUNT * 6; attempt++) {
      // sqrt() distribution → even density across the disc (no centre clumping)
      const angle = Math.random() * Math.PI * 2
      const r     = PLAZA_CLEAR + Math.sqrt(Math.random()) * FIELD_R
      const x     = Math.cos(angle) * r
      const z     = Math.sin(angle) * r
      if (x * x + z * z < PLAZA_CLEAR * PLAZA_CLEAR) continue
      const pdx = x - POND_CENTER[0]
      const pdz = z - POND_CENTER[1]
      if (pdx * pdx + pdz * pdz < POND_CLEAR * POND_CLEAR) continue

      // Short and soft — gentle bumps of turf, not tall spikes.
      const h = 0.28 + Math.random() * 0.55
      dummy.position.set(x, h * 0.5, z)
      dummy.rotation.set(
        (Math.random() - 0.5) * 0.18,
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.18,
      )
      dummy.scale.set(0.6 + Math.random() * 0.5, h, 0.6 + Math.random() * 0.5)
      dummy.updateMatrix()
      mesh.setMatrixAt(placed, dummy.matrix)
      color.set(TUFT_GREENS[Math.floor(Math.random() * TUFT_GREENS.length)])
      mesh.setColorAt(placed, color)
      placed++
    }

    mesh.count = placed
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, TUFT_COUNT]} receiveShadow>
      <coneGeometry args={[0.7, 1, 6]} />
      <meshStandardMaterial roughness={0.95} metalness={0} flatShading />
    </instancedMesh>
  )
}

// ─── Wildflowers ─────────────────────────────────────────────────────────────
// A restrained scatter — just two soft tones (warm cream + pale gold), tiny and
// matte. Enough to suggest life without the rainbow-confetti look.
const FLOWER_COLORS = ['#e9e2cf', '#dcd0a6']
const FLOWER_COUNT  = 130

function Wildflowers() {
  const ref = useRef<InstancedMesh>(null)

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    const dummy = new Object3D()
    const color = new Color()
    let placed = 0

    for (let attempt = 0; placed < FLOWER_COUNT && attempt < FLOWER_COUNT * 8; attempt++) {
      const angle = Math.random() * Math.PI * 2
      const r     = PLAZA_CLEAR + Math.sqrt(Math.random()) * CITY_RADIUS * 1.1
      const x     = Math.cos(angle) * r
      const z     = Math.sin(angle) * r
      if (x * x + z * z < PLAZA_CLEAR * PLAZA_CLEAR) continue
      const pdx = x - POND_CENTER[0]
      const pdz = z - POND_CENTER[1]
      if (pdx * pdx + pdz * pdz < POND_CLEAR * POND_CLEAR) continue

      dummy.position.set(x, 0.5, z)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, 0)
      dummy.scale.setScalar(0.12 + Math.random() * 0.12)
      dummy.updateMatrix()
      mesh.setMatrixAt(placed, dummy.matrix)
      color.set(FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)])
      mesh.setColorAt(placed, color)
      placed++
    }

    mesh.count = placed
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, FLOWER_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial roughness={0.7} metalness={0} />
    </instancedMesh>
  )
}

// ─── Plaza paving — Barcelona-style decorated terrace ─────────────────────────
// A grand circular terrace with warm sandstone paving, radiating cross strips,
// diagonal boulevard strips, fountain basins, and concentric ring bands — like
// Plaça de Catalunya. renderOrder 1-2 keeps it above grass but below roads (3-4).
const TERRACE_R = 27
const STRIP_W = 4.2

function PlazaDetail() {
  const fountainAngles = [22.5, 112.5, 202.5, 292.5].map((d) => (d * Math.PI) / 180)

  return (
    <group>
      {/* Outer sandstone terrace — octagonal (8 sides), warm buff stone */}
      <mesh rotation={[-Math.PI / 2, Math.PI / 8, 0]} position={[0, 0.03, 0]} renderOrder={1}>
        <circleGeometry args={[TERRACE_R, 8]} />
        <meshStandardMaterial color="#cfc2a0" roughness={0.95} depthWrite={false} />
      </mesh>

      {/* Inner terrace — lighter tone, creates depth and framing */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.031, 0]} renderOrder={1}>
        <circleGeometry args={[TERRACE_R * 0.61, 64]} />
        <meshStandardMaterial color="#ddd2b2" roughness={0.95} depthWrite={false} />
      </mesh>

      {/* Outer decorative band — octagonal border detail */}
      <mesh rotation={[-Math.PI / 2, Math.PI / 8, 0]} position={[0, 0.032, 0]} renderOrder={2}>
        <ringGeometry args={[TERRACE_R - 2.0, TERRACE_R, 8]} />
        <meshStandardMaterial color="#b8a878" roughness={0.95} depthWrite={false} />
      </mesh>

      {/* Mid ring band — transition between inner and outer zones */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]} renderOrder={2}>
        <ringGeometry args={[14.5, 16.8, 64]} />
        <meshStandardMaterial color="#c4b890" roughness={0.95} depthWrite={false} />
      </mesh>

      {/* Cardinal paving strips — N/S and E/W cross paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.033, 0]} renderOrder={2}>
        <planeGeometry args={[STRIP_W, TERRACE_R * 2]} />
        <meshStandardMaterial color="#c8bb98" roughness={0.95} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.033, 0]} renderOrder={2}>
        <planeGeometry args={[TERRACE_R * 2, STRIP_W]} />
        <meshStandardMaterial color="#c8bb98" roughness={0.95} depthWrite={false} />
      </mesh>

      {/* Diagonal paving strips — 45° crossings, slightly narrower */}
      {[Math.PI / 4, -Math.PI / 4].map((angle, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, angle, 0]} position={[0, 0.034, 0]} renderOrder={2}>
          <planeGeometry args={[STRIP_W * 0.72, TERRACE_R * 2]} />
          <meshStandardMaterial color="#c0b490" roughness={0.95} depthWrite={false} />
        </mesh>
      ))}

      {/* Fountain basins — 4 shallow basins sitting between road spokes */}
      {fountainAngles.map((angle, i) => (
        <group key={i}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[Math.cos(angle) * 20, 0.034, Math.sin(angle) * 20]}
            renderOrder={2}
          >
            <circleGeometry args={[2.6, 32]} />
            <meshStandardMaterial color="#7fa0b0" roughness={0.7} depthWrite={false} />
          </mesh>
          {/* Stone lip ring around each basin */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[Math.cos(angle) * 13, 0.035, Math.sin(angle) * 13]}
            renderOrder={2}
          >
            <ringGeometry args={[2.5, 2.85, 32]} />
            <meshStandardMaterial color="#a8987a" roughness={0.9} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── Stone footpath to the pond ───────────────────────────────────────────────
// A winding garden path connecting the SW diagonal avenue to the pond,
// so the water feels reachable rather than floating in empty meadow.
function PondPath() {
  const segs = [
    { ax: -64, az: -64, bx: -72, bz: -65 },
  ]
  return (
    <group>
      {segs.map((s, i) => {
        const dx = s.bx - s.ax
        const dz = s.bz - s.az
        const len = Math.hypot(dx, dz)
        const angle = Math.atan2(-dz, dx)
        return (
          <mesh key={i} position={[(s.ax + s.bx) / 2, 0.03, (s.az + s.bz) / 2]} rotation={[0, angle, 0]} renderOrder={3}>
            <boxGeometry args={[len + 2.0, 0.04, 2.4]} />
            <meshStandardMaterial color="#b8ad8c" roughness={0.95} depthWrite={false} />
          </mesh>
        )
      })}
      {/* Circular stone landing at the pond's edge — a viewpoint terrace */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-76, 0.04, -65]} renderOrder={3}>
        <circleGeometry args={[4.5, 24]} />
        <meshStandardMaterial color="#a8a088" roughness={0.92} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── Ground ──────────────────────────────────────────────────────────────────
export function Ground() {
  return (
    <group>
      {/* Soft matte meadow base — one seamless circle so no square corners or
          colour seams are ever visible; radius exceeds the far fog distance in
          every direction, so the field simply dissolves into the horizon. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[CITY_RADIUS * 5, 96]} />
        <meshStandardMaterial color={GROUND} roughness={1} metalness={0.0} />
      </mesh>

      {/* Barcelona-style plaza paving */}
      <PlazaDetail />

      {/* Stone footpath to pond */}
      <PondPath />

      {/* Dense, short, muted grass — reads as soft turf, fades into the fog */}
      <GrassTufts />

      {/* A restrained two-tone wildflower scatter */}
      <Wildflowers />

      {/* Central plaza — calm moss circle, clear of grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[LOT * 1.1, 96]} />
        <meshStandardMaterial color={PLAZA} roughness={0.95} />
      </mesh>

      {/* Roundabout carriageway — a smooth ring of tarmac circling the island.
          meshStandardMaterial (lit, like every other road) so it shares the
          night palette instead of glowing harsh white. depthWrite:false +
          renderOrder keeps it in the road paint stack, so it never z-fights the
          avenues feeding the circle. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} renderOrder={4} receiveShadow>
        <ringGeometry args={[LOT * 0.5, LOT * 0.78, 96]} />
        <meshStandardMaterial color={ROAD} roughness={1} depthWrite={false} />
      </mesh>

      {/* Garden island inside the ring — a low planted disc the monument rises
          from, so it reads as a deliberate roundabout, not tarmac with a spike. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <circleGeometry args={[LOT * 0.5, 64]} />
        <meshStandardMaterial color="#586b42" roughness={0.95} />
      </mesh>
      {/* Stone kerb collar around the island base */}
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <cylinderGeometry args={[LOT * 0.5, LOT * 0.52, 0.34, 64]} />
        <meshStandardMaterial color="#b9ad93" roughness={0.9} />
      </mesh>

      {/* ── Central obelisk — slender octagonal column so it reads clean from
            every angle (the old 4-sided cone looked like a spinning propeller
            when viewed straight down). ── */}
      {/* Stepped stone base */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 2.6, 1.4, 8]} />
        <meshStandardMaterial color="#8a7050" roughness={0.85} metalness={0.05} />
      </mesh>
      {/* Plinth */}
      <mesh position={[0, 1.85, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
        <cylinderGeometry args={[1.35, 1.55, 1.1, 8]} />
        <meshStandardMaterial color="#7a6040" roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Tapered shaft — slim octagon, no propeller silhouette from above */}
      <mesh position={[0, 6.4, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.9, 8.0, 8]} />
        <meshStandardMaterial color="#c8a870" roughness={0.55} metalness={0.18} />
      </mesh>
      {/* Pyramidion cap */}
      <mesh position={[0, 10.9, 0]} rotation={[0, Math.PI / 8, 0]} castShadow>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#d8bf8a" roughness={0.45} metalness={0.25} />
      </mesh>
      {/* Glowing golden tip — soft beacon at the apex */}
      <mesh position={[0, 11.8, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#ffcc44"
          emissive="#ffaa00"
          emissiveIntensity={2.0}
          roughness={0.2}
          metalness={0.7}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

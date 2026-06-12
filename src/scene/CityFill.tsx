import { Instances, Instance } from '@react-three/drei'
import { SCENERY } from './lib/cityModel'
import {
  SCENERY_AMALFI,
  SCENERY_ROOFS,
  SCENERY_TRIM,
  SCENERY_GLASS,
  SCENERY_IRON,
} from './lib/cityTheme'

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

// Backdrop town: warm Amalfi filler houses that fill the empty parcels around
// the labelled project towers. Each house is built from a handful of instanced
// layers (one draw call each) so the town can be dense without a perf hit:
// pastel stucco body, terracotta pyramid roof, white cornice + balcony ledge,
// an iron balcony rail, and a dark window band — the Italian-chic vocabulary
// the project buildings use, kept lightweight for the scenery.
export function CityFill() {
  const n = Math.max(SCENERY.length, 1)
  const roofH = (s: { w: number; d: number }) => Math.min(s.w, s.d) * 0.55

  return (
    <group>
      {/* frustumCulled=false on every group here: drei's auto bounding
          sphere is computed on the first frame before instance transforms
          are registered, caching an empty sphere at the origin. That sphere
          only intersects the frustum while the camera looks at the origin,
          so this backdrop town would vanish the moment you pan/zoom toward
          the edge of the urban core. */}
      {/* Pastel stucco bodies */}
      <Instances limit={n} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.88} />
        {SCENERY.map((s) => (
          <Instance
            key={s.id}
            position={[s.position[0], s.h / 2, s.position[2]]}
            scale={[s.w, s.h, s.d]}
            rotation={[0, s.rotationY, 0]}
            color={SCENERY_AMALFI[hash(s.id) % SCENERY_AMALFI.length]}
          />
        ))}
      </Instances>

      {/* Terracotta pyramid roofs */}
      <Instances limit={n} castShadow frustumCulled={false}>
        <coneGeometry args={[0.72, 1, 4]} />
        <meshStandardMaterial roughness={0.85} />
        {SCENERY.map((s) => (
          <Instance
            key={s.id}
            position={[s.position[0], s.h + roofH(s) / 2, s.position[2]]}
            scale={[s.w, roofH(s), s.d]}
            rotation={[0, s.rotationY + Math.PI / 4, 0]}
            color={SCENERY_ROOFS[hash(s.id) % SCENERY_ROOFS.length]}
          />
        ))}
      </Instances>

      {/* White cornice crowning the wall under the roof */}
      <Instances limit={n} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={SCENERY_TRIM} roughness={0.85} />
        {SCENERY.map((s) => (
          <Instance
            key={s.id}
            position={[s.position[0], s.h - 0.12, s.position[2]]}
            scale={[s.w + 0.28, 0.26, s.d + 0.28]}
            rotation={[0, s.rotationY, 0]}
          />
        ))}
      </Instances>

      {/* Dark window band (architrave-framed glazing read at a distance) */}
      <Instances limit={n} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={SCENERY_GLASS}
          roughness={0.3}
          metalness={0.1}
          emissive={'#ffcaa0'}
          emissiveIntensity={0.12}
        />
        {SCENERY.map((s) => (
          <Instance
            key={s.id}
            position={[s.position[0], s.h * 0.62, s.position[2]]}
            scale={[s.w + 0.05, Math.min(0.7, s.h * 0.22), s.d + 0.05]}
            rotation={[0, s.rotationY, 0]}
          />
        ))}
      </Instances>

      {/* White juliet balcony ledge */}
      <Instances limit={n} castShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={SCENERY_TRIM} roughness={0.9} />
        {SCENERY.map((s) => (
          <Instance
            key={s.id}
            position={[s.position[0], s.h * 0.45, s.position[2]]}
            scale={[s.w + 0.55, 0.12, s.d + 0.55]}
            rotation={[0, s.rotationY, 0]}
          />
        ))}
      </Instances>

      {/* Iron balcony rail above the ledge */}
      <Instances limit={n} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={SCENERY_IRON} roughness={0.6} metalness={0.4} />
        {SCENERY.map((s) => (
          <Instance
            key={s.id}
            position={[s.position[0], s.h * 0.45 + 0.34, s.position[2]]}
            scale={[s.w + 0.55, 0.06, s.d + 0.55]}
            rotation={[0, s.rotationY, 0]}
          />
        ))}
      </Instances>
    </group>
  )
}

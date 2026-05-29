import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { InstancedMesh, MeshStandardMaterial, Object3D } from 'three'
import { ROAD } from './lib/cityTheme'
import { ROAD_SEGS, GATEWAY_SEGS } from './lib/cityModel'

const ALL_SEGS = [...ROAD_SEGS, ...GATEWAY_SEGS]
const PATH_W = 1.3 // sidewalk width revealed on each side of the road
const PAVE = '#cbc2af' // warm sidewalk paving

// Unique vertices across the network — used to drop "junction pads" that fill
// the wedge gaps where two angled segments meet, so the network reads as one
// continuous, deliberately-planned surface instead of disjoint sticks.
interface Junction {
  x: number
  z: number
  w: number
}

export function Roads() {
  const roadMat = useMemo(() => new MeshStandardMaterial({ color: ROAD, roughness: 1 }), [])
  const paveMat = useMemo(() => new MeshStandardMaterial({ color: PAVE, roughness: 0.98 }), [])
  // Separate pad materials with polygonOffset so junction circles always win
  // the depth test over the segment surfaces they sit flush on top of.
  const roadPadMat = useMemo(
    () => new MeshStandardMaterial({ color: ROAD, roughness: 1, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 }),
    [],
  )
  const pavePadMat = useMemo(
    () => new MeshStandardMaterial({ color: PAVE, roughness: 0.98, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 }),
    [],
  )
  useEffect(
    () => () => {
      roadMat.dispose()
      paveMat.dispose()
      roadPadMat.dispose()
      pavePadMat.dispose()
    },
    [roadMat, paveMat, roadPadMat, pavePadMat],
  )

  // Collect junctions (segment endpoints), keeping the widest road at each.
  const junctions = useMemo(() => {
    const map = new Map<string, Junction>()
    for (const s of ALL_SEGS) {
      for (const [x, z] of [
        [s.ax, s.az],
        [s.bx, s.bz],
      ]) {
        const key = `${x.toFixed(1)},${z.toFixed(1)}`
        const prev = map.get(key)
        if (!prev || s.width > prev.w) map.set(key, { x, z, w: s.width })
      }
    }
    return [...map.values()]
  }, [])

  // Instanced junction pads — one draw call each for pave + road corner fills.
  const roadPadRef = useRef<InstancedMesh>(null)
  const pavePadRef = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const rp = roadPadRef.current
    const pp = pavePadRef.current
    if (!rp || !pp) return
    const dummy = new Object3D()
    junctions.forEach((j, i) => {
      // Place each circle flush on the surface it covers so it masks z-fighting
      // where crossing segment boxes share the same top-face depth.
      // Road box: center y=0.05, height=0.06 → top face at y=0.08
      // Pave box: center y=0.02, height=0.04 → top face at y=0.04
      dummy.rotation.set(-Math.PI / 2, 0, 0)
      dummy.position.set(j.x, 0.081, j.z)
      dummy.scale.set(j.w / 2, j.w / 2, 1)
      dummy.updateMatrix()
      rp.setMatrixAt(i, dummy.matrix)
      dummy.position.set(j.x, 0.041, j.z)
      const pr = (j.w + PATH_W * 2) / 2
      dummy.scale.set(pr, pr, 1)
      dummy.updateMatrix()
      pp.setMatrixAt(i, dummy.matrix)
    })
    rp.count = junctions.length
    pp.count = junctions.length
    rp.instanceMatrix.needsUpdate = true
    pp.instanceMatrix.needsUpdate = true
  }, [junctions])

  return (
    <group>
      {/* ── Sidewalk layer ── a wider pale slab under every segment; it spills
          PATH_W beyond the kerb on both sides and past each end, so the borders
          stay continuous around curves and through junctions. */}
      {ALL_SEGS.map((s, i) => {
        const dx = s.bx - s.ax
        const dz = s.bz - s.az
        const len = Math.hypot(dx, dz)
        const angle = Math.atan2(-dz, dx)
        return (
          <mesh
            key={`pave-${i}`}
            material={paveMat}
            position={[(s.ax + s.bx) / 2, 0.02, (s.az + s.bz) / 2]}
            rotation={[0, angle, 0]}
            receiveShadow
          >
            <boxGeometry args={[len + s.width + PATH_W * 2, 0.04, s.width + PATH_W * 2]} />
          </mesh>
        )
      })}

      {/* Sidewalk junction pads (pale) — fill the kerb corners at bends. */}
      <instancedMesh ref={pavePadRef} args={[undefined, undefined, junctions.length]} material={pavePadMat} receiveShadow>
        <circleGeometry args={[1, 20]} />
      </instancedMesh>

      {/* ── Road layer ── dark carriageway on top of the sidewalk slab. */}
      {ALL_SEGS.map((s, i) => {
        const dx = s.bx - s.ax
        const dz = s.bz - s.az
        const len = Math.hypot(dx, dz)
        const angle = Math.atan2(-dz, dx)
        return (
          <mesh
            key={`road-${i}`}
            material={roadMat}
            position={[(s.ax + s.bx) / 2, 0.05, (s.az + s.bz) / 2]}
            rotation={[0, angle, 0]}
            receiveShadow
          >
            <boxGeometry args={[len + s.width, 0.06, s.width]} />
          </mesh>
        )
      })}

      {/* Road junction pads (dark) — fill the carriageway corners so the tarmac
          flows continuously through every turn and crossing. */}
      <instancedMesh ref={roadPadRef} args={[undefined, undefined, junctions.length]} material={roadPadMat} receiveShadow>
        <circleGeometry args={[1, 20]} />
      </instancedMesh>
    </group>
  )
}

/**
 * Outskirts — renders the planned countryside defined in lib/outskirts:
 * the coastal ring road, boulevard extensions, hamlets (houses + piazzas +
 * stone lanes), orchard groves, and the free belt trees. All static, all
 * instanced where it counts.
 */

import { useEffect, useMemo } from 'react'
import { Instances, Instance } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'
import { ROAD, SCENERY_AMALFI, SCENERY_ROOFS, FOLIAGE, TRUNK } from './lib/cityTheme'
import {
  COAST_ROAD_R,
  COAST_ROAD_W,
  DIAG_EXT_SEGS,
  HAMLET_LANES,
  OUTSKIRT_HOUSES,
  OUTSKIRT_TREES,
  PIAZZAS,
} from './lib/outskirts'
import type { RoadSeg } from './lib/cityModel'

const PATH_W = 1.6
const PAVE = '#cbc2af'
const LANE_STONE = '#b8ad8c' // country lanes are laid stone, not urban tarmac
const ORDER_PAVE = 3
const ORDER_ROAD = 4

function SegMeshes({ segs, mat, y, order, padW }: {
  segs: RoadSeg[]
  mat: MeshStandardMaterial
  y: number
  order: number
  padW: number
}) {
  return (
    <>
      {segs.map((s, i) => {
        const dx = s.bx - s.ax
        const dz = s.bz - s.az
        const len = Math.hypot(dx, dz)
        const angle = Math.atan2(-dz, dx)
        return (
          <mesh
            key={i}
            material={mat}
            position={[(s.ax + s.bx) / 2, y, (s.az + s.bz) / 2]}
            rotation={[0, angle, 0]}
            renderOrder={order}
            receiveShadow
          >
            <boxGeometry args={[len + s.width + padW, 0.04, s.width + padW]} />
          </mesh>
        )
      })}
    </>
  )
}

export function Outskirts() {
  const roadMat = useMemo(() => new MeshStandardMaterial({ color: ROAD, roughness: 1, depthWrite: false }), [])
  const paveMat = useMemo(() => new MeshStandardMaterial({ color: PAVE, roughness: 0.98, depthWrite: false }), [])
  const laneMat = useMemo(() => new MeshStandardMaterial({ color: LANE_STONE, roughness: 0.95, depthWrite: false }), [])
  useEffect(
    () => () => {
      roadMat.dispose()
      paveMat.dispose()
      laneMat.dispose()
    },
    [roadMat, paveMat, laneMat],
  )

  const half = COAST_ROAD_W / 2

  return (
    <group>
      {/* ── Coast road — the corniche ring just inside the shore ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} renderOrder={ORDER_PAVE - 1}>
        <ringGeometry args={[COAST_ROAD_R - half - PATH_W, COAST_ROAD_R + half + PATH_W, 160]} />
        <primitive object={paveMat} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} renderOrder={ORDER_ROAD - 1}>
        <ringGeometry args={[COAST_ROAD_R - half, COAST_ROAD_R + half, 160]} />
        <primitive object={roadMat} attach="material" />
      </mesh>

      {/* Boulevard extensions out to the coast road (tarmac, urban continuation) */}
      <SegMeshes segs={DIAG_EXT_SEGS} mat={paveMat} y={0.02} order={ORDER_PAVE} padW={PATH_W * 2} />
      <SegMeshes segs={DIAG_EXT_SEGS} mat={roadMat} y={0.05} order={ORDER_ROAD} padW={0} />

      {/* Hamlet lanes — stone country lanes, visually quieter than tarmac */}
      <SegMeshes segs={HAMLET_LANES} mat={laneMat} y={0.03} order={ORDER_PAVE} padW={0} />

      {/* Piazzas — a paved stone circle at each hamlet's heart */}
      {PIAZZAS.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[p.x, 0.04, p.z]} renderOrder={ORDER_ROAD}>
          <circleGeometry args={[p.r, 28]} />
          <meshStandardMaterial color="#d2c5a4" roughness={0.95} depthWrite={false} />
        </mesh>
      ))}

      {/* ── Hamlet houses — pastel stucco, terracotta pyramid roofs ── */}
      <Instances limit={Math.max(OUTSKIRT_HOUSES.length, 1)} castShadow>
        <boxGeometry args={[3.4, 2.6, 3]} />
        <meshStandardMaterial roughness={0.95} />
        {OUTSKIRT_HOUSES.map((h) => (
          <Instance
            key={h.id}
            position={[h.position[0], 1.3 * h.scale, h.position[2]]}
            scale={h.scale}
            rotation={[0, h.rotationY, 0]}
            color={SCENERY_AMALFI[h.hash % SCENERY_AMALFI.length]}
          />
        ))}
      </Instances>
      <Instances limit={Math.max(OUTSKIRT_HOUSES.length, 1)} castShadow>
        <coneGeometry args={[2.6, 1.7, 4]} />
        <meshStandardMaterial roughness={0.95} />
        {OUTSKIRT_HOUSES.map((h) => (
          <Instance
            key={h.id}
            position={[h.position[0], 3.45 * h.scale, h.position[2]]}
            scale={h.scale}
            rotation={[0, h.rotationY + Math.PI / 4, 0]}
            color={SCENERY_ROOFS[h.hash % SCENERY_ROOFS.length]}
          />
        ))}
      </Instances>

      {/* ── Countryside trees: hamlet greens, orchard rows, belt scatter ── */}
      <Instances limit={Math.max(OUTSKIRT_TREES.length, 1)} castShadow>
        <sphereGeometry args={[1.6, 8, 7]} />
        <meshStandardMaterial roughness={0.95} />
        {OUTSKIRT_TREES.map((t, i) => (
          <Instance
            key={t.id}
            position={[t.position[0], 3.2 * t.scale, t.position[2]]}
            scale={t.scale}
            color={FOLIAGE[i % FOLIAGE.length]}
          />
        ))}
      </Instances>
      <Instances limit={Math.max(OUTSKIRT_TREES.length, 1)}>
        <cylinderGeometry args={[0.18, 0.24, 3.2, 6]} />
        <meshStandardMaterial color={TRUNK} roughness={1} />
        {OUTSKIRT_TREES.map((t) => (
          <Instance key={t.id} position={[t.position[0], 1.6 * t.scale, t.position[2]]} scale={t.scale} />
        ))}
      </Instances>
    </group>
  )
}

import { useEffect, useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { ROAD } from './lib/cityTheme'
import { ROAD_SEGS, GATEWAY_SEGS } from './lib/cityModel'

const ALL_SEGS = [...ROAD_SEGS, ...GATEWAY_SEGS]
const PATH_W = 1.4   // footpath width (each side of road)
const PATH_Y = 0.045 // slightly above road surface

export function Roads() {
  const roadMat = useMemo(
    () => new MeshStandardMaterial({ color: ROAD, roughness: 1 }),
    [],
  )
  const pathMat = useMemo(
    () => new MeshStandardMaterial({ color: '#cbc2af', roughness: 0.98 }),
    [],
  )
  useEffect(() => () => { roadMat.dispose(); pathMat.dispose() }, [roadMat, pathMat])

  return (
    <group>
      {ALL_SEGS.map((s, i) => {
        const dx = s.bx - s.ax
        const dz = s.bz - s.az
        const len = Math.hypot(dx, dz)
        const angle = Math.atan2(-dz, dx)
        const cx = (s.ax + s.bx) / 2
        const cz = (s.az + s.bz) / 2
        // Perpendicular offset for the footpaths
        const nx = (-dz / len) * (s.width * 0.5 + PATH_W * 0.5)
        const nz = ( dx / len) * (s.width * 0.5 + PATH_W * 0.5)
        return (
          <group key={i}>
            {/* Road surface */}
            <mesh material={roadMat} position={[cx, 0.03, cz]} rotation={[0, angle, 0]} receiveShadow>
              <boxGeometry args={[len + s.width, 0.06, s.width]} />
            </mesh>
            {/* Footpath – left side */}
            <mesh material={pathMat} position={[cx + nx, PATH_Y, cz + nz]} rotation={[0, angle, 0]} receiveShadow>
              <boxGeometry args={[len + PATH_W, 0.04, PATH_W]} />
            </mesh>
            {/* Footpath – right side */}
            <mesh material={pathMat} position={[cx - nx, PATH_Y, cz - nz]} rotation={[0, angle, 0]} receiveShadow>
              <boxGeometry args={[len + PATH_W, 0.04, PATH_W]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

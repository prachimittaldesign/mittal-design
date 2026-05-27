import { Instances, Instance } from '@react-three/drei'
import { SCENERY } from './lib/cityModel'
import { SCENERY_BODY } from './lib/cityTheme'

// Dense grey nondescript buildings of varied height that fill the city's empty
// parcels. Non-interactive, unlabelled — pure backdrop so the labelled project
// towers and civic landmarks stay the focus.
export function CityFill() {
  return (
    <Instances limit={Math.max(SCENERY.length, 1)} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.95} />
      {SCENERY.map((s) => (
        <Instance
          key={s.id}
          position={[s.position[0], s.h / 2, s.position[2]]}
          scale={[s.w, s.h, s.d]}
          rotation={[0, s.rotationY, 0]}
          color={SCENERY_BODY[s.greyIndex]}
        />
      ))}
    </Instances>
  )
}

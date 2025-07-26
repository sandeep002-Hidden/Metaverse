import { Plane } from '@react-three/drei'

interface WallProps {
  position: [number, number, number]
  rotation: [number, number, number]
  length: number
}

export default function Wall({ position, rotation, length }: WallProps) {
  return (
    <Plane
      position={position}
      rotation={rotation}
      args={[length, 4]}
      receiveShadow
      castShadow
    >
      <meshStandardMaterial color="#4444aa" />
    </Plane>
  )
}

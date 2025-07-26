import { Mesh } from 'three'
import { useBox } from '@react-three/cannon'
import { useRef } from 'react'

export default function Obstacle({
  position = [0, 0, 0] as [number, number, number],
}) {
  const [ref] = useBox<Mesh>(() => ({
    args: [1, 1, 1] as [number, number, number],
    mass: 0,
    position,
  }), useRef<Mesh>(null!)) // 👈 add a typed ref here

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

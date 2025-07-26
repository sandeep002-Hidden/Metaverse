import { useBox } from '@react-three/cannon'
import { MeshStandardMaterial, BoxGeometry } from 'three'
import React from 'react'
import * as THREE from "three"
type Pos = [number, number, number]

interface ObstacleProps {
  position?: Pos
}

export default function Obstacle({
  position = [0, 0, 0] as Pos,
}: ObstacleProps) {
  const [ref] = useBox<THREE.Mesh>(() => ({
    args: [1, 1, 1],
    mass: 0,
    position,
  }))

  return (
    <mesh ref={ref} receiveShadow castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

import { useSphere } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import { Mesh } from 'three'

export default function Player() {
  const { camera } = useThree()
  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 1,
    position: [0, 1, 0] as [number, number, number],
  }))
  const [vel, setVel] = useState<[number, number, number]>([0, 0, 0])
  useEffect(() => api.velocity.subscribe(setVel), [api.velocity])

  const speed = 5
  useFrame(() => {
    api.velocity.set(0, vel[1], -speed)
    if (ref.current) {
      ref.current.getWorldPosition(camera.position)
      camera.position.y += 2
    }
  })

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

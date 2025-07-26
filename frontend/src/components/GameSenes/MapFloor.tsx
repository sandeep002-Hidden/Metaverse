import { MeshStandardMaterial } from 'three'
import { useMemo, useRef } from 'react'
import { InstancedMesh, PlaneGeometry } from 'three'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MapFloorProps {
  width: number
  depth: number
  tileSize: number
}

export default function MapFloor({ width, depth, tileSize }: MapFloorProps) {
  const mesh = useRef<InstancedMesh>(null!)
  const countX = Math.ceil(width / tileSize)
  const countZ = Math.ceil(depth / tileSize)
  const temp = useMemo(() => new THREE.Object3D(), [])
  const total = countX * countZ

  // Create instanced grid
  useFrame(() => {
    let id = 0
    for (let i = 0; i < countX; i++) {
      for (let j = 0; j < countZ; j++) {
        temp.position.set(
          (i - countX / 2) * tileSize + tileSize / 2,
          0,
          (j - countZ / 2) * tileSize + tileSize / 2
        )
        temp.updateMatrix()
        mesh.current.setMatrixAt(id, temp.matrix)
        id++
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })

  const geometry = new PlaneGeometry(tileSize, tileSize)
  const material = new MeshStandardMaterial({ color: '#888888' })
  return (
    <instancedMesh ref={mesh} args={[geometry, material, total]} rotation={[-Math.PI / 2, 0, 0]} />
  )
}

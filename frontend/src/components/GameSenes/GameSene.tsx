import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/cannon'
import Player from './Player'
import Ground from './Ground'
import Obstacle from './Obstacle.tsx'
import Building from './Building'

export default function GameScene() {
  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 7]} castShadow />
      <OrbitControls />

      <Physics gravity={[0, -9.8, 0]}>
        <Ground />
        <Player />
        <Obstacle position={[2, 0.5, -2]} />
        <Obstacle position={[-3, 0.5, 1]} />
        <Building position={[0, 0, -5]} />
      </Physics>
    </Canvas>
  )
}

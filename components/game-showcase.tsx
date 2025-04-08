"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, Text, Html } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gamepad2 } from "lucide-react"

function Model({ position = [0, 0, 0], scale = 1.5 }) {
  const { scene } = useGLTF("/assets/3d/duck.glb")
  const ref = useRef()

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.5
    }
  })

  return <primitive ref={ref} object={scene} position={position} scale={scale} />
}

function GameInfo() {
  const { viewport } = useThree()
  const isMobile = viewport.width < 4.5

  return (
    <Html position={[0, 2.5, 0]} transform occlude distanceFactor={1.5} className="pointer-events-none">
      <Card className="w-64 pointer-events-auto bg-background/80 backdrop-blur-sm p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-2 flex items-center">
          <Gamepad2 className="mr-2 h-5 w-5" />
          Game Projects
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Explore my interactive 3D game development projects created with modern technologies.
        </p>
        <Button size="sm" className="w-full">
          View Projects
        </Button>
      </Card>
    </Html>
  )
}

function FloatingText() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2 + 1
    }
  })

  return (
    <group ref={ref} position={[0, 1, 0]}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        Game Development
      </Text>
    </group>
  )
}

export default function GameShowcase() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading 3D environment...</p>
        </div>
      </div>
    )
  }

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Model position={[0, -1, 0]} />
      <FloatingText />
      <GameInfo />
      <Environment preset="city" />
      <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}


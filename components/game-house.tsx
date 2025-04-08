"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Html, Sky, PerspectiveCamera } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gamepad2, ArrowRight } from "lucide-react"
import * as THREE from "three"

// Simple house model
function House({ setCurrentProject }) {
  const houseRef = useRef()

  // Project positions
  const projectPositions = [
    { position: [0, 1.5, -1.9], rotation: [0, 0, 0], title: "Adventure Quest" },
    { position: [1.9, 1.5, 0], rotation: [0, -Math.PI / 2, 0], title: "Space Shooter" },
    { position: [-1.9, 1.5, 0], rotation: [0, Math.PI / 2, 0], title: "Puzzle Master" },
    { position: [0, 1.5, 1.9], rotation: [0, Math.PI, 0], title: "Fantasy RPG" },
  ]

  return (
    <group ref={houseRef} position={[0, 0, 0]}>
      {/* House base */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 2.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3, 1.5, 4]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.75, 2.01]} castShadow>
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Project displays */}
      {projectPositions.map((project, index) => (
        <ProjectDisplay
          key={index}
          position={project.position}
          rotation={project.rotation}
          title={project.title}
          index={index}
          setCurrentProject={setCurrentProject}
        />
      ))}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#7CFC00" />
      </mesh>
    </group>
  )
}

function ProjectDisplay({ position, rotation, title, index, setCurrentProject }) {
  const frameRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Create a simple colored material instead of using a texture
  const material = new THREE.MeshBasicMaterial({ color: hovered ? "#9c27b0" : "#616161" })
  const imageMaterial = new THREE.MeshBasicMaterial({ color: "#f0f0f0" })

  return (
    <group
      ref={frameRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setCurrentProject(index)}
    >
      {/* Project frame */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <primitive object={material} attach="material" />
      </mesh>

      {/* Project image */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.3, 0.8]} />
        <primitive object={imageMaterial} attach="material" />
      </mesh>

      {/* Project title */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter_Bold.json"
      >
        {title}
      </Text>
    </group>
  )
}

function ProjectInfo({ currentProject }) {
  const projects = [
    {
      title: "Adventure Quest",
      description: "A 3D adventure game with puzzle-solving mechanics and immersive storytelling.",
      tags: ["Unity", "C#", "3D Modeling"],
    },
    {
      title: "Space Shooter",
      description: "A fast-paced arcade-style space shooter with procedurally generated levels.",
      tags: ["Unreal Engine", "Blueprint", "Game Design"],
    },
    {
      title: "Puzzle Master",
      description: "A mobile puzzle game that challenges players with increasingly difficult levels.",
      tags: ["Unity", "C#", "Mobile Development"],
    },
    {
      title: "Fantasy RPG",
      description: "An immersive role-playing game set in a fantasy world with rich lore and characters.",
      tags: ["Godot", "GDScript", "Pixel Art"],
    },
  ]

  const project = projects[currentProject]

  if (!project) return null

  return (
    <Html position={[0, 3, 0]} transform occlude distanceFactor={1.5} className="pointer-events-none">
      <Card className="w-64 pointer-events-auto bg-background/80 backdrop-blur-sm p-4 shadow-lg">
        <h3 className="text-lg font-bold mb-2 flex items-center">
          <Gamepad2 className="mr-2 h-5 w-5" />
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {tag}
            </span>
          ))}
        </div>
        <Button size="sm" className="w-full">
          View Project <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Card>
    </Html>
  )
}

export default function GameHouse() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)

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
    <Canvas shadows>
      <color attach="background" args={["#87CEEB"]} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Sky sunPosition={[100, 10, 100]} />
      <House setCurrentProject={setCurrentProject} />
      {currentProject !== null && <ProjectInfo currentProject={currentProject} />}
      <Environment preset="park" />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={15}
      />
    </Canvas>
  )
}


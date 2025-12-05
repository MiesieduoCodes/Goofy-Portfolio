"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Html } from "@react-three/drei"
import * as THREE from "three"

// Individual building component
function Building({ 
  position, 
  height, 
  width, 
  depth, 
  windowColor = "#ffd700",
  label,
  floors = 5
}: {
  position: [number, number, number]
  height: number
  width: number
  depth: number
  windowColor?: string
  label?: string
  floors?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  // Animate windows (glowing effect)
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      if (material.emissive) {
        const intensity = 0.2 + Math.sin(time * 2 + position[0] * 0.1 + position[2] * 0.1) * 0.1
        material.emissiveIntensity = intensity
      }
    }
  })

  const floorHeight = height / floors

  return (
    <group ref={groupRef} position={position}>
      {/* Main building structure */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={hovered ? "#4a5568" : "#2d3748"}
          metalness={0.8}
          roughness={0.2}
          emissive={windowColor}
          emissiveIntensity={hovered ? 0.4 : 0.2}
        />
      </mesh>

      {/* Windows on each floor */}
      {Array.from({ length: floors }).map((_, floorIndex) => (
        <group key={floorIndex}>
          {Array.from({ length: Math.floor(width * 2) }).map((_, i) => (
            Array.from({ length: 2 }).map((_, j) => {
              const windowX = (i - Math.floor(width)) * (width / (Math.floor(width * 2) + 1))
              const windowY = (floorIndex - floors / 2 + 0.5) * floorHeight + (j - 0.5) * (floorHeight * 0.3)
              // Use deterministic value based on position instead of Math.random()
              const windowHash = (floorIndex * 100 + i * 10 + j) % 3
              const isLit = windowHash !== 0
              return (
                <mesh
                  key={`${floorIndex}-${i}-${j}`}
                  position={[windowX, windowY, depth / 2 + 0.01]}
                >
                  <planeGeometry args={[width * 0.15, floorHeight * 0.25]} />
                  <meshStandardMaterial
                    color={windowColor}
                    emissive={windowColor}
                    emissiveIntensity={isLit ? 0.8 : 0.2}
                    transparent
                    opacity={0.9}
                  />
                </mesh>
              )
            })
          ))}
        </group>
      ))}

      {/* Label on hover */}
      {hovered && label && (
        <Html
          position={[0, height / 2 + 0.5, 0]}
          center
          transform
          occlude
          distanceFactor={3}
          className="pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold border border-yellow-400/50 shadow-lg whitespace-nowrap">
            {label}
          </div>
        </Html>
      )}
    </group>
  )
}

// City component with multiple buildings
function City() {
  const groupRef = useRef<THREE.Group>(null)

  // Define buildings with different sizes and positions
  const buildings = [
    { position: [0, 0, 0] as [number, number, number], height: 6, width: 1.5, depth: 1.5, label: "Tech Tower", windowColor: "#4ecdc4", floors: 12 },
    { position: [-3, 0, 0] as [number, number, number], height: 4, width: 1.2, depth: 1.2, label: "Business Center", windowColor: "#ffd700", floors: 8 },
    { position: [3, 0, 0] as [number, number, number], height: 5, width: 1.3, depth: 1.3, label: "Innovation Hub", windowColor: "#ff6b6b", floors: 10 },
    { position: [-5, 0, -2] as [number, number, number], height: 3.5, width: 1.1, depth: 1.1, label: "Creative Studio", windowColor: "#95e1d3", floors: 7 },
    { position: [5, 0, -2] as [number, number, number], height: 4.5, width: 1.4, depth: 1.4, label: "Financial District", windowColor: "#6c5ce7", floors: 9 },
    { position: [0, 0, -3] as [number, number, number], height: 3, width: 1.0, depth: 1.0, label: "Residential Complex", windowColor: "#a8e6cf", floors: 6 },
    { position: [-2.5, 0, 2] as [number, number, number], height: 4, width: 1.2, depth: 1.2, label: "Media Tower", windowColor: "#f38181", floors: 8 },
    { position: [2.5, 0, 2] as [number, number, number], height: 3.5, width: 1.1, depth: 1.1, label: "Design Center", windowColor: "#ffd93d", floors: 7 },
    { position: [-4, 0, 2.5] as [number, number, number], height: 2.5, width: 0.9, depth: 0.9, label: "Startup Hub", windowColor: "#ff9ff3", floors: 5 },
    { position: [4, 0, 2.5] as [number, number, number], height: 3, width: 1.0, depth: 1.0, label: "Research Lab", windowColor: "#54a0ff", floors: 6 },
    { position: [-1.5, 0, -4] as [number, number, number], height: 2.8, width: 0.95, depth: 0.95, label: "Art Gallery", windowColor: "#5f27cd", floors: 5 },
    { position: [1.5, 0, -4] as [number, number, number], height: 3.2, width: 1.05, depth: 1.05, label: "Music Hall", windowColor: "#00d2d3", floors: 6 },
  ]

  return (
    <group ref={groupRef}>
      {buildings.map((building, index) => (
        <Building
          key={index}
          position={building.position}
          height={building.height}
          width={building.width}
          depth={building.depth}
          windowColor={building.windowColor}
          label={building.label}
          floors={building.floors}
        />
      ))}
    </group>
  )
}

export default function SkyscraperShowcase() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
          <p className="text-sm text-yellow-400">Loading skyscraper...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [10, 8, 12], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        {/* Night sky background */}
        <color attach="background" args={["#0a0a1a"]} />
        
        {/* Stars */}
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          fade
          speed={0.5}
        />

        {/* Fog for depth */}
        <fog attach="fog" args={["#0a0a1a", 10, 50]} />

        {/* Lighting - night scene */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#4a5568" />
        <pointLight position={[0, 15, 0]} intensity={0.3} color="#ffd700" />
        <pointLight position={[-5, 10, 5]} intensity={0.2} color="#4ecdc4" />
        <pointLight position={[5, 10, -5]} intensity={0.2} color="#ff6b6b" />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#1a1a2a" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Grid for reference */}
        <gridHelper args={[50, 50, "#1a1a3a", "#1a1a3a"]} position={[0, -0.49, 0]} />

        {/* City */}
        <City />

        {/* Controls - allow rotation around the city */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          minDistance={8}
          maxDistance={30}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  )
}


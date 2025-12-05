"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function SkyscraperShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050510)
    scene.fog = new THREE.FogExp2(0x050510, 0.012)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(35, 25, 40)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls (using OrbitControls from three/examples)
    let controls: any = null
    // @ts-ignore - three/examples path may not have types
    import("three/examples/jsm/controls/OrbitControls.js").then((module: any) => {
      const OrbitControls = module.OrbitControls
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.minDistance = 20
      controls.maxDistance = 100
      controls.maxPolarAngle = Math.PI / 2.1
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.2
    }).catch(() => {
      // Fallback if OrbitControls fails to load
      console.warn("OrbitControls could not be loaded")
    })

    // Collections for animated objects
    const cars: THREE.Group[] = []
    const pedestrians: THREE.Group[] = []
    const blinkingLights: THREE.Mesh[] = []
    const trafficLights: THREE.Group[] = []
    let buildingCount = 0

    // Seeded random for consistency
    let seed = 12345
    function seededRandom() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }

    // Create window texture
    function createWindowTexture(rows: number, cols: number, baseColor: string, litColor: string) {
      const canvas = document.createElement("canvas")
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext("2d")!
      
      ctx.fillStyle = baseColor
      ctx.fillRect(0, 0, 512, 512)
      
      const windowWidth = (512 / cols) * 0.7
      const windowHeight = (512 / rows) * 0.6
      const gapX = (512 / cols) * 0.3
      const gapY = (512 / rows) * 0.4
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * (512 / cols) + gapX / 2
          const y = row * (512 / rows) + gapY / 2
          
          const isLit = seededRandom() > 0.35
          
          if (isLit) {
            ctx.fillStyle = litColor
            ctx.fillRect(x, y, windowWidth, windowHeight)
            ctx.fillStyle = "rgba(255,255,255,0.3)"
            ctx.fillRect(x + 2, y + 2, windowWidth - 4, windowHeight - 4)
          } else {
            ctx.fillStyle = "#0a0a15"
            ctx.fillRect(x, y, windowWidth, windowHeight)
            ctx.fillStyle = "rgba(100,100,150,0.1)"
            ctx.fillRect(x, y, windowWidth, windowHeight * 0.3)
          }
          
          ctx.strokeStyle = "#1a1a2a"
          ctx.lineWidth = 2
          ctx.strokeRect(x, y, windowWidth, windowHeight)
        }
      }
      
      ctx.strokeStyle = "#2a2a3a"
      ctx.lineWidth = 3
      for (let row = 1; row < rows; row++) {
        const y = row * (512 / rows)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(512, y)
        ctx.stroke()
      }
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      return texture
    }

    // Create emissive texture
    function createEmissiveTexture(rows: number, cols: number, litColor: string) {
      const canvas = document.createElement("canvas")
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext("2d")!
      
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, 512, 512)
      
      const windowWidth = (512 / cols) * 0.7
      const windowHeight = (512 / rows) * 0.6
      const gapX = (512 / cols) * 0.3
      const gapY = (512 / rows) * 0.4
      
      seed = 12345
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * (512 / cols) + gapX / 2
          const y = row * (512 / rows) + gapY / 2
          
          const isLit = seededRandom() > 0.35
          if (isLit) {
            ctx.fillStyle = litColor
            ctx.fillRect(x, y, windowWidth, windowHeight)
          }
        }
      }
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      return texture
    }

    // Create building
    function createBuilding(config: {
      x: number
      z: number
      width: number
      depth: number
      height: number
      floors: number
      windowColor: string
      baseColor: string
    }) {
      const { x, z, width, depth, height, floors, windowColor, baseColor } = config
      const group = new THREE.Group()
      
      seed = Math.abs(x * 1000 + z * 100 + height * 10) | 0
      
      const geometry = new THREE.BoxGeometry(width, height, depth)
      const windowTexture = createWindowTexture(floors, Math.floor(width * 3), baseColor, windowColor)
      const emissiveTexture = createEmissiveTexture(floors, Math.floor(width * 3), windowColor)
      
      const material = new THREE.MeshStandardMaterial({
        map: windowTexture,
        emissiveMap: emissiveTexture,
        emissive: new THREE.Color(windowColor),
        emissiveIntensity: 0.8,
        metalness: 0.7,
        roughness: 0.3,
      })
      
      const building = new THREE.Mesh(geometry, material)
      building.position.set(x, height / 2, z)
      building.castShadow = true
      building.receiveShadow = true
      group.add(building)
      
      // Base/lobby
      const baseGeometry = new THREE.BoxGeometry(width + 0.5, 1.5, depth + 0.5)
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2a,
        metalness: 0.5,
        roughness: 0.5,
      })
      const base = new THREE.Mesh(baseGeometry, baseMaterial)
      base.position.set(x, 0.75, z)
      base.castShadow = true
      base.receiveShadow = true
      group.add(base)
      
      // Lobby entrance
      const lobbyGeometry = new THREE.BoxGeometry(width * 0.4, 1.2, 0.1)
      const lobbyMaterial = new THREE.MeshStandardMaterial({
        color: windowColor,
        emissive: windowColor,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9,
      })
      const lobby = new THREE.Mesh(lobbyGeometry, lobbyMaterial)
      lobby.position.set(x, 0.8, z + depth / 2 + 0.3)
      group.add(lobby)
      
      // Rooftop
      const roofGroup = new THREE.Group()
      roofGroup.position.set(x, height, z)
      
      const mechGeometry = new THREE.BoxGeometry(width * 0.4, height * 0.05, depth * 0.4)
      const mechMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a3a,
        metalness: 0.6,
        roughness: 0.4,
      })
      const mechRoom = new THREE.Mesh(mechGeometry, mechMaterial)
      mechRoom.position.y = height * 0.025
      mechRoom.castShadow = true
      roofGroup.add(mechRoom)
      
      // Antenna for tall buildings
      if (height > 12) {
        const spireGeometry = new THREE.CylinderGeometry(0.05, 0.15, height * 0.15, 8)
        const spireMaterial = new THREE.MeshStandardMaterial({
          color: 0xff3333,
          emissive: 0xff0000,
          emissiveIntensity: 0.5,
          metalness: 0.9,
          roughness: 0.1,
        })
        const spire = new THREE.Mesh(spireGeometry, spireMaterial)
        spire.position.y = height * 0.075 + height * 0.05
        roofGroup.add(spire)
        
        const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8)
        const lightMaterial = new THREE.MeshStandardMaterial({
          color: 0xff0000,
          emissive: 0xff0000,
          emissiveIntensity: 2,
        })
        const light = new THREE.Mesh(lightGeometry, lightMaterial)
        light.position.y = height * 0.15
        light.userData.isBlinking = true
        light.userData.blinkOffset = Math.random() * Math.PI * 2
        blinkingLights.push(light)
        roofGroup.add(light)
      }
      
      group.add(roofGroup)
      buildingCount++
      return group
    }

    // Create a car
    function createCar(x: number, z: number, direction: number, color: number) {
      const group = new THREE.Group()
      
      // Car body
      const bodyGeometry = new THREE.BoxGeometry(1.8, 0.5, 0.9)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.2,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 0.35
      body.castShadow = true
      group.add(body)
      
      // Car top/cabin
      const cabinGeometry = new THREE.BoxGeometry(1.0, 0.4, 0.8)
      const cabinMaterial = new THREE.MeshStandardMaterial({
        color: 0x111122,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.7,
      })
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial)
      cabin.position.set(-0.1, 0.7, 0)
      group.add(cabin)
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 12)
      const wheelMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.3,
        roughness: 0.8,
      })
      
      const wheelPositions = [
        [0.55, 0.18, 0.45],
        [0.55, 0.18, -0.45],
        [-0.55, 0.18, 0.45],
        [-0.55, 0.18, -0.45],
      ]
      
      wheelPositions.forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial)
        wheel.position.set(wx, wy, wz)
        wheel.rotation.x = Math.PI / 2
        group.add(wheel)
      })
      
      // Headlights
      const headlightGeometry = new THREE.SphereGeometry(0.08, 8, 8)
      const headlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffcc,
        emissive: 0xffffcc,
        emissiveIntensity: 2,
      })
      
      const hl1 = new THREE.Mesh(headlightGeometry, headlightMaterial)
      hl1.position.set(0.9, 0.35, 0.3)
      group.add(hl1)
      
      const hl2 = new THREE.Mesh(headlightGeometry, headlightMaterial)
      hl2.position.set(0.9, 0.35, -0.3)
      group.add(hl2)
      
      // Taillights
      const taillightGeometry = new THREE.SphereGeometry(0.06, 8, 8)
      const taillightMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 1,
      })
      
      const tl1 = new THREE.Mesh(taillightGeometry, taillightMaterial)
      tl1.position.set(-0.9, 0.35, 0.35)
      group.add(tl1)
      
      const tl2 = new THREE.Mesh(taillightGeometry, taillightMaterial)
      tl2.position.set(-0.9, 0.35, -0.35)
      group.add(tl2)
      
      group.position.set(x, 0, z)
      group.rotation.y = direction
      
      group.userData = {
        speed: 0.03 + Math.random() * 0.03,
        direction: direction,
        pathType: Math.random() > 0.5 ? "horizontal" : "vertical",
        range: 40,
      }
      
      return group
    }

    // Create pedestrian
    function createPedestrian(x: number, z: number) {
      const group = new THREE.Group()
      
      const skinColors = [0xf4d0a8, 0xe0b088, 0xc49a6c, 0x8d5524, 0x6b3e26]
      const clothColors = [0x2d3436, 0x0984e3, 0xe17055, 0x00b894, 0x6c5ce7, 0xfdcb6e, 0xe84393]
      
      const skinColor = skinColors[Math.floor(Math.random() * skinColors.length)]
      const shirtColor = clothColors[Math.floor(Math.random() * clothColors.length)]
      const pantsColor = clothColors[Math.floor(Math.random() * clothColors.length)]
      
      // Head
      const headGeometry = new THREE.SphereGeometry(0.12, 8, 8)
      const headMaterial = new THREE.MeshStandardMaterial({
        color: skinColor,
        roughness: 0.8,
      })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.y = 0.75
      group.add(head)
      
      // Body/torso
      const bodyGeometry = new THREE.CylinderGeometry(0.1, 0.12, 0.35, 8)
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: shirtColor,
        roughness: 0.7,
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 0.5
      group.add(body)
      
      // Legs
      const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 6)
      const legMaterial = new THREE.MeshStandardMaterial({
        color: pantsColor,
        roughness: 0.8,
      })
      
      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(0.05, 0.18, 0)
      leftLeg.userData.isLeg = true
      leftLeg.userData.offset = 0
      group.add(leftLeg)
      
      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(-0.05, 0.18, 0)
      rightLeg.userData.isLeg = true
      rightLeg.userData.offset = Math.PI
      group.add(rightLeg)
      
      // Arms
      const armGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 6)
      const armMaterial = new THREE.MeshStandardMaterial({
        color: skinColor,
        roughness: 0.8,
      })
      
      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(0.15, 0.48, 0)
      leftArm.userData.isArm = true
      leftArm.userData.offset = Math.PI
      group.add(leftArm)
      
      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(-0.15, 0.48, 0)
      rightArm.userData.isArm = true
      rightArm.userData.offset = 0
      group.add(rightArm)
      
      group.position.set(x, 0, z)
      group.scale.setScalar(0.8 + Math.random() * 0.3)
      
      group.userData = {
        speed: 0.008 + Math.random() * 0.008,
        direction: Math.random() * Math.PI * 2,
        walkPhase: Math.random() * Math.PI * 2,
        turnTimer: Math.random() * 200,
      }
      
      group.castShadow = true
      return group
    }

    // Create traffic light
    function createTrafficLight(x: number, z: number, rotation = 0) {
      const group = new THREE.Group()
      
      // Pole
      const poleGeometry = new THREE.CylinderGeometry(0.08, 0.1, 4, 8)
      const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x333344,
        metalness: 0.7,
        roughness: 0.3,
      })
      const pole = new THREE.Mesh(poleGeometry, poleMaterial)
      pole.position.y = 2
      group.add(pole)
      
      // Light housing
      const housingGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.25)
      const housingMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.5,
      })
      const housing = new THREE.Mesh(housingGeometry, housingMaterial)
      housing.position.set(0, 4.2, 0)
      group.add(housing)
      
      // Lights
      const lightGeometry = new THREE.SphereGeometry(0.08, 8, 8)
      
      const redLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.3,
      }))
      redLight.position.set(0, 4.45, 0.13)
      redLight.userData.lightType = "red"
      group.add(redLight)
      
      const yellowLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.3,
      }))
      yellowLight.position.set(0, 4.2, 0.13)
      yellowLight.userData.lightType = "yellow"
      group.add(yellowLight)
      
      const greenLight = new THREE.Mesh(lightGeometry, new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.3,
      }))
      greenLight.position.set(0, 3.95, 0.13)
      greenLight.userData.lightType = "green"
      group.add(greenLight)
      
      group.position.set(x, 0, z)
      group.rotation.y = rotation
      
      group.userData = {
        lights: { red: redLight, yellow: yellowLight, green: greenLight },
        phase: Math.floor(Math.random() * 3),
        timer: 0,
      }
      
      trafficLights.push(group)
      return group
    }

    // Create tree
    function createTree(x: number, z: number) {
      const group = new THREE.Group()
      
      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.2, 8)
      const trunkMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a3728,
        roughness: 0.9,
      })
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial)
      trunk.position.y = 0.6
      trunk.castShadow = true
      group.add(trunk)
      
      // Foliage
      const foliageGeometry = new THREE.SphereGeometry(0.8, 8, 8)
      const foliageMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a472a,
        roughness: 0.8,
      })
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial)
      foliage.position.y = 1.6
      foliage.scale.y = 1.2
      foliage.castShadow = true
      group.add(foliage)
      
      group.position.set(x, 0, z)
      group.scale.setScalar(0.8 + Math.random() * 0.4)
      return group
    }

    // Create bench
    function createBench(x: number, z: number, rotation = 0) {
      const group = new THREE.Group()
      
      const seatGeometry = new THREE.BoxGeometry(1.2, 0.08, 0.4)
      const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x5c4033,
        roughness: 0.8,
      })
      const seat = new THREE.Mesh(seatGeometry, woodMaterial)
      seat.position.y = 0.45
      group.add(seat)
      
      const backGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.06)
      const back = new THREE.Mesh(backGeometry, woodMaterial)
      back.position.set(0, 0.7, -0.17)
      back.rotation.x = -0.15
      group.add(back)
      
      const legGeometry = new THREE.BoxGeometry(0.08, 0.45, 0.35)
      const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.3,
      })
      
      const leg1 = new THREE.Mesh(legGeometry, metalMaterial)
      leg1.position.set(-0.5, 0.22, 0)
      group.add(leg1)
      
      const leg2 = new THREE.Mesh(legGeometry, metalMaterial)
      leg2.position.set(0.5, 0.22, 0)
      group.add(leg2)
      
      group.position.set(x, 0, z)
      group.rotation.y = rotation
      return group
    }

    // Create street lamp
    function createStreetLamp(x: number, z: number) {
      const group = new THREE.Group()
      
      const poleGeometry = new THREE.CylinderGeometry(0.06, 0.08, 4.5, 8)
      const poleMaterial = new THREE.MeshStandardMaterial({
        color: 0x333344,
        metalness: 0.8,
        roughness: 0.3,
      })
      const pole = new THREE.Mesh(poleGeometry, poleMaterial)
      pole.position.y = 2.25
      group.add(pole)
      
      // Curved arm
      const armGeometry = new THREE.TorusGeometry(0.4, 0.04, 8, 8, Math.PI / 2)
      const arm = new THREE.Mesh(armGeometry, poleMaterial)
      arm.position.set(0.4, 4.5, 0)
      arm.rotation.z = Math.PI
      group.add(arm)
      
      // Lamp housing
      const housingGeometry = new THREE.ConeGeometry(0.25, 0.2, 8)
      const housingMaterial = new THREE.MeshStandardMaterial({
        color: 0x222233,
        metalness: 0.7,
        roughness: 0.3,
      })
      const housing = new THREE.Mesh(housingGeometry, housingMaterial)
      housing.position.set(0.8, 4.4, 0)
      housing.rotation.z = Math.PI
      group.add(housing)
      
      // Light bulb
      const bulbGeometry = new THREE.SphereGeometry(0.15, 8, 8)
      const bulbMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdd88,
        emissive: 0xffdd88,
        emissiveIntensity: 1.5,
      })
      const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
      bulb.position.set(0.8, 4.25, 0)
      group.add(bulb)
      
      // Point light
      const light = new THREE.PointLight(0xffdd88, 0.6, 10)
      light.position.set(0.8, 4.25, 0)
      group.add(light)
      
      group.position.set(x, 0, z)
      return group
    }

    // Building configurations
    const buildings = [
      { x: 0, z: 0, width: 4, depth: 4, height: 28, floors: 45, windowColor: "#ffd700", baseColor: "#1a1a2e" },
      { x: -6, z: 0, width: 3.5, depth: 3.5, height: 20, floors: 32, windowColor: "#4ecdc4", baseColor: "#1a2a2e" },
      { x: 6, z: 0, width: 3.5, depth: 3.5, height: 22, floors: 35, windowColor: "#ff6b6b", baseColor: "#2e1a1a" },
      { x: 0, z: -6, width: 3, depth: 3, height: 16, floors: 26, windowColor: "#a8e6cf", baseColor: "#1a2e1a" },
      { x: 0, z: 6, width: 3.2, depth: 3.2, height: 18, floors: 28, windowColor: "#74b9ff", baseColor: "#1a1a2a" },
      { x: -18, z: 0, width: 3, depth: 3, height: 15, floors: 24, windowColor: "#fdcb6e", baseColor: "#2a2a1a" },
      { x: -18, z: -6, width: 2.8, depth: 2.8, height: 12, floors: 20, windowColor: "#95e1d3", baseColor: "#1e2a2e" },
      { x: -18, z: 6, width: 2.8, depth: 2.8, height: 14, floors: 22, windowColor: "#f38181", baseColor: "#2e1a2a" },
      { x: 18, z: 0, width: 3.2, depth: 3.2, height: 17, floors: 27, windowColor: "#6c5ce7", baseColor: "#1e1a2e" },
      { x: 18, z: -6, width: 2.6, depth: 2.6, height: 11, floors: 18, windowColor: "#e17055", baseColor: "#2a1a1a" },
      { x: 18, z: 6, width: 2.8, depth: 2.8, height: 13, floors: 21, windowColor: "#54a0ff", baseColor: "#1a1a2e" },
      { x: 0, z: -18, width: 2.8, depth: 2.8, height: 10, floors: 16, windowColor: "#5f27cd", baseColor: "#1a1a2e" },
      { x: -6, z: -18, width: 2.5, depth: 2.5, height: 9, floors: 14, windowColor: "#00d2d3", baseColor: "#1a2e2e" },
      { x: 6, z: -18, width: 2.6, depth: 2.6, height: 11, floors: 17, windowColor: "#fd79a8", baseColor: "#2e1e2e" },
      { x: 0, z: 18, width: 3, depth: 3, height: 16, floors: 25, windowColor: "#ff9ff3", baseColor: "#2e1a2e" },
      { x: -6, z: 18, width: 2.6, depth: 2.6, height: 12, floors: 19, windowColor: "#ffd93d", baseColor: "#2e2e1a" },
      { x: 6, z: 18, width: 2.8, depth: 2.8, height: 14, floors: 22, windowColor: "#a29bfe", baseColor: "#1e1e2e" },
    ]

    // Add buildings
    buildings.forEach((config) => {
      const building = createBuilding(config)
      scene.add(building)
    })

    // Create ground with roads
    function createGroundWithRoads() {
      const canvas = document.createElement("canvas")
      canvas.width = 2048
      canvas.height = 2048
      const ctx = canvas.getContext("2d")!
      
      ctx.fillStyle = "#1a1a20"
      ctx.fillRect(0, 0, 2048, 2048)
      
      const scale = 2048 / 100
      
      // Draw roads
      ctx.fillStyle = "#0d0d12"
      ctx.fillRect(0, 1024 - 3 * scale, 2048, 6 * scale)
      ctx.fillRect(1024 - 3 * scale, 0, 6 * scale, 2048)
      ctx.fillRect(0, 1024 - 15 * scale - 2.5 * scale, 2048, 5 * scale)
      ctx.fillRect(0, 1024 + 15 * scale - 2.5 * scale, 2048, 5 * scale)
      ctx.fillRect(1024 - 15 * scale - 2.5 * scale, 0, 5 * scale, 2048)
      ctx.fillRect(1024 + 15 * scale - 2.5 * scale, 0, 5 * scale, 2048)
      
      // Road markings
      ctx.strokeStyle = "#8b7355"
      ctx.lineWidth = 3
      ctx.setLineDash([30, 20])
      ctx.beginPath()
      ctx.moveTo(0, 1024)
      ctx.lineTo(2048, 1024)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(1024, 0)
      ctx.lineTo(1024, 2048)
      ctx.stroke()
      
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.setLineDash([20, 30])
      ctx.beginPath()
      ctx.moveTo(0, 1024 - 1.5 * scale)
      ctx.lineTo(2048, 1024 - 1.5 * scale)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, 1024 + 1.5 * scale)
      ctx.lineTo(2048, 1024 + 1.5 * scale)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(1024 - 1.5 * scale, 0)
      ctx.lineTo(1024 - 1.5 * scale, 2048)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(1024 + 1.5 * scale, 0)
      ctx.lineTo(1024 + 1.5 * scale, 2048)
      ctx.stroke()
      
      // Crosswalks
      ctx.fillStyle = "#ffffff"
      ctx.setLineDash([])
      
      function drawCrosswalk(cx: number, cy: number, horizontal: boolean) {
        const stripeCount = 8
        const stripeWidth = 1.5 * scale
        const stripeLength = 5 * scale
        const gap = 0.8 * scale
        
        for (let i = 0; i < stripeCount; i++) {
          if (horizontal) {
            ctx.fillRect(
              cx - (stripeCount * (stripeWidth + gap)) / 2 + i * (stripeWidth + gap),
              cy - stripeLength / 2,
              stripeWidth,
              stripeLength
            )
          } else {
            ctx.fillRect(
              cx - stripeLength / 2,
              cy - (stripeCount * (stripeWidth + gap)) / 2 + i * (stripeWidth + gap),
              stripeLength,
              stripeWidth
            )
          }
        }
      }
      
      drawCrosswalk(1024 - 4 * scale, 1024, false)
      drawCrosswalk(1024 + 4 * scale, 1024, false)
      drawCrosswalk(1024, 1024 - 4 * scale, true)
      drawCrosswalk(1024, 1024 + 4 * scale, true)
      
      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      
      const groundGeometry = new THREE.PlaneGeometry(100, 100)
      const groundMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
        metalness: 0.1,
      })
      
      const ground = new THREE.Mesh(groundGeometry, groundMaterial)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = 0
      ground.receiveShadow = true
      
      return ground
    }

    scene.add(createGroundWithRoads())

    // Add cars
    const carColors = [0xff4444, 0x4444ff, 0xffff44, 0x44ff44, 0xff44ff, 0x44ffff, 0xffffff, 0x222222, 0xff8800]
    
    for (let i = 0; i < 8; i++) {
      const x = -40 + Math.random() * 80
      const z = Math.random() > 0.5 ? 1.5 : -1.5
      const direction = z > 0 ? 0 : Math.PI
      const car = createCar(x, z, direction, carColors[Math.floor(Math.random() * carColors.length)])
      car.userData.pathType = "horizontal"
      car.userData.lane = z
      cars.push(car)
      scene.add(car)
    }
    
    for (let i = 0; i < 8; i++) {
      const x = Math.random() > 0.5 ? 1.5 : -1.5
      const z = -40 + Math.random() * 80
      const direction = x > 0 ? Math.PI / 2 : -Math.PI / 2
      const car = createCar(x, z, direction, carColors[Math.floor(Math.random() * carColors.length)])
      car.userData.pathType = "vertical"
      car.userData.lane = x
      cars.push(car)
      scene.add(car)
    }

    // Add pedestrians
    const sidewalkPositions = [
      [-4, 4], [4, 4], [-4, -4], [4, -4],
      [-10, 4], [10, 4], [-10, -4], [10, -4],
      [-12, 10], [12, 10], [-12, -10], [12, -10],
      [-20, 4], [20, 4], [-20, -4], [20, -4],
      [4, 12], [-4, 12], [4, -12], [-4, -12],
      [4, 20], [-4, 20], [4, -20], [-4, -20],
    ]
    
    for (let i = 0; i < 30; i++) {
      const basePos = sidewalkPositions[i % sidewalkPositions.length]
      const x = basePos[0] + (Math.random() - 0.5) * 2
      const z = basePos[1] + (Math.random() - 0.5) * 2
      const ped = createPedestrian(x, z)
      pedestrians.push(ped)
      scene.add(ped)
    }

    // Add traffic lights
    const trafficLightPositions = [
      [4, 4, 0],
      [-4, 4, Math.PI],
      [4, -4, -Math.PI / 2],
      [-4, -4, Math.PI / 2],
    ]
    
    trafficLightPositions.forEach(([x, z, rot]) => {
      scene.add(createTrafficLight(x, z, rot))
    })

    // Add trees
    const treePositions = [
      [-10, 10], [10, 10], [-10, -10], [10, -10],
      [-22, 10], [22, 10], [-22, -10], [22, -10],
      [10, 22], [-10, 22], [10, -22], [-10, -22],
      [-14, 0], [14, 0], [0, 14], [0, -14],
    ]
    
    treePositions.forEach(([x, z]) => {
      scene.add(createTree(x + (Math.random() - 0.5), z + (Math.random() - 0.5)))
    })

    // Add benches
    const benchPositions = [
      [-11, 5, 0], [11, 5, Math.PI], [-11, -5, 0], [11, -5, Math.PI],
      [5, 11, Math.PI / 2], [5, -11, -Math.PI / 2], [-5, 11, Math.PI / 2], [-5, -11, -Math.PI / 2],
    ]
    
    benchPositions.forEach(([x, z, rot]) => {
      scene.add(createBench(x, z, rot))
    })

    // Add street lamps
    const lampPositions = [
      [-3.5, 3.5], [3.5, 3.5], [-3.5, -3.5], [3.5, -3.5],
      [-12, 3.5], [12, 3.5], [-12, -3.5], [12, -3.5],
      [3.5, 12], [3.5, -12], [-3.5, 12], [-3.5, -12],
      [-20, 3.5], [20, 3.5], [-20, -3.5], [20, -3.5],
      [3.5, 20], [3.5, -20], [-3.5, 20], [-3.5, -20],
    ]
    
    lampPositions.forEach(([x, z]) => {
      scene.add(createStreetLamp(x, z))
    })

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 0.4)
    scene.add(ambientLight)

    const moonLight = new THREE.DirectionalLight(0x4466aa, 0.4)
    moonLight.position.set(50, 100, 50)
    moonLight.castShadow = true
    moonLight.shadow.mapSize.width = 2048
    moonLight.shadow.mapSize.height = 2048
    moonLight.shadow.camera.near = 0.5
    moonLight.shadow.camera.far = 500
    moonLight.shadow.camera.left = -60
    moonLight.shadow.camera.right = 60
    moonLight.shadow.camera.top = 60
    moonLight.shadow.camera.bottom = -60
    scene.add(moonLight)

    const cityGlow = new THREE.HemisphereLight(0xffaa33, 0x111122, 0.25)
    scene.add(cityGlow)

    // Stars
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 3000
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = 150 + Math.random() * 100
      
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = Math.abs(r * Math.cos(phi))
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
      
      const brightness = 0.5 + Math.random() * 0.5
      starColors[i * 3] = brightness
      starColors[i * 3 + 1] = brightness
      starColors[i * 3 + 2] = brightness + Math.random() * 0.2
    }
    
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3))
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Animation loop
    const clock = new THREE.Clock()
    
    function animate() {
      const id = requestAnimationFrame(animate)
      animationIdRef.current = id
      
      const time = clock.getElapsedTime()
      const delta = clock.getDelta()
      
      // Animate blinking lights
      blinkingLights.forEach((light) => {
        const blink = Math.sin(time * 2 + light.userData.blinkOffset) > 0.7
        const material = light.material as THREE.MeshStandardMaterial
        if (material) {
          material.emissiveIntensity = blink ? 3 : 0.5
        }
      })
      
      // Animate traffic lights
      trafficLights.forEach((tl) => {
        tl.userData.timer += 1
        if (tl.userData.timer > 180) {
          tl.userData.timer = 0
          tl.userData.phase = (tl.userData.phase + 1) % 3
        }
        
        const { red, yellow, green } = tl.userData.lights
        const redMaterial = red.material as THREE.MeshStandardMaterial
        const yellowMaterial = yellow.material as THREE.MeshStandardMaterial
        const greenMaterial = green.material as THREE.MeshStandardMaterial
        if (redMaterial) redMaterial.emissiveIntensity = tl.userData.phase === 0 ? 2 : 0.2
        if (yellowMaterial) yellowMaterial.emissiveIntensity = tl.userData.phase === 1 ? 2 : 0.2
        if (greenMaterial) greenMaterial.emissiveIntensity = tl.userData.phase === 2 ? 2 : 0.2
      })
      
      // Animate cars
      cars.forEach((car) => {
        if (car.userData.pathType === "horizontal") {
          const dir = car.userData.lane > 0 ? 1 : -1
          car.position.x += car.userData.speed * dir
          if (car.position.x > 45) car.position.x = -45
          if (car.position.x < -45) car.position.x = 45
        } else {
          const dir = car.userData.lane > 0 ? 1 : -1
          car.position.z += car.userData.speed * dir
          if (car.position.z > 45) car.position.z = -45
          if (car.position.z < -45) car.position.z = 45
        }
      })
      
      // Animate pedestrians
      pedestrians.forEach((ped) => {
        ped.userData.walkPhase += 0.15
        ped.userData.turnTimer -= 1
        
        if (ped.userData.turnTimer <= 0) {
          ped.userData.direction += (Math.random() - 0.5) * Math.PI / 2
          ped.userData.turnTimer = 100 + Math.random() * 200
        }
        
        ped.position.x += Math.cos(ped.userData.direction) * ped.userData.speed
        ped.position.z += Math.sin(ped.userData.direction) * ped.userData.speed
        
        const bounds = 25
        if (Math.abs(ped.position.x) > bounds || Math.abs(ped.position.z) > bounds) {
          ped.userData.direction += Math.PI
        }
        
        if (Math.abs(ped.position.x) < 4 && Math.abs(ped.position.z) < 4) {
          ped.userData.direction += Math.PI / 2
        }
        
        ped.rotation.y = -ped.userData.direction + Math.PI / 2
        
        ped.children.forEach((child) => {
          if (child.userData.isLeg) {
            child.rotation.x = Math.sin(ped.userData.walkPhase + child.userData.offset) * 0.4
          }
          if (child.userData.isArm) {
            child.rotation.x = Math.sin(ped.userData.walkPhase + child.userData.offset) * 0.3
          }
        })
      })
      
      stars.rotation.y = time * 0.005
      
      if (controls) controls.update()
      renderer.render(scene, camera)
    }

    // Handle resize
    function handleResize() {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Start animation
    setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {!isLoaded && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
            <p className="text-amber-400 text-lg">Building City...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}

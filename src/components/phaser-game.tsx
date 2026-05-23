"use client"

import { useEffect, useRef } from "react"

export default function PhaserGame() {
  const mountRef = useRef<HTMLDivElement>(null)
  const keysRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    let animFrameId: number

    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault()
    }
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    const init = async () => {
      try {
        if (container.clientWidth === 0 || container.clientHeight === 0) {
          requestAnimationFrame(() => init())
          return
        }
        
        const THREE = await import("three")

        const W = container.clientWidth || 800
        const H = container.clientHeight || 450

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1a2e)
      scene.fog = new THREE.FogExp2(0x1a1a2e, 0.02)

      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200)
      camera.position.set(0, 14, 10)
      camera.lookAt(0, 0, 0)

      scene.add(new THREE.AmbientLight(0x445566, 3))

      const torchLight = new THREE.PointLight(0xffaa55, 12, 20, 2)
      torchLight.castShadow = true
      scene.add(torchLight)

      const moonLight = new THREE.DirectionalLight(0x667799, 2)
      moonLight.position.set(10, 20, 10)
      scene.add(moonLight)

      // Ground
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshLambertMaterial({ color: 0x0c120c })
      )
      ground.rotation.x = -Math.PI / 2
      ground.receiveShadow = true
      scene.add(ground)
      scene.add(new THREE.GridHelper(200, 60, 0x111a11, 0x0d140d))

      // Trees
      for (let i = 0; i < 100; i++) {
        const x = (Math.random() - 0.5) * 160
        const z = (Math.random() - 0.5) * 160
        if (Math.abs(x) < 5 && Math.abs(z) < 5) continue
        const h = 1.5 + Math.random() * 2
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.15, h, 6),
          new THREE.MeshLambertMaterial({ color: 0x1a0f05 })
        )
        trunk.position.set(x, h / 2, z)
        scene.add(trunk)
        const top = new THREE.Mesh(
          new THREE.ConeGeometry(0.8, 2, 7),
          new THREE.MeshLambertMaterial({ color: 0x0d2a0d })
        )
        top.position.set(x, h + 0.8, z)
        scene.add(top)
      }

      // Rocks
      for (let i = 0; i < 50; i++) {
        const x = (Math.random() - 0.5) * 160
        const z = (Math.random() - 0.5) * 160
        if (Math.abs(x) < 4 && Math.abs(z) < 4) continue
        const s = 0.2 + Math.random() * 0.5
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(s, 0),
          new THREE.MeshLambertMaterial({ color: 0x1a1a2e })
        )
        rock.position.set(x, s * 0.5, z)
        rock.rotation.set(Math.random(), Math.random(), Math.random())
        scene.add(rock)
      }

      // Player
      const playerGroup = new THREE.Group()
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.9, 8),
        new THREE.MeshLambertMaterial({ color: 0x2a5a2a })
      )
      body.position.y = 0.7
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 8, 8),
        new THREE.MeshLambertMaterial({ color: 0xc8a06a })
      )
      head.position.y = 1.45
      playerGroup.add(body, head)
      scene.add(playerGroup)

      const pos = { x: 0, z: 0 }
      const speed = 0.1
      let t = 0

      const onResize = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        renderer.setSize(w, h)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      window.addEventListener("resize", onResize)

      const animate = () => {
        animFrameId = requestAnimationFrame(animate)
        t += 0.016
        const k = keysRef.current

        if (k["w"] || k["W"] || k["ArrowUp"])    pos.z -= speed
        if (k["s"] || k["S"] || k["ArrowDown"])  pos.z += speed
        if (k["a"] || k["A"] || k["ArrowLeft"])  pos.x -= speed
        if (k["d"] || k["D"] || k["ArrowRight"]) pos.x += speed

        pos.x = Math.max(-95, Math.min(95, pos.x))
        pos.z = Math.max(-95, Math.min(95, pos.z))

        playerGroup.position.set(pos.x, 0, pos.z)
        camera.position.set(pos.x, 14, pos.z + 10)
        camera.lookAt(pos.x, 0, pos.z)

        torchLight.position.set(pos.x, 2, pos.z)
        torchLight.intensity = 7 + Math.sin(t * 7) * 0.8

        renderer.render(scene, camera)
      }
      animate()

      ;(container as any).__threeCleanup = () => {
        cancelAnimationFrame(animFrameId)
        window.removeEventListener("resize", onResize)
        renderer.dispose()
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
      }
      } catch (error) {
        console.error("Error initializing THREE.js:", error)
      }
    }

    init()

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
      ;(mountRef.current as any)?.__threeCleanup?.()
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div 
        ref={mountRef} 
        className="w-full h-[450px] rounded-2xl overflow-hidden cursor-crosshair"
      />
      <p className="text-sm text-muted-foreground">
        Use <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs">WASD</kbd> or arrow keys to explore
      </p>
    </div>
  )
}
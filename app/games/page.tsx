"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { MotionDiv } from "@/components/motion"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gamepad2, Code, Zap, Layers, Palette, Cpu } from "lucide-react"
import dynamic from "next/dynamic"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, onSnapshot, query } from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Use dynamic import with SSR disabled for Three.js component
const SkyscraperShowcase = dynamic(() => import("@/components/skyscraper-showcase"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent"></div>
        <p className="text-sm text-yellow-400">Loading skyscraper...</p>
      </div>
    </div>
  ),
})

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Firebase
  useEffect(() => {
    setLoading(true)
    
    // Fetch games
    const gamesQuery = query(collection(db, "games"))
    const unsubscribeGames = onSnapshot(gamesQuery, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setGames(gamesData)
      console.log("🎮 Games loaded:", gamesData)
    })

    // Fetch tools (game development tools)
    const toolsQuery = query(collection(db, "tools"))
    const unsubscribeTools = onSnapshot(toolsQuery, (snapshot) => {
      const toolsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as {
          name: string;
          level: number;
          category: string;
        }
      }))
      .filter(tool => tool.category === "games")
      setTools(toolsData)
      console.log("🔧 Game tools loaded:", toolsData)
    })

    setLoading(false)

    return () => {
      unsubscribeGames()
      unsubscribeTools()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24">
          <div className="container-custom py-16">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Game <span className="text-gradient">Development</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Creating immersive and interactive gaming experiences with modern technologies.
              From mobile games to 3D worlds, I bring creative visions to life through code.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Start Your Game Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </MotionDiv>
        </section>

        {/* Interactive Showcase */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Interactive <span className="text-gradient">Showcase</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience my 3D work with this interactive cityscape. Hover over buildings to see labels, 
              rotate and zoom to explore the starlit night sky.
            </p>
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-[700px] w-full overflow-hidden rounded-2xl border-2 border-primary/20 shadow-2xl ring-4 ring-primary/5 bg-gradient-to-b from-slate-900 to-slate-950"
          >
            <SkyscraperShowcase />
          </MotionDiv>
        </section>

        {/* Game Projects */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Games</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of game development projects showcasing different genres and technologies
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No games available yet.</p>
              </div>
            ) : (
              games.map((project, index) => (
                <MotionDiv
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl overflow-hidden card-hover group"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <img 
                      src={project.image || "/placeholder.svg?height=400&width=600"} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.tags || []).map((tech: string) => (
                        <span key={tech} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.link || "#"}>
                        View Project
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </MotionDiv>
              ))
            )}
          </div>
        </section>

        {/* Technical Skills */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Game Development <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive skills covering game engines, programming, design, and optimization
            </p>
          </MotionDiv>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tools.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No skills available yet.</p>
              </div>
            ) : (
              tools.map((skill, index) => (
                <MotionDiv
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass rounded-xl p-6 text-center card-hover"
                >
                  <div className="text-2xl font-bold mb-2">{skill.name}</div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">{skill.level}%</div>
                </MotionDiv>
              ))
            )}
          </div>
        </section>

        {/* Development Process */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Game Development <span className="text-gradient">Process</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured approach to creating engaging and polished gaming experiences
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layers,
                title: "Concept & Design",
                description: "Creating engaging gameplay mechanics, compelling narratives, and intuitive user experiences"
              },
              {
                icon: Zap,
                title: "Prototyping",
                description: "Building rapid prototypes to test core mechanics and validate the fun factor early"
              },
              {
                icon: Palette,
                title: "Asset Creation",
                description: "Developing 3D models, animations, sound effects, and music to bring the game world to life"
              },
              {
                icon: Code,
                title: "Development",
                description: "Implementing features with rigorous testing to ensure a polished final product"
              }
            ].map((step, index) => (
              <MotionDiv
                key={step.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 text-center card-hover"
              >
                <step.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 md:p-12 text-center"
          >
            <Gamepad2 className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Create Your <span className="text-gradient">Game?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's bring your game idea to life with engaging gameplay, stunning visuals, and polished experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start Your Game
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#showcase">
                  View Showcase
                  <Gamepad2 className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  )
}


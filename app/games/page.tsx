"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ProjectCard } from "@/components/project-card"
import { PageTransition } from "@/components/page-transition"
import dynamic from "next/dynamic"

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
  return (
    <PageTransition>
      <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Game <span className="gradient-text">Development</span>
            </h1>
          </motion.div>

          <AnimatedText
            text="Creating immersive and interactive gaming experiences"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* Skyscraper Showcase Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Interactive <span className="gradient-text">City</span></h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              Hover over the buildings to see labels. Rotate and zoom to explore the cityscape in the starlit night sky.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 h-[700px] w-full overflow-hidden rounded-2xl border-2 border-yellow-400/20 shadow-2xl ring-4 ring-yellow-400/5 bg-gradient-to-b from-slate-900 to-slate-950">
          <SkyscraperShowcase />
        </div>
      </section>

      {/* Game Projects Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Game <span className="gradient-text">Projects</span>
            </h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground text-lg">
              A collection of my game development projects, from mobile games to immersive 3D experiences
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            title="Adventure Quest"
            description="A 3D adventure game with puzzle-solving mechanics and immersive storytelling."
            image="/placeholder.svg?height=400&width=600"
            tags={["Unity", "C#", "3D Modeling"]}
            link="/games/adventure-quest"
            delay={0.1}
          />

          <ProjectCard
            title="Space Shooter"
            description="A fast-paced arcade-style space shooter with procedurally generated levels."
            image="/placeholder.svg?height=400&width=600"
            tags={["Unreal Engine", "Blueprint", "Game Design"]}
            link="/games/space-shooter"
            delay={0.2}
          />

          <ProjectCard
            title="Puzzle Master"
            description="A mobile puzzle game that challenges players with increasingly difficult levels."
            image="/placeholder.svg?height=400&width=600"
            tags={["Unity", "C#", "Mobile Development"]}
            link="/games/puzzle-master"
            delay={0.3}
          />

          <ProjectCard
            title="Fantasy RPG"
            description="An immersive role-playing game set in a fantasy world with rich lore and characters."
            image="/placeholder.svg?height=400&width=600"
            tags={["Godot", "GDScript", "Pixel Art"]}
            link="/games/fantasy-rpg"
            delay={0.4}
          />

          <ProjectCard
            title="Racing Simulator"
            description="A realistic racing simulator with advanced physics and multiple tracks."
            image="/placeholder.svg?height=400&width=600"
            tags={["Unity", "C#", "Physics Simulation"]}
            link="/games/racing-simulator"
            delay={0.5}
          />

          <ProjectCard
            title="VR Experience"
            description="An interactive virtual reality experience that showcases immersive storytelling."
            image="/placeholder.svg?height=400&width=600"
            tags={["Unity", "C#", "VR Development"]}
            link="/games/vr-experience"
            delay={0.6}
          />
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Game Development <span className="gradient-text">Skills</span>
              </h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground text-lg">
                The technologies and tools I use to create engaging gaming experiences
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              "Unity",
              "Unreal Engine",
              "C#",
              "C++",
              "Three.js",
              "WebGL",
              "Blender",
              "3D Modeling",
              "Game Design",
              "Level Design",
              "Animation",
              "VR/AR",
            ].map((skill, index) => (
              <ScrollReveal key={skill} delay={0.05 * index}>
                <motion.div
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="group flex items-center justify-center rounded-lg border-2 border-border bg-background p-4 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:bg-primary/5"
                >
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{skill}</span>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Game Development Process */}
      <section className="bg-gradient-to-br from-muted/50 via-background to-muted/30 py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Game Development <span className="gradient-text">Process</span>
              </h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground text-lg">
                My approach to creating engaging and polished gaming experiences
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              title: "Concept & Design",
              description:
                "Every game starts with a solid concept and design document. I focus on creating engaging gameplay mechanics, compelling narratives, and intuitive user experiences.",
              delay: 0.1,
            },
            {
              title: "Prototyping",
              description:
                "I build rapid prototypes to test core gameplay mechanics and validate the fun factor early in the development process.",
              delay: 0.2,
            },
            {
              title: "Asset Creation",
              description:
                "From 3D models and animations to sound effects and music, I create or source high-quality assets that bring the game world to life.",
              delay: 0.3,
            },
            {
              title: "Development & Testing",
              description:
                "I implement the game using industry-standard tools and practices, with rigorous testing throughout the development cycle to ensure a polished final product.",
              delay: 0.4,
            },
          ].map((item, index) => (
            <ScrollReveal key={index} delay={item.delay}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full border-2 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
                  <CardContent className="p-6">
                    <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </ScrollReveal>
          ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 shadow-xl">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Interested in a Game <span className="gradient-text">Project?</span></h2>
              <p className="max-w-[600px] text-muted-foreground text-lg">
                I'm always open to new game development projects and collaborations. Let's create something amazing
                together!
              </p>
            </ScrollReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Button size="lg" asChild className="mt-4">
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </section>
      </div>
    </PageTransition>
  )
}


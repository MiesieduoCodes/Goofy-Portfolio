"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ProjectCard } from "@/components/project-card"
import dynamic from "next/dynamic"

// Use dynamic import with SSR disabled for Three.js component
const GameHouse = dynamic(() => import("@/components/game-house"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/20">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Loading 3D environment...</p>
      </div>
    </div>
  ),
})

export default function GamesPage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted pt-16 md:pt-24">
        <div className="container flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Game Development</h1>
          </motion.div>

          <AnimatedText
            text="Creating immersive and interactive gaming experiences"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* 3D House Showcase Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">My Project House</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              Explore this interactive 3D house showcasing my game development projects
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-8 h-[600px] w-full overflow-hidden rounded-lg border">
          <GameHouse />
        </div>
      </section>

      {/* Game Projects Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Game Projects</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Game Development Skills</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">
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
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center rounded-lg border bg-background p-4 text-center transition-all hover:border-primary hover:shadow-md"
                >
                  <span className="text-sm font-medium">{skill}</span>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Game Development Process */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Game Development Process</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
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
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <Card className="border-none bg-gradient-to-r from-primary/20 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Interested in a Game Project?</h2>
              <p className="max-w-[600px] text-muted-foreground">
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
  )
}


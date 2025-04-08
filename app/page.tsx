"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Code, Camera, Gamepad2, Music } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ProjectCard } from "@/components/project-card"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted pt-16 md:pt-24">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Hi, I&apos;m <span className="text-primary">Miesieduo Veria</span>
            </h1>
          </motion.div>

          <AnimatedText
            text="Web Developer, Game Developer, Nature Photographer, and Drummer"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <Button asChild size="lg" className="relative overflow-hidden group">
              <Link href="/contact">
                <span className="relative z-10">Get in Touch</span>
                <motion.span
                  className="absolute inset-0 bg-primary-foreground/10"
                  initial={{ y: "100%" }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="relative overflow-hidden group">
              <Link href="/web">
                <span className="relative z-10">View My Work</span>
                <motion.span
                  className="absolute inset-0 bg-primary/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
            className="mt-16 w-full max-w-3xl overflow-hidden rounded-t-xl border bg-background shadow-xl"
          >
            <Image
              src="/placeholder.svg?height=600&width=1200"
              width={1200}
              height={600}
              alt="Miesieduo Veria's featured work"
              className="w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">My Skills</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              I specialize in multiple creative disciplines, bringing a unique perspective to each project.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ScrollReveal direction="up" delay={0.1}>
            <SkillCard
              icon={<Code className="h-10 w-10" />}
              title="Web Development"
              description="Creating responsive, accessible, and performant web applications using modern technologies."
              href="/web"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <SkillCard
              icon={<Gamepad2 className="h-10 w-10" />}
              title="Game Development"
              description="Building immersive and interactive gaming experiences with cutting-edge tools."
              href="/games"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <SkillCard
              icon={<Camera className="h-10 w-10" />}
              title="Nature Photography"
              description="Capturing the beauty of the natural world through a unique and artistic lens."
              href="/photography"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <SkillCard
              icon={<Music className="h-10 w-10" />}
              title="Music & Drumming"
              description="Creating rhythms and beats that move people and enhance musical experiences."
              href="/music"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Projects</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              A selection of my best work across different disciplines.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            title="E-Commerce Platform"
            description="A full-featured online store with product management, cart functionality, and secure checkout."
            image="/placeholder.svg?height=400&width=600"
            tags={["Next.js", "Tailwind CSS", "Stripe"]}
            link="/web/project-1"
            delay={0.1}
          />

          <ProjectCard
            title="Adventure Quest"
            description="An immersive 3D adventure game with puzzle-solving mechanics and rich storytelling."
            image="/placeholder.svg?height=400&width=600"
            tags={["Three.js", "WebGL", "Game Design"]}
            link="/games/project-1"
            delay={0.2}
          />

          <ProjectCard
            title="Wildlife Series"
            description="A collection of nature photographs capturing the beauty and diversity of wildlife."
            image="/placeholder.svg?height=400&width=600"
            tags={["Photography", "Nature", "Wildlife"]}
            link="/photography/project-1"
            delay={0.3}
          />
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-12 flex justify-center">
            <Button variant="outline" asChild className="group">
              <Link href="/web">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="container flex flex-col items-center text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Let&apos;s Work Together</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              I&apos;m always open to new opportunities and collaborations. Get in touch to discuss your project.
            </p>
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
          >
            <Button className="mt-8" size="lg" asChild>
              <Link href="/contact">Contact Me</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function SkillCard({
  icon,
  title,
  description,
  href,
}: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Card className="flex flex-col items-center text-center transition-all hover:shadow-md group">
      <CardContent className="pt-6">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="mb-4 rounded-full bg-primary/10 p-3 text-primary"
        >
          {icon}
        </motion.div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <Button variant="link" asChild className="p-0 group/link">
          <Link href={href}>
            Learn more
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}


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
import { PageTransition } from "@/components/page-transition"

export default function Home() {
  return (
    <PageTransition>
      <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Hi, I&apos;m <span className="gradient-text">Miesieduo Veria</span>
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
            className="mt-16 w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-primary/20 bg-background shadow-2xl ring-4 ring-primary/5"
          >
            <div className="relative group">
              <Image
                src="/images/IMG_6959.JPG"
                width={900}
                height={400}
                alt="Miesieduo Veria's featured work"
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
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
            image="/images/azaikiartgallery.org.ng_.png"
            tags={["Next.js", "Tailwind CSS", "Stripe"]}
            link="https://www.azaikiartgallery.org.ng"
            delay={0.1}
          />

          <ProjectCard
            title="Adventure Quest"
            description="An immersive 3D adventure game with puzzle-solving mechanics and rich storytelling."
            image="/images/"
            tags={["Three.js", "WebGL", "Game Design"]}
            link="/games/project-1"
            delay={0.2}
          />

          <ProjectCard
            title="Wildlife Series"
            description="A collection of nature photographs capturing the beauty and diversity of wildlife."
            image="/images/IMG_20240322_160418_515.jpg"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-muted to-primary/5 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="container relative z-10 flex flex-col items-center text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Let&apos;s Work Together</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground text-lg">
              I&apos;m always open to new opportunities and collaborations. Get in touch to discuss your project.
            </p>
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="mt-8 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300" size="lg" asChild>
              <Link href="/contact" className="relative overflow-hidden">
                <span className="relative z-10">Contact Me</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      </div>
    </PageTransition>
  )
}

function SkillCard({
  icon,
  title,
  description,
  href,
}: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <Card className="group relative flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 border-2 hover:border-primary/30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardContent className="relative z-10 pt-6">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-4 text-primary shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300"
        >
          {icon}
        </motion.div>
        <h3 className="mb-2 text-xl font-bold group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <Button variant="link" asChild className="p-0 group/link">
          <Link href={href} className="relative">
            Learn more
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}


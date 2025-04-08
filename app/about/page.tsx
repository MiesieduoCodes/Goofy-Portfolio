"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Download, FileText } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function AboutPage() {
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">About Me</h1>
          </motion.div>

          <AnimatedText
            text="Learn more about my journey, skills, and passion for creativity"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* Bio Section */}
      <section className="container">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <ScrollReveal>
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image src="/images/IMG-20250325-WA0019(1).jpg" alt="Miesieduo Veria" fill className="object-cover" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold tracking-tighter">Miesieduo Veria</h2>
              <p className="mt-2 text-muted-foreground">
                Web Developer, Game Developer, Nature Photographer, and Drummer
              </p>

              <div className="mt-6 space-y-4">
                <p>
                  Hello! I'm Miesieduo, but you can call me Goofy. I'm a multidisciplinary creative with a passion for
                  web development, game design, nature photography, and music.
                </p>
                <p>
                  With 3 years of experience in web deevelopment and 1 year game development, I specialize in creating immersive
                  digital experiences that engage users and deliver results. My technical expertise is complemented by
                  my artistic background in photography and music, allowing me to bring a unique perspective to every
                  project.
                </p>
                <p>
                  When I'm not coding or designing, you can find me exploring nature with my camera, or behind a drum
                  kit creating rhythms. This diverse set of interests fuels my creativity and problem-solving approach.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/resume.pdf" target="_blank">
                    <FileText className="mr-2 h-4 w-4" />
                    View Resume
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">My Journey</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">
                The key milestones that have shaped my career and creative path
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 space-y-8">
            {[
              {
                year: "2023",
                title: "Senior Developer at Tech Innovations",
                description:
                  "Leading web and game development projects for major clients, focusing on immersive experiences and cutting-edge technologies.",
              },
              {
                year: "2021",
                title: "Published Photography Collection",
                description:
                  "Released 'Natural Wonders', a collection of nature photographs exhibited in galleries across the country.",
              },
              {
                year: "2020",
                title: "Game Developer at Interactive Studios",
                description:
                  "Developed multiple successful indie games using Unity and Unreal Engine, with a focus on innovative gameplay mechanics.",
              },
              {
                year: "2018",
                title: "Freelance Web Developer",
                description:
                  "Established my freelance business, working with clients globally on responsive web applications and e-commerce platforms.",
              },
              {
                year: "2016",
                title: "First Drumming Tour",
                description:
                  "Toured with the jazz ensemble 'Rhythm Collective', performing at venues and festivals across the country.",
              },
              {
                year: "2015",
                title: "Bachelor's Degree in Computer Science",
                description: "Graduated with honors, specializing in interactive media and game development.",
              },
            ].map((event, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="flex-shrink-0 md:w-32">
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-center font-bold text-primary">
                      {event.year}
                    </div>
                  </div>
                  <div className="relative border-l border-primary/30 pl-6 md:border-l-0">
                    <div className="absolute -left-1.5 top-2 h-3 w-3 rounded-full bg-primary"></div>
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <p className="mt-2 text-muted-foreground">{event.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">My Skills</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              A comprehensive overview of my technical and creative abilities
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <ScrollReveal delay={0.1}>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Technical Skills</h3>
                <div className="mt-4 space-y-4">
                  {[
                    { name: "Web Development", level: 90 },
                    { name: "Creative Writing", level: 75 },
                    { name: "Music Production", level: 40 },
                    { name: "Game Development", level: 85 },
                    ].map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          viewport={{ once: true }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Creative Skills</h3>
                <div className="mt-4 space-y-4">
                  {[
                    { name: "Photography", level: 95 },
                    { name: "Drumming", level: 90 },
                    { name: "Visual Composition", level: 85 },
                  ].map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          viewport={{ once: true }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tools & Technologies</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">
                The software, frameworks, and equipment I use in my work
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              "React",
              "Next.js",
              "Unity",
              "C#",
              "Tailwind CSS",
              "TypeScript",
              "Firebase",
              "VS Code",
              "Git",
            ].map((tool, index) => (
              <ScrollReveal key={tool} delay={0.05 * index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center rounded-lg border bg-background p-4 text-center transition-all hover:border-primary hover:shadow-md"
                >
                  <span className="text-sm font-medium">{tool}</span>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section className="container">
        <Card className="border-none bg-gradient-to-r from-primary/20 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Download My Resume</h2>
              <p className="max-w-[600px] text-muted-foreground">
                For a detailed overview of my experience, education, and skills, download my resume.
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
                <Link href="/resume.pdf" target="_blank">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


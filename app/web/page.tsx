"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ProjectCard } from "@/components/project-card"

export default function WebPage() {
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Web Development</h1>
          </motion.div>

          <AnimatedText
            text="Creating responsive, accessible, and performant web applications"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* Skills Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">My Web Development Skills</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              I specialize in modern web technologies to build fast, responsive, and user-friendly applications
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Firebase",
            "GSAP",
            "Framer Motion"
          ].map((skill, index) => (
            <ScrollReveal key={skill} delay={0.05 * index}>
              <div className="flex items-center justify-center rounded-lg border bg-background p-4 text-center transition-all hover:border-primary hover:shadow-md">
                <span className="text-sm font-medium">{skill}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Web Projects</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              A collection of my web development projects, from e-commerce platforms to interactive web applications
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            title="Azaiki Art Gallery And Museum"
            description="A full-featured online store with product management, cart functionality, and secure checkout."
            image="/images/azaikiartgallery.org.ng_.png"
            tags={["Next.js", "Tailwind CSS", "Typescript", "Flutterwave"]}
            link="https://azaikiartgallery.org.ng"
            delay={0.1}
          />

          <ProjectCard
            title="Empower Her"
            description="A comprehensive dashboard for managing social media accounts and analyzing performance metrics."
            image="/images/dfcinspire.vercel.app_.png"
            tags={["Next.js", "TypeScript", "Flutterwave"]}
            link="/web/project-2"
            delay={0.2}
          />

          <ProjectCard
            title="Anim8"
            description="A collaborative task management application with real-time updates and team collaboration features."
            image="/images/anim8-two.vercel.app_.png"
            tags={["Next.js", "Firebase", "Tailwind CSS"]}
            link="anim8-two.vercel.app"
            delay={0.3}
          />

          <ProjectCard
            title="Portfolio Website"
            description="A responsive portfolio website for a creative professional with custom animations and interactions."
            image="/images/"
            tags={["React", "Framer Motion", "GSAP"]}
            link="/web/project-4"
            delay={0.4}
          />

          <ProjectCard
            title="Evelyn Oweibo Foundation"
            description="A property listing and management platform with advanced search and filtering capabilities."
            image="/images/evelynoweibofoundation.org_.png"
            tags={["Next.js", "MongoDB", "Google Maps API"]}
            link="https://evelynoweibofoundation.org/"
            delay={0.5}
          />

          <ProjectCard
            title="Global Sports FC"
            description="A property listing and management platform with advanced search and filtering capabilities."
            image="/images/globalsports.vercel.app_.png"
            tags={["Next.js", "MongoDB", "Google Maps API"]}
            link="https://globalsportsfc.com/"
            delay={0.5}
          />

          
          <ProjectCard
            title="Faven LP"
            description="A property listing and management platform with advanced search and filtering capabilities."
            image="/images/www.favenlp.com_.png"
            tags={["Next.js", "MongoDB", "Google Maps API"]}
            link="https://www.favenlp.com/"
            delay={0.5}
          />
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">My Development Process</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">
                I follow a structured approach to ensure high-quality, maintainable, and user-friendly web applications
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Discovery",
                description:
                  "Understanding your requirements, goals, and target audience to create a solid foundation.",
              },
              {
                step: "02",
                title: "Design",
                description: "Creating wireframes and prototypes to visualize the user interface and experience.",
              },
              {
                step: "03",
                title: "Development",
                description: "Building the application with clean, maintainable code and modern best practices.",
              },
              {
                step: "04",
                title: "Deployment",
                description:
                  "Testing, optimizing, and launching your application with ongoing support and maintenance.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.step} delay={0.1 * index}>
                <Card className="border-none bg-transparent">
                  <CardContent className="p-6">
                    <div className="mb-4 text-4xl font-bold text-primary/50">{item.step}</div>
                    <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Section */}
      <section className="container">
        <Card className="bg-primary/5 border-none">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Check Out My Code</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Explore my open-source projects and contributions on GitHub. I'm passionate about clean code and best
                practices.
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
                <Link href="https://github.com/goofydidthis" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-5 w-5" />
                  View GitHub Profile
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container">
        <Card className="border-none bg-gradient-to-r from-primary/20 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Have a Web Project in Mind?</h2>
              <p className="max-w-[600px] text-muted-foreground">
                I'm always open to new web development projects and collaborations. Let's create something amazing
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


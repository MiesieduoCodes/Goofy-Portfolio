"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { MotionDiv } from "@/components/motion"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink, Github, Code, Zap, Layers, RefreshCw, Search } from "lucide-react"
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

export default function WebPage() {
  const [websites, setWebsites] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Firebase
  useEffect(() => {
    setLoading(true)
    
    // Fetch websites
    const websitesQuery = query(collection(db, "websites"))
    const unsubscribeWebsites = onSnapshot(websitesQuery, (snapshot) => {
      const websitesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setWebsites(websitesData)
      console.log("🌐 Websites loaded:", websitesData)
    })

    // Fetch tools (web development tools)
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
      .filter(tool => tool.category === "web")
      setTools(toolsData)
      console.log("🔧 Web tools loaded:", toolsData)
    })

    setLoading(false)

    return () => {
      unsubscribeWebsites()
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
              Web <span className="text-gradient">Development</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Creating responsive, accessible, and performant web applications with modern technologies and best practices.
              From concept to deployment, I build solutions that make an impact.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </MotionDiv>
        </section>

        {/* Skills Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Technical <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern web development stack focused on performance, scalability, and user experience
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

        {/* Featured Projects */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A selection of recent web development projects showcasing technical skills and creative solutions
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websites.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects available yet.</p>
              </div>
            ) : (
              websites.map((project, index) => (
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
                      <Link href={project.link || "#"} target="_blank" rel="noopener noreferrer">
                        View Project
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </MotionDiv>
              ))
            )}
          </div>
        </section>

        {/* Process Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Development <span className="text-gradient">Process</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A structured approach to ensure high-quality, maintainable, and user-friendly applications
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: "Discovery",
                description: "Understanding requirements, goals, and target audience to create a solid foundation"
              },
              {
                icon: Layers,
                title: "Design",
                description: "Creating wireframes and prototypes to visualize the user interface and experience"
              },
              {
                icon: Code,
                title: "Development",
                description: "Building with clean, maintainable code and modern best practices"
              },
              {
                icon: Zap,
                title: "Deployment",
                description: "Testing, optimizing, and launching with ongoing support and maintenance"
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
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Something <span className="text-gradient">Amazing?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss your web development project and bring your ideas to life with modern, scalable solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/goofydidthis" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View GitHub
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

'use client'

import { useState } from 'react'
import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    title: "Aetheris Engine",
    description: "A custom-built procedural terrain generator for large-scale immersive environments.",
    tags: ["Unity", "C#", "Procedural"],
    category: "Game Dev",
    image: "/placeholder.svg",
  },
  {
    title: "Lumina Visuals",
    description: "Photography portfolio platform focusing on high-contrast lighting and minimalist aesthetics.",
    tags: ["Vue.js", "Tailwind", "Photography"],
    category: "Web Dev",
    image: "/placeholder.svg",
  },
  {
    title: "Hyperion Storefront",
    description: "Headless e-commerce engine processing 10k+ transactions daily with custom ISR strategies.",
    tags: ["Next.js", "E-commerce", "TypeScript"],
    category: "Web Dev",
    image: "/placeholder.svg",
  },
  {
    title: "Sentinel Analytics",
    description: "Real-time monitoring dashboard for industrial IoT devices with complex visualizations.",
    tags: ["React", "D3.js", "WebSocket"],
    category: "Web Dev",
    image: "/placeholder.svg",
  },
  {
    title: "Procedural Biome Engine",
    description: "GPU-instancing system with noise-based compute shaders for real-time terrain generation.",
    tags: ["Unity", "HLSL", "Compute Shaders"],
    category: "Game Dev",
    image: "/placeholder.svg",
  },
  {
    title: "Rhythm Studio",
    description: "Audio visualization platform for drummers featuring waveform analysis and session recording.",
    tags: ["React", "Web Audio API", "Canvas"],
    category: "Creative",
    image: "/placeholder.svg",
  },
];

const categories = ["All", "Web Dev", "Game Dev", "Creative"];

export default function Work() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              My <span className="text-gradient">Work</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              A curated collection of projects spanning web development, game development, and creative media. 
              Each project represents a unique challenge solved with technical expertise and creative innovation.
            </p>
          </MotionDiv>
        </section>

        {/* Filter Section */}
        <section className="container-custom py-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="container-custom py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <MotionDiv
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="glass rounded-xl overflow-hidden card-hover">
                  {/* Project Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-2xl font-bold text-primary/20">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <ArrowUpRight className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                        {project.category}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="tech-tag"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Have a <span className="text-gradient">Project</span> in Mind?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              I'm always excited to take on new challenges and collaborate on innovative projects. 
              Let's discuss how we can bring your ideas to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <button className="btn-glow bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Get In Touch
                </button>
              </Link>
              <Link href="/services">
                <button className="border border-border px-8 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors">
                  View Services
                </button>
              </Link>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Gamepad2, Code, Camera, Music, Download, Mail, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, query } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const skills = {
  development: ["React / Next.js", "C# / Unity", "Tailwind CSS"],
  creative: ["Adobe Creative Cloud", "Figma", "Davinci Resolve"],
  gear: ["Sony Alpha Series", "Prime Lenses", "DW Drums & Zildjian"],
  management: ["Project Leadership", "Public Speaking", "Technical Writing"],
};

export default function About() {
  const [hoveredExperience, setHoveredExperience] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch experiences from Firebase
  useEffect(() => {
    setLoading(true)
    
    const experiencesQuery = query(collection(db, "experiences"))
    const unsubscribeExperiences = onSnapshot(experiencesQuery, (snapshot) => {
      const experiencesData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as {
          role: string;
          company: string;
          period: string;
          startYear: string;
          endYear: string | null;
          isPresent: boolean;
          description: string;
          details: string;
          align: "left" | "right";
        }
      }))
      // Sort by start year (newest first)
      const sortedExperiences = experiencesData.sort((a, b) => {
        const yearA = parseInt(a.startYear) || 0
        const yearB = parseInt(b.startYear) || 0
        return yearB - yearA
      })
      setExperiences(sortedExperiences)
      console.log("💼 Experiences loaded:", sortedExperiences)
      setLoading(false)
    })

    return () => {
      unsubscribeExperiences()
    }
  }, [])

  // Get icon based on role or company
  const getIcon = (role: string, company: string) => {
    if (role.toLowerCase().includes('web') || company.toLowerCase().includes('tech')) {
      return Code
    }
    if (role.toLowerCase().includes('game') || company.toLowerCase().includes('game')) {
      return Gamepad2
    }
    if (role.toLowerCase().includes('developer') || company.toLowerCase().includes('studio')) {
      return Gamepad2
    }
    return Briefcase
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container-custom py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Portrait */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-border">
                  <div className="w-full h-full flex items-center justify-center relative">
                    <Image
                      src="/IMG_6959.JPG"
                      alt="Miesieduo Veria"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-green-500/20 mix-blend-overlay"></div>
                    
                    {/* Pulsating background layer */}
                    <div className="absolute bottom-4 left-4 bg-green-500 rounded-2xl animate-pulse h-12"></div>
                    
                    {/* Text layer with stable background */}
                    <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-2xl px-3 py-2 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">Miesieduo Veria</span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>

            {/* Content */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                  About <span className="text-gradient">Miesieduo Veria</span>
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Multi-disciplinary creative professional based in Nigeria, operating at the intersection of code, lens, and rhythm.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  I build scalable web applications, immersive gaming experiences, and professional creative media that bridges technical
                  excellence with artistic vision.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  When I'm not coding or designing, you can find me exploring nature with my camera, or behind a drum kit creating rhythms.
                  This diverse set of interests fuels my creativity and problem-solving approach.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link href="/contact">Get In Touch</Link>
                </Button>
                <Button variant="heroOutline" size="lg" asChild>
                  <Link href="/work">View Portfolio</Link>
                </Button>
              </div>
            </MotionDiv>
          </div>
        </section>

        {/* Skills Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Skills & <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive skill set spanning development, creative tools, professional gear, and project management.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items], index) => (
              <MotionDiv
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 card-hover"
              >
                <h3 className="font-semibold text-lg mb-4 capitalize text-primary">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Professional <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Key milestones and roles that have shaped my expertise and approach.
            </p>
          </MotionDiv>

          <div className="relative min-h-[400px]">
            {/* Timeline Line with Years */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border">
              {/* Year Markers */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 whitespace-nowrap">
                <div className="text-xs font-medium text-primary bg-background px-2 py-1 border border-border rounded">2024</div>
              </div>
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-2 whitespace-nowrap">
                <div className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 border border-border rounded">2021</div>
              </div>
              <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-2 whitespace-nowrap">
                <div className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 border border-border rounded">2018</div>
              </div>
            </div>

            <div className="space-y-12">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading experiences...</p>
                </div>
              ) : experiences.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No experiences available yet.</p>
                </div>
              ) : (
                experiences.map((exp, index) => {
                  const IconComponent = getIcon(exp.role, exp.company)
                  return (
                    <MotionDiv
                      key={exp.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`relative flex items-center ${
                        exp.align === "left" ? "justify-start" : "justify-end"
                      }`}
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10"></div>

                      {/* Content Card */}
                      <div className={`w-full lg:w-5/12 ${exp.align === "left" ? "pr-8 text-right" : "pl-8"}`}>
                        <div 
                          className="glass rounded-xl p-6 card-hover cursor-pointer transition-all duration-300"
                          onMouseEnter={() => setHoveredExperience(exp.id)}
                          onMouseLeave={() => setHoveredExperience(null)}
                        >
                          <div className={`flex items-center gap-3 mb-3 ${exp.align === "left" ? "justify-end" : ""}`}>
                            <IconComponent className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-lg">{exp.role}</h3>
                          </div>
                          <p className="text-primary font-medium mb-2">{exp.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{exp.period}</p>
                          <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </div>
                        
                        {/* Expandable Details */}
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          hoveredExperience === exp.id ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="glass rounded-xl p-6 border-2 border-primary/20 bg-primary/5">
                            <h4 className="font-semibold text-primary mb-3">Key Achievements & Responsibilities</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{exp.details}</p>
                          </div>
                        </div>
                      </div>
                    </MotionDiv>
                  )
                })
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Let's Create Something <span className="text-gradient">Amazing</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you need a web application, game development, or creative media production, 
              I'm here to bring your vision to life with technical excellence and creative flair.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link href="/contact">Start a Project</Link>
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

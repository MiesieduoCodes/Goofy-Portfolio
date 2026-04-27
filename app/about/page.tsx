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
import gsap from "gsap";
import AmbientParticles from "@/components/ambient-particles";
import PhotoCarousel from "@/components/photo-carousel";

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

  // MOUSE PARALLAX EFFECT (Preserved for "alive" feel)
  useEffect(() => {
    const tiles = document.querySelectorAll(".bento-tile");

    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      tiles.forEach((tile: any, i) => {
        gsap.to(tile, {
          x: x * (i * 0.05 + 0.3),
          y: y * (i * 0.05 + 0.3),
          rotateY: x * 0.5,
          rotateX: -y * 0.5,
          duration: 0.6,
          ease: "power3.out",
        });
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <Navbar />
      <AmbientParticles />

      {/* NOISE TEXTURE OVERLAY */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <main className="pt-24 px-4 md:px-8 relative z-10">

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:auto-rows-[180px] perspective-[1200px]">

          {/* BIG INTRO */}
          <MotionDiv
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:col-span-4 md:row-span-2 border border-border p-8 flex flex-col justify-between transform-gpu transition-all duration-500 hover:scale-[1.03] backdrop-blur-sm bg-white/5"
          >
            <h1 className="text-4xl md:text-6xl font-black leading-none uppercase italic">
              Miesieduo <br /> Veria
            </h1>

            <p className="text-muted-foreground max-w-xl text-lg">
              I design and build immersive digital experiences at the intersection of
              code, visuals, and sound.
            </p>
          </MotionDiv>

          {/* PORTRAIT */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:col-span-2 md:row-span-2 overflow-hidden border border-border transform-gpu transition-all duration-500 hover:scale-[1.03] h-[400px] md:h-auto"
          >
            <Image
              src="/Miesieduoveria.png"
              alt="portrait"
              width={500}
              height={500}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </MotionDiv>

          {/* PHOTO CAROUSEL TILE (Taking over small spot) */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:col-span-2 md:row-span-3 border border-border overflow-hidden transform-gpu transition-all duration-500 hover:scale-[1.03] h-[400px] md:h-auto"
          >
            <PhotoCarousel />
          </MotionDiv>

          {/* MINI BIO */}
          <MotionDiv
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:col-span-4 md:row-span-1 border border-border p-8 flex items-center transform-gpu transition-all duration-500 hover:scale-[1.03] backdrop-blur-sm bg-white/5"
          >
            <p className="text-xl md:text-2xl font-light italic leading-relaxed text-muted-foreground">
              "I blend engineering with creativity to craft systems that <span className="text-white font-bold not-italic underline decoration-primary">feel alive</span>."
            </p>
          </MotionDiv>

          {/* SKILLS / EXPERTISE (Taking over large spot) */}
          <MotionDiv
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:col-span-4 md:row-span-2 border border-border p-8 transform-gpu transition-all duration-500 hover:scale-[1.03] backdrop-blur-sm bg-white/5"
          >
            <h3 className="text-xl font-bold mb-8 text-primary tracking-[0.4em] uppercase">Expertise / Skills</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} className="group">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 group-hover:text-primary transition-colors">{category}</p>
                  <div className="space-y-1">
                    {items.map((item, idx) => (
                      <p key={idx} className="text-xs font-bold uppercase italic tracking-tighter">{item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </MotionDiv>

          {/* EXPERIENCE (WIDE) */}
          <MotionDiv
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:row-span-2 border border-border p-8 transform-gpu transition-all duration-500 hover:scale-[1.02] backdrop-blur-sm bg-white/5 h-auto"
          >
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Timeline</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border-l-2 border-primary/20 pl-4 py-2 hover:border-primary transition-colors">
                <span className="text-xs font-bold text-primary">2024</span>
                <p className="text-sm font-black uppercase mt-1">Game Developer</p>
                <p className="text-xs text-muted-foreground mt-1">Unity & C# Systems</p>
              </div>
              <div className="border-l-2 border-primary/20 pl-4 py-2 hover:border-primary transition-colors">
                <span className="text-xs font-bold text-primary">2022</span>
                <p className="text-sm font-black uppercase mt-1">Creative Director</p>
                <p className="text-xs text-muted-foreground mt-1">Media Production</p>
              </div>
              <div className="border-l-2 border-primary/20 pl-4 py-2 hover:border-primary transition-colors">
                <span className="text-xs font-bold text-primary">2020</span>
                <p className="text-sm font-black uppercase mt-1">Fullstack Engineer</p>
                <p className="text-xs text-muted-foreground mt-1">React Architect</p>
              </div>
            </div>
          </MotionDiv>

          {/* CTA TILE */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:col-span-3 md:row-span-1 border border-border p-8 flex flex-col justify-between transform-gpu transition-all duration-500 hover:scale-[1.03] bg-primary text-black"
          >
            <p className="text-sm font-bold uppercase tracking-widest">Next Phase</p>
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-black leading-none uppercase italic">Start <br /> Project</h2>
              <Button asChild variant="secondary" className="rounded-full w-12 h-12 p-0 flex items-center justify-center">
                <Link href="/contact">→</Link>
              </Button>
            </div>
          </MotionDiv>

          {/* EXTRA TILE (visual balance) */}
          <MotionDiv
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bento-tile col-span-6 md:col-span-3 md:row-span-1 border border-border p-6 flex items-center justify-center text-muted-foreground transform-gpu transition-all duration-500 hover:scale-[1.03] bg-white/5 backdrop-blur-md"
          >
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] mb-2 opacity-50">Current Status</p>
              <p className="text-sm font-bold uppercase tracking-tighter">Available for hire / 2026</p>
            </div>
          </MotionDiv>

        </div>

      </main>
      <Footer />
    </div>
  );
}

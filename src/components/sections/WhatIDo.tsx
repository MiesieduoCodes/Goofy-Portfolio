"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Code2, Gamepad2, Music } from "lucide-react";
import { SectionLabel } from "@/components/sections/BigCta";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "High-performance systems, realtime apps, immersive UI, and smooth DX-driven engineering.",
    href: "/web",
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    description: "Physics-driven interactions, custom engines, procedural systems, and dynamic gameplay.",
    href: "/games",
  },
  {
    icon: Camera,
    title: "Creative Media",
    description: "Cinematic capture, storytelling, color theory, and visual identity for brands & artists.",
    href: "/photography",
  },
  {
    icon: Music,
    title: "Music Production",
    description: "Percussive architecture, rhythmic textures, ambient scoring, and digital sound design.",
    href: "/music",
  },
];

export function WhatIDo() {
  return (
    <section id="what-i-do" className="bg-black px-6 py-28 md:px-10 md:py-40">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-6">
        <SectionLabel index="02">What I do</SectionLabel>
        <Link
          href="/services"
          className="group mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white"
        >
          All services
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <ul>
        {services.map((item, i) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.08 }}
            className="border-t border-white/10 last:border-b"
          >
            <Link href={item.href} className="group relative block overflow-hidden">
              {/* White fill that wipes up on hover */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
              />
              <span className="relative grid grid-cols-12 items-center gap-4 py-7 md:py-10 transition-colors duration-500 group-hover:text-black">
                <span className="col-span-2 md:col-span-1 font-mono text-xs text-white/40 transition-colors group-hover:text-black/50">
                  0{i + 1}
                </span>
                <span className="col-span-10 md:col-span-6 text-3xl md:text-6xl font-black uppercase leading-none tracking-tighter transition-transform duration-500 md:group-hover:translate-x-3">
                  {item.title}
                </span>
                <span className="col-span-10 col-start-3 md:col-start-auto md:col-span-4 text-sm text-white/50 transition-colors group-hover:text-black/70">
                  {item.description}
                </span>
                <span className="hidden md:flex md:col-span-1 justify-end">
                  <item.icon className="h-7 w-7 transition-transform duration-500 group-hover:rotate-12" strokeWidth={1.5} />
                </span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

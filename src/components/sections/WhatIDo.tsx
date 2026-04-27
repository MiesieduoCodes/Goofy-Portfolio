"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Code2, Gamepad2, Camera, Music } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "High-performance systems, realtime apps, immersive UI, and smooth DX-driven engineering.",
    href: "/services",
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    description:
      "Physics-driven interactions, custom engines, procedural systems, and dynamic gameplay.",
    href: "/game-dev",
  },
  {
    icon: Camera,
    title: "Creative Media",
    description:
      "Cinematic capture, storytelling, color theory, and visual identity for brands & artists.",
    href: "/photography",
  },
  {
    icon: Music,
    title: "Music Production",
    description:
      "Percussive architecture, rhythmic textures, ambient scoring, and digital sound design.",
    href: "/music",
  },
];

// 3D tilt hook -----------------------------------------------------
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [0, 300], [8, -8]);
  const rotateY = useTransform(x, [0, 300], [-8, 8]);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return { ref, rotateX, rotateY, onMove };
}

export function WhatIDo() {
  return (
    <section className="next-section py-28 bg-black relative overflow-hidden">
      {/* ───────── AMBIENT GLOW (Blending with Hero) ───────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[500px] h-[400px] bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[200px]" />
      </div>

      {/* ───────── GRAIN LAYER (Consistency) ───────── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-soft-light bg-[url('/grain.png')] bg-cover" />

      {/* floating particles - Barely visible */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] animate-[pulse_10s_ease-in-out_infinite] bg-[radial-gradient(circle_at_center,white_0%,transparent_40%)]"></div>

      <div className="container-custom relative z-10">
        
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-xl uppercase tracking-wider opacity-70">
            But what do I do...?
          </span>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10"
        >
          {services.map((service) => {
            const { ref, rotateX, rotateY, onMove } = useTilt();

            return (
              <motion.div
                key={service.title}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href={service.href}>
                  <motion.div
                    ref={ref}
                    onMouseMove={onMove}
                    style={{ rotateX, rotateY }}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="
                      relative p-8 rounded-3xl
                      border border-white/10
                      bg-white/[0.02] 
                      backdrop-blur-xl
                      shadow-[inset_0_0_0_0_rgba(255,255,255,0.2)]
                      hover:shadow-[inset_0_0_12px_rgba(255,255,255,0.25)]
                      transition-all duration-500 group
                    "
                  >
                    {/* Glow border - Barely visible */}
                    <span
                      className="
                        absolute inset-0 rounded-3xl pointer-events-none
                        opacity-0 group-hover:opacity-0 
                        transition-opacity duration-100
                        bg-gradient-to-br from-primary/10 to-transparent
                      "
                    />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring" }}
                      className="
                        w-14 h-14 flex items-center justify-center
                        rounded-2xl bg-white/5 border border-white/10
                        mb-6 backdrop-blur-sm
                      "
                    >
                      <service.icon className="w-7 h-7 text-primary" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="font-display text-2xl font-semibold mb-3 tracking-tight">
                      {service.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {/* ───────── TOP FADE (For seamless transition) ───────── */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
    </section>
  );
}
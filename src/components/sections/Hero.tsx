"use client";

import { useEffect } from "react";
import { initHeroWords } from "../../../app/animations/heroWords";
import { motion } from "framer-motion";

export function Hero() {
  useEffect(() => {
    const timer = setTimeout(() => {
      initHeroWords();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">

      {/* ───────── AMBIENT GLOW BACKGROUND ───────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/30 blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 blur-[160px]" />
      </div>

      {/* ───────── GRAIN LAYER ───────── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-soft-light bg-[url('/grain.png')] bg-cover" />

      {/* ───────── VERTICAL DECORATION BARS ───────── */}
      <div className="absolute left-10 top-0 bottom-0 opacity-20 hidden md:block">
        <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      </div>
      <div className="absolute right-10 top-0 bottom-0 opacity-20 hidden md:block">
        <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      </div>

      {/* ───────── LIGHT SWEEP LAYER ───────── */}
      <motion.div
        initial={{ x: "-50%", opacity: 0 }}
        animate={{ x: "200%", opacity: 0.25 }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-white/10 to-transparent blur-xl"
      />

      {/* ───────── MAIN HERO BOX ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="
          relative border border-white/20 bg-white/5 backdrop-blur-xl 
          px-8 md:px-16 py-16 max-w-[1200px] w-full mx-4
          shadow-[0_0_60px_-10px_rgba(255,255,255,0.2)]
        "
      >
        {/* TOP LABEL */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute -top-6 right-10 border border-white/30 bg-black/70 backdrop-blur-xl px-4 py-2 text-xs tracking-widest"
        >
          DIGITAL CREATIVE
        </motion.div>

        {/* HEADLINE */}
        <h1 className="hero-title uppercase font-black leading-none text-4xl md:text-6xl lg:text-7xl tracking-tight">

          <span className="block mb-6 opacity-80">
            Crafting Digital Worlds —
          </span>

          {/* ROTATING WORDS */}
          <span className="dynamic-line block relative h-[1.2em] overflow-hidden">
            <span className="word">Web Experiences</span>
            <span className="word">Interactive Games</span>
            <span className="word">Visual Media</span>
            <span className="word">Sound Design</span>
          </span>
        </h1>

        {/* SUBTEXT GRID */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-white/70 leading-relaxed"
        >
          <p>
            Building immersive interfaces and performance-driven applications.
          </p>
          <p>
            Blending code, motion, and design into interactive experiences.
          </p>
        </motion.div>
      </motion.div>

      {/* ───────── BOTTOM FADE (For seamless transition) ───────── */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
    </section>
  );
}
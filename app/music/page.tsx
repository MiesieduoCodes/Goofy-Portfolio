"use client";

import { motion } from "framer-motion";
import { Headphones, Mic, Music as MusicIcon } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { BigCta, SectionLabel } from "@/components/sections/BigCta";
import { DrumSequencer } from "@/components/drum-sequencer";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const musicProjects = [
  {
    title: "Rhythms of the Niger",
    description: "A fusion project blending traditional Nigerian rhythms with modern electronic production.",
    genre: "World Fusion",
    year: "2024",
    duration: "3:45",
  },
  {
    title: "Urban Pulse",
    description: "Contemporary drum patterns for urban music production featuring complex polyrhythms.",
    genre: "Hip-Hop/R&B",
    year: "2024",
    duration: "4:12",
  },
  {
    title: "Cinematic Landscapes",
    description: "Epic percussion compositions designed for film and game soundtracks.",
    genre: "Cinematic",
    year: "2023",
    duration: "5:30",
  },
];

const services = [
  {
    icon: Mic,
    title: "Session Drumming",
    description: "Professional drum recording for your tracks with various styles and techniques.",
    features: ["Live Recording", "Remote Sessions", "Multiple Genres", "High-Quality Audio"],
  },
  {
    icon: Headphones,
    title: "Music Production",
    description: "Full production services from composition to final mixing and mastering.",
    features: ["Beat Making", "Arrangement", "Mixing", "Mastering"],
  },
  {
    icon: MusicIcon,
    title: "Sound Design",
    description: "Custom sound effects and audio assets for games, films, and multimedia projects.",
    features: ["Game Audio", "Film Scoring", "Sound Effects", "Foley"],
  },
];

const equipment = [
  "DW Collector's Series Drums",
  "Zildjian K Custom Cymbals",
  "Pearl Hardware",
  "Shure SM57 & SM58 Mics",
  "AKG C414 Condenser",
  "Focusrite Scarlett Interface",
  "Pro Tools & Logic Pro X",
  "Superior Drummer 3",
];

// Decorative equaliser bars beside the title
function Equaliser() {
  return (
    <div aria-hidden className="flex h-[8vw] items-end gap-[0.6vw]">
      {[0.5, 0.9, 0.35, 0.75, 0.6, 1, 0.45].map((h, i) => (
        <motion.span
          key={i}
          className="w-[1vw] min-w-[4px] origin-bottom bg-white"
          style={{ height: "100%" }}
          initial={{ scaleY: 0.1 }}
          animate={{ scaleY: [h * 0.3, h, h * 0.5, h * 0.9, h * 0.3] }}
          transition={{ duration: 1.6 + i * 0.13, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

export default function Music() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-6 md:px-10 pt-36 md:pt-44">
        {/* ── Header ── */}
        <section className="pb-20 md:pb-28">
          <SectionLabel index="01">Music</SectionLabel>
          <div className="flex items-end justify-between gap-6">
            <h1 className="text-[16vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-tighter">
              {["Rhythm", "& Sound"].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className={`inline-block font-black ${i === 1 ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)]" : ""}`}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <div className="hidden md:block mb-[1.5vw]">
              <Equaliser />
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
            className="mt-10 max-w-xl text-lg md:text-xl leading-relaxed text-white/50"
          >
            Rhythm is the foundation of all great music. As a drummer and producer, I bring percussive expertise to every
            project — compelling rhythmic landscapes for artists, games and media.
          </motion.p>
        </section>

        {/* ── Groove box ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="02">Make a beat</SectionLabel>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <DrumSequencer />
          </motion.div>
        </section>

        {/* ── Featured projects ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="03">Featured projects</SectionLabel>
          <ul>
            {musicProjects.map((project, i) => (
              <motion.li
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.06 }}
                className="group grid grid-cols-12 items-center gap-4 border-t border-white/10 py-6 md:py-10 last:border-b"
              >
                <span className="col-span-2 md:col-span-1 font-mono text-xs text-white/30">{String(i + 1).padStart(2, "0")}</span>
                <div className="col-span-10 md:col-span-6">
                  <h3 className="text-2xl md:text-5xl font-black uppercase leading-none tracking-tighter transition-transform duration-500 group-hover:translate-x-3">
                    {project.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm text-white/50">{project.description}</p>
                </div>
                <span className="col-span-6 col-start-3 md:col-start-auto md:col-span-3 text-xs uppercase tracking-[0.2em] text-white/40">
                  {project.genre} · {project.year}
                </span>
                <span className="col-span-4 md:col-span-2 text-right font-mono text-sm text-white/60">{project.duration}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* ── Services ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="04">Services</SectionLabel>
          <div className="grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
                className="bg-black p-6 md:p-10"
              >
                <service.icon className="h-7 w-7 text-white/80" strokeWidth={1.5} />
                <h3 className="mt-10 text-3xl font-black uppercase tracking-tighter">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{service.description}</p>
                <ul className="mt-6 space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/60">
                      <span className="h-px w-4 bg-white/40" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Gear ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="05">Studio gear</SectionLabel>
          <ul className="grid gap-x-16 md:grid-cols-2">
            {equipment.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.06 }}
                className="flex items-baseline justify-between border-b border-white/10 py-5"
              >
                <span className="text-lg md:text-xl font-semibold">{item}</span>
                <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, "0")}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        <BigCta eyebrow="Need drums, production or sound?" title="Book a session" />
      </main>
      <Footer />
    </div>
  );
}

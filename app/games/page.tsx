"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { DisciplinePage } from "@/components/discipline-page"
import { SectionLabel } from "@/components/sections/BigCta"

// Three.js needs `window`, so the demo only loads in the browser
const ExploreWorld = dynamic(() => import("@/components/explore-world"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-white/40">
      Loading game…
    </div>
  ),
})

const gamesCategory = () => "games" as const

export default function GamesPage() {
  return (
    <DisciplinePage
      label="Game development"
      titleLines={["Game", "Development"]}
      intro="Immersive, interactive experiences built with modern technology — from mobile games to 3D worlds, bringing creative visions to life through code."
      collectionName="games"
      categorize={gamesCategory}
      category="games"
      toolsCategory="games"
      extra={
        <section id="showcase" className="pb-28 md:pb-40">
          <SectionLabel index="—">Interactive showcase</SectionLabel>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="relative min-h-[450px] w-full rounded-sm border border-white/10 bg-neutral-950 p-2"
          >
            <ExploreWorld />
          </motion.div>
        </section>
      }
      process={[
        { title: "Concept & Design", text: "Engaging mechanics, compelling narratives and intuitive player experiences." },
        { title: "Prototyping", text: "Rapid prototypes to test core mechanics and find the fun early." },
        { title: "Asset Creation", text: "Models, animation, sound and music that bring the world to life." },
        { title: "Development", text: "Features built and tested rigorously for a polished final product." },
      ]}
      empty={{ title: "Games loading", text: "New game projects are on the way." }}
      cta={{ eyebrow: "Ready to create your game?", title: "Press start" }}
    />
  )
}

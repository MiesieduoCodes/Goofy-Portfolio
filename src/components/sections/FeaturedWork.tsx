"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/sections/BigCta";
import {
  CATEGORY_LABEL,
  EASE_OUT,
  ProjectImage,
  ProjectPanel,
  byNewest,
  toProject,
  websiteCategory,
  yearOf,
  type Category,
  type Project,
} from "@/components/projects";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const MAX_FEATURED = 5;

function FeaturedCard({ project, index, large, onOpen }: { project: Project; index: number; large?: boolean; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  // Image drifts inside its frame as the card scrolls past
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: EASE_OUT }}
      className="group block w-full rounded-none bg-transparent p-0 text-left text-white"
    >
      <div className={`relative overflow-hidden rounded-sm bg-white/[0.03] ${large ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[4/3]"}`}>
        <motion.div style={{ y }} className="absolute -inset-[8%]">
          <ProjectImage
            src={project.image}
            alt={project.title}
            sizes={large ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
          />
        </motion.div>
        <span className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className={`font-black uppercase leading-none tracking-tighter ${large ? "text-4xl md:text-7xl" : "text-3xl md:text-4xl"}`}>
            {project.title}
          </h3>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/40">
            {[CATEGORY_LABEL[project.category], yearOf(project), ...project.tags.slice(0, 2)].filter(Boolean).join(" · ")}
          </p>
        </div>
        <span className="font-mono text-xs text-white/30">{String(index + 1).padStart(2, "0")}</span>
      </div>
    </motion.button>
  );
}

export function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const closePanel = useCallback(() => setSelected(null), []);

  // Anything marked "Featured" in the admin
  useEffect(() => {
    const sources: Record<string, Project[]> = { websites: [], games: [], photos: [] };
    const loaded = new Set<string>();
    const listen = (name: string, categorize: (data: any) => Category) =>
      onSnapshot(
        query(collection(db, name), where("featured", "==", true)),
        (snap) => {
          sources[name] = snap.docs.map((doc) => toProject(doc.id, doc.data(), categorize(doc.data())));
          loaded.add(name);
          setProjects([...sources.websites, ...sources.games, ...sources.photos].sort(byNewest).slice(0, MAX_FEATURED));
          if (loaded.size === 3) setLoading(false);
        },
        (error) => {
          console.error(`Error fetching featured ${name}:`, error);
          loaded.add(name);
          if (loaded.size === 3) setLoading(false);
        }
      );
    const unsubs = [listen("websites", websiteCategory), listen("games", () => "games"), listen("photos", () => "photography")];
    return () => unsubs.forEach((u) => u());
  }, []);

  const [first, ...rest] = projects;

  return (
    <section className="bg-black px-6 pb-28 md:px-10 md:pb-40">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-6">
        <SectionLabel index="03">Selected work</SectionLabel>
        <Link
          href="/work"
          className="group mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white"
        >
          View all work
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {loading ? (
        <div className="aspect-[21/9] animate-pulse rounded-sm bg-white/[0.03]" />
      ) : !first ? (
        <div className="border-y border-white/10 py-24 text-center">
          <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white/20">Featured work soon</p>
          <p className="mt-4 text-sm text-white/40">Meanwhile, browse everything on the work page.</p>
        </div>
      ) : (
        <div className="space-y-16 md:space-y-24">
          <FeaturedCard project={first} index={0} large onOpen={() => setSelected(first)} />
          {rest.length > 0 && (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
              {rest.map((project, i) => (
                <div key={project.id} className={i % 2 === 1 ? "md:mt-32" : ""}>
                  <FeaturedCard project={project} index={i + 1} onOpen={() => setSelected(project)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>{selected && <ProjectPanel project={selected} onClose={closePanel} />}</AnimatePresence>
    </section>
  );
}

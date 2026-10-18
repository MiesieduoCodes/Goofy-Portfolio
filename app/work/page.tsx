"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { BigCta, SectionLabel } from "@/components/sections/BigCta";
import {
  CATEGORY_LABEL,
  EASE_OUT,
  EmptyProjects,
  ProjectImage,
  ProjectList,
  ProjectListSkeleton,
  ProjectPanel,
  byNewest,
  toProject,
  websiteCategory,
  type Category,
  type Project,
} from "@/components/projects";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

const FILTERS: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "web", label: "Websites" },
  { key: "mobile", label: "Mobile" },
  { key: "games", label: "Games" },
  { key: "photography", label: "Photography" },
];

export default function Work() {
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [view, setView] = useState<"list" | "grid">("list");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const closePanel = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const sources: Record<string, Project[]> = { websites: [], games: [], photos: [] };
    const loaded = new Set<string>();

    const listen = (collectionName: string, categorize: (data: any) => Category) =>
      onSnapshot(
        query(collection(db, collectionName)),
        (snap) => {
          sources[collectionName] = snap.docs.map((doc) => toProject(doc.id, doc.data(), categorize(doc.data())));
          loaded.add(collectionName);
          setProjects([...sources.websites, ...sources.games, ...sources.photos].sort(byNewest));
          if (loaded.size === 3) setLoading(false);
        },
        (error) => {
          console.error(`Error fetching ${collectionName}:`, error);
          loaded.add(collectionName);
          if (loaded.size === 3) setLoading(false);
        }
      );

    const unsubs = [
      listen("websites", websiteCategory),
      listen("games", () => "games"),
      listen("photos", () => "photography"),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const counts = useMemo(() => {
    const c = { all: projects.length, web: 0, mobile: 0, games: 0, photography: 0 };
    projects.forEach((p) => c[p.category]++);
    return c;
  }, [projects]);

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-6 md:px-10 pt-36 md:pt-44">
        {/* ── Header ── */}
        <section className="pb-16 md:pb-24">
          <SectionLabel index="01">Selected work</SectionLabel>
          <div className="flex items-start gap-4">
            <h1 className="overflow-hidden text-[22vw] md:text-[16vw] font-black uppercase leading-[0.8] tracking-tighter">
              <motion.span
                className="inline-block font-black"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
              >
                Work
              </motion.span>
            </h1>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-[2vw] font-mono text-lg md:text-3xl text-white/40"
            >
              ({String(counts.all).padStart(2, "0")})
            </motion.span>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
            className="mt-8 max-w-xl text-lg text-white/50"
          >
            Websites, games and photography — built with precision, performance and a touch of creativity.
          </motion.p>
        </section>

        {/* ── Filters + view toggle ── */}
        <div className="sticky top-24 z-30 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 bg-black/80 px-6 py-4 backdrop-blur-xl md:-mx-10 md:px-10">
          <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-x-6 gap-y-2">
            {FILTERS.filter((f) => f.key !== "mobile" || counts.mobile > 0).map((f) => (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={`relative rounded-none bg-transparent px-0 py-1 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
                  filter === f.key ? "text-white" : "text-white/40 hover:text-white/80"
                }`}
              >
                {f.label}
                <sup className="ml-1 font-mono text-[9px] text-white/40">{counts[f.key]}</sup>
                {filter === f.key && (
                  <motion.span layoutId="work-filter" className="absolute -bottom-[17px] left-0 right-0 h-px bg-white" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/15 p-1">
            {(["list", "grid"] as const).map((v) => {
              const Icon = v === "list" ? List : LayoutGrid;
              return (
                <button
                  key={v}
                  type="button"
                  aria-label={`${v} view`}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full p-0 transition-colors ${
                    view === v ? "bg-white text-black" : "bg-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Projects ── */}
        <section className="pb-28 md:pb-40">
          {loading ? (
            <ProjectListSkeleton />
          ) : visible.length === 0 ? (
            <EmptyProjects />
          ) : view === "list" ? (
            <ProjectList projects={visible} onSelect={setSelected} previewDisabled={!!selected} />
          ) : (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
              {visible.map((project, i) => (
                <motion.button
                  key={project.id}
                  type="button"
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: Math.min(i, 8) * 0.05 }}
                  onClick={() => setSelected(project)}
                  className={`group block rounded-none bg-transparent p-0 text-left text-white ${i % 2 === 1 ? "md:mt-24" : ""}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white/[0.03]">
                    <ProjectImage
                      src={project.image}
                      alt={project.title}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                      {CATEGORY_LABEL[project.category]}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{project.title}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
                        {project.tags.slice(0, 3).join(" · ") || "—"}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>

        <BigCta eyebrow="Have a project in mind?" />
      </main>
      <Footer />

      <AnimatePresence>{selected && <ProjectPanel project={selected} onClose={closePanel} />}</AnimatePresence>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { BigCta, SectionLabel } from "@/components/sections/BigCta";
import {
  EASE_OUT,
  EmptyProjects,
  ProjectList,
  ProjectListSkeleton,
  ProjectPanel,
  byNewest,
  toProject,
  type Category,
  type Project,
} from "@/components/projects";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

interface Step {
  title: string;
  text: string;
}

interface Tool {
  id: string;
  name: string;
  level?: number;
}

export interface DisciplinePageProps {
  label: string;
  titleLines: string[];
  intro: string;
  /** Firestore collection holding this page's projects */
  collectionName: "websites" | "games";
  /** Which category each document belongs to; only `category` projects are shown */
  categorize: (data: any) => Category;
  category: Category;
  /** `tools` collection category for the skills section */
  toolsCategory: string;
  capabilities?: Step[];
  process: Step[];
  /** Extra section rendered after the projects (e.g. an interactive demo) */
  extra?: React.ReactNode;
  empty: { title: string; text: string };
  cta: { eyebrow: string; title: string };
}

// Shared layout for the Web, Mobile and Game Dev pages
export function DisciplinePage(props: DisciplinePageProps) {
  const { label, titleLines, intro, collectionName, categorize, category, toolsCategory, capabilities, process, extra, empty, cta } = props;
  const [projects, setProjects] = useState<Project[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const closePanel = useCallback(() => setSelected(null), []);

  useEffect(() => {
    const unsubProjects = onSnapshot(
      query(collection(db, collectionName)),
      (snap) => {
        setProjects(
          snap.docs
            .map((doc) => toProject(doc.id, doc.data(), categorize(doc.data())))
            .filter((p) => p.category === category)
            .sort(byNewest)
        );
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        setLoading(false);
      }
    );
    const unsubTools = onSnapshot(
      query(collection(db, "tools")),
      (snap) =>
        setTools(
          snap.docs
            .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
            .filter((t) => t.category === toolsCategory)
            .sort((a, b) => (b.level || 0) - (a.level || 0))
        ),
      (error) => console.error("Error fetching tools:", error)
    );
    return () => {
      unsubProjects();
      unsubTools();
    };
    // categorize is a stable module-level function on every page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, category, toolsCategory]);

  let section = 1;
  const next = () => String(++section).padStart(2, "0");

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-6 md:px-10 pt-36 md:pt-44">
        {/* ── Header ── */}
        <section className="pb-20 md:pb-28">
          <SectionLabel index="01">{label}</SectionLabel>
          <h1 className="text-[16vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-tighter">
            {titleLines.map((line, i) => (
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
            className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-xl text-lg md:text-xl leading-relaxed text-white/50">{intro}</p>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              {loading ? "—" : `${String(projects.length).padStart(2, "0")} projects`}
            </span>
          </motion.div>
        </section>

        {/* ── Projects ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index={next()}>Selected projects</SectionLabel>
          {loading ? (
            <ProjectListSkeleton />
          ) : projects.length === 0 ? (
            <EmptyProjects title={empty.title} text={empty.text} />
          ) : (
            <ProjectList projects={projects} onSelect={setSelected} previewDisabled={!!selected} />
          )}
        </section>

        {extra}

        {/* ── Capabilities ── */}
        {capabilities && (
          <section className="pb-28 md:pb-40">
            <SectionLabel index={next()}>Capabilities</SectionLabel>
            <div className="grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-2">
              {capabilities.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                  className="bg-black p-6 md:p-10"
                >
                  <span className="font-mono text-xs text-white/30">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-3xl md:text-4xl font-black uppercase tracking-tighter">{item.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Toolkit (from the admin's Tools & Skills) ── */}
        {tools.length > 0 && (
          <section className="pb-28 md:pb-40">
            <SectionLabel index={next()}>Toolkit</SectionLabel>
            <ul className="grid gap-x-16 md:grid-cols-2">
              {tools.map((tool, i) => (
                <li key={tool.id} className="border-b border-white/10 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg md:text-xl font-semibold">{tool.name}</span>
                    {typeof tool.level === "number" && <span className="font-mono text-xs text-white/40">{tool.level}%</span>}
                  </div>
                  {typeof tool.level === "number" && (
                    <div className="mt-3 h-px w-full bg-white/10">
                      <motion.div
                        className="h-full origin-left bg-white"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: Math.min(100, Math.max(0, tool.level)) / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: EASE_OUT, delay: (i % 2) * 0.1 }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Process ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index={next()}>Process</SectionLabel>
          <div className="grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-4">
            {process.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
                className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden bg-black p-6 md:p-8"
              >
                <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
                <span className="relative font-mono text-xs text-white/40 transition-colors duration-500 group-hover:text-black/50">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative transition-colors duration-500 group-hover:text-black">
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-black/70">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <BigCta eyebrow={cta.eyebrow} title={cta.title} />
      </main>
      <Footer />

      <AnimatePresence>{selected && <ProjectPanel project={selected} onClose={closePanel} />}</AnimatePresence>
    </div>
  );
}

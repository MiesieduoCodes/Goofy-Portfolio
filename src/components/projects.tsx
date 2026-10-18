"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { canOptimizeImage } from "@/lib/utils";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Data helpers live in lib so they can be tested without the UI
export {
  CATEGORY_LABEL,
  byNewest,
  normalizeTags,
  toProject,
  websiteCategory,
  yearOf,
  type Category,
  type Project,
} from "@/lib/project-utils";
import { CATEGORY_LABEL, yearOf, type Project } from "@/lib/project-utils";

export function ProjectImage({ src, alt, sizes, className }: { src?: string; alt: string; sizes: string; className?: string }) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03] text-[10px] uppercase tracking-[0.3em] text-white/30">
        No image
      </div>
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} unoptimized={!canOptimizeImage(src)} className={className} />;
}

// Slide-in panel with the full project
export function ProjectPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      html.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const gallery = project.images?.length ? project.images : project.image ? [project.image] : [];

  return (
    <motion.div className="fixed inset-0 z-[1050]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button type="button" aria-label="Close project" onClick={onClose} className="absolute inset-0 h-full w-full cursor-default rounded-none bg-black/70 p-0 backdrop-blur-sm" />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        data-lenis-prevent
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="absolute right-0 top-0 h-full w-full overflow-y-auto border-l border-white/10 bg-black md:w-[min(760px,70vw)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-5 backdrop-blur-xl md:px-10">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
            {CATEGORY_LABEL[project.category]}
            {yearOf(project) ? ` · ${yearOf(project)}` : ""}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            autoFocus
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-transparent p-0 text-white transition-colors hover:bg-white hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-10 md:px-10 md:py-14">
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter"
          >
            {project.title}
          </motion.h2>

          {project.description && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.4 }}
              className="mt-8 text-lg leading-relaxed text-white/60 whitespace-pre-line"
            >
              {project.description}
            </motion.p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/60">
                {tag}
              </span>
            ))}
          </div>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black"
            >
              {project.category === "games" ? "Play / view" : "Visit live site"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          )}

          <div className="mt-14 space-y-6">
            {gallery.map((src, i) => (
              <motion.div
                key={src + i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.45 + i * 0.1 }}
                className="relative aspect-[16/10] overflow-hidden rounded-sm border border-white/10 bg-white/[0.03]"
              >
                <ProjectImage src={src} alt={`${project.title} — image ${i + 1}`} sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

// Big numbered rows; hovering one shows a floating image preview that trails the cursor
export function ProjectList({
  projects,
  onSelect,
  previewDisabled,
}: {
  projects: Project[];
  onSelect: (project: Project) => void;
  previewDisabled?: boolean;
}) {
  const [hovered, setHovered] = useState<Project | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const previewX = useSpring(mouseX, { stiffness: 220, damping: 28 });
  const previewY = useSpring(mouseY, { stiffness: 220, damping: 28 });

  return (
    <>
      <ul
        onMouseMove={(e) => {
          mouseX.set(e.clientX);
          mouseY.set(e.clientY);
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {projects.map((project, i) => (
          <motion.li
            key={project.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: Math.min(i, 8) * 0.04 }}
            className="border-b border-white/10 first:border-t"
          >
            <button
              type="button"
              onClick={() => {
                setHovered(null);
                onSelect(project);
              }}
              onMouseEnter={() => setHovered(project)}
              onFocus={() => setHovered(null)}
              className="group grid w-full grid-cols-12 items-center gap-4 rounded-none bg-transparent px-0 py-6 md:py-10 text-left text-white"
            >
              <span className="col-span-2 md:col-span-1 font-mono text-xs text-white/30">{String(i + 1).padStart(2, "0")}</span>
              {/* Thumbnail on touch screens, where there is no hover preview */}
              <span className="relative col-span-3 aspect-[4/3] overflow-hidden rounded-sm md:hidden">
                <ProjectImage src={project.image} alt="" sizes="30vw" className="object-cover grayscale" />
              </span>
              <span className="col-span-7 md:col-span-6 text-2xl md:text-6xl font-black uppercase leading-none tracking-tighter text-white md:text-white/80 transition-all duration-500 group-hover:translate-x-3 md:group-hover:text-white">
                {project.title}
              </span>
              <span className="hidden md:block md:col-span-3 text-xs uppercase tracking-[0.2em] text-white/40">
                {project.tags.slice(0, 3).join(" · ") || CATEGORY_LABEL[project.category]}
              </span>
              <span className="hidden md:flex md:col-span-2 items-center justify-end gap-4 text-xs uppercase tracking-[0.2em] text-white/40">
                {CATEGORY_LABEL[project.category]}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-white group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </button>
          </motion.li>
        ))}
      </ul>

      {/* Floating hover preview (mouse only) */}
      <motion.div aria-hidden style={{ x: previewX, y: previewY }} className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {hovered && !previewDisabled && (
              <motion.div
                key={hovered.id}
                initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 3 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="relative h-[220px] w-[320px] overflow-hidden rounded-sm border border-white/10 bg-neutral-900 shadow-2xl"
              >
                <ProjectImage src={hovered.image} alt="" sizes="320px" className="object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

export function ProjectListSkeleton() {
  return (
    <div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-24 md:h-32 animate-pulse border-b border-white/10 bg-white/[0.02]" />
      ))}
    </div>
  );
}

export function EmptyProjects({ title = "Nothing here yet", text = "New work in this category is on the way." }: { title?: string; text?: string }) {
  return (
    <div className="border-y border-white/10 py-24 text-center">
      <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white/20">{title}</p>
      <p className="mt-4 text-sm text-white/40">{text}</p>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, MapPin, X } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { BigCta, SectionLabel } from "@/components/sections/BigCta";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface Photo {
  id: string;
  title?: string;
  image?: string;
  category?: string;
  location?: string;
  description?: string;
  date?: string;
}

const equipment = [
  { title: "Cameras", items: ["Sony Alpha A7R IV", "Sony Alpha A7 III", "Sony RX100 VII"] },
  { title: "Lenses", items: ["Sony 24-70mm f/2.8 GM", "Sony 70-200mm f/2.8 GM", "Sony 85mm f/1.4 GM"] },
  { title: "Accessories", items: ["DJI Ronin Gimbal", "Profoto Lighting", "Manfrotto Tripods"] },
];

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

// Full-screen viewer; arrow keys / buttons step through the current selection
function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const go = useCallback((dir: number) => onIndex((index + dir + photos.length) % photos.length), [index, onIndex, photos.length]);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [go, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || "Photograph"}
      data-lenis-prevent
      className="fixed inset-0 z-[1050] flex flex-col bg-black/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5 md:px-10">
        <span className="font-mono text-xs text-white/50">
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
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

      {/* Image */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24">
        <AnimatePresence mode="wait">
          <motion.img
            key={photo.id}
            src={photo.image}
            alt={photo.title || "Photograph"}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="max-h-full max-w-full object-contain"
          />
        </AnimatePresence>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-2 md:left-8 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 p-0 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-2 md:right-8 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 p-0 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      <div className="flex flex-col gap-3 px-6 py-6 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">{photo.title || "Untitled"}</h2>
          {photo.description && <p className="mt-2 max-w-2xl text-sm text-white/50">{photo.description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-white/50">
          {photo.category && <span className="rounded-full border border-white/20 px-3 py-1">{titleCase(photo.category)}</span>}
          {photo.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> {photo.location}
            </span>
          )}
          {photo.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> {photo.date}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Photography() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "photos"), orderBy("createdAt", "desc")),
      (snapshot) => {
        setPhotos(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Photo, "id">) })).filter((p) => p.image));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching photos:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filters come from the categories actually used, so they always match
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    photos.forEach((p) => {
      const c = (p.category || "other").toLowerCase();
      counts.set(c, (counts.get(c) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [photos]);

  const visible = filter === "all" ? photos : photos.filter((p) => (p.category || "other").toLowerCase() === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-6 md:px-10 pt-36 md:pt-44">
        {/* ── Header ── */}
        <section className="pb-16 md:pb-24">
          <SectionLabel index="01">Photography</SectionLabel>
          <h1 className="text-[16vw] md:text-[11vw] font-black uppercase leading-[0.82] tracking-tighter">
            {["Through", "The Lens"].map((line, i) => (
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
            <p className="max-w-xl text-lg md:text-xl leading-relaxed text-white/50">
              Capturing the essence of moments, places and stories — nature, wildlife, landscape and architecture, with a
              focus on the unique beauty of Nigeria and beyond.
            </p>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              {loading ? "—" : `${String(photos.length).padStart(2, "0")} frames`}
            </span>
          </motion.div>
        </section>

        {/* ── Filters ── */}
        {categories.length > 1 && (
          <div className="sticky top-24 z-30 -mx-6 mb-8 flex flex-wrap gap-x-6 gap-y-2 border-y border-white/10 bg-black/80 px-6 py-4 backdrop-blur-xl md:-mx-10 md:px-10" role="tablist" aria-label="Filter photos">
            {[["all", photos.length] as [string, number], ...categories].map(([key, count]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={`relative rounded-none bg-transparent px-0 py-1 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
                  filter === key ? "text-white" : "text-white/40 hover:text-white/80"
                }`}
              >
                {key === "all" ? "All" : titleCase(key)}
                <sup className="ml-1 font-mono text-[9px] text-white/40">{count}</sup>
                {filter === key && <motion.span layoutId="photo-filter" className="absolute -bottom-[17px] left-0 right-0 h-px bg-white" />}
              </button>
            ))}
          </div>
        )}

        {/* ── Gallery ── */}
        <section className="pb-28 md:pb-40">
          {loading ? (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {[320, 220, 400, 260, 340, 240].map((h, i) => (
                <div key={i} className="mb-4 animate-pulse break-inside-avoid rounded-sm bg-white/[0.04]" style={{ height: h }} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="border-y border-white/10 py-24 text-center">
              <p className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white/20">Developing…</p>
              <p className="mt-4 text-sm text-white/40">New photographs are on the way.</p>
            </div>
          ) : (
            // Re-mount on filter change so the new set animates in
            <div key={filter} className="columns-1 gap-4 sm:columns-2 lg:columns-3">
                {visible.map((photo, i) => (
                  <motion.button
                    key={photo.id}
                    type="button"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: Math.min(i, 9) * 0.04 }}
                    onClick={() => setOpen(i)}
                    className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm bg-white/[0.03] p-0 text-left"
                  >
                    {/* Natural aspect ratio, so a plain lazy <img> */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.image}
                      alt={photo.title || "Photograph"}
                      loading="lazy"
                      decoding="async"
                      className="block w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="text-lg font-black uppercase tracking-tighter text-white">{photo.title || "Untitled"}</span>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                        {[photo.category && titleCase(photo.category), photo.location].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                  </motion.button>
                ))}
            </div>
          )}
        </section>

        {/* ── Equipment ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="02">Equipment</SectionLabel>
          <div className="grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-3">
            {equipment.map((group, i) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-black p-6 md:p-8"
              >
                <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/40">{group.title}</p>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm md:text-base font-semibold">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <BigCta eyebrow="Licensing & commissions" title="Book a shoot" />
      </main>
      <Footer />

      <AnimatePresence>
        {open !== null && visible[open] && <Lightbox photos={visible} index={open} onIndex={setOpen} onClose={close} />}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Camera, Code, Gamepad2, Music, Plus } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import PhotoCarousel from "@/components/photo-carousel";
import { BigCta, SectionLabel } from "@/components/sections/BigCta";
import { LOCATIONS, PlaceTime } from "@/components/world-clock";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const STATEMENT =
  "I design and build immersive digital experiences at the intersection of code, visuals and sound — systems that feel alive.";

const disciplines = [
  { title: "Code", icon: Code, text: "Scalable web apps with React, Next.js and TypeScript." },
  { title: "Games", icon: Gamepad2, text: "Gameplay systems and interactive worlds in Unity & C#." },
  { title: "Photography", icon: Camera, text: "Nature and portrait work through a Sony Alpha lens." },
  { title: "Music", icon: Music, text: "Drumming, rhythm and sound design." },
];

const skills = {
  development: ["React / Next.js", "C# / Unity", "Tailwind CSS"],
  creative: ["Adobe Creative Cloud", "Figma", "Davinci Resolve"],
  gear: ["Sony Alpha Series", "Prime Lenses", "DW Drums & Zildjian"],
  management: ["Project Leadership", "Public Speaking", "Technical Writing"],
};

interface Experience {
  id: string;
  role: string;
  company?: string;
  period?: string;
  startYear?: string;
  endYear?: string | null;
  isPresent?: boolean;
  description?: string;
  details?: string;
}

// Shown until experiences are added in the admin panel
const fallbackExperiences: Experience[] = [
  { id: "f1", role: "Game Developer", description: "Unity & C# Systems", startYear: "2024", isPresent: true },
  { id: "f2", role: "Creative Director", description: "Media Production", startYear: "2022" },
  { id: "f3", role: "Fullstack Engineer", description: "React Architect", startYear: "2020" },
];

const periodOf = (e: Experience) =>
  e.period || [e.startYear, e.isPresent ? "Present" : e.endYear].filter(Boolean).join(" — ");

function RevealWord({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block font-semibold">
      {word}
    </motion.span>
  );
}

// Big statement that lights up word by word as it scrolls through the viewport
function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="flex flex-wrap text-3xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
      {words.map((word, i) => (
        <RevealWord key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </p>
  );
}

function ExperienceRow({ exp, index }: { exp: Experience; index: number }) {
  const [open, setOpen] = useState(false);
  const hasDetails = !!exp.details;

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.05 }}
      className="border-t border-white/10 last:border-b"
    >
      <button
        type="button"
        onClick={() => hasDetails && setOpen((o) => !o)}
        aria-expanded={hasDetails ? open : undefined}
        className={`group grid w-full grid-cols-12 items-center gap-4 rounded-none bg-transparent px-0 py-6 md:py-8 text-left text-white transition-colors ${
          hasDetails ? "cursor-pointer hover:bg-white/[0.03]" : "cursor-default"
        }`}
      >
        <span className="col-span-12 md:col-span-3 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
          {periodOf(exp)}
          {exp.isPresent && (
            <span className="ml-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2 py-0.5 text-[9px] text-white/70">
              <span className="h-1 w-1 rounded-full bg-white" /> Now
            </span>
          )}
        </span>
        <span className="col-span-10 md:col-span-5 text-2xl md:text-4xl font-black uppercase tracking-tighter transition-transform duration-500 group-hover:translate-x-2">
          {exp.role}
        </span>
        <span className="col-span-12 md:col-span-3 order-last md:order-none text-sm text-white/50">
          {[exp.company, exp.description].filter(Boolean).join(" · ")}
        </span>
        <span className="col-span-2 md:col-span-1 flex justify-end">
          {hasDetails && (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-white">
              <Plus className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
            </span>
          )}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-8 text-sm leading-relaxed text-white/60 md:ml-[25%] whitespace-pre-line">{exp.details}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function About() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: portraitProgress } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const portraitY = useTransform(portraitProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "experiences")),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Experience, "id">) }));
        // Newest first
        data.sort((a, b) => (parseInt(b.startYear || "") || 0) - (parseInt(a.startYear || "") || 0));
        setExperiences(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching experiences:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const timeline = experiences.length > 0 ? experiences : fallbackExperiences;

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-6 md:px-10 pt-36 md:pt-44">
        {/* ── Statement ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="01">About</SectionLabel>
          <h1 className="sr-only">About Miesieduo Veria</h1>
          <ScrollRevealText text={STATEMENT} />
        </section>

        {/* ── Portrait + bio ── */}
        <section className="grid gap-12 pb-28 md:grid-cols-12 md:gap-16 md:pb-40">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <motion.div
                ref={portraitRef}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                whileInView={{ clipPath: "inset(0% 0 0 0)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-white/5"
              >
                <motion.div style={{ y: portraitY }} className="absolute -inset-[8%]">
                  <Image
                    src="/Miesieduoveria.png"
                    alt="Portrait of Miesieduo Veria"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-[50%_25%] grayscale contrast-110 transition-all duration-700 group-hover:grayscale-0"
                  />
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-5 text-[10px] uppercase tracking-[0.3em] text-white/70">
                  <span>Miesieduo Veria</span>
                  <span>Portrait — {new Date().getFullYear()}</span>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              className="space-y-6 text-lg md:text-2xl leading-relaxed text-white/70"
            >
              <p>
                I&apos;m a multi-disciplinary creative from Nigeria. By day I engineer web apps and game systems; the
                rest of the time I&apos;m behind a camera or a drum kit.
              </p>
              <p>
                I blend engineering with creativity — performance-driven code, motion and design — to craft systems
                that <span className="font-semibold text-white">feel alive</span>.
              </p>
            </motion.div>

            {/* Quick facts */}
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10">
              {[
                { term: "Based in", value: LOCATIONS.home.label },
                {
                  term: "Currently",
                  value: (
                    <>
                      {LOCATIONS.current.label} · <PlaceTime timeZone={LOCATIONS.current.timeZone} />
                    </>
                  ),
                },
                { term: "Focus", value: "Web · Games · Photo · Music" },
                { term: "Status", value: `Available — ${new Date().getFullYear()}` },
              ].map((fact) => (
                <div key={fact.term} className="bg-black p-5 md:p-6">
                  <dt className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/40">{fact.term}</dt>
                  <dd className="text-sm md:text-base font-semibold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Disciplines ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="02">Disciplines</SectionLabel>
          <ul>
            {disciplines.map((item, i) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.08 }}
                className="group relative border-t border-white/10 last:border-b overflow-hidden"
              >
                {/* White fill that wipes up on hover */}
                <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
                <div className="relative grid grid-cols-12 items-center gap-4 py-6 md:py-10 transition-colors duration-500 group-hover:text-black">
                  <span className="col-span-2 md:col-span-1 font-mono text-xs text-white/40 group-hover:text-black/50">0{i + 1}</span>
                  <span className="col-span-10 md:col-span-6 text-4xl md:text-7xl font-black uppercase tracking-tighter">{item.title}</span>
                  <span className="col-span-10 col-start-3 md:col-start-auto md:col-span-4 text-sm text-white/50 group-hover:text-black/70">{item.text}</span>
                  <item.icon className="hidden md:block col-span-1 h-7 w-7 justify-self-end transition-transform duration-500 group-hover:rotate-12" />
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* ── Skills ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="03">Toolkit</SectionLabel>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-4">
            {Object.entries(skills).map(([category, items], i) => (
              <motion.div
                key={category}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-black p-6 md:p-8"
              >
                <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/40">{category}</p>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="text-sm md:text-base font-semibold">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="04">Experience</SectionLabel>
          {loading ? (
            <div className="space-y-px">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 animate-pulse border-t border-white/10 bg-white/[0.02]" />
              ))}
            </div>
          ) : (
            <ul>
              {timeline.map((exp, i) => (
                <ExperienceRow key={exp.id} exp={exp} index={i} />
              ))}
            </ul>
          )}
        </section>

        {/* ── Through my lens ── */}
        <section className="pb-28 md:pb-40">
          <SectionLabel index="05">Through my lens</SectionLabel>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.1, ease: EASE_OUT }}
            className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm"
          >
            <PhotoCarousel />
          </motion.div>
          <div className="mt-4 flex justify-end">
            <Link
              href="/photography"
              className="group flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors"
            >
              Full gallery
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        <BigCta />
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { INTRO_DONE_EVENT, isIntroDone } from "@/lib/intro";
import { LOCATIONS, PlaceTime } from "@/components/world-clock";

const NAME_LINES = ["Miesieduo", "Veria."];
const ROLES = ["Web Experiences", "Interactive Games", "Visual Media", "Sound Design"];
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// True once the intro overlay starts revealing the page
function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (isIntroDone()) {
      setDone(true);
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    // Fallback in case the intro never mounts
    const fallback = setTimeout(onDone, 4500);
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, onDone);
      clearTimeout(fallback);
    };
  }, []);
  return done;
}

function RollingRole() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-flex h-[1.15em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ROLES[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="inline-block font-semibold text-white"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const ready = useIntroDone();

  // Cursor spotlight
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const spotX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const spotY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${spotX}px ${spotY}px, rgba(255,255,255,0.07), transparent 70%)`;

  // Drift the name up and fade it as the hero scrolls away
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const detailsY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Base delay so letters rise while the intro's columns slide away
  const d = 0.45;

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative min-h-[100svh] overflow-hidden bg-black text-white"
    >
      {/* Column guides, echoing the intro's six panels */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex px-6 md:px-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 border-l border-white/[0.05] last:border-r origin-top"
            initial={{ scaleY: 0 }}
            animate={ready ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: d + i * 0.06 }}
          />
        ))}
      </div>

      {/* Cursor spotlight */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: spotlight }} />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 md:px-10 pt-32 md:pt-36 pb-10">
        {/* Top meta row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: d + 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50"
        >
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Available for work
          </span>
          <span className="hidden sm:inline">Creative Developer ✦ Photographer ✦ Drummer</span>
          <span>
            {LOCATIONS.current.label} · <PlaceTime timeZone={LOCATIONS.current.timeZone} />
          </span>
        </motion.div>

        {/* Giant name */}
        <motion.h1 style={{ y: nameY, opacity: nameOpacity }} className="my-12 select-none">
          <span className="sr-only">Miesieduo Veria — creative developer</span>
          {NAME_LINES.map((line, lineIndex) => (
            <span key={line} aria-hidden className="flex items-end overflow-hidden leading-[0.85]">
              <span className="flex text-[15vw] md:text-[11vw] font-black uppercase tracking-tighter">
                {line.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block font-black"
                    initial={{ y: "110%", rotate: 8 }}
                    animate={ready ? { y: "0%", rotate: 0 } : {}}
                    transition={{ duration: 1, ease: EASE_OUT, delay: d + lineIndex * 0.2 + i * 0.035 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>

              {/* Portrait chip set into the second line */}
              {lineIndex === 1 && (
                <motion.span
                  className="group relative ml-[2vw] mb-[1.2vw] hidden md:block h-[8vw] w-[12vw] overflow-hidden rounded-full border border-white/20"
                  initial={{ clipPath: "inset(0 100% 0 0 round 999px)" }}
                  animate={ready ? { clipPath: "inset(0 0% 0 0 round 999px)" } : {}}
                  transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: d + 0.7 }}
                >
                  <Image
                    src="/Miesieduoveria.png"
                    alt=""
                    fill
                    priority
                    sizes="12vw"
                    className="object-cover object-[50%_30%] grayscale contrast-125 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                  />
                </motion.span>
              )}
            </span>
          ))}
        </motion.h1>

        {/* Bottom row: role, bio, actions */}
        <motion.div style={{ y: detailsY }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: d + 0.9 }}
          className="grid items-end gap-8 md:grid-cols-12"
        >
          <div className="md:col-span-5">
            <p className="text-xl md:text-3xl text-white/50 leading-tight">
              I build <RollingRole />
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/50">
              Multi-disciplinary creative from Nigeria — building scalable web apps, immersive games and visual
              media at the intersection of code, lens and rhythm.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:col-span-5 md:justify-center">
            <Link
              href="/work"
              className="magnetic group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-200 ease-out"
            >
              View work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="magnetic rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white/10"
            >
              Get in touch
            </Link>
          </div>

          <a
            href="#what-i-do"
            className="hidden md:flex md:col-span-2 items-center justify-end gap-3 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
          >
            Scroll
            <span className="relative h-12 w-px overflow-hidden bg-white/15">
              <span className="absolute left-0 top-0 h-1/2 w-px animate-scroll-line bg-white" />
            </span>
            <ArrowDownRight className="h-4 w-4" />
          </a>
        </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into the next section */}
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 z-20 h-32 w-full bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

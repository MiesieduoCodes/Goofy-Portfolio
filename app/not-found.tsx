"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SectionLabel } from "@/components/sections/BigCta";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  // The digits drift apart slightly with the cursor
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const x1 = useTransform(sx, (v) => v * -30);
  const x3 = useTransform(sx, (v) => v * 30);
  const y2 = useTransform(sy, (v) => v * 20);

  return (
    <div
      className="min-h-screen bg-black text-white"
      onMouseMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <main className="px-6 md:px-10 pt-36 md:pt-44">
        <section className="pb-20 md:pb-28">
          <SectionLabel index="404">Page not found</SectionLabel>
          <h1 aria-label="404" className="flex text-[34vw] md:text-[26vw] font-black leading-[0.8] tracking-tighter select-none">
            {["4", "0", "4"].map((digit, i) => (
              <motion.span key={i} className="inline-block" style={i === 0 ? { x: x1 } : i === 1 ? { y: y2 } : { x: x3 }}>
                <span className="block overflow-hidden">
                  <motion.span
                    className={`inline-block font-black ${i === 1 ? "text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.5)]" : ""}`}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, ease: EASE_OUT, delay: 0.1 + i * 0.1 }}
                  >
                    {digit}
                  </motion.span>
                </span>
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
            className="mt-10 max-w-md text-lg md:text-xl leading-relaxed text-white/50"
          >
            This page vanished into the void. Let&apos;s get you somewhere real.
          </motion.p>
        </section>

        <section className="pb-28 md:pb-40">
          <ul>
            {links.map((link, i) => (
              <motion.li
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.6 + i * 0.06 }}
                className="border-t border-white/10 last:border-b"
              >
                <Link href={link.href} className="group relative block overflow-hidden">
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
                  />
                  <span className="relative flex items-center justify-between py-6 md:py-8 transition-colors duration-500 group-hover:text-black">
                    <span className="text-3xl md:text-6xl font-black uppercase tracking-tighter transition-transform duration-500 group-hover:translate-x-3">
                      {link.label}
                    </span>
                    <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}

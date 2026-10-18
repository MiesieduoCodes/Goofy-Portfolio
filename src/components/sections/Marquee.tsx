"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const DEFAULT_ITEMS = ["Web", "Games", "Photography", "Music", "Mobile", "Motion"];

// Wrap x into [min, max) so the strip loops seamlessly
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

function MarqueeRow({ items, baseVelocity, outlined }: { items: string[]; baseVelocity: number; outlined?: boolean }) {
  const reducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // Scrolling speeds the strip up, and scrolling up flips its direction
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  // Four copies of the list; moving one copy's width (-25%) and wrapping looks endless
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reducedMotion) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className="flex shrink-0">
        {Array.from({ length: 4 }).map((_, copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0}>
            {items.map((item) => (
              <span key={item} className="flex items-center">
                <span
                  className={`px-6 md:px-10 text-5xl md:text-8xl font-black uppercase tracking-tighter ${
                    outlined ? "text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]" : "text-white"
                  }`}
                >
                  {item}
                </span>
                <span className="text-2xl md:text-4xl text-white/40">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee({ items = DEFAULT_ITEMS, label = "Disciplines" }: { items?: string[]; label?: string }) {
  return (
    <section aria-label={label} className="relative overflow-hidden border-y border-white/10 bg-black py-10 md:py-14">
      <div className="space-y-2 md:space-y-4 -rotate-1">
        <MarqueeRow items={items} baseVelocity={-2} />
        <MarqueeRow items={items} baseVelocity={2} outlined />
      </div>
      {/* Fade the edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-black to-transparent" />
    </section>
  );
}

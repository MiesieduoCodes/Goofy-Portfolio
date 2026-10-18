"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";

const stats = [
  { value: 4, suffix: "+", label: "Years experience" },
  { value: 20, suffix: "+", label: "Projects completed" },
  { value: 300, suffix: "k+", label: "Lines of code" },
  { value: 3, suffix: "", label: "Instruments mastered" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section aria-label="In numbers" className="bg-black px-6 pb-28 md:px-10 md:pb-40">
      <div className="grid grid-cols-2 border-t border-white/10 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            className={`border-b border-white/10 py-10 md:border-b-0 md:py-14 ${i % 2 === 1 ? "border-l pl-6" : ""} ${i > 0 ? "md:border-l md:pl-8" : ""}`}
          >
            <p className="text-6xl md:text-8xl font-black leading-none tracking-tighter">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/40">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

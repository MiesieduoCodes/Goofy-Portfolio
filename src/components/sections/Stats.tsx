"use client";

import { motion, useMotionValue, useSpring, useInView, animate, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 4, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Projects Completed" },
  { value: 300, suffix: "k+", label: "Lines of Code" },
  { value: 3, suffix: "", label: "Instruments Mastered" },
];

function SmoothCounter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (val) => Math.floor(val));
  const [roundedValue, setRoundedValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useMotionValueEvent(display, "change", (latest) => {
    setRoundedValue(latest);
  });

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [inView, value, count]);

  return (
    <motion.span
      ref={ref}
      className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
    >
      {roundedValue}{suffix}
    </motion.span>
  );
}

export function Stats() {
  return (
    <section className="py-20 bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="
                group relative backdrop-blur-sm
                border border-white/10 
                bg-white/[0.02]
                rounded-2xl p-6 text-center
                transition-all duration-500
                w-[160px] md:w-[240px]
              "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.03,
                rotateX: 5,
                rotateY: -5,
                transition: { duration: 0.4 },
              }}
            >
              {/* subtle glow border on hover */}
              <div className="
                absolute inset-0 rounded-2xl opacity-0 
                group-hover:opacity-100 transition-opacity duration-500
                bg-gradient-to-br from-white/10 to-white/5
              " />

              <SmoothCounter value={stat.value} suffix={stat.suffix} />

              <p className="mt-3 text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
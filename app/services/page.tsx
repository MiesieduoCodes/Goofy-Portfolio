"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { Camera, Code, Gamepad2, Music, Palette, Plus, Zap } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { BigCta, SectionLabel } from "@/components/sections/BigCta";
import { Marquee } from "@/components/sections/Marquee";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const services = [
  {
    id: "web-dev",
    icon: Code,
    title: "Web Architecture",
    category: "Development",
    description: "High-performance web applications built for the future.",
    longDescription:
      "I build lightning-fast, scalable web platforms using modern frameworks with performance and UX at the core. From custom headless CMS architectures to real-time interactive dashboards.",
    tags: ["Next.js", "TypeScript", "Three.js", "WebRTC"],
  },
  {
    id: "game-dev",
    icon: Gamepad2,
    title: "Game Systems",
    category: "Systems Design",
    description: "Immersive gameplay systems and technical excellence.",
    longDescription:
      "From mechanics to optimization, I create engaging game systems built for performance and fun. Specializing in Unity C# and procedural generation systems.",
    tags: ["Unity", "C#", "Shaders", "Multiplayer"],
  },
  {
    id: "creative-media",
    icon: Camera,
    title: "Creative Media",
    category: "Visual Arts",
    description: "Visual storytelling through a cinematic lens.",
    longDescription:
      "Photography and cinematic video production that captures emotion and elevates your brand. Focused on high-end color grading and atmospheric composition.",
    tags: ["Photography", "Color Grading", "Post-Prod", "Art Direction"],
  },
  {
    id: "sound-design",
    icon: Music,
    title: "Sonic Design",
    category: "Audio",
    description: "Custom sound experiences that breathe life into digital worlds.",
    longDescription:
      "Sound design that enhances immersion — from UI sounds to full cinematic scores. I believe sound is 50% of the user experience.",
    tags: ["Foley", "Scoring", "Mixing", "Synthesis"],
  },
  {
    id: "ui-ux",
    icon: Palette,
    title: "Interface Design",
    category: "Design",
    description: "Clean user experiences built on rigorous design systems.",
    longDescription:
      "Designing intuitive, aesthetic interfaces that users actually enjoy using. I bridge the gap between pure art and functional engineering.",
    tags: ["Figma", "Design Systems", "Prototyping", "UX Audit"],
  },
  {
    id: "performance",
    icon: Zap,
    title: "Optimization",
    category: "Consulting",
    description: "Speed & efficiency at every layer of the stack.",
    longDescription:
      "Improving load times, performance, and scalability across your entire system. I audit and refactor codebases for maximum efficiency.",
    tags: ["Core Web Vitals", "Refactoring", "DevOps", "Caching"],
  },
];

const process = [
  { title: "Discover", text: "Goals, audience and constraints — we agree on what success looks like." },
  { title: "Design", text: "Direction, systems and prototypes you can click through before anything is built." },
  { title: "Build", text: "Performance-first engineering with regular check-ins and live previews." },
  { title: "Launch", text: "Testing, deployment and hand-off — plus support once it's out in the world." },
];

const stats = [
  { value: 40, label: "High-performance assets" },
  { value: 25, label: "Creative partnerships" },
  { value: 5, label: "Years of experience" },
  { value: 18, label: "Collaborators" },
];

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums font-black">
      {String(value).padStart(2, "0")}+
    </span>
  );
}

function ServiceRow({
  service,
  index,
  open,
  onToggle,
}: {
  service: (typeof services)[number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = service.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.05 }}
      className="border-t border-white/10 last:border-b"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group grid w-full grid-cols-12 items-center gap-4 rounded-none bg-transparent px-0 py-6 md:py-10 text-left text-white"
      >
        <span className="col-span-2 md:col-span-1 font-mono text-xs text-white/30">{String(index + 1).padStart(2, "0")}</span>
        <span className="col-span-8 md:col-span-6 text-3xl md:text-6xl font-black uppercase leading-none tracking-tighter transition-transform duration-500 group-hover:translate-x-3">
          {service.title}
        </span>
        <span className="hidden md:block md:col-span-4 text-sm text-white/40">{service.description}</span>
        <span className="col-span-2 md:col-span-1 flex justify-end">
          <span
            className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border transition-all duration-500 ${
              open ? "border-white bg-white text-black" : "border-white/20 group-hover:border-white"
            }`}
          >
            <Plus className={`h-4 w-4 md:h-5 md:w-5 transition-transform duration-500 ${open ? "rotate-45" : ""}`} />
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-12 gap-4 pb-10 md:pb-14">
              <div className="col-span-12 md:col-span-6 md:col-start-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">{service.category}</p>
                <p className="mt-4 text-lg md:text-2xl leading-relaxed text-white/70">{service.longDescription}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/15 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex md:col-span-4 md:col-start-9 items-center justify-center">
                <motion.div
                  initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.1 }}
                  className="flex aspect-square w-40 items-center justify-center rounded-full border border-white/15"
                >
                  <Icon className="h-14 w-14 text-white/80" strokeWidth={1.25} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Services() {
  const [openId, setOpenId] = useState<string | null>(services[0].id);

  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <div className="px-6 md:px-10 pt-36 md:pt-44">
          {/* ── Header ── */}
          <section className="pb-20 md:pb-28">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <SectionLabel index="01">Services</SectionLabel>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-10 flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white/50"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Available for select projects
              </motion.span>
            </div>
            <h1 className="text-[17vw] md:text-[12vw] font-black uppercase leading-[0.82] tracking-tighter">
              {["Digital", "Alchemy"].map((word, i) => (
                <span key={word} className="block overflow-hidden">
                  <motion.span
                    className={`inline-block font-black ${i === 1 ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)]" : ""}`}
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 + i * 0.12 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
              className="mt-10 ml-auto max-w-xl text-lg md:text-xl leading-relaxed text-white/50"
            >
              At the intersection of precision engineering and artistic rebellion. I don&apos;t just build systems; I create
              digital environments that breathe.
            </motion.p>
          </section>

          {/* ── Services ── */}
          <section className="pb-28 md:pb-40">
            <SectionLabel index="02">What I offer</SectionLabel>
            <ul>
              {services.map((service, i) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  index={i}
                  open={openId === service.id}
                  onToggle={() => setOpenId((id) => (id === service.id ? null : service.id))}
                />
              ))}
            </ul>
          </section>

          {/* ── Process ── */}
          <section className="pb-28 md:pb-40">
            <SectionLabel index="03">Process</SectionLabel>
            <div className="grid gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-4">
              {process.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
                  className="group relative bg-black p-6 md:p-8 min-h-[260px] flex flex-col justify-between overflow-hidden"
                >
                  <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
                  <span className="relative font-mono text-xs text-white/40 transition-colors duration-500 group-hover:text-black/50">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative transition-colors duration-500 group-hover:text-black">
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/50 transition-colors duration-500 group-hover:text-black/70">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Stats ── */}
        <section className="bg-white px-6 py-16 text-black md:px-10 md:py-24">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-6xl md:text-8xl leading-none tracking-tighter">
                  <CountUp to={stat.value} />
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-black/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <Marquee label="Principles" items={["Performance", "Aesthetics", "Rebellion", "Precision", "Motion"]} />

        <div className="px-6 md:px-10 pt-28 md:pt-40">
          <BigCta eyebrow="Ready when you are" title="Start a project" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

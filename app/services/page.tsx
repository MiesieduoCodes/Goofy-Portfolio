"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Gamepad2, Code, Camera, Music, Palette, 
  Users, Globe, Briefcase, Rocket, Zap,
  ArrowUpRight, ChevronRight, Play, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AmbientParticles from "@/components/ambient-particles";
import ServiceCaseStudy from "@/components/ServiceCaseStudy";

const services = [
  {
    id: "web-dev",
    icon: Code,
    title: "Web Architecture",
    category: "Development",
    description: "High-performance web applications built for the future.",
    longDescription: "I build lightning-fast, scalable web platforms using modern frameworks with performance and UX at the core. From custom headless CMS architectures to real-time interactive dashboards.",
    tags: ["Next.js", "TypeScript", "Three.js", "WebRTC"],
    color: "from-blue-600/20 to-cyan-400/20"
  },
  {
    id: "game-dev",
    icon: Gamepad2,
    title: "Game Systems",
    category: "Systems Design",
    description: "Immersive gameplay systems and technical excellence.",
    longDescription: "From mechanics to optimization, I create engaging game systems built for performance and fun. Specializing in Unity C# and procedural generation systems.",
    tags: ["Unity", "C#", "Shaders", "Multiplayer"],
    color: "from-purple-600/20 to-pink-400/20"
  },
  {
    id: "creative-media",
    icon: Camera,
    title: "Creative Media",
    category: "Visual Arts",
    description: "Visual storytelling through a cinematic lens.",
    longDescription: "Photography and cinematic video production that captures emotion and elevates your brand. Focused on high-end color grading and atmospheric composition.",
    tags: ["Photography", "Color Grading", "Post-Prod", "Art Direction"],
    color: "from-orange-600/20 to-red-400/20"
  },
  {
    id: "sound-design",
    icon: Music,
    title: "Sonic Design",
    category: "Audio",
    description: "Custom sound experiences that breathe life into digital worlds.",
    longDescription: "Sound design that enhances immersion — from UI sounds to full cinematic scores. I believe sound is 50% of the user experience.",
    tags: ["Foley", "Scoring", "Mixing", "Synthesis"],
    color: "from-emerald-600/20 to-teal-400/20"
  },
  {
    id: "ui-ux",
    icon: Palette,
    title: "Interface Design",
    category: "Design",
    description: "Clean user experiences built on rigorous design systems.",
    longDescription: "Designing intuitive, aesthetic interfaces that users actually enjoy using. I bridge the gap between pure art and functional engineering.",
    tags: ["Figma", "Design Systems", "Prototyping", "UX Audit"],
    color: "from-amber-600/20 to-yellow-400/20"
  },
  {
    id: "performance",
    icon: Zap,
    title: "Optimization",
    category: "Consulting",
    description: "Speed & efficiency at every layer of the stack.",
    longDescription: "Improving load times, performance, and scalability across your entire system. I audit and refactor codebases for maximum efficiency.",
    tags: ["Core Web Vitals", "Refactoring", "DevOps", "Caching"],
    color: "from-zinc-600/20 to-zinc-400/20"
  },
];

function KineticHeader() {
  return (
    <section className="relative h-[70vh] flex flex-col justify-center items-center overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      </div>
      
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="px-4 py-1.5 rounded-full border border-white/10 text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">
            Available for Select Projects
          </span>
        </motion.div>
        
        <h1 className="text-6xl md:text-[6rem] font-black italic uppercase leading-[0.8] tracking-tighter mb-12">
          Digital <br /> 
          <span className="text-white/10 outline-text">Alchemy</span>
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-2xl mx-auto text-xl text-white/30 font-light italic leading-relaxed"
        >
          At the intersection of precision engineering and artistic rebellion. 
          I don't just build systems; I create digital environments that breathe.
        </motion.p>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/20">Scroll to Explore</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-[380px] rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-700 p-8 md:p-10 flex flex-col justify-between"
    >
      {/* Background Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-3xl scale-110`} />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-12">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
            <service.icon className="w-8 h-8" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-black text-white/20 group-hover:text-white/60 transition-colors">
            {service.category}
          </span>
        </div>
        
        <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 leading-none group-hover:translate-x-2 transition-transform duration-500">
          {service.title}
        </h3>
        
        <p className="text-white/40 text-lg group-hover:text-white/70 transition-colors duration-500 max-w-[80%]">
          {service.description}
        </p>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {service.tags.map(tag => (
            <span key={tag} className="text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/5 bg-white/5 text-white/40">
              {tag}
            </span>
          ))}
        </div>
        
        <button className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold group/btn">
          <span>View Methodology</span>
          <div className="w-8 h-px bg-white/20 group-hover/btn:w-12 transition-all" />
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
        </button>
      </div>
      
      {/* Decorative Index */}
      <span className="absolute bottom-12 right-12 text-8xl font-black italic opacity-[0.02] group-hover:opacity-[0.05] transition-opacity select-none">
        0{index + 1}
      </span>
    </motion.div>
  );
}

function VerticalStorySection({ service, index }: { service: typeof services[0]; index: number }) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  
  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 overflow-hidden">
      <motion.div style={{ y, opacity, scale }} className="container-custom grid md:grid-cols-2 gap-12 lg:gap-32 items-center">
        <div className={`max-w-xl ${index % 2 === 0 ? "order-1" : "order-1 md:order-2"}`}>
          <div className="w-20 h-20 mb-8 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-3xl">
            <service.icon className="w-8 h-8 text-white/80" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter mb-6 leading-none">
            {service.title}
          </h2>
          <p className="text-lg md:text-xl text-white/40 font-light italic leading-relaxed mb-10">
            {service.longDescription}
          </p>
          <div className="flex gap-4">
             {service.tags.map(tag => (
               <span key={tag} className="text-xs uppercase tracking-widest font-bold text-white/20">{tag}</span>
             ))}
          </div>
        </div>
        
        <div className={`relative aspect-video lg:aspect-square max-h-[500px] w-full ${index % 2 === 0 ? "order-2" : "order-2 md:order-1"}`}>
           <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-[3rem] blur-3xl opacity-20`} />
           <div className="absolute inset-0 border border-white/5 bg-white/[0.02] rounded-[3rem] backdrop-blur-3xl overflow-hidden flex items-center justify-center">
              <Cpu className="w-24 h-24 text-white/5 animate-pulse" />
              <div className="absolute bottom-10 left-10 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-white" />
                 </div>
                 <span className="text-[9px] uppercase tracking-widest font-black">Simulation Run_0{index + 1}</span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />
      <AmbientParticles />
      
      {/* Custom Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <main className="relative z-10">
        <KineticHeader />

        {/* Core Services Grid */}
        <section className="py-16 container-custom mt-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <span className="text-xs uppercase tracking-[0.4em] font-black text-white/20 mb-4 block">Core Competencies</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                Systems for the <br /> <span className="text-white/20">Hyper-Digital</span> Era.
              </h2>
            </div>
            <p className="text-white/30 max-w-sm text-sm italic font-light">
              Every project is a research phase. Every delivery is a new benchmark for performance and aesthetic weight.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </section>

        {/* Stats Section - High Contrast */}
        <section className="py-12 bg-white text-black overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent opacity-10" />
           <div className="container-custom relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-4">
                 {[
                   { label: "High-Performance Assets", value: "40+", icon: Rocket },
                   { label: "Creative Partnerships", value: "25+", icon: Globe },
                   { label: "Technical Experience", value: "05+", icon: Briefcase },
                   { label: "Collaborative Force", value: "18+", icon: Users },
                 ].map((item, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center md:items-start text-center md:text-left"
                   >
                     <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-2 leading-none">{item.value}</h3>
                     <p className="text-[10px] uppercase tracking-[0.3em] font-black opacity-40">{item.label}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
           
           {/* Scrolling Ticker */}
           <div className="mt-12 flex whitespace-nowrap overflow-hidden border-y border-black/5 py-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex animate-scroll-text">
                   {["PERFORMANCE", "AESTHETICS", "REBELLION", "PRECISION", "MOTION"].map(text => (
                     <span key={text} className="text-[4vw] font-black italic uppercase tracking-tighter mx-8 opacity-[0.05]">{text}</span>
                   ))}
                </div>
              ))}
           </div>
        </section>

        {/* The Vertical Deep-Dive Experience */}
        <section className="relative h-[450vh] mt-20">
           <div className="sticky top-0 h-screen flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-0">
              <span className="text-[8vw] font-black italic opacity-[0.03] select-none uppercase tracking-tighter">Deep Dive</span>
           </div>
           <div className="relative z-10">
              {services.slice(0, 4).map((service, i) => (
                <VerticalStorySection key={service.id} service={service} index={i} />
              ))}
           </div>
        </section>

        {/* Final CTA - Ultra Clean */}
        <section className="py-24 container-custom text-center mt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-6xl md:text-[6rem] font-black italic uppercase leading-[0.8] tracking-tighter mb-20">
              Commence <br /> 
              <span className="text-white/10">Project_</span>
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Button asChild size="xl" className="h-24 px-16 rounded-full text-xl font-black uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-all scale-110 hover:scale-105">
                <Link href="/contact">Deploy Vision</Link>
              </Button>
              <Link href="/work" className="text-white/40 hover:text-white transition-colors uppercase tracking-[0.5em] font-black text-xs flex items-center gap-4">
                <span>Browse Archive</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>

        <ServiceCaseStudy
          open={isOpen}
          onClose={() => setIsOpen(false)}
          service={selectedService}
        />
      </main>

      <Footer />
      
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import {gsap} from "gsap"

interface ProjectTileProps {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
  };
  className?: string;
  onClick?: (rect: DOMRect) => void;
}

export default function ProjectTile({ project, className, onClick }: ProjectTileProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // GSAP Hover Micro-interactions
    const enter = () => {
      gsap.to(el, {
        scale: 1.05,
        rotateX: 5,
        rotateY: -5,
        duration: 0.4,
        ease: "power2.out",
        boxShadow: "0 40px 100px -20px rgba(0,0,0,0.6)",
      });
    };

    const leave = () => {
      gsap.to(el, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      });
    };

    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // PARALLAX LAYERS (Mouse Depth)
    const layers = ref.current?.querySelectorAll("[data-layer]");
    layers?.forEach((layer: any) => {
      const depth = parseFloat(layer.getAttribute("data-depth") || "0");
      const moveX = (x - 0.5) * depth * 50;
      const moveY = (y - 0.5) * depth * 50;

      layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    // LIGHT EFFECT (GLOW)
    const glow = ref.current?.querySelector<HTMLDivElement>(".glow");
    if (glow) {
      glow.style.background = `
        radial-gradient(
          circle at ${x * 100}% ${y * 100}%,
          rgba(255,255,255,0.15),
          transparent 50%
        )
      `;
    }
  };

  const resetLayers = () => {
    const layers = ref.current?.querySelectorAll("[data-layer]");
    layers?.forEach((layer: any) => {
      layer.style.transform = `translate(0px, 0px)`;
    });

    const glow = ref.current?.querySelector<HTMLDivElement>(".glow");
    if (glow) glow.style.background = "transparent";
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={resetLayers}
      onClick={() => {
        if (ref.current && onClick) {
          onClick(ref.current.getBoundingClientRect());
        }
      }}
      className={`
        ${className}
        w-full h-full
        rounded-[40px]
        bg-neutral-900/40
        backdrop-blur-2xl
        cursor-pointer
        relative
        group
        border border-white/10
        hover:border-white/20
        shadow-[0_20px_60px_rgba(0,0,0,0.5)]
        overflow-hidden
      `}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none rounded-[40px]">
        {/* BACKGROUND LAYER */}
        <div
          data-layer
          data-depth="0.2"
          className="absolute inset-0 bg-gradient-to-br from-neutral-800/40 to-neutral-900/40"
        />

        {/* MID LAYER (Floating Title) */}
        <motion.div
          data-layer
          data-depth="0.6"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center p-8 text-center"
        >
          <h3 
            className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none opacity-80"
          >
            {project.title}
          </h3>
        </motion.div>

        {/* FOREGROUND LAYER (Metadata) */}
        <div
          data-layer
          data-depth="1.2"
          className="absolute bottom-8 left-8 right-8 flex justify-between items-end"
        >
          <p className="text-white/30 text-xs font-mono uppercase tracking-widest">
            Project / {project.id}
          </p>
          <span className="text-white/60 text-sm font-bold">View →</span>
        </div>

        {/* LIGHT GLOW LAYER */}
        <div className="glow absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}

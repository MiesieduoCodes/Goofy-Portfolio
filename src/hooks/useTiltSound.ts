"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export function useTiltSound(levels: { bass: number; mid: number; high: number; overall: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Calculate rotation based on mouse position relative to center of card
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 20); // max 10deg
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 20); // max 10deg

      setTilt({ x, y });
    };

    const handleLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // SOUND REACTIVE MOTION (Highly visible)
  const soundTiltX = (levels?.bass || 0) * 0.15; // Increased from 0.05
  const soundTiltY = (levels?.high || 0) * 0.1; // Increased from 0.04
  const soundScale = 1 + (levels?.overall / 255) * 0.15; // Use overall for more consistent pulse

  const style: any = {
    transform: `
      perspective(1000px)
      rotateX(${-(tilt.y + soundTiltY)}deg)
      rotateY(${tilt.x + soundTiltX}deg)
      scale(${soundScale})
    `,
    transition: "transform 0.1s ease-out",
    transformStyle: "preserve-3d" as const,
  };

  return { ref, style };
}

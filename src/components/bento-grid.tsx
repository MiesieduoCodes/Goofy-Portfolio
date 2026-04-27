"use client";

import { getRandomLayout } from "@/lib/bento-layout";
import { useMemo, useEffect, useRef, useState } from "react";
import ProjectTile from "./project-tile";
import ProjectOverlay from "./project-overlay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { random, randomChoice, easings } from "@/lib/randomness";

interface BentoGridProps {
  projects: {
    id: string;
    title: string;
    description: string;
    image?: string;
  }[];
}

export function BentoGrid({ projects }: BentoGridProps) {
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layout = useMemo(() => getRandomLayout(), []);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      tileRefs.current.forEach((tile, i) => {
        if (!tile) return;

        const ease = randomChoice(easings);
        const delay = random(0, 0.3);
        const duration = random(0.8, 1.2);

        // INTRO ANIMATION
        gsap.fromTo(
          tile,
          { opacity: 0, scale: 0.85, y: 60, rotate: random(-2, 2) },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            duration,
            ease,
            delay: i * 0.1 + delay,
          }
        );

        // SCROLL RE-ANIMATION
        gsap.fromTo(
          tile,
          { y: 0 },
          {
            y: -30,
            scrollTrigger: {
              trigger: tile,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
            ease: "none",
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // Random layout shift on load
  useEffect(() => {
    const shouldSwap = Math.random() > 0.5;
    if (shouldSwap && tileRefs.current[0] && tileRefs.current[1]) {
      tileRefs.current[0].style.order = "2";
      tileRefs.current[1].style.order = "1";
    }
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[300px] gap-8 container-custom py-20 bento-grid-container">
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => { tileRefs.current[i] = el; }}
            className={`bento-tile ${layout[i % layout.length]} group`}
          >
            <ProjectTile 
              project={project} 
              onClick={(rect) => {
                setOriginRect(rect);
                setActiveProject(project);
              }}
            />
          </div>
        ))}
      </div>

      <ProjectOverlay 
        project={activeProject} 
        originRect={originRect}
        onClose={() => {
          setActiveProject(null);
          setOriginRect(null);
        }} 
      />
    </>
  );
}

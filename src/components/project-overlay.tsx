"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { X } from "lucide-react";

interface ProjectOverlayProps {
  project: {
    id: string;
    title: string;
    description: string;
  } | null;
  originRect: DOMRect | null;
  onClose: () => void;
}

export default function ProjectOverlay({ project, originRect, onClose }: ProjectOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!originRect || !project || !mounted) return;

    const el = overlayRef.current;
    if (!el) return;

    // 1. SET INITIAL POSITION = TILE POSITION
    gsap.set(el, {
      position: "fixed",
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      borderRadius: "40px",
      zIndex: 99999,
      backgroundColor: "#000000",
      opacity: 1,
    });

    // LOCK SCROLL
    document.body.style.overflow = "hidden";

    // 2. MORPH TO FULLSCREEN
    gsap.to(el, {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: "0px",
      duration: 0.8,
      ease: "power4.inOut",
    });

    // 3. CONTENT FADE IN
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        delay: 0.4,
        duration: 0.6,
        ease: "power3.out",
      }
    );

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [originRect, project, mounted]);

  const handleClose = () => {
    if (!originRect) {
      onClose();
      return;
    }

    const el = overlayRef.current;
    if (!el) return;

    gsap.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(el, {
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
          height: originRect.height,
          borderRadius: "40px",
          duration: 0.7,
          ease: "power4.inOut",
          onComplete: onClose,
        });
      }
    });
  };

  if (!project || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      <div 
        ref={overlayRef} 
        className="bg-black text-white overflow-hidden pointer-events-auto border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
      >
        {/* CLOSE BUTTON - FORCED VISIBILITY */}
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 z-[100001] p-4 rounded-full bg-white/10 hover:bg-white border border-white/20 text-white hover:text-black transition-all group backdrop-blur-xl"
        >
          <X size={24} className="group-hover:scale-110 transition-transform" />
        </button>

        <div ref={contentRef} className="h-full flex flex-col p-8 md:p-20 overflow-y-auto custom-scrollbar bg-black">
          <h1 className="text-5xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-12 text-white">
            {project.title}
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <p className="text-2xl md:text-3xl text-white/60 leading-relaxed font-medium">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-10">
                {["Experience", "Strategy", "Motion"].map((tag) => (
                  <span key={tag} className="px-8 py-3 rounded-full border border-white/10 text-sm font-mono uppercase tracking-widest text-white/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-10">
               <div className="aspect-video bg-white/5 rounded-[40px] animate-pulse" />
               <div className="aspect-square bg-white/5 rounded-[40px] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

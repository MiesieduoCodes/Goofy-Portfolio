"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ServiceCaseStudy({ open, onClose, service }: any) {
  // Lock body scroll when modal is open
  useEffect(() => {
    const html = document.documentElement;
    if (open) {
      html.style.overflow = "hidden";
      html.style.height = "100vh";
    } else {
      html.style.overflow = "";
      html.style.height = "";
    }
    return () => {
      html.style.overflow = "";
      html.style.height = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-start overflow-y-auto pt-10 pb-20 px-4 md:px-10"
        >
          {/* 🔥 BACKDROP - NOW STAYS FIXED BEHIND THE SCROLLING WRAPPER */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-strong pointer-events-none"
          />

          {/* CLICK-TO-CLOSE LAYER (invisible but catches clicks outside the card) */}
          <div 
            className="fixed inset-0 z-0 cursor-pointer" 
            onClick={onClose} 
          />

          {/* 🔥 MODAL CARD - MOVES WITH SCROLL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-4xl bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-black transition-all z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* CARD CONTENT */}
            <div className="p-8 md:p-16 space-y-12">
              <div className="space-y-4">
                <p className="text-[10px] tracking-[0.6em] uppercase text-primary font-black">
                  Service Intelligence — 2026
                </p>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">
                  {service?.title}
                </h2>
              </div>

              <div className="h-0.5 w-20 bg-primary" />

              <div className="space-y-10">
                <p className="text-xl md:text-3xl text-white/70 font-light leading-relaxed italic max-w-3xl">
                  {service?.longDescription || service?.description}
                </p>

                {service?.features && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        <span className="text-sm font-black uppercase italic text-white/90 group-hover:text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-10">
                <Button size="lg" className="h-20 px-16 rounded-full font-black uppercase tracking-widest bg-primary text-black hover:scale-105 active:scale-95 transition-all shadow-2xl text-lg">
                  Start Project
                </Button>
                <Button variant="outline" size="lg" className="h-20 px-16 rounded-full font-black uppercase tracking-widest border-white/10 hover:bg-white/5 text-lg">
                  Case Study →
                </Button>
              </div>
            </div>

            {/* DECORATIVE LIGHTING */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="overflow-x-hidden relative">
      {/* Page Transition Preloader */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 1.1 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-center px-4"
        >
          <h1 className="text-white font-display text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic">
            MiesieduoVeria.
          </h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-1 bg-white mt-4 origin-left"
          />
        </motion.div>
      </motion.div>

      {/* Main Content Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="relative perspective-wrapper"
      >
        {children}
      </motion.div>
    </div>
  );
}
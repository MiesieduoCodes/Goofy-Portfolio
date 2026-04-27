"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const routes = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/games", label: "Game Dev" },
  { href: "/photography", label: "Photography" },
  { href: "/contact", label: "Contact" },
];

const MenuItem = ({ label, href, index, onClick }: any) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{
        delay: 0.15 + index * 0.08,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className="group inline-block w-fit"
    >
      <Link 
        href={href} 
        onClick={onClick} 
        className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter block relative px-6 py-2 transition-all duration-500 bg-transparent group-hover:bg-white text-white group-hover:text-black"
      >
        <span className="relative z-10 transition-transform duration-500 group-hover:-translate-x-2 inline-block">
          {label}
        </span>
      </Link>
    </motion.div>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const pathname = usePathname();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Prevent body scroll and hide scrollbar when menu is open
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      console.log("Menu Open: Adding menu-open class");
      html.classList.add('menu-open');
    } else {
      console.log("Menu Closed: Removing menu-open class");
      html.classList.remove('menu-open');
    }
    return () => {
      html.classList.remove('menu-open');
    };
  }, [isOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* NAVBAR HEADER */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ 
          y: isOpen ? -120 : 0, 
          opacity: isOpen ? 0 : 1 
        }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 w-full z-[999] bg-black/30 backdrop-blur-md border-b border-white/10"
      >
        <div className="container-custom flex h-24 items-center justify-between relative">
          <Link href="/" className="text-2xl md:text-3xl font-black tracking-tight hover:scale-[1.02] transition-transform">
            MiesieduoVeria.
          </Link>

          {/* JUST 'MENU' TEXT (NO BG, NO BORDER) */}
          <button 
            onClick={() => setIsOpen(true)} 
            className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-white bg-transparent border-none outline-none p-0 cursor-pointer"
          >
            Menu →
          </button>
        </div>
      </motion.header>

      {/* FULLSCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000]"
          >
            {/* CLOSE BUTTON */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => setIsOpen(false)}
              className="fixed top-8 right-8 z-[1001] p-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all group"
            >
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute w-10 h-0.5 bg-current rotate-45"></div>
                <div className="absolute w-10 h-0.5 bg-current -rotate-45"></div>
              </div>
            </motion.button>

            {/* Viewport-Relative Cursor Blob */}
            <motion.div
              animate={{ 
                x: cursor.x - 20, 
                y: cursor.y - 20 
              }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed z-[1000] w-12 h-12 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 pointer-events-none"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "-2%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-2xl flex flex-col justify-start pt-32 md:pt-40 px-10 md:px-20 overflow-y-auto"
            >
              <nav className="flex flex-col gap-6 md:gap-10 pb-20">
                {routes.map((route, i) => (
                  <MenuItem key={route.href} label={route.label} href={route.href} index={i} onClick={() => setIsOpen(false)} />
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

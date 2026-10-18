"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { transitionTo } from "@/lib/intro";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const routes = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/web", label: "Web" },
  { href: "/mobile", label: "Mobile" },
  { href: "/games", label: "Game Dev" },
  { href: "/music", label: "Music" },
  { href: "/photography", label: "Photography" },
  { href: "/contact", label: "Contact" },
];

const COUNT = routes.length;
// Each link takes an equal slice of a full 360° wheel
const STEP_DEG = 360 / COUNT;

// Wrap a value into [-COUNT/2, COUNT/2) so the wheel loops forever
const wrapOffset = (value: number) => {
  const half = COUNT / 2;
  return ((((value + half) % COUNT) + COUNT) % COUNT) - half;
};

const mod = (value: number) => ((value % COUNT) + COUNT) % COUNT;

interface WheelItemProps {
  route: (typeof routes)[number];
  index: number;
  rotation: MotionValue<number>;
  radius: number;
  isFront: boolean;
  isActive: boolean;
  onSelect: (href: string) => void;
  linkRef: (el: HTMLAnchorElement | null) => void;
}

const WheelItem = ({ route, index, rotation, radius, isFront, isActive, onSelect, linkRef }: WheelItemProps) => {
  const transform = useTransform(rotation, (r) => {
    const angle = wrapOffset(index - r) * STEP_DEG;
    return `translate(-50%, -50%) rotateX(${-angle}deg) translateZ(${radius}px)`;
  });
  // Fade links as they turn away, and hide the back half of the wheel
  const opacity = useTransform(rotation, (r) => {
    const cos = Math.cos((wrapOffset(index - r) * STEP_DEG * Math.PI) / 180);
    return cos <= 0 ? 0 : Math.pow(cos, 2.5);
  });
  const pointerEvents = useTransform(opacity, (o) => (o > 0.25 ? "auto" : "none"));

  return (
    <motion.div
      style={{ transform, opacity, pointerEvents }}
      className="absolute left-1/2 top-1/2 [backface-visibility:hidden] will-change-transform"
    >
      <Link
        ref={linkRef}
        href={route.href}
        tabIndex={isFront ? 0 : -1}
        aria-current={isActive ? "page" : undefined}
        onClick={(e) => {
          e.preventDefault();
          onSelect(route.href);
        }}
        className={`group block whitespace-nowrap px-6 py-2 text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter transition-colors duration-300 outline-none focus-visible:ring-4 focus-visible:ring-white/60 ${
          isFront ? "text-white hover:bg-white hover:text-black" : "text-white/70 hover:text-white"
        }`}
      >
        <span className="inline-block transition-transform duration-500 group-hover:-translate-x-2">
          {route.label}
        </span>
        {isActive && <span className="ml-4 align-middle text-base md:text-2xl tracking-normal">●</span>}
      </Link>
    </motion.div>
  );
};

function MenuWheel({ onClose, menuId }: { onClose: () => void; menuId: string }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = Math.max(0, routes.findIndex((r) => pathname?.startsWith(r.href)));

  // `target` is where the wheel is heading (in link units); `rotation` springs toward it
  const target = useMotionValue(activeIndex);
  const rotation = useSpring(target, { stiffness: 140, damping: 22, mass: 0.6 });
  const [frontIndex, setFrontIndex] = useState(activeIndex);
  const [radius, setRadius] = useState(260);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const blobX = useSpring(cursorX, { stiffness: 350, damping: 30 });
  const blobY = useSpring(cursorY, { stiffness: 350, damping: 30 });

  const snapTimer = useRef<ReturnType<typeof setTimeout>>();
  const drag = useRef<{ startY: number; startTarget: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const unsubscribe = target.on("change", (v) => setFrontIndex(mod(Math.round(v))));
    return unsubscribe;
  }, [target]);

  // Size the wheel to the viewport so links never overlap
  useEffect(() => {
    const resize = () => setRadius(Math.min(window.innerHeight * 0.34, 340));
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const snap = useCallback(() => {
    clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => target.set(Math.round(target.get())), 140);
  }, [target]);

  const turn = useCallback(
    (by: number) => {
      clearTimeout(snapTimer.current);
      target.set(Math.round(target.get()) + by);
    },
    [target]
  );

  // Scroll wheel / trackpad spins the menu
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
      target.set(target.get() + delta / 220);
      snap();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      clearTimeout(snapTimer.current);
    };
  }, [snap, target]);

  // Focus the link at the front on open; give focus back to the Menu button on close
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    linkRefs.current[activeIndex]?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (href: string) => {
    if (suppressClick.current) return;
    onClose();
    if (href !== pathname) transitionTo(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      turn(1);
      linkRefs.current[mod(frontIndex + 1)]?.focus({ preventScroll: true });
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      turn(-1);
      linkRefs.current[mod(frontIndex - 1)]?.focus({ preventScroll: true });
    } else if (e.key === "Tab") {
      // Keep focus inside the menu: close button <-> front link
      e.preventDefault();
      const front = linkRefs.current[frontIndex];
      (document.activeElement === closeRef.current ? front : closeRef.current)?.focus();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    clearTimeout(snapTimer.current);
    drag.current = { startY: e.clientY, startTarget: target.get(), moved: false };
    suppressClick.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    cursorX.set(e.clientX - 24);
    cursorY.set(e.clientY - 24);
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.startY;
    if (Math.abs(dy) > 6 && !d.moved) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (d.moved) target.set(d.startTarget - dy / (radius * 0.7));
  };

  const onPointerUp = () => {
    if (drag.current?.moved) {
      suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
      target.set(Math.round(target.get()));
    }
    drag.current = null;
  };

  return (
    <motion.div
      id={menuId}
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      data-no-transition
      aria-label="Site navigation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-2xl overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing"
    >
      {/* CLOSE BUTTON */}
      <motion.button
        ref={closeRef}
        type="button"
        aria-label="Close menu"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        onClick={onClose}
        className="fixed top-8 right-8 z-[1002] p-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors outline-none focus-visible:ring-4 focus-visible:ring-white/60"
      >
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute w-10 h-0.5 bg-current rotate-45"></div>
          <div className="absolute w-10 h-0.5 bg-current -rotate-45"></div>
        </div>
      </motion.button>

      {/* Cursor blob */}
      <motion.div
        aria-hidden
        style={{ x: blobX, y: blobY }}
        className="fixed left-0 top-0 z-[1001] w-12 h-12 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 pointer-events-none hidden md:block"
      />

      {/* Front-slot guide lines */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.3em] text-5xl md:text-8xl lg:text-9xl border-y border-white/10" />

      {/* The wheel */}
      <motion.nav
        aria-label="Pages"
        initial={{ rotateY: -25, scale: 0.85 }}
        animate={{ rotateY: 0, scale: 1 }}
        exit={{ rotateY: 25, scale: 0.85 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 [perspective:1400px] [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {routes.map((route, i) => (
            <WheelItem
              key={route.href}
              route={route}
              index={i}
              rotation={rotation}
              radius={radius}
              isFront={i === frontIndex}
              isActive={i === activeIndex && !!pathname?.startsWith(route.href)}
              onSelect={select}
              linkRef={(el) => (linkRefs.current[i] = el)}
            />
          ))}
        </div>
      </motion.nav>

      {/* Counter + hint */}
      <div className="pointer-events-none absolute bottom-8 left-8 right-8 flex items-end justify-between text-white/60 text-xs md:text-sm uppercase tracking-[0.3em]">
        <span aria-live="polite">
          {String(frontIndex + 1).padStart(2, "0")} / {String(COUNT).padStart(2, "0")}
        </span>
        <span className="hidden sm:inline">Scroll · Drag · ↑ ↓</span>
      </div>
    </motion.div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuId = "site-menu";

  // Prevent body scroll and hide scrollbar when menu is open
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("menu-open", isOpen);
    return () => {
      html.classList.remove("menu-open");
    };
  }, [isOpen]);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // The admin panel has its own navigation
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* NAVBAR HEADER */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{
          y: isOpen ? -120 : 0,
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="fixed top-0 left-0 w-full z-[999] bg-black/30 backdrop-blur-md border-b border-white/10"
      >
        <div className="container-custom flex h-24 items-center justify-between relative">
          <Link href="/" className="text-2xl md:text-3xl font-black tracking-tight hover:scale-[1.02] transition-transform">
            MiesieduoVeria.
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls={menuId}
            className="text-sm md:text-base font-black uppercase tracking-[0.3em] text-white bg-transparent border-none outline-none p-0 cursor-pointer focus-visible:underline"
          >
            Menu →
          </button>
        </div>
      </motion.header>

      {/* FULLSCREEN CIRCULAR MENU */}
      <AnimatePresence>{isOpen && <MenuWheel menuId={menuId} onClose={() => setIsOpen(false)} />}</AnimatePresence>
    </>
  );
}

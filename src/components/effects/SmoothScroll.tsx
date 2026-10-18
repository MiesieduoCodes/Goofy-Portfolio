"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Inertial smooth scrolling for the public site.
// Off in the admin panel and for visitors who prefer reduced motion,
// and paused while the full-screen menu is open.
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
      anchors: true,
      // Let scrollable panels (dialogs, lightboxes, the menu) scroll on their own
      prevent: (node) => !!node.closest?.("[data-lenis-prevent], [role='dialog']"),
    });
    lenisRef.current = lenis;

    const html = document.documentElement;
    const syncMenu = () => (html.classList.contains("menu-open") ? lenis.stop() : lenis.start());
    const observer = new MutationObserver(syncMenu);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      observer.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isAdmin]);

  // Start each new page at the top
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}

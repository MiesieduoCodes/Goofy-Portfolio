"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { NAVIGATE_EVENT, markNavigated } from "@/lib/intro";

const COLUMNS = 6;
const EASE = [0.76, 0, 0.24, 1] as const;

type Phase = "idle" | "cover" | "covered" | "reveal";

const LABELS: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/services": "Services",
  "/web": "Web",
  "/mobile": "Mobile",
  "/games": "Game Dev",
  "/music": "Music",
  "/photography": "Photography",
  "/contact": "Contact",
};

const labelFor = (pathname: string) =>
  LABELS[pathname] ?? pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "Home";

// Page change: six black columns drop down to cover the screen while the
// destination's name rises in, then they keep falling to reveal the new page.
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [label, setLabel] = useState("");
  const phaseRef = useRef<Phase>("idle");
  const target = useRef<string | null>(null);
  const pendingHref = useRef<string | null>(null);
  const firstPath = useRef(pathname);

  const go = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const start = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      const dest = url.pathname + url.search + url.hash;
      if (phaseRef.current !== "idle") return;
      if (reducedMotion || url.pathname === window.location.pathname) {
        router.push(dest);
        return;
      }
      target.current = url.pathname;
      router.prefetch(dest);
      // Navigate once the columns have covered the screen (see onCoverComplete)
      pendingHref.current = dest;
      setLabel(labelFor(url.pathname));
      go("cover");
    },
    [go, reducedMotion, router]
  );

  const onCoverComplete = useCallback(() => {
    if (phaseRef.current !== "cover" || !pendingHref.current) return;
    go("covered");
    router.push(pendingHref.current);
    pendingHref.current = null;
  }, [go, router]);

  // Intercept same-site link clicks before Next's <Link> handles them
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.closest("[data-no-transition]")) return;
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#") || /^(mailto|tel):/.test(raw)) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (url.pathname.startsWith("/admin") || window.location.pathname.startsWith("/admin")) return;
      e.preventDefault();
      start(url.href);
    };
    const onNavigate = (e: Event) => start((e as CustomEvent<string>).detail);

    document.addEventListener("click", onClick, true);
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(NAVIGATE_EVENT, onNavigate);
    };
  }, [start]);

  // New page has rendered: reveal it
  useEffect(() => {
    if (pathname !== firstPath.current) markNavigated();
    if (phaseRef.current !== "covered" || pathname !== target.current) return;
    const id = setTimeout(() => go("reveal"), 120);
    return () => clearTimeout(id);
  }, [pathname, go]);

  // Never leave the screen covered if a navigation stalls or fails
  useEffect(() => {
    if (phase !== "covered") return;
    const id = setTimeout(() => go("reveal"), 5000);
    return () => clearTimeout(id);
  }, [phase, go]);

  const active = phase !== "idle";
  const revealing = phase === "reveal";

  return (
    <AnimatePresence>
      {active && (
        <div key="page-transition" aria-hidden className="pointer-events-auto fixed inset-0 z-[1200]">
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-black -mx-px"
                initial={{ y: "-100%" }}
                animate={{ y: revealing ? "100%" : "0%" }}
                transition={{ duration: revealing ? 0.75 : 0.6, ease: EASE, delay: i * 0.05 }}
                onAnimationComplete={() => {
                  if (i !== COLUMNS - 1) return;
                  if (phaseRef.current === "cover") onCoverComplete();
                  else if (phaseRef.current === "reveal") go("idle");
                }}
              />
            ))}
          </div>

          {/* Destination name */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-white"
            animate={{ opacity: revealing ? 0 : 1, y: revealing ? 60 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <span className="mb-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
              MiesieduoVeria.
            </span>
            <span className="flex overflow-hidden leading-[0.9]">
              {label.split("").map((char, i) => (
                <motion.span
                  key={`${label}-${i}`}
                  className="inline-block whitespace-pre text-[13vw] md:text-[8vw] font-black uppercase tracking-tighter"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.03 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

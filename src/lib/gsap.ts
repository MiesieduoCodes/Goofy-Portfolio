import { gsap } from "gsap"

// GSAP ignores the OS "reduce motion" setting, so speed every time-based tween
// up until it's effectively instant. Scroll-scrubbed animations stay tied to the scroll.
if (typeof window !== "undefined") {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  const apply = () => gsap.globalTimeline.timeScale(query.matches ? 1000 : 1)
  apply()
  query.addEventListener?.("change", apply)
}

export { gsap }
export default gsap

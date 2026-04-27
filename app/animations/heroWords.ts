import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initHeroWords() {
  console.log("Initializing Hero Words Animation with Pinning...");
  
  gsap.registerPlugin(ScrollTrigger);

  // Clear existing ScrollTriggers
  ScrollTrigger.getAll().forEach(t => t.kill());

  const words = gsap.utils.toArray<HTMLElement>(".word");
  if (words.length === 0) return;

  // Set initial state
  gsap.set(".word", { opacity: 0, y: "100%", rotateX: -60, z: 200, scale: 0.9, filter: "blur(8px)" });
  gsap.set(words[0], { opacity: 1, y: 0, rotateX: 0, z: 0, scale: 1, filter: "blur(0px)" });

  // PIN THE MAIN CONTAINER
  const mainTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "+=150%", // Reduced scroll distance to fix the "too much gap" issue
      pin: true,
      scrub: 1, // Smoother scrub
      anticipatePin: 1,
    }
  });

  // Add word transitions to the main pinned timeline
  words.forEach((word, i) => {
    const next = words[i + 1];
    if (!next) return;

    mainTl.to(word, {
      y: "-120%",
      rotateX: 60,
      z: -200,
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px)",
      ease: "power2.inOut",
    }, i) // Start at index 'i' in the timeline
    .fromTo(next, 
      {
        y: "120%",
        rotateX: -60,
        z: 200,
        opacity: 0,
        scale: 0.9,
        filter: "blur(8px)",
      },
      {
        y: "0%",
        rotateX: 0,
        z: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        ease: "power2.inOut",
      },
      i // Start at the same time as the previous word exits
    );
  });

  // Exit animation at the very end of the pinned timeline
  mainTl.to(".hero-title", {
    y: -100,
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
    ease: "power2.in"
  }, words.length - 0.5);

  ScrollTrigger.refresh();
}

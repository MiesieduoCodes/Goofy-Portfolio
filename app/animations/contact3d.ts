import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const initContact3D = () => {
  console.log("Initializing Contact 3D Portal Engine...");
  gsap.registerPlugin(ScrollTrigger);
  
  const cards = document.querySelectorAll(".contact-card");

  // SCROLL REVEAL
  cards.forEach((card, i) => {
    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 80,
        rotateX: -20,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
        delay: i * 0.1,
      }
    );
  });

  // DEPTH PARALLAX ON SCROLL
  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;

    cards.forEach((card, i) => {
      gsap.to(card, {
        y: scroll * (0.02 + i * 0.01),
        duration: 0.5,
      });
    });
  });

  // MOUSE 3D TILT
  cards.forEach((card: any) => {
    card.addEventListener("mousemove", (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.4,
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    });
  });
};

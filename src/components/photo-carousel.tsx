"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  "/images/IMG_20240128_165727_416.jpg",
  "/images/IMG_20240211_182833_410.jpg",
  "/images/IMG_20240216_181228_709.jpg",
  "/images/IMG_20240227_100109_24.jpg",
  "/images/IMG_20240322_160418_515.jpg",
  "/images/IMG_20241031_114853_846.jpg",
  "/images/IMG_20241211_170728_155.jpg",
  "/images/IMG_20250306_123531_611.jpg",
  "/images/IMG_6959.JPG",
  "/images/IMG-20250310-WA0063.jpg",
  "/images/IMG-20250325-WA0019(1).jpg",
  "/images/IMG-20250325-WA0026.jpg",
];

export default function PhotoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    console.log("📸 Carousel loaded with", images.length, "images");
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={`Veria ${index}`}
            fill
            className="object-cover"
            priority
          />
          {/* Subtle overlay for better text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* PROGRESS BAR */}
      <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-20">
        {images.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
          >
            {i === index && (
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="h-full bg-primary"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

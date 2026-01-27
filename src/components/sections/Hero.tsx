'use client';

import { MotionDiv } from "@/components/motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-landscape.jpg"
          alt="Nigerian landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom-xl text-center">
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            Crafting Digital Worlds &{" "}
            <span className="text-gradient italic">Sonic Landscapes</span>
          </h1>

          {/* Subheading */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-6"
          >
            At the intersection of code, lens, and rhythm. Building scalable web
            apps, immersive games, and professional creative media.
          </MotionDiv>

          {/* CTAs */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button variant="default" size="lg" asChild className="text-lg px-8 py-4">
              <Link href="/work">View Portfolio</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-4">
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </MotionDiv>
        </MotionDiv>
      </div>

      {/* Scroll Indicator */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <MotionDiv
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <ChevronDown className="w-8 h-8" />
        </MotionDiv>
      </MotionDiv>
    </section>
  );
}

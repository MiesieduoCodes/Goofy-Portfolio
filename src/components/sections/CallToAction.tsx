'use client';

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="section-spacing bg-card">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Headline */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to build the{" "}
            <span className="text-gradient">extraordinary</span>?
          </h2>

          {/* Subtext */}
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Currently open to Senior Technical Designer or Game Developer roles.
            Let's discuss your next system-driven project.
          </p>

          {/* CTA Button */}
          <Button variant="default" size="xl" asChild className="group">
            <Link href="/contact">
              Let's Work Together
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              GitHub
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline"
            >
              Twitter (X)
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

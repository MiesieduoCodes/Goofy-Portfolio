'use client';

import { motion } from "framer-motion";
import { Code2, Gamepad2, Camera, Music } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Scalable, modern web applications built with performance and accessibility at the core. Full-stack expertise.",
    href: "/services",
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    description:
      "Immersive interactive experiences and procedural engine design using modern physics and AI.",
    href: "/game-dev",
  },
  {
    icon: Camera,
    title: "Creative Media",
    description:
      "Professional photography and cinematic visual storytelling captured through a specialized lens.",
    href: "/photography",
  },
  {
    icon: Music,
    title: "Music Production",
    description:
      "Percussion and rhythm-based composition. Specialized in rhythmic textures for digital media.",
    href: "/music",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function WhatIDo() {
  return (
    <section className="section-spacing bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label">01 / What I Do</span>
        </motion.div>

        {/* Service Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
            >
              <Link
                href={service.href}
                className="group block p-6 rounded-xl border border-border bg-card card-hover h-full"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

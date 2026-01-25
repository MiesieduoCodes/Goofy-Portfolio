'use client';

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

export function FeaturedWork() {
  const [projects, setProjects] = useState<any[]>([])

  // Load featured projects from Firebase
  useEffect(() => {
    const projectsRef = ref(database, "websites")
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const projectsList = Object.entries(data)
          .map(([id, item]: [string, any]) => ({ id, ...item }))
          .slice(0, 3) // Get only first 3 projects for featured section
        setProjects(projectsList)
      }
    })
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };
  return (
    <section className="section-spacing bg-card">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="section-label text-xl">02 / Featured Work</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
              Digital Artifacts
            </h2>
          </div>
          <Link
            href="/work"
            className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all link-underline"
          >
            View All Projects
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              variants={itemVariants}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl mb-5 aspect-[4/3]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="tech-tag">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {project.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

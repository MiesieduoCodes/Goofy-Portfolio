"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  link: string
  delay?: number
}

export function ProjectCard({ title, description, image, tags, link, delay = 0 }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-xl border-2 border-border bg-background shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:border-primary/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 z-10 pointer-events-none"></div>
      
      <div className="aspect-video overflow-hidden relative">
        <motion.div 
          animate={{ scale: isHovered ? 1.1 : 1 }} 
          transition={{ duration: 0.6, ease: "easeOut" }} 
          className="h-full w-full"
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={600}
            height={340}
            className="h-full w-full object-cover transition-all duration-700"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="relative z-20 p-6 bg-background">
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.span 
              key={tag} 
              whileHover={{ scale: 1.05 }}
              className="rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm"
            >
              {tag}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Button asChild variant="default" className="group/button relative overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
            <Link href={link} className="relative z-10">
              View Project
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}


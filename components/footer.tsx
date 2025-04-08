"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Instagram, Linkedin, Twitter } from "lucide-react"
import Logo from "@/components/logo"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-bold">Miesieduo Veria</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Web Developer, Game Developer, Nature Photographer, and Drummer
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 md:col-span-2 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium">Portfolio</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/web" className="text-muted-foreground hover:text-foreground transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/games" className="text-muted-foreground hover:text-foreground transition-colors">
                    Game Development
                  </Link>
                </li>
                <li>
                  <Link href="/photography" className="text-muted-foreground hover:text-foreground transition-colors">
                    Photography
                  </Link>
                </li>
                <li>
                  <Link href="/music" className="text-muted-foreground hover:text-foreground transition-colors">
                    Music
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Me
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium">Social</h3>
              <div className="flex gap-3">
                <Link
                  href="https://github.com/goofydidthis"
                  className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="https://twitter.com/goofydidthis"
                  className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="https://instagram.com/goofydidthis"
                  className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/miesieduo-veria"
                  className="text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground"
        >
          <p>&copy; {new Date().getFullYear()} Miesieduo Veria. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}


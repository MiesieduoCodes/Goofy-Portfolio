"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Instagram, Linkedin, Twitter } from "lucide-react"
import Logo from "@/components/logo"

export default function Footer() {
  return (
    <footer className="relative border-t bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5OTk5OTkiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      <div className="container relative z-10 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Logo className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Miesieduo Veria</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
                <motion.a
                  href="https://github.com/MiesieduoCodes"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-muted p-2.5 text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                >
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </motion.a>
                <motion.a
                  href="https://x.com/MiesieduoVeria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-muted p-2.5 text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/goofy_did_this/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-muted p-2.5 text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </motion.a>
                <motion.a
                  href="https://ng.linkedin.com/in/goofydidthis"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-full bg-muted p-2.5 text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </motion.a>
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


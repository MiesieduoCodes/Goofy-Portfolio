"use client";

import Link from "next/link";
import { Github, Linkedin, Instagram, X, Zap, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { WorldClock, PlaceTime, LOCATIONS } from "@/components/world-clock";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/miesieduocodes", icon: Github },
  { name: "LinkedIn", href: "https://ng.linkedin.com/in/goofydidthis", icon: Linkedin },
  { name: "Instagram", href: "https://instagram.com/goofy_did_this/", icon: Instagram },
  { name: "Twitter", href: "https://x.com/miesieduoveria", icon: X },
];

const footerLinks = [
  { name: "Work", href: "/work" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="
      relative mt-40
      border-t border-white/10 
      bg-black/40 backdrop-blur-2xl
      overflow-hidden
    ">
      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[140px]" />
      </div>

      <div className="container-custom py-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-14">

          {/* BRAND */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold tracking-wide text-sm">
                MiesieduoVeria.
              </span>
            </motion.div>

            <p className="text-xs text-white/40 tracking-wide">
              © {new Date().getFullYear()} Miesieduo Veria — All rights reserved.
            </p>
          </div>

          {/* LINKS */}
          <div className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="
                  relative text-sm text-white/50 hover:text-white 
                  transition-colors tracking-wide
                  after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 
                  after:bg-white after:transition-all after:duration-300 
                  hover:after:w-full
                "
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* SOCIALS */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="
                  w-10 h-10 rounded-full flex items-center justify-center
                  bg-white/5 backdrop-blur-xl
                  border border-white/10 text-white/40
                  hover:text-white hover:border-white/40
                  transition-all
                "
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

        </div>

        {/* World clock */}
        <div className="mt-14">
          <WorldClock />
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mt-14" />

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between text-xs text-white/30 tracking-wider">
          <span className="flex items-center gap-2 uppercase tracking-[0.25em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Currently in {LOCATIONS.current.label} · <PlaceTime timeZone={LOCATIONS.current.timeZone} />
          </span>
          <span>Built with passion, precision & minimalism.</span>
          <a
            href="#top"
            className="group flex items-center gap-2 uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
          >
            Back to top
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white">
              <ArrowUp className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>

      {/* Giant wordmark */}
      <div aria-hidden className="relative z-0 select-none overflow-hidden">
        <motion.p
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "18%", opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center font-black uppercase leading-[0.8] tracking-tighter text-[10.5vw] bg-gradient-to-b from-white/25 via-white/10 to-transparent bg-clip-text text-transparent"
        >
          MiesieduoVeria.
        </motion.p>
      </div>
    </footer>
  );
}
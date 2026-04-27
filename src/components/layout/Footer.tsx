"use client";

import Link from "next/link";
import { Github, Linkedin, Instagram, X, Zap } from "lucide-react";
import { motion } from "framer-motion";

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

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mt-14" />

        {/* Bottom Text */}
        <div className="pt-6 text-center md:text-right text-xs text-white/30 tracking-wider">
          Built with passion, precision & minimalism.
        </div>

      </div>
    </footer>
  );
}
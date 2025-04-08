"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"
import Logo from "@/components/logo"

const routes = [
  { href: "/about", label: "About" },
  { href: "/web", label: "Web Dev" },
  { href: "/games", label: "Game Dev" },
  { href: "/photography", label: "Photography" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">Miesieduo Veria</span>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route, index) => (
            <motion.div key={route.href} variants={itemVariants} custom={index}>
              <Link
                href={route.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative group ${pathname === route.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {route.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
          <motion.div variants={itemVariants}>
            <ModeToggle />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button asChild size="sm" className="relative overflow-hidden group">
              <Link href="/admin">
                <span className="relative z-10">Admin</span>
                <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </Link>
            </Button>
          </motion.div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="container md:hidden py-4 pb-6"
        >
          <nav className="flex flex-col gap-4">
            {routes.map((route, index) => (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={route.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${pathname === route.href ? "text-primary" : "text-muted-foreground"}`}
                  onClick={() => setIsOpen(false)}
                >
                  {route.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: routes.length * 0.1 }}
            >
              <Button asChild size="sm" className="mt-2 w-full">
                <Link href="/admin">Admin</Link>
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}


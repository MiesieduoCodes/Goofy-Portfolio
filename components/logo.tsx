"use client"

import type { FC } from "react"
import { motion } from "framer-motion"

interface LogoProps {
  className?: string
}

const Logo: FC<LogoProps> = ({ className = "h-6 w-6" }) => {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
      <motion.path
        d="M30 35 Q 50 25, 70 35 Q 75 50, 70 65 Q 50 75, 30 65 Q 25 50, 30 35"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.circle
        cx="35"
        cy="45"
        r="5"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.circle
        cx="65"
        cy="45"
        r="5"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
      />
      <motion.path
        d="M40 60 Q 50 70, 60 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      />
    </motion.svg>
  )
}

export default Logo


"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

type AnimationContextType = {
  isFirstMount: boolean
  setIsFirstMount: (value: boolean) => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isFirstMount, setIsFirstMount] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    if (isFirstMount) {
      setIsFirstMount(false)
    }
  }, [isFirstMount])

  return (
    <AnimationContext.Provider value={{ isFirstMount, setIsFirstMount }}>
      <AnimatePresence mode="wait" initial={true}>
        <div key={pathname}>{children}</div>
      </AnimatePresence>
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider")
  }
  return context
}


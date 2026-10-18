'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { hasNavigated, signalIntroDone } from '@/lib/intro'

// Plays once per page load
let played = false
const COLUMNS = 6
const NAME_LINES = ['Miesieduo', 'Veria.']
const EASE = [0.76, 0, 0.24, 1] as const

// Entrance: a 000 → 100 counter while the name rises letter by letter,
// then the screen splits into columns that slide up to reveal the page.
// Plays when the site is opened or refreshed on the home page; any click, key or scroll skips it.
// With reduced motion the letters and columns don't move, they just appear and disappear.
export function HomeIntro() {
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState<'loading' | 'reveal'>('loading')
  const count = useMotionValue(0)
  const counterText = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))
  const barScale = useTransform(count, (v) => v / 100)
  const finished = useRef(false)

  const reveal = useCallback(() => {
    if (finished.current) return
    finished.current = true
    // Set here rather than on start, so React's dev-mode double effect run doesn't skip the intro
    played = true
    setPhase('reveal')
    signalIntroDone()
  }, [])

  useEffect(() => {
    if (played || hasNavigated()) {
      finished.current = true
      setVisible(false)
      signalIntroDone()
      return
    }

    const controls = animate(count, 100, { duration: 2, ease: [0.65, 0, 0.35, 1] })
    controls.then(() => setTimeout(reveal, 200))

    window.addEventListener('keydown', reveal)
    window.addEventListener('wheel', reveal, { passive: true })
    window.addEventListener('touchstart', reveal, { passive: true })

    return () => {
      controls.stop()
      window.removeEventListener('keydown', reveal)
      window.removeEventListener('wheel', reveal)
      window.removeEventListener('touchstart', reveal)
    }
  }, [count, reveal])

  const revealing = phase === 'reveal'

  return (
    <AnimatePresence>
      {visible && (
        <div key="intro" className="fixed inset-0 z-[1100] cursor-pointer" onClick={reveal} aria-hidden>
          {/* Columns that make up the black screen, then slide away */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLUMNS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-black -mx-px"
                initial={{ y: '0%' }}
                animate={{ y: revealing ? '-100%' : '0%' }}
                transition={{ duration: 0.9, ease: EASE, delay: revealing ? 0.25 + i * 0.07 : 0 }}
                onAnimationComplete={() => {
                  if (revealing && i === COLUMNS - 1) setVisible(false)
                }}
              />
            ))}
          </div>

          {/* Foreground content */}
          <motion.div
            className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10 text-white"
            animate={{ opacity: revealing ? 0 : 1, y: revealing ? -40 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
              <span>Portfolio ©{new Date().getFullYear()}</span>
              <span className="hidden sm:block">Web · Games · Photography · Music</span>
            </div>

            {/* Name, revealed letter by letter from behind a mask */}
            <div className="select-none">
              {NAME_LINES.map((line, lineIndex) => (
                <div key={line} className="overflow-hidden leading-[0.85]">
                  <div className="flex text-[15vw] md:text-[11vw] font-black uppercase tracking-tighter">
                    {line.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        className="inline-block font-black"
                        initial={{ y: '110%', rotate: 8 }}
                        animate={{ y: '0%', rotate: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 + lineIndex * 0.25 + i * 0.04 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row: progress bar and counter */}
            <div>
              <div className="mb-4 h-px w-full bg-white/10">
                <motion.div className="h-full origin-left bg-white" style={{ scaleX: barScale }} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
                  Loading experience — click to skip
                </span>
                <motion.span className="font-black tabular-nums leading-none text-6xl md:text-8xl">
                  {counterText}
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

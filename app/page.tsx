'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Stats } from '@/components/sections/Stats'
import { WhatIDo } from '@/components/sections/WhatIDo'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { CallToAction } from '@/components/sections/CallToAction'

const preludeTexts = [
  "CREATIVE",
  "DEVELOPER", 
  "DESIGNER",
  "INNOVATOR"
]

export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showPrelude, setShowPrelude] = useState(true)
  const [showMainContent, setShowMainContent] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const textInterval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % preludeTexts.length)
        setIsTransitioning(false)
      }, 150)
    }, 800)

    const preludeTimeout = setTimeout(() => {
      setShowPrelude(false)
      setTimeout(() => setShowMainContent(true), 500)
    }, 6000)

    return () => {
      clearInterval(textInterval)
      clearTimeout(preludeTimeout)
    }
  }, [])

  if (showPrelude) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-wider transition-all duration-150 ease-in-out"
            style={{
              filter: isTransitioning ? 'blur(8px)' : 'blur(0px)',
              opacity: isTransitioning ? 0.3 : 1,
              transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
            }}
          >
            {preludeTexts[currentTextIndex]}
          </h1>
          <div 
            className="h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent mt-8 transition-all duration-150 ease-in-out"
            style={{
              width: '100%',
              filter: isTransitioning ? 'blur(4px)' : 'blur(0px)',
              opacity: isTransitioning ? 0.5 : 1
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen transition-opacity duration-1000 ease-in-out"
      style={{ opacity: showMainContent ? 1 : 0 }}
    >
      <Navbar />
      <Hero />
      <WhatIDo />
      <FeaturedWork />
      <Stats />
      <CallToAction />
      <Footer />
    </div>
  )
}

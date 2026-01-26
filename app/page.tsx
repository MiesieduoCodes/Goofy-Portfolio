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
  "CREATE",
  "DEVELOP", 
  "DESIGN",
  "INNOVATE"
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
      setTimeout(() => setShowMainContent(true), 300)
    }, 8000)

    return () => {
      clearInterval(textInterval)
      clearTimeout(preludeTimeout)
    }
  }, [])

  if (showPrelude) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Animated gradient circles scattered around */}
        <div className="absolute left-10 top-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-20 top-1/3 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-1/4 bottom-20 w-64 h-64 bg-green-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute right-1/3 bottom-1/4 w-80 h-80 bg-lime-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-green-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-lime-300/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        <div className="text-center relative z-10">
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

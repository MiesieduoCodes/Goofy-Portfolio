import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Stats } from '@/components/sections/Stats'
import { WhatIDo } from '@/components/sections/WhatIDo'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { CallToAction } from '@/components/sections/CallToAction'
import { HomeIntro } from '@/components/home-intro'
import { Marquee } from '@/components/sections/Marquee'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HomeIntro />
      <Hero />
      <WhatIDo />
      <Marquee />
      <FeaturedWork />
      <Stats />
      <CallToAction />
      <Footer />
    </div>
  )
}

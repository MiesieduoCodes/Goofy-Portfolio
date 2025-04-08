"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { FirebasePhotoGallery } from "@/components/firebase-photo-gallery"

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted pt-16 md:pt-24">
        <div className="container flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Photo Gallery</h1>
          </motion.div>

          <AnimatedText
            text="A collection of my nature photography work"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Browse My Photography</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">
              Explore my collection of nature photographs across different categories
            </p>
          </div>
        </ScrollReveal>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <ScrollReveal>
            <TabsList className="mb-8 w-full justify-start overflow-auto">
              <TabsTrigger value="all">All Photos</TabsTrigger>
              <TabsTrigger value="Landscapes">Landscapes</TabsTrigger>
              <TabsTrigger value="Wildlife">Wildlife</TabsTrigger>
              <TabsTrigger value="Macro">Macro</TabsTrigger>
            </TabsList>
          </ScrollReveal>

          <TabsContent value={activeCategory} className="mt-0">
            <FirebasePhotoGallery
              category={activeCategory === "all" ? undefined : activeCategory}
              columns={3}
              gap={6}
            />
          </TabsContent>
        </Tabs>
      </section>

      {/* About My Photography */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About My Photography</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">
                My approach to capturing the beauty of nature through the lens
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">My Philosophy</h3>
                  <p className="text-muted-foreground">
                    I believe that nature photography is about patience, observation, and respect for the natural world.
                    My goal is to capture moments that showcase the beauty, complexity, and fragility of our
                    environment, encouraging viewers to appreciate and protect it.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">My Process</h3>
                  <p className="text-muted-foreground">
                    Each photograph represents hours of research, planning, and waiting for the perfect moment. I often
                    revisit locations multiple times to capture them in different lighting conditions and seasons,
                    always striving to find unique perspectives that tell a compelling story.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Camera, Eye, X } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { PageTransition } from "@/components/page-transition"
import { PhotoBentoGrid } from "@/components/photo-bento-grid"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, get, query, orderByChild, limitToLast } from "firebase/database"

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`, // Realtime Database URL
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

interface Photo {
  id: string
  title: string
  image: string
  location?: string
  category?: string
  description?: string
  createdAt?: number
}

export default function PhotographyPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [featuredPhoto, setFeaturedPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedPhoto() {
      try {
        // Get the most recent photo to feature
        const photosRef = ref(database, "photos")
        const recentPhotoQuery = query(photosRef, orderByChild("createdAt"), limitToLast(1))

        const snapshot = await get(recentPhotoQuery)

        if (snapshot.exists()) {
          const photosData = snapshot.val()
          const photoId = Object.keys(photosData)[0]
          setFeaturedPhoto({
            id: photoId,
            ...photosData[photoId],
          })
        }
      } catch (err) {
        console.error("Error fetching featured photo:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPhoto()
  }, [])

  return (
    <PageTransition>
      <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-20 h-64 w-64 rounded-full bg-green-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Nature <span className="gradient-text">Photography</span>
            </h1>
          </motion.div>

          <AnimatedText
            text="Capturing the beauty and wonder of the natural world"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* Featured Photo */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Photograph</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">My most recent nature photograph</p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : featuredPhoto ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-8 overflow-hidden rounded-lg border"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={featuredPhoto.image || "/placeholder.svg?height=800&width=1200"}
                alt={featuredPhoto.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 md:p-8">
                <h3 className="text-2xl font-bold text-white">{featuredPhoto.title}</h3>
                <p className="mt-2 text-white/80">{featuredPhoto.location}</p>
                <Button
                  variant="default"
                  size="sm"
                  className="mt-4 w-fit bg-white text-black hover:bg-white/90"
                  onClick={() => setSelectedPhoto(featuredPhoto)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-lg border bg-muted flex justify-center items-center aspect-[16/9]">
            <p className="text-muted-foreground">No featured photo available</p>
          </div>
        )}
      </section>

      {/* Photo Gallery Preview */}
      <section className="container">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Photo Gallery</h2>
            <p className="mt-4 max-w-[700px] text-muted-foreground">Browse a selection of my nature photographs</p>
          </div>
        </ScrollReveal>

        <div className="mt-8">
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
              <PhotoBentoGrid
                category={activeCategory === "all" ? undefined : activeCategory}
                limit={8}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/photography/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-lg bg-background shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 rounded-full bg-background/50 backdrop-blur-sm"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-square md:aspect-auto">
                  <Image
                    src={selectedPhoto.image || "/placeholder.svg"}
                    alt={selectedPhoto.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col p-6">
                  <h3 className="text-2xl font-bold">{selectedPhoto.title}</h3>
                  <p className="mt-1 text-muted-foreground">{selectedPhoto.location}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedPhoto.createdAt && new Date(selectedPhoto.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-4">
                    <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {selectedPhoto.category}
                    </span>
                  </div>

                  <p className="mt-6">{selectedPhoto.description}</p>

                  <div className="mt-auto pt-6">
                    <Button asChild>
                      <Link href={`/photography/gallery`}>
                        View Full Gallery
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Equipment Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">My Equipment</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">
                The tools I use to capture the beauty of nature
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Camera Bodies",
                items: ["Canon EOS R5", "Sony Alpha a7 III", "Nikon Z7 II"],
              },
              {
                title: "Lenses",
                items: [
                  "Canon RF 24-70mm f/2.8L",
                  "Sony FE 100-400mm G Master",
                  "Nikon Z 70-200mm f/2.8 VR S",
                  "Sigma 150-600mm Sport",
                ],
              },
              {
                title: "Accessories",
                items: [
                  "Gitzo Traveler Carbon Fiber Tripod",
                  "Lee Filter System",
                  "DJI Mavic 3 Pro Drone",
                  "Lowepro ProTactic BP 450 AW II",
                ],
              },
            ].map((category, index) => (
              <ScrollReveal key={category.title} delay={0.1 * index}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center">
                      <Camera className="mr-2 h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold">{category.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {category.items.map((item) => (
                        <li key={item} className="flex items-center">
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <Card className="border-none bg-gradient-to-r from-primary/20 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Explore My Full Gallery</h2>
              <p className="max-w-[600px] text-muted-foreground">
                Visit my complete photo gallery to see more of my nature photography work and browse by category.
              </p>
            </ScrollReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Button size="lg" asChild className="mt-4">
                <Link href="/photography/gallery">
                  View Full Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </section>
      </div>
    </PageTransition>
  )
}


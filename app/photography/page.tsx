"use client"

import { useState, useEffect } from "react"
import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Camera, Eye, Download, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { initializeApp } from "firebase/app"
import { getFirestore, collection, onSnapshot, query, orderBy } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const photographyCategories = [
  {
    title: "Nature & Wildlife",
    description: "Capturing the raw beauty of the natural world and its inhabitants.",
    image: "/placeholder.svg",
  },
  {
    title: "Landscape",
    description: "Ethereal landscapes that tell stories of time and place.",
    image: "/placeholder.svg",
  },
  {
    title: "Architecture",
    description: "Modern and traditional structures through a creative lens.",
    image: "/placeholder.svg",
  },
  {
    title: "Commercial",
    description: "Professional photography for brands and businesses.",
    image: "/placeholder.svg",
  },
];

export default function Photography() {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "photos"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const photosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPhotos(photosData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching photos:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Get featured photos (first 3)
  const featuredPhotos = photos.slice(0, 3)

  // Count photos by category (case-insensitive and partial matching)
  const getCategoryCount = (category: string) => {
    return photos.filter(photo => {
      const photoCategory = (photo.category || "").toLowerCase()
      const targetCategory = category.toLowerCase()
      
      // Exact match
      if (photoCategory === targetCategory) return true
      
      // Partial matching for flexibility
      if (targetCategory.includes("nature") && photoCategory.includes("nature")) return true
      if (targetCategory.includes("nature") && photoCategory.includes("wildlife")) return true
      if (targetCategory.includes("landscape") && photoCategory.includes("landscape")) return true
      if (targetCategory.includes("architecture") && photoCategory.includes("architecture")) return true
      if (targetCategory.includes("commercial") && photoCategory.includes("commercial")) return true
      if (targetCategory.includes("commercial") && photoCategory.includes("urban")) return true
      
      return false
    }).length
  }

  // Update categories with actual counts
  const categoriesWithCounts = photographyCategories.map(category => ({
    ...category,
    count: getCategoryCount(category.title)
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Photography</span> Portfolio
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Through my lens, I capture the essence of moments, places, and stories. 
              Specializing in nature, wildlife, landscape, and architectural photography 
              with a focus on the unique beauty of Nigeria and beyond.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Portfolio
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link href="/contact">License Inquiries</Link>
              </Button>
            </div>
          </MotionDiv>
        </section>

        {/* Featured Photos */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Work</span>
            </h2>
            <p className="text-muted-foreground">
              A selection of my most recent and notable photography projects.
            </p>
          </MotionDiv>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPhotos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPhotos.map((photo, index) => (
                <MotionDiv
                  key={photo.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div className="glass rounded-xl overflow-hidden card-hover">
                    {/* Photo */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                      {photo.image ? (
                        <img 
                          src={photo.image} 
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="w-12 h-12 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300" />
                      </div>
                    </div>

                    {/* Photo Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                          {photo.category || "Photography"}
                        </span>
                        <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                        {photo.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {photo.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {photo.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {photo.location}
                          </div>
                        )}
                        {photo.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {photo.date}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No photos yet</h3>
              <p className="text-muted-foreground mb-4">
                Start adding photos to your portfolio to see them here.
              </p>
              <Button asChild>
                <Link href="/admin/photos">Add Your First Photo</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Categories Grid */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Photography <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-muted-foreground">
              Explore different genres and styles of photography I specialize in.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 gap-8">
            {categoriesWithCounts
              .filter(category => category.count > 0) // Only show categories with photos
              .sort((a, b) => b.count - a.count) // Sort by count (highest first)
              .map((category, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="glass rounded-xl overflow-hidden card-hover">
                  {/* Category Image */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-primary/30" />
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">{category.count} Photos</span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>

          {/* Show empty categories section if no photos exist */}
          {categoriesWithCounts.filter(category => category.count > 0).length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No photos in any category yet</h3>
              <p className="text-muted-foreground mb-4">
                Start adding photos to your portfolio to see them organized by category.
              </p>
              <Button asChild>
                <Link href="/admin/photos">Add Your First Photo</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Equipment Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Professional <span className="text-gradient">Equipment</span>
            </h2>
            <p className="text-muted-foreground">
              High-quality gear to ensure exceptional image quality and reliability.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-3">Cameras</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Sony Alpha A7R IV</li>
                <li>Sony Alpha A7 III</li>
                <li>Sony RX100 VII</li>
              </ul>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-3">Lenses</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Sony 24-70mm f/2.8 GM</li>
                <li>Sony 70-200mm f/2.8 GM</li>
                <li>Sony 85mm f/1.4 GM</li>
              </ul>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-3">Accessories</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>DJI Ronin Gimbal</li>
                <li>Profoto Lighting</li>
                <li>Manfrotto Tripods</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              License My <span className="text-gradient">Work</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              All photographs are available for licensing for commercial and editorial use. 
              Contact me for rates, usage rights, and custom photography projects.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button variant="hero" size="lg">
                  Get License Information
                </Button>
              </Link>
              <Button variant="heroOutline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Media Kit
              </Button>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

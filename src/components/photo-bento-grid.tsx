"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { database } from "@/lib/firebase"
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database"

interface PhotoBentoGridProps {
  category?: string
  limit?: number
}

export function PhotoBentoGrid({ category, limit = 12 }: PhotoBentoGridProps) {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)

  useEffect(() => {
    if (!database) {
      setLoading(false)
      return
    }

    const photosRef = ref(database, "photos")
    const photosQuery = query(photosRef, orderByChild("createdAt"), limitToLast(limit * 2))

    const unsubscribe = onValue(photosQuery, (snapshot) => {
      if (snapshot.exists()) {
        const photosData = snapshot.val()
        let photosList = Object.entries(photosData)
          .map(([id, item]: [string, any]) => ({ id, ...item }))
          .reverse()

        // Filter by category if specified
        if (category && category !== "all") {
          photosList = photosList.filter((photo: any) => photo.category === category)
        }

        // Limit results
        photosList = photosList.slice(0, limit)
        setPhotos(photosList)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [category, limit])

  const getGridClass = (index: number) => {
    // More scattered patterns for photos
    const patterns = [
      "md:col-span-2 md:row-span-3", // 0 - Extra Large Vertical
      "md:col-span-1 md:row-span-1", // 1 - Small
      "md:col-span-1 md:row-span-2", // 2 - Tall
      "md:col-span-1 md:row-span-1", // 3 - Small
      "md:col-span-3 md:row-span-1", // 4 - Wide
      "md:col-span-1 md:row-span-2", // 5 - Tall
      "md:col-span-2 md:row-span-2", // 6 - Large Square
      "md:col-span-1 md:row-span-1", // 7 - Small
      "md:col-span-1 md:row-span-1", // 8 - Small
      "md:col-span-2 md:row-span-2", // 9 - Large
      "md:col-span-1 md:row-span-3", // 10 - Extra Tall
      "md:col-span-1 md:row-span-1", // 11 - Small
      "md:col-span-2 md:row-span-1", // 12 - Medium Wide
      "md:col-span-1 md:row-span-1", // 13 - Small
      "md:col-span-1 md:row-span-2", // 14 - Tall
      "md:col-span-1 md:row-span-1", // 15 - Small
      "md:col-span-3 md:row-span-2", // 16 - Large Wide
      "md:col-span-1 md:row-span-1", // 17 - Small
      "md:col-span-1 md:row-span-1", // 18 - Small
      "md:col-span-2 md:row-span-1", // 19 - Medium Wide
    ]
    return patterns[index % patterns.length]
  }

  const getItemType = (index: number) => {
    const pattern = index % 20
    if ([0, 6, 9, 16].includes(pattern)) return "large"
    if ([2, 5, 10, 14].includes(pattern)) return "tall"
    if ([4, 12, 19].includes(pattern)) return "wide"
    return "small"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-12 text-center text-muted-foreground">
        No photos available in this category.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[minmax(200px,auto)]">
        {photos.map((photo, index) => {
          const itemType = getItemType(index)
          const isLarge = itemType === "large"
          const isWide = itemType === "wide"
          const isTall = itemType === "tall"

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={cn(
                "group relative overflow-hidden rounded-xl border-2 border-border bg-background transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 cursor-pointer",
                getGridClass(index)
              )}
              onClick={() => setSelectedPhoto(photo)}
            >
              <Card className="h-full border-0 bg-transparent">
                <CardContent className="relative h-full p-0">
                  {/* Image */}
                  <div className={cn(
                    "relative overflow-hidden",
                    isLarge ? "h-3/4" : isWide ? "h-1/2" : isTall ? "h-full" : "h-64"
                  )}>
                    <Image
                      src={photo.image || "/placeholder.svg"}
                      alt={photo.title || "Nature photograph"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category badge */}
                    {photo.category && (
                      <div className="absolute top-4 left-4">
                        <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
                          {photo.category}
                        </span>
                      </div>
                    )}

                    {/* View button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>

                  {/* Content for large, wide, and tall items */}
                  {(isLarge || isWide || isTall) && (
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent",
                      isLarge ? "p-6" : isWide ? "p-5" : "p-4"
                    )}>
                      <h3 className={cn(
                        "font-bold mb-1 group-hover:text-primary transition-colors",
                        isLarge ? "text-xl" : "text-lg"
                      )}>
                        {photo.title || "Untitled"}
                      </h3>
                      {photo.location && (
                        <p className="text-sm text-muted-foreground">{photo.location}</p>
                      )}
                      {photo.description && isLarge && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{photo.description}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

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
              className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-lg bg-background shadow-xl border-2"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src={selectedPhoto.image || "/placeholder.svg"}
                  alt={selectedPhoto.title || "Nature photograph"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedPhoto.title || "Untitled"}</h3>
                {selectedPhoto.location && (
                  <p className="text-muted-foreground mb-1">{selectedPhoto.location}</p>
                )}
                {selectedPhoto.category && (
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4 w-fit">
                    {selectedPhoto.category}
                  </span>
                )}
                {selectedPhoto.description && (
                  <p className="mb-6 leading-relaxed">{selectedPhoto.description}</p>
                )}
                <Button asChild className="mt-auto">
                  <Link href="/photography/gallery">
                    View Full Gallery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}



"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X, ArrowLeft, ArrowRight, ZoomIn } from "lucide-react"

interface Photo {
  id: string | number
  src: string
  alt: string
  caption?: string
  category?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
  columns?: number
  gap?: number
  className?: string
}

export function PhotoGallery({ photos, columns = 3, gap = 4, className = "" }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const handlePhotoClick = (photo: Photo, index: number) => {
    setSelectedPhoto(photo)
    setSelectedIndex(index)
  }

  const handleClose = () => {
    setSelectedPhoto(null)
  }

  const handlePrevious = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1
    setSelectedPhoto(photos[newIndex])
    setSelectedIndex(newIndex)
  }

  const handleNext = () => {
    const newIndex = selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0
    setSelectedPhoto(photos[newIndex])
    setSelectedIndex(newIndex)
  }

  // Calculate grid columns based on the columns prop
  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    }[columns] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

  // Calculate gap size
  const gapSize =
    {
      2: "gap-2",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    }[gap] || "gap-4"

  return (
    <div className={className}>
      <div className={`grid ${gridCols} ${gapSize}`}>
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group cursor-pointer overflow-hidden rounded-lg border bg-card"
            onClick={() => handlePhotoClick(photo, index)}
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            {photo.caption && (
              <div className="p-3">
                <p className="text-sm font-medium">{photo.caption}</p>
                {photo.category && <p className="text-xs text-muted-foreground">{photo.category}</p>}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-lg bg-card shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] md:aspect-[16/9] w-full max-w-5xl">
                <Image
                  src={selectedPhoto.src || "/placeholder.svg"}
                  alt={selectedPhoto.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-contain"
                />
              </div>

              {selectedPhoto.caption && (
                <div className="p-4 text-center">
                  <p className="text-lg font-medium">{selectedPhoto.caption}</p>
                  {selectedPhoto.category && <p className="text-sm text-muted-foreground">{selectedPhoto.category}</p>}
                </div>
              )}

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 z-10 rounded-full bg-background/50 backdrop-blur-sm"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm"
                onClick={handlePrevious}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/50 backdrop-blur-sm"
                onClick={handleNext}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

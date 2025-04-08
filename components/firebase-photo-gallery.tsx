"use client"

import { useState, useEffect } from "react"
import { PhotoGallery } from "@/components/photo-gallery"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database"

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

interface FirebasePhotoGalleryProps {
  category?: string
  limit?: number
  columns?: number
  gap?: number
  className?: string
}

export function FirebasePhotoGallery({
  category,
  limit,
  columns = 3,
  gap = 4,
  className = "",
}: FirebasePhotoGalleryProps) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true)

        // Reference to the photos node in the Realtime Database
        const photosRef = ref(database, "photos")

        // Fetch photos
        let snapshot

        if (category && category !== "all") {
          // If category is specified, query by category
          const categoryQuery = query(photosRef, orderByChild("category"), equalTo(category))
          snapshot = await get(categoryQuery)
        } else {
          // Otherwise, get all photos
          snapshot = await get(photosRef)
        }

        if (snapshot.exists()) {
          // Convert to array and format for PhotoGallery
          const photosData = snapshot.val()
          let fetchedPhotos = Object.entries(photosData).map(([id, data]) => {
            return {
              id,
              src: data.image,
              alt: data.title,
              caption: data.title,
              category: data.category,
            }
          })

          // Sort by createdAt if available (newest first)
          fetchedPhotos.sort((a, b) => {
            const dateA = photosData[a.id].createdAt || 0
            const dateB = photosData[b.id].createdAt || 0
            return dateB - dateA
          })

          // Apply limit if specified
          if (limit) {
            fetchedPhotos = fetchedPhotos.slice(0, limit)
          }

          setPhotos(fetchedPhotos)
        } else {
          setPhotos([])
        }
      } catch (err) {
        console.error("Error fetching photos:", err)
        setError("Failed to load photos")
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [category, limit])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-3 text-muted-foreground">Loading photos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
        <p className="text-muted-foreground mt-2">Please try again later</p>
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No photos found</p>
      </div>
    )
  }

  return <PhotoGallery photos={photos} columns={columns} gap={gap} className={className} />
}


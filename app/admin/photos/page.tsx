"use client"

import { useState, useEffect } from "react"
import { MotionDiv } from "@/components/motion"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Upload, X, Camera } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "landscape",
    tags: "",
    featured: false
  })

  // Load photos from Firebase
  useEffect(() => {
    const photosQuery = query(collection(db, "photos"), orderBy("createdAt", "desc"))
    const unsubscribePhotos = onSnapshot(photosQuery, (snapshot) => {
      const photosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPhotos(photosData)
      console.log("📸 Photos loaded:", photosData)
    })

    return () => unsubscribePhotos()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const photoData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        updatedAt: Date.now()
      }

      if (editingId) {
        await updateDoc(doc(db, "photos", editingId), photoData)
        console.log("✅ Photo updated:", formData.title)
      } else {
        await setDoc(doc(collection(db, "photos")), {
          ...photoData,
          createdAt: Date.now()
        })
        console.log("✅ Photo added:", formData.title)
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
        category: "landscape",
        tags: "",
        featured: false
      })
      setEditingId(null)
    } catch (error) {
      console.error("❌ Error saving photo:", error)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      try {
        await deleteDoc(doc(db, "photos", id))
        console.log("✅ Photo deleted")
      } catch (error) {
        console.error("❌ Error deleting photo:", error)
      }
    }
  }

  // Handle edit
  const handleEdit = (photo: any) => {
    setFormData({
      title: photo.title || "",
      description: photo.description || "",
      image: photo.image || "",
      category: photo.category || "landscape",
      tags: (photo.tags || []).join(", "),
      featured: photo.featured || false
    })
    setEditingId(photo.id)
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const storageRef_instance = storageRef(storage, `photos/${Date.now()}-${file.name}`)
      await uploadBytes(storageRef_instance, file)
      const downloadURL = await getDownloadURL(storageRef_instance)
      setFormData(prev => ({ ...prev, image: downloadURL }))
      console.log("✅ Image uploaded:", downloadURL)
    } catch (error) {
      console.error("❌ Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "landscape": return "bg-green-100 text-green-800"
      case "wildlife": return "bg-yellow-100 text-yellow-800"
      case "urban": return "bg-blue-100 text-blue-800"
      case "portrait": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <div className="container-custom py-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Photo <span className="text-gradient">Gallery</span>
                </h1>
                <p className="text-muted-foreground">Manage your photography portfolio</p>
              </div>
              <Button asChild>
                <a href="/admin">
                  <X className="mr-2 h-4 w-4" />
                  Back to Admin
                </a>
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      {editingId ? "Edit Photo" : "Add New Photo"}
                    </CardTitle>
                    <CardDescription>
                      {editingId ? "Update photo information" : "Add a new photo to your gallery"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Photo title"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the photo"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="landscape">Landscape</option>
                          <option value="wildlife">Wildlife</option>
                          <option value="urban">Urban</option>
                          <option value="portrait">Portrait</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="nature, landscape, sunset"
                        />
                      </div>

                      <div>
                        <Label htmlFor="image">Photo</Label>
                        <div className="space-y-2">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                          {formData.image && (
                            <div className="relative">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                className="w-full h-48 object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="featured">Featured Photo</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={uploading}>
                          {uploading ? "Uploading..." : (editingId ? "Update" : "Add Photo")}
                        </Button>
                        {editingId && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null)
                              setFormData({
                                title: "",
                                description: "",
                                image: "",
                                category: "landscape",
                                tags: "",
                                featured: false
                              })
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Photos List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Photo Gallery ({photos.length})</CardTitle>
                    <CardDescription>Your photography portfolio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {photos.length === 0 ? (
                        <div className="text-center py-12">
                          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No photos added yet. Upload your first photo above.</p>
                        </div>
                      ) : (
                        photos.map((photo) => (
                          <div key={photo.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{photo.title}</h3>
                                  <Badge className={getCategoryColor(photo.category)}>
                                    {photo.category}
                                  </Badge>
                                  {photo.featured && <Badge variant="default">Featured</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{photo.description}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {(photo.tags || []).map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(photo)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(photo.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {photo.image && (
                              <img 
                                src={photo.image} 
                                alt={photo.title}
                                className="w-full h-48 object-cover rounded-md"
                              />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </MotionDiv>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Upload, X, Camera } from "lucide-react"
import AdminLayout from "../components/AdminLayout"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { uploadFiles } from "@/lib/upload"

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    images: [] as string[],
    category: "landscape",
    tags: "",
    featured: false
  })
  const formRef = useRef<HTMLDivElement>(null)

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

  // Auto-edit from URL query param
  useEffect(() => {
    if (typeof window !== "undefined" && photos.length > 0) {
      const params = new URLSearchParams(window.location.search)
      const editId = params.get("edit")
      if (editId) {
        const item = photos.find(p => p.id === editId)
        if (item) {
          handleEdit(item)
          // Clean URL parameter so it doesn't re-trigger on subsequent updates
          const newUrl = window.location.pathname
          window.history.replaceState({}, "", newUrl)
        }
      }
    }
  }, [photos])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    
    try {
      const parsedTags = typeof formData.tags === "string" 
        ? formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
        : Array.isArray(formData.tags) 
          ? formData.tags 
          : []

      const photoData = {
        ...formData,
        tags: parsedTags,
        updatedAt: Date.now()
      }

      if (editingId) {
        await updateDoc(doc(db, "photos", editingId), photoData)
        setSuccess("✅ Photo updated successfully!")
        console.log("✅ Photo updated:", formData.title)
      } else {
        await setDoc(doc(collection(db, "photos")), {
          ...photoData,
          createdAt: Date.now()
        })
        setSuccess("✅ Photo added successfully!")
        console.log("✅ Photo added:", formData.title)
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
        images: [],
        category: "landscape",
        tags: "",
        featured: false
      })
      setEditingId(null)
    } catch (err: any) {
      console.error("❌ Error saving photo:", err)
      setError(err?.message || "❌ Error saving photo. Please try again.")
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    setSuccess(null)
    setError(null)
    if (confirm("Are you sure you want to delete this photo?")) {
      try {
        await deleteDoc(doc(db, "photos", id))
        setSuccess("✅ Photo deleted successfully!")
        console.log("✅ Photo deleted")
      } catch (err: any) {
        console.error("❌ Error deleting photo:", err)
        setError(err?.message || "❌ Error deleting photo. Please try again.")
      }
    }
  }

  // Handle edit
  const handleEdit = (photo: any) => {
    setSuccess(null)
    setError(null)

    let tagsString = ""
    if (Array.isArray(photo.tags)) {
      tagsString = photo.tags.join(", ")
    } else if (typeof photo.tags === "string") {
      tagsString = photo.tags
    }

    setFormData({
      title: photo.title || "",
      description: photo.description || "",
      image: photo.image || "",
      images: photo.images || [],
      category: photo.category || "landscape",
      tags: tagsString,
      featured: photo.featured || false
    })
    setEditingId(photo.id)
    // Scroll to form
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadProgress(0)
    setUploading(true)
    try {
      const [downloadURL] = await uploadFiles("photos", [file], setUploadProgress)
      setFormData(prev => ({ ...prev, image: downloadURL }))
    } catch (error) {
      console.error("❌ Error uploading image:", error)
      setError("Upload failed. Make sure you are signed in and the file is an image under 15MB.")
    } finally {
      setUploading(false)
    }
  }

  // Handle multiple screenshot/additional view uploads
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadProgress(0)
    setUploadingScreenshots(true)
    try {
      const urls = await uploadFiles("photos/screenshots", Array.from(files), setUploadProgress)
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch (error) {
      console.error("❌ Error uploading screenshots:", error)
      setError("Upload failed. Make sure you are signed in and the file is an image under 15MB.")
    } finally {
      setUploadingScreenshots(false)
      e.target.value = ""
    }
  }

  // Remove a screenshot by index
  const removeScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "landscape": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      case "wildlife": return "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      case "urban": return "bg-blue-500/10 text-blue-400 border border-blue-500/20"
      case "portrait": return "bg-purple-500/10 text-purple-400 border border-purple-500/20"
      default: return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
    }
  }

  return (
    <AdminLayout title="Photo Gallery" description="Manage your photography portfolio">
      <div className="container-custom py-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1" ref={formRef}>
              <Card className={editingId ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : ''}>
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
                    {success && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-md text-sm">
                        {success}
                      </div>
                    )}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}
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
                        className="w-full p-2 border rounded-md bg-background text-foreground border-input"
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
                        {uploading && <p className="text-xs text-muted-foreground mt-1 animate-pulse">Uploading… {uploadProgress}%</p>}
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

                    <div>
                      <Label htmlFor="screenshots">Additional Views/Screenshots</Label>
                      <p className="text-xs text-muted-foreground mb-2">Upload multiple angles or views of this photography entry</p>
                      <Input
                        id="screenshots"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleScreenshotUpload}
                        disabled={uploadingScreenshots}
                      />
                      {uploadingScreenshots && (
                        <p className="text-xs text-muted-foreground mt-1 animate-pulse">Uploading screenshots… {uploadProgress}%</p>
                      )}
                      {formData.images && formData.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          {formData.images.map((imgUrl, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={imgUrl}
                                alt={`Additional View ${idx + 1}`}
                                className="w-full h-20 object-cover rounded-md border border-border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeScreenshot(idx)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
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
                      <Button type="submit" className="flex-1" disabled={uploading || uploadingScreenshots}>
                        {(uploading || uploadingScreenshots) ? `Uploading… ${uploadProgress}%` : (editingId ? "Update" : "Add Photo")}
                      </Button>
                      {editingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setSuccess(null)
                            setError(null)
                            setEditingId(null)
                            setFormData({
                              title: "",
                              description: "",
                              image: "",
                              images: [],
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
                          {photo.images && photo.images.length > 0 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                              {photo.images.map((imgUrl: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={imgUrl}
                                  alt={`${photo.title} screenshot ${idx + 1}`}
                                  className="h-16 w-24 object-cover rounded-md border border-border flex-shrink-0"
                                />
                              ))}
                            </div>
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
    </AdminLayout>
  )
}


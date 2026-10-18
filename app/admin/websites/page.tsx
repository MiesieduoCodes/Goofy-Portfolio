"use client"

import { useState, useEffect, useRef } from "react"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, ExternalLink, Upload, X } from "lucide-react"
import AdminLayout from "../components/AdminLayout"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { uploadFiles } from "@/lib/upload"

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<any[]>([])
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
    link: "",
    tags: "",
    category: "web",
    featured: false
  })
  const formRef = useRef<HTMLDivElement>(null)

  // Load websites from Firebase
  useEffect(() => {
    const websitesQuery = query(collection(db, "websites"), orderBy("createdAt", "desc"))
    const unsubscribeWebsites = onSnapshot(websitesQuery, (snapshot) => {
      const websitesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setWebsites(websitesData)
      console.log("🌐 Websites loaded:", websitesData)
    })

    return () => unsubscribeWebsites()
  }, [])

  // Auto-edit from URL query param
  useEffect(() => {
    if (typeof window !== "undefined" && websites.length > 0) {
      const params = new URLSearchParams(window.location.search)
      const editId = params.get("edit")
      if (editId) {
        const item = websites.find(w => w.id === editId)
        if (item) {
          handleEdit(item)
          // Clean URL parameter so it doesn't re-trigger on subsequent updates
          const newUrl = window.location.pathname
          window.history.replaceState({}, "", newUrl)
        }
      }
    }
  }, [websites])

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

      const websiteData = {
        ...formData,
        tags: parsedTags,
        updatedAt: Date.now()
      }

      if (editingId) {
        await updateDoc(doc(db, "websites", editingId), websiteData)
        setSuccess("✅ Website updated successfully!")
        console.log("✅ Website updated:", formData.title)
      } else {
        await setDoc(doc(collection(db, "websites")), {
          ...websiteData,
          createdAt: Date.now()
        })
        setSuccess("✅ Website added successfully!")
        console.log("✅ Website added:", formData.title)
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
        images: [],
        link: "",
        tags: "",
        category: "web",
        featured: false
      })
      setEditingId(null)
    } catch (err: any) {
      console.error("❌ Error saving website:", err)
      setError(err?.message || "❌ Error saving website. Please try again.")
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    setSuccess(null)
    setError(null)
    if (confirm("Are you sure you want to delete this website?")) {
      try {
        await deleteDoc(doc(db, "websites", id))
        setSuccess("✅ Website deleted successfully!")
        console.log("✅ Website deleted")
      } catch (err: any) {
        console.error("❌ Error deleting website:", err)
        setError(err?.message || "❌ Error deleting website. Please try again.")
      }
    }
  }

  // Handle edit
  const handleEdit = (website: any) => {
    setSuccess(null)
    setError(null)
    
    let tagsString = ""
    if (Array.isArray(website.tags)) {
      tagsString = website.tags.join(", ")
    } else if (typeof website.tags === "string") {
      tagsString = website.tags
    }

    setFormData({
      title: website.title || "",
      description: website.description || "",
      image: website.image || "",
      images: website.images || [],
      link: website.link || "",
      tags: tagsString,
      category: website.category || "web",
      featured: website.featured || false
    })
    setEditingId(website.id)
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
      const [downloadURL] = await uploadFiles("websites", [file], setUploadProgress)
      setFormData(prev => ({ ...prev, image: downloadURL }))
    } catch (error) {
      console.error("❌ Error uploading image:", error)
      setError("Upload failed. Make sure you are signed in and the file is an image under 15MB.")
    } finally {
      setUploading(false)
    }
  }

  // Handle multiple screenshot uploads
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadProgress(0)
    setUploadingScreenshots(true)
    try {
      const urls = await uploadFiles("websites/screenshots", Array.from(files), setUploadProgress)
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch (error) {
      console.error("❌ Error uploading screenshots:", error)
      setError("Upload failed. Make sure you are signed in and the file is an image under 15MB.")
    } finally {
      setUploadingScreenshots(false)
      // Reset file input
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

  return (
    <AdminLayout title="Website Management" description="Manage your web development portfolio projects">
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
                      {editingId ? "Edit Website" : "Add New Website"}
                    </CardTitle>
                    <CardDescription>
                      {editingId ? "Update website information" : "Add a new website project to your portfolio"}
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
                          placeholder="Website name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the website"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">Type</Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded-md bg-background text-foreground border-input"
                        >
                          <option value="web">Website (shows on /web)</option>
                          <option value="mobile">Mobile app (shows on /mobile)</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="link">Live URL</Label>
                        <Input
                          id="link"
                          type="url"
                          value={formData.link}
                          onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                          placeholder="https://example.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="tags">Technologies (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="React, Next.js, TypeScript"
                        />
                      </div>

                      <div>
                        <Label htmlFor="image">Image</Label>
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
                                className="w-full h-32 object-cover rounded-md"
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
                        <Label htmlFor="screenshots">Project Screenshots</Label>
                        <p className="text-xs text-muted-foreground mb-2">Upload multiple views/screenshots of the project</p>
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
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {formData.images.map((imgUrl, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={imgUrl}
                                  alt={`Screenshot ${idx + 1}`}
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
                        <Label htmlFor="featured">Featured Project</Label>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1" disabled={uploading || uploadingScreenshots}>
                          {(uploading || uploadingScreenshots) ? `Uploading… ${uploadProgress}%` : (editingId ? "Update" : "Add Website")}
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
                                link: "",
                                tags: "",
                                category: "web",
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

              {/* Websites List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Published Websites ({websites.length})</CardTitle>
                    <CardDescription>Your web development portfolio projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {websites.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No websites added yet. Create your first website above.</p>
                        </div>
                      ) : (
                        websites.map((website) => (
                          <div key={website.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{website.title}</h3>
                                  {website.featured && <Badge variant="default">Featured</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{website.description}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {(website.tags || []).map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={website.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {website.link}
                                  </a>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(website)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(website.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {website.image && (
                              <img 
                                src={website.image} 
                                alt={website.title}
                                className="w-full h-32 object-cover rounded-md"
                              />
                            )}
                            {website.images && website.images.length > 0 && (
                              <div className="flex gap-2 mt-2 overflow-x-auto">
                                {website.images.map((imgUrl: string, idx: number) => (
                                  <img
                                    key={idx}
                                    src={imgUrl}
                                    alt={`${website.title} screenshot ${idx + 1}`}
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

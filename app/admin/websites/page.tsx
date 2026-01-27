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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit2, Trash2, ExternalLink, Upload, X } from "lucide-react"
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

export default function AdminWebsitesPage() {
  const [websites, setWebsites] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    tags: "",
    category: "web",
    featured: false
  })

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const websiteData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        updatedAt: Date.now()
      }

      if (editingId) {
        await updateDoc(doc(db, "websites", editingId), websiteData)
        console.log("✅ Website updated:", formData.title)
      } else {
        await setDoc(doc(collection(db, "websites")), {
          ...websiteData,
          createdAt: Date.now()
        })
        console.log("✅ Website added:", formData.title)
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        tags: "",
        category: "web",
        featured: false
      })
      setEditingId(null)
    } catch (error) {
      console.error("❌ Error saving website:", error)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this website?")) {
      try {
        await deleteDoc(doc(db, "websites", id))
        console.log("✅ Website deleted")
      } catch (error) {
        console.error("❌ Error deleting website:", error)
      }
    }
  }

  // Handle edit
  const handleEdit = (website: any) => {
    setFormData({
      title: website.title || "",
      description: website.description || "",
      image: website.image || "",
      link: website.link || "",
      tags: (website.tags || []).join(", "),
      category: website.category || "web",
      featured: website.featured || false
    })
    setEditingId(website.id)
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const storageRef_instance = storageRef(storage, `websites/${Date.now()}-${file.name}`)
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
                  Website <span className="text-gradient">Management</span>
                </h1>
                <p className="text-muted-foreground">Manage your web development portfolio projects</p>
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
                      {editingId ? "Edit Website" : "Add New Website"}
                    </CardTitle>
                    <CardDescription>
                      {editingId ? "Update website information" : "Add a new website project to your portfolio"}
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
                        <Button type="submit" className="flex-1" disabled={uploading}>
                          {uploading ? "Uploading..." : (editingId ? "Update" : "Add Website")}
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

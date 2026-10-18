"use client"

import { useState, useEffect, useRef } from "react"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Upload, X } from "lucide-react"
import AdminLayout from "../components/AdminLayout"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { uploadFiles } from "@/lib/upload"

export default function AdminGamesPage() {
  const [games, setGames] = useState<any[]>([])
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
    category: "games",
    featured: false
  })
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "games"), orderBy("createdAt", "desc")), (snapshot) => {
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [])

  // Auto-edit from URL query param
  useEffect(() => {
    if (typeof window !== "undefined" && games.length > 0) {
      const params = new URLSearchParams(window.location.search)
      const editId = params.get("edit")
      if (editId) {
        const item = games.find(g => g.id === editId)
        if (item) {
          handleEdit(item)
          // Clean URL parameter so it doesn't re-trigger on subsequent updates
          const newUrl = window.location.pathname
          window.history.replaceState({}, "", newUrl)
        }
      }
    }
  }, [games])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    try {
      const parsedTags = typeof formData.tags === "string" 
        ? formData.tags.split(",").map(t => t.trim()).filter(t => t)
        : Array.isArray(formData.tags) 
          ? formData.tags 
          : []

      const data = { ...formData, tags: parsedTags }
      if (editingId) {
        await updateDoc(doc(db, "games", editingId), { ...data, updatedAt: Date.now() })
        setSuccess("✅ Game updated successfully!")
      } else {
        await setDoc(doc(collection(db, "games")), { ...data, createdAt: Date.now() })
        setSuccess("✅ Game added successfully!")
      }
      setFormData({ title: "", description: "", image: "", images: [], link: "", tags: "", category: "games", featured: false })
      setEditingId(null)
    } catch (err: any) {
      console.error("Error:", err)
      setError(err?.message || "❌ Error saving game. Please try again.")
    }
  }

  const handleDelete = async (id: string) => {
    setSuccess(null)
    setError(null)
    if (confirm("Delete this game?")) {
      try {
        await deleteDoc(doc(db, "games", id))
        setSuccess("✅ Game deleted successfully!")
      } catch (err: any) {
        console.error("Error:", err)
        setError(err?.message || "❌ Error deleting game. Please try again.")
      }
    }
  }

  const handleEdit = (game: any) => {
    setSuccess(null)
    setError(null)

    let tagsString = ""
    if (Array.isArray(game.tags)) {
      tagsString = game.tags.join(", ")
    } else if (typeof game.tags === "string") {
      tagsString = game.tags
    }

    setFormData({
      title: game.title || "",
      description: game.description || "",
      image: game.image || "",
      images: game.images || [],
      link: game.link || "",
      tags: tagsString,
      category: game.category || "games",
      featured: game.featured || false
    })
    setEditingId(game.id)
    // Scroll to form
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadProgress(0)
    setUploading(true)
    try {
      const [url] = await uploadFiles("games", [file], setUploadProgress)
      setFormData(prev => ({ ...prev, image: url }))
    } catch (error) {
      console.error("Upload error:", error)
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
      const urls = await uploadFiles("games/screenshots", Array.from(files), setUploadProgress)
      setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch (error) {
      console.error("Upload error:", error)
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

  return (
    <AdminLayout title="Game Management" description="Manage your game development portfolio projects">
      <div className="container-custom py-8">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1" ref={formRef}>
              <Card className={editingId ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    {editingId ? "Edit Game" : "Add Game"}
                  </CardTitle>
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
                      <Label>Title</Label>
                      <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Game name" required />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} required />
                    </div>
                    <div>
                      <Label>Game URL or Demo</Label>
                      <Input type="url" value={formData.link} onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))} placeholder="https://example.com or #" />
                    </div>
                    <div>
                      <Label>Technologies</Label>
                      <Input value={formData.tags} onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))} placeholder="Unity, C#, 3D Modeling" />
                    </div>
                    <div>
                      <Label>Screenshot</Label>
                      <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      {uploading && <p className="text-xs text-muted-foreground mt-1 animate-pulse">Uploading… {uploadProgress}%</p>}
                      {formData.image && (
                        <div className="relative mt-2">
                          <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setFormData(prev => ({ ...prev, image: "" }))}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Project Screenshots</Label>
                      <p className="text-xs text-muted-foreground mb-2">Upload multiple views/screenshots</p>
                      <Input type="file" accept="image/*" multiple onChange={handleScreenshotUpload} disabled={uploadingScreenshots} />
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
                      <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="rounded" />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={uploading || uploadingScreenshots}>
                        {(uploading || uploadingScreenshots) ? `Uploading… ${uploadProgress}%` : (editingId ? "Update" : "Add")}
                      </Button>
                      {editingId && (
                        <Button type="button" variant="outline" onClick={() => { setSuccess(null); setError(null); setEditingId(null); setFormData({ title: "", description: "", image: "", images: [], link: "", tags: "", category: "games", featured: false }); }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Games ({games.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {games.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No games yet. Add your first game above.</p>
                      </div>
                    ) : (
                      games.map((game) => (
                        <div key={game.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{game.title}</h3>
                                {game.featured && <Badge>Featured</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {(game.tags || []).map((tag: string) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(game)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(game.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          {game.image && (
                            <img src={game.image} alt={game.title} className="w-full h-32 object-cover rounded-md" />
                          )}
                          {game.images && game.images.length > 0 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                              {game.images.map((imgUrl: string, idx: number) => (
                                <img
                                  key={idx}
                                  src={imgUrl}
                                  alt={`${game.title} screenshot ${idx + 1}`}
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

"use client"

import { useState, useEffect } from "react"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Upload, X } from "lucide-react"
import AdminLayout from "../components/AdminLayout"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

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
const storage = getStorage(app)

export default function AdminGamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    tags: "",
    category: "games",
    featured: false
  })

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "games"), orderBy("createdAt", "desc")), (snapshot) => {
      setGames(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return unsubscribe
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = { ...formData, tags: formData.tags.split(",").map(t => t.trim()).filter(t => t) }
      if (editingId) {
        await updateDoc(doc(db, "games", editingId), { ...data, updatedAt: Date.now() })
      } else {
        await setDoc(doc(collection(db, "games")), { ...data, createdAt: Date.now() })
      }
      setFormData({ title: "", description: "", image: "", link: "", tags: "", category: "games", featured: false })
      setEditingId(null)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Delete this game?")) {
      await deleteDoc(doc(db, "games", id))
    }
  }

  const handleEdit = (game: any) => {
    setFormData({
      title: game.title || "",
      description: game.description || "",
      image: game.image || "",
      link: game.link || "",
      tags: (game.tags || []).join(", "),
      category: game.category || "games",
      featured: game.featured || false
    })
    setEditingId(game.id)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const storageRef_instance = storageRef(storage, `games/${Date.now()}-${file.name}`)
      await uploadBytes(storageRef_instance, file)
      const url = await getDownloadURL(storageRef_instance)
      setFormData(prev => ({ ...prev, image: url }))
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <AdminLayout title="Game Management" description="Manage your game development portfolio projects">
      <div className="container-custom py-8">
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    {editingId ? "Edit Game" : "Add Game"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      {formData.image && (
                        <div className="relative mt-2">
                          <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                          <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setFormData(prev => ({ ...prev, image: "" }))}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))} className="rounded" />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" disabled={uploading}>
                        {uploading ? "Uploading..." : (editingId ? "Update" : "Add")}
                      </Button>
                      {editingId && (
                        <Button type="button" variant="outline" onClick={() => { setEditingId(null); setFormData({ title: "", description: "", image: "", link: "", tags: "", category: "games", featured: false }); }}>
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

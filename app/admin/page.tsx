"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, Globe, Gamepad2, Code, Camera, Wrench } from "lucide-react"
import { database } from "@/lib/firebase"
import { ref, push, set, onValue, remove, update } from "firebase/database"
import { PageTransition } from "@/components/page-transition"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("websites")
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Data states
  const [websites, setWebsites] = useState<any[]>([])
  const [games, setGames] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [techs, setTechs] = useState<any[]>([])
  const [pictures, setPictures] = useState<any[]>([])
  
  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    tags: "",
    category: "",
    location: "",
    name: "",
    level: "",
    technology: "",
  })

  // Load data from Firebase
  useEffect(() => {
    if (!database) {
      console.warn("Firebase database not initialized. Please configure Firebase environment variables.")
      return
    }

    const loadData = () => {
      // Load websites
      const websitesRef = ref(database, "websites")
      onValue(websitesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setWebsites(Object.entries(data).map(([id, item]: [string, any]) => ({ id, ...item })))
        }
      })

      // Load games
      const gamesRef = ref(database, "games")
      onValue(gamesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setGames(Object.entries(data).map(([id, item]: [string, any]) => ({ id, ...item })))
        }
      })

      // Load skills
      const skillsRef = ref(database, "skills")
      onValue(skillsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setSkills(Object.entries(data).map(([id, item]: [string, any]) => ({ id, ...item })))
        }
      })

      // Load techs
      const techsRef = ref(database, "techs")
      onValue(techsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setTechs(Object.entries(data).map(([id, item]: [string, any]) => ({ id, ...item })))
        }
      })

      // Load pictures
      const picturesRef = ref(database, "photos")
      onValue(picturesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setPictures(Object.entries(data).map(([id, item]: [string, any]) => ({ id, ...item })))
        }
      })
    }

    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      link: "",
      tags: "",
      category: "",
      location: "",
      name: "",
      level: "",
      technology: "",
    })
    setEditingId(null)
  }

  const handleSubmit = async (type: string) => {
    if (!database) {
      alert("Firebase is not configured. Please set up Firebase environment variables.")
      return
    }

    try {
      const dataToSave: any = { ...formData }
      
      // Process tags
      if (dataToSave.tags) {
        dataToSave.tags = dataToSave.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag)
      }
      
      // Clean up empty fields
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === "" || dataToSave[key] === null || dataToSave[key] === undefined) {
          delete dataToSave[key]
        }
      })
      
      if (editingId) {
        // Update existing
        const refPath = ref(database, `${type}/${editingId}`)
        await update(refPath, dataToSave)
      } else {
        // Create new
        const refPath = ref(database, type)
        await push(refPath, { ...dataToSave, createdAt: Date.now() })
      }
      
      resetForm()
    } catch (error) {
      console.error("Error saving data:", error)
      alert(`Error saving data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleEdit = (item: any, type: string) => {
    setFormData({
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
      link: item.link || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      category: item.category || "",
      location: item.location || "",
      name: item.name || "",
      level: item.level || "",
      technology: item.technology || "",
    })
    setEditingId(item.id)
  }

  const handleDelete = async (id: string, type: string) => {
    if (!database) {
      alert("Firebase is not configured. Please set up Firebase environment variables.")
      return
    }

    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const refPath = ref(database, `${type}/${id}`)
        await remove(refPath)
      } catch (error) {
        console.error("Error deleting data:", error)
        alert(`Error deleting data: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  const currentData = {
    websites,
    games,
    skills,
    techs,
    pictures,
  }[activeTab]

  if (!database) {
    return (
      <PageTransition>
        <div className="container py-8">
          <Card className="border-2 border-destructive">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Firebase Not Configured</h2>
              <p className="text-muted-foreground mb-4">
                Please configure Firebase environment variables to use the admin panel.
              </p>
              <p className="text-sm text-muted-foreground">
                Required: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID, etc.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="container py-8">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tighter gradient-text">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your portfolio content</p>
          </div>
        </ScrollReveal>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="websites">
              <Globe className="mr-2 h-4 w-4" />
              Websites
            </TabsTrigger>
            <TabsTrigger value="games">
              <Gamepad2 className="mr-2 h-4 w-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="skills">
              <Code className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="techs">
              <Wrench className="mr-2 h-4 w-4" />
              Techs
            </TabsTrigger>
            <TabsTrigger value="pictures">
              <Camera className="mr-2 h-4 w-4" />
              Pictures
            </TabsTrigger>
          </TabsList>

          {/* Websites Tab */}
          <TabsContent value="websites" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Add/Edit Website
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Website title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Website description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/images/example.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Next.js, React, TypeScript"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSubmit("websites")}>
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> Update</> : <><Plus className="mr-2 h-4 w-4" /> Add</>}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={resetForm}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {websites.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No websites added yet. Create your first website above.
                  </CardContent>
                </Card>
              ) : (
                websites.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h3 className="font-bold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item, "websites")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, "websites")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Add/Edit Game
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Game title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="/games/game-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Game description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/images/game.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Unity, C#, 3D"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSubmit("games")}>
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> Update</> : <><Plus className="mr-2 h-4 w-4" /> Add</>}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={resetForm}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {games.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No games added yet. Create your first game above.
                  </CardContent>
                </Card>
              ) : (
                games.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item, "games")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, "games")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Add/Edit Skill
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Skill name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Level (0-100)</Label>
                    <Input
                      type="number"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      placeholder="90"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSubmit("skills")}>
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> Update</> : <><Plus className="mr-2 h-4 w-4" /> Add</>}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={resetForm}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {skills.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No skills added yet. Create your first skill above.
                  </CardContent>
                </Card>
              ) : (
                skills.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Level: {item.level}%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item, "skills")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, "skills")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Techs Tab */}
          <TabsContent value="techs" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Add/Edit Technology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Technology Name</Label>
                  <Input
                    value={formData.technology}
                    onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
                    placeholder="React, Unity, etc."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSubmit("techs")}>
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> Update</> : <><Plus className="mr-2 h-4 w-4" /> Add</>}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={resetForm}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {techs.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No technologies added yet. Create your first technology above.
                  </CardContent>
                </Card>
              ) : (
                techs.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-bold">{item.technology}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item, "techs")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, "techs")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Pictures Tab */}
          <TabsContent value="pictures" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Add/Edit Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Picture title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Landscapes">Landscapes</SelectItem>
                        <SelectItem value="Wildlife">Wildlife</SelectItem>
                        <SelectItem value="Macro">Macro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/photo.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Location where photo was taken"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Picture description"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSubmit("photos")}>
                    {editingId ? <><Save className="mr-2 h-4 w-4" /> Update</> : <><Plus className="mr-2 h-4 w-4" /> Add</>}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={resetForm}>
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {pictures.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No pictures added yet. Create your first picture above.
                  </CardContent>
                </Card>
              ) : (
                pictures.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.category} • {item.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item, "photos")}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, "photos")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}


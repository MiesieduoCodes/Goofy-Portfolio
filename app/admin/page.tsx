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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Edit, Trash2, Save, X, Globe, Gamepad2, Code, Camera, Wrench, Briefcase, Smartphone } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { ScrollReveal } from "@/components/scroll-reveal"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, push, set, onValue, remove, update } from "firebase/database"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04",
  databaseURL: "https://miesieduocodes-default-rtdb.firebaseio.com"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("tools")
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Data states
  const [websites, setWebsites] = useState<any[]>([])
  const [games, setGames] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [techs, setTechs] = useState<any[]>([])
  const [pictures, setPictures] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  
  // Form states
  const [formData, setFormData] = useState({
    // Common fields
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
    
    // Tool fields
    toolName: "",
    toolLevel: "",
    toolCategory: "web",
    
    // Experience fields
    role: "",
    company: "",
    startYear: "",
    endYear: "",
    isPresent: false,
    experienceDescription: "",
    experienceDetails: "",
    align: "left",
  })

  // Load data from Firebase
  useEffect(() => {
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

      // Load tools
      const toolsRef = ref(database, "tools")
      onValue(toolsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setTools(Object.entries(data).map(([id, item]: [string, any]) => ({ id, ...item })))
        }
      })

      // Load experiences
      const experiencesRef = ref(database, "experiences")
      onValue(experiencesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setExperiences(Object.entries(data).map(([id, item]: [string, any]) => ({ id, ...item })))
        }
      })
    }

    loadData()
  }, [])

  const resetForm = () => {
    setFormData({
      // Common fields
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
      
      // Tool fields
      toolName: "",
      toolLevel: "",
      toolCategory: "web",
      
      // Experience fields
      role: "",
      company: "",
      startYear: "",
      endYear: "",
      isPresent: false,
      experienceDescription: "",
      experienceDetails: "",
      align: "left",
    })
    setEditingId(null)
  }

  const handleSubmit = async (type: string) => {
    console.log("handleSubmit called with type:", type)
    console.log("formData:", formData)
    
    // Validation for tools
    if (type === "tools") {
      if (!formData.toolName.trim()) {
        alert("Please enter a tool name")
        return
      }
      if (!formData.toolLevel || formData.toolLevel < 0 || formData.toolLevel > 100) {
        alert("Please enter a valid skill level (0-100)")
        return
      }
    }
    
    // Validation for experiences
    if (type === "experiences") {
      if (!formData.role.trim()) {
        alert("Please enter a role")
        return
      }
      if (!formData.company.trim()) {
        alert("Please enter a company")
        return
      }
      if (!formData.startYear) {
        alert("Please enter a start year")
        return
      }
      if (!formData.isPresent && !formData.endYear) {
        alert("Please enter an end year or check 'Present'")
        return
      }
      if (!formData.experienceDescription.trim()) {
        alert("Please enter a description")
        return
      }
    }
    
    try {
      let dataToSave: any = { ...formData }
      
      // Handle specific data mapping for different types
      if (type === "tools") {
        dataToSave = {
          name: formData.toolName.trim(),
          level: parseInt(formData.toolLevel),
          category: formData.toolCategory,
        }
        console.log("Tools data to save:", dataToSave)
      } else if (type === "experiences") {
        dataToSave = {
          role: formData.role.trim(),
          company: formData.company.trim(),
          period: formData.isPresent ? `${formData.startYear} - Present` : `${formData.startYear} - ${formData.endYear}`,
          startYear: formData.startYear,
          endYear: formData.isPresent ? null : formData.endYear,
          isPresent: formData.isPresent,
          description: formData.experienceDescription.trim(),
          details: formData.experienceDetails.trim(),
          align: formData.align,
        }
        console.log("Experience data to save:", dataToSave)
      } else {
        // Process tags for other types
        if (dataToSave.tags) {
          dataToSave.tags = dataToSave.tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag)
        }
        
        // Clean up empty fields
        Object.keys(dataToSave).forEach(key => {
          if (dataToSave[key] === "" || dataToSave[key] === null || dataToSave[key] === undefined) {
            delete dataToSave[key]
          }
        })
      }
      
      console.log("Final data to save:", dataToSave)
      
      if (editingId) {
        // Update existing
        const refPath = ref(database, `${type}/${editingId}`)
        await update(refPath, dataToSave)
        console.log("Updated successfully")
        alert("Updated successfully!")
      } else {
        // Create new
        const refPath = ref(database, type)
        const newRef = push(refPath)
        await set(newRef, { ...dataToSave, createdAt: Date.now() })
        console.log("Created successfully with ID:", newRef.key)
        alert("Added successfully!")
      }
      
      resetForm()
    } catch (error) {
      console.error("Error saving data:", error)
      alert(`Error saving data: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleEdit = (item: any, type: string) => {
    setFormData({
      // Common fields
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
      link: item.link || "",
      tags: item.tags || "",
      category: item.category || "",
      location: item.location || "",
      name: item.name || "",
      level: item.level || "",
      technology: item.technology || "",
      
      // Tool fields
      toolName: item.name || item.toolName || "",
      toolLevel: item.level || item.toolLevel || "",
      toolCategory: item.category || item.toolCategory || "web",
      
      // Experience fields
      role: item.role || "",
      company: item.company || "",
      startYear: item.startYear || "",
      endYear: item.endYear || "",
      isPresent: item.isPresent || false,
      experienceDescription: item.description || item.experienceDescription || "",
      experienceDetails: item.details || item.experienceDetails || "",
      align: item.align || "left",
    })
    setEditingId(item.id)
  }

  const handleDelete = async (id: string, type: string) => {
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
    tools,
    experiences,
  }[activeTab]

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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="tools">
              <Code className="mr-2 h-4 w-4" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="experiences">
              <Briefcase className="mr-2 h-4 w-4" />
              Experience
            </TabsTrigger>
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

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Add/Edit Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tool Name</Label>
                    <Input
                      value={formData.toolName}
                      onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                      placeholder="React, Unity, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Skill Level (0-100)</Label>
                    <Input
                      type="number"
                      value={formData.toolLevel}
                      onChange={(e) => setFormData({ ...formData, toolLevel: e.target.value })}
                      placeholder="90"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.toolCategory} onValueChange={(value) => setFormData({ ...formData, toolCategory: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web Development</SelectItem>
                      <SelectItem value="games">Game Development</SelectItem>
                      <SelectItem value="mobile">Mobile Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSubmit("tools")}>
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
              {tools.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No tools added yet. Create your first tool above.
                  </CardContent>
                </Card>
              ) : (
                tools.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category} • Level: {item.level}%</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item, "tools")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, "tools")}>
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

          {/* Experience Tab */}
          <TabsContent value="experiences" className="space-y-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Add/Edit Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Job Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Company Name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Start Year</Label>
                    <Input
                      type="number"
                      value={formData.startYear}
                      onChange={(e) => setFormData({ ...formData, startYear: e.target.value })}
                      placeholder="2021"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Year</Label>
                    <Input
                      type="number"
                      value={formData.endYear}
                      onChange={(e) => setFormData({ ...formData, endYear: e.target.value })}
                      placeholder="2025"
                      disabled={formData.isPresent}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Present</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="present"
                        checked={formData.isPresent}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPresent: checked as boolean, endYear: checked ? "" : formData.endYear })}
                      />
                      <Label htmlFor="present">Currently working here</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.experienceDescription}
                    onChange={(e) => setFormData({ ...formData, experienceDescription: e.target.value })}
                    placeholder="Brief description of your role"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>More Details (shown on hover)</Label>
                  <Textarea
                    value={formData.experienceDetails}
                    onChange={(e) => setFormData({ ...formData, experienceDetails: e.target.value })}
                    placeholder="Detailed information about achievements, projects, etc."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alignment</Label>
                  <Select value={formData.align} onValueChange={(value) => setFormData({ ...formData, align: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alignment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSubmit("experiences")}>
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
              {experiences.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No experiences added yet. Create your first experience above.
                  </CardContent>
                </Card>
              ) : (
                experiences.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-2 hover:border-primary/30 transition-all duration-300">
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h3 className="font-bold">{item.role}</h3>
                          <p className="text-sm text-muted-foreground">{item.company} • {item.period}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item, "experiences")}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, "experiences")}>
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


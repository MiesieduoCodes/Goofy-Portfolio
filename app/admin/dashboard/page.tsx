"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import { getDatabase, ref, push, remove, get, set } from "firebase/database"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { BarChart, FileText, ImageIcon, LogOut, Plus, Settings, Trash2, Upload, Edit, Save } from "lucide-react"

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
const auth = getAuth(app)
const database = getDatabase(app)
const storage = getStorage(app)

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [photos, setPhotos] = useState([])
  const [activeTab, setActiveTab] = useState("projects")
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Web Development",
    description: "",
    tags: "",
    image: null,
  })
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    category: "Landscapes",
    description: "",
    location: "",
    image: null,
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const photoFileInputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (!currentUser) {
        router.push("/admin")
      } else {
        // Load data
        fetchProjects()
        fetchPhotos()
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchProjects = async () => {
    try {
      const projectsRef = ref(database, "projects")
      const snapshot = await get(projectsRef)

      if (snapshot.exists()) {
        const projectsData = snapshot.val()
        const projectsList = Object.entries(projectsData).map(([id, data]) => ({
          id,
          ...data,
        }))
        setProjects(projectsList)
      } else {
        setProjects([])
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const fetchPhotos = async () => {
    try {
      const photosRef = ref(database, "photos")
      const snapshot = await get(photosRef)

      if (snapshot.exists()) {
        const photosData = snapshot.val()
        const photosList = Object.entries(photosData).map(([id, data]) => ({
          id,
          ...data,
        }))
        setPhotos(photosList)
      } else {
        setPhotos([])
      }
    } catch (error) {
      console.error("Error fetching photos:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/admin")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleAddProject = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      let imageUrl = ""

      // Upload image if provided
      if (newProject.image) {
        const imageStorageRef = storageRef(storage, `projects/${Date.now()}_${newProject.image.name}`)
        await uploadBytes(imageStorageRef, newProject.image)
        imageUrl = await getDownloadURL(imageStorageRef)
      }

      // Add project to Realtime Database
      const projectsRef = ref(database, "projects")
      const newProjectRef = push(projectsRef)

      await set(newProjectRef, {
        title: newProject.title,
        category: newProject.category,
        description: newProject.description,
        tags: newProject.tags.split(",").map((tag) => tag.trim()),
        image: imageUrl,
        createdAt: Date.now(),
      })

      // Reset form and close dialog
      setNewProject({
        title: "",
        category: "Web Development",
        description: "",
        tags: "",
        image: null,
      })
      setIsAddProjectOpen(false)

      // Refresh projects
      fetchProjects()
    } catch (error) {
      console.error("Error adding project:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddPhoto = async (e) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      let imageUrl = ""

      // Upload image if provided
      if (newPhoto.image) {
        const imageStorageRef = storageRef(storage, `photos/${Date.now()}_${newPhoto.image.name}`)
        await uploadBytes(imageStorageRef, newPhoto.image)
        imageUrl = await getDownloadURL(imageStorageRef)
      }

      // Add photo to Realtime Database
      const photosRef = ref(database, "photos")
      const newPhotoRef = push(photosRef)

      await set(newPhotoRef, {
        title: newPhoto.title,
        category: newPhoto.category,
        description: newPhoto.description,
        location: newPhoto.location,
        image: imageUrl,
        createdAt: Date.now(),
      })

      // Reset form and close dialog
      setNewPhoto({
        title: "",
        category: "Landscapes",
        description: "",
        location: "",
        image: null,
      })
      setIsAddPhotoOpen(false)

      // Refresh photos
      fetchPhotos()
    } catch (error) {
      console.error("Error adding photo:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteProject = async (projectId) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        // Get project data to delete image
        const project = projects.find((p) => p.id === projectId)

        // Delete project from Realtime Database
        const projectRef = ref(database, `projects/${projectId}`)
        await remove(projectRef)

        // Delete image if exists
        if (project.image) {
          const imageRef = storageRef(storage, project.image)
          await deleteObject(imageRef)
        }

        // Refresh projects
        fetchProjects()
      } catch (error) {
        console.error("Error deleting project:", error)
      }
    }
  }

  const handleDeletePhoto = async (photoId) => {
    if (confirm("Are you sure you want to delete this photo?")) {
      try {
        // Get photo data to delete image
        const photo = photos.find((p) => p.id === photoId)

        // Delete photo from Realtime Database
        const photoRef = ref(database, `photos/${photoId}`)
        await remove(photoRef)

        // Delete image if exists
        if (photo.image) {
          const imageRef = storageRef(storage, photo.image)
          await deleteObject(imageRef)
        }

        // Refresh photos
        fetchPhotos()
      } catch (error) {
        console.error("Error deleting photo:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your portfolio content</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </motion.div>

      <Tabs defaultValue="projects" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8 grid w-full grid-cols-4">
          <TabsTrigger value="projects">
            <FileText className="mr-2 h-4 w-4" /> Projects
          </TabsTrigger>
          <TabsTrigger value="photos">
            <ImageIcon className="mr-2 h-4 w-4" /> Photography
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" /> Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}\
            transition={{ duration: 0.5 opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
            className="flex justify-between"
          >
            <h2 className="text-xl font-bold">Manage Projects</h2>
            <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Project</DialogTitle>
                  <DialogDescription>Add a new project to your portfolio. Fill in the details below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddProject}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newProject.category}
                        onValueChange={(value) => setNewProject({ ...newProject, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Game Development">Game Development</SelectItem>
                          <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                          <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={newProject.tags}
                        onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                        placeholder="React, Next.js, Tailwind CSS"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">Project Image</Label>
                      <Input
                        id="image"
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setNewProject({ ...newProject, image: e.target.files[0] })}
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddProjectOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Project
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg?height=300&width=600"}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {project.tags &&
                        project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="col-span-full"
              >
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="mb-4 text-muted-foreground">No projects found</p>
                    <Button onClick={() => setIsAddProjectOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Project
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between"
          >
            <h2 className="text-xl font-bold">Manage Photography</h2>
            <Dialog open={isAddPhotoOpen} onOpenChange={setIsAddPhotoOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload Photos
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Upload New Photo</DialogTitle>
                  <DialogDescription>
                    Add a new photograph to your portfolio. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPhoto}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="photo-title">Photo Title</Label>
                      <Input
                        id="photo-title"
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="photo-category">Category</Label>
                      <Select
                        value={newPhoto.category}
                        onValueChange={(value) => setNewPhoto({ ...newPhoto, category: value })}
                      >
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
                    <div className="grid gap-2">
                      <Label htmlFor="photo-description">Description</Label>
                      <Textarea
                        id="photo-description"
                        value={newPhoto.description}
                        onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="photo-location">Location</Label>
                      <Input
                        id="photo-location"
                        value={newPhoto.location}
                        onChange={(e) => setNewPhoto({ ...newPhoto, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="photo-image">Photo</Label>
                      <Input
                        id="photo-image"
                        type="file"
                        ref={photoFileInputRef}
                        onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.files[0] })}
                        accept="image/*"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddPhotoOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUploading}>
                      {isUploading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" /> Upload Photo
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={photo.image || "/placeholder.svg?height=300&width=300"}
                      alt={photo.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="font-medium">{photo.title}</p>
                    <div className="mt-2 flex justify-end">
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePhoto(photo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {photos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="col-span-full"
              >
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <p className="mb-4 text-muted-foreground">No photos found</p>
                    <Button onClick={() => setIsAddPhotoOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Your First Photo
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View your website statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account and website settings</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Settings dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


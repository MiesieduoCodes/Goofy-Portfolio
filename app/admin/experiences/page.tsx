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
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, onSnapshot, query } from "firebase/firestore"

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

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    startYear: "",
    endYear: "",
    isPresent: false,
    description: "",
    details: "",
    align: "left"
  })

  // Load experiences from Firebase
  useEffect(() => {
    const experiencesQuery = query(collection(db, "experiences"))
    const unsubscribeExperiences = onSnapshot(experiencesQuery, (snapshot) => {
      const experiencesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setExperiences(experiencesData)
      console.log("💼 Experiences loaded:", experiencesData)
    })

    return () => unsubscribeExperiences()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const experienceData = {
        ...formData,
        period: formData.isPresent 
          ? `${formData.startYear} - Present` 
          : `${formData.startYear} - ${formData.endYear}`,
        updatedAt: Date.now()
      }

      if (editingId) {
        await updateDoc(doc(db, "experiences", editingId), experienceData)
        console.log("✅ Experience updated:", formData.role)
      } else {
        await setDoc(doc(collection(db, "experiences")), {
          ...experienceData,
          createdAt: Date.now()
        })
        console.log("✅ Experience added:", formData.role)
      }

      // Reset form
      setFormData({
        role: "",
        company: "",
        startYear: "",
        endYear: "",
        isPresent: false,
        description: "",
        details: "",
        align: "left"
      })
      setEditingId(null)
    } catch (error) {
      console.error("❌ Error saving experience:", error)
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        await deleteDoc(doc(db, "experiences", id))
        console.log("✅ Experience deleted")
      } catch (error) {
        console.error("❌ Error deleting experience:", error)
      }
    }
  }

  // Handle edit
  const handleEdit = (experience: any) => {
    setFormData({
      role: experience.role || "",
      company: experience.company || "",
      startYear: experience.startYear || "",
      endYear: experience.endYear || "",
      isPresent: experience.isPresent || false,
      description: experience.description || "",
      details: experience.details || "",
      align: experience.align || "left"
    })
    setEditingId(experience.id)
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
                  Experience <span className="text-gradient">Management</span>
                </h1>
                <p className="text-muted-foreground">Manage your professional work experience</p>
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
                      {editingId ? "Edit Experience" : "Add New Experience"}
                    </CardTitle>
                    <CardDescription>
                      {editingId ? "Update experience information" : "Add a new work experience to your portfolio"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="role">Role/Position</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="e.g., Senior Developer"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="e.g., Tech Company"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startYear">Start Year</Label>
                          <Input
                            id="startYear"
                            type="number"
                            value={formData.startYear}
                            onChange={(e) => setFormData(prev => ({ ...prev, startYear: e.target.value }))}
                            placeholder="2020"
                            min="1990"
                            max="2030"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="endYear">End Year</Label>
                          <Input
                            id="endYear"
                            type="number"
                            value={formData.endYear}
                            onChange={(e) => setFormData(prev => ({ ...prev, endYear: e.target.value }))}
                            placeholder="2023"
                            min="1990"
                            max="2030"
                            disabled={formData.isPresent}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPresent"
                          checked={formData.isPresent}
                          onChange={(e) => setFormData(prev => ({ ...prev, isPresent: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="isPresent">Currently working here</Label>
                      </div>

                      <div>
                        <Label htmlFor="description">Brief Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of your role and responsibilities"
                          rows={2}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="details">Detailed Description</Label>
                        <Textarea
                          id="details"
                          value={formData.details}
                          onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                          placeholder="Detailed achievements, responsibilities, and impact"
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="align">Timeline Alignment</Label>
                        <select
                          id="align"
                          value={formData.align}
                          onChange={(e) => setFormData(prev => ({ ...prev, align: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingId ? "Update" : "Add Experience"}
                        </Button>
                        {editingId && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setEditingId(null)
                              setFormData({
                                role: "",
                                company: "",
                                startYear: "",
                                endYear: "",
                                isPresent: false,
                                description: "",
                                details: "",
                                align: "left"
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

              {/* Experiences List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experiences ({experiences.length})</CardTitle>
                    <CardDescription>Your professional work history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {experiences.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No experiences added yet. Add your first work experience above.</p>
                        </div>
                      ) : (
                        experiences.map((experience) => (
                          <div key={experience.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{experience.role}</h3>
                                  <Badge variant="outline">{experience.company}</Badge>
                                  {experience.isPresent && <Badge variant="default">Current</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {experience.period}
                                </p>
                                <p className="text-sm mb-2">{experience.description}</p>
                                <p className="text-sm text-muted-foreground">
                                  {experience.details}
                                </p>
                                <div className="mt-2">
                                  <Badge variant="secondary" className="text-xs">
                                    Aligned: {experience.align}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(experience)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(experience.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
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

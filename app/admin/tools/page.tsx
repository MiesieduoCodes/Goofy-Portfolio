"use client"

import { useState, useEffect, useRef } from "react"
import { MotionDiv } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AdminLayout from "../components/AdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, X } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, query } from "firebase/firestore"

export default function AdminToolsPage() {
  const [tools, setTools] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: "web"
  })
  const formRef = useRef<HTMLDivElement>(null)

  // Load tools from Firebase
  useEffect(() => {
    const toolsQuery = query(collection(db, "tools"))
    const unsubscribeTools = onSnapshot(toolsQuery, (snapshot) => {
      const toolsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTools(toolsData)
      console.log("🔧 Tools loaded:", toolsData)
    })

    return () => unsubscribeTools()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(null)
    setError(null)
    
    try {
      const toolData = {
        ...formData,
        updatedAt: Date.now()
      }

      if (editingId) {
        await updateDoc(doc(db, "tools", editingId), toolData)
        setSuccess("✅ Tool updated successfully!")
        console.log("✅ Tool updated:", formData.name)
      } else {
        await setDoc(doc(collection(db, "tools")), {
          ...toolData,
          createdAt: Date.now()
        })
        setSuccess("✅ Tool added successfully!")
        console.log("✅ Tool added:", formData.name)
      }

      // Reset form
      setFormData({
        name: "",
        level: 50,
        category: "web"
      })
      setEditingId(null)
    } catch (err: any) {
      console.error("❌ Error saving tool:", err)
      setError(err?.message || "❌ Error saving tool. Please try again.")
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    setSuccess(null)
    setError(null)
    if (confirm("Are you sure you want to delete this tool?")) {
      try {
        await deleteDoc(doc(db, "tools", id))
        setSuccess("✅ Tool deleted successfully!")
        console.log("✅ Tool deleted")
      } catch (err: any) {
        console.error("❌ Error deleting tool:", err)
        setError(err?.message || "❌ Error deleting tool. Please try again.")
      }
    }
  }

  // Handle edit
  const handleEdit = (tool: any) => {
    setSuccess(null)
    setError(null)
    setFormData({
      name: tool.name || "",
      level: tool.level || 50,
      category: tool.category || "web"
    })
    setEditingId(tool.id)
    // Scroll to form
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  // Get category color
  const getCategoryColor = (_category: string) => "border border-white/20 bg-transparent text-white/70"

  return (
    <AdminLayout title="Tools & Skills" description="Manage your technical tools and skill levels">
      <div className="px-6 py-10 md:px-10">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-1" ref={formRef}>
                <Card className={`rounded-sm bg-transparent transition-colors ${editingId ? "border-white" : "border-white/10"}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      {editingId ? "Edit Tool" : "Add New Tool"}
                    </CardTitle>
                    <CardDescription>
                      {editingId ? "Update tool information" : "Add a new tool or skill to your portfolio"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {success && (
                        <div role="status" className="border-l-2 border-white bg-white/[0.04] px-4 py-3 text-sm text-white">
                          {success}
                        </div>
                      )}
                      {error && (
                        <div role="alert" className="border-l-2 border-red-400/70 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                          {error}
                        </div>
                      )}
                      <div>
                        <Label htmlFor="name">Tool/Skill Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., React, Unity, Photoshop"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="level">Skill Level: {formData.level}%</Label>
                        <Input
                          id="level"
                          type="range"
                          min="0"
                          max="100"
                          value={formData.level}
                          onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Beginner</span>
                          <span>Expert</span>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded-md bg-background text-foreground border-input"
                        >
                          <option value="web">Web Development</option>
                          <option value="mobile">Mobile Development</option>
                          <option value="games">Game Development</option>
                          <option value="design">Design</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingId ? "Update" : "Add Tool"}
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
                                name: "",
                                level: 50,
                                category: "web"
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

              {/* Tools List */}
              <div className="lg:col-span-2">
                <Card className="rounded-sm border-white/10 bg-transparent">
                  <CardHeader>
                    <CardTitle>Tools & Skills ({tools.length})</CardTitle>
                    <CardDescription>Your technical skills and tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tools.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No tools added yet. Add your first tool or skill above.</p>
                        </div>
                      ) : (
                        tools.map((tool) => (
                          <div key={tool.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{tool.name}</h3>
                                  <Badge className={getCategoryColor(tool.category)}>
                                    {tool.category}
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Level:</span>
                                    <div className="flex-1">
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-primary h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${tool.level}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    <span className="text-sm font-medium">{tool.level}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(tool)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(tool.id)}
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
    </AdminLayout>
  )
}

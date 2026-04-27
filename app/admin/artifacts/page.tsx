"use client"

import { useState, useEffect } from "react"
import { MotionDiv } from "@/components/motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Gamepad2, Star, Trash2, ExternalLink, ArrowRight } from "lucide-react"
import AdminLayout from "../components/AdminLayout"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore"

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

export default function AdminArtifactsPage() {
  const [artifacts, setArtifacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    
    let websites: any[] = []
    let games: any[] = []

    const update = () => {
      const merged = [...websites, ...games].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      setArtifacts(merged)
      setLoading(false)
    }

    // Load all items but focus on featured ones
    const unsubWebsites = onSnapshot(collection(db, "websites"), (snap) => {
      websites = snap.docs.map(doc => ({ id: doc.id, ...doc.data(), collection: "websites" }))
      update()
    })

    const unsubGames = onSnapshot(collection(db, "games"), (snap) => {
      games = snap.docs.map(doc => ({ id: doc.id, ...doc.data(), collection: "games" }))
      update()
    })

    return () => {
      unsubWebsites()
      unsubGames()
    }
  }, [])

  const toggleFeatured = async (item: any) => {
    try {
      await updateDoc(doc(db, item.collection, item.id), {
        featured: !item.featured
      })
    } catch (error) {
      console.error("Error toggling featured status:", error)
    }
  }

  const featuredCount = artifacts.filter(a => a.featured).length

  return (
    <AdminLayout 
      title="Digital Artifacts" 
      description="Manage items showcased in the 'Digital Artifacts' section of your homepage"
    >
      <div className="container-custom py-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">Homepage Showcase</CardTitle>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {featuredCount} / 5 Featured
                </Badge>
              </div>
              <CardDescription>
                The 'Digital Artifacts' section on your homepage displays up to 5 items marked as **Featured**. 
                You can toggle items here to control what appears on the main page.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Artifacts List */}
          <div className="grid gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              All Projects
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : artifacts.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                <p className="text-muted-foreground italic">No projects found. Go to Websites or Games to add some.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {artifacts.map((artifact) => (
                  <Card key={artifact.id} className={`overflow-hidden transition-all ${artifact.featured ? 'border-primary shadow-md ring-1 ring-primary/20' : 'opacity-70 hover:opacity-100'}`}>
                    <div className="relative aspect-video bg-muted">
                      {artifact.image ? (
                        <img src={artifact.image} alt={artifact.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          {artifact.collection === 'websites' ? <Globe className="w-10 h-10 text-muted-foreground/30" /> : <Gamepad2 className="w-10 h-10 text-muted-foreground/30" />}
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Button 
                          size="sm" 
                          variant={artifact.featured ? "default" : "secondary"}
                          onClick={() => toggleFeatured(artifact)}
                          className="shadow-lg"
                        >
                          <Star className={`w-4 h-4 mr-1 ${artifact.featured ? "fill-white" : ""}`} />
                          {artifact.featured ? "Featured" : "Feature"}
                        </Button>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                          {artifact.collection === 'websites' ? 'Website' : 'Game'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-1">{artifact.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs h-8">
                        {artifact.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex gap-2">
                       <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
                          <a href={artifact.collection === 'websites' ? '/admin/websites' : '/admin/games'}>
                             <ArrowRight className="w-3 h-3 mr-1" /> Edit Source
                          </a>
                       </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </MotionDiv>
      </div>
    </AdminLayout>
  )
}

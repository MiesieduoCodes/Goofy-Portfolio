"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Gamepad2, Briefcase, Wrench, Camera, ArrowRight, Star, LayoutDashboard } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query } from "firebase/firestore"
import AdminLayout from "./components/AdminLayout"

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    websites: 0,
    games: 0,
    experiences: 0,
    tools: 0,
    photos: 0
  })

  useEffect(() => {
    const unsubscribers = Object.keys(counts).map((key) => {
      return onSnapshot(query(collection(db, key)), (snapshot) => {
        setCounts(prev => ({ ...prev, [key]: snapshot.size }))
      })
    })
    return () => unsubscribers.forEach(unsub => unsub())
  }, [])

  const totalItems = Object.values(counts).reduce((sum, count) => sum + count, 0)

  return (
    <AdminLayout title="Admin Dashboard" description="Overview of your portfolio content">
      <div className="container-custom py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground">{totalItems}</div>
              <p className="text-sm text-muted-foreground">Total Items</p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-400">{counts.websites + counts.games}</div>
              <p className="text-sm text-muted-foreground">Projects</p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-400">{counts.experiences}</div>
              <p className="text-sm text-muted-foreground">Experiences</p>
            </CardContent>
          </Card>
          <Card className="border border-border bg-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-400">{counts.tools}</div>
              <p className="text-sm text-muted-foreground">Skills</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all border border-yellow-500/20 bg-yellow-500/[0.02] hover:bg-yellow-500/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
                    <Star className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                    Homepage
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">Digital Artifacts</CardTitle>
                <CardDescription className="text-muted-foreground">Manage featured projects on your home page</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                  <a href="/admin/artifacts" className="flex items-center justify-center gap-2">
                    Edit Homepage Showcase
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border border-blue-500/20 bg-blue-500/[0.02] hover:bg-blue-500/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                    <Globe className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {counts.websites} Items
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">Websites</CardTitle>
                <CardDescription className="text-muted-foreground">Manage web development projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <a href="/admin/websites" className="flex items-center justify-center gap-2">
                    Manage Websites
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border border-zinc-500/20 bg-zinc-500/[0.02] hover:bg-zinc-500/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-zinc-800 text-white">
                    <Gamepad2 className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-300 border border-zinc-500/20">
                    {counts.games} Items
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">Games</CardTitle>
                <CardDescription className="text-muted-foreground">Manage game development projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-zinc-700 hover:bg-zinc-800 text-white">
                  <a href="/admin/games" className="flex items-center justify-center gap-2">
                    Manage Games
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border border-purple-500/20 bg-purple-500/[0.02] hover:bg-purple-500/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {counts.experiences} Items
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">Experiences</CardTitle>
                <CardDescription className="text-muted-foreground">Manage work experience and timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <a href="/admin/experiences" className="flex items-center justify-center gap-2">
                    Manage Experiences
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border border-orange-500/20 bg-orange-500/[0.02] hover:bg-orange-500/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-orange-500/10 text-orange-400">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {counts.tools} Items
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">Tools & Skills</CardTitle>
                <CardDescription className="text-muted-foreground">Manage technical tools and skill levels</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  <a href="/admin/tools" className="flex items-center justify-center gap-2">
                    Manage Tools
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border border-pink-500/20 bg-pink-500/[0.02] hover:bg-pink-500/[0.04]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-pink-500/10 text-pink-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    {counts.photos} Items
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">Photo Gallery</CardTitle>
                <CardDescription className="text-muted-foreground">Manage photography portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                  <a href="/admin/photos" className="flex items-center justify-center gap-2">
                    Manage Photos
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Links */}
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Preview</CardTitle>
            <CardDescription className="text-muted-foreground">View your portfolio pages</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="w-full justify-start border-border hover:bg-accent text-foreground">
              <a href="/work" target="_blank">
                <Globe className="w-4 h-4 mr-2 text-blue-400" />
                Portfolio Overview
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start border-border hover:bg-accent text-foreground">
              <a href="/games" target="_blank">
                <Gamepad2 className="w-4 h-4 mr-2 text-zinc-400" />
                Games Portfolio
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start border-border hover:bg-accent text-foreground">
              <a href="/web" target="_blank">
                <Globe className="w-4 h-4 mr-2 text-emerald-400" />
                Web Projects
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start border-border hover:bg-accent text-foreground">
              <a href="/about" target="_blank">
                <Briefcase className="w-4 h-4 mr-2 text-purple-400" />
                About Page
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
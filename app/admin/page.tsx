"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Gamepad2, Briefcase, Wrench, Camera, ArrowRight } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, onSnapshot, query } from "firebase/firestore"

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
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your portfolio content</p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {totalItems} Total Items
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold">{totalItems}</div>
              <p className="text-sm text-gray-600">Total Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600">{counts.websites + counts.games}</div>
              <p className="text-sm text-gray-600">Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600">{counts.experiences}</div>
              <p className="text-sm text-gray-600">Experiences</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600">{counts.tools}</div>
              <p className="text-sm text-gray-600">Skills</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {counts.websites}
                </Badge>
              </div>
              <CardTitle className="text-xl">Websites</CardTitle>
              <CardDescription>Manage web development projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/websites" className="flex items-center justify-center gap-2">
                  Manage Websites
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-green-100">
                  <Gamepad2 className="w-6 h-6 text-green-600" />
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {counts.games}
                </Badge>
              </div>
              <CardTitle className="text-xl">Games</CardTitle>
              <CardDescription>Manage game development projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/games" className="flex items-center justify-center gap-2">
                  Manage Games
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {counts.experiences}
                </Badge>
              </div>
              <CardTitle className="text-xl">Experiences</CardTitle>
              <CardDescription>Manage work experience and timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/experiences" className="flex items-center justify-center gap-2">
                  Manage Experiences
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Wrench className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {counts.tools}
                </Badge>
              </div>
              <CardTitle className="text-xl">Tools & Skills</CardTitle>
              <CardDescription>Manage technical tools and skill levels</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/tools" className="flex items-center justify-center gap-2">
                  Manage Tools
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-pink-100">
                  <Camera className="w-6 h-6 text-pink-600" />
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {counts.photos}
                </Badge>
              </div>
              <CardTitle className="text-xl">Photo Gallery</CardTitle>
              <CardDescription>Manage photography portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <a href="/admin/photos" className="flex items-center justify-center gap-2">
                  Manage Photos
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Preview</CardTitle>
            <CardDescription>View your portfolio pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/work" target="_blank">
                <Globe className="w-4 h-4 mr-2" />
                Portfolio Overview
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/games" target="_blank">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Games Portfolio
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/web" target="_blank">
                <Globe className="w-4 h-4 mr-2" />
                Web Projects
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/about" target="_blank">
                <Briefcase className="w-4 h-4 mr-2" />
                About Page
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard,
  Globe,
  Gamepad2,
  Briefcase,
  Wrench,
  Camera,
  X,
  Menu,
  LogOut,
  Star
} from "lucide-react"
import { db, auth, adminEmails } from "@/lib/firebase"
import { collection, onSnapshot, query } from "firebase/firestore"
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth"



interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  countKey: 'websites' | 'games' | 'experiences' | 'tools' | 'photos'
  color: string
}

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

const isAdminUser = (user: User | null) =>
  !!user?.email && user.emailVerified && adminEmails.includes(user.email.toLowerCase())

// Gate every admin page behind Google sign-in with an allowed email
export default function AdminLayout(props: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setChecking(false)
    })
  }, [])

  const handleSignIn = async () => {
    setAuthError(null)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err: any) {
      setAuthError(err?.message || "Sign-in failed")
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking access…</p>
      </div>
    )
  }

  if (!isAdminUser(user)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-4 text-center">
          <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
          {user ? (
            <>
              <p className="text-sm text-muted-foreground">
                {user.email} doesn&apos;t have admin access.
              </p>
              <Button variant="outline" className="w-full" onClick={() => signOut(auth)}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Sign in to manage your portfolio.</p>
              <Button className="w-full" onClick={handleSignIn}>
                Sign in with Google
              </Button>
            </>
          )}
          {authError && <p className="text-sm text-destructive">{authError}</p>}
        </div>
      </div>
    )
  }

  return <AdminShell {...props} />
}

function AdminShell({ children, title, description }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [counts, setCounts] = useState({
    websites: 0,
    games: 0,
    experiences: 0,
    tools: 0,
    photos: 0
  })
  const pathname = usePathname()

  // Load counts from Firebase
  useEffect(() => {
    // Websites
    const unsubscribeWebsites = onSnapshot(query(collection(db, "websites")), (snapshot) => {
      setCounts(prev => ({ ...prev, websites: snapshot.size }))
    })

    // Games
    const unsubscribeGames = onSnapshot(query(collection(db, "games")), (snapshot) => {
      setCounts(prev => ({ ...prev, games: snapshot.size }))
    })

    // Experiences
    const unsubscribeExperiences = onSnapshot(query(collection(db, "experiences")), (snapshot) => {
      setCounts(prev => ({ ...prev, experiences: snapshot.size }))
    })

    // Tools
    const unsubscribeTools = onSnapshot(query(collection(db, "tools")), (snapshot) => {
      setCounts(prev => ({ ...prev, tools: snapshot.size }))
    })

    // Photos
    const unsubscribePhotos = onSnapshot(query(collection(db, "photos")), (snapshot) => {
      setCounts(prev => ({ ...prev, photos: snapshot.size }))
    })

    return () => {
      unsubscribeWebsites()
      unsubscribeGames()
      unsubscribeExperiences()
      unsubscribeTools()
      unsubscribePhotos()
    }
  }, [])

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      countKey: "websites", // Will show total instead
      color: "text-gray-600"
    },
    {
      title: "Digital Artifacts",
      href: "/admin/artifacts",
      icon: Star,
      countKey: "websites", // Just a placeholder
      color: "text-yellow-500"
    },
    {
      title: "Websites",
      href: "/admin/websites",
      icon: Globe,
      countKey: "websites",
      color: "text-blue-600"
    },
    {
      title: "Games",
      href: "/admin/games",
      icon: Gamepad2,
      countKey: "games",
      color: "text-green-600"
    },
    {
      title: "Experiences",
      href: "/admin/experiences",
      icon: Briefcase,
      countKey: "experiences",
      color: "text-purple-600"
    },
    {
      title: "Tools & Skills",
      href: "/admin/tools",
      icon: Wrench,
      countKey: "tools",
      color: "text-orange-600"
    },
    {
      title: "Photo Gallery",
      href: "/admin/photos",
      icon: Camera,
      countKey: "photos",
      color: "text-pink-600"
    }
  ]

  const totalItems = Object.values(counts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:flex lg:flex-col
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="font-display text-xl font-bold">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">Portfolio Management</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href
              const count = item.href === "/admin" ? totalItems : counts[item.countKey]
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center justify-between w-full p-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : item.color}`} />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <Badge 
                    variant={isActive ? "secondary" : "outline"} 
                    className="text-xs"
                  >
                    {count}
                  </Badge>
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/" target="_blank">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                View Site
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="/work" target="_blank">
                <Globe className="w-4 h-4 mr-2" />
                View Portfolio
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => signOut(auth)}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="font-display text-xl font-bold">{title}</h1>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex">
                {totalItems} Total Items
              </Badge>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}


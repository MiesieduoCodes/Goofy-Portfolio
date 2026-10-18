"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, Briefcase, Camera, Gamepad2, Globe, LayoutDashboard, LogOut, Menu, Star, Wrench, X } from "lucide-react"
import { db, auth, adminEmails } from "@/lib/firebase"
import { collection, onSnapshot, query } from "firebase/firestore"
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth"
import { AdminThumb } from "./admin-ui"

type CountKey = "websites" | "games" | "experiences" | "tools" | "photos"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  countKey?: CountKey | "total"
}

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

const NAV: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard, countKey: "total" },
  { title: "Featured", href: "/admin/artifacts", icon: Star },
  { title: "Websites", href: "/admin/websites", icon: Globe, countKey: "websites" },
  { title: "Games", href: "/admin/games", icon: Gamepad2, countKey: "games" },
  { title: "Photos", href: "/admin/photos", icon: Camera, countKey: "photos" },
  { title: "Experience", href: "/admin/experiences", icon: Briefcase, countKey: "experiences" },
  { title: "Tools & Skills", href: "/admin/tools", icon: Wrench, countKey: "tools" },
]

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 animate-pulse">Checking access…</p>
      </div>
    )
  }

  if (!isAdminUser(user)) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between px-6 py-8 md:px-10">
        <Link href="/" className="text-lg font-black tracking-tight">
          MiesieduoVeria.
        </Link>
        <div className="max-w-xl">
          <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-white/40">Portfolio management</p>
          <h1 className="text-[18vw] md:text-[9vw] font-black uppercase leading-[0.85] tracking-tighter">Admin</h1>
          <div className="mt-10 space-y-4">
            {user ? (
              <>
                <p className="text-white/60">
                  <span className="font-semibold text-white">{user.email}</span> doesn&apos;t have admin access.
                </p>
                <button
                  type="button"
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-2 rounded-full border border-white/25 bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <p className="text-white/60">Sign in with your Google account to manage the site.</p>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="group flex items-center gap-4 rounded-full bg-white py-3 pl-6 pr-3 text-sm font-semibold text-black"
                >
                  Sign in with Google
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </button>
              </>
            )}
            {authError && <p className="border-l-2 border-red-400/70 pl-3 text-sm text-red-300">{authError}</p>}
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Restricted area</p>
      </div>
    )
  }

  return <AdminShell {...props} user={user as User} />
}

function AdminShell({ children, title, description, user }: AdminLayoutProps & { user: User }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [counts, setCounts] = useState<Record<CountKey, number>>({
    websites: 0,
    games: 0,
    experiences: 0,
    tools: 0,
    photos: 0,
  })
  const pathname = usePathname()

  // Live item counts for the sidebar
  useEffect(() => {
    const keys: CountKey[] = ["websites", "games", "experiences", "tools", "photos"]
    const unsubs = keys.map((key) =>
      onSnapshot(query(collection(db, key)), (snapshot) => setCounts((prev) => ({ ...prev, [key]: snapshot.size })))
    )
    return () => unsubs.forEach((u) => u())
  }, [])

  const totalItems = Object.values(counts).reduce((sum, count) => sum + count, 0)
  const countFor = (key?: NavItem["countKey"]) => (key === "total" ? totalItems : key ? counts[key] : null)

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/70 p-0 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-black transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pb-8 pt-7">
          <div>
            <Link href="/" className="text-lg font-black tracking-tight">
              MiesieduoVeria.
            </Link>
            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">Admin</p>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-transparent p-0 text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {NAV.map((item, i) => {
              const Icon = item.icon
              const active = pathname === item.href
              const count = countFor(item.countKey)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-sm px-3 py-3 text-sm transition-colors ${
                      active ? "text-black" : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-nav-active"
                        className="absolute inset-0 rounded-sm bg-white"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className={`relative font-mono text-[10px] ${active ? "text-black/50" : "text-white/30"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className="relative h-4 w-4" />
                    <span className="relative flex-1 font-semibold">{item.title}</span>
                    {count !== null && (
                      <span className={`relative font-mono text-xs tabular-nums ${active ? "text-black/60" : "text-white/40"}`}>
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Account */}
        <div className="border-t border-white/10 p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex items-center justify-between rounded-sm px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            View site
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <div className="flex items-center gap-3 px-3">
            {user.photoURL ? (
              <AdminThumb src={user.photoURL} alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                {(user.email || "?")[0].toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user.displayName || "Admin"}</p>
              <p className="truncate text-xs text-white/40">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut(auth)}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-transparent p-0 text-white/60 transition-colors hover:border-white hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center gap-4 px-6 py-5 md:px-10">
            <button
              type="button"
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-transparent p-0 text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl md:text-3xl font-black uppercase tracking-tighter">{title}</h1>
              {description && <p className="truncate text-sm text-white/40">{description}</p>}
            </div>
            <span className="hidden sm:block font-mono text-xs text-white/40">{totalItems} items</span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

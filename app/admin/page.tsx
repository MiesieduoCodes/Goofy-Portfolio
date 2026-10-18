"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Briefcase, Camera, Gamepad2, Globe, Plus, Star, Wrench } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query } from "firebase/firestore"
import AdminLayout from "./components/AdminLayout"
import { AdminThumb } from "./components/admin-ui"

const EASE_OUT = [0.16, 1, 0.3, 1] as const
const MAX_FEATURED = 5

type Key = "websites" | "games" | "photos" | "experiences" | "tools"

const SECTIONS: { key: Key; title: string; href: string; icon: React.ComponentType<{ className?: string }>; publicHref: string }[] = [
  { key: "websites", title: "Websites", href: "/admin/websites", icon: Globe, publicHref: "/web" },
  { key: "games", title: "Games", href: "/admin/games", icon: Gamepad2, publicHref: "/games" },
  { key: "photos", title: "Photos", href: "/admin/photos", icon: Camera, publicHref: "/photography" },
  { key: "experiences", title: "Experience", href: "/admin/experiences", icon: Briefcase, publicHref: "/about" },
  { key: "tools", title: "Tools & Skills", href: "/admin/tools", icon: Wrench, publicHref: "/web" },
]

interface Item {
  id: string
  key: Key
  title?: string
  role?: string
  name?: string
  image?: string
  featured?: boolean
  createdAt?: number
}

export default function AdminDashboard() {
  const [items, setItems] = useState<Record<Key, Item[]>>({ websites: [], games: [], photos: [], experiences: [], tools: [] })

  useEffect(() => {
    const unsubs = SECTIONS.map(({ key }) =>
      onSnapshot(query(collection(db, key)), (snapshot) =>
        setItems((prev) => ({ ...prev, [key]: snapshot.docs.map((doc) => ({ id: doc.id, key, ...(doc.data() as object) })) }))
      )
    )
    return () => unsubs.forEach((u) => u())
  }, [])

  const featured = useMemo(() => [...items.websites, ...items.games, ...items.photos].filter((i) => i.featured).length, [items])
  const recent = useMemo(
    () =>
      [...items.websites, ...items.games, ...items.photos]
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .slice(0, 6),
    [items]
  )
  const editHref = (item: Item) => `${SECTIONS.find((s) => s.key === item.key)?.href}?edit=${item.id}`

  return (
    <AdminLayout title="Dashboard" description="Overview of your portfolio content">
      <div className="space-y-16 px-6 py-10 md:px-10 md:py-14">
        {/* Counts */}
        <section className="grid grid-cols-2 border-t border-white/10 md:grid-cols-5">
          {SECTIONS.map((section, i) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.05 }}
            >
              <Link
                href={section.href}
                className={`group block border-b border-white/10 py-8 transition-colors hover:bg-white/[0.03] md:border-b-0 ${i % 2 === 1 ? "border-l pl-5" : ""} ${i > 0 ? "md:border-l md:pl-6" : ""}`}
              >
                <p className="text-5xl md:text-6xl font-black leading-none tracking-tighter tabular-nums">{items[section.key].length}</p>
                <p className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-white">
                  {section.title}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
              </Link>
            </motion.div>
          ))}
        </section>

        <div className="grid gap-16 lg:grid-cols-12">
          {/* Featured meter + recent */}
          <section className="lg:col-span-7 space-y-12">
            <div>
              <div className="mb-4 flex items-end justify-between">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Featured on the home page</p>
                <Link href="/admin/artifacts" className="flex items-center gap-1 text-xs text-white/60 hover:text-white">
                  Manage <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: MAX_FEATURED }).map((_, i) => (
                  <span key={i} className={`h-2 flex-1 rounded-full ${i < featured ? "bg-white" : "bg-white/10"}`} />
                ))}
                <span className="ml-3 font-mono text-sm tabular-nums">
                  {Math.min(featured, MAX_FEATURED)}/{MAX_FEATURED}
                </span>
              </div>
              {featured > MAX_FEATURED && (
                <p className="mt-2 text-xs text-white/40">
                  {featured} items are featured; the home page shows the {MAX_FEATURED} newest.
                </p>
              )}
            </div>

            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">Recently added</p>
              {recent.length === 0 ? (
                <p className="border-y border-white/10 py-10 text-center text-sm text-white/40">Nothing added yet.</p>
              ) : (
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {recent.map((item) => (
                    <li key={`${item.key}-${item.id}`}>
                      <Link href={editHref(item)} className="group flex items-center gap-4 py-3 transition-colors hover:bg-white/[0.03]">
                        <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-sm bg-white/[0.05]">
                          {item.image && <AdminThumb src={item.image} alt="" width={128} height={96} className="h-full w-full" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold">{item.title || "Untitled"}</span>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                            {SECTIONS.find((s) => s.key === item.key)?.title}
                            {item.featured ? " · Featured" : ""}
                          </span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-white/30 transition-all group-hover:rotate-45 group-hover:text-white" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Quick actions */}
          <section className="lg:col-span-5">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">Quick actions</p>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {SECTIONS.map((section) => {
                const Icon = section.icon
                return (
                  <li key={section.key} className="flex items-center gap-3 py-3">
                    <Icon className="h-4 w-4 text-white/50" />
                    <Link href={section.href} className="flex-1 font-semibold hover:underline underline-offset-4">
                      {section.title}
                    </Link>
                    <Link
                      href={section.href}
                      className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white hover:text-white"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </Link>
                    <a
                      href={section.publicHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${section.title} on the site`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white hover:text-white"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </li>
                )
              })}
              <li className="flex items-center gap-3 py-3">
                <Star className="h-4 w-4 text-white/50" />
                <Link href="/admin/artifacts" className="flex-1 font-semibold hover:underline underline-offset-4">
                  Featured work
                </Link>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View the home page"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white hover:text-white"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}

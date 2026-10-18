"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Camera, Gamepad2, Globe, Star } from "lucide-react"
import AdminLayout from "../components/AdminLayout"
import { AdminNotice, AdminThumb } from "../components/admin-ui"
import { db } from "@/lib/firebase"
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore"

const MAX_FEATURED = 5

type Source = "websites" | "games" | "photos"

interface Artifact {
  id: string
  collection: Source
  title?: string
  description?: string
  image?: string
  featured?: boolean
  createdAt?: number
}

const LABEL: Record<Source, string> = { websites: "Website", games: "Game", photos: "Photo" }
const ICON: Record<Source, React.ComponentType<{ className?: string }>> = { websites: Globe, games: Gamepad2, photos: Camera }

export default function AdminArtifactsPage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "featured">("all")

  useEffect(() => {
    const sources: Record<Source, Artifact[]> = { websites: [], games: [], photos: [] }
    const listen = (name: Source) =>
      onSnapshot(collection(db, name), (snap) => {
        sources[name] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object), collection: name }))
        setArtifacts([...sources.websites, ...sources.games, ...sources.photos].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)))
        setLoading(false)
      })
    const unsubs = (["websites", "games", "photos"] as Source[]).map(listen)
    return () => unsubs.forEach((u) => u())
  }, [])

  const toggleFeatured = async (item: Artifact) => {
    setError(null)
    try {
      await updateDoc(doc(db, item.collection, item.id), { featured: !item.featured })
    } catch (err: any) {
      console.error("Error toggling featured status:", err)
      setError(err?.message || "Couldn't update this item. Are you still signed in?")
    }
  }

  const featuredCount = artifacts.filter((a) => a.featured).length
  const visible = filter === "featured" ? artifacts.filter((a) => a.featured) : artifacts

  return (
    <AdminLayout title="Featured" description="Choose what appears in the home page's Selected work section">
      <div className="space-y-10 px-6 py-10 md:px-10 md:py-14">
        {/* Meter */}
        <section className="flex flex-col gap-6 border-y border-white/10 py-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <p className="text-sm text-white/60">
              The home page shows up to <span className="font-semibold text-white">{MAX_FEATURED}</span> featured items, newest first.
              Toggle the star to add or remove one.
            </p>
          </div>
          <div className="flex items-center gap-2 md:w-80">
            {Array.from({ length: MAX_FEATURED }).map((_, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full ${i < featuredCount ? "bg-white" : "bg-white/10"}`} />
            ))}
            <span className="ml-3 font-mono text-sm tabular-nums">
              {featuredCount}/{MAX_FEATURED}
            </span>
          </div>
        </section>

        {error && <AdminNotice tone="error">{error}</AdminNotice>}
        {featuredCount > MAX_FEATURED && (
          <AdminNotice tone="success">
            {featuredCount} items are featured — only the {MAX_FEATURED} newest appear on the home page.
          </AdminNotice>
        )}

        {/* Filter */}
        <div className="flex gap-6" role="tablist">
          {(["all", "featured"] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`border-b bg-transparent px-0 pb-1 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                filter === f ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/80"
              }`}
            >
              {f === "all" ? `All (${artifacts.length})` : `Featured (${featuredCount})`}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-sm bg-white/[0.04]" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="border-y border-white/10 py-16 text-center text-sm text-white/40">
            {filter === "featured" ? "Nothing is featured yet." : "No projects yet — add some under Websites, Games or Photos."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item, i) => {
              const Icon = ICON[item.collection]
              return (
                <motion.article
                  key={`${item.collection}-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i, 9) * 0.03 }}
                  className={`group overflow-hidden rounded-sm border transition-colors ${item.featured ? "border-white/60" : "border-white/10"}`}
                >
                  <div className="relative aspect-[4/3] bg-white/[0.04]">
                    {item.image ? (
                      <AdminThumb
                        src={item.image}
                        alt={item.title || ""}
                        width={640}
                        height={480}
                        className={`h-full w-full transition-all duration-500 ${item.featured ? "" : "grayscale opacity-60 group-hover:opacity-100"}`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Icon className="h-10 w-10 text-white/20" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleFeatured(item)}
                      aria-pressed={!!item.featured}
                      className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors ${
                        item.featured ? "bg-white text-black" : "bg-black/60 text-white hover:bg-white hover:text-black"
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${item.featured ? "fill-black" : ""}`} />
                      {item.featured ? "Featured" : "Feature"}
                    </button>
                  </div>
                  <div className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">{LABEL[item.collection]}</p>
                      <h3 className="mt-1 truncate font-semibold">{item.title || "Untitled"}</h3>
                    </div>
                    <Link
                      href={`/admin/${item.collection}?edit=${item.id}`}
                      aria-label={`Edit ${item.title || "item"}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white hover:text-white"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

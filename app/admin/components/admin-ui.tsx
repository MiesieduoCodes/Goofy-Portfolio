"use client"

import Image from "next/image"
import { canOptimizeImage } from "@/lib/utils"

// Image preview for the admin. Firebase Storage images go through Next's optimizer;
// any other URL (e.g. pasted in a form or a Google avatar) is shown as-is.
export function AdminThumb({
  src,
  alt,
  className = "",
  width = 640,
  height = 400,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized={!canOptimizeImage(src)}
      className={`object-cover ${className}`}
    />
  )
}

// Success / error message shown above admin forms
export function AdminNotice({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`border-l-2 px-4 py-3 text-sm ${
        tone === "error" ? "border-red-400/70 bg-red-500/[0.06] text-red-300" : "border-white bg-white/[0.04] text-white"
      }`}
    >
      {children}
    </div>
  )
}

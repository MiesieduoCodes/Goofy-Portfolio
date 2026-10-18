import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
  description: "Web architecture, game systems, creative media, sound and interface design — and how we'd work together.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

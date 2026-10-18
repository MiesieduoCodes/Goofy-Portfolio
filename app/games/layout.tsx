import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Game Development",
  description: "Immersive, interactive game experiences built with Unity, C# and the web.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

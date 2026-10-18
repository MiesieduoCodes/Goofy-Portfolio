import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Work",
  description: "Selected websites, games and photography by Miesieduo Veria.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

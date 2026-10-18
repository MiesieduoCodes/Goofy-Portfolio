import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Music",
  description: "Drumming, production and sound design — plus a groove box you can play in the browser.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

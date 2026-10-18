import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mobile Apps",
  description: "Native and cross-platform mobile apps for iOS and Android.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

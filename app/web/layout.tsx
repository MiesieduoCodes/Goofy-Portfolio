import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Web Development",
  description: "Responsive, accessible and performant web applications built with modern technology.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

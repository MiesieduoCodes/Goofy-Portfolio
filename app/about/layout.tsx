import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Multi-disciplinary creative from Nigeria — engineer, photographer and drummer. Background, disciplines, toolkit and experience.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

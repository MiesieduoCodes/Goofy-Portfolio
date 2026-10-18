import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project or say hello — email, phone and a contact form.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

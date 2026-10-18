import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography",
  description: "Nature, wildlife, landscape and architectural photography from Nigeria and beyond.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

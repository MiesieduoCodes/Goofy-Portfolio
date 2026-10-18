"use client"

import { DisciplinePage } from "@/components/discipline-page"
import { websiteCategory } from "@/components/projects"

export default function WebPage() {
  return (
    <DisciplinePage
      label="Web development"
      titleLines={["Web", "Development"]}
      intro="Responsive, accessible and performant web applications with modern technologies and best practices — from concept to deployment."
      collectionName="websites"
      categorize={websiteCategory}
      category="web"
      toolsCategory="web"
      process={[
        { title: "Discovery", text: "Understanding requirements, goals and audience to create a solid foundation." },
        { title: "Design", text: "Wireframes and prototypes to visualise the interface and experience." },
        { title: "Development", text: "Clean, maintainable code built on modern best practices." },
        { title: "Deployment", text: "Testing, optimising and launching — with ongoing support and maintenance." },
      ]}
      empty={{ title: "Sites incoming", text: "New web projects are on the way." }}
      cta={{ eyebrow: "Ready to build something amazing?", title: "Start a site" }}
    />
  )
}

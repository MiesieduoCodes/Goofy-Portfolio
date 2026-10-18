"use client"

import { DisciplinePage } from "@/components/discipline-page"
import { websiteCategory } from "@/components/projects"

export default function MobilePage() {
  return (
    <DisciplinePage
      label="Mobile development"
      titleLines={["Mobile", "Apps"]}
      intro="Native and cross-platform apps that feel at home on every screen — fast, intuitive and built to last."
      collectionName="websites"
      categorize={websiteCategory}
      category="mobile"
      toolsCategory="mobile"
      capabilities={[
        { title: "iOS Development", text: "Native iOS apps using Swift and SwiftUI, following Apple's latest design guidelines." },
        { title: "Android Development", text: "Native Android apps using Kotlin and Jetpack Compose for modern UI." },
        { title: "Cross-Platform", text: "React Native, Expo and Flutter apps that run seamlessly on both platforms." },
        { title: "Progressive Web Apps", text: "Web apps that feel native on mobile, with offline capabilities." },
      ]}
      process={[
        { title: "Discovery & Strategy", text: "User needs, market research and defining the app's requirements and features." },
        { title: "UI/UX Design", text: "Intuitive interfaces, user flows and pixel-perfect designs for mobile screens." },
        { title: "Development", text: "Robust, scalable apps with clean code and a focus on performance." },
        { title: "Launch & Support", text: "App store deployment and ongoing maintenance and updates." },
      ]}
      empty={{ title: "Apps coming soon", text: "Mobile projects will appear here as they ship." }}
      cta={{ eyebrow: "Got an app idea?", title: "Let's build it" }}
    />
  )
}

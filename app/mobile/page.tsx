"use client"

import Link from "next/link"
import { MotionDiv } from "@/components/motion"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, Tablet, Code, Zap, Layers, Palette, Download } from "lucide-react"

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Mobile App <span className="text-gradient">Development</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Creating powerful, intuitive mobile applications for iOS and Android platforms.
              From concept to deployment, I build native and cross-platform solutions that delight users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start Your App Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#portfolio">
                  View Portfolio
                  <Smartphone className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </MotionDiv>
        </section>

        {/* Platform Expertise */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Platform <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive experience across all major mobile platforms and development frameworks
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Smartphone,
                title: "iOS Development",
                description: "Native iOS apps using Swift and SwiftUI with Apple's latest design guidelines",
                tech: ["Swift", "SwiftUI", "UIKit", "Core Data"],
                level: 85
              },
              {
                icon: Smartphone,
                title: "Android Development",
                description: "Native Android apps using Kotlin and Jetpack Compose for modern UI",
                tech: ["Kotlin", "Jetpack Compose", "Room", "Coroutines"],
                level: 80
              },
              {
                icon: Tablet,
                title: "Cross-Platform",
                description: "React Native, Expo, and Flutter apps that run seamlessly on both platforms",
                tech: ["React Native", "Expo", "Flutter", "Dart"],
                level: 90
              },
              {
                icon: Code,
                title: "Progressive Web Apps",
                description: "Web apps that feel native on mobile with offline capabilities",
                tech: ["PWA", "Service Workers", "Web APIs", "Caching"],
                level: 75
              }
            ].map((platform, index) => (
              <MotionDiv
                key={platform.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 text-center card-hover"
              >
                <platform.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{platform.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{platform.description}</p>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${platform.level}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mb-3">{platform.level}%</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {platform.tech.map((tech) => (
                    <span key={tech} className="px-1 py-0.5 bg-primary/10 text-primary text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Featured Apps */}
        <section id="portfolio" className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Mobile Apps</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A selection of mobile applications showcasing different platforms and use cases
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "HealthTrack Pro",
                description: "Comprehensive health and fitness tracking app with wearable integration and AI insights",
                tech: ["React Native", "Firebase", "HealthKit", "Google Fit"],
                image: "/placeholder.svg?height=400&width=600",
                platforms: ["iOS", "Android"],
                downloads: "50K+"
              },
              {
                title: "TaskMaster Flow",
                description: "Productivity app with smart scheduling, team collaboration, and project management",
                tech: ["Flutter", "Dart", "SQLite", "Push Notifications"],
                image: "/placeholder.svg?height=400&width=600",
                platforms: ["iOS", "Android"],
                downloads: "25K+"
              },
              {
                title: "Foodie Discovery",
                description: "Restaurant discovery app with reviews, recommendations, and social features",
                tech: ["React Native", "Expo", "Maps API", "Social Auth"],
                image: "/placeholder.svg?height=400&width=600",
                platforms: ["iOS", "Android"],
                downloads: "100K+"
              },
              {
                title: "LearnCode Academy",
                description: "Interactive coding education app with bite-sized lessons and hands-on projects",
                tech: ["Flutter", "Dart", "Video Streaming", "Gamification"],
                image: "/placeholder.svg?height=400&width=600",
                platforms: ["iOS", "Android", "Web"],
                downloads: "75K+"
              },
              {
                title: "BudgetWise Plus",
                description: "Personal finance management app with expense tracking and investment insights",
                tech: ["Swift", "SwiftUI", "Core Data", "Charts"],
                image: "/placeholder.svg?height=400&width=600",
                platforms: ["iOS"],
                downloads: "30K+"
              },
              {
                title: "TravelCompanion",
                description: "Travel planning app with itinerary management, booking integration, and local guides",
                tech: ["Kotlin", "Jetpack Compose", "Room", "Maps"],
                image: "/placeholder.svg?height=400&width=600",
                platforms: ["Android"],
                downloads: "40K+"
              }
            ].map((app, index) => (
              <MotionDiv
                key={app.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl overflow-hidden card-hover group"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                  <img 
                    src={app.image} 
                    alt={app.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300"></div>
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Download className="w-4 h-4 text-green-400 inline mr-1" />
                    <span className="text-xs text-green-400 font-medium">{app.downloads}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{app.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.tech.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      {app.platforms.map((platform) => (
                        <span key={platform} className="text-xs bg-muted px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/mobile/${app.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Development Process */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Mobile App <span className="text-gradient">Process</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive approach to mobile app development from concept to launch
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Layers,
                title: "Discovery & Strategy",
                description: "Understanding user needs, market research, and defining app requirements and features"
              },
              {
                icon: Palette,
                title: "UI/UX Design",
                description: "Creating intuitive interfaces, user flows, and pixel-perfect designs for mobile screens"
              },
              {
                icon: Code,
                title: "Development",
                description: "Building robust, scalable apps with clean code and best practices for performance"
              },
              {
                icon: Zap,
                title: "Launch & Support",
                description: "App store deployment, marketing support, and ongoing maintenance and updates"
              }
            ].map((step, index) => (
              <MotionDiv
                key={step.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 text-center card-hover"
              >
                <step.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Technical Skills */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Mobile Development <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive expertise in mobile technologies, frameworks, and best practices
            </p>
          </MotionDiv>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "React Native", level: 90 },
              { name: "Flutter", level: 85 },
              { name: "Expo", level: 80 },
              { name: "Swift", level: 80 },
              { name: "Kotlin", level: 75 },
              { name: "Firebase", level: 90 },
              { name: "Mobile UI/UX", level: 85 },
              { name: "App Store Optimization", level: 70 },
              { name: "Push Notifications", level: 80 }
            ].map((skill, index) => (
              <MotionDiv
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-xl p-6 text-center card-hover"
              >
                <div className="text-2xl font-bold mb-2">{skill.name}</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">{skill.level}%</div>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 md:p-12 text-center"
          >
            <Smartphone className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Your <span className="text-gradient">Mobile App?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's transform your idea into a powerful mobile application that users will love.
              From concept to App Store launch, I'll guide you through every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Start Your App
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#portfolio">
                  View Portfolio
                  <Tablet className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  )
}

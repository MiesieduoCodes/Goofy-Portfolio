"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Github, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter } from "lucide-react"
import { AnimatedText } from "@/components/animated-text"
import { ScrollReveal } from "@/components/scroll-reveal"
import { PageTransition } from "@/components/page-transition"
import emailjs from '@emailjs/browser'

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Replace these with your actual EmailJS credentials
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'your_service_id'
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'your_template_id'
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key'

      // Validate environment variables
      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration is missing. Please check your environment variables.")
      }

      // Send the email using EmailJS
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formState.name,
          from_email: formState.email,
          subject: formState.subject,
          message: formState.message,
          to_email: "goofydidthis@gmail.com" // Your receiving email
        },
        publicKey
      )

      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (err) {
      console.error("Failed to send email:", err)
      setError(err.message || "Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
      
      // Reset success/error messages after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setError("")
      }, 5000)
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/50 pt-16 md:pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>
        <div className="container relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Get in <span className="gradient-text">Touch</span>
            </h1>
          </motion.div>

          <AnimatedText
            text="I'd love to hear from you. Let's discuss your project or just say hello!"
            className="mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl"
            delay={0.5}
          />
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ScrollReveal>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter">Contact Information</h2>
              <p className="text-muted-foreground">
                Feel free to reach out through any of these channels. I'll get back to you as soon as possible.
              </p>

              <div className="space-y-4">
                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-3 text-primary shadow-md">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">goofydidthis@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-3 text-primary shadow-md">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">+234 906 064 2206, +234 906 648 6040</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/10 p-3 text-primary shadow-md">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-muted-foreground">Yenagoa, Bayelsa State</p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Connect on Social Media</h3>
                <div className="flex gap-4">
                  <motion.a
                    href="https://github.com/MiesieduoCodes"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full bg-muted p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </motion.a>

                  <motion.a
                    href="https://twitter.com/goofydidthis"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full bg-muted p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </motion.a>

                  <motion.a
                    href="https://instagram.com/goofydidthis"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full bg-muted p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </motion.a>

                  <motion.a
                    href="https://www.linkedin.com/in/goofydidthis/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    className="rounded-full bg-muted p-2 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">Send a Message</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-lg bg-primary/10 p-4 text-center"
                  >
                    <h3 className="font-medium text-primary">Message Sent!</h3>
                    <p className="mt-2 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-lg bg-destructive/10 p-4 text-center"
                  >
                    <h3 className="font-medium text-destructive">Error</h3>
                    <p className="mt-2 text-sm">{error}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Subject of your message"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message"
                        rows={5}
                        value={formState.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted py-16">
        <div className="container">
          <ScrollReveal>
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
              <p className="mt-4 max-w-[700px] text-muted-foreground">
                Here are answers to some common questions about my services and process
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                question: "What services do you offer?",
                answer:
                  "I offer web development, game development, nature photography, and drumming services. Each service can be tailored to your specific needs and requirements.",
              },
              {
                question: "How do you charge for your services?",
                answer:
                  "My rates vary depending on the project scope, complexity, and timeline. I offer both hourly and project-based pricing. Contact me for a custom quote.",
              },
              {
                question: "What is your typical process for new projects?",
                answer:
                  "I start with a discovery phase to understand your requirements, followed by planning, design, development, and delivery. I maintain clear communication throughout the process.",
              },
              {
                question: "Do you offer ongoing maintenance and support?",
                answer:
                  "Yes, I offer maintenance and support packages for web and game development projects to ensure your product remains up-to-date and functions smoothly.",
              },
              {
                question: "Can I purchase prints of your photography?",
                answer:
                  "My nature photographs are available as high-quality prints in various sizes and formats. Contact me for pricing and options.",
              },
              {
                question: "Are you available for remote work?",
                answer:
                  "Yes, I work with clients globally and am comfortable with remote collaboration using various communication and project management tools.",
              },
            ].map((faq, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">{faq.question}</h3>
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <Card className="border-none bg-gradient-to-r from-primary/20 to-primary/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <ScrollReveal>
              <h2 className="text-2xl font-bold sm:text-3xl">Ready to Start a Project?</h2>
              <p className="max-w-[600px] text-muted-foreground">
                I'm excited to hear about your ideas and help bring them to life. Let's create something amazing
                together!
              </p>
            </ScrollReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Button size="lg" asChild className="mt-4">
                <Link href="mailto:goofydidthis@gmail.com">
                  Email Me Directly
                  <Mail className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </section>
      </div>
    </PageTransition>
  )
}
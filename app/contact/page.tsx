import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@miesieduo.veria",
    href: "mailto:hello@miesieduo.veria",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 XXX XXX XXXX",
    href: "tel:+234XXXXXXXXXX",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nigeria",
    href: "#",
  },
];

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com/miesieduo",
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/miesieduo-veria",
    label: "LinkedIn",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/miesieduo",
    label: "Twitter",
  },
];

export default function Contact() {
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
              Get In <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to start your next project? Let's discuss how we can bring your ideas to life 
              with technical excellence and creative innovation.
            </p>
          </MotionDiv>
        </section>

        {/* Contact Content */}
        <section className="container-custom py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="glass rounded-xl p-8">
                <h2 className="font-display text-2xl font-bold mb-6">
                  Send a <span className="text-gradient">Message</span>
                </h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                      placeholder="Project Inquiry"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none transition-colors resize-none"
                      placeholder="Tell me about your project..."
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" variant="hero" size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </MotionDiv>

            {/* Contact Info */}
            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <div className="glass rounded-xl p-8">
                <h2 className="font-display text-2xl font-bold mb-6">
                  Contact <span className="text-gradient">Information</span>
                </h2>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <info.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        <Link
                          href={info.href}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {info.value}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="glass rounded-xl p-8">
                <h2 className="font-display text-2xl font-bold mb-6">
                  Connect <span className="text-gradient">Online</span>
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Follow my work and connect on social media for updates and insights.
                </p>
                
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Response Time */}
              <div className="glass rounded-xl p-8">
                <h3 className="font-semibold text-lg mb-3">Response Time</h3>
                <p className="text-muted-foreground">
                  I typically respond to inquiries within 24-48 hours. For urgent matters, 
                  please mention it in your message subject line.
                </p>
              </div>
            </MotionDiv>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Let's Create Something <span className="text-gradient">Amazing</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you have a specific project in mind or just want to explore possibilities, 
              I'm excited to hear from you and discuss how we can work together.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/work">
                <Button variant="heroOutline" size="lg">
                  View My Work
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="heroOutline" size="lg">
                  Learn About Services
                </Button>
              </Link>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

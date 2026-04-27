"use client";

import { useEffect, useState } from "react";
import { initContact3D } from "../animations/contact3d";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, Loader2, Github, Linkedin, Instagram, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AmbientParticles from "@/components/ambient-particles";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Ensuring DOM is fully painted before initializing 3D animations
    const timer = setTimeout(() => {
      initContact3D();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate signal transmission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Signal Received. Expect a transmission within 48 hours.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Navbar />

      {/* AMBIENT PARTICLES (REUSED FROM ABOUT) */}
      <AmbientParticles />

      {/* NOISE OVERLAY FOR STUDIO TEXTURE */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <main className="pt-32 pb-20 px-6 md:px-12 relative z-10 perspective-[1200px]">

        {/* HERO HEADER */}
        <section className="mb-24 text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic">
            Enter the <span className="text-white/20">Portal</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide">
            Let’s build something that doesn’t feel like a website.
          </p>
        </section>

        {/* INTERACTIVE 3D GRID */}
        <section className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto">

          {/* TRANSMISSION FORM */}
          <div className="contact-card glass-dark p-8 md:p-12 rounded-2xl border border-white/5 relative group">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter italic">Send Transmission</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Identity</label>
                  <input
                    required
                    placeholder="Your Name"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Frequency</label>
                  <input
                    required
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Objective</label>
                <input
                  required
                  placeholder="Subject"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Message Body</label>
                <textarea
                  required
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-lg focus:border-primary/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 resize-none"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-16 text-lg font-black uppercase tracking-widest group relative overflow-hidden bg-white text-black hover:bg-white/90">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? "Syncing..." : "Send Signal"}
                </span>
              </Button>
            </form>
          </div>

          {/* CONTACT INFO SIDEBAR */}
          <div className="space-y-8 flex flex-col justify-center">

            <div className="contact-card glass-dark p-10 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
              <h2 className="text-sm font-bold mb-8 uppercase tracking-[0.3em] text-white/30">Coordinates</h2>

              <div className="space-y-6 text-white/70">
                <a href="mailto:miesieduoveria@gmail.com" className="flex items-center gap-4 group hover:text-white transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">miesieduoveria@gmail.com</span>
                </a>
                <a href="tel:+2349060462206" className="flex items-center gap-4 group hover:text-white transition-colors">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">+234 906 046 2206</span>
                </a>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">Kazakhstan / Remote</span>
                </div>
              </div>
            </div>

            <div className="contact-card glass-dark p-10 rounded-2xl border border-white/5">
              <h2 className="text-sm font-bold mb-8 uppercase tracking-[0.3em] text-white/30">Neural Networks</h2>

              <div className="flex gap-6">
                {[
                  { icon: Github, href: "https://github.com/MiesieduoCodes" },
                  { icon: Linkedin, href: "https://ng.linkedin.com/in/goofydidthis" },
                  { icon: Instagram, href: "https://www.instagram.com/goofy_did_this/" },
                  { icon: X, href: "https://x.com/MiesieduoVeria/" }
                ].map((social, i) => (
                  <Link key={i} href={social.href} className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all transform hover:-translate-y-2">
                    <social.icon className="w-6 h-6" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="contact-card glass-dark p-8 rounded-2xl border border-white/5 bg-primary/5">
              <p className="text-white/40 text-sm leading-relaxed italic">
                "Response window: 24–48 hours. <br />
                Urgent? Mark your signal accordingly for prioritized bandwidth."
              </p>
            </div>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
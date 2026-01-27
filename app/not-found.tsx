import { MotionDiv, MotionH1 } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* 404 Text */}
            <div className="mb-8">
              <MotionH1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-display text-8xl md:text-9xl font-bold text-primary"
              >
                404
              </MotionH1>
            </div>

            {/* Error Message */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4 mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                Page Not <span className="text-gradient">Found</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Oops! The page you're looking for seems to have vanished into the digital void. 
                Don't worry though, let's get you back to where the action is.
              </p>
            </MotionDiv>

            {/* Action Buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button variant="default" size="lg" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/work">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Portfolio
                </Link>
              </Button>
            </MotionDiv>

            {/* Helpful Links */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="glass rounded-xl p-8 max-w-2xl mx-auto"
            >
              <h3 className="font-semibold text-xl mb-6">Looking for something specific?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/about"
                  className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <h4 className="font-medium mb-1">About Me</h4>
                  <p className="text-sm text-muted-foreground">Learn about my background and expertise</p>
                </Link>
                <Link
                  href="/services"
                  className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <h4 className="font-medium mb-1">Services</h4>
                  <p className="text-sm text-muted-foreground">Explore what I can do for your project</p>
                </Link>
                <Link
                  href="/work"
                  className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <h4 className="font-medium mb-1">Portfolio</h4>
                  <p className="text-sm text-muted-foreground">View my recent work and projects</p>
                </Link>
                <Link
                  href="/contact"
                  className="text-left p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
                >
                  <h4 className="font-medium mb-1">Contact</h4>
                  <p className="text-sm text-muted-foreground">Get in touch for collaborations</p>
                </Link>
              </div>
            </MotionDiv>

            {/* Fun Animation */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-16"
            >
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <MotionDiv
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-5 h-5" />
                </MotionDiv>
                <span className="text-sm">Still searching...</span>
              </div>
            </MotionDiv>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

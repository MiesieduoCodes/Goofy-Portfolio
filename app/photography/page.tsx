import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Camera, Eye, Download, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const photographyCategories = [
  {
    title: "Nature & Wildlife",
    description: "Capturing the raw beauty of the natural world and its inhabitants.",
    image: "/placeholder.svg",
    count: 24,
  },
  {
    title: "Landscape",
    description: "Ethereal landscapes that tell stories of time and place.",
    image: "/placeholder.svg",
    count: 18,
  },
  {
    title: "Architecture",
    description: "Modern and traditional structures through a creative lens.",
    image: "/placeholder.svg",
    count: 12,
  },
  {
    title: "Commercial",
    description: "Professional photography for brands and businesses.",
    image: "/placeholder.svg",
    count: 8,
  },
];

const featuredPhotos = [
  {
    title: "Sunset at the Delta",
    category: "Landscape",
    location: "Niger Delta",
    date: "2024",
    description: "Golden hour captures the serene beauty of the coastal wetlands.",
  },
  {
    title: "Urban Rhythm",
    category: "Architecture",
    location: "Lagos",
    date: "2024",
    description: "Modern architecture meets traditional urban planning.",
  },
  {
    title: "Wildlife Portrait",
    category: "Nature & Wildlife",
    location: "Yankari Reserve",
    date: "2023",
    description: "Intimate portrait of Nigeria's diverse wildlife.",
  },
];

export default function Photography() {
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
              <span className="text-gradient">Photography</span> Portfolio
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Through my lens, I capture the essence of moments, places, and stories. 
              Specializing in nature, wildlife, landscape, and architectural photography 
              with a focus on the unique beauty of Nigeria and beyond.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Portfolio
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link href="/contact">License Inquiries</Link>
              </Button>
            </div>
          </MotionDiv>
        </section>

        {/* Featured Photos */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Work</span>
            </h2>
            <p className="text-muted-foreground">
              A selection of my most recent and notable photography projects.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPhotos.map((photo, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="glass rounded-xl overflow-hidden card-hover">
                  {/* Photo */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-primary/30" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                        {photo.category}
                      </span>
                      <Eye className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {photo.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {photo.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {photo.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {photo.date}
                      </div>
                    </div>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Photography <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-muted-foreground">
              Explore different genres and styles of photography I specialize in.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 gap-8">
            {photographyCategories.map((category, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="glass rounded-xl overflow-hidden card-hover">
                  {/* Category Image */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-16 h-16 text-primary/30" />
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">{category.count} Photos</span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Equipment Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Professional <span className="text-gradient">Equipment</span>
            </h2>
            <p className="text-muted-foreground">
              High-quality gear to ensure exceptional image quality and reliability.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-3">Cameras</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Sony Alpha A7R IV</li>
                <li>Sony Alpha A7 III</li>
                <li>Sony RX100 VII</li>
              </ul>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-3">Lenses</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Sony 24-70mm f/2.8 GM</li>
                <li>Sony 70-200mm f/2.8 GM</li>
                <li>Sony 85mm f/1.4 GM</li>
              </ul>
            </div>
            <div className="glass rounded-xl p-6 text-center">
              <h3 className="font-semibold text-lg mb-3">Accessories</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>DJI Ronin Gimbal</li>
                <li>Profoto Lighting</li>
                <li>Manfrotto Tripods</li>
              </ul>
            </div>
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
              License My <span className="text-gradient">Work</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              All photographs are available for licensing for commercial and editorial use. 
              Contact me for rates, usage rights, and custom photography projects.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button variant="hero" size="lg">
                  Get License Information
                </Button>
              </Link>
              <Button variant="heroOutline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Media Kit
              </Button>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

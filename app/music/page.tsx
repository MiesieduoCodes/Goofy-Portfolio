import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Music as MusicIcon, Play, Download, Headphones, Mic, Drum } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const musicProjects = [
  {
    title: "Rhythms of the Niger",
    description: "A fusion project blending traditional Nigerian rhythms with modern electronic production.",
    genre: "World Fusion",
    year: "2024",
    duration: "3:45",
  },
  {
    title: "Urban Pulse",
    description: "Contemporary drum patterns for urban music production featuring complex polyrhythms.",
    genre: "Hip-Hop/R&B",
    year: "2024",
    duration: "4:12",
  },
  {
    title: "Cinematic Landscapes",
    description: "Epic percussion compositions designed for film and game soundtracks.",
    genre: "Cinematic",
    year: "2023",
    duration: "5:30",
  },
];

const services = [
  {
    icon: Mic,
    title: "Session Drumming",
    description: "Professional drum recording for your tracks with various styles and techniques.",
    features: ["Live Recording", "Remote Sessions", "Multiple Genres", "High-Quality Audio"],
  },
  {
    icon: Headphones,
    title: "Music Production",
    description: "Full production services from composition to final mixing and mastering.",
    features: ["Beat Making", "Arrangement", "Mixing", "Mastering"],
  },
  {
    icon: MusicIcon,
    title: "Sound Design",
    description: "Custom sound effects and audio assets for games, films, and multimedia projects.",
    features: ["Game Audio", "Film Scoring", "Sound Effects", "Foley"],
  },
];

const equipment = [
  "DW Collector's Series Drums",
  "Zildjian K Custom Cymbals",
  "Pearl Hardware",
  "Shure SM57 & SM58 Mics",
  "AKG C414 Condenser",
  "Focusrite Scarlett Interface",
  "Pro Tools & Logic Pro X",
  "Superior Drummer 3",
];

export default function Music() {
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
              <span className="text-gradient">Music</span> Production
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Rhythm is the foundation of all great music. As a drummer and producer, 
              I bring percussive expertise to every project, creating compelling rhythmic 
              landscapes for artists, games, and media productions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Listen to Demo Reel
              </Button>
              <Button variant="heroOutline" size="lg" asChild>
                <Link href="/contact">Book a Session</Link>
              </Button>
            </div>
          </MotionDiv>
        </section>

        {/* Featured Projects */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground">
              Recent collaborations and original productions showcasing my musical range.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {musicProjects.map((project, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass rounded-xl p-6 card-hover">
                  {/* Audio Player Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-6 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to play</p>
                    </div>
                  </div>

                  {/* Project Info */}
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="tech-tag">{project.genre}</span>
                    <span>{project.duration}</span>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Music <span className="text-gradient">Services</span>
            </h2>
            <p className="text-muted-foreground">
              Professional music services tailored to your project needs.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="glass rounded-xl p-6 h-full card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  
                  <ul className="space-y-1">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
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
              Studio <span className="text-gradient">Equipment</span>
            </h2>
            <p className="text-muted-foreground">
              Professional-grade gear for pristine audio quality and production excellence.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipment.map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="glass rounded-lg p-4 text-center"
              >
                <Drum className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{item}</p>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Collaboration Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Let's Create <span className="text-gradient">Together</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you need drum tracks for your next album, sound design for your game, 
              or a full production for your project, I'm here to bring rhythmic excellence to your vision.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button variant="hero" size="lg">
                  Start Collaboration
                </Button>
              </Link>
              <Button variant="heroOutline" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Press Kit
              </Button>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

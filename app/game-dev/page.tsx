import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Gamepad2, Code, Zap, Cpu, Monitor, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const gameProjects = [
  {
    title: "Aetheris Engine",
    description: "Custom procedural terrain generation system for large-scale open-world games.",
    technologies: ["Unity", "C#", "Compute Shaders", "GPU Instancing"],
    category: "Engine Development",
    year: "2024",
  },
  {
    title: "Neon Rush Racing",
    description: "High-speed arcade racing game with advanced physics and visual effects.",
    technologies: ["Unity", "HDRP", "Custom Physics", "Multiplayer"],
    category: "Game Development",
    year: "2023",
  },
  {
    title: "Puzzle Quest VR",
    description: "Immersive VR puzzle game with intuitive hand-tracking interactions.",
    technologies: ["Unity", "Oculus SDK", "C#", "3D Math"],
    category: "VR/AR",
    year: "2023",
  },
];

const services = [
  {
    icon: Code,
    title: "Game Programming",
    description: "Custom game mechanics, systems architecture, and performance optimization.",
    features: ["C# Programming", "Game Systems", "AI & Behavior", "Network Code"],
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Advanced optimization techniques for smooth gameplay across all platforms.",
    features: ["GPU Optimization", "Memory Management", "Frame Rate Stability", "Platform Porting"],
  },
  {
    icon: Cpu,
    title: "Shader Development",
    description: "Custom shaders and visual effects for stunning game visuals.",
    features: ["HLSL Shaders", "VFX Graph", "Post-Processing", "Material Systems"],
  },
];

const technologies = [
  "Unity 3D",
  "C# Programming",
  "Unity DOTS",
  "Compute Shaders",
  "HLSL",
  "VR/AR Development",
  "Mobile Optimization",
  "Multiplayer Networking",
  "Physics Programming",
  "Procedural Generation",
];

export default function GameDev() {
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
              Game <span className="text-gradient">Development</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Creating immersive interactive experiences through advanced game development techniques. 
              Specializing in Unity/C# programming, procedural generation, shader development, and performance optimization 
              for mobile, PC, and VR platforms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="default" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Play Demo Games
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Discuss Your Project</Link>
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
              Recent game development projects showcasing technical expertise and creative innovation.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameProjects.map((project, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="glass rounded-xl overflow-hidden card-hover">
                  {/* Game Preview */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Gamepad2 className="w-16 h-16 text-primary/30" />
                    </div>
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-medium">{project.category}</span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
                        {project.year}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4">
                      {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="tech-tag">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <Button variant="ghost" size="sm" className="w-full">
                      <Play className="w-3 h-3 mr-2" />
                      View Project
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
              Development <span className="text-gradient">Services</span>
            </h2>
            <p className="text-muted-foreground">
              Comprehensive game development services from concept to deployment.
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

        {/* Technologies Grid */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Technical <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-muted-foreground">
              Core technologies and tools I specialize in for game development.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {technologies.map((tech, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="glass rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
              >
                <Monitor className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{tech}</p>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Development <span className="text-gradient">Process</span>
            </h2>
            <p className="text-muted-foreground">
              A structured approach to game development ensuring quality and timely delivery.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Concept & Design", description: "Game design document and prototype development" },
              { step: "02", title: "Core Systems", description: "Building fundamental game mechanics and systems" },
              { step: "03", title: "Content Creation", description: "Level design, assets, and gameplay implementation" },
              { step: "04", title: "Polish & Launch", description: "Optimization, testing, and deployment" },
            ].map((phase, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-4">{phase.step}</div>
                <h3 className="font-semibold text-lg mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground">{phase.description}</p>
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
            className="text-center"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Your <span className="text-gradient">Game?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you need a complete game development service or specialized programming expertise, 
              I'm here to help bring your gaming vision to life with technical excellence.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button variant="default" size="lg">
                  Start Your Project
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Gamepad2 className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            </div>
          </MotionDiv>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import { MotionDiv } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { 
  Code, 
  Gamepad2, 
  Camera, 
  Music, 
  ArrowRight,
  Layers,
  Zap,
  RefreshCw,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Code,
    title: "Web Development",
    description: "Scalable, modern web applications built with performance and accessibility at the core. Full-stack expertise from concept to deployment.",
    href: "/services/web",
    features: ["React / Next.js", "TypeScript", "API Integration", "Performance Optimization"],
  },
  {
    icon: Gamepad2,
    title: "Game Development",
    description: "Immersive interactive experiences and procedural engine design using modern physics and AI. Unity specialist with C# expertise.",
    href: "/services/games",
    features: ["Unity / C#", "Procedural Generation", "Shader Programming", "Mobile Optimization"],
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Professional photography and cinematic visual storytelling captured through a specialized lens. Nature, wildlife, and architectural focus.",
    href: "/photography",
    features: ["Nature & Wildlife", "Landscape", "Commercial", "Licensing"],
  },
  {
    icon: Music,
    title: "Music Production",
    description: "Percussion and rhythm-based composition. Specialized in rhythmic textures for digital media, games, and video production.",
    href: "/music",
    features: ["Session Work", "Soundscapes", "Video Scoring", "Live Performance"],
  },
];

const expertise = [
  {
    icon: Layers,
    title: "Full-Stack Architecture",
    description: "End-to-end development with modern frameworks, cloud deployment, and scalable infrastructure design.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Lightning-fast applications with optimized code, efficient algorithms, and modern performance techniques.",
  },
  {
    icon: RefreshCw,
    title: "Agile Development",
    description: "Iterative development process with continuous integration, testing, and rapid deployment cycles.",
  },
  {
    icon: Search,
    title: "Creative Problem-Solving",
    description: "Innovative solutions to complex technical challenges with a focus on user experience and business goals.",
  },
];

export default function Services() {
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
              My <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Comprehensive services spanning web development, game development, photography, and music production. 
              Each service delivered with technical excellence and creative innovation.
            </p>
          </MotionDiv>
        </section>

        {/* Services Grid */}
        <section className="container-custom py-16">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="glass rounded-xl p-8 h-full card-hover group">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link href={service.href}>
                    <Button variant="ghost" className="group/btn p-0 h-auto font-medium">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </MotionDiv>
            ))}
          </div>
        </section>

        {/* Expertise Section */}
        <section className="container-custom py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Core <span className="text-gradient">Expertise</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The fundamental principles and capabilities that underpin all my services and deliver exceptional results.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="glass rounded-xl p-6 h-full card-hover">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
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
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              My <span className="text-gradient">Process</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A structured approach to ensure successful project delivery from concept to completion.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Discovery", description: "Understanding your needs and goals" },
              { step: "02", title: "Planning", description: "Creating a detailed roadmap" },
              { step: "03", title: "Development", description: "Building with quality and precision" },
              { step: "04", title: "Delivery", description: "Launching and ongoing support" },
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
              Ready to <span className="text-gradient">Start</span> Your Project?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Let's discuss how my services can help bring your vision to life with technical excellence and creative innovation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button variant="hero" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/work">
                <Button variant="heroOutline" size="lg">
                  View Portfolio
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

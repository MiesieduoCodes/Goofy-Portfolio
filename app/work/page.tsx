"use client";

import { useState, useEffect } from "react";
import { MotionDiv, MotionImg } from "@/components/motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, query } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = ["All", "Websites", "Games"];

export default function Work() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Awwwards-level tilt effect
  const tilt = {
    initial: { rotateX: 0, rotateY: 0 },
    hover: {
      rotateX: -5,
      rotateY: 5,
      transition: { type: "spring", stiffness: 150, damping: 15 },
    },
  };

  // Fetch + unify Firebase data
  useEffect(() => {
    setLoading(true);

    const websitesQuery = query(collection(db, "websites"));
    const gamesQuery = query(collection(db, "games"));

    let websites: any[] = [];
    let games: any[] = [];

    const update = () => {
      setProjects([...websites, ...games]);
      setLoading(false);
    };

    const unsubWebsites = onSnapshot(websitesQuery, (snap) => {
      websites = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        category: "web",
      }));
      update();
    });

    const unsubGames = onSnapshot(gamesQuery, (snap) => {
      games = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        category: "games",
      }));
      update();
    });

    return () => {
      unsubWebsites();
      unsubGames();
    };
  }, []);

  // Filtering
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) =>
          selectedCategory === "Websites"
            ? p.category === "web"
            : p.category === "games"
        );

  if (loading)
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24">
          <div className="flex justify-center py-32">
            <div className="animate-spin h-14 w-14 border-4 border-primary border-b-transparent rounded-full"></div>
          </div>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">

        {/* Hero */}
        <section className="container-custom py-20">
          <MotionDiv
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              My <span className="text-gradient">Work</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A showcase of websites, games, and digital experiences built with
              precision, performance, and a touch of creativity.
            </p>
          </MotionDiv>
        </section>

        {/* Filter */}
        <section className="container-custom py-10">
          <div className="flex justify-center gap-4 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${
                  selectedCategory === c
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Projects Grid – Awwwards Motion */}
        <section className="container-custom py-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project, i) => (
              <Link key={project.id} href={project.link || "#"} target="_blank">
                <MotionDiv
                  variants={tilt}
                  initial="initial"
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-black/5 relative"
                >
                  {/* Card Shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-br from-white/[0.15] to-transparent" />

                  {/* Image */}
                  <MotionImg
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="w-full aspect-video object-cover rounded-xl group-hover:scale-105 transition-all duration-700"
                  />

                  {/* Content */}
                  <div className="mt-4 p-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                        {project.category === "web" ? "Website" : "Game"}
                      </span>

                      <ArrowUpRight className="h-5 w-5 opacity-50 group-hover:opacity-100 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>

                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.tags?.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 border border-border rounded-full text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </MotionDiv>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-custom py-20 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Have a <span className="text-gradient">Project</span> in Mind?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Let's create something exceptional together.
            </p>

            <div className="flex justify-center gap-4">
              <Link href="/contact">
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition">
                  Get in Touch
                </button>
              </Link>

              <Link href="/services">
                <button className="border border-border px-8 py-3 rounded-lg hover:border-primary hover:text-primary transition">
                  View Services
                </button>
              </Link>
            </div>
          </MotionDiv>
        </section>
      </main>

      <Footer />
    </div>
  );
}
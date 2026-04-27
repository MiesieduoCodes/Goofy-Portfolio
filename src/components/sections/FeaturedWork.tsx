'use client';

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BentoGrid } from "@/components/bento-grid";

// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";

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

export function FeaturedWork() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // We fetch from both websites and games where featured is true
    const websitesQuery = query(collection(db, "websites"), where("featured", "==", true));
    const gamesQuery = query(collection(db, "games"), where("featured", "==", true));

    let websites: any[] = [];
    let games: any[] = [];

    const update = () => {
      // Sort by createdAt or just merge
      const merged = [...websites, ...games].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setProjects(merged.slice(0, 5)); // Limit to top 5 for the bento grid
      setLoading(false);
    };

    const unsubWebsites = onSnapshot(websitesQuery, (snap) => {
      websites = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      update();
    });

    const unsubGames = onSnapshot(gamesQuery, (snap) => {
      games = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      update();
    });

    return () => {
      unsubWebsites();
      unsubGames();
    };
  }, []);
  return (
    <section className="bg-black py-20 relative overflow-hidden">
      {/* ───────── AMBIENT GLOW ───────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px]" />
      </div>

      {/* ───────── GRAIN LAYER ───────── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-soft-light bg-[url('/grain.png')] bg-cover" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-20"
        >
          <div>
            <span className="text-white/30 font-mono text-sm uppercase tracking-widest"> My Favourite Projects...</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mt-4">
              Digital Artifacts.
            </h2>
          </div>
          <Link
            href="/work"
            className="text-white font-bold text-sm flex items-center gap-2 hover:gap-4 transition-all group"
          >
            View All Projects
            <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Elite Bento Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : projects.length > 0 ? (
          <BentoGrid projects={projects} />
        ) : (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
            <p className="text-white/30 italic">No digital artifacts featured yet.</p>
            <p className="text-white/10 text-xs mt-2 uppercase tracking-widest">Enable 'Featured' in Admin to showcase artifacts here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

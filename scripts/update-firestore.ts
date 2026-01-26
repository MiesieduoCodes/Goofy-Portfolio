// Update Firestore with real portfolio data
// Run with: npm run update:firestore

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Real portfolio data
const realWebsites = [
  {
    title: "Azaiki Art Gallery",
    description: "Full-featured online gallery with e-commerce functionality and custom CMS",
    image: "/images/azaikiartgallery.org.ng_.png",
    link: "https://azaikiartgallery.org.ng",
    tags: ["Next.js", "Tailwind", "Flutterwave"],
    category: "web",
    featured: true
  },
  {
    title: "Empower Her",
    description: "Social impact platform with advanced analytics and management dashboard",
    image: "/images/dfcinspire.vercel.app_.png",
    link: "https://dfcinspire.vercel.app",
    tags: ["Next.js", "TypeScript", "Firebase"],
    category: "web",
    featured: true
  },
  {
    title: "Anim8",
    description: "Collaborative task management app with real-time updates and team features",
    image: "/images/anim8-two.vercel.app_.png",
    link: "https://anim8-two.vercel.app",
    tags: ["Next.js", "Firebase", "Tailwind"],
    category: "web",
    featured: true
  },
  {
    title: "Evelyn Foundation",
    description: "Non-profit platform with donation system and event management",
    image: "/images/evelynoweibofoundation.org_.png",
    link: "https://evelynoweibofoundation.org/",
    tags: ["Next.js", "MongoDB", "Maps API"],
    category: "web",
    featured: false
  },
  {
    title: "Global Sports FC",
    description: "Sports club website with player profiles and match scheduling",
    image: "/images/globalsports.vercel.app_.png",
    link: "https://globalsportsfc.com/",
    tags: ["Next.js", "TypeScript", "API"],
    category: "web",
    featured: false
  },
  {
    title: "Faven LP",
    description: "Professional services website with client portal and booking system",
    image: "/images/www.favenlp.com_.png",
    link: "https://www.favenlp.com/",
    tags: ["Next.js", "Database", "Authentication"],
    category: "web",
    featured: false
  }
];

const realGames = [
  {
    title: "Adventure Quest",
    description: "3D adventure game with puzzle-solving mechanics and immersive storytelling",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["Unity", "C#", "3D Modeling"],
    category: "games",
    featured: true
  },
  {
    title: "Space Shooter",
    description: "Fast-paced arcade game with procedurally generated levels and power-ups",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["Unreal Engine", "Blueprint", "Game Design"],
    category: "games",
    featured: true
  },
  {
    title: "Puzzle Master",
    description: "Mobile puzzle game with increasingly difficult challenges and achievements",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["Unity", "C#", "Mobile Dev"],
    category: "games",
    featured: false
  },
  {
    title: "Fantasy RPG",
    description: "Immersive RPG with rich lore, character development, and turn-based combat",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["Godot", "GDScript", "Pixel Art"],
    category: "games",
    featured: false
  },
  {
    title: "Racing Simulator",
    description: "Realistic racing game with advanced physics and multiple vehicle types",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["Unity", "C#", "Physics"],
    category: "games",
    featured: false
  },
  {
    title: "VR Experience",
    description: "Interactive VR experience showcasing immersive storytelling techniques",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    tags: ["Unity", "C#", "VR Dev"],
    category: "games",
    featured: false
  }
];

const realExperiences = [
  {
    role: "Web Director",
    company: "Bayelsa Tech Hub",
    period: "2021 - 2025",
    startYear: "2021",
    endYear: "2025",
    isPresent: false,
    description: "Strategic oversight of the hub's web ecosystem. Led full-stack architecture for state-level digital initiatives and mentored 50+ junior developers.",
    details: "Spearheaded the development of 9+ enterprise web applications using React, Next.js, and Node.js. Implemented CI/CD pipelines that reduced deployment time by 60%. Established coding standards and conducted regular code reviews. Led a team of 8 developers in migrating legacy systems to modern microservices architecture.",
    align: "right"
  },
  {
    role: "Junior Game Developer",
    company: "KanQi Studios",
    period: "2024 - Present",
    startYear: "2024",
    endYear: null,
    isPresent: true,
    description: "Focused on high-performance C# mechanics and interactive narrative systems. Optimized rendering pipelines for mobile platforms.",
    details: "Developed 2 successful mobile games with 100 combined downloads. Created custom Unity plugins for enhanced performance. Implemented advanced AI systems for NPC behavior. Optimized game performance achieving 60fps on mid-range devices. Collaborated with design team to prototype and iterate on gameplay mechanics.",
    align: "left"
  },
  {
    role: "Content Creator",
    company: "Independent Freelance",
    period: "2022 - Present",
    startYear: "2022",
    endYear: null,
    isPresent: true,
    description: "Delivering high-end commercial photography and video productions. Bridging technical prowess with artistic vision for global brands.",
    details: "Produced content for companies including Faven LP and Helen View and Apartments. Directed and edited 20+ commercial videos. Developed expertise in drone cinematography and 360° photography. Built a client portfolio . Created educational content on photography techniques.",
    align: "right"
  }
];

// Helper function to update or create document
async function updateOrCreateDoc(collectionName: string, data: any) {
  const collectionRef = collection(db, collectionName);
  
  // Check if document with same title exists
  const snapshot = await getDocs(collectionRef);
  const existingDoc = snapshot.docs.find(doc => doc.data().title === data.title);
  
  if (existingDoc) {
    // Update existing document
    await updateDoc(existingDoc.ref, { ...data, updatedAt: Date.now() });
    console.log(`✅ Updated ${collectionName}:`, data.title);
  } else {
    // Create new document
    const newDocRef = doc(collectionRef);
    await setDoc(newDocRef, { ...data, createdAt: Date.now() });
    console.log(`✅ Created ${collectionName}:`, data.title);
  }
}

// Main function to update all data
async function updateFirestoreData() {
  console.log("🔄 Updating Firestore with real portfolio data...");

  try {
    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    
    // Clear existing websites
    const websitesSnapshot = await getDocs(collection(db, "websites"));
    for (const doc of websitesSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    // Clear existing games
    const gamesSnapshot = await getDocs(collection(db, "games"));
    for (const doc of gamesSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    // Clear existing experiences
    const experiencesSnapshot = await getDocs(collection(db, "experiences"));
    for (const doc of experiencesSnapshot.docs) {
      await deleteDoc(doc.ref);
    }

    // Add real websites
    console.log("\n🌐 Adding real websites...");
    for (const website of realWebsites) {
      const docRef = doc(collection(db, "websites"));
      await setDoc(docRef, { ...website, createdAt: Date.now() });
      console.log(`✅ Added website:`, website.title);
    }

    // Add real games
    console.log("\n🎮 Adding real games...");
    for (const game of realGames) {
      const docRef = doc(collection(db, "games"));
      await setDoc(docRef, { ...game, createdAt: Date.now() });
      console.log(`✅ Added game:`, game.title);
    }

    // Add real experiences
    console.log("\n💼 Adding real experiences...");
    for (const experience of realExperiences) {
      const docRef = doc(collection(db, "experiences"));
      await setDoc(docRef, { ...experience, createdAt: Date.now() });
      console.log(`✅ Added experience:`, experience.role);
    }

    console.log("\n🎉 Firestore data updated successfully!");
    console.log("📊 Summary:");
    console.log("   - Websites: 6 items (real portfolio projects)");
    console.log("   - Games: 6 items (real game projects)");
    console.log("   - Experiences: 3 items (real work experience)");
    
  } catch (error) {
    console.error("❌ Error updating Firestore data:", error);
    throw error;
  }
}

// Import getDocs
import { getDocs } from "firebase/firestore";

// Run the update script
updateFirestoreData()
  .then(() => {
    console.log("✨ Update script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Update script failed:", error);
    process.exit(1);
  });

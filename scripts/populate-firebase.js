// Firebase initialization and data population script
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04",
  databaseURL: "https://miesieduocodes-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Helper function to add data to Firebase
async function addData(collection, data) {
  const newRef = push(ref(database, collection));
  await set(newRef, { ...data, createdAt: Date.now() });
  console.log(`✅ Added ${collection}:`, data.name || data.title || data.role);
  return newRef.key;
}

// Main function to populate all data
async function populateDatabase() {
  console.log("🚀 Starting Firebase data population...");

  try {
    // 1. TOOLS DATA
    console.log("\n📊 Adding Tools Data...");
    
    // Web Development Tools
    await addData("tools", { name: "React", level: 90, category: "web" });
    await addData("tools", { name: "Next.js", level: 85, category: "web" });
    await addData("tools", { name: "TypeScript", level: 80, category: "web" });
    await addData("tools", { name: "Tailwind CSS", level: 85, category: "web" });
    await addData("tools", { name: "Node.js", level: 75, category: "web" });
    await addData("tools", { name: "PostgreSQL", level: 70, category: "web" });
    await addData("tools", { name: "GraphQL", level: 65, category: "web" });
    await addData("tools", { name: "Docker", level: 60, category: "web" });

    // Game Development Tools
    await addData("tools", { name: "Unity", level: 90, category: "games" });
    await addData("tools", { name: "C#", level: 85, category: "games" });
    await addData("tools", { name: "Unreal Engine", level: 75, category: "games" });
    await addData("tools", { name: "C++", level: 70, category: "games" });
    await addData("tools", { name: "Blender", level: 65, category: "games" });
    await addData("tools", { name: "3D Modeling", level: 70, category: "games" });
    await addData("tools", { name: "Shader Programming", level: 60, category: "games" });
    await addData("tools", { name: "Physics Engine", level: 75, category: "games" });

    // Mobile Development Tools
    await addData("tools", { name: "React Native", level: 90, category: "mobile" });
    await addData("tools", { name: "Flutter", level: 85, category: "mobile" });
    await addData("tools", { name: "Expo", level: 80, category: "mobile" });
    await addData("tools", { name: "Swift", level: 80, category: "mobile" });
    await addData("tools", { name: "Kotlin", level: 75, category: "mobile" });
    await addData("tools", { name: "Firebase", level: 90, category: "mobile" });
    await addData("tools", { name: "Mobile UI/UX", level: 85, category: "mobile" });
    await addData("tools", { name: "App Store Optimization", level: 70, category: "mobile" });
    await addData("tools", { name: "Push Notifications", level: 80, category: "mobile" });

    // 2. EXPERIENCES DATA
    console.log("\n💼 Adding Experience Data...");
    
    await addData("experiences", {
      role: "Full Stack Developer",
      company: "Tech Innovation Labs",
      period: "2021 - Present",
      startYear: "2021",
      endYear: null,
      isPresent: true,
      description: "Leading development of modern web applications using React, Next.js, and cloud technologies.",
      details: "Architected and deployed multiple scalable web applications serving thousands of users. Implemented CI/CD pipelines, optimized database performance, and mentored junior developers. Specialized in TypeScript, React ecosystem, and cloud deployment strategies.",
      align: "left"
    });

    await addData("experiences", {
      role: "Game Developer",
      company: "Indie Game Studio",
      period: "2020 - 2021",
      startYear: "2020",
      endYear: "2021",
      isPresent: false,
      description: "Developed indie games using Unity and C#, focusing on gameplay mechanics and user experience.",
      details: "Created 3 indie games from concept to release, handling everything from game design to deployment. Implemented custom physics systems, AI behaviors, and multiplayer features. Games accumulated over 50k downloads across mobile and PC platforms.",
      align: "right"
    });

    await addData("experiences", {
      role: "Mobile App Developer",
      company: "Digital Solutions Co",
      period: "2019 - 2020",
      startYear: "2019",
      endYear: "2020",
      isPresent: false,
      description: "Built cross-platform mobile applications using React Native and Flutter for various clients.",
      details: "Developed and launched 5+ mobile applications for iOS and Android, including e-commerce, social networking, and productivity apps. Integrated third-party APIs, implemented offline functionality, and optimized app performance for various device specifications.",
      align: "left"
    });

    // 3. WEBSITES DATA
    console.log("\n🌐 Adding Website Portfolio Data...");
    
    await addData("websites", {
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with real-time inventory and payment processing",
      image: "/images/projects/ecommerce.jpg",
      link: "https://example-ecommerce.com",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      category: "web",
      featured: true
    });

    await addData("websites", {
      title: "Social Media Dashboard",
      description: "Analytics dashboard for social media management and reporting",
      image: "/images/projects/dashboard.jpg",
      link: "https://example-dashboard.com",
      tags: ["Next.js", "TypeScript", "Chart.js", "Firebase"],
      category: "web",
      featured: true
    });

    await addData("websites", {
      title: "Portfolio Website",
      description: "Personal portfolio showcasing projects and skills with modern design",
      image: "/images/projects/portfolio.jpg",
      link: "https://example-portfolio.com",
      tags: ["React", "Tailwind CSS", "Framer Motion"],
      category: "web",
      featured: false
    });

    // 4. GAMES DATA
    console.log("\n🎮 Adding Games Portfolio Data...");
    
    await addData("games", {
      title: "Space Explorer",
      description: "3D space exploration game with procedurally generated galaxies",
      image: "/images/games/space-explorer.jpg",
      link: "https://example-game.com",
      tags: ["Unity", "C#", "Procedural Generation", "3D"],
      category: "games",
      featured: true
    });

    await addData("games", {
      title: "Puzzle Master",
      description: "Mind-bending puzzle game with physics-based mechanics",
      image: "/images/games/puzzle-master.jpg",
      link: "https://example-puzzle.com",
      tags: ["Unity", "C#", "Physics Engine", "Mobile"],
      category: "games",
      featured: true
    });

    await addData("games", {
      title: "Racing Championship",
      description: "Multiplayer racing game with realistic physics and customization",
      image: "/images/games/racing.jpg",
      link: "https://example-racing.com",
      tags: ["Unreal Engine", "C++", "Multiplayer", "3D"],
      category: "games",
      featured: false
    });

    // 5. SKILLS DATA
    console.log("\n🎯 Adding Skills Data...");
    
    await addData("skills", {
      name: "Web Development",
      level: 90,
      category: "technical",
      description: "Full-stack web development with modern frameworks"
    });

    await addData("skills", {
      name: "Game Development",
      level: 85,
      category: "technical",
      description: "Unity game development with C# and 3D programming"
    });

    await addData("skills", {
      name: "Mobile Development",
      level: 80,
      category: "technical",
      description: "Cross-platform mobile app development"
    });

    await addData("skills", {
      name: "UI/UX Design",
      level: 75,
      category: "design",
      description: "User interface and experience design"
    });

    // 6. TECHS DATA
    console.log("\n⚙️ Adding Technologies Data...");
    
    await addData("techs", {
      name: "React Ecosystem",
      level: 90,
      category: "frontend",
      description: "React, Next.js, and related technologies"
    });

    await addData("techs", {
      name: "Unity Engine",
      level: 85,
      category: "game",
      description: "Unity game engine and C# programming"
    });

    await addData("techs", {
      name: "Mobile Frameworks",
      level: 80,
      category: "mobile",
      description: "React Native, Flutter, and native development"
    });

    // 7. PHOTOS DATA
    console.log("\n📸 Adding Photography Data...");
    
    await addData("photos", {
      title: "Mountain Sunrise",
      description: "Beautiful sunrise over mountain peaks with golden light",
      image: "/images/photos/mountain-sunrise.jpg",
      category: "landscape",
      tags: ["nature", "landscape", "sunrise"],
      featured: true
    });

    await addData("photos", {
      title: "City Lights",
      description: "Urban night photography with vibrant city lights",
      image: "/images/photos/city-lights.jpg",
      category: "urban",
      tags: ["urban", "night", "city"],
      featured: true
    });

    await addData("photos", {
      title: "Wildlife Portrait",
      description: "Intimate portrait of wildlife in natural habitat",
      image: "/images/photos/wildlife.jpg",
      category: "wildlife",
      tags: ["wildlife", "nature", "animals"],
      featured: false
    });

    console.log("\n🎉 Database population completed successfully!");
    console.log("📊 Summary:");
    console.log("   - Tools: 25 items (Web, Games, Mobile)");
    console.log("   - Experiences: 3 items");
    console.log("   - Websites: 3 items");
    console.log("   - Games: 3 items");
    console.log("   - Skills: 4 items");
    console.log("   - Technologies: 3 items");
    console.log("   - Photos: 3 items");
    
  } catch (error) {
    console.error("❌ Error populating database:", error);
  }
}

// Run the population script
populateDatabase().then(() => {
  console.log("✨ Script execution completed");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Script failed:", error);
  process.exit(1);
});

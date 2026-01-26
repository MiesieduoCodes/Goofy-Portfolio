// Test Firebase connection from client-side
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";

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

async function testClientConnection() {
  console.log("🔍 Testing client-side Firebase connection...");
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log("✅ Firebase app initialized");
    
    // Test reading websites
    console.log("📊 Testing websites collection...");
    const websitesQuery = query(collection(db, "websites"));
    const websitesSnapshot = await getDocs(websitesQuery);
    console.log(`✅ Websites: ${websitesSnapshot.size} documents found`);
    
    if (websitesSnapshot.size > 0) {
      websitesSnapshot.docs.forEach((doc) => {
        console.log(`   - ${doc.data().title}`);
      });
    }
    
    // Test reading games
    console.log("🎮 Testing games collection...");
    const gamesQuery = query(collection(db, "games"));
    const gamesSnapshot = await getDocs(gamesQuery);
    console.log(`✅ Games: ${gamesSnapshot.size} documents found`);
    
    if (gamesSnapshot.size > 0) {
      gamesSnapshot.docs.forEach((doc) => {
        console.log(`   - ${doc.data().title}`);
      });
    }
    
    // Test reading experiences
    console.log("💼 Testing experiences collection...");
    const experiencesQuery = query(collection(db, "experiences"));
    const experiencesSnapshot = await getDocs(experiencesQuery);
    console.log(`✅ Experiences: ${experiencesSnapshot.size} documents found`);
    
    if (experiencesSnapshot.size > 0) {
      experiencesSnapshot.docs.forEach((doc) => {
        console.log(`   - ${doc.data().role} at ${doc.data().company}`);
      });
    }
    
    console.log("🎉 Client-side Firebase connection successful!");
    return true;
    
  } catch (error) {
    console.error("❌ Client-side Firebase connection failed:", error);
    console.log("\n📋 Possible issues:");
    console.log("   1. Firebase rules might be blocking client access");
    console.log("   2. Network connectivity issues");
    console.log("   3. Firebase configuration issues");
    console.log("   4. Browser security policies");
    return false;
  }
}

testClientConnection()
  .then((success) => {
    console.log("✨ Test completed");
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("💥 Test failed:", error);
    process.exit(1);
  });

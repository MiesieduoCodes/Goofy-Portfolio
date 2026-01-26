// Debug script to check Firestore data
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

async function debugFirestore() {
  console.log("🔍 Debugging Firestore data...");
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Check all collections
    const collections = ["tools", "experiences", "websites", "games", "skills", "techs", "photos"];
    
    for (const collectionName of collections) {
      console.log(`\n📁 Checking collection: ${collectionName}`);
      
      try {
        const q = query(collection(db, collectionName));
        const querySnapshot = await getDocs(q);
        
        console.log(`   Documents found: ${querySnapshot.size}`);
        
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            console.log(`   - ${doc.id}:`, doc.data());
          });
        } else {
          console.log("   ⚠️  No documents found in this collection");
        }
      } catch (error) {
        console.error(`   ❌ Error accessing ${collectionName}:`, error);
      }
    }
    
    console.log("\n✅ Debug completed");
    
  } catch (error) {
    console.error("❌ Debug failed:", error);
  }
}

debugFirestore().then(() => {
  console.log("🎯 Debug script finished");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Debug script failed:", error);
  process.exit(1);
});

// Firebase connection test script
// Run with: npm run test:firebase

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04",
  databaseURL: "https://miesieduocodes-default-rtdb.firebaseio.com/"
};

async function testFirebaseConnection() {
  console.log("🔍 Testing Firebase connection...");
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    
    console.log("✅ Firebase app initialized successfully");
    
    // Test database connection
    console.log("📡 Testing database connection...");
    const connectedRef = ref(database, '.info/connected');
    const connectedSnapshot = await get(connectedRef);
    const isConnected = connectedSnapshot.val();
    
    if (isConnected) {
      console.log("✅ Database connected successfully");
      
      // Test write operation
      console.log("✍️ Testing write operation...");
      const testRef = ref(database, 'test/connection-test');
      await set(testRef, {
        message: "Connection test successful",
        timestamp: Date.now()
      });
      console.log("✅ Write operation successful");
      
      // Test read operation
      console.log("📖 Testing read operation...");
      const testSnapshot = await get(testRef);
      const testData = testSnapshot.val();
      
      if (testData && testData.message === "Connection test successful") {
        console.log("✅ Read operation successful");
        console.log("🎉 Firebase is properly configured and ready to use!");
        
        // Clean up test data
        await set(testRef, null);
        console.log("🧹 Test data cleaned up");
        
        return true;
      } else {
        console.log("❌ Read operation failed - data mismatch");
        return false;
      }
    } else {
      console.log("❌ Database not connected");
      return false;
    }
    
  } catch (error) {
    console.error("❌ Firebase connection test failed:", error);
    console.log("\n📋 Troubleshooting steps:");
    console.log("1. Ensure Realtime Database is enabled in Firebase Console");
    console.log("2. Check database rules allow read/write access");
    console.log("3. Verify network connectivity");
    console.log("4. Check Firebase project configuration");
    console.log("\n🔗 Firebase Console: https://console.firebase.google.com/project/miesieduocodes/database");
    return false;
  }
}

// Run the test
testFirebaseConnection()
  .then((success) => {
    if (success) {
      console.log("\n✨ You can now run: npm run populate:firebase");
    } else {
      console.log("\n❌ Please fix the Firebase configuration before populating data");
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("💥 Test script failed:", error);
    process.exit(1);
  });

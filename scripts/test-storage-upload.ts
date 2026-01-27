import { initializeApp } from "firebase/app"
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0OsK84UeHrgJ4ISxtUmj9o38msLKvcuc",
  authDomain: "miesieduocodes.firebaseapp.com",
  projectId: "miesieduocodes",
  storageBucket: "miesieduocodes.firebasestorage.app",
  messagingSenderId: "597948621417",
  appId: "1:597948621417:web:f5f184a107081b867ab8f8",
  measurementId: "G-03B9NEFH04"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

// Test function to upload a small test file
async function testStorageUpload() {
  console.log("🧪 Testing Firebase Storage upload...")
  
  try {
    // Create a small test file (1x1 pixel PNG as base64)
    const testImageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    
    // Convert base64 to blob
    const response = await fetch(testImageData)
    const blob = await response.blob()
    const file = new File([blob], "test.png", { type: "image/png" })
    
    console.log("📁 Test file created:", file.name, file.size, "bytes")
    
    // Upload to Firebase Storage
    const storageRef_instance = storageRef(storage, `test/${Date.now()}-test.png`)
    console.log("📤 Uploading to:", storageRef_instance.fullPath)
    
    const snapshot = await uploadBytes(storageRef_instance, file)
    console.log("✅ Upload successful:", snapshot)
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef_instance)
    console.log("🔗 Download URL:", downloadURL)
    
    console.log("🎉 Firebase Storage upload test PASSED!")
    
  } catch (error) {
    console.error("❌ Firebase Storage upload test FAILED:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    console.error("Error details:", error.details)
  }
}

// Run the test
testStorageUpload()

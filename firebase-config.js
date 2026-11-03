// ==========================================================================
// Firebase Configuration for Alisha Plastics
// ==========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDlGx9z4EzY7ULJ9_sASHI8tWa2fa3YdA8",
  authDomain: "alisha-plastics-web.firebaseapp.com",
  projectId: "alisha-plastics-web",
  storageBucket: "alisha-plastics-web.firebasestorage.app",
  messagingSenderId: "1045821936127",
  appId: "1:1045821936127:web:dff16de99ae2ed7e1557ca",
  measurementId: "G-K681FXJ1RN"
};

// Owner admin email - only this email has write & delete access in backend security rules
const ADMIN_EMAIL = "manoj.parmar038@gmail.com";

// Check if Firebase is properly configured
function isFirebaseConfigured() {
  return (
    typeof firebase !== "undefined" &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.startsWith("YOUR_")
  );
}

// Initialize Firebase if CDN script loaded and config is present
let auth = null;
let db = null;
let storage = null;

if (typeof firebase !== "undefined") {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
  } catch (err) {
    console.warn("Firebase initialization error:", err.message);
  }
}

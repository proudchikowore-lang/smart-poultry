// Import Firebase as ES modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBH2oZd6zenoL9UCX5tmjqwFHxKA_myUhE",
  authDomain: "poutry-6dd09.firebaseapp.com",
  projectId: "poutry-6dd09",
  storageBucket: "poutry-6dd09.firebasestorage.app",
  messagingSenderId: "545675418902",
  appId: "1:545675418902:web:26f4a527c07271a055c437",
  measurementId: "G-17K96LSJYC"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Must match the roles allowed in auth.js
const ALLOWED_ROLES = ["owner", "admin", "manager", "user"];

// Helper to extract name from email (fallback if Firestore has no `name` field)
function nameFromEmail(email) {
  if (!email) return 'User';
  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// ── Page guard — runs on every protected page load ───────────────────────────
onAuthStateChanged(auth, async (user) => {

  // 1. Not signed in at all → back to login
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  try {
    // 2. Re-verify against Firestore admins collection on every page load.
    //    This catches cases where a user was removed or their role was changed
    //    while they already had an active session.
    const adminRef = doc(db, "admins", user.uid);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      // Authenticated but removed from admins → kick out
      await signOut(auth);
      localStorage.removeItem("navUserCache");
      window.location.replace("index.html");
      return;
    }

    // 3. Validate role
    const { role, name: storedName } = adminDoc.data();

    if (!role || !ALLOWED_ROLES.includes(role)) {
      await signOut(auth);
      localStorage.removeItem("navUserCache");
      window.location.replace("index.html");
      return;
    }

    // 4. Keep navUserCache fresh (handles tab restores, cache clears, etc.)
    const cached = JSON.parse(localStorage.getItem('navUserCache') || '{}');
    if (cached.uid !== user.uid || cached.role !== role) {
      localStorage.setItem('navUserCache', JSON.stringify({
        uid:      user.uid,
        email:    user.email    || '',
        name:     storedName    || nameFromEmail(user.email),
        photoURL: user.photoURL || '',
        role:     role
      }));
    }

  } catch (err) {
    // Firestore error (network, permissions) → fail-safe: sign out
    console.error("auth-check: Firestore verification failed:", err);
    await signOut(auth);
    localStorage.removeItem("navUserCache");
    window.location.replace("index.html");
  }
});

// ── Logout button (present on every protected page) ──────────────────────────
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    localStorage.removeItem("navUserCache");
    window.location.replace("index.html");
  });
}
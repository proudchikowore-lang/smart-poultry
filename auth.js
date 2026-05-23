// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey:            "AIzaSyBH2oZd6zenoL9UCX5tmjqwFHxKA_myUhE",
  authDomain:        "poutry-6dd09.firebaseapp.com",
  projectId:         "poutry-6dd09",
  storageBucket:     "poutry-6dd09.firebasestorage.app",
  messagingSenderId: "545675418902",
  appId:             "1:545675418902:web:26f4a527c07271a055c437",
  measurementId:     "G-17K96LSJYC"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Roles allowed through the main (user-facing) login
// Must exactly match the `role` field stored in Firestore admins/{uid}
const ALLOWED_ROLES = ["owner", "admin", "manager", "user"];

// Extract display name from email
// e.g. "john.doe@farm.com" → "John Doe"
function nameFromEmail(email) {
  if (!email) return 'User';
  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Friendly error messages
function friendlyError(code) {
  const map = {
    'auth/user-not-found':         'No account found with that email.',
    'auth/wrong-password':         'Incorrect password. Please try again.',
    'auth/invalid-email':          'Please enter a valid email address.',
    'auth/invalid-credential':     'Incorrect email or password.',
    'auth/too-many-requests':      'Too many failed attempts. Try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/user-disabled':          'This account has been disabled.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// Login
window.login = async function () {
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn      = document.getElementById("loginBtn");
  const msg      = document.getElementById("errorMsg");

  if (!email || !password) {
    msg.innerText = "Please enter your email and password.";
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = "Signing in…"; }
  msg.innerText  = "";
  msg.className  = "";

  try {
    // ── Step 1: Authenticate with Firebase Auth ──────────────────────────
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // ── Step 2: Verify user exists in Firestore admins collection ────────
    const adminRef = doc(db, "admins", user.uid);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      // Valid Firebase account but NOT in the admins collection → reject
      await signOut(auth);
      if (btn) { btn.disabled = false; btn.textContent = "Login"; }
      msg.innerText = "Access denied. Your account is not registered in this system.";
      return;
    }

    // ── Step 3: Validate role + suspended flag ──────────────────────────
    const { role, name: storedName, suspended } = adminDoc.data();

    if (!role) {
      await signOut(auth);
      if (btn) { btn.disabled = false; btn.textContent = "Login"; }
      msg.innerText = "Access denied. No role assigned to your account.";
      return;
    }

    // Deny access if account is suspended in Firestore
    if (suspended === true) {
      await signOut(auth);
      if (btn) { btn.disabled = false; btn.textContent = "Login"; }
      msg.innerText = "Access denied. Your account is suspended.";
      return;
    }

    if (!ALLOWED_ROLES.includes(role)) {
      await signOut(auth);
      if (btn) { btn.disabled = false; btn.textContent = "Login"; }
      msg.innerText = `Access denied. Role "${role}" is not permitted here.`;
      return;
    }


    // ── Step 4: Cache session for nav / profile display ──────────────────
    localStorage.setItem('navUserCache', JSON.stringify({
      uid:      user.uid,
      email:    user.email    || '',
      name:     storedName    || nameFromEmail(user.email),
      photoURL: user.photoURL || '',
      role:     role
    }));

    // ── Step 5: Success ──────────────────────────────────────────────────
    msg.className = "success";
    msg.innerText = "✅ Login successful — redirecting…";

    setTimeout(() => { window.location.href = "Smart Poultry Management.html"; }, 800);

  } catch (error) {
    if (btn) { btn.disabled = false; btn.textContent = "Login"; }
    msg.innerText = friendlyError(error.code);
  }
};
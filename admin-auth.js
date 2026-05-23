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

// Friendly error messages
function friendlyError(code) {
  const map = {
    'auth/user-not-found':     'No admin account found.',
    'auth/wrong-password':     'Incorrect password.',
    'auth/invalid-email':      'Invalid email address.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/too-many-requests':  'Too many failed attempts. Try later.',
    'auth/network-request-failed': 'Network error. Check connection.',
    'auth/user-disabled':      'This admin account has been disabled.',
  };
  return map[code] || 'Login failed. Please try again.';
}

// Extract display name
function nameFromEmail(email) {
  return email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Admin Login
window.adminLogin = async function () {

  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const btn      = document.getElementById("loginBtn");
  const msg      = document.getElementById("errorMsg");

  if (!email || !password) {
    msg.innerText = "Please enter your email and password.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Verifying...";
  msg.innerText = "";

  try {

    // Step 1: Authenticate user
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;

    // Step 2: Check Firestore admins collection
    const adminRef = doc(db, "admins", user.uid);
    const adminDoc = await getDoc(adminRef);

    if (!adminDoc.exists()) {
      await signOut(auth);
      btn.disabled = false;
      btn.textContent = "Sign In as Administrator";
      msg.innerText = "Access denied. Not registered as administrator.";
      return;
    }

    // Step 3: Read role
    const adminData = adminDoc.data();
    const role = adminData.role;

    // Optional: restrict allowed roles (only if role is present)
    // Firestore role values must match exactly what you store in admins/{uid}
    const allowedRoles = ["admin",];

    if (!role) {
      await signOut(auth);
      msg.innerText = "Access denied. Missing admin role in Firestore.";
      btn.disabled = false;
      btn.textContent = "Sign In as Administrator";
      return;
    }

    if (!allowedRoles.includes(role)) {
      await signOut(auth);
      msg.innerText = "Access denied. Invalid role.";
      btn.disabled = false;
      btn.textContent = "Sign In as Administrator";
      return;
    }

    // Step 4: Store admin session
    localStorage.setItem("adminSession", JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: nameFromEmail(user.email),
      role: role
    }));

    msg.style.color = "#00c864";
    msg.innerText = `✅ ${role.toUpperCase()} verified — redirecting...`;

    setTimeout(() => {
      window.location.href = "usermanager.html";
    }, 800);

  } catch (error) {
    btn.disabled = false;
    btn.textContent = "Sign In as Administrator";
    msg.innerText = friendlyError(error.code);
  }
};
// Reset Password (Firebase Email Link)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function friendlyError(code) {
  const map = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-not-found": "If the email exists, you will receive a reset link shortly.",
    "auth/missing-email": "Email is required.",
    "auth/too-many-requests": "Too many attempts. Try again later.",
  };
  return map[code] || "Could not send reset link. Please try again.";
}

window.sendReset = async function () {
  const emailInput = document.getElementById("resetEmail");
  const btn = document.getElementById("sendResetBtn");
  const msg = document.getElementById("errorMsg");

  const email = (emailInput?.value || "").trim();

  if (!email) {
    if (msg) msg.innerText = "Please enter your email.";
    if (msg) msg.className = "";
    emailInput?.focus?.();
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.textContent = "Sending…";
  }
  if (msg) {
    msg.innerText = "";
    msg.className = "";
  }

  try {
    // Firebase does not reveal whether the user exists for reset emails.
    await sendPasswordResetEmail(auth, email);

    if (msg) {
      msg.className = "success";
      msg.innerText = "✅ Reset link sent. Check your email (and spam/junk folder).";
    }
  } catch (error) {
    if (msg) {
      msg.className = "";
      msg.innerText = friendlyError(error?.code);
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Send reset link";
    }
  }
};


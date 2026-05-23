// usermanager-backend.js
// Pure client-side backend — all data lives in the Firestore "admins" collection.
//
// Firestore document shape  →  admins/{uid}
// {
//   email:       string,
//   role:        "owner" | "admin" | "farm manager" | "user",
//   suspended:   boolean,
//   displayName: string,
//   createdAt:   Timestamp,
// }
//
// Rules enforced here (UI also enforces these):
//   • "owner" documents are never returned to the table, never mutated, never deleted.
//   • The logged-in admin cannot delete or suspend themselves.

import { initializeApp }                        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
         sendPasswordResetEmail,
         signOut as authSignOut }               from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, doc,
         getDocs, getDoc, setDoc, updateDoc,
         deleteDoc, serverTimestamp,
         query, orderBy }                       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey:            "AIzaSyBH2oZd6zenoL9UCX5tmjqwFHxKA_myUhE",
  authDomain:        "poutry-6dd09.firebaseapp.com",
  projectId:         "poutry-6dd09",
  storageBucket:     "poutry-6dd09.firebasestorage.app",
  messagingSenderId: "545675418902",
  appId:             "1:545675418902:web:26f4a527c07271a055c437",
  measurementId:     "G-17K96LSJYC"
};

// Roles the UI is allowed to assign / manage (owner is always off-limits)
export const MANAGEABLE_ROLES = ["admin", "farm manager", "user"];

export function nameFromEmail(email) {
  if (!email) return "Unknown";
  return email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Secondary Firebase app ────────────────────────────────────────────────────
// createUserWithEmailAndPassword signs the caller IN as the new user, which
// would boot the current admin out. A named secondary app instance keeps the
// primary admin session completely untouched.
let _secondaryApp = null;
function getSecondaryApp() {
  if (!_secondaryApp) {
    _secondaryApp = initializeApp(firebaseConfig, "adminCreator");
  }
  return _secondaryApp;
}

export function initUserManagerBackend(app) {
  const auth = getAuth(app);
  const db   = getFirestore(app);

  return {

    // ── List all non-owner users from the "admins" collection ─────────────────
    // Returns: Array<{ uid, email, displayName, role, suspended, createdAt }>
    // Owner documents are filtered out — they are never shown or touched.
    async listUsers() {
      const q    = query(collection(db, "admins"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs
        .map(d => ({
          uid:         d.id,
          email:       d.data().email       ?? "",
          displayName: d.data().displayName ?? "",
          role:        d.data().role        ?? "user",
          suspended:   d.data().suspended   ?? false,
          createdAt:   d.data().createdAt?.toDate?.()?.toISOString() ?? null,
        }))
        .filter(u => u.role !== "owner");   // owners are never exposed
    },

    // ── Add user ──────────────────────────────────────────────────────────────
    // 1. Creates a Firebase Auth account via a secondary app (admin stays logged in).
    // 2. Writes the admins/{uid} Firestore document.
    // Role "owner" is rejected outright.
    async addUser({ email, password, role = "user", displayName = "" }) {
      if (!validEmail(email))               throw new Error("Invalid email address.");
      if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");
      if (role === "owner")                 throw new Error("Cannot create an owner account from this panel.");
      if (!MANAGEABLE_ROLES.includes(role)) throw new Error(`Invalid role "${role}".`);

      const secondaryAuth = getAuth(getSecondaryApp());
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid  = cred.user.uid;

      // Sign the secondary session out immediately
      await authSignOut(secondaryAuth);

      await setDoc(doc(db, "admins", uid), {
        email,
        role,
        displayName: displayName || nameFromEmail(email),
        suspended:   false,
        createdAt:   serverTimestamp(),
      });

      return { uid };
    },

    // ── Delete user ───────────────────────────────────────────────────────────
    // Removes the admins/{uid} document. Rejects if the target is an owner.
    // The Firebase Auth record is not deleted client-side; use a Cloud Function
    // onDelete trigger or the Firebase Console if Auth cleanup is also needed.
    async deleteUser(uid, currentUid) {
      if (!uid) throw new Error("UID is required.");
      if (uid === currentUid) throw new Error("You cannot delete your own account.");

      const snap = await getDoc(doc(db, "admins", uid));
      if (snap.exists() && snap.data().role === "owner") {
        throw new Error("Owner accounts cannot be deleted from this panel.");
      }

      await deleteDoc(doc(db, "admins", uid));
      return { uid };
    },

    // ── Suspend / unsuspend ───────────────────────────────────────────────────
    // Writes the "suspended" flag to admins/{uid}.
    // Your login flow should check this flag and deny access when true.
    // Rejects if the target is an owner or if the admin targets themselves.
    async setDisabled(uid, disabled, currentUid) {
      if (!uid) throw new Error("UID is required.");
      if (uid === currentUid) throw new Error("You cannot suspend your own account.");

      const snap = await getDoc(doc(db, "admins", uid));
      if (snap.exists() && snap.data().role === "owner") {
        throw new Error("Owner accounts cannot be suspended.");
      }

      await updateDoc(doc(db, "admins", uid), { suspended: !!disabled });
      return { uid, suspended: !!disabled };
    },

    // ── Reset password ────────────────────────────────────────────────────────
    // Sends a Firebase password-reset email. The client SDK cannot set another
    // user's password directly — a reset email is the safe client-side approach.
    async resetPassword(uid) {
      if (!uid) throw new Error("UID is required.");

      const snap = await getDoc(doc(db, "admins", uid));
      if (!snap.exists()) throw new Error("User not found in admins collection.");

      const email = snap.data().email;
      if (!email) throw new Error("No email on record for this user.");

      await sendPasswordResetEmail(auth, email);
      return { sent: true, email };
    },
  };
}
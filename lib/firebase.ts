import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import type { CalculatorInput, SpendTier } from "@/types";

const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

function getFirebaseConfig() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[SunScore] Missing Firebase config: ${missing.join(", ")}. Firebase services will be disabled.`);
    return null;
  }
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  };
}

const config = getFirebaseConfig();
const app = config ? (getApps().length === 0 ? initializeApp(config) : getApps()[0]) : null;

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

const googleProvider = new GoogleAuthProvider();

/**
 * Opens the Google sign-in popup. Throws so the caller (a button click
 * handler) can decide how to react — unlike saveLead, this is a
 * user-initiated action, not a fire-and-forget background write.
 */
export async function signInWithGoogle(): Promise<User> {
  if (!auth) {
    throw new Error("Firebase is not configured — cannot sign in.");
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Writes a lead document to Firestore. Non-blocking: caller does not need
 * to await this. Errors are caught and logged; they never propagate.
 */
export async function saveLead(input: CalculatorInput, spendTier: SpendTier): Promise<void> {
  if (!db) {
    console.warn("[SunScore] Firebase not initialized. Lead not saved.");
    return;
  }
  try {
    await addDoc(collection(db, "leads"), {
      dieselSpend: input.dieselSpend,
      runHours: input.runHours,
      householdSize: input.householdSize,
      consistencyMonths: input.consistencyMonths,
      dieselPricePerLitre: input.dieselPricePerLitre,
      spendTier,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("[SunScore] Firestore lead write failed:", error);
  }
}

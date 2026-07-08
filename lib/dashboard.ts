import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CalculatorInput, CalculatorOutput, SavedCalculation } from "@/types";

/**
 * Saves a calculation to the signed-in user's personal history
 * (`users/{uid}/calculations`). This is a distinct, user-initiated write
 * from the anonymous `leads` collection — it only happens when someone
 * explicitly chooses to save their dashboard.
 */
export async function saveCalculation(
  uid: string,
  inputs: CalculatorInput,
  output: CalculatorOutput,
  receiptUrl?: string | null
): Promise<void> {
  if (!db) {
    console.warn("[SunScore] Firebase not initialized. Calculation not saved.");
    return;
  }
  try {
    await addDoc(collection(db, "users", uid, "calculations"), {
      inputs,
      output,
      createdAt: serverTimestamp(),
      // Firestore rejects `undefined` fields — only include this key when set.
      ...(receiptUrl ? { receiptUrl } : {}),
    });
  } catch (error) {
    console.error("[SunScore] Failed to save calculation:", error);
  }
}

/** Reads a signed-in user's saved calculations, most recent first. */
export async function getUserCalculations(uid: string): Promise<SavedCalculation[]> {
  if (!db) {
    console.warn("[SunScore] Firebase not initialized. Cannot load dashboard.");
    return [];
  }
  try {
    const q = query(collection(db, "users", uid, "calculations"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : Date.now();
      return {
        id: doc.id,
        inputs: data.inputs as CalculatorInput,
        output: data.output as CalculatorOutput,
        createdAt,
        receiptUrl: data.receiptUrl as string | undefined,
      };
    });
  } catch (error) {
    console.error("[SunScore] Failed to load saved calculations:", error);
    return [];
  }
}

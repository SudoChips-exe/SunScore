"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useSunScore } from "@/context/SunScoreContext";
import { getUserCalculations } from "@/lib/dashboard";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Naira } from "@/components/Naira";
import type { SavedCalculation } from "@/types";

const TIER_LABEL: Record<string, string> = {
  starter: "Starter",
  standard: "Standard",
  power: "Power",
  business: "Business",
};

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const { setResult } = useSunScore();
  const [calculations, setCalculations] = useState<SavedCalculation[] | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserCalculations(user.uid).then(setCalculations);
  }, [user]);

  async function handleSignIn() {
    setSigningIn(true);
    try {
      await signIn();
    } catch (error) {
      console.error("[SunScore] Google sign-in failed:", error);
    } finally {
      setSigningIn(false);
    }
  }

  function viewBreakdown(calc: SavedCalculation) {
    setResult(calc.inputs, calc.output);
    router.push("/results");
  }

  if (loading) return null;

  if (!user) {
    return (
      <main className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <AmbientBackground />
        <div className="max-w-md rounded-3xl border border-brand-stone-200 bg-white p-8 shadow-sm">
          <h2 className="font-display text-3xl font-medium text-brand-stone-900">Your Dashboard</h2>
          <p className="mt-4 text-brand-stone-500 leading-relaxed">
            Sign in to see every calculation you&apos;ve saved and track your path off diesel over time.
          </p>
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="mt-8 inline-block rounded-full bg-brand-stone-900 px-8 py-3 font-semibold text-white transition hover:bg-brand-stone-800 disabled:opacity-60"
          >
            {signingIn ? "Signing in…" : "Sign in with Google"}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-[80vh] overflow-hidden px-6 py-12">
      <AmbientBackground />
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-medium text-brand-stone-900 md:text-5xl">
            Welcome back{user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-4 text-brand-stone-500">Every calculation you&apos;ve saved, in one place.</p>
        </div>

        {calculations === null && (
          <p className="text-center text-brand-stone-400">Loading your saved calculations…</p>
        )}

        {calculations !== null && calculations.length === 0 && (
          <div className="mx-auto max-w-md rounded-3xl border border-brand-stone-200 bg-white p-8 text-center shadow-sm">
            <p className="text-brand-stone-500">
              You haven&apos;t saved a calculation yet. Run the numbers and save your results to start
              tracking your savings over time.
            </p>
            <Link
              href="/calculate"
              className="mt-6 inline-block rounded-full bg-brand-gold-500 px-8 py-3 font-semibold text-brand-stone-900 transition hover:bg-brand-gold-600"
            >
              Run My First Calculation
            </Link>
          </div>
        )}

        {calculations !== null && calculations.length > 0 && (
          <div className="flex flex-col gap-6">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="flex flex-col gap-4 rounded-3xl border border-brand-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-stone-400">
                    {formatDate(calc.createdAt)} · {TIER_LABEL[calc.output.spendTier] ?? calc.output.spendTier}
                  </p>
                  <p className="mt-1 font-display text-2xl font-medium text-brand-green-600">
                    <Naira />
                    {calc.output.monthlySavings?.toLocaleString()}
                    <span className="text-sm font-normal text-brand-stone-500"> saved / month</span>
                  </p>
                  {calc.receiptUrl && (
                    <a
                      href={calc.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-stone-500 underline hover:text-brand-stone-900"
                    >
                      📎 View attached receipt
                    </a>
                  )}
                </div>
                <button
                  onClick={() => viewBreakdown(calc)}
                  className="w-full rounded-full bg-brand-stone-100 px-6 py-2.5 text-sm font-semibold text-brand-stone-900 transition hover:bg-brand-stone-200 sm:w-auto"
                >
                  View Full Breakdown
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

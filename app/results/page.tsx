"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSunScore } from "@/context/SunScoreContext";
import { useAuth } from "@/context/AuthContext";
import { saveCalculation } from "@/lib/dashboard";
import { uploadFile } from "@/lib/supabase";
import { ComparisonCard } from "@/components/ComparisonCard";
import { SunScoreGauge } from "@/components/SunScoreGauge";
import { AmbientBackground } from "@/components/AmbientBackground";

export default function ResultsPage() {
  const router = useRouter();
  const { inputs, output } = useSunScore();
  const { user, signIn } = useAuth();
  const [saving, setSaving] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const isValid = !!(inputs && output && output.estimatedMonthlyPayment !== undefined);

  useEffect(() => {
    if (!isValid) {
      router.replace("/calculate");
    }
  }, [isValid, router]);

  if (!isValid) return null;

  async function handleSaveDashboard() {
    setSaving(true);
    try {
      const currentUser = user ?? (await signIn());
      let receiptUrl: string | null = null;
      if (receiptFile) {
        const path = `receipts/${currentUser.uid}/${Date.now()}-${receiptFile.name}`;
        receiptUrl = await uploadFile(path, receiptFile);
      }
      await saveCalculation(currentUser.uid, inputs!, output!, receiptUrl);
      router.push("/dashboard");
    } catch (error) {
      console.error("[SunScore] Could not save to dashboard:", error);
    } finally {
      setSaving(false);
    }
  }

  if (output!.spendTier === "below_threshold") {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <AmbientBackground />
        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <SunScoreGauge sunScore={output!.sunScore} />
          <div className="w-full rounded-3xl border border-brand-stone-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-stone-100 text-2xl">
              ☀️
            </div>
            <h2 className="font-display text-3xl font-medium text-brand-stone-900">
              Almost there!
            </h2>
            <p className="mt-4 text-brand-stone-500 leading-relaxed">
              Your current fuel and diesel spend is slightly below the minimum threshold for
              our current solar PAYGo matches. But don&apos;t worry — as your energy needs grow,
              solar becomes an even better investment.
            </p>
            <Link
              href="/calculate"
              className="mt-8 inline-block rounded-full bg-brand-stone-900 px-8 py-3 font-semibold text-white transition hover:bg-brand-stone-800"
            >
              Try Different Numbers
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-12">
      <AmbientBackground tone="green" />
      <div className="mb-8 w-full px-6">
        <SunScoreGauge sunScore={output!.sunScore} />
      </div>
      <ComparisonCard inputs={inputs!} output={output!} />
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-6 pb-12">
        <button
          onClick={() => router.push("/offers")}
          className="group relative w-full max-w-md overflow-hidden rounded-full bg-brand-gold-500 px-8 py-4 font-semibold text-brand-stone-900 transition-all hover:bg-brand-gold-600 hover:shadow-lg active:scale-95"
        >
          <span className="relative z-10">Unlock My Matched Offers</span>
          <div className="absolute inset-0 -z-10 translate-y-full transition-transform group-hover:translate-y-0 bg-brand-gold-400" />
        </button>
        <label className="flex w-full max-w-md cursor-pointer items-center justify-center gap-2 text-sm text-brand-stone-500 transition hover:text-brand-stone-700">
          <span aria-hidden>📎</span>
          <span className="truncate">
            {receiptFile ? receiptFile.name : "Attach a fuel/diesel receipt (optional)"}
          </span>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button
          onClick={handleSaveDashboard}
          disabled={saving}
          className="w-full max-w-md rounded-full border border-brand-stone-300 bg-white px-8 py-3 text-sm font-semibold text-brand-stone-700 transition hover:border-brand-stone-400 disabled:opacity-60"
        >
          {saving
            ? receiptFile
              ? "Uploading receipt…"
              : "Saving…"
            : user
              ? "Save to My Dashboard"
              : "Sign In to Save My Dashboard"}
        </button>
      </div>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSunScore } from "@/context/SunScoreContext";
import { ComparisonCard } from "@/components/ComparisonCard";
import { AmbientBackground } from "@/components/AmbientBackground";

export default function ResultsPage() {
  const router = useRouter();
  const { inputs, output } = useSunScore();

  const isValid = !!(inputs && output && output.estimatedMonthlyPayment !== undefined);

  useEffect(() => {
    if (!isValid) {
      router.replace("/calculate");
    }
  }, [isValid, router]);

  if (!isValid) return null;

  if (output!.spendTier === "below_threshold") {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <AmbientBackground />
        <div className="max-w-md rounded-3xl border border-brand-stone-200 bg-white p-8 shadow-sm">
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
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-12">
      <AmbientBackground tone="green" />
      <ComparisonCard inputs={inputs!} output={output!} />
      <div className="mx-auto max-w-2xl px-6 pb-12 w-full flex justify-center">
        <button
          onClick={() => router.push("/offers")}
          className="group relative w-full max-w-md overflow-hidden rounded-full bg-brand-gold-500 px-8 py-4 font-semibold text-brand-stone-900 transition-all hover:bg-brand-gold-600 hover:shadow-lg active:scale-95"
        >
          <span className="relative z-10">Unlock My Matched Offers</span>
          <div className="absolute inset-0 -z-10 translate-y-full transition-transform group-hover:translate-y-0 bg-brand-gold-400" />
        </button>
      </div>
    </main>
  );
}

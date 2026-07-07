"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSunScore } from "@/context/SunScoreContext";
import { ComparisonCard } from "@/components/ComparisonCard";

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
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-12 text-center">
        <p className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-orange-700">
          Your current spend is below the minimum threshold for a solar PAYGo match.
        </p>
        <Link href="/calculate" className="underline">
          Back to Calculator
        </Link>
      </main>
    );
  }

  return (
    <main>
      <ComparisonCard inputs={inputs!} output={output!} />
      <div className="mx-auto max-w-md px-6 pb-12">
        <button
          onClick={() => router.push("/offers")}
          className="w-full rounded-2xl bg-amber-400 px-8 py-3 font-semibold text-neutral-900 shadow transition hover:bg-amber-500"
        >
          See My Matched Offers
        </button>
      </div>
    </main>
  );
}

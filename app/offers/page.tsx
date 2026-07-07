"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSunScore } from "@/context/SunScoreContext";
import { matchOffers } from "@/lib/offers";
import { OfferCard } from "@/components/OfferCard";
import { AmbientBackground } from "@/components/AmbientBackground";

export default function OffersPage() {
  const router = useRouter();
  const { output } = useSunScore();

  const isValid = !!(output && output.estimatedMonthlyPayment !== undefined);

  useEffect(() => {
    if (!isValid) {
      router.replace("/calculate");
    }
  }, [isValid, router]);

  if (!isValid) return null;

  const { offers, preQualified } = matchOffers(output!.spendTier, output!.isPreQualified);

  if (offers.length === 0) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <AmbientBackground />
        <div className="max-w-md rounded-3xl border border-brand-stone-200 bg-white p-8 shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-stone-100 text-2xl">
            🔌
          </div>
          <h2 className="font-display text-3xl font-medium text-brand-stone-900">
            No Matches — Yet
          </h2>
          <p className="mt-4 text-brand-stone-500 leading-relaxed">
            We couldn&apos;t find any solar plans that exactly match your current spending profile.
            Try adjusting your inputs to see other potential matches.
          </p>
          <Link
            href="/calculate"
            className="mt-8 inline-block rounded-full bg-brand-stone-900 px-8 py-3 font-semibold text-white transition hover:bg-brand-stone-800"
          >
            Adjust My Inputs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto min-h-screen max-w-3xl overflow-hidden px-6 py-12">
      <AmbientBackground />
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-medium text-brand-stone-900 md:text-5xl">
          Your Ticket Out of the Fuel &amp; Diesel Era
        </h1>
        <p className="mt-4 text-brand-stone-500">
          Based on your spending, these providers can get you switched over today.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {offers.map((offer, index) => (
          <OfferCard
            key={`${offer.provider}-${offer.tier}`}
            offer={offer}
            showBadge={preQualified && index === 0}
          />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link 
          href="/calculate" 
          className="text-sm font-medium text-brand-stone-500 underline hover:text-brand-stone-900"
        >
          ← Recalculate savings
        </Link>
      </div>
    </main>
  );
}

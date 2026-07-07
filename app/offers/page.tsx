"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSunScore } from "@/context/SunScoreContext";
import { matchOffers } from "@/lib/offers";
import { OfferCard } from "@/components/OfferCard";

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
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-12 text-center">
        <p>No matched offers currently available.</p>
        <Link href="/calculate" className="underline">
          Back to Calculator
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-6 py-12">
      {offers.map((offer, index) => (
        <OfferCard
          key={`${offer.provider}-${offer.tier}`}
          offer={offer}
          showBadge={preQualified && index === 0}
        />
      ))}
    </main>
  );
}

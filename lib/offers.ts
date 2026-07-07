import type { Offer, SpendTier } from "@/types";

// At least 2 entries per provider across the defined spend tiers.
export const MOCK_OFFERS: Offer[] = [
  // Lumos
  { provider: "Lumos", tier: "starter", monthlyPayment: 18_500, ownershipMonths: 24, regions: ["Lagos", "Ogun", "Oyo"] },
  { provider: "Lumos", tier: "standard", monthlyPayment: 33_000, ownershipMonths: 30, regions: ["Lagos", "Abuja", "Rivers"] },
  { provider: "Lumos", tier: "power", monthlyPayment: 60_000, ownershipMonths: 36, regions: ["Lagos", "Kano", "Abuja"] },
  { provider: "Lumos", tier: "business", monthlyPayment: 110_000, ownershipMonths: 36, regions: ["Lagos", "Abuja"] },

  // Arnergy
  { provider: "Arnergy", tier: "starter", monthlyPayment: 19_000, ownershipMonths: 22, regions: ["Lagos", "Delta", "Anambra"] },
  { provider: "Arnergy", tier: "standard", monthlyPayment: 34_500, ownershipMonths: 28, regions: ["Lagos", "Abuja", "Enugu"] },
  { provider: "Arnergy", tier: "power", monthlyPayment: 60_000, ownershipMonths: 32, regions: ["Lagos", "Abuja"] },
  { provider: "Arnergy", tier: "business", monthlyPayment: 112_000, ownershipMonths: 36, regions: ["Lagos", "Abuja", "Port Harcourt"] },

  // d.light
  { provider: "d.light", tier: "starter", monthlyPayment: 19_500, ownershipMonths: 22, regions: ["Nationwide"] },
  { provider: "d.light", tier: "standard", monthlyPayment: 32_000, ownershipMonths: 30, regions: ["Kano", "Lagos", "Abuja"] },
  { provider: "d.light", tier: "power", monthlyPayment: 61_000, ownershipMonths: 34, regions: ["Lagos", "Kano"] },
  { provider: "d.light", tier: "business", monthlyPayment: 108_000, ownershipMonths: 36, regions: ["Nationwide"] },
];

/**
 * Filters MOCK_OFFERS to those matching the given tier, then sorts
 * ascending by monthlyPayment; ties broken by ownershipMonths ascending.
 * preQualified is passed through only so callers know whether to badge
 * the first offer — it does not affect filtering or sorting.
 */
export function matchOffers(
  tier: SpendTier,
  preQualified: boolean
): { offers: Offer[]; preQualified: boolean } {
  const filtered = MOCK_OFFERS.filter((o) => o.tier === tier);
  const sorted = [...filtered].sort((a, b) => {
    if (a.monthlyPayment !== b.monthlyPayment) {
      return a.monthlyPayment - b.monthlyPayment;
    }
    return a.ownershipMonths - b.ownershipMonths;
  });
  return { offers: sorted, preQualified };
}

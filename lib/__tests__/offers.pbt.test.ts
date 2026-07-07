import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { matchOffers } from "@/lib/offers";
import type { SpendTier } from "@/types";

const TIERS: SpendTier[] = ["starter", "standard", "power", "business", "below_threshold"];

const tierArb = fc.constantFrom(...TIERS);

describe("offers property-based tests", () => {
  // Feature: sunscore, Property 10: Offer filtering preserves only exact tier matches
  it("P10 - every returned offer's tier exactly matches the requested tier", () => {
    fc.assert(
      fc.property(tierArb, fc.boolean(), (tier, preQualified) => {
        const { offers } = matchOffers(tier, preQualified);
        expect(offers.every((o) => o.tier === tier)).toBe(true);
      }),
      { numRuns: 200 }
    );
  });

  // Feature: sunscore, Property 11: Offer sorting invariant
  it("P11 - offers are sorted ascending by monthlyPayment, ties broken by ownershipMonths", () => {
    fc.assert(
      fc.property(tierArb, fc.boolean(), (tier, preQualified) => {
        const { offers } = matchOffers(tier, preQualified);
        for (let i = 0; i < offers.length - 1; i++) {
          expect(offers[i].monthlyPayment).toBeLessThanOrEqual(offers[i + 1].monthlyPayment);
          if (offers[i].monthlyPayment === offers[i + 1].monthlyPayment) {
            expect(offers[i].ownershipMonths).toBeLessThanOrEqual(offers[i + 1].ownershipMonths);
          }
        }
      }),
      { numRuns: 200 }
    );
  });

  it("preQualified is always passed through unchanged", () => {
    fc.assert(
      fc.property(tierArb, fc.boolean(), (tier, preQualified) => {
        const result = matchOffers(tier, preQualified);
        expect(result.preQualified).toBe(preQualified);
      }),
      { numRuns: 200 }
    );
  });
});

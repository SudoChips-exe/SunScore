import { describe, it, expect } from "vitest";
import { MOCK_OFFERS, matchOffers } from "@/lib/offers";

describe("MOCK_OFFERS integrity", () => {
  it("has at least 9 entries", () => {
    expect(MOCK_OFFERS.length).toBeGreaterThanOrEqual(9);
  });

  it("has at least 2 entries per provider", () => {
    const counts = MOCK_OFFERS.reduce<Record<string, number>>((acc, o) => {
      acc[o.provider] = (acc[o.provider] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts["Lumos"]).toBeGreaterThanOrEqual(2);
    expect(counts["Arnergy"]).toBeGreaterThanOrEqual(2);
    expect(counts["d.light"]).toBeGreaterThanOrEqual(2);
  });

  it("has valid constraint fields on every entry", () => {
    for (const offer of MOCK_OFFERS) {
      expect(offer.monthlyPayment).toBeGreaterThan(0);
      expect(Number.isInteger(offer.ownershipMonths)).toBe(true);
      expect(offer.ownershipMonths).toBeGreaterThanOrEqual(1);
      expect(offer.ownershipMonths).toBeLessThanOrEqual(120);
      expect(offer.regions.length).toBeGreaterThan(0);
    }
  });
});

describe("matchOffers", () => {
  it("filters by exact tier and sorts ascending by monthlyPayment then ownershipMonths", () => {
    const { offers, preQualified } = matchOffers("starter", false);
    expect(offers.every((o) => o.tier === "starter")).toBe(true);
    expect(preQualified).toBe(false);
    for (let i = 0; i < offers.length - 1; i++) {
      expect(offers[i].monthlyPayment).toBeLessThanOrEqual(offers[i + 1].monthlyPayment);
    }
  });

  it("passes through preQualified for business tier", () => {
    const { preQualified } = matchOffers("business", true);
    expect(preQualified).toBe(true);
  });

  it("returns empty offers for below_threshold", () => {
    const { offers } = matchOffers("below_threshold", false);
    expect(offers).toEqual([]);
  });

  it("does not mutate MOCK_OFFERS", () => {
    const before = JSON.stringify(MOCK_OFFERS);
    matchOffers("power", true);
    expect(JSON.stringify(MOCK_OFFERS)).toBe(before);
  });

  it("breaks ties by ownershipMonths ascending", () => {
    const { offers } = matchOffers("power", false);
    const arnergy = offers.find((o) => o.provider === "Arnergy");
    const lumos = offers.find((o) => o.provider === "Lumos");
    expect(arnergy?.monthlyPayment).toBe(lumos?.monthlyPayment);
    const arnergyIndex = offers.indexOf(arnergy!);
    const lumosIndex = offers.indexOf(lumos!);
    if (arnergy!.ownershipMonths < lumos!.ownershipMonths) {
      expect(arnergyIndex).toBeLessThan(lumosIndex);
    } else {
      expect(lumosIndex).toBeLessThan(arnergyIndex);
    }
  });
});

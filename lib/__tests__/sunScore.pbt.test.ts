import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { computeSunScore } from "@/lib/sunScore";

const inputArb = fc.record({
  dieselSpend: fc.integer({ min: 1, max: 10_000_000 }),
  runHours: fc.float({ min: 0.5, max: 24, noNaN: true }),
  householdSize: fc.integer({ min: 1, max: 100 }),
  consistencyMonths: fc.integer({ min: 0, max: 120 }),
  dieselPricePerLitre: fc.integer({ min: 100, max: 10_000 }),
});

const monthlySavingsArb = fc.option(fc.integer({ min: -1_000_000, max: 1_000_000 }), { nil: null });

describe("computeSunScore property-based tests", () => {
  // Feature: sunScoreComposite, Property 1: Score is always within [0, 100]
  it("P1 - score is always within the 0-100 range", () => {
    fc.assert(
      fc.property(inputArb, monthlySavingsArb, (input, monthlySavings) => {
        const result = computeSunScore(input, monthlySavings);
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(100);
      }),
      { numRuns: 500 }
    );
  });

  // Feature: sunScoreComposite, Property 2: No factor's points ever exceed its stated maximum
  it("P2 - no factor's points fall outside [0, maxPoints]", () => {
    fc.assert(
      fc.property(inputArb, monthlySavingsArb, (input, monthlySavings) => {
        const result = computeSunScore(input, monthlySavings);
        for (const factor of result.factors) {
          expect(factor.points).toBeGreaterThanOrEqual(0);
          expect(factor.points).toBeLessThanOrEqual(factor.maxPoints);
        }
      }),
      { numRuns: 500 }
    );
  });

  // Feature: sunScoreComposite, Property 3: More sustained consistency months never lowers the score
  it("P3 - increasing consistencyMonths never decreases the score, all else equal", () => {
    fc.assert(
      fc.property(inputArb, fc.integer({ min: 0, max: 60 }), (input, extraMonths) => {
        const base = computeSunScore(input, null);
        const more = computeSunScore(
          { ...input, consistencyMonths: input.consistencyMonths + extraMonths },
          null
        );
        expect(more.score).toBeGreaterThanOrEqual(base.score);
      }),
      { numRuns: 300 }
    );
  });

  // Feature: sunScoreComposite, Property 4: The band label always matches the documented score thresholds
  it("P4 - band matches the score's documented threshold", () => {
    fc.assert(
      fc.property(inputArb, monthlySavingsArb, (input, monthlySavings) => {
        const result = computeSunScore(input, monthlySavings);
        if (result.score >= 90) expect(result.band).toBe("excellent");
        else if (result.score >= 75) expect(result.band).toBe("strong");
        else if (result.score >= 60) expect(result.band).toBe("qualified");
        else if (result.score >= 40) expect(result.band).toBe("emerging");
        else expect(result.band).toBe("not_yet_ready");
      }),
      { numRuns: 500 }
    );
  });
});

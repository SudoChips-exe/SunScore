import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { classifyTier, isPreQualified, calculate } from "@/lib/calculator";

const VALID_TIERS = ["below_threshold", "starter", "standard", "power", "business"];

describe("calculator property-based tests", () => {
  // Feature: sunscore, Property 1: Tier classification is total and exhaustive
  it("P1 - classifyTier always returns one of the five valid tiers", () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true, noDefaultInfinity: true }), (spend) => {
        expect(VALID_TIERS).toContain(classifyTier(spend));
      }),
      { numRuns: 500 }
    );
  });

  // Feature: sunscore, Property 2: Tier boundaries are mutually exclusive and cover all non-negative spend
  it("P2 - tier boundaries partition the input space with no overlap", () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 10_000_000 }), (spend) => {
        const rounded = Math.round(spend);
        const tier = classifyTier(spend);
        if (rounded < 20_000) expect(tier).toBe("below_threshold");
        else if (rounded <= 39_999) expect(tier).toBe("starter");
        else if (rounded <= 79_999) expect(tier).toBe("standard");
        else if (rounded <= 149_999) expect(tier).toBe("power");
        else expect(tier).toBe("business");
      }),
      { numRuns: 500 }
    );
  });

  const validInputArb = fc.record({
    dieselSpend: fc.integer({ min: 20_000, max: 10_000_000 }),
    runHours: fc.float({ min: 0.5, max: 24, noNaN: true }),
    householdSize: fc.integer({ min: 1, max: 100 }),
    consistencyMonths: fc.integer({ min: 1, max: 120 }),
    dieselPricePerLitre: fc.integer({ min: 100, max: 10_000 }),
  });

  // Feature: sunscore, Property 3: Below-threshold inputs produce all-null solar estimates
  it("P3 - below-threshold spend yields all-null solar output fields", () => {
    fc.assert(
      fc.property(fc.integer({ max: 19_999 }), (dieselSpend) => {
        const output = calculate({
          dieselSpend,
          runHours: 8,
          householdSize: 4,
          consistencyMonths: 6,
          dieselPricePerLitre: 1_600,
        });
        expect(output.spendTier).toBe("below_threshold");
        expect(output.estimatedMonthlyPayment).toBeNull();
        expect(output.ownershipMonthsMin).toBeNull();
        expect(output.ownershipMonthsMax).toBeNull();
        expect(output.monthlySavings).toBeNull();
        expect(output.threeYearSavings).toBeNull();
      }),
      { numRuns: 200 }
    );
  });

  const TIER_TABLE = {
    starter: { monthlyPayment: 20_000, min: 18, max: 24, spendMin: 20_000, spendMax: 39_999 },
    standard: { monthlyPayment: 35_000, min: 24, max: 30, spendMin: 40_000, spendMax: 79_999 },
    power: { monthlyPayment: 62_500, min: 30, max: 36, spendMin: 80_000, spendMax: 149_999 },
    business: { monthlyPayment: 115_000, min: 36, max: 36, spendMin: 150_000, spendMax: 10_000_000 },
  } as const;

  // Feature: sunscore, Property 4: Tier payment and ownership values are fixed constants per tier
  it("P4 - tier constants are fixed regardless of exact spend within the tier", () => {
    for (const tier of Object.keys(TIER_TABLE) as Array<keyof typeof TIER_TABLE>) {
      const { monthlyPayment, min, max, spendMin, spendMax } = TIER_TABLE[tier];
      fc.assert(
        fc.property(fc.integer({ min: spendMin, max: spendMax }), (dieselSpend) => {
          const output = calculate({
            dieselSpend,
            runHours: 8,
            householdSize: 4,
            consistencyMonths: 6,
            dieselPricePerLitre: 1_600,
          });
          expect(output.estimatedMonthlyPayment).toBe(monthlyPayment);
          expect(output.ownershipMonthsMin).toBe(min);
          expect(output.ownershipMonthsMax).toBe(max);
        }),
        { numRuns: 200 }
      );
    }
  });

  // Feature: sunscore, Property 5: Monthly savings arithmetic invariant
  it("P5 - monthlySavings equals dieselSpend minus estimatedMonthlyPayment", () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const output = calculate(input);
        if (output.monthlySavings !== null && output.estimatedMonthlyPayment !== null) {
          expect(output.monthlySavings).toBe(input.dieselSpend - output.estimatedMonthlyPayment);
        }
      }),
      { numRuns: 200 }
    );
  });

  // Feature: sunscore, Property 6: 3-Year savings formula invariant
  it("P6 - threeYearSavings matches the documented formula", () => {
    fc.assert(
      fc.property(validInputArb, (input) => {
        const output = calculate(input);
        if (
          output.threeYearSavings !== null &&
          output.estimatedMonthlyPayment !== null &&
          output.ownershipMonthsMin !== null &&
          output.ownershipMonthsMax !== null
        ) {
          const midpoint = (output.ownershipMonthsMin + output.ownershipMonthsMax) / 2;
          expect(output.threeYearSavings).toBe(
            input.dieselSpend * 36 - output.estimatedMonthlyPayment * midpoint
          );
        }
      }),
      { numRuns: 200 }
    );
  });

  // Feature: sunscore, Property 7: Payment is strictly less than tier upper bound
  it("P7 - estimatedMonthlyPayment is strictly less than the tier's spend upper bound", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 20_000, max: 149_999 }),
        (dieselSpend) => {
          const output = calculate({
            dieselSpend,
            runHours: 8,
            householdSize: 4,
            consistencyMonths: 6,
            dieselPricePerLitre: 1_600,
          });
          const upperBounds = { starter: 40_000, standard: 80_000, power: 150_000 } as const;
          const bound = upperBounds[output.spendTier as keyof typeof upperBounds];
          if (bound !== undefined) {
            expect(output.estimatedMonthlyPayment as number).toBeLessThan(bound);
          }
        }
      ),
      { numRuns: 200 }
    );
  });

  // Feature: sunscore, Property 8: Pre-qualification requires both conditions simultaneously
  it("P8 - isPreQualified is true iff spend >= 20000 AND consistencyMonths >= 3", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1_000_000, max: 10_000_000 }),
        fc.integer({ min: -1_000, max: 1_000 }),
        (spend, months) => {
          const expected = spend >= 20_000 && months >= 3;
          expect(isPreQualified(spend, months)).toBe(expected);
        }
      ),
      { numRuns: 500 }
    );
  });
});

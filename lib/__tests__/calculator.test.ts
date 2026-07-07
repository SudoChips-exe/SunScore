import { describe, it, expect } from "vitest";
import { classifyTier, isPreQualified, calculate } from "@/lib/calculator";

describe("classifyTier", () => {
  it("classifies tier boundaries correctly", () => {
    expect(classifyTier(19_999)).toBe("below_threshold");
    expect(classifyTier(20_000)).toBe("starter");
    expect(classifyTier(39_999)).toBe("starter");
    expect(classifyTier(40_000)).toBe("standard");
    expect(classifyTier(79_999)).toBe("standard");
    expect(classifyTier(80_000)).toBe("power");
    expect(classifyTier(149_999)).toBe("power");
    expect(classifyTier(150_000)).toBe("business");
  });

  it("rounds before classifying at a boundary", () => {
    expect(classifyTier(39_999.5)).toBe("standard");
  });

  it("treats zero and negative spend as below_threshold", () => {
    expect(classifyTier(0)).toBe("below_threshold");
    expect(classifyTier(-500)).toBe("below_threshold");
  });
});

describe("isPreQualified", () => {
  it("requires both spend and consistency thresholds", () => {
    expect(isPreQualified(20_000, 3)).toBe(true);
    expect(isPreQualified(19_999, 3)).toBe(false);
    expect(isPreQualified(20_000, 2)).toBe(false);
  });

  it("rejects non-numeric input", () => {
    expect(isPreQualified(null, 3)).toBe(false);
    expect(isPreQualified(20_000, undefined)).toBe(false);
    expect(isPreQualified("20000", 3)).toBe(false);
    expect(isPreQualified(Infinity, 3)).toBe(false);
  });
});

describe("calculate", () => {
  it("returns tier constants and derived savings for a starter input", () => {
    const output = calculate({
      dieselSpend: 25_000,
      runHours: 8,
      householdSize: 4,
      consistencyMonths: 6,
      dieselPricePerLitre: 1_600,
    });
    expect(output.spendTier).toBe("starter");
    expect(output.estimatedMonthlyPayment).toBe(20_000);
    expect(output.ownershipMonthsMin).toBe(18);
    expect(output.ownershipMonthsMax).toBe(24);
    expect(output.monthlySavings).toBe(5_000);
    expect(output.threeYearSavings).toBe(25_000 * 36 - 20_000 * 21);
    expect(output.isPreQualified).toBe(true);
  });

  it("returns business tier constants", () => {
    const output = calculate({
      dieselSpend: 200_000,
      runHours: 12,
      householdSize: 10,
      consistencyMonths: 12,
      dieselPricePerLitre: 1_600,
    });
    expect(output.spendTier).toBe("business");
    expect(output.estimatedMonthlyPayment).toBe(115_000);
    expect(output.ownershipMonthsMin).toBe(36);
    expect(output.ownershipMonthsMax).toBe(36);
  });

  it("returns all-null solar fields for below_threshold spend", () => {
    const output = calculate({
      dieselSpend: 5_000,
      runHours: 2,
      householdSize: 2,
      consistencyMonths: 1,
      dieselPricePerLitre: 1_600,
    });
    expect(output.spendTier).toBe("below_threshold");
    expect(output.estimatedMonthlyPayment).toBeNull();
    expect(output.ownershipMonthsMin).toBeNull();
    expect(output.ownershipMonthsMax).toBeNull();
    expect(output.monthlySavings).toBeNull();
    expect(output.threeYearSavings).toBeNull();
    expect(output.isPreQualified).toBe(false);
  });
});

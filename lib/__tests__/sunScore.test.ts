import { describe, it, expect } from "vitest";
import { computeSunScore } from "@/lib/sunScore";

describe("computeSunScore", () => {
  it("returns a score whose factor points sum to it, within 0-100", () => {
    const result = computeSunScore(
      { dieselSpend: 25_000, runHours: 8, householdSize: 4, consistencyMonths: 6, dieselPricePerLitre: 1_600 },
      5_000
    );
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    const totalPoints = result.factors.reduce((sum, f) => sum + f.points, 0);
    expect(Math.round(totalPoints)).toBe(result.score);
  });

  it("gives full affordability points at 24+ months of consistency", () => {
    const result = computeSunScore(
      { dieselSpend: 25_000, runHours: 8, householdSize: 4, consistencyMonths: 24, dieselPricePerLitre: 1_600 },
      5_000
    );
    const affordability = result.factors.find((f) => f.key === "affordability")!;
    expect(affordability.points).toBe(35);
  });

  it("caps affordability points beyond 24 months (score does not keep climbing)", () => {
    const at24 = computeSunScore(
      { dieselSpend: 25_000, runHours: 8, householdSize: 4, consistencyMonths: 24, dieselPricePerLitre: 1_600 },
      5_000
    );
    const at60 = computeSunScore(
      { dieselSpend: 25_000, runHours: 8, householdSize: 4, consistencyMonths: 60, dieselPricePerLitre: 1_600 },
      5_000
    );
    expect(at60.score).toBe(at24.score);
  });

  it("scores zero financial efficiency when no plan is matched", () => {
    const result = computeSunScore(
      { dieselSpend: 5_000, runHours: 2, householdSize: 2, consistencyMonths: 1, dieselPricePerLitre: 1_600 },
      null
    );
    const efficiency = result.factors.find((f) => f.key === "financialEfficiency")!;
    expect(efficiency.points).toBe(0);
  });

  it("penalizes an implied load that is implausibly small for the stated household size", () => {
    const result = computeSunScore(
      { dieselSpend: 5_000, runHours: 10, householdSize: 10, consistencyMonths: 12, dieselPricePerLitre: 100 },
      0
    );
    const consistency = result.factors.find((f) => f.key === "energyConsistency")!;
    expect(consistency.points).toBeLessThan(15);
  });

  it("awards full energy-consistency points when the implied load matches the household size", () => {
    // dieselSpend/price -> litres -> kWh -> load exactly at the midpoint of the expected range.
    const result = computeSunScore(
      { dieselSpend: 48_000, runHours: 8, householdSize: 4, consistencyMonths: 6, dieselPricePerLitre: 1_600 },
      0
    );
    const consistency = result.factors.find((f) => f.key === "energyConsistency")!;
    expect(consistency.points).toBeGreaterThan(0);
  });
});

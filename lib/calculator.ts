import type { CalculatorInput, CalculatorOutput, SpendTier } from "@/types";

interface TierConstants {
  monthlyPayment: number;
  ownershipMonthsMin: number;
  ownershipMonthsMax: number;
}

const TIER_CONSTANTS: Record<Exclude<SpendTier, "below_threshold">, TierConstants> = {
  starter: { monthlyPayment: 20_000, ownershipMonthsMin: 18, ownershipMonthsMax: 24 },
  standard: { monthlyPayment: 35_000, ownershipMonthsMin: 24, ownershipMonthsMax: 30 },
  power: { monthlyPayment: 62_500, ownershipMonthsMin: 30, ownershipMonthsMax: 36 },
  business: { monthlyPayment: 115_000, ownershipMonthsMin: 36, ownershipMonthsMax: 36 },
};

export function classifyTier(dieselSpend: number): SpendTier {
  const rounded = Math.round(dieselSpend);
  if (rounded < 20_000) return "below_threshold";
  if (rounded <= 39_999) return "starter";
  if (rounded <= 79_999) return "standard";
  if (rounded <= 149_999) return "power";
  return "business";
}

export function isPreQualified(dieselSpend: unknown, consistencyMonths: unknown): boolean {
  if (typeof dieselSpend !== "number" || typeof consistencyMonths !== "number") return false;
  if (!Number.isFinite(dieselSpend) || !Number.isFinite(consistencyMonths)) return false;
  return dieselSpend >= 20_000 && consistencyMonths >= 3;
}

export function calculate(input: CalculatorInput): CalculatorOutput {
  const spendTier = classifyTier(input.dieselSpend);
  const preQualified = isPreQualified(input.dieselSpend, input.consistencyMonths);

  if (spendTier === "below_threshold") {
    return {
      spendTier,
      estimatedMonthlyPayment: null,
      ownershipMonthsMin: null,
      ownershipMonthsMax: null,
      monthlySavings: null,
      threeYearSavings: null,
      isPreQualified: preQualified,
    };
  }

  const { monthlyPayment, ownershipMonthsMin, ownershipMonthsMax } = TIER_CONSTANTS[spendTier];
  const ownershipMonthsMidpoint = (ownershipMonthsMin + ownershipMonthsMax) / 2;
  const monthlySavings = input.dieselSpend - monthlyPayment;
  const threeYearSavings = input.dieselSpend * 36 - monthlyPayment * ownershipMonthsMidpoint;

  return {
    spendTier,
    estimatedMonthlyPayment: monthlyPayment,
    ownershipMonthsMin,
    ownershipMonthsMax,
    monthlySavings,
    threeYearSavings,
    isPreQualified: preQualified,
  };
}

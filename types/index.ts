export type SpendTier =
  | "starter"
  | "standard"
  | "power"
  | "business"
  | "below_threshold";

export interface CalculatorInput {
  dieselSpend: number;
  runHours: number;
  householdSize: number;
  consistencyMonths: number;
  dieselPricePerLitre: number;
}

export interface CalculatorOutput {
  spendTier: SpendTier;
  estimatedMonthlyPayment: number | null;
  ownershipMonthsMin: number | null;
  ownershipMonthsMax: number | null;
  monthlySavings: number | null;
  threeYearSavings: number | null;
  isPreQualified: boolean;
}

export interface Offer {
  provider: "Lumos" | "Arnergy" | "d.light";
  tier: SpendTier;
  monthlyPayment: number;
  ownershipMonths: number;
  regions: string[];
}

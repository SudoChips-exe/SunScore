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

export type SunScoreBand =
  | "not_yet_ready"
  | "emerging"
  | "qualified"
  | "strong"
  | "excellent";

export interface SunScoreFactor {
  key: string;
  label: string;
  points: number;
  maxPoints: number;
  detail: string;
}

export interface SunScoreResult {
  score: number;
  band: SunScoreBand;
  bandLabel: string;
  factors: SunScoreFactor[];
}

export interface CalculatorOutput {
  spendTier: SpendTier;
  estimatedMonthlyPayment: number | null;
  ownershipMonthsMin: number | null;
  ownershipMonthsMax: number | null;
  monthlySavings: number | null;
  threeYearSavings: number | null;
  isPreQualified: boolean;
  sunScore: SunScoreResult;
}

export interface Offer {
  provider: "Lumos" | "Arnergy" | "d.light";
  tier: SpendTier;
  monthlyPayment: number;
  ownershipMonths: number;
  regions: string[];
}

export interface SavedCalculation {
  id: string;
  inputs: CalculatorInput;
  output: CalculatorOutput;
  createdAt: number;
  receiptUrl?: string;
}

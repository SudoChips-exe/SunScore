import type { CalculatorInput, SunScoreBand, SunScoreFactor, SunScoreResult } from "@/types";

/**
 * Diesel burned per kWh produced by a mid-size genset at typical load,
 * per commonly cited manufacturer spec sheets (e.g. Cummins, Caterpillar)
 * and off-grid energy-access field reports. Used to cross-check a
 * household's stated spend against its stated usage pattern.
 */
const DIESEL_LITRES_PER_KWH = 0.4;
export const DIESEL_KG_CO2_PER_LITRE = 2.6;
const DAYS_PER_MONTH = 30;

const BAND_THRESHOLDS: { min: number; band: SunScoreBand; label: string }[] = [
  { min: 90, band: "excellent", label: "Excellent" },
  { min: 75, band: "strong", label: "Strong" },
  { min: 60, band: "qualified", label: "Qualified" },
  { min: 40, band: "emerging", label: "Emerging" },
  { min: 0, band: "not_yet_ready", label: "Not Yet Ready" },
];

function resolveBand(score: number): { band: SunScoreBand; label: string } {
  const match = BAND_THRESHOLDS.find((b) => score >= b.min)!;
  return { band: match.band, label: match.label };
}

function clamp01(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * Plausible average load (kW) a household of this size would draw from
 * basic appliances (lights, fans, TV, phone charging, small fridge).
 * Approximate residential sizing heuristic used for a consistency check,
 * not a precision engineering figure.
 */
function expectedLoadRangeKW(householdSize: number): { min: number; max: number } {
  return {
    min: 0.3 + 0.15 * householdSize,
    max: 0.8 + 0.6 * householdSize,
  };
}

function loadConsistencyRatio(impliedLoadKW: number, householdSize: number): number {
  const { min, max } = expectedLoadRangeKW(householdSize);
  if (impliedLoadKW >= min && impliedLoadKW <= max) return 1;
  const nearestBound = impliedLoadKW < min ? min : max;
  if (nearestBound <= 0) return 0;
  const deviation = Math.abs(impliedLoadKW - nearestBound) / nearestBound;
  return clamp01(1 - deviation);
}

/**
 * Computes a transparent, weighted 0-100 SunScore from the calculator
 * inputs, instead of a flat spend-tier lookup. Every factor traces to a
 * real formula or a stated, cited assumption so the breakdown is auditable:
 *
 *  - Sustained Ability to Pay (35 pts): consistencyMonths vs a 24-month target.
 *  - Energy Consistency Check (30 pts): cross-checks the implied electrical
 *    load (from spend, price, and run hours) against a plausible range for
 *    the stated household size, using genset fuel-consumption physics.
 *  - Household Energy Dependency (20 pts): how much real demand the diesel
 *    spend is currently covering (run hours x household size).
 *  - Plan Savings Efficiency (15 pts): how much of current spend the
 *    matched solar plan actually converts into savings.
 */
export function computeSunScore(
  input: CalculatorInput,
  monthlySavings: number | null
): SunScoreResult {
  const { dieselSpend, runHours, householdSize, consistencyMonths, dieselPricePerLitre } = input;

  const affordabilityRatio = clamp01(consistencyMonths / 24);
  const affordabilityPoints = affordabilityRatio * 35;

  const impliedLitresPerMonth = dieselPricePerLitre > 0 ? dieselSpend / dieselPricePerLitre : 0;
  const impliedKWhPerMonth = impliedLitresPerMonth / DIESEL_LITRES_PER_KWH;
  const impliedLoadKW = runHours > 0 ? impliedKWhPerMonth / (runHours * DAYS_PER_MONTH) : 0;
  const consistencyRatio = loadConsistencyRatio(impliedLoadKW, householdSize);
  const consistencyPoints = consistencyRatio * 30;

  const runHoursRatio = clamp01(Math.min(runHours, 16) / 16);
  const householdRatio = clamp01(Math.min(householdSize, 8) / 8);
  const burdenPoints = (runHoursRatio * 0.6 + householdRatio * 0.4) * 20;

  const savingsRatio =
    monthlySavings !== null && dieselSpend > 0 ? clamp01(monthlySavings / dieselSpend) : 0;
  const efficiencyPoints = savingsRatio * 15;

  const score = Math.max(0, Math.min(100, Math.round(
    affordabilityPoints + consistencyPoints + burdenPoints + efficiencyPoints
  )));
  const { band, label } = resolveBand(score);

  const factors: SunScoreFactor[] = [
    {
      key: "affordability",
      label: "Sustained Ability to Pay",
      points: Math.round(affordabilityPoints * 10) / 10,
      maxPoints: 35,
      detail: `You've held this spend steady for ${consistencyMonths} of the 24 months we look for.`,
    },
    {
      key: "energyConsistency",
      label: "Energy Consistency Check",
      points: Math.round(consistencyPoints * 10) / 10,
      maxPoints: 30,
      detail: `Your numbers imply a ${impliedLoadKW.toFixed(2)} kW average load — ${
        consistencyRatio >= 0.9 ? "consistent with" : "off from"
      } what a household of ${householdSize} typically draws.`,
    },
    {
      key: "energyBurden",
      label: "Household Energy Dependency",
      points: Math.round(burdenPoints * 10) / 10,
      maxPoints: 20,
      detail: `${runHours}h/day across ${householdSize} people shows how much real demand diesel is currently covering.`,
    },
    {
      key: "financialEfficiency",
      label: "Plan Savings Efficiency",
      points: Math.round(efficiencyPoints * 10) / 10,
      maxPoints: 15,
      detail:
        monthlySavings !== null
          ? `The matched plan converts ${Math.round(savingsRatio * 100)}% of your current spend straight into savings.`
          : "No solar plan matched yet — sustained spend above ₦20,000/month unlocks this factor.",
    },
  ];

  return { score, band, bandLabel: label, factors };
}

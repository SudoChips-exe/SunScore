import type { CalculatorInput, CalculatorOutput } from "@/types";

interface ComparisonCardProps {
  inputs: CalculatorInput;
  output: CalculatorOutput;
}

export function ComparisonCard({ inputs, output }: ComparisonCardProps) {
  const {
    estimatedMonthlyPayment,
    monthlySavings,
    threeYearSavings,
    ownershipMonthsMin,
    ownershipMonthsMax,
  } = output;

  const ownershipCopy =
    ownershipMonthsMin === ownershipMonthsMax
      ? `Own your system by month ${ownershipMonthsMax}, then pay ₦0/month.`
      : `Own your system between month ${ownershipMonthsMin} and month ${ownershipMonthsMax}, then pay ₦0/month.`;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-neutral-200 p-6">
        <div>
          <p className="text-sm text-neutral-500">Diesel Spend</p>
          <p className="text-2xl font-bold">₦{inputs.dieselSpend.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Solar PAYGo</p>
          <p className="text-2xl font-bold">₦{estimatedMonthlyPayment?.toLocaleString()}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-neutral-500">Monthly Savings</p>
        <p className="text-4xl font-bold text-green-600">
          ₦{monthlySavings?.toLocaleString()}
        </p>
      </div>

      <p className="text-neutral-700">{ownershipCopy}</p>

      <div>
        <p className="text-sm text-neutral-500">3-Year Savings</p>
        <p className="text-3xl font-bold">₦{threeYearSavings?.toLocaleString()}</p>
      </div>
    </div>
  );
}

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

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-12">
      {/* Hero Savings Section */}
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-green-600">
          Estimated Monthly Savings
        </span>
        <div className="mt-2 font-display text-7xl font-medium text-brand-stone-900 md:text-8xl">
          <span className="text-brand-green-600">₦</span>
          {monthlySavings?.toLocaleString()}
        </div>
      </div>

      {/* Monthly Comparison Split */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-brand-stone-200 bg-white p-8 text-center shadow-sm">
          <span className="text-sm font-medium text-brand-stone-500 uppercase tracking-wide">Current Fuel Spend</span>
          <div className="mt-4 text-4xl font-bold text-brand-stone-900">
            ₦{inputs.dieselSpend.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-brand-stone-400">per month</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-brand-green-100 bg-brand-green-50 p-8 text-center shadow-sm">
          <span className="text-sm font-medium text-brand-green-600 uppercase tracking-wide">Solar PAYGo Plan</span>
          <div className="mt-4 text-4xl font-bold text-brand-green-700">
            ₦{estimatedMonthlyPayment?.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-brand-green-500">per month</div>
        </div>
      </div>

      {/* Ownership Journey Timeline */}
      <div className="rounded-3xl border border-brand-stone-200 bg-white p-8 shadow-sm">
        <h3 className="mb-8 text-center font-display text-2xl font-medium text-brand-stone-900">
          Your Path to Ownership
        </h3>
        <div className="relative flex items-center justify-between gap-4">
          {/* Line background */}
          <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-brand-stone-100" />
          
          {/* Month 0 */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-brand-stone-300 ring-4 ring-white" />
            <span className="text-xs font-medium text-brand-stone-500">Month 0</span>
            <span className="text-[10px] uppercase text-brand-stone-400">Start</span>
          </div>

          {/* Ownership point */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-brand-gold-500 ring-4 ring-white shadow-md" />
            <span className="text-xs font-bold text-brand-stone-900">
              {ownershipMonthsMin === ownershipMonthsMax 
                ? `Month ${ownershipMonthsMax}` 
                : `Month ${ownershipMonthsMin} - ${ownershipMonthsMax}`}
            </span>
            <span className="text-[10px] uppercase text-brand-gold-600 font-semibold">Full Ownership</span>
          </div>

          {/* Month Forever */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-brand-green-500 ring-4 ring-white" />
            <span className="text-xs font-medium text-brand-stone-500">Forever</span>
            <span className="text-[10px] uppercase text-brand-green-600 font-semibold">₦0 / month</span>
          </div>
        </div>
      </div>

      {/* Long Term Value */}
      <div className="flex flex-col items-center justify-center rounded-3xl bg-brand-stone-900 p-8 text-center text-white shadow-xl">
        <span className="text-sm font-medium uppercase tracking-widest text-brand-stone-400">
          3-Year Cumulative Savings
        </span>
        <div className="mt-4 font-display text-5xl font-medium text-brand-gold-400 md:text-6xl">
          ₦{threeYearSavings?.toLocaleString()}
        </div>
        <p className="mt-4 text-sm text-brand-stone-400">
          That&apos;s capital you can reinvest back into your home or business.
        </p>
      </div>
    </div>
  );
}

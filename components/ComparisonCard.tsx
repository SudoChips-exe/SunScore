import type { CalculatorInput, CalculatorOutput } from "@/types";
import { Naira } from "@/components/Naira";

interface ComparisonCardProps {
  inputs: CalculatorInput;
  output: CalculatorOutput;
}

function JerryCanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-stone-500" aria-hidden>
      <path
        d="M7 9V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M5 9h14l1 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L5 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 4h4v2h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 13h8M8 17h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SolarPanelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-brand-green-600" aria-hidden>
      <path
        d="M4 8 12 4l8 4-2 12H6L4 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 4v16M6.5 8h11M5.2 13.5h13.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
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
    <div className="relative mx-auto flex max-w-2xl flex-col gap-12 px-6 py-12">
      {/* Hero Savings Section */}
      <div className="text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-green-600">
          You just found this much every month
        </span>
        <div className="mt-2 font-display text-7xl font-medium text-brand-stone-900 md:text-8xl">
          <span className="text-brand-green-600">
            <Naira />
          </span>
          {monthlySavings?.toLocaleString()}
        </div>
      </div>

      {/* Monthly Comparison Split */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-brand-stone-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-stone-100">
            <JerryCanIcon />
          </div>
          <span className="text-sm font-medium text-brand-stone-500 uppercase tracking-wide">
            The Fuel &amp; Diesel Life
          </span>
          <div className="mt-4 text-4xl font-bold text-brand-stone-900">
            <Naira />
            {inputs.dieselSpend.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-brand-stone-400">per month, forever</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-brand-green-100 bg-brand-green-50 p-8 text-center shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-green-100">
            <SolarPanelIcon />
          </div>
          <span className="text-sm font-medium text-brand-green-600 uppercase tracking-wide">
            The Solar Way Out
          </span>
          <div className="mt-4 text-4xl font-bold text-brand-green-700">
            <Naira />
            {estimatedMonthlyPayment?.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-brand-green-500">per month, then it ends</div>
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
            <span className="text-[10px] uppercase text-brand-green-600 font-semibold">
              <Naira />0 / month
            </span>
          </div>
        </div>
      </div>

      {/* Long Term Value */}
      <div className="flex flex-col items-center justify-center rounded-3xl bg-brand-stone-900 p-8 text-center text-white shadow-xl">
        <span className="text-sm font-medium uppercase tracking-widest text-brand-stone-400">
          3-Year Cumulative Savings
        </span>
        <div className="mt-4 font-display text-5xl font-medium text-brand-gold-400 md:text-6xl">
          <Naira />
          {threeYearSavings?.toLocaleString()}
        </div>
        <p className="mt-4 text-sm text-brand-stone-400">
          That&apos;s capital you can reinvest back into your home or business.
        </p>
      </div>
    </div>
  );
}

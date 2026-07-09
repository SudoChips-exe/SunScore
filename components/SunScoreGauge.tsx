import type { SunScoreResult } from "@/types";

const BAND_STYLES: Record<string, { ring: string; text: string; bg: string }> = {
  excellent: { ring: "stroke-brand-green-600", text: "text-brand-green-700", bg: "bg-brand-green-50" },
  strong: { ring: "stroke-brand-green-500", text: "text-brand-green-600", bg: "bg-brand-green-50" },
  qualified: { ring: "stroke-brand-gold-500", text: "text-brand-gold-600", bg: "bg-brand-gold-50" },
  emerging: { ring: "stroke-brand-gold-400", text: "text-brand-stone-700", bg: "bg-brand-stone-100" },
  not_yet_ready: { ring: "stroke-red-400", text: "text-red-500", bg: "bg-red-50" },
};

interface SunScoreGaugeProps {
  sunScore: SunScoreResult;
}

export function SunScoreGauge({ sunScore }: SunScoreGaugeProps) {
  const { score, band, bandLabel, factors } = sunScore;
  const style = BAND_STYLES[band] ?? BAND_STYLES.emerging;

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-3xl border border-brand-stone-200 bg-white p-8 shadow-sm">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="10" className="stroke-brand-stone-100" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${style.ring} transition-all duration-700`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-display text-4xl font-medium text-brand-stone-900">{score}</span>
          <span className="text-xs text-brand-stone-400">/ 100</span>
        </div>
      </div>

      <div className="text-center">
        <span className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${style.bg} ${style.text}`}>
          {bandLabel}
        </span>
        <p className="mt-2 text-sm text-brand-stone-500">
          Your SunScore — how ready you are for a solar PAYGo plan.
        </p>
      </div>

      <details className="w-full">
        <summary className="cursor-pointer text-center text-sm font-semibold text-brand-stone-700 underline">
          See how we calculated this
        </summary>
        <div className="mt-4 flex flex-col gap-3">
          {factors.map((factor) => (
            <div key={factor.key} className="rounded-2xl bg-brand-stone-50 p-4">
              <div className="flex items-center justify-between text-sm font-semibold text-brand-stone-900">
                <span>{factor.label}</span>
                <span>
                  {factor.points} / {factor.maxPoints}
                </span>
              </div>
              <p className="mt-1 text-xs text-brand-stone-500">{factor.detail}</p>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

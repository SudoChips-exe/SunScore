import { Check, X } from "lucide-react";
import { Naira } from "@/components/Naira";

const ROWS = [
  { name: "Upfront Cost", generator: "Low", solar: <><Naira />0 (financed)</> },
  { name: "Monthly Fuel", generator: "Yes (rising)", solar: "Free (sunlight)" },
  { name: "Maintenance", generator: "Frequent", solar: "Minimal" },
  { name: "Lifespan", generator: "5-7 years", solar: "25+ years" },
  { name: "Environmental", generator: "Toxic emissions", solar: "Zero emissions" },
  { name: "3-Year Total Cost", generator: "Very high", solar: <>Lower, then <Naira />0/mo</> },
];

export function Comparison() {
  return (
    <section id="comparison" className="w-full bg-brand-stone-50 px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wide text-brand-stone-500">
            Comparison
          </span>
          <h2 className="mb-6 font-display text-4xl font-medium leading-tight text-brand-stone-900 md:text-5xl">
            Generator vs. Solar PAYGo
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-brand-stone-600">
            See how solar financing compares to the traditional fuel and diesel trap.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-brand-stone-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-brand-stone-200">
                <th className="px-6 py-6 text-left font-bold text-brand-stone-900">Feature</th>
                <th className="px-6 py-6 text-center font-bold text-brand-stone-900">Generator</th>
                <th className="px-6 py-6 text-center font-bold text-brand-stone-900">Solar PAYGo</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.name} className="border-b border-brand-stone-100 last:border-0 hover:bg-brand-stone-50">
                  <td className="px-6 py-6 font-semibold text-brand-stone-900">{row.name}</td>
                  <td className="px-6 py-6 text-center text-brand-stone-600">{row.generator}</td>
                  <td className="px-6 py-6 text-center">
                    <span className="inline-block rounded-lg bg-brand-green-100 px-4 py-2 font-semibold text-brand-green-700">
                      {row.solar}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-red-100 bg-red-50 p-8">
            <h3 className="mb-4 text-lg font-bold text-red-900">Generator Trap</h3>
            <ul className="space-y-3">
              {[
                "Fuel costs spike unpredictably",
                "Constant breakdowns and repairs",
                "Short lifespan, frequent replacement",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                  <span className="text-brand-stone-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border-2 border-brand-gold-400 bg-brand-gold-50 p-8">
            <h3 className="mb-4 text-lg font-bold text-brand-stone-900">Solar Advantage</h3>
            <ul className="space-y-3">
              {[
                "Predictable financing payments",
                "Minimal maintenance, maximum uptime",
                "25+ years of clean energy",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-green-600" />
                  <span className="text-brand-stone-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-brand-green-100 bg-brand-green-50 p-8">
            <h3 className="mb-4 text-lg font-bold text-brand-green-900">The Bottom Line</h3>
            <div className="mb-4 font-display text-3xl font-medium text-brand-green-700">
              Save from month one
            </div>
            <p className="text-sm leading-relaxed text-brand-stone-700">
              Savings only grow as fuel and diesel prices keep rising your solar payment doesn&apos;t.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

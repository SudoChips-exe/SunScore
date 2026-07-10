import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ScrollNavButton } from "@/components/ScrollNavButton";

const ISSUES = [
  "Fuel prices that double without warning",
  "Constant repair bills and engine servicing",
  "Toxic fumes and noise that never stop",
];

export function Problem() {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/generator-problem.jpg"
            alt="A worn, patched-up diesel generator"
            className="h-80 w-full rounded-3xl object-cover"
          />

          <div className="space-y-8">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-stone-500">
                Problem
              </span>
              <h2 className="mt-4 font-display text-4xl font-medium leading-tight text-brand-stone-900 md:text-5xl">
                The generator is a liar that steals your money
              </h2>
            </div>

            <p className="text-xl leading-relaxed text-brand-stone-600">
              It promises power but delivers debt. Fuel and diesel prices swing wildly. Maintenance
              costs never end. You&apos;re trapped in a cycle of expensive, dirty energy.
            </p>

            <ul className="space-y-4">
              {ISSUES.map((issue) => (
                <li key={issue} className="flex items-center gap-4 text-lg text-brand-stone-700">
                  <span className="inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-brand-gold-500" />
                  {issue}
                </li>
              ))}
            </ul>

            <div className="flex gap-6 pt-4">
              <ScrollNavButton
                targetId="comparison"
                className="inline-flex h-12 items-center rounded-full border border-brand-stone-300 px-8 text-lg font-semibold text-brand-stone-900 transition hover:border-brand-stone-400"
              >
                Compare
              </ScrollNavButton>
              <Link
                href="/calculate"
                className="inline-flex h-12 items-center gap-2 px-4 text-lg font-semibold text-brand-stone-700 transition hover:text-brand-stone-900"
              >
                See my numbers
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

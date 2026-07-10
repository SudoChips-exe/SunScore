"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    id: 0,
    question: "How does solar PAYGo financing work?",
    answer:
      "Solar PAYGo is a pay-as-you-go financing model where you pay for solar systems in small, affordable installments instead of the full upfront cost. Once payments are complete, the system is yours.",
  },
  {
    id: 1,
    question: "What happens during rainy season?",
    answer:
      "Solar systems still generate power during rainy season, though at reduced capacity. Systems are designed with battery storage to ensure consistent supply through low-sun periods.",
  },
  {
    id: 2,
    question: "How long do solar panels last?",
    answer:
      "Modern solar panels typically last 25-30 years with minimal maintenance, still generating most of their original capacity after 25 years — far longer than a generator's 5-7 year lifespan.",
  },
  {
    id: 3,
    question: "Can I upgrade my system later?",
    answer:
      "Yes — systems from our matched providers are modular and scalable. As your needs grow, you can add panels or batteries without losing your existing investment.",
  },
  {
    id: 4,
    question: "What's included in maintenance?",
    answer:
      "Solar systems require minimal maintenance — typically just occasional panel cleaning and connection checks, significantly less than generator servicing.",
  },
  {
    id: 5,
    question: "How do I get started?",
    answer:
      "Enter your fuel and diesel costs in our calculator to get your SunScore and a matched plan — it takes about three minutes.",
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <section className="w-full bg-white px-6 py-24 md:px-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <span className="mb-4 block text-sm font-semibold uppercase tracking-wide text-brand-stone-500">
            FAQ
          </span>
          <h2 className="mb-6 font-display text-4xl font-medium leading-tight text-brand-stone-900 md:text-5xl">
            Common questions answered
          </h2>
          <p className="text-xl leading-relaxed text-brand-stone-600">
            Everything you need to know about solar PAYGo financing and switching to clean energy.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div
              key={faq.id}
              className="rounded-2xl border border-brand-stone-200 bg-white transition hover:border-brand-gold-300"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="flex w-full items-center justify-between px-8 py-6 text-left transition hover:bg-brand-stone-50"
              >
                <h3 className="text-lg font-semibold text-brand-stone-900">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-brand-stone-500 transition-transform ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div className="border-t border-brand-stone-100 px-8 pb-6 pt-6">
                  <p className="leading-relaxed text-brand-stone-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-brand-stone-900 p-12 text-center text-white">
          <h3 className="mb-4 font-display text-2xl font-medium">Didn&apos;t find your answer?</h3>
          <p className="mb-8 text-brand-stone-300">
            Run your numbers and see exactly what a solar PAYGo plan looks like for you.
          </p>
          <Link
            href="/calculate"
            className="inline-block rounded-full bg-brand-gold-500 px-8 py-3 font-semibold text-brand-stone-900 transition hover:bg-brand-gold-600"
          >
            Reveal My Savings
          </Link>
        </div>
      </div>
    </section>
  );
}

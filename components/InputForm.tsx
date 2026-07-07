"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculate } from "@/lib/calculator";
import { saveLead } from "@/lib/firebase";
import { useSunScore } from "@/context/SunScoreContext";
import { Naira } from "@/components/Naira";
import { AmbientBackground } from "@/components/AmbientBackground";
import type { CalculatorInput } from "@/types";

interface FieldSchema {
  name: keyof CalculatorInput;
  label: string;
  min: number;
  max: number;
  step?: number;
  integerOnly?: boolean;
  defaultValue?: number;
  isCurrency?: boolean;
}

const FIELDS: FieldSchema[] = [
  { name: "dieselSpend", label: "Monthly Fuel/Diesel Spend", min: 1, max: 10_000_000, isCurrency: true },
  { name: "runHours", label: "Daily Run Hours", min: 0.5, max: 24, step: 0.5 },
  { name: "householdSize", label: "Household Size (people)", min: 1, max: 100, integerOnly: true },
  { name: "consistencyMonths", label: "Consistency Months", min: 1, max: 120, integerOnly: true },
  {
    name: "dieselPricePerLitre",
    label: "Fuel/Diesel Price per Litre",
    min: 100,
    max: 10_000,
    defaultValue: 1_600,
    isCurrency: true,
  },
];

function validateField(field: FieldSchema, value: number): string | null {
  if (Number.isNaN(value)) return `${field.label} is required`;
  if (field.integerOnly && !Number.isInteger(value)) {
    return `${field.label} must be a whole number between ${field.min} and ${field.max}`;
  }
  if (value < field.min || value > field.max) {
    return `${field.label} must be between ${field.min} and ${field.max}`;
  }
  return null;
}

export function InputForm() {
  const router = useRouter();
  const { setResult } = useSunScore();
  const [values, setValues] = useState<Record<string, string>>({
    dieselSpend: "",
    runHours: "",
    householdSize: "",
    consistencyMonths: "",
    dieselPricePerLitre: "1600",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed: Record<string, number> = {};
    const nextErrors: Record<string, string> = {};

    for (const field of FIELDS) {
      const raw = values[field.name];
      const num = raw === "" ? NaN : Number(raw);
      const error = validateField(field, num);
      if (error) {
        nextErrors[field.name] = error;
      } else {
        parsed[field.name] = num;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input = parsed as unknown as CalculatorInput;
    const output = calculate(input);
    setResult(input, output);
    saveLead(input, output.spendTier);
    router.push("/results");
  }

  return (
    <div className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center overflow-hidden px-6 py-12">
      <AmbientBackground />
      <div className="w-full rounded-3xl border border-brand-stone-200 bg-white p-8 shadow-sm md:p-12">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-medium text-brand-stone-900">
            Do the Math on the Leak
          </h2>
          <p className="mt-2 text-brand-stone-500">
            Three minutes of typing against years of diesel receipts. Let&apos;s see the damage.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.name} className={`flex flex-col gap-2 ${field.name === "dieselSpend" ? "sm:col-span-2" : ""}`}>
                <label htmlFor={field.name} className="text-sm font-medium text-brand-stone-700">
                  {field.label}
                  {field.isCurrency && (
                    <>
                      {" ("}
                      <Naira />
                      {")"}
                    </>
                  )}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="number"
                  step={field.step ?? (field.integerOnly ? 1 : "any")}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`rounded-xl border px-4 py-3 transition-all outline-none focus:ring-2 focus:ring-brand-gold-500 ${
                    errors[field.name] 
                      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200" 
                      : "border-brand-stone-200 focus:border-brand-gold-500"
                  }`}
                />
                {errors[field.name] && (
                  <p className="text-xs text-red-500">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="group relative mt-4 inline-flex items-center justify-center overflow-hidden rounded-full bg-brand-gold-500 px-8 py-4 font-semibold text-brand-stone-900 transition-all hover:bg-brand-gold-600 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10">Reveal My Savings</span>
            <div className="absolute inset-0 -z-10 translate-y-full transition-transform group-hover:translate-y-0 bg-brand-gold-400" />
          </button>
        </form>
      </div>
    </div>
  );
}

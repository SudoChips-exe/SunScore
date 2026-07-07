"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculate } from "@/lib/calculator";
import { saveLead } from "@/lib/firebase";
import { useSunScore } from "@/context/SunScoreContext";
import type { CalculatorInput } from "@/types";

interface FieldSchema {
  name: keyof CalculatorInput;
  label: string;
  min: number;
  max: number;
  step?: number;
  integerOnly?: boolean;
  defaultValue?: number;
}

const FIELDS: FieldSchema[] = [
  { name: "dieselSpend", label: "Monthly Diesel Spend (₦)", min: 1, max: 10_000_000 },
  { name: "runHours", label: "Daily Run Hours", min: 0.5, max: 24, step: 0.5 },
  { name: "householdSize", label: "Household Size (people)", min: 1, max: 100, integerOnly: true },
  { name: "consistencyMonths", label: "Consistency Months", min: 1, max: 120, integerOnly: true },
  {
    name: "dieselPricePerLitre",
    label: "Diesel Price per Litre (₦)",
    min: 100,
    max: 10_000,
    defaultValue: 1_600,
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
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 px-6 py-12">
      {FIELDS.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type="number"
            step={field.step ?? (field.integerOnly ? 1 : "any")}
            value={values[field.name]}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className="rounded-xl border border-neutral-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors[field.name] && (
            <p className="text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}
      <button
        type="submit"
        className="mt-2 rounded-2xl bg-amber-400 px-8 py-3 font-semibold text-neutral-900 shadow transition hover:bg-amber-500"
      >
        Calculate My Savings
      </button>
    </form>
  );
}

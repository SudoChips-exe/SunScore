"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CalculatorInput, CalculatorOutput } from "@/types";

interface SunScoreContextValue {
  inputs: CalculatorInput | null;
  output: CalculatorOutput | null;
  setResult: (inputs: CalculatorInput, output: CalculatorOutput) => void;
  reset: () => void;
}

export const SunScoreContext = createContext<SunScoreContextValue | null>(null);

export function SunScoreProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<CalculatorInput | null>(null);
  const [output, setOutput] = useState<CalculatorOutput | null>(null);

  function setResult(i: CalculatorInput, o: CalculatorOutput) {
    setInputs(i);
    setOutput(o);
  }

  function reset() {
    setInputs(null);
    setOutput(null);
  }

  return (
    <SunScoreContext.Provider value={{ inputs, output, setResult, reset }}>
      {children}
    </SunScoreContext.Provider>
  );
}

export function useSunScore(): SunScoreContextValue {
  const ctx = useContext(SunScoreContext);
  if (!ctx) throw new Error("useSunScore must be used within SunScoreProvider");
  return ctx;
}

# Implementation Plan: SunScore

## Overview

SunScore is a 4-screen Next.js App Router web app that compares diesel/generator costs against equivalent solar PAYGo plans for Nigerian households and small businesses. Implementation follows a bottom-up order: project scaffold → shared types → pure-function libraries (Calculator, OfferMatcher, Firebase) → tests → React context → UI screens → wiring and documentation.

## Role Assignments

| Role | Scope |
|---|---|
| **Full Stack A** | Project scaffold, shared types, Calculator library + tests, Firebase integration |
| **Full Stack B** | Offer Matcher library + tests, React Context, Input Form screen, Root Layout |
| **UI/UX** | Landing screen, Comparison Result screen, Matched Offers screen, README |

---

## Task Dependency Graph

```
1. Project Scaffold & Config                      [Full Stack A]
   └── 2. Shared Types (`types/index.ts`)         [Full Stack A]
        ├── 3. Calculator Library                  [Full Stack A]
        │    ├── 6. Calculator Unit Tests          [Full Stack A]
        │    └── 7. Calculator PBTs (P1–P9)        [Full Stack A]
        ├── 4. Offer Matcher Library               [Full Stack B]
        │    ├── 8. Offer Matcher Unit Tests       [Full Stack B]
        │    └── 9. Offer Matcher PBTs (P10–P11)  [Full Stack B]
        └── 5. Firebase Integration                [Full Stack A]
             └── 10. React Context Provider       [Full Stack B]
                  ├── 11. Landing Screen (/)      [UI/UX]
                  ├── 12. Input Form (/calculate) [Full Stack B]
                  │    └── [depends on 3, 4, 5]
                  ├── 13. Results Screen          [UI/UX]
                  │    └── [depends on 3]
                  └── 14. Matched Offers Screen   [UI/UX]
                       └── [depends on 4]
15. Root Layout & Tailwind Wiring                 [Full Stack B]
16. README & `.env.local.example`                 [UI/UX]
```

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] },
    { "wave": 3, "tasks": ["3", "4", "5"] },
    { "wave": 4, "tasks": ["6", "7", "8", "9"] },
    { "wave": 5, "tasks": ["10"] },
    { "wave": 6, "tasks": ["11", "12", "13", "14"] },
    { "wave": 7, "tasks": ["15", "16"] }
  ]
}
```

---

## Tasks

### 👤 Full Stack A

- [ ] 1. Project Scaffold & Configuration
  - Initialise a Next.js 14 project with the App Router and TypeScript enabled (`app/` directory convention)
  - Configure Tailwind CSS: create `tailwind.config.ts` at the project root with a `content` array covering `./app/**/*.{ts,tsx}` and `./components/**/*.{ts,tsx}`; add the three `@tailwind` directives to the global CSS file
  - Install all required dependencies: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `firebase` (10.x), `fast-check` (3.x), `vitest`, and `@testing-library/react`; pin to the specified versions
  - Configure Vitest: create `vitest.config.ts` at the project root, pointing at the `lib/__tests__/` directory with TypeScript support enabled
  - Add brand color tokens, font families, border-radius overrides, and box-shadow values into `tailwind.config.ts`
  - Add `body { @apply bg-coal-50 text-coal-800; }` to `app/globals.css`
  - Verify the scaffold builds (`npm run build`) and Vitest runs without errors
  - **Acceptance criteria**: Requirements 10.1, 10.2

- [ ] 2. Shared TypeScript Types (`types/index.ts`)
  - Create `types/index.ts` and export all shared types used across lib and components
  - Export `SpendTier` union type: `"starter" | "standard" | "power" | "business" | "below_threshold"`
  - Export `CalculatorInput` interface: `dieselSpend`, `runHours`, `householdSize`, `consistencyMonths`, `dieselPricePerLitre` (all `number`)
  - Export `CalculatorOutput` interface: `spendTier: SpendTier`, `estimatedMonthlyPayment: number | null`, `ownershipMonthsMin: number | null`, `ownershipMonthsMax: number | null`, `monthlySavings: number | null`, `threeYearSavings: number | null`, `isPreQualified: boolean`
  - Export `Offer` interface: `provider: "Lumos" | "Arnergy" | "d.light"`, `tier: SpendTier`, `monthlyPayment: number`, `ownershipMonths: number`, `regions: string[]`
  - No React or Next.js imports in this file
  - **Acceptance criteria**: Requirements 3.x, 4.x, 6.x, 7.x (type contracts)

- [ ] 3. Calculator Library (`lib/calculator.ts`)
  - Create `lib/calculator.ts` with zero imports from React, Next.js, or any browser API
  - Implement and export `classifyTier(dieselSpend: number): SpendTier` using the tier lookup table; apply `Math.round()` before boundary comparison (Requirement 3.7)
  - Implement and export `isPreQualified(dieselSpend: number, consistencyMonths: number): boolean`; return `true` only when both `dieselSpend >= 20,000` AND `consistencyMonths >= 3`; return `false` for any `null`, `undefined`, non-numeric, `NaN`, or `Infinity` input
  - Implement and export `calculate(input: CalculatorInput): CalculatorOutput` which classifies tier, looks up constants, computes `monthlySavings` and `threeYearSavings`, sets `isPreQualified`; returns all nullable fields as `null` when tier is `"below_threshold"`
  - The constant tier table must be a static lookup, not computed at runtime
  - **Acceptance criteria**: Requirements 3.1–3.7, 4.1–4.8, 6.1–6.4

- [ ] 5. Firebase Integration (`lib/firebase.ts`)
  - Create `lib/firebase.ts`
  - Implement `getFirebaseConfig()`: reads all six `NEXT_PUBLIC_FIREBASE_*` env vars, collects any missing or empty, throws a single descriptive error naming them — Requirement 9.3
  - Implement singleton Firebase app initialisation: call `initializeApp` only if `getApps().length === 0`, otherwise reuse `getApps()[0]`
  - Export `db: Firestore` initialised with `getFirestore(app)`
  - Implement and export `saveLead(input: CalculatorInput, spendTier: SpendTier): Promise<void>` which calls `addDoc` on `"leads"` with all seven fields including `createdAt: serverTimestamp()`; wraps in `try/catch`; on rejection calls `console.error` and returns normally (never rethrows)
  - Do NOT hardcode any Firebase credentials — Requirement 9.2
  - Create `.env.local.example` at the project root with all six `NEXT_PUBLIC_FIREBASE_*` keys, placeholder values, and inline comments
  - **Acceptance criteria**: Requirements 9.1–9.5, 10.3

- [ ] 6. Calculator Unit Tests (`lib/__tests__/calculator.test.ts`)
  - Create `lib/__tests__/calculator.test.ts`
  - Write example-based tests for `classifyTier` covering all tier boundaries, rounding (₦39,999.5 → `"standard"`), and edge cases (zero, negative)
  - Write example-based tests for `isPreQualified` covering the boundary values and invalid input types
  - Write example-based tests for `calculate` covering a valid starter input, a valid business input, a below-threshold input, and the pre-qualified flag
  - **Acceptance criteria**: Requirements 3.1–3.7, 4.1–4.8, 6.1–6.4

- [ ] 7. Calculator Property-Based Tests (`lib/__tests__/calculator.pbt.test.ts`)
  - Create `lib/__tests__/calculator.pbt.test.ts`; use Vitest + fast-check; minimum 100 iterations (500 for P2 and P9)
  - Add tag comment before each property: `// Feature: sunscore, Property N: <description>`
  - **P1 – Tier totality**: for any finite `number`, `classifyTier` returns one of the five valid `SpendTier` strings and never throws — **Validates: Requirements 3.1–3.5**
  - **P2 – Tier boundaries**: per tier range, `classifyTier(Math.round(n))` returns the expected tier; no two conditions simultaneously true — **Validates: Requirements 3.1–3.5, 3.7**
  - **P3 – Below-threshold nulls**: for `fc.integer({ max: 19999 })`, all five nullable output fields are `null` — **Validates: Requirements 3.6, 4.7**
  - **P4 – Tier constants**: per tier range, `calculate` returns exactly the constant payment and ownership values — **Validates: Requirements 4.1–4.4**
  - **P5 – Monthly savings invariant**: `monthlySavings === dieselSpend - estimatedMonthlyPayment` — **Validates: Requirement 4.5**
  - **P6 – 3-Year savings formula**: `threeYearSavings === (dieselSpend * 36) - (estimatedMonthlyPayment * midpoint)` — **Validates: Requirement 4.6**
  - **P7 – Payment < tier upper bound**: `estimatedMonthlyPayment` is strictly less than the tier's Diesel Spend upper bound — **Validates: Requirement 4.8**
  - **P8 – Pre-qualification biconditional**: `isPreQualified` is `true` iff spend ≥ 20,000 AND months ≥ 3 — **Validates: Requirements 6.1–6.3**
  - **P9 – Input validation ranges**: valid-range values produce no error; out-of-range values produce an error naming the field and range — **Validates: Requirements 2.2–2.6**
  - **Acceptance criteria**: Requirements 3.1–3.7, 4.1–4.8, 6.1–6.3

---


---


---

## Notes

- All computation is client-side and deterministic; there is no back-end API.
- Firebase Firestore is write-only from the client. A failed write never blocks navigation.
- `lib/calculator.ts` and `lib/offers.ts` must remain free of React/Next.js imports so they can be exercised by Vitest in Node.js without a DOM.
- Property-based tests (Tasks 7 and 9) use **fast-check** (3.x) with **Vitest**. Each property block must include the tag comment `// Feature: sunscore, Property N: <description>` and a `**Validates: Requirements X.Y**` annotation.
- The pre-qualified badge appears only on the first offer at index 0 of the sorted list; it is driven by `output.isPreQualified` from context.
- The `below_threshold` state is a valid application state, not an error; it renders a distinct fallback UI on both the Results and Offers screens.
- Tasks 3, 4, and 5 can be implemented in parallel once Task 2 is complete. Tasks 11–14 can be implemented in parallel once Task 10 is complete.

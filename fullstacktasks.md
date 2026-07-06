- [ ] 1. Offer Matcher Library (`lib/offers.ts`)
  - Create `lib/offers.ts` with zero React or Next.js imports
  - Export `MOCK_OFFERS: Offer[]` — the hardcoded 9-entry array covering Lumos, Arnergy, d.light across starter / standard / power / business tiers (at least 2 per provider); every entry satisfies Requirement 7.2 constraints
  - Export `matchOffers(tier: SpendTier, preQualified: boolean): { offers: Offer[]; preQualified: boolean }` which filters by exact `tier` match (case-sensitive), sorts ascending by `monthlyPayment` then `ownershipMonths`, does not mutate `MOCK_OFFERS`, and passes through `preQualified`
  - **Acceptance criteria**: Requirements 7.2–7.5

- [ ] 2. Offer Matcher Unit Tests (`lib/__tests__/offers.test.ts`)
  - Create `lib/__tests__/offers.test.ts`
  - Verify `MOCK_OFFERS` integrity: at least 9 entries; at least 2 per provider; all constraint fields valid
  - Test `matchOffers("starter", false)` and `matchOffers("business", true)` for correct filtering, sorting, and `preQualified` pass-through
  - Test `matchOffers("below_threshold", false)` returns empty offers array
  - Test non-mutation of `MOCK_OFFERS` after calling `matchOffers`
  - Test tie-break: two offers with equal `monthlyPayment`, different `ownershipMonths`; verify lower `ownershipMonths` comes first
  - **Acceptance criteria**: Requirements 7.2–7.5

- [ ] 3. Offer Matcher Property-Based Tests (`lib/__tests__/offers.pbt.test.ts`)
  - Create `lib/__tests__/offers.pbt.test.ts`; use Vitest + fast-check; minimum 100 iterations
  - Add tag comments: `// Feature: sunscore, Property N: <description>`
  - **P10 – Offer filtering**: generate arbitrary offer arrays and a random tier; every returned offer has `offer.tier === tier` — **Validates: Requirement 7.4**
  - **P11 – Offer sorting**: for every adjacent pair in the result, `offers[i].monthlyPayment ≤ offers[i+1].monthlyPayment`; on ties `offers[i].ownershipMonths ≤ offers[i+1].ownershipMonths` — **Validates: Requirement 7.5**
  - **Acceptance criteria**: Requirements 7.4, 7.5

- [ ] 4. React Context Provider (`context/SunScoreContext.tsx`)
  - Create `context/SunScoreContext.tsx` as a `"use client"` component
  - Implement `SunScoreContext` with `createContext<SunScoreContextValue | null>(null)`
  - Implement `SunScoreProvider`: holds `inputs: CalculatorInput | null` and `output: CalculatorOutput | null` in `useState`; exposes `setResult(inputs, output)` and `reset()` functions
  - Implement `useSunScore()` hook: throws `new Error("useSunScore must be used within SunScoreProvider")` if context is `null`
  - No Calculator or Firebase imports in this file
  - **Acceptance criteria**: Requirements 8.1, 8.3

- [ ] 5. Input Form Screen (`app/calculate/page.tsx` + `components/InputForm.tsx`)
  - Create `components/InputForm.tsx` as a `"use client"` component
  - Implement a `FormField` helper component accepting `label`, `name`, `error`, `defaultValue`, `min`, `max`, `step`, `integerOnly` props; renders a labelled `<input type="number">` with an inline error message below it
  - Implement field validation per schema: `dieselSpend` (1–10,000,000); `runHours` (0.5–24); `householdSize` (1–100, integer only); `consistencyMonths` (1–120, integer only); `dieselPricePerLitre` (100–10,000, default ₦1,600); validation errors name the field and valid range
  - On valid submit: call `calculate(validatedInput)`, call `context.setResult(inputs, output)`, call `saveLead(inputs, output.spendTier)` (fire-and-forget), then `router.push("/results")`
  - The diesel price field must default to `1600`
  - Create `app/calculate/page.tsx` as a `"use client"` wrapper rendering `<InputForm />`
  - Write example-based tests: valid submit triggers navigation + `saveLead`; invalid submit shows error messages; Firestore failure does not block navigation; all five fields present; diesel price defaults to 1600
  - **Acceptance criteria**: Requirements 2.1–2.10

- [ ] 6. Root Layout, Global CSS & Tailwind Wiring (`app/layout.tsx`)
  - Create or update `app/layout.tsx`: set `<html lang="en">`; import Inter and Sora fonts (or system-font fallbacks); wrap `{children}` in `<SunScoreProvider>`
  - Import `./globals.css` in the layout so Tailwind base styles and the `body` background token apply globally
  - Confirm `tailwind.config.ts` `content` array covers both `./app/**/*.{ts,tsx}` and `./components/**/*.{ts,tsx}`
  - Run `npm run build` and verify zero TypeScript errors, zero Tailwind purge warnings, and all four routes present in the build output
  - **Acceptance criteria**: Requirements 10.1, 10.2

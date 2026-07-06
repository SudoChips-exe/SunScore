
- [ ] 1. Landing Screen (`app/page.tsx`)
  - Create `app/page.tsx` as a Server Component (no `"use client"`)
  - Render the exact headline: `"You've been affording solar this whole time — you just didn't know it."`
  - Render a one-to-two sentence supporting description explaining SunScore's value proposition
  - Render a primary CTA using `<Link href="/calculate">` styled with `bg-sun-400 hover:bg-sun-500 text-coal-900 font-semibold px-8 py-3 rounded-2xl shadow-card transition`; label: "Calculate My Savings" or equivalent
  - Apply `text-coal-900 font-display text-5xl font-bold leading-tight` to `<h1>` and `text-coal-600 text-lg font-normal` to the subheading
  - Write a smoke test: component mounts, headline text and CTA are present
  - **Acceptance criteria**: Requirements 1.1–1.5

- [ ] 2. Comparison Result Screen (`app/results/page.tsx`)
  - Create `app/results/page.tsx` as a `"use client"` component
  - Implement redirect guard using `useEffect` + `router.replace("/calculate")` when context is invalid; return `null` while redirect is in-flight
  - When `spendTier === "below_threshold"`: render a `BelowThresholdMessage` with warning styles and a `<Link href="/calculate">` — no comparison data shown
  - When tier is valid: render diesel spend vs `estimatedMonthlyPayment`; render `monthlySavings` with `text-leaf-600 font-display text-4xl font-bold`; render ownership timeline (range copy when min ≠ max, single-month copy when equal); render `threeYearSavings` as headline stat; render "See My Matched Offers" button → `router.push("/offers")`
  - Write example tests: valid context renders comparison data; `below_threshold` renders fallback; null context triggers redirect
  - **Acceptance criteria**: Requirements 5.1–5.7, 8.2, 8.4

- [ ] 3. Matched Offers Screen (`app/offers/page.tsx` + `components/OfferCard.tsx`)
  - Create `components/OfferCard.tsx` accepting `offer: Offer` and `showBadge: boolean`; render provider name, monthly payment (₦), ownership as "X months", regions as comma-separated; when `showBadge` is `true` render the Pre-Qualified badge styled `bg-leaf-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`
  - Create `app/offers/page.tsx` as a `"use client"` component with the same redirect guard pattern as Task 13
  - Call `matchOffers(output.spendTier, output.isPreQualified)` to get the filtered, sorted list
  - When `offers.length === 0`: render fallback "No matched offers currently available" with a `<Link href="/calculate">`
  - When `offers.length > 0`: render `OfferCard` for each; pass `showBadge={output.isPreQualified && index === 0}` only to the first card
  - Write example tests: pre-qualified badge on first card; badge absent on subsequent cards; no-match fallback renders; null context redirects; offer cards render correct data
  - **Acceptance criteria**: Requirements 7.1–7.9, 8.2

- [ ] 4. README & Developer Documentation
  - Create `README.md` at the project root with step-by-step setup instructions (see README template below)
  - Verify `.env.local.example` exists with all six `NEXT_PUBLIC_FIREBASE_*` keys, placeholder values, and inline purpose comments
  - **Acceptance criteria**: Requirements 10.3, 10.4

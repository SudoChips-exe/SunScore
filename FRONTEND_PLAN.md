# SunScore Frontend Plan

The frontend has been fully implemented following a minimalistic, professional, and high-conversion design direction. The visual layer is built on top of the pre-existing functional scaffold.

---

## 1. What's already wired up (don't rebuild this)

| Concern | File | What it gives you |
|---|---|---|
| Tier classification, savings math | `lib/calculator.ts` | `calculate(input)` → `CalculatorOutput` |
| Offer matching | `lib/offers.ts` | `matchOffers(tier, preQualified)` → sorted, filtered offers |
| Lead capture | `lib/firebase.ts` | `saveLead(input, tier)` — fire-and-forget, never blocks nav |
| Asset/upload storage | `lib/supabase.ts` | `uploadFile(path, file)`, `getPublicUrl(path)` |
| Cross-screen state | `context/SunScoreContext.tsx` | `useSunScore()` → `{ inputs, output, setResult, reset }` |
| Shared types | `types/index.ts` | `SpendTier`, `CalculatorInput`, `CalculatorOutput`, `Offer` |
| Routes + guards | `app/page.tsx`, `app/calculate/page.tsx`, `app/results/page.tsx`, `app/offers/page.tsx` | Functional, styled — logic maintained |

---

## 2. Implemented Brand Direction

The design follows a "Professional Minimalist" aesthetic:
- **Palette**: 
  - `brand-gold`: Primary CTA and optimistic accents.
  - `brand-green`: Savings, growth, and pre-qualified credentials.
  - `brand-stone`: Warm neutrals for backgrounds and text to avoid "cold" fintech feel.
- **Typography**: 
  - Display: `Playfair Display` for a confident, high-end feel on headlines.
  - Body: `Geist` for modern, clean readability.
- **Vibe**: Relief and clarity. Numbers are presented as "good news" through generous spacing and clear visual hierarchies.

---

## 3. Implementation Details

### Screen 1 — Landing (`/`)
- **Status**: Completed
- **Design**: High-impact hero with a bold display headline.
- **Key Feature**: Included an illustrative "Diesel vs Solar" comparison preview to communicate value immediately before user input.

### Screen 2 — Input Form (`/calculate`)
- **Status**: Completed
- **Design**: Clean, centered card layout.
- **Key Feature**: Responsive grid layout for fields with calm validation states (soft red backgrounds rather than alarming borders).

### Screen 3 — Comparison Result (`/results`)
- **Status**: Completed
- **Design**: "Aha" moment focused on the Monthly Savings hero stat.
- **Key Features**: 
  - Side-by-side monthly payment contrast.
  - **Visual Ownership Timeline**: A horizontal journey from Month 0 → Full Ownership → ₦0/month forever.
  - High-contrast dark-mode card for 3-Year Cumulative Savings.
  - Dedicated, encouraging "Below Threshold" state.

### Screen 4 — Matched Offers (`/offers`)
- **Status**: Completed
- **Design**: Professional offer cards.
- **Key Features**:
  - Clear hierarchy: Provider → Payment → Ownership Terms → Regions.
  - "Pre-Qualified" badge prominently displayed on the top match.
  - Graceful empty state with a clear path back to the calculator.

---

## 4. Cross-cutting concerns

- **Responsive Design**: Fully mobile-first, optimized for mid-range Android devices.
- **Accessibility**: Maintained WCAG AA contrast ratios, especially for gold/green accents on off-white backgrounds.
- **Formatting**: Consistent Naira formatting using `.toLocaleString()`.
- **UX**: Instant transitions between screens via memory-only context.

---

## 5. Explicitly out of scope

- No new backend endpoints.
- No auth or persistent user accounts.
- No CMS for offer management.

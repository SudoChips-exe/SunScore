# SunScore Frontend Plan

This is a planning document only — nothing in here has been built for you. All backend/logic
plumbing (Calculator, OfferMatcher, Firebase lead capture, Supabase storage, React context,
routing, guards) is already wired up in the repo as minimally-styled scaffold pages. Your job is
to redesign the visual layer on top of that scaffold. This doc tells you what already exists,
what to build, and suggested direction — the actual design decisions (palette, type, layout,
motion) are yours to make.

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
| Routes + guards | `app/page.tsx`, `app/calculate/page.tsx`, `app/results/page.tsx`, `app/offers/page.tsx` | Functional, unstyled — restyle in place, keep the guard/redirect logic |

The existing pages/components (`InputForm`, `ComparisonCard`, `OfferCard`) are functionally
complete — form validation, redirect guards, tier-aware rendering, badge logic. Treat them as a
skeleton to restyle, not something to reverse-engineer from scratch. Feel free to split them into
smaller components as your design needs.

---

## 2. Brand direction (starting point, not gospel)

Audience: cost-conscious Nigerian households/small businesses currently paying for diesel. The
tone should feel like relief and clarity, not a fintech dashboard — "you're already affording
this" is the core emotional beat, so numbers should feel like good news, not a spreadsheet.

Suggested palette direction (adjust freely):
- **Warm amber/gold** — solar, optimism, primary CTA color
- **Deep forest green** — savings, growth, positive numbers, pre-qualified badge
- **Warm charcoal/off-white neutrals** — not cold grey; keep body backgrounds warm (`#fafaf9`-ish, not pure white)
- Reserve red/orange strictly for validation errors and the below-threshold message

Typography: a confident display face for headlines/big numbers, a plain, highly legible body face
(low-bandwidth users matter here — system font stacks are a legitimate choice, not a compromise).

---

## 3. Screen-by-screen plan

### Screen 1 — Landing (`/`)
**Goal:** stop the scroll, make the value prop legible in 3 seconds.
- Hero headline (fixed copy, already in scaffold): *"You've been affording solar this whole time — you just didn't know it."*
- One–two sentence subhead translating that into what the tool does
- Single primary CTA → `/calculate` — no secondary CTAs competing for attention
- Consider: a simple visual motif contrasting "diesel spend" vs "solar payment" even before the user enters data (e.g., two stacked bars, illustrative not real numbers) to preview what they'll get
- No forms, no scrolling required to see the CTA on mobile

### Screen 2 — Input Form (`/calculate`)
**Goal:** feel like 30 seconds, not a loan application.
- 5 fields total (diesel spend, run hours, household size, consistency months, diesel price/litre) — the last one pre-filled at ₦1,600 so most users never touch it
- One field per visual "step" or a single clean vertical form — avoid multi-page wizard, the spec assumes single-screen submission
- Inline validation messages already name the field + valid range — style them as calm, not alarming (avoid full-red form fields on first render)
- Consider a live/optimistic preview of the tier or savings ballpark as diesel spend is typed, if you want extra delight — optional, not required by spec
- Submit button copy should telegraph "see my savings," not "submit"

### Screen 3 — Comparison Result (`/results`)
**Goal:** the "aha" moment — this is the screen people screenshot.
- Diesel vs. Solar payment shown side-by-side (not stacked) so the contrast reads instantly
- Monthly Savings is the loudest number on the primary viewport — treat as the hero stat
- Ownership timeline reads as a milestone/journey, not a table row — consider a simple horizontal progress/timeline visual (month 0 → ownership month → "then ₦0/month forever")
- 3-Year Savings is a secondary headline stat, placed to be the "shareable" number
- **Below-threshold state is a distinct screen, not an error** — frame it encouragingly ("almost there") with a link back to `/calculate`, never red/alarming
- CTA to `/offers` should feel like the natural next step, not an upsell

### Screen 4 — Matched Offers (`/offers`)
**Goal:** convert the "aha" into a real next action with a real provider.
- Cards, not a table — provider name, monthly payment, ownership length, regions
- Pre-Qualified badge only on the first (cheapest) card when applicable — should read as a genuine credential, not a marketing sticker
- If you introduce provider logos, that's exactly what the Supabase bucket is for — upload once via `lib/supabase.ts`'s `uploadFile`, then reference by a stable path (e.g. `providers/lumos.png`) and resolve with `getPublicUrl`
- Empty state (`no offers matched`) should still route back to `/calculate` gracefully, not dead-end

---

## 4. Cross-cutting concerns

- **Loading/transition states**: navigation between screens is instant (in-memory context, no fetch), so the main thing to design is the *feel* of the transition (e.g., a subtle fade/slide between screens) rather than spinners.
- **Direct URL access**: `/results` and `/offers` redirect to `/calculate` if context is empty (e.g., a shared link, a refresh). Design a clean "redirecting…" flash-free experience — the guard already returns `null` during redirect, so avoid a layout that pops/flashes when that happens.
- **Numbers formatting**: Naira amounts should use thousands separators everywhere (already using `.toLocaleString()` in the scaffold) — keep this consistent if you reformat.
- **Accessibility**: form inputs need visible focus states and associated `<label>`s (scaffold has this) — maintain WCAG AA contrast if you introduce warm ambers/greens on white, some combinations will need darkening.
- **Mobile-first**: assume most users are on mid/low-end Android on mobile data — avoid heavy imagery, prioritize fast first paint (server components stay server components where the scaffold already has them, e.g. the landing page).
- **Copy tone**: reassuring, plain-language, no fintech jargon ("pre-qualified," "PAYGo," "ownership" are already the spec's vocabulary — keep the terms consistent screen-to-screen).

---

## 5. Suggested build order

1. Define your real design tokens in `tailwind.config.ts` (palette, type, radius, shadow) — currently a placeholder empty theme
2. Landing screen (lowest complexity, sets the tone)
3. Input Form (restyle `InputForm.tsx` / `FormField` pattern)
4. Comparison Result (restyle `ComparisonCard.tsx`, add the ownership timeline visual)
5. Matched Offers (restyle `OfferCard.tsx`, wire up provider logos via Supabase if desired)
6. Pass over all four for responsive + accessibility + motion polish

---

## 6. Explicitly out of scope

- No new backend endpoints — all data needs are already covered by Firestore (write-only leads) and Supabase (storage bucket). If you find yourself wanting a new API route, stop and reconsider — the spec is intentionally backend-light.
- No auth, no user accounts, no localStorage persistence — session state is memory-only by design.
- No CMS — offers are hardcoded in `lib/offers.ts`; edit that file directly if you need to change provider data.

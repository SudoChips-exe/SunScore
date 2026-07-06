# SunScore

> "You've been affording solar this whole time — you just didn't know it."

SunScore is a web app for Nigerian households and small businesses that helps them see — at a glance — that their existing diesel/generator spend already covers the cost of an equivalent solar PAYGo plan. Enter what you already spend on diesel, get a personalised savings comparison, an ownership timeline, and matched offers from real solar PAYGo providers.

---

## Features

- **Savings Calculator** — enter monthly diesel spend, run hours, household size, and consistency months to see your potential monthly and 3-year savings
- **Spend Tier Classification** — automatically categorised into Starter, Standard, Power, or Business tiers
- **Ownership Timeline** — see exactly which month your solar system would be paid off and payments drop to ₦0
- **Pre-Qualification** — users with ≥ ₦20,000/month spend sustained over ≥ 3 months receive a Pre-Qualified badge
- **Matched Offers** — filtered, sorted solar PAYGo offers from Lumos, Arnergy, and d.light matched to your tier
- **Lead Capture** — form submissions are written to Firebase Firestore as a write-only lead store (never blocks navigation)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| State | React Context (in-memory, no localStorage) |
| Backend | Firebase Firestore (write-only lead capture) |
| Testing | Vitest + fast-check (property-based) + @testing-library/react |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-org/sunscore.git
cd sunscore
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Copy the example environment file and fill in your Firebase project credentials:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace each placeholder with the corresponding value from your [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps → Web app:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note:** The app will throw a descriptive error at build time if any of these variables are missing or empty. Never commit `.env.local` to source control.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot-reloads on file changes.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server (requires build first) |
| `npm run test` | Run Vitest in watch mode |
| `npm run test -- --run` | Run Vitest once (CI mode) |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
app/
  layout.tsx              # Root layout — wraps app in SunScoreProvider
  page.tsx                # Landing screen (/)
  calculate/
    page.tsx              # Input Form screen (/calculate)
  results/
    page.tsx              # Comparison Result screen (/results)
  offers/
    page.tsx              # Matched Offers screen (/offers)

components/
  SunScoreProvider.tsx    # React context provider
  InputForm.tsx           # Form with validation
  ComparisonCard.tsx      # Side-by-side cost comparison display
  OfferCard.tsx           # Single matched offer card

context/
  SunScoreContext.tsx     # Context definition, provider, and useSunScore hook

lib/
  calculator.ts           # Tier classification, savings computation, pre-qualification
  offers.ts               # Mock offers array + matchOffers function
  firebase.ts             # Firebase initialisation + lead write

types/
  index.ts                # Shared TypeScript types (SpendTier, CalculatorInput, etc.)

lib/__tests__/
  calculator.test.ts      # Calculator unit tests
  calculator.pbt.test.ts  # Calculator property-based tests (fast-check)
  offers.test.ts          # Offer matcher unit tests
  offers.pbt.test.ts      # Offer matcher property-based tests (fast-check)

.env.local.example        # Firebase config template (safe to commit)
```

---

## Spend Tiers

| Tier | Monthly Diesel Spend | Solar PAYGo Payment | Ownership Timeline |
|---|---|---|---|
| Starter | ₦20,000 – ₦39,999 | ₦20,000/mo | 18–24 months |
| Standard | ₦40,000 – ₦79,999 | ₦35,000/mo | 24–30 months |
| Power | ₦80,000 – ₦149,999 | ₦62,500/mo | 30–36 months |
| Business | ₦150,000+ | ₦115,000/mo | 36 months |

After the ownership month, monthly payments drop to **₦0**.

---

## Firestore Data Model

Each form submission writes a single document to the `leads` collection:

```
leads/{autoId}
  dieselSpend:          number
  runHours:             number
  householdSize:        number
  consistencyMonths:    number
  dieselPricePerLitre:  number
  spendTier:            string   ("starter" | "standard" | "power" | "business" | "below_threshold")
  createdAt:            Timestamp
```

The app never reads from Firestore. A failed write is caught, logged to `console.error`, and never blocks navigation to the results screen.

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain (e.g. `project.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket (e.g. `project.appspot.com`) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

---

## Team & Task Ownership

| Role | Tasks |
|---|---|
| **Full Stack A** | Scaffold, shared types, Calculator library + tests, Firebase integration |
| **Full Stack B** | Offer Matcher library + tests, React Context, Input Form, Root Layout |
| **UI/UX** | Landing screen, Results screen, Matched Offers screen, README |

---

## Contributing

1. Branch off `main` using the naming convention `feat/your-feature` or `fix/your-fix`
2. Keep `lib/calculator.ts` and `lib/offers.ts` free of React/Next.js imports — they must run in plain Node.js for tests
3. Run `npm run test -- --run` before pushing; all property-based tests must pass
4. Open a PR against `main` and assign at least one reviewer

---

## License

MIT

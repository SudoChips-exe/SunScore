# Requirements Document

## Introduction

SunScore is a web application targeting Nigerian households and small businesses that currently rely on diesel generators for power. The app allows a user to enter their monthly generator/diesel expenditure and immediately see a side-by-side comparison against an equivalent solar PAYGo (Pay-As-You-Go) plan — including monthly savings, the month they would own the system outright, and a 3-year cumulative savings headline. That same spend data doubles as an alternative credit signal that pre-qualifies the user for matched solar PAYGo offers from real providers.

The product is a 4-screen web app: Landing → Input Form → Comparison Result → Matched Offers. It is built with Next.js (App Router), Tailwind CSS, and Firebase Firestore for lead capture. No authentication is required.

---

## Glossary

- **App**: The SunScore Next.js web application.
- **User**: A Nigerian household member or small business owner visiting the app.
- **Diesel Spend**: The user's self-reported monthly expenditure on diesel fuel or generator running costs, in Nigerian Naira (₦).
- **Diesel Price**: The assumed price per litre of diesel, defaulting to ₦1,600/litre, editable by the user.
- **Run Hours**: The number of hours per day the user runs their generator.
- **Household Size**: The number of people in the user's household or premises.
- **Consistency Months**: The number of consecutive months the user has spent approximately the same amount on diesel, as reported via the form's fourth input field. Used for pre-qualification logic.
- **Spend Tier**: A category derived from the user's Diesel Spend — one of Starter, Standard, Power, or Business.
- **Solar PAYGo Plan**: A Pay-As-You-Go solar financing plan where the user pays a fixed monthly amount and owns the system outright after a defined number of months.
- **Monthly Savings**: The difference between the user's Diesel Spend and the estimated monthly Solar PAYGo payment.
- **Ownership Month**: The month number (from today) at which the user's cumulative Solar PAYGo payments cover the system cost and the monthly payment drops to ₦0.
- **3-Year Savings**: The cumulative financial savings over 36 months compared to continuing with diesel.
- **Pre-Qualified**: A status badge awarded to a user whose Diesel Spend is ≥ ₦20,000/month sustained for ≥ 3 months (Consistency Months ≥ 3).
- **Lead**: A Firestore document written on form submission, containing the user's inputs and the derived Spend Tier.
- **Calculator**: The standalone utility module that implements all calculation and tier logic.
- **OfferMatcher**: The module that filters and ranks mock provider offers against the user's Spend Tier.
- **Mock Offers**: A hardcoded JSON array of provider plan objects used on the Matched Offers screen.
- **Provider**: One of three solar PAYGo companies represented in the Mock Offers: Lumos, Arnergy, d.light.

---

## Requirements

### Requirement 1: Landing Screen

**User Story:** As a User, I want to see a compelling landing page with a clear call to action, so that I understand what SunScore does and am motivated to enter my generator spend.

#### Acceptance Criteria

1. THE App SHALL render a Landing screen at the root route (`/`).
2. THE Landing screen SHALL display the headline copy: "You've been affording solar this whole time — you just didn't know it."
3. THE Landing screen SHALL display a short supporting description (one to two sentences) explaining that SunScore compares the user's generator costs against an equivalent solar PAYGo plan.
4. THE Landing screen SHALL display a primary call-to-action button with a visible text label directing the user to enter their generator spend (e.g., "Calculate My Savings" or equivalent).
5. WHEN the User activates the call-to-action button, THE App SHALL navigate to the `/calculate` route without a full page reload.

---

### Requirement 2: Input Form Screen

**User Story:** As a User, I want to enter my generator expenses and usage details, so that SunScore can calculate my solar savings and pre-qualification status.

#### Acceptance Criteria

1. THE App SHALL render an Input Form screen at the `/calculate` route.
2. THE Input Form SHALL contain a numeric input field for monthly Diesel Spend, denominated in Nigerian Naira (₦), accepting integer or decimal values between ₦1 and ₦10,000,000 inclusive.
3. THE Input Form SHALL contain a numeric input field for Run Hours per day, accepting decimal values between 0.5 and 24 inclusive.
4. THE Input Form SHALL contain a numeric input field for Household Size, accepting only positive integer values between 1 and 100 inclusive; non-integer input SHALL be rejected with a validation error.
5. THE Input Form SHALL contain a numeric input field for Consistency Months, accepting only positive integer values between 1 and 120 inclusive; non-integer input SHALL be rejected with a validation error.
6. THE Input Form SHALL contain a numeric input field for Diesel Price per litre, pre-populated with a default value of ₦1,600, accepting values between ₦100 and ₦10,000 inclusive, editable by the User.
7. IF the User submits the form with any required field empty, out of range, or of the wrong type, THEN THE App SHALL display a validation error message immediately below the offending field that identifies the field name and the valid range (e.g., "Run Hours must be between 0.5 and 24"), and SHALL NOT navigate away from the Input Form screen.
8. WHEN the User submits a valid form, THE App SHALL pass the validated inputs to the Calculator and navigate to the `/results` route.
9. WHEN the User submits a valid form, THE App SHALL write a Lead document to the Firestore `leads` collection containing: `dieselSpend`, `runHours`, `householdSize`, `consistencyMonths`, `dieselPricePerLitre`, `spendTier`, and `createdAt` (server timestamp).
10. IF the Firestore write fails, THEN THE App SHALL log the error to the browser console and SHALL still navigate the User to the `/results` route (the Firestore write is non-blocking and SHALL NOT block navigation).

---

### Requirement 3: Spend Tier Classification

**User Story:** As a developer, I want the Calculator to classify any Diesel Spend amount into a Spend Tier, so that downstream screens and matching logic use a consistent category.

#### Acceptance Criteria

1. WHEN the Calculator receives a Diesel Spend between ₦20,000 and ₦39,999 inclusive, THE Calculator SHALL classify the Spend Tier as `"starter"`.
2. WHEN the Calculator receives a Diesel Spend between ₦40,000 and ₦79,999 inclusive, THE Calculator SHALL classify the Spend Tier as `"standard"`.
3. WHEN the Calculator receives a Diesel Spend between ₦80,000 and ₦149,999 inclusive, THE Calculator SHALL classify the Spend Tier as `"power"`.
4. WHEN the Calculator receives a Diesel Spend of ₦150,000 or greater, THE Calculator SHALL classify the Spend Tier as `"business"`.
5. WHEN the Calculator receives a Diesel Spend below ₦20,000 (including ₦0 and any negative value), THE Calculator SHALL classify the Spend Tier as `"below_threshold"`.
6. WHEN the Spend Tier is `"below_threshold"`, THE Calculator SHALL return `null` for all solar estimate output fields (`estimatedMonthlyPayment`, `ownershipMonthsMin`, `ownershipMonthsMax`, `monthlySavings`, `threeYearSavings`).
7. THE Calculator SHALL treat non-integer Diesel Spend values at tier boundaries using standard mathematical rounding before classification (e.g., ₦39,999.50 rounds to ₦40,000 and classifies as `"standard"`).

---

### Requirement 4: Solar PAYGo Estimation

**User Story:** As a User, I want to see the estimated monthly cost of an equivalent solar PAYGo plan, so that I can compare it directly against what I currently spend on diesel.

#### Acceptance Criteria

1. WHEN the Spend Tier is `"starter"`, THE Calculator SHALL return an estimated monthly Solar PAYGo payment of ₦20,000 (the midpoint of ₦15,000–₦25,000) and ownership month range values of `ownershipMonthsMin = 18` and `ownershipMonthsMax = 24`.
2. WHEN the Spend Tier is `"standard"`, THE Calculator SHALL return an estimated monthly Solar PAYGo payment of ₦35,000 (the midpoint of ₦25,000–₦45,000) and ownership month range values of `ownershipMonthsMin = 24` and `ownershipMonthsMax = 30`.
3. WHEN the Spend Tier is `"power"`, THE Calculator SHALL return an estimated monthly Solar PAYGo payment of ₦62,500 (the midpoint of ₦45,000–₦80,000) and ownership month range values of `ownershipMonthsMin = 30` and `ownershipMonthsMax = 36`.
4. WHEN the Spend Tier is `"business"`, THE Calculator SHALL return an estimated monthly Solar PAYGo payment of ₦115,000 (the midpoint of ₦80,000–₦150,000) and ownership month range values of `ownershipMonthsMin = 36` and `ownershipMonthsMax = 36`.
5. THE Calculator SHALL compute Monthly Savings as: `monthlySavings = dieselSpend − estimatedMonthlyPayment`.
6. THE Calculator SHALL compute 3-Year Savings using the midpoint of the ownership range as the number of paid months: `threeYearSavings = (dieselSpend × 36) − (estimatedMonthlyPayment × ownershipMonthsMidpoint)`, where `ownershipMonthsMidpoint = (ownershipMonthsMin + ownershipMonthsMax) / 2` (values: Starter = 21, Standard = 27, Power = 33, Business = 36), representing that post-ownership months cost ₦0.
7. WHEN the Spend Tier is `"below_threshold"`, THE Calculator SHALL return `null` for all output fields and SHALL NOT perform any savings computation.
8. THE estimated monthly Solar PAYGo payment SHALL be strictly less than the upper bound of the corresponding Diesel Spend tier range for all valid Spend Tiers (e.g., Starter payment ₦20,000 < ₦40,000 upper bound).

---

### Requirement 5: Comparison Result Screen

**User Story:** As a User, I want to see a clear side-by-side comparison of my diesel costs versus a solar PAYGo plan, so that I can understand my potential savings at a glance.

#### Acceptance Criteria

1. THE App SHALL render a Comparison Result screen at the `/results` route.
2. THE Comparison Result screen SHALL display the user's entered Diesel Spend (₦) alongside the Calculator's estimated monthly Solar PAYGo payment.
3. THE Comparison Result screen SHALL display the computed Monthly Savings in Nigerian Naira.
4. THE Comparison Result screen SHALL display the ownership timeline as a range when `ownershipMonthsMin` differs from `ownershipMonthsMax` (e.g., "Own your system between month 18 and month 24, then pay ₦0/month") and as a single month when both values are equal (e.g., "Own your system by month 36, then pay ₦0/month").
5. THE Comparison Result screen SHALL display the 3-Year Savings as a headline statistic.
6. WHEN the Spend Tier is `"below_threshold"`, THE App SHALL display a message informing the User that their spend is below the minimum threshold for a solar PAYGo match and SHALL provide a navigation link back to the `/calculate` route; no comparison values SHALL be displayed.
7. WHEN the Spend Tier is a valid tier (not `"below_threshold"`), THE Comparison Result screen SHALL display a call-to-action button that navigates the User to the `/offers` route.

---

### Requirement 6: Pre-Qualification Logic

**User Story:** As a User, I want to know whether my spending history qualifies me for a solar PAYGo plan, so that I feel confident applying.

#### Acceptance Criteria

1. WHEN the Calculator receives a Diesel Spend ≥ ₦20,000 AND Consistency Months ≥ 3, THE Calculator SHALL return a pre-qualification status of `true`.
2. IF the Calculator receives a Diesel Spend < ₦20,000, THEN THE Calculator SHALL return a pre-qualification status of `false`.
3. IF the Calculator receives a Consistency Months value < 3, THEN THE Calculator SHALL return a pre-qualification status of `false`.
4. IF the Calculator receives a `dieselSpend` or `consistencyMonths` value that is `null`, `undefined`, or non-numeric, THEN THE Calculator SHALL return a pre-qualification status of `false`.

---

### Requirement 7: Matched Offers Screen

**User Story:** As a User, I want to see real solar PAYGo providers whose plans match my spend tier, so that I can take the next step toward getting solar installed.

#### Acceptance Criteria

1. THE App SHALL render a Matched Offers screen at the `/offers` route.
2. THE Mock Offers SHALL be a hardcoded JSON array where each entry contains: `provider` (string), `tier` (string matching a Spend Tier key exactly, case-sensitive), `monthlyPayment` (positive number > 0, ₦), `ownershipMonths` (integer between 1 and 120 inclusive), and `regions` (non-empty array of strings).
3. THE Mock Offers SHALL include at least 2 plan entries for each of the three Providers (Lumos, Arnergy, d.light) covering the defined Spend Tiers.
4. WHEN the User navigates to `/offers`, THE OfferMatcher SHALL filter Mock Offers to only those whose `tier` exactly matches (case-sensitive) the user's Spend Tier from the current session.
5. WHEN the User navigates to `/offers`, THE OfferMatcher SHALL sort the filtered offers by `monthlyPayment` ascending; offers with equal `monthlyPayment` SHALL be sorted by `ownershipMonths` ascending as a deterministic tie-breaker.
6. WHEN the user's pre-qualification status is `true`, THE App SHALL display a "Pre-Qualified" badge on the first offer at index 0 of the sorted and filtered list (the offer with the lowest `monthlyPayment`, or lowest `ownershipMonths` on a tie).
7. THE Matched Offers screen SHALL display each matched offer's provider name, monthly payment (₦), ownership timeline formatted as "X months", and regions served formatted as a comma-separated list.
8. WHEN no Mock Offers match the user's Spend Tier, THE App SHALL display a fallback message stating that no matched offers are currently available and SHALL provide a navigation link back to the `/calculate` route.
9. WHEN the User navigates to `/offers` without a valid Spend Tier in the current React context (e.g., direct URL access without submitting the form), THE App SHALL immediately redirect the User to the `/calculate` route before rendering any offer content.

---

### Requirement 8: Application Navigation and Routing

**User Story:** As a User, I want smooth navigation between all four screens, so that the app feels like a coherent flow rather than disconnected pages.

#### Acceptance Criteria

1. THE App SHALL implement the four screens as distinct Next.js App Router routes: `/`, `/calculate`, `/results`, and `/offers`.
2. WHEN the User navigates to `/results` or `/offers` without valid Calculator output present in the React context of the current page lifecycle, THE App SHALL immediately redirect the User to `/calculate` before rendering any content on the guarded route.
3. THE App SHALL pass calculation results between screens using React context; THE App SHALL NOT use URL query parameters or require a backend API call to retrieve results on the `/results` or `/offers` screens.
4. WHEN the User navigates to `/results` or `/offers` and the React context contains a `spendTier` value but is missing one or more required Calculator output fields, THE App SHALL treat the context as invalid and redirect the User to `/calculate`.

---

### Requirement 9: Firebase Firestore Integration

**User Story:** As a developer, I want lead data written to Firestore on each form submission, so that the aggregated diesel-dependency data can serve as a revenue and pitch asset.

#### Acceptance Criteria

1. THE App SHALL initialize the Firebase client using configuration values read exclusively from environment variables prefixed with `NEXT_PUBLIC_FIREBASE_`; the required variables are: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, and `NEXT_PUBLIC_FIREBASE_APP_ID`.
2. THE App SHALL NOT hardcode Firebase project credentials in source code.
3. WHEN the App starts and any of the required `NEXT_PUBLIC_FIREBASE_` environment variables is absent or is an empty string, THE App SHALL throw an error with a message that names each missing variable (e.g., "Missing Firebase config: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID").
4. WHEN a valid Lead is ready to be persisted, THE App SHALL call `addDoc` on the Firestore `leads` collection with a document containing: `dieselSpend` (number), `runHours` (number), `householdSize` (number), `consistencyMonths` (number), `dieselPricePerLitre` (number), `spendTier` (string), and `createdAt` (Firestore `serverTimestamp()` sentinel).
5. IF the `addDoc` call rejects, THE App SHALL catch the error, log it to `console.error`, and resolve the containing promise without rethrowing, so that the caller (form submit handler) is not blocked.

---

### Requirement 10: Project Scaffold and Configuration

**User Story:** As a developer, I want the project to be properly scaffolded with Next.js App Router and Tailwind CSS configured out of the box, so that both developers can start building immediately without environment setup friction.

#### Acceptance Criteria

1. THE App SHALL be scaffolded as a Next.js project using the App Router (`app/` directory convention), with TypeScript enabled.
2. THE App SHALL have Tailwind CSS configured such that: a `tailwind.config.ts` (or `.js`) file exists at the project root with a `content` array covering `./app/**/*.{ts,tsx}` and `./components/**/*.{ts,tsx}`; and the global CSS file contains the three `@tailwind base`, `@tailwind components`, and `@tailwind utilities` directives.
3. THE App SHALL include a `.env.local.example` file at the project root listing all six required `NEXT_PUBLIC_FIREBASE_` keys (as specified in Requirement 9.1) with placeholder values and an inline comment on each line describing the variable's purpose.
4. THE App SHALL include a `README.md` at the project root with step-by-step instructions that cover: cloning the repo, running `npm install`, copying `.env.local.example` to `.env.local` and filling in Firebase credentials, and running `npm run dev` to start the development server.
5. THE Calculator logic SHALL reside in `lib/calculator.ts` and SHALL export only pure functions with no imports from `react`, `next`, or any browser-only API, so that the module can be imported and executed in a Node.js test runner without a DOM.
6. THE Mock Offers data and the OfferMatcher function SHALL reside in `lib/offers.ts` and SHALL export the hardcoded offers array and the `matchOffers` function as named exports with no React or Next.js imports, enabling independent unit testing.

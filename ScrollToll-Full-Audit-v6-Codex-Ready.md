# ScrollToll Audit v6 — Codex Ready
**Date:** March 16, 2026 | **For:** iOS Codex thread (app only — website items are in a separate section at the bottom for the web Codex thread)

---

## How to Use

Each item is a self-contained Codex prompt. Copy the block, paste into Codex. Work top to bottom.

**Severity key:** P0 = launch blocker, P1 = fix before App Store submission, P2 = fix before public launch, P3 = polish

---

## COMPLETED (Do Not Repeat)

The following are confirmed done in the current codebase:

- ✅ Firebase Auth + Apple Sign In + Google Sign In (full auth service, onboarding step, settings display, sign out)
- ✅ `FirebaseApp.configure()` in `DoomForGoodApp.swift` init
- ✅ `GIDSignIn.sharedInstance.handle(url)` in `onOpenURL`
- ✅ `userEmail` property in `AppSettings.swift` with persistence, hydration, and reset
- ✅ `FirstTimePaymentSheet.swift` uses `AppSettings.shared.userEmail` instead of hardcoded email
- ✅ `forceUSTaxExperience` set to `false` in `AppSettings.swift:7`
- ✅ Payment copy fix: "Change amount or charity in Settings" → "You choose when the troll can charge you"
- ✅ Button delay hint text added to `FirstTimePaymentSheet` (shows "Skip unlocks in a moment" then transitions)
- ✅ Duplicate donation protection now persisted to shared UserDefaults (`group.com.rockpaperreality.DoomForGood`)
- ✅ `DonationService.swift` uses `currentLastDonationTimestamp` computed property with fallback to persisted value
- ✅ Payment confirmation gate (`DonationConfirmGateView`)
- ✅ Button reorder on confirmation screen (SHARE primary, BACK secondary)
- ✅ Processing copy ("The troll is collecting your toll.")
- ✅ Tax badge truncation fix (VStack layout)
- ✅ Dashboard LATEST IMPACT card
- ✅ Clear shields confirmation dialog
- ✅ Shield action breadcrumbs
- ✅ Progress bar debug logging
- ✅ Notification includes donation amount
- ✅ Dual notification scheduling
- ✅ Deferred payment sheet outcome pattern

---

## iOS ITEMS — REMAINING

### P0 — LAUNCH BLOCKERS

#### 1. Real Stripe Integration — Remove Mock Payment Method IDs
**Files:** `FirstTimePaymentSheet.swift:173`, `PaymentSetupView.swift`
**Problem:** Both files generate mock `pm_test_...` payment method IDs instead of real Stripe API calls. `StripeService.swift` has TODO comments saying "MOVE TO SERVER" at lines 33, 62, 93. Client-side card handling violates PCI compliance.
**Fix:** Replace mock ID generation with actual Stripe SDK `STPPaymentMethodParams` creation and confirmation flow. At minimum, create a server endpoint (Firebase Cloud Function recommended since Firebase is already in the project) that accepts a payment method nonce and returns a confirmed payment method ID. The server should hold the Stripe secret key, not the client.
**Note:** This is architecture work, not a quick patch. Plan as a dedicated sprint.

---

#### 2. Implement Charity Disbursement
**File:** `DonationService.swift:168` (the `prepareDisbursement` method)
**Problem:** TODO comment: "Integrate with Every.org or Change API". Stripe charges the user but funds are never sent to the selected charity.
**Status:** BLOCKED — waiting on response from Every.org CTO (Jiwon Min) on whether their API supports server-side programmatic donations. Also evaluating getchange.io as alternative. Do not implement until the API partner is confirmed.
**When unblocked:** Build a Cloud Function that receives the charity slug + amount after successful Stripe charge and calls the chosen API to disburse.

---

### P1 — PRE-SUBMISSION

#### 3. Remove Test Card Credentials from Onboarding UI
**File:** `PaymentSetupView.swift`
**Problem:** Shows `4242 4242 4242 4242 | Exp: 12/26 | CVC: 123` directly in the UI. This is Stripe's test card number visible to all users.
**Fix:** Wrap the test card display in `#if DEBUG` so it only appears in development builds. Remove or hide it entirely for release. Search the entire project for `4242` to catch any other test card references.

---

#### 4. Fix Void/Troll Metaphor Inconsistency
**File:** `PaymentSetupView.swift`
**Problem:** Uses "THE VOID" metaphor throughout ("CARD ACCEPTED BY THE VOID", "THE VOID CONSUMES", "THE VOID REJECTS") while the rest of the app consistently uses "THE TROLL." This confuses the brand identity.
**Fix:** Replace all "VOID" references with troll equivalents:
- "CARD ACCEPTED BY THE VOID" → "THE TROLL ACCEPTS YOUR OFFERING"
- "THE VOID CONSUMES" → "THE TROLL FEEDS"
- "THE VOID REJECTS" → "THE TROLL REJECTS YOUR OFFERING"
- Any other VOID references → troll equivalents
Also check `PaymentSetupView.swift` for the word "charged" and replace with "donated" — aligns with charity tone.

---

#### 5. Fix Remaining Misleading Copy
**File:** `PaymentSetupView.swift`
**Problem:** Alert text says "manually initiate donations" — no such feature exists in the app.
**Fix:** Change to "You can add a payment method later in Settings."

---

### P2 — PRE-LAUNCH POLISH

#### 6. Add Card Management to Settings
**File:** `SettingsView.swift`
**Problem:** Users can save a card during payment but there's no way to view, update, or remove it. The confirmation gate shows "Card ending in •••• XXXX" but Settings has no card section. Now that we have the account/email section from Firebase Auth, card management belongs right below it.
**Fix:** Add a "Payment Method" section to SettingsView below the account section showing:
- Card brand icon + last 4 digits (from `AppSettings.shared.stripeCardLast4`)
- "Update Card" button that presents the Stripe card input
- "Remove Card" button with confirmation dialog
If no card on file, show "Add Payment Method" button.

---

#### 7. Fix Weekly Donation Reset Reliability
**File:** `DonationStore.swift`
**Problem:** `checkWeeklyReset()` only runs on `reloadFromDefaults()`. If the app stays in memory for over a week without being killed, the weekly counter never resets.
**Fix:** Add a date check at the start of `recordDonation()`. If `lastResetDate` is more than 7 days ago, call `checkWeeklyReset()` before recording. Simple guard clause.

---

#### 8. Featured Charity Logos Still Nil
**File:** `CharityPickerView.swift`
**Problem:** Featured charities explicitly set `logoUrl: nil`, causing placeholder pink hearts instead of real logos. The `FeaturedCharity` struct only has `name` and `slug` — no `logoUrl` field.
**Fix:**
1. Add `logoUrl: String?` field to `FeaturedCharity` struct
2. Populate with Every.org CDN URLs: `https://every.org/cdn-cgi/image/width=100/<slug>/logo`
3. Update the featured charities array with real URLs
4. If URL loading fails, fall back to the existing pink heart placeholder

---

#### 9. Wrap Debug Triple-Tap Gesture in #if DEBUG
**File:** `DashboardView.swift`
**Problem:** Triple-tap gesture to show debug logs exists in release builds. The log panel is behind `#if DEBUG` but the gesture handler isn't. Users can trigger it and nothing visible happens.
**Fix:** Wrap the `.onTapGesture(count: 3)` modifier in `#if DEBUG`.

---

### P3 — POLISH

#### 10. Replace Print Statements with os.log
**Files:** Multiple (DonationService, ScreenTimeManager, DonationConfirmationView, AuthenticationService, etc.)
**Problem:** Heavy use of `print()` throughout. These appear in device console for release builds with no log level filtering.
**Fix:** Replace with `Logger` from `os.log` (already used in `ShieldActionExtension`). Use `.debug` for development, `.info` for important events, `.error` for failures. Create a shared `Logger` extension or constant for the app subsystem.

---

#### 11. Improve DoomButton Disabled State Visibility
**File:** `DoomButton.swift`
**Problem:** Disabled opacity (0.65) combined with color opacity (0.45) makes disabled and enabled states nearly identical visually.
**Fix:** Increase differentiation: drop disabled opacity to 0.3, or change the button color to gray when disabled, or add a strikethrough effect.

---

## WEBSITE ITEMS — FOR WEB CODEX THREAD

Copy these into your scrolltoll-web Codex thread separately.

### P0 — LAUNCH BLOCKER

#### W1. Create Privacy Policy & Terms of Service Pages
**File:** `src/app/page.tsx:949,956`
**Problem:** Footer "Privacy" and "Terms" links are `mailto:` links, not actual pages. Apple requires published, accessible Privacy Policy and Terms for App Store submission.
**Fix:** Create `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` with actual legal content. Update footer links from `mailto:` to `/privacy` and `/terms`. Include sections on: data collection (screen time, email via Firebase Auth, payment info via Stripe), data sharing (Stripe, Every.org/Change.io, Firebase), user rights, contact (`hello@scrolltoll.me`). Plain-language is fine — doesn't need to be lawyer-drafted for v1.

---

### P1 — PRE-SUBMISSION

#### W2. Standardize Email to hello@scrolltoll.me
**File:** `src/app/deck/page.tsx:803,815`
**Problem:** Investor deck uses `hello@scrolltoll.com` while main site uses `hello@scrolltoll.me`. The confirmed domain is `scrolltoll.me`.
**Fix:** Replace all `hello@scrolltoll.com` with `hello@scrolltoll.me` in `deck/page.tsx`. Search entire codebase for `scrolltoll.com` and update.

---

#### W3. Add App Store Download Links
**Problem:** No download CTAs on the website.
**Fix:** Add "Coming Soon to the App Store" badge in hero section. When the app is approved, update with real App Store link. Add a dedicated download/CTA section above the footer.

---

### P2 — PRE-LAUNCH

#### W4. Add OG Image for Social Sharing
**File:** `src/app/layout.tsx:27-33`
**Problem:** No OpenGraph or Twitter Card image. Shared links show no preview.
**Fix:** Create a 1200x630 OG image (troll + logo + tagline on dark #0A0A0A background with neon green accent). Save as `public/og-image.png`. Add `images: [{ url: '/og-image.png', width: 1200, height: 630 }]` to the `openGraph` config and add `twitter.images` in layout metadata.

---

#### W5. Add robots.txt, sitemap.xml, and Canonical URL
**Fix:** Create `public/robots.txt` (allow all). Create `app/sitemap.ts` using Next.js built-in sitemap generation. Add `alternates: { canonical: 'https://scrolltoll.me' }` to layout metadata.

---

#### W6. Replace Fake Waitlist Counter with Real Data
**Problem:** Counter starts at 1247, increments randomly. Not connected to any database.
**Fix:** Connect to Firebase Firestore (project already exists: `scrolltoll-238a6`) to store real waitlist count, or remove the counter and use a static "Join others" message. Firebase is already configured so Firestore is the simplest path.

---

#### W7. Add Accessibility Improvements
**Fix:** Add `aria-expanded` to FAQ toggles, `aria-label` to the range slider, `role="img" aria-label="..."` to emoji icons, and a text fallback for the hero video.

---

#### W8. Optimize Hero Video
**Problem:** `troll2.mp4` is 1.5MB with no lazy loading.
**Fix:** Compress to <500KB, add WebM source variant, add poster image for loading state.

---

#### W9. Use Tailwind Color Tokens Consistently
**Problem:** 180+ hardcoded hex values like `bg-[#141432]` instead of Tailwind tokens. Background is `#000000` but spec is `#0A0A0A`.
**Fix:** Replace hardcoded values with Tailwind tokens from `tailwind.config.ts`. Update `globals.css` background.

---

#### W10. Add Custom 404 Page
**Fix:** Create `app/not-found.tsx` with troll-themed messaging and link back to home.

---

#### W11. Add Schema.org Structured Data
**Fix:** Add JSON-LD for `FAQPage`, `SoftwareApplication`, and `Organization` schemas.

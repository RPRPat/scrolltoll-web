# ScrollToll Full Audit v5 — iOS App + Website
**Date:** March 16, 2026 | **Status:** Updated after Firebase Auth implementation

---

## How to Use This List

Each item is a self-contained Codex prompt. Copy the block, paste into Codex, and it has everything it needs. Items are ordered by priority — work top to bottom.

**Severity key:** P0 = launch blocker, P1 = fix before App Store submission, P2 = fix before public launch, P3 = polish/nice-to-have

---

## TIER 1 — LAUNCH BLOCKERS (P0)

### 1. [iOS] Real Stripe Integration — Remove Mock Payment Method IDs
**Files:** `FirstTimePaymentSheet.swift:173`, `PaymentSetupView.swift:267`
**Problem:** Both files generate mock `pm_test_...` payment method IDs instead of real Stripe API calls. These IDs don't exist in Stripe and will fail in production.
**Fix:** Replace mock ID generation with actual Stripe SDK `STPPaymentMethodParams` creation and confirmation flow. The `StripeService.swift` file has TODO comments at lines 33, 62, 93 saying "MOVE TO SERVER" — this is the same issue. Client-side card handling violates PCI compliance.
**Scope:** This is a backend + client refactor. At minimum, create a server endpoint that accepts a payment method nonce and returns a confirmed payment method ID.

---

### 2. [iOS] Implement Charity Disbursement via Every.org
**File:** `DonationService.swift:155`
**Problem:** TODO comment: "Integrate with Every.org or Change API". Donations are recorded locally and Stripe charges the user, but funds are never actually sent to the selected charity. The platform fee is taken but the charity amount sits in limbo.
**Fix:** Integrate Every.org's donation API to disburse the charity portion after successful Stripe charge. This is the core value prop of the app — without it, you're charging users and not donating.

---

### 3. [WEB] Create Privacy Policy & Terms of Service Pages
**File:** `src/app/page.tsx:949,956`
**Problem:** Footer "Privacy" and "Terms" links point to `mailto:hello@scrolltoll.me?subject=Privacy%20Policy` — they open an email compose window instead of actual legal documents. Apple requires published, accessible Privacy Policy and Terms for App Store submission. GDPR/CCPA also require this.
**Fix:** Create `/privacy` and `/terms` routes in the Next.js app directory with actual legal content. Update footer links. These don't need to be perfect legal documents yet — even a clear, honest plain-language version is better than a mailto link. Include sections covering: data collection (screen time monitoring, email, payment info), data sharing (Stripe, Every.org, Firebase), user rights, and contact info (`hello@scrolltoll.me`).

---

## TIER 2 — PRE-SUBMISSION (P1)

### 4. [iOS] Remove Test Card Credentials from Onboarding UI
**File:** `PaymentSetupView.swift:103`
**Problem:** Shows `4242 4242 4242 4242 | Exp: 12/26 | CVC: 123` directly in the UI. This is Stripe's test card number. Must be removed or hidden behind `#if DEBUG` before any TestFlight or App Store build.
**Fix:** Wrap the test card display in `#if DEBUG` or remove entirely. Consider a subtle debug-only banner instead.

---

### 5. [iOS] Disable `forceUSTaxExperience` Before Release
**File:** `AppSettings.swift:7`
**Problem:** `forceUSTaxExperience = true` with a TODO comment "Set to false before release." Forces all users (including non-US) to see US-specific tax deduction messaging. Misleading for international users.
**Fix:** Set to `false`. Add proper geo-detection or let users set their country in settings. At minimum, don't show US tax claims to non-US users.

---

### 6. [WEB] Standardize Email to hello@scrolltoll.me Everywhere
**Files:** `src/app/deck/page.tsx:803,815`
**Problem:** Investor deck still uses `hello@scrolltoll.com`. The confirmed email is `hello@scrolltoll.me`. Investors could be emailing a black hole.
**Fix:** Replace all instances of `hello@scrolltoll.com` with `hello@scrolltoll.me` in `deck/page.tsx`. Search the entire codebase for any other `scrolltoll.com` references and update them.

---

### 7. [WEB] Add App Store Download Links
**Problem:** No Apple App Store or Google Play Store links anywhere on the site. Users who visit the marketing page have no way to download the app.
**Fix:** Add App Store badge + link in hero section and a dedicated download section. Can start as "Coming Soon to the App Store" with the waitlist, then update when approved.

---

## TIER 3 — PRE-LAUNCH POLISH (P2)

### 8. [iOS] Fix Void/Troll Metaphor Inconsistency in Onboarding
**File:** `PaymentSetupView.swift:124,147,167`
**Problem:** Onboarding payment view uses "THE VOID" metaphor ("CARD ACCEPTED BY THE VOID", "THE VOID CONSUMES", "THE VOID REJECTS") while the rest of the app consistently uses "THE TROLL." SettingsView correctly says "TROLL SETTINGS."
**Fix:** Replace all "VOID" references in PaymentSetupView with troll equivalents: "THE TROLL ACCEPTS YOUR OFFERING", "THE TROLL FEEDS", "THE TROLL REJECTS YOUR OFFERING."

---

### 9. [iOS] Fix Misleading Copy in Payment Sheets
**Files:** `FirstTimePaymentSheet.swift:70`, `PaymentSetupView.swift:215`
**Problem:**
- Line 70: "Change amount or charity in Settings" — implies subscription management
- Line 215: Alert says "manually initiate donations" — no such feature exists
**Fix:** Line 70 → "You choose the amount each time the troll appears." Line 215 → "You can add a payment method later in Settings."

---

### 10. [iOS] Add Visual Feedback for Button Activation Delays
**Files:** `DonationConfirmGateView.swift:80-85`, `FirstTimePaymentSheet.swift:127-132`
**Problem:** Both views delay button activation (500ms and 1s respectively) to prevent accidental taps, but there's no visual indicator. Button appears clickable but doesn't respond, which feels broken.
**Fix:** Add a subtle countdown animation, pulsing glow, or brief "loading" state that transitions to the enabled state. Even changing opacity from 0.3 → 1.0 with animation would help.

---

### 11. [iOS] Persist Duplicate Donation Protection
**File:** `DonationService.swift:27-38`
**Problem:** 10-second minimum interval between donations only stored in memory. If app crashes and restarts mid-cycle, the protection is lost and a duplicate charge could occur.
**Fix:** Store `lastDonationTimestamp` in UserDefaults (shared app group). Check on `processDonation()` entry. The existing dedup error code 1999 is good — just make the timestamp persistent.

---

### 12. [WEB] Add OG Image for Social Sharing
**File:** `src/app/layout.tsx:27-33`
**Problem:** `openGraph` metadata has no `image` property. `twitter.image` also undefined. When someone shares the ScrollToll link on Twitter/LinkedIn/iMessage, there's no preview image — just text.
**Fix:** Create a 1200x630 OG image (troll + logo + tagline on dark background with neon green accent). Add to `public/og-image.png`. Add `images: [{ url: '/og-image.png', width: 1200, height: 630 }]` to openGraph config and `twitter.images`.

---

### 13. [WEB] Add robots.txt, sitemap.xml, and canonical URL
**Problem:** No `robots.txt`, no `sitemap.xml`, no canonical URL tag. Hurts SEO indexing. Could cause duplicate content issues if site is accessible at both www and non-www.
**Fix:** Add `public/robots.txt` allowing all crawlers. Generate `sitemap.xml` (Next.js has built-in support via `app/sitemap.ts`). Add `alternates: { canonical: 'https://scrolltoll.me' }` to layout metadata.

---

### 14. [WEB] Replace Fake Waitlist Counter with Real Data
**File:** `src/app/page.tsx` (WaitlistCounter component, ~lines 801-827)
**Problem:** Counter starts at 1247, increments randomly every 25 seconds with 30% probability. Not connected to any database. Users may feel misled if they realize it's fake.
**Fix:** Either connect to a real counter (Firebase Firestore is already available since you have a Firebase project — use it) or remove the counter entirely. A static "Join X+ others" with a real number is more trustworthy.

---

### 15. [WEB] Add Accessibility Improvements
**Files:** `src/app/page.tsx` (throughout)
**Problem:** FAQ toggle buttons missing `aria-expanded`, range slider missing `aria-label`, emoji icons (🏠, 🔒, 🥘) not accessible to screen readers. Video autoplay has no fallback text.
**Fix:** Add `aria-expanded={isOpen}` to FAQ toggles. Add `aria-label="Triggers per week"` to slider. Wrap emojis in `<span role="img" aria-label="...">`. Add `<track>` or text alternative for video.

---

### 16. [iOS] Add Card Management to Settings
**Problem:** Users can save a card during onboarding/first payment, but there's no way to view, update, or remove their saved card. Copy in multiple places references "Settings" for card management, but SettingsView has no card section.
**Fix:** Add a "Payment Method" section to SettingsView showing last 4 digits, card brand, and options to update or remove. This goes naturally below the new account/email section that was just added with Firebase Auth.

---

### 17. [iOS] Fix Weekly Donation Reset Reliability
**File:** `DonationStore.swift:99-105`
**Problem:** `checkWeeklyReset()` only runs on `reloadFromDefaults()`. If the app stays in memory for over a week without being killed, the weekly counter never resets.
**Fix:** Add a date check on every `recordDonation()` call, or schedule a background task. Simplest fix: check `lastResetDate` at the start of `recordDonation()` and reset if stale.

---

### 18. [iOS] Featured Charity Logos Still Nil
**File:** `CharityPickerView.swift:91-101`
**Problem:** Featured charities explicitly set `logoUrl: nil`, causing placeholder pink hearts instead of real charity logos. The `FeaturedCharity` struct (lines 388-391) only has `name` and `slug` — no `logoUrl` field.
**Fix:** Add `logoUrl` field to `FeaturedCharity` struct. Populate with actual logo URLs from Every.org CDN (format: `https://every.org/cdn-cgi/image/width=100/<slug>/logo`). Update the featured charities list with real URLs.

---

## TIER 4 — POLISH (P3)

### 19. [iOS] Unify "Charged" → "Donated" Copy
**File:** `PaymentSetupView.swift:40`
**Problem:** Uses word "charged" (negative connotation) instead of "donated" or "contributed."
**Fix:** Change to "donated" — aligns with charity/impact tone.

---

### 20. [iOS] Wrap Debug Gesture in #if DEBUG
**File:** `DashboardView.swift:26`
**Problem:** Triple-tap gesture to show debug logs exists in release builds. The log panel itself is behind `#if DEBUG` (line 116), but the gesture isn't. Users can trigger it and nothing happens — confusing.
**Fix:** Wrap the `.onTapGesture(count: 3)` in `#if DEBUG`.

---

### 21. [iOS] Replace Print Statements with os.log
**Files:** Multiple (DonationService, ScreenTimeManager, DonationConfirmationView, AuthenticationService, etc.)
**Problem:** Heavy use of `print()` throughout. These show in device console for release builds and offer no log level filtering.
**Fix:** Replace with `Logger` from `os.log` (already used in ShieldActionExtension). Use `.debug` for development, `.info` for important events, `.error` for failures.

---

### 22. [iOS] Improve DoomButton Disabled State Visibility
**File:** `DoomButton.swift:26,30`
**Problem:** Disabled opacity (0.65) combined with color opacity (0.45) makes disabled state nearly indistinguishable from enabled. Users may think buttons are broken.
**Fix:** Use stronger visual differentiation — gray out the button, add strikethrough, or drop opacity to 0.3.

---

### 23. [WEB] Optimize Hero Video Loading
**File:** `src/app/page.tsx:91-104`
**Problem:** `troll2.mp4` is 1.5MB, autoplays immediately with no lazy loading or format alternatives. Slow on mobile connections.
**Fix:** Compress video further (target <500KB). Add WebM variant as `<source>`. Consider lazy loading or poster image that shows while video loads.

---

### 24. [WEB] Use Tailwind Color Tokens Consistently
**Files:** `src/app/page.tsx` (throughout), `tailwind.config.ts`
**Problem:** Tailwind config defines custom colors (`dark-card`, `toxic-yellow`) but code uses hardcoded hex values like `bg-[#141432]` in 180+ places. Background uses `#000000` in CSS but spec calls for `#0A0A0A`.
**Fix:** Replace hardcoded hex values with Tailwind tokens. Update `globals.css` background to `#0A0A0A`. This makes future brand updates a single config change.

---

### 25. [WEB] Add Custom 404 Page
**Problem:** No custom error page. Users hitting invalid URLs see default Next.js error.
**Fix:** Create `app/not-found.tsx` with troll-themed messaging ("The troll can't find what you're looking for") and a link back to home.

---

### 26. [WEB] Add Schema.org Structured Data
**Problem:** No JSON-LD markup. Missing opportunity for Google rich snippets and Knowledge Panel.
**Fix:** Add `FAQPage` schema for the FAQ section. Add `SoftwareApplication` schema for the app. Add `Organization` schema for ScrollToll/Rock Paper Reality.

---

## What's Already Done (Codex Completed)

These items from previous audits are confirmed implemented in the current codebase:

- ✅ **Firebase Auth + Apple Sign In + Google Sign In** — Full authentication service, onboarding sign-in step, email wired to Stripe customer creation, sign out in Settings
- ✅ `FirebaseApp.configure()` in `DoomForGoodApp.swift` init
- ✅ `AuthenticationService.swift` with Apple + Google sign-in
- ✅ `AppleSignInButton.swift` and `GoogleSignInButton.swift` components
- ✅ `SignInStepView.swift` in onboarding flow
- ✅ `userEmail` property added to `AppSettings.swift` with persistence
- ✅ `FirstTimePaymentSheet.swift` now uses `AppSettings.shared.userEmail` instead of hardcoded `"mortal@doomforgood.app"`
- ✅ `DonationConfirmationView.swift` shows conditional tax receipt messaging
- ✅ `SettingsView.swift` shows signed-in email + sign out button
- ✅ Google Sign In URL scheme + `GIDSignIn.sharedInstance.handle(url)` in `onOpenURL`
- ✅ Payment confirmation gate (`DonationConfirmGateView`) — returning users see confirm/skip before charge
- ✅ Button reorder on confirmation screen (SHARE primary, BACK secondary)
- ✅ Processing copy updated ("The troll is collecting your toll.")
- ✅ Tax badge truncation fix (VStack layout)
- ✅ Dashboard LATEST IMPACT card with charity name, meals, last donation
- ✅ Clear shields confirmation dialog
- ✅ Shield action breadcrumbs for debugging
- ✅ Progress bar debug logging
- ✅ Notification includes donation amount
- ✅ Dual notification scheduling (immediate + 2s backup)
- ✅ `DonationShieldView` deferred payment sheet outcome pattern (fixes layering bug)

---

## Recommended Execution Order

**Now (Quick Wins):** Items 3, 4, 5, 6, 7, 8, 9 — copy fixes, config toggles, legal pages. All fast Codex tasks.
**Next Sprint:** Items 1, 2 — Stripe production integration + Every.org disbursement. Biggest lift, most critical.
**Then:** Items 10-18 — UX polish + web SEO improvements.
**Ongoing:** Items 19-26 — polish as time allows.

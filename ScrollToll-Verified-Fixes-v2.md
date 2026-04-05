# ScrollToll — Verified Fix List (Claude + Codex Aligned)

This prompt reflects the combined analysis of a frame-by-frame video audit (Claude) cross-checked against current branch code (Codex). Items previously flagged that are already fixed have been removed. Only verified remaining issues are listed.

---

## P1 — FIX FIRST

### 1. Payment-to-Processing Transition (Visual Break)
**Source:** Video evidence + Codex code confirmation
**What happens:** When the user taps "PAY $5 AND SAVE CARD", the processing overlay ("PROCESSING THE TOLL" with troll + spinner) appears while the payment form and keyboard are still visible beneath it. Both screens stack visually.
**Root cause:** `FirstTimePaymentSheet.swift:193` calls `dismiss()` and immediately runs `onPaymentSaved()`, while `DonationShieldView.swift:104` starts the processing state from that callback. The payment sheet hasn't finished its dismiss animation before the processing overlay appears.
**Fix:** Sequence the transition cleanly:
1. Dismiss keyboard
2. Dismiss payment sheet fully (wait for dismiss completion)
3. THEN trigger processing state / show opaque processing overlay
**This is the highest-confidence remaining UX break.**

### 2. Shield Action Observability
**Source:** Codex code review
**What happens:** The shield "FEED THE VOID" button DOES work — `ShieldActionExtension.swift:38` fires the `openPayment` notification intent and the app consumes it. But extension logs don't appear in the app console, making it look broken during debugging.
**Fix:** Add breadcrumb logging to shared UserDefaults when the shield action button is tapped (timestamp + action type). The main app can read these on foreground and surface them in debug logs. This proves button taps explicitly during device testing without reworking the fallback mechanism.

---

## P2 — COPY FIXES (All verified still in code)

### 3. "Cancel anytime in Settings" — Wrong
**Location:** `FirstTimePaymentSheet.swift:69`
**Problem:** ScrollToll is not a subscription. There's nothing to cancel.
**Fix:** Replace with "Change amount or charity in Settings" or "You're always in control"

### 4. "Tax-deductible donati..." — Truncated
**Location:** `TaxSavingsCardView.swift:141`
**Problem:** "Tax-deductible donation · Receipt from Every.org" runs together on one row and truncates.
**Fix:** Either shorten to "Tax-deductible · Receipt from Every.org" or allow the line to wrap to a second row.

### 5. "VOID SETTINGS" Heading — Inconsistent Metaphor
**Location:** `SettingsView.swift:17`
**Problem:** Every other screen uses "troll" language. This says "void."
**Fix:** Change to "TROLL SETTINGS" or remove the sub-heading entirely (nav title "SETTINGS" is sufficient).

### 6. Processing Subtitle — Awkward
**Location:** `DonationShieldView.swift:36`
**Problem:** "Your donation is being prepared for the troll." — Donations aren't "prepared for" the troll.
**Fix:** "The troll is collecting your toll." or simply "Processing your donation..."

---

## P2 — UI POLISH (Verified still needed)

### 7. Featured Charities Use Placeholder Hearts, Not Real Logos
**Location:** `CharityPickerView.swift:97`
**Problem:** Curated featured charities (Feeding America, World Food Program USA, No Kid Hungry) explicitly set `logoUrl: nil`, so they show generic pink heart icons. The "MORE CHARITIES" section below them shows real logos from Every.org.
**Fix:** Either bundle real logos as local assets for featured charities, or populate `logoUrl` with the correct Every.org CDN URLs for each.

### 8. Progress Bar Display (NOT Architecture)
**Status:** The architecture is already correct — DeviceActivity milestone events + shared-default polling are implemented in `ScreenTimeManager.swift:236/246` and `DeviceActivityMonitorExtension.swift:31`.
**Remaining problem:** The dashboard progress bar visually stays at "UNDER 25% • ~0 min / 15 min" even while the monitor extension IS reporting progress events in the logs (about halfway → almost there → LIMIT REACHED). This is a display/polling bug on the dashboard side, not an architecture issue.
**Fix:** Verify that the dashboard view is actually reading the shared UserDefaults values written by the monitor extension. The polling timer may not be triggering UI updates, or the key names may not match.

---

## P3 — NICE TO HAVE

### 9. Dashboard Post-Donation Context
After a successful donation, the dashboard shows TOLL COLLECTED $5 but no charity name, last donation time, or impact summary. Adding even one line ("Last: $5 → Feeding America") would improve the emotional reward loop.

### 10. Shield Button Copy
"FEED THE VOID" is inconsistent with the troll metaphor. Consider "PAY THE TOLL" or "FEED THE TROLL."

### 11. Confirmation Button Priority
"SHARE YOUR IMPACT" (hot pink) should arguably be the primary neon green button if viral sharing is the goal. "BACK TO THE BRIDGE" (currently purple) should be secondary.

### 12. Trash Button on Dashboard
No label, no confirmation dialog. Needs at minimum an accessibility hint and a confirmation alert.

---

## NEEDS DEVICE VERIFICATION (Cannot confirm from video or code alone)

### A. "CLOSE & PAY LATER" Skip Path
What happens when user taps the secondary shield button? Does the shield return on next app open? Is the skip recorded? Needs explicit on-device test.

### B. "Custom..." Time Limit
The custom time option was not exercised in the recording. Verify it shows a proper input and validates (min 5 min, reasonable max).

### C. Debug Section in Release Build
`Developer Tools` section in Settings is visible in the recording (dev build). Verify it's wrapped with `#if DEBUG` so it's hidden in release/TestFlight builds.

---

## CONFIRMED WORKING (Do Not Regress)
1. Shield timing — shield only clears after donation confirmation dismissal (DoomForGoodApp.swift:161)
2. Shield button — openPayment notification fires from ShieldActionExtension.swift:38
3. Share sheet — populated via ImpactShareRenderer.swift:25
4. Progress bar architecture — milestone events + shared-default polling already implemented
5. Full onboarding flow (8 steps, end-to-end)
6. FamilyControls authorization + auto-advance
7. App picker, time limit presets, charity search/selection
8. Tax savings calculator math ($5 × ~2/week × 52 = $520/yr, ~$114/yr)
9. Stripe test payment flow
10. Donation confirmation with meals provided + tax receipt note
11. Monitoring re-arms after donation
12. Push notification with correct copy and icon

# ScrollToll iOS App — Bug Fix Prompt (Prioritized)

You are working on the ScrollToll iOS app (Swift 5.9+, SwiftUI, iOS 16+, MVVM). The app uses Apple's FamilyControls, DeviceActivity, and ManagedSettings frameworks with three extensions (Monitor, Shield, ShieldAction) sharing data via App Group UserDefaults.

Fix the following bugs in priority order. Do NOT modify: `SharedDefaults.swift`, `StripeService.swift`, `DonationService.swift`, or onboarding views.

---

## PHASE 1 — CORE LOOP BREAKERS (fix these first)

### BUG-2B: Shield Auto-Clears Before Payment Completion
**Severity:** Critical — breaks the entire donation loop
**What happens:** Shield clears ~4 seconds after app foregrounds, BEFORE user finishes entering payment info in the Stripe sheet.
**Logs show:** `donationProcessing → immediately clear shield` — shield clear logic fires on `.donationProcessing` state instead of waiting for Stripe confirmation.
**Fix:**
- Shield must only clear when cycle state reaches `.completed` (Stripe charge confirmed) or `.skipped`
- Shield must remain active while the Stripe payment sheet is showing
- Do NOT clear shield on `.donationProcessing` — that state means "payment in progress, wait"
- Test: Open monitored app → hit threshold → shield appears → tap pay → Stripe sheet opens → shield should stay up until payment succeeds or user explicitly skips

### BUG-2: Shield "FEED THE VOID" Button Does Nothing
**Severity:** Critical — user has no way to initiate payment from shield
**What happens:** Tapping the button on the shield overlay has zero effect. No logs from ShieldActionDelegate.
**Root cause:** Apple's `ShieldActionDelegate` has extremely limited capabilities — `self.open(url)` is unreliable.
**Fix — Three-Layer Notification Fallback:**
1. **Local Notification (Primary):** In ShieldActionExtension, write the current cycle state to shared UserDefaults, then schedule a local notification that fires in ~1 second. Notification tap opens the app to the payment screen.
2. **URL Scheme (Secondary):** Keep `scrolltoll://donate` as a fallback attempt via `self.open(url)`.
3. **Foreground Detection (Tertiary):** The main app already detects return to foreground and picks up cycle state — this is the safety net.
- Ensure notification permissions are requested during onboarding
- Test: Shield appears → tap "FEED THE VOID" → notification appears within 1-2 seconds → tapping notification opens payment screen

---

## PHASE 2 — QUICK WINS

### BUG-0: Settings Screen Navigation Bar Overlap
**What happens:** Nav bar shows overlapping text — "SAVE T...LD" behind "SETTINGS" title.
**Fix:** Check for NavigationStack/NavigationView title conflict or toolbar items leaking from a parent view. Hide parent toolbar items or set an explicit `.navigationTitle("SETTINGS")` and `.navigationBarTitleDisplayMode(.large)` on the Settings view.

### BUG-1: "SHARE YOUR IMPACT" Button Opens Empty Share Sheet
**What happens:** iOS share sheet appears with no content — blank body, no text or link.
**Fix:** Populate the `activityItems` array with a share string like:
`"I just donated $[amount] to [charity] by doomscrolling. Turn your screen time into meals at scrolltoll.me"`
Use `ShareLink` (SwiftUI) or `UIActivityViewController` with the populated string.

### BUG-5: Settings Threshold Shows Debug Value (10 SEC)
**What happens:** Settings displays "THRESHOLD: 10 SEC" with slider at minimum, even when user selected 15 minutes in onboarding.
**Fix:**
- Read the user's actual threshold from AppSettings / shared UserDefaults (the value set during onboarding)
- Display in human-readable format: "15 MIN" not "900 SEC"
- When the 10-second debug toggle is active, show a visible warning badge next to the threshold value so it's obvious we're in test mode

### BUG-6: Debug Log Visible to End Users
**What happens:** Debug log output may be visible on dashboard and settings screens in release builds.
**Fix:** Wrap all debug log UI with `#if DEBUG` compiler directive. Verify this is applied everywhere debug output renders.

### COPY-1: Rename "TOTAL VOID FED"
**What happens:** Label is grammatically awkward — the void isn't what's being fed, the troll is.
**Fix:** Change to "TOLL COLLECTED" (ties to ScrollToll brand). Alternatives if you prefer: "TOTAL DONATED" or "TROLL FOOD".

---

## PHASE 3 — MEDIUM EFFORT

### BUG-7: Shield Troll Icon Is Tiny
**What happens:** Troll on shield screen is ~40pt due to Apple's `ShieldConfiguration.icon` fixed size constraint.
**Fix:**
- Create a cropped `troll-face` image asset (just the head, square crop)
- Add to the Shield extension's `Assets.xcassets` (not just the main app bundle)
- Reference in `ShieldConfigurationExtension.swift`: `icon: UIImage(named: "troll-face")`
- Provide @3x resolution — minimum 180×180pt

### BUG-4: App Icon Is Still Placeholder
**What happens:** Home screen and share sheet show a colorful cat/creature icon instead of the ScrollToll troll.
**Fix:** Replace `Assets.xcassets → AppIcon` with the proper troll icon in all required sizes per Apple's spec.

---

## PHASE 4 — ARCHITECTURAL

### BUG-3: Progress Bar Uses Wall-Clock Timer, Not Actual App Usage
**What happens:** Dashboard shows "UNDER 25% • ~0 sec / 10 sec" incrementing in real time regardless of whether the user is actually in the monitored app.
**Root cause:** Uses `Timer.scheduledTimer` counting elapsed wall-clock time from monitoring start.
**Fix:**
1. Remove the client-side timer entirely
2. Use DeviceActivity event callbacks (`progress_25`, `progress_50`, `progress_75`, `threshold_reached`)
3. In the Monitor Extension: write progress milestones to shared UserDefaults when each event fires
4. Dashboard reads from shared UserDefaults every 2-3 seconds — display progress based on what the extension reports, don't calculate it locally
- This is a bigger refactor. The progress bar should reflect actual screen time usage as reported by Apple's framework, not a local countdown.

### COPY-3: Time Limit Context Missing
**What happens:** "HOW LONG BEFORE THE TROLL WAKES UP?" screen has no explanation of what the time limit means.
**Fix:** Add subtitle text below the heading: "Daily limit — resets each morning"

---

## DO NOT REGRESS — Confirmed Working Features
These all work correctly. Do not break them:
1. Troll image on onboarding carousel page 1 and dashboard
2. Grant Access auto-advance after FamilyControls authorization
3. "WAITING FOR APPROVAL..." button state during system auth dialog
4. Payment screen trust elements (encryption badge, tax-deductible, Every.org)
5. Donation confirmation layout
6. "BACK TO THE BRIDGE" button (not truncated)
7. Proper pluralization ("1 app monitored")
8. Stripe payment flow end-to-end
9. Shield renders with "THE TROLL DEMANDS PAYMENT" and visible buttons
10. Developer Tools in Settings (10-sec toggle + RESET ONBOARDING)
11. Yellow warning banner for dev test mode
12. Settings shows MANAGED APPS, MONITORING STATUS, ACTIVE SHIELDS

---

## Architecture Notes
- **Three extensions** share data via App Group UserDefaults: `DoomForGoodMonitor` (DeviceActivity), `DoomForGoodShield` (ManagedSettings), `DoomForGoodShieldAction` (ShieldAction)
- **Payment flow:** Stripe (custom integration) → Every.org (charity disbursement, 501(c)(3), tax receipts)
- **Fee split:** ~90% charity / ~7% ScrollToll / ~3% Every.org
- **The app is free.** Donations are encouraged but never required. There is no subscription.

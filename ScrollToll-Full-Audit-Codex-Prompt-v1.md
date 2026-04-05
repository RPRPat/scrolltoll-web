# ScrollToll iOS App — Full UX/UI/Bug Audit & Fix Prompt

Based on a frame-by-frame analysis of a complete end-to-end screen recording (2m31s) plus runtime logs. This covers the entire flow: onboarding → dashboard → settings → app switch → shield trigger → notification → payment → confirmation → return to dashboard.

You are working on the ScrollToll iOS app (Swift 5.9+, SwiftUI, iOS 16+, MVVM). The app uses Apple's FamilyControls, DeviceActivity, and ManagedSettings frameworks with three extensions (Monitor, Shield, ShieldAction) sharing data via App Group UserDefaults.

---

## PHASE 1 — CRITICAL BUGS (Core Loop Breakers)

### BUG-SHIELD-BUTTON: "FEED THE VOID" Button Does Nothing
**Evidence:** In the recording, the user taps "FEED THE VOID" on the shield screen and nothing happens. The notification ("The Troll Is Hungry — Tap to complete your donation and continue scrolling") DOES appear on the home screen, but it is NOT triggered by the button tap — it fires independently.
**Logs confirm:** No ShieldActionDelegate logs appear when the button is tapped.
**Required fix — Three-Layer Notification Fallback:**
1. **Local Notification (Primary):** In `ShieldActionExtension.swift`, when the user taps the primary button, write the current cycle state to shared UserDefaults AND schedule a local notification that fires in ~1 second with title "The Troll Is Hungry" and body "Tap to complete your donation and continue scrolling." The notification tap must open the app to the payment screen.
2. **URL Scheme (Secondary):** Also attempt `scrolltoll://donate` via `self.open(url)` as a fallback.
3. **Foreground Detection (Tertiary):** The main app already detects return to foreground and picks up cycle state — this is the existing safety net.
**Test:** Shield appears → tap "FEED THE VOID" → notification appears within 1-2 seconds → tapping notification opens payment screen.

### BUG-PROCESSING-LAYERING: "Processing" Overlay Shows Behind Payment Form
**Evidence:** At the moment of payment processing, both the "PROCESSING THE TOLL" overlay (with troll image and spinner) AND the underlying "THE TROLL IS HUNGRY" payment form (with card details and keyboard) are visible simultaneously. The processing view appears to render on top but does not fully obscure the payment form — you can see both screens stacked.
**Required fix:** When the payment is submitted:
1. Dismiss the keyboard immediately
2. Dismiss or fully hide the payment card entry view
3. THEN present the "PROCESSING THE TOLL" overlay as a full-screen opaque view
4. The processing screen should completely cover everything beneath it — no bleed-through
**Test:** Tap "PAY $5 AND SAVE CARD" → keyboard disappears → payment form disappears → full-screen processing overlay with troll + spinner → transitions to confirmation.

### BUG-SHIELD-TIMING: Shield Clears Before Payment Completion (BUG-2B)
**Evidence from logs:** `donationProcessing → immediately clear shield` — the shield clear logic fires on `.donationProcessing` state instead of waiting for Stripe confirmation.
**Required fix:**
- Shield must ONLY clear when cycle reaches `.completed` (Stripe charge confirmed) or `.skipped`
- Shield must remain active while the Stripe payment sheet is showing
- Do NOT clear shield on `.donationProcessing` — that means "payment in progress, wait"

---

## PHASE 2 — UI/UX ISSUES (Visible in Recording)

### UX-SHIELD-EMPTY: Shield Screen Is Too Sparse
**Evidence:** The shield screen has a tiny troll icon (~40pt), the title "THE TROLL DEMANDS PAYMENT", subtitle text, then a massive empty gap before the two buttons at the bottom. The screen feels empty and unprofessional.
**Required fixes:**
1. **Troll icon too small:** Create a cropped `troll-face` image asset (head only, square, @3x at 180×180pt minimum). Add to Shield extension's `Assets.xcassets`. Use in `ShieldConfigurationExtension.swift` as the icon.
2. **Layout:** If Apple's ShieldConfiguration allows it, explore adding the donation amount and charity name to the shield subtitle (e.g., "$5.00 → Feeding America"). The more context on the shield, the better the conversion.
3. **Button copy:** "FEED THE VOID" is inconsistent with the troll metaphor used everywhere else. Consider "PAY THE TOLL" or "FEED THE TROLL" for consistency. The secondary button "CLOSE & PAY LATER" is fine.

### UX-FEATURED-CHARITY-LOGOS: Featured Charities Show Generic Heart Icons
**Evidence:** On Step 5 "WHO DOES THE TROLL SERVE?", the three Featured charities (Feeding America, World Food Program USA, No Kid Hungry) all show identical pink heart icons in green circles instead of their actual organization logos. Only the "MORE CHARITIES" section below shows real logos pulled from Every.org.
**Required fix:** For featured/curated charities, either:
1. Bundle their actual logos as local assets (preferred for fast load)
2. Or use the `logoUrl` from Every.org's API response (same as MORE CHARITIES section)
The featured charities are the most important — they should look the most polished, not the least.

### UX-PROGRESS-BAR-FAKE: Progress Bar Never Moves
**Evidence:** Dashboard shows "UNDER 25% • ~0 min / 15 min" and the progress bar stays at 0% the entire time. After switching to test mode it shows "UNDER 25% • ~0 sec / 10 sec" — still at 0%. The bar never fills even when the user is actively scrolling Instagram for ~30 seconds before the shield triggers.
**Root cause:** Uses a local `Timer.scheduledTimer` counting wall-clock time, which doesn't actually track real screen time. And even that timer doesn't seem to update the UI.
**Required fix (architectural):**
1. Remove the client-side timer entirely
2. Use DeviceActivity event callbacks (`progress_25`, `progress_50`, `progress_75`, `threshold_reached`)
3. In the Monitor Extension: write progress milestones to shared UserDefaults when each event fires
4. Dashboard reads from shared UserDefaults every 2-3 seconds and updates the bar accordingly
5. Show meaningful intermediate states: "UNDER 25%", "HALFWAY", "ALMOST THERE", "LIMIT REACHED"
**Note:** The logs DO show these events firing correctly: `Usage progress: about halfway`, `Usage progress: almost there`, `Usage progress: LIMIT REACHED` — so the extension IS reporting progress. The dashboard just isn't reading and displaying it.

### UX-DASHBOARD-INFO: Dashboard Lacks Post-Donation Context
**Evidence:** After a successful $5 donation to Feeding America, the dashboard shows TOLL COLLECTED $5 but nothing else. No charity name, no "last donated" timestamp, no streak count, no impact summary.
**Required fix:** Add a card or section below TOLL COLLECTED showing:
- Charity name (e.g., "Supporting: Feeding America")
- Last donation (e.g., "Last toll: $5 • 2 min ago")
- Cumulative impact (e.g., "2 meals provided so far")
This gives the user an emotional reward every time they return to the dashboard.

### UX-TRASH-BUTTON-UNCLEAR: Trash Icon Button Has No Label or Confirmation
**Evidence:** Next to the STOP button on the dashboard, there's a pink trash icon button. It has no label, no tooltip, and (from the recording) no visible confirmation dialog when tapped. It's unclear whether it stops monitoring, clears donation history, removes selected apps, or something else.
**Required fix:**
1. Add a label or accessibility hint (e.g., "Reset" or show a label on long-press)
2. When tapped, show a confirmation alert explaining what will be deleted/reset
3. Consider whether this button is even needed on the main dashboard — it might be better in Settings

### UX-ONBOARDING-LENGTH: 8 Steps Is Long
**Evidence:** The onboarding is 8 steps: (1) Troll intro, (2) Privacy/access explanation, (3) App picker, (4) Time limit + toll amount, (5) Charity selection, (6) Notification permission, (7) Review summary, (8) Celebration. That's a lot before the user sees value.
**Recommendation (not a blocker):** Consider combining steps or deferring some:
- Steps 1+2 could be one screen (troll intro with privacy bullets below)
- Step 6 (notifications) could be deferred to first shield trigger instead of upfront
- This would reduce to 6 steps, which is more standard

---

## PHASE 3 — COPY FIXES

### COPY-CANCEL: "Cancel anytime in Settings" Is Wrong
**Evidence:** On the payment screen, one of the trust badges says "Cancel anytime in Settings". But ScrollToll is NOT a subscription. The app is free. Donations are voluntary per-trigger, not recurring.
**Required fix:** Replace "Cancel anytime in Settings" with something accurate like:
- "Change amount or charity in Settings"
- "Adjust your toll anytime"
- "You're always in control"

### COPY-VOID-VS-TROLL: Inconsistent Metaphor
**Evidence:** The app uses "troll" everywhere (feeds the troll, troll demands payment, troll is pleased, troll is hungry, troll wakes up) EXCEPT:
- Shield button: "FEED THE VOID"
- Settings heading: "VOID SETTINGS"
- Dashboard label was "TOTAL VOID FED" (may have been renamed to "TOLL COLLECTED" already)
**Required fix:**
- Shield primary button: Change "FEED THE VOID" → "PAY THE TOLL" or "FEED THE TROLL"
- Settings heading: Change "VOID SETTINGS" → "TROLL SETTINGS" or just remove the sub-heading (nav title "SETTINGS" is sufficient)

### COPY-TAX-TRUNCATED: "Tax-deductible donati..." Truncated on Payment Screen
**Evidence:** On the payment screen trust badges, the text "Tax-deductible donation" is cut off as "Tax-deductible donati..." with "· Receipt from Every.org" running into it.
**Required fix:** Either:
1. Shorten to "Tax-deductible" (remove "donation" — it's implied)
2. Or allow the line to wrap properly
3. Or use a smaller font size for this trust badge row

### COPY-PROCESSING: "Your donation is being prepared for the troll" — Awkward
**Evidence:** The processing screen says "Your donation is being prepared for the troll." Donations aren't "prepared for" the troll — the troll collects them.
**Better alternative:** "The troll is collecting your toll." or "Processing your donation..." (simpler)

---

## PHASE 4 — POLISH & DESIGN

### DESIGN-APP-ICON: Verify App Icon
**Evidence:** The home screen shows the ScrollToll icon — white background with the green troll character. It's recognizable but the white background feels out of brand with the dark app aesthetic.
**Recommendation:** Consider a dark/black background version of the icon to match the app's doom aesthetic. Or at minimum verify the icon meets Apple's size requirements at all resolutions.

### DESIGN-FEATURED-GLOW: Featured Charity Selection Glow
**Evidence:** When Feeding America is selected on the charity screen, it gets a green border/glow. This is good — but the unselected featured charities look flat compared to the glow cards used elsewhere in the app.
**Recommendation:** Apply the same GlowCard treatment to charity cards for consistency.

### DESIGN-CONFIRMATION-BUTTONS: Button Color Hierarchy on Confirmation Screen
**Evidence:** The confirmation screen "THE TROLL IS PLEASED" has two buttons: "BACK TO THE BRIDGE" (purple) and "SHARE YOUR IMPACT" (hot pink). The primary action should be the most prominent. If you want users to share (for viral growth), SHARE should be the primary color (neon green) and BACK TO THE BRIDGE should be secondary.
**Required fix:** Swap button emphasis — make SHARE YOUR IMPACT the neon green primary button, and BACK TO THE BRIDGE the secondary/outline button.

### DESIGN-NOTIFICATION-STYLE: Notification Copy & Icon
**Evidence:** The push notification shows: title "The Troll Is Hungry", body "Tap to complete your donation and continue scrolling." with the troll as the app icon. This is good.
**Polish:** Consider adding the amount and charity to the notification body: "Tap to donate $5.00 to Feeding America and continue scrolling."

---

## PHASE 5 — SETTINGS IMPROVEMENTS

### SETTINGS-NAV: Navigation Bar Overlap (BUG-0)
**Evidence:** In this recording, the Settings nav bar shows "SETTINGS" title cleanly with a back chevron. The previous bug report mentioned overlapping "SAVE T...LD" text behind the title. This may be intermittent or already partially fixed.
**Required fix:** Verify there's no toolbar item bleed from parent views. Set explicit `.navigationTitle("SETTINGS")` and `.navigationBarTitleDisplayMode(.large)` on the Settings view. Test on multiple device sizes.

### SETTINGS-THRESHOLD-SLIDER: Slider Position Doesn't Match Value
**Evidence:** Settings shows "15 MIN" as the threshold value, but the slider thumb is positioned at the far left (minimum). When test mode is enabled (10-second toggle ON), the threshold card shows a warning message "Developer test mode is enabled. DeviceActivity still uses a 10-second override." — this is good.
**Required fix:**
1. The slider position must visually match the selected value (15 min should be ~25% from left if range is e.g. 5-60 min)
2. Verify the slider's value binding is correct

### SETTINGS-DEBUG-VISIBLE: Developer Tools Section Visibility
**Evidence:** The Developer Tools section (10-Second Test Threshold toggle + RESET ONBOARDING) is visible in this recording because it's a development build.
**Required fix:** Wrap the entire Developer Tools section with `#if DEBUG` compiler directive so it's hidden from release builds. The test mode toggle and reset onboarding should never be visible to end users.

---

## PHASE 6 — FUNCTIONAL GAPS

### GAP-SHARE-EMPTY: "SHARE YOUR IMPACT" Button Opens Empty Share Sheet
**Evidence from previous testing:** The share button presents an iOS share sheet with no content.
**Required fix:** Populate activityItems with:
```
"I just donated $5.00 to Feeding America by doomscrolling 🧌 Turn your screen time into meals at scrolltoll.me"
```
Use `ShareLink` or `UIActivityViewController` with the formatted string + optional app URL.

### GAP-SKIP-FLOW: What Happens When User Taps "CLOSE & PAY LATER"?
**Evidence:** The shield has a secondary button "CLOSE & PAY LATER" but the recording doesn't show this path being exercised.
**Required verification:** Ensure this flow:
1. Closes the shield (or goes back to the shielded app?)
2. Records that the user skipped this cycle
3. The shield comes back on next app open (or stays persistent?)
4. There's a clear way to come back and pay later
Document and test this flow end-to-end.

### GAP-CUSTOM-TIME: "Custom..." Time Limit Option
**Evidence:** Step 4 shows time presets (15 min, 30 min, 1 hour, 2 hours) plus a "Custom..." option. The recording doesn't test this, but the option exists.
**Required verification:** Ensure tapping "Custom..." shows a proper input (picker, slider, or text field) and validates the entered value (minimum 5 minutes, maximum reasonable).

---

## SUMMARY — PRIORITY ORDER FOR IMPLEMENTATION

**Must fix before launch:**
1. BUG-SHIELD-BUTTON — Shield button does nothing (core loop breaker)
2. BUG-SHIELD-TIMING — Shield auto-clears before payment (core loop breaker)
3. BUG-PROCESSING-LAYERING — Processing overlay shows behind payment form (looks broken)
4. COPY-CANCEL — "Cancel anytime" is wrong (misleading for a non-subscription)
5. GAP-SHARE-EMPTY — Share button is empty (kills viral loop)
6. SETTINGS-DEBUG-VISIBLE — Developer tools visible to users (embarrassing in production)

**Should fix before launch:**
7. UX-SHIELD-EMPTY — Shield screen too sparse / tiny troll icon
8. UX-FEATURED-CHARITY-LOGOS — Featured charities show generic hearts not real logos
9. COPY-VOID-VS-TROLL — Inconsistent metaphor (void vs troll)
10. COPY-TAX-TRUNCATED — Trust badge text truncated
11. UX-PROGRESS-BAR-FAKE — Progress bar never moves
12. UX-DASHBOARD-INFO — No post-donation context on dashboard
13. SETTINGS-THRESHOLD-SLIDER — Slider position wrong

**Nice to have:**
14. UX-TRASH-BUTTON-UNCLEAR — Trash button needs label/confirmation
15. DESIGN-CONFIRMATION-BUTTONS — Swap button emphasis for viral sharing
16. DESIGN-NOTIFICATION-STYLE — Add amount+charity to notification
17. COPY-PROCESSING — Awkward processing copy
18. UX-ONBOARDING-LENGTH — Consider reducing steps
19. DESIGN-APP-ICON — Consider dark background icon

---

## DO NOT REGRESS — Confirmed Working
These all work correctly in the recording. Do not break them:
1. Full onboarding flow completes end-to-end (8 steps)
2. Troll image renders on onboarding and dashboard
3. FamilyControls authorization and auto-advance works
4. "WAITING FOR APPROVAL..." button state works during system dialog
5. App picker loads and saves selection correctly
6. Time limit presets work with "Daily limit — resets each morning" subtitle present
7. Tax savings calculator shows correct math ($5 × ~2/week × 52 = $520/yr, ~$114/yr)
8. Charity search and category filtering works (Hunger, Education, Climate, Health tabs)
9. Featured charities section with selection glow works
10. Review/summary screen shows correct values
11. Confetti celebration on "THE TROLL IS AWAKE!" works
12. Dashboard shows monitoring status, app count, toll collected
13. Settings shows threshold, managed apps, monitoring status, active shields
14. 10-second test mode toggle works and shows warning banner
15. Stripe test payment flow completes (card entry → processing → success)
16. Donation confirmation shows amount, charity, meals provided, tax receipt note
17. "BACK TO THE BRIDGE" returns to dashboard correctly
18. Monitoring re-arms after donation completion
19. STOP button works on dashboard
20. Push notification fires with correct troll icon and copy

## Architecture Notes
- **Three extensions** share data via App Group UserDefaults: `DoomForGoodMonitor`, `DoomForGoodShield`, `DoomForGoodShieldAction`
- **Payment flow:** Stripe (custom integration) → Every.org (charity disbursement, 501(c)(3), tax receipts)
- **Fee split:** ~90% charity / ~7% ScrollToll / ~3% Every.org
- **The app is free.** Donations are encouraged but never required. There is no subscription.
- **Currently in Stripe TEST mode** — all charges are simulated

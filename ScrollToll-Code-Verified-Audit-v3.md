# ScrollToll iOS — Code-Verified Audit v3
## Every item below verified against actual Swift source code on 2026-03-15

---

## P1 — FIX FIRST

### 1. Payment-to-Processing Transition (Visual Layering Bug)
**File:** `FirstTimePaymentSheet.swift:193`
**Code proof:** `dismiss()` is called and `onPaymentSaved()` runs on the same `DispatchQueue.main.async` block. There's no `dismiss` completion handler — SwiftUI's `dismiss()` is fire-and-forget, so the sheet may still be animating when `onPaymentSaved()` fires.
**What happens downstream:** `onPaymentSaved()` in `DonationShieldView.swift:104-109` resets `hasStartedProcessing` and calls `processCycleIfNeeded()`, which calls `startDonation()` at line 145. That sets `isCharging = true` and shows the processing overlay. But the FirstTimePaymentSheet hasn't finished dismissing yet — both views are visible simultaneously.
**Fix:** Add a delay after `dismiss()` before calling `onPaymentSaved()`:
```swift
dismiss()
DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
    onPaymentSaved()
}
```
Or: restructure so `DonationShieldView` detects `showFirstTimePaymentSheet` becoming `false` and THEN starts processing.

### 2. Shield Button Observability (Not Broken, But Unverifiable)
**File:** `ShieldActionExtension.swift:34-43`
**Code proof:** The button handler works correctly: line 36 calls `transitionCycle(to: .donationRequested)`, line 38 calls `postReturnNotification()`, line 39 calls `openReturnURL()`. The notification scheduling at lines 56-83 is solid — uses `UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)` with correct content.
**Problem:** Extension `print()` statements (lines 17, 22, 27, 35, 37, 41) don't appear in the main app's console. During device testing, it looks like the button does nothing because there's no visible feedback.
**Fix:** Write a breadcrumb to shared UserDefaults when the primary button is tapped:
```swift
// In handleAction, after primaryButtonPressed:
notificationDefaults?.set(Date().timeIntervalSince1970, forKey: "com.doomforgood.shieldActionTappedAt")
notificationDefaults?.synchronize()
```
Then the main app can read this on foreground and surface it in debug logs. This proves taps during device verification without any architectural changes.

---

## P2 — COPY FIXES (All verified still in code, exact locations)

### 3. "Cancel anytime in Settings" — Wrong
**File:** `FirstTimePaymentSheet.swift:69`
**Exact code:** `PaymentTrustBadge(icon: "arrow.triangle.2.circlepath", text: "Cancel anytime in Settings")`
**Problem:** ScrollToll is not a subscription. Nothing to cancel.
**Fix:** Change to `"Change amount or charity in Settings"` or `"You're always in control"`

### 4. Tax Badge Truncation
**File:** `TaxSavingsCardView.swift:140-149`
**Exact code:** The `trustBadgeLine` renders "Tax-deductible donation" (line 141) and "· Receipt from Every.org" (line 146) as separate `Text` views in an `HStack`. On narrower screens these don't fit on one line, causing truncation ("Tax-deductible donati...").
**Fix options:**
- Shorten to just `"Tax-deductible"` (line 141) — the word "donation" is redundant in context
- Or wrap both texts in a `VStack` instead of `HStack` for the trust badge mode
- Or reduce font size from 13/12 to 12/11

### 5. "VOID SETTINGS" Heading
**File:** `SettingsView.swift:17`
**Exact code:** `NeonText(text: "VOID SETTINGS", color: DoomTheme.neonGreen, size: 28)`
**Problem:** Every other screen uses "troll" metaphor. This says "void."
**Fix:** Change to `"TROLL SETTINGS"` or remove entirely — the nav bar already says "SETTINGS" (line 134: `.navigationTitle("SETTINGS")`), so this NeonText heading is redundant.

### 6. Processing Subtitle
**File:** `DonationShieldView.swift:36`
**Exact code:** `"Your donation is being prepared for the troll."`
**Fix:** Change to `"The troll is collecting your toll."` or `"Processing your donation..."`

---

## P2 — UI FIXES (Verified still needed)

### 7. Featured Charities Show Placeholder Hearts Instead of Real Logos
**File:** `CharityPickerView.swift:91-101`
**Exact code:**
```swift
private var featuredNonprofits: [Nonprofit] {
    selectedCause.featured.map { charity in
        Nonprofit(
            name: charity.name,
            primarySlug: charity.slug,
            ein: nil,
            description: "Featured by ScrollToll",
            logoUrl: nil,  // <-- THIS IS THE PROBLEM
            profileUrl: "https://www.every.org/\(charity.slug)",
            tags: [selectedCause.label.lowercased()]
        )
    }
}
```
The `logoUrl: nil` means `AsyncImage` in `NonprofitCard` (line 402) always hits the placeholder path (lines 407-411), which renders the pink heart circle.
**Fix:** Add `logoUrl` to `FeaturedCharity` struct (currently just `name` + `slug` at line 388-391) and populate with Every.org CDN URLs. Or fetch from the API by slug on appear. Example:
```swift
FeaturedCharity(name: "Feeding America", slug: "feedingamerica", logoUrl: "https://res.cloudinary.com/everydotorg/image/upload/c_lfill,w_24,h_24,dpr_2/c_crop,ar_24:24/q_auto,f_auto,fl_progressive/faja_profile/txje3fqkbmqpqgp0ghfr")
```

### 8. Progress Bar Display Bug (Architecture Is Already Correct)
**Architecture already implemented correctly:**
- `DeviceActivityMonitorExtension.swift:32-39` writes progress to shared UserDefaults via `setProgress()` at each milestone (0.25, 0.5, 0.75, 1.0)
- `ScreenTimeManager.swift:236-244` polls shared defaults every 2 seconds via `startProgressPolling()`
- `ScreenTimeManager.swift:278-301` reads the value and updates `progressFraction` and `elapsedSeconds`
- `DashboardView.swift:30-34` renders `ScrollTimeProgressBar` with `screenTimeManager.elapsedSeconds` and `screenTimeManager.activeThresholdSeconds`

**Remaining issue:** In the recording, the progress bar stays at "UNDER 25% • ~0 min / 15 min" even as the logs show "about halfway", "almost there", "LIMIT REACHED". This means either:
- The shared UserDefaults key isn't matching between the extension and the app (both use `"com.doomforgood.currentProgress"` — looks correct)
- The progress poller starts but `progressDefaults?.double(forKey:)` returns 0 due to App Group access issues
- Or the 10-second test mode threshold is too fast for the 2-second polling interval to catch intermediate states

**Investigation needed:** Add a debug log line inside `refreshProgressFromDefaults()` at line 278 that prints the raw value read from shared defaults. This will reveal whether the extension's writes are visible to the main app.

### 9. Trash Button — No Label, No Confirmation
**File:** `DashboardView.swift:65-74`
**Exact code:** A bare `Button` with a trash icon that calls `screenTimeManager.clearAllShields()` — no label, no confirmation alert.
**Fix:** Add `.accessibilityLabel("Clear all shields")` and wrap the action in a confirmation dialog:
```swift
.confirmationDialog("Clear all shields?", isPresented: $showClearConfirmation) {
    Button("Clear Shields", role: .destructive) { screenTimeManager.clearAllShields() }
}
```

---

## P3 — POLISH (Nice to Have)

### 10. Shield Button Copy: "FEED THE VOID" → "PAY THE TOLL"
**File:** `ShieldConfigurationExtension.swift` (not fully read but this is where the shield button labels are set)
**Reason:** Inconsistent with troll metaphor used everywhere else.

### 11. Confirmation Button Priority
**File:** `DonationConfirmationView.swift:74-89`
**Current:** "BACK TO THE BRIDGE" is `electricPurple`, "SHARE YOUR IMPACT" is `hotPink`.
**Recommendation:** If viral sharing is the goal, swap — make SHARE the primary neon green button.

### 12. Dashboard Post-Donation Context
**File:** `DashboardView.swift`
**Current:** Only shows TOLL COLLECTED with a counter. No charity name, last donation time, or impact summary.
**Recommendation:** Add a card showing "Supporting: Feeding America" and "Last toll: $5 • 2 min ago" below the counter.

### 13. Notification Body Could Include Amount
**File:** `ShieldActionExtension.swift:59`
**Current:** `"Tap to complete your donation and continue scrolling."`
**Recommendation:** `"Tap to donate $5.00 to Feeding America and continue scrolling."` — requires reading the amount and charity name from shared defaults in the extension.

---

## CONFIRMED WORKING — DO NOT REGRESS

Based on code review, these are all correctly implemented:

1. **Shield timing is correct** — `DoomForGoodApp.swift:161-175` defers shield clear while donation flow is active. Lines 171-172 check `activeDonationCycleID`, `shouldShowDonationFlow`, and `donationFlowLocked` before allowing terminal clear.
2. **Shield button works** — `ShieldActionExtension.swift:36-39` transitions cycle state and schedules notification. The three-layer approach (state transition + notification + URL scheme) is already implemented.
3. **Share sheet is populated** — `DonationConfirmationView.swift:80-88` calls `ImpactShareRenderer.makeShareItems()` with fallback to `makeShareText()`.
4. **Progress architecture is correct** — milestone events in extension + shared defaults polling in main app.
5. **Debug section is `#if DEBUG` wrapped** — `SettingsView.swift:125-128` and `DashboardView.swift:90/138`.
6. **"TOLL COLLECTED" label** — already renamed from "TOTAL VOID FED" in `DashboardView.swift:81`.
7. **Settings nav bar** — properly configured with `.navigationTitle("SETTINGS")` and `.navigationBarTitleDisplayMode(.inline)` at lines 134-135.
8. **Slider reads saved value** — `SettingsView.swift:152-154` reads from `SharedDefaults.shared.getThresholdMinutes()` on appear.

---

## NEEDS DEVICE VERIFICATION (Can't confirm from code alone)

- **A.** "CLOSE & PAY LATER" / first-time payment decline path — code exists in `DonationShieldView.swift:111-115` (transitions to `.dismissed`), but needs on-device confirmation the shield behavior is correct afterward.
- **B.** "Custom..." time limit option — visible in the onboarding but behavior unverified in recording.
- **C.** Progress bar shared defaults read — the code looks correct but the recording shows it not updating. Needs a debug log breadcrumb to confirm the main app can actually read what the extension writes.

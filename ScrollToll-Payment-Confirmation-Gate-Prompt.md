# ScrollToll — Add Payment Confirmation for Returning Users

## The Problem
When a returning user (card already on file) taps the notification or returns to the app during an active shield cycle, the payment is processed **immediately** with no confirmation. The user sees "PROCESSING THE TOLL" as the first screen — the charge has already started.

**Current flow (returning user):**
Notification tap → App opens → `DonationShieldView` appears → `processCycleIfNeeded()` checks `hasPaymentMethodOnFile()` → `startDonation()` fires immediately → Card is charged → Confirmation shown after the fact.

**Risk:** Accidental notification taps, shield misfires, or user confusion = unwanted charges = refund requests = Stripe disputes = potential account issues.

## The Fix
Add a confirmation step between app open and payment processing for returning users. This screen should be fast, clear, and impossible to accidentally confirm.

### New Screen: `DonationConfirmGateView`

**What it shows:**
```
[Troll image]

THE TROLL DEMANDS $5.00

→ Feeding America
Card ending in •••• 4242

[PAY THE TOLL — $5.00]     (neon green, primary)
[SKIP THIS TIME]            (text button, secondary)
```

**Key requirements:**

1. **Show amount, charity, and last 4 digits of card** — user must see exactly what they're paying and how before confirming
2. **Primary button: "PAY THE TOLL — $[amount]"** — explicit, includes dollar amount in the button itself
3. **Secondary button: "SKIP THIS TIME"** — transitions cycle to `.dismissed`, returns to dashboard. No charge.
4. **No auto-charge** — `startDonation()` must NOT be called until the user taps the primary button
5. **Delay primary button by 0.5s** — prevent accidental instant taps (same pattern used on `FirstTimePaymentSheet` where `canDecline` enables after 1s delay)

### Where to Insert

In `DonationShieldView.swift`, modify `processCycleIfNeeded()`:

```swift
@MainActor
private func processCycleIfNeeded() async {
    guard !hasStartedProcessing else { return }
    guard let cycle = SharedDefaults.shared.readShieldCycle(),
          cycle.cycleID == cycleID,
          cycle.state == .donationProcessing else {
        return
    }

    guard DonationService.shared.hasPaymentMethodOnFile() else {
        showFirstTimePaymentSheet = true
        isCharging = false
        return
    }

    // NEW: Don't charge yet — show confirmation gate
    showConfirmationGate = true
    isCharging = false
}
```

Add a new `@State private var showConfirmationGate = false` and present the gate view. When user confirms → call `startDonation()`. When user skips → transition to `.dismissed` and call `onComplete?()`.

### What the Processing Screen Becomes
The "PROCESSING THE TOLL" screen (current `DonationShieldView` body) only appears AFTER the user confirms. So the flow becomes:

**New flow (returning user):**
Notification tap → App opens → Confirmation gate ("PAY THE TOLL — $5.00" / "SKIP THIS TIME") → User taps Pay → Processing spinner → Stripe charge → "THE TROLL IS PLEASED" confirmation

**New flow (first-time user):**
Unchanged — still shows `FirstTimePaymentSheet` with card entry.

### Card Info Display
To show "Card ending in •••• 4242", read from `AppSettings.shared.stripePaymentMethodId` or store the last 4 digits when the card is saved in `FirstTimePaymentSheet.swift`. If last 4 aren't stored, just show "Your saved card" instead — still better than auto-charging.

### Copy Notes
- Button text must include the dollar amount: "PAY THE TOLL — $5.00" not just "PAY"
- Use the same trust badges from the first-time payment sheet (tax-deductible, encrypted, Every.org)
- Add a line below the skip button: "You can change your toll amount or charity in Settings"
- Keep the troll personality: the heading should be "THE TROLL DEMANDS $5.00" not "Confirm Payment"

### Payment Compliance Considerations
- Every charge requires explicit user action (tap) — not implicit (opening the app)
- The amount must be visible BEFORE the charge, not just after
- Skip/cancel must be available and obvious
- This aligns with Stripe's best practices for saved payment methods and Apple's App Store Review Guidelines (section 3.1.1 — in-app purchases must have clear pricing before confirmation)

### What NOT to Change
- First-time payment flow (already has explicit confirmation via card entry + PAY button)
- Shield timing logic in `DoomForGoodApp.swift`
- Shield action extension
- Donation processing/Stripe integration
- Post-payment confirmation screen

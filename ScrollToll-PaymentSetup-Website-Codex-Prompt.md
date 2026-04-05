# ScrollToll Website — Hosted Payment Setup & Consent Page

## Context

Apple's App Store guidelines prohibit non-nonprofits from collecting charitable donations in-app. ScrollToll's iOS app opens Safari to this page for all payment authorization. This page is the ONLY place where users enter card details.

**This page must handle:**
1. Card-on-file setup via Stripe Checkout (setup mode — no charge)
2. Explicit consent for future off-session charges
3. Full fee disclosure and transparency
4. Cadence disclosure (weekly charges or $10 threshold)
5. Tax receipt and disbursement explanation
6. Pause/cancel terms
7. Redirect back to the app via `scrolltoll://payment-complete`

**Tech stack:** Next.js 14, React 18, Tailwind CSS, TypeScript (existing scrolltoll.me site). Stripe.js for checkout.

---

## Task 1: Create `/setup` Page

**Route:** `src/app/setup/page.tsx`

### URL Parameters (from iOS app)
- `uid` — Firebase user ID
- `charity` — Selected charity name (display only)
- `amount` — Toll amount in dollars (display only for breakdown)

### Page Layout

Use the ScrollToll dark theme (#0A0A0A background, neon green #39FF14, hot pink #FF2E97).

```
┌──────────────────────────────────────────┐
│  [ScrollToll Logo]                        │
│                                           │
│  SET UP YOUR GIVING                       │
│                                           │
│  ┌──────────────────────────────────────┐ │
│  │ HOW IT WORKS                         │ │
│  │                                      │ │
│  │ 1. You set screen time limits        │ │
│  │ 2. When you go over, a toll is       │ │
│  │    added to your Scroll Jar          │ │
│  │ 3. Your jar empties weekly or at     │ │
│  │    $10 — that's when you're charged  │ │
│  │ 4. Your donation goes to [Charity]   │ │
│  │    through Our Change Foundation     │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌──────────────────────────────────────┐ │
│  │ YOUR TOLL BREAKDOWN                  │ │
│  │                                      │ │
│  │ $2.00 per toll                       │ │
│  │ ├── $0.14 platform fee (7%)          │ │
│  │ └── $1.86 charitable donation        │ │
│  │     → [Charity Name]                 │ │
│  │                                      │ │
│  │ Donations received by                │ │
│  │ Our Change Foundation                │ │
│  │ 501(c)(3) • EIN 86-3353394          │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌──────────────────────────────────────┐ │
│  │ ☐ I authorize ScrollToll to charge   │ │
│  │   my saved payment method on a       │ │
│  │   weekly basis (or when my Scroll    │ │
│  │   Jar reaches $10) for toll amounts  │ │
│  │   I incur by exceeding my screen     │ │
│  │   time limits.                       │ │
│  │                                      │ │
│  │ ☐ I understand that each toll        │ │
│  │   includes a 7% platform fee         │ │
│  │   retained by ScrollToll and that    │ │
│  │   the remainder is a charitable      │ │
│  │   contribution to my chosen          │ │
│  │   nonprofit through Our Change       │ │
│  │   Foundation (EIN 86-3353394).       │ │
│  │   Tax receipts will be issued by     │ │
│  │   Our Change Foundation.             │ │
│  └──────────────────────────────────────┘ │
│                                           │
│  ┌──────────────────────────────────────┐ │
│  │  [ SET UP PAYMENT — STRIPE ]         │ │  ← Stripe Checkout button
│  └──────────────────────────────────────┘ │
│                                           │
│  You can pause or cancel giving anytime   │
│  in the ScrollToll app settings.          │
│                                           │
│  Privacy Policy | Terms of Service        │
└──────────────────────────────────────────┘
```

### Consent Checkboxes

**Both checkboxes must be checked before the Stripe button becomes active.** This is not optional — Stripe requires explicit consent for saved-payment future-use flows, and Apple requires disclosure of fund usage.

### Stripe Integration

Use **Stripe Checkout in setup mode** (not payment mode). This saves the card without charging.

```typescript
// API route: src/app/api/create-checkout-session/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { uid, charity, amount } = await request.json();

  // Create or retrieve Stripe customer
  // Check Firestore for existing stripeCustomerId for this uid
  // If none, create new customer

  const session = await stripe.checkout.sessions.create({
    mode: 'setup',  // Setup mode — saves card, does NOT charge
    customer: customerId,
    payment_method_types: ['card'],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/setup/success?session_id={CHECKOUT_SESSION_ID}&uid=${uid}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/setup?uid=${uid}&charity=${charity}&amount=${amount}`,
    metadata: {
      firebaseUid: uid,
      charityName: charity,
      tollAmount: amount,
    },
  });

  return Response.json({ sessionId: session.id, url: session.url });
}
```

### After Successful Setup

The success URL (`/setup/success`) should:

1. Retrieve the Checkout Session to get the SetupIntent and PaymentMethod
2. Write payment details to Firestore (`/users/{uid}`)
3. Show a success message briefly
4. Redirect to `scrolltoll://payment-complete?success=true` to return to the app

```typescript
// src/app/setup/success/page.tsx
// 1. Call API to finalize setup (writes to Firestore)
// 2. Show "✅ Payment method saved!" with ScrollToll branding
// 3. After 2 seconds, redirect to scrolltoll://payment-complete?success=true
// 4. Also show a "Return to ScrollToll" button in case auto-redirect fails
```

### API Route for Success Processing

```typescript
// src/app/api/confirm-setup/route.ts
// 1. Retrieve Checkout Session by session_id
// 2. Get SetupIntent → PaymentMethod details
// 3. Set PaymentMethod as default on Customer
// 4. Write to Firestore: stripeCustomerId, stripePaymentMethodId, stripeCardLast4, stripeCardBrand, hasPaymentSetup: true
// 5. Return success
```

---

## Task 2: Create `/account` Page (Payment Management)

**Route:** `src/app/account/page.tsx`

Opened from the iOS app when user taps "Manage Payment" in settings or Scroll Jar view.

### URL Parameters
- `uid` — Firebase user ID

### Features
- Show current card on file (last4, brand)
- "Update Payment Method" button → new Stripe Checkout session in setup mode
- "Pause Giving" toggle — sets a flag in Firestore, Cloud Function checks before charging
- "Cancel and Remove Card" — removes payment method from Stripe, clears Firestore

---

## Task 3: Environment Variables

Add to `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TApbGHroRPctmXD...
NEXT_PUBLIC_BASE_URL=https://scrolltoll.me
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}  # For Firestore writes
```

The Firebase Admin SDK is needed to write payment status to Firestore from the API routes.

Install dependencies:

```bash
npm install stripe firebase-admin @stripe/stripe-js
```

---

## Task 4: Styling

Match the existing ScrollToll website dark theme:
- Background: `#0A0A0A`
- Cards: `#141414` with subtle border
- Primary text: white
- Accent: `#39FF14` (neon green)
- Secondary accent: `#FF2E97` (hot pink)
- Muted text: `#888888`
- Font: Match existing site fonts

The page should feel like a seamless extension of the app, not a generic Stripe page.

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/app/setup/page.tsx` | Payment setup page with disclosures + Stripe Checkout |
| `src/app/setup/success/page.tsx` | Post-checkout success + redirect to app |
| `src/app/account/page.tsx` | Payment management (update card, pause, cancel) |
| `src/app/api/create-checkout-session/route.ts` | Creates Stripe Checkout session in setup mode |
| `src/app/api/confirm-setup/route.ts` | Writes payment details to Firestore after success |
| `src/app/api/update-payment/route.ts` | Handles payment method updates |
| `src/app/api/cancel-payment/route.ts` | Removes payment method and clears Firestore |

## Files NOT to Modify
- Existing pages (home, privacy, terms, deck)
- Existing components and layouts (unless importing shared theme values)

## Testing Checklist

1. `/setup?uid=xxx&charity=Feeding+America&amount=2` renders correctly
2. Consent checkboxes must both be checked before Stripe button activates
3. Stripe Checkout opens in setup mode (no charge)
4. After card save, Firestore `/users/{uid}` is updated with payment details
5. Success page shows confirmation and redirects to `scrolltoll://payment-complete`
6. "Return to ScrollToll" manual button works if redirect fails
7. `/account?uid=xxx` shows current card and management options
8. "Pause Giving" sets flag in Firestore
9. "Cancel and Remove Card" clears Stripe + Firestore
10. All pages match ScrollToll dark theme
11. Mobile-responsive (users will see this on iPhone Safari)
12. Fee breakdown math is correct (7% platform fee)

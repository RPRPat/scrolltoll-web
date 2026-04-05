# ScrollToll Website V2 — Codex Implementation Prompt

> Update the scrolltoll.me consumer website to reflect the current app, build trust, explain the charity model, add a tax savings calculator, and drive waitlist conversions. All changes are to `src/app/page.tsx` unless noted.

## Context

The site is a Next.js 14 app using Tailwind CSS and Framer Motion. It lives in `/scrolltoll-web`. The existing design uses a doom-metal/neon aesthetic: black background (#000), neon green (#39FF14), hot pink (#FF2E97), electric purple (#BF00FF), toxic yellow (#CCFF00). Fonts: Space Grotesk (heading), Inter (body), JetBrains Mono (mono). There's a reusable `<GlowCard>` component in `src/components/GlowCard.tsx`.

The app is called ScrollToll. It monitors your screen time on social apps, and when you exceed your self-set limit, a troll character appears demanding a small charitable donation ("the toll"). The app is **free to use** — donating is encouraged but never required.

---

## CHANGES TO MAKE

### 1. Nav — Add Section Links

Add inline links to the nav bar (hidden on mobile, visible `sm:` and up) before the "Join Waitlist" button:

- "How It Works" → `#how-it-works`
- "Transparency" → `#where-money-goes`
- "FAQ" → `#faq`

Style: `text-sm text-white/50 hover:text-white transition-colors`

---

### 2. Hero — Add Trust Badges Below CTA

Below the "JOIN THE WAITLIST" button, add three inline trust badges:

- ✓ 100% tax-deductible (US)
- ✓ 90%+ goes to charity
- ✓ Free to use, always

Style: flex wrap, centered, `text-sm text-gray-400`, checkmarks in `text-neon-green`.

**Also update** the subtitle from:
> "Set a screen time limit. Blow past it. Pay the toll. Change a life."

To:
> "Set a screen time limit. Blow past it. Pay the toll. Feed the world."

---

### 3. How It Works — Expand to 4 Steps

Change from 3 steps to 4 steps. Update the section heading and add a subtitle. Add `id="how-it-works"` to the section.

**New heading:** "A Toll Booth for Your Doom Scrolling."
**New subtitle:** "Not a blocker. Not a timer. A toll — with teeth."

**New steps:**

| # | Title | Description |
|---|-------|-------------|
| 01 | Set Your Limit | Choose your daily screen time cap for TikTok, Instagram, X, Reddit — whatever your poison. |
| 02 | The Troll Appears | Blow past your limit and a full-screen shield drops over the app. The troll demands payment. |
| 03 | Pay the Toll | One tap. $2 to a charity you chose. Your guilt becomes someone's groceries, medicine, or clean water. |
| 04 | Keep Scrolling (or Don't) | Shield clears. You're free. But next time you go over, the troll will be back. And hungrier. |

Change grid from `md:grid-cols-3` to `sm:grid-cols-2 lg:grid-cols-4`.

---

### 4. NEW SECTION: "Where Your Money Goes" (after How It Works)

Add `id="where-money-goes"`. This is the most important new section — it builds trust by showing exactly where each dollar goes.

**Section label:** "FULL TRANSPARENCY" (neon-green, mono, uppercase tracking)
**Heading:** "Where Your Money Goes."
**Subtitle:** "Every toll is a real donation to a verified nonprofit. Here's exactly how it breaks down."

**A) Animated fee breakdown bar:**

Show a horizontal stacked bar representing a $2.00 toll:
- 90% green bar → "90% to Charity — $1.80"
- 7% hot-pink bar → "7%"
- 3% purple bar → "3%"

Animate each segment using `motion.div` with `initial={{ width: 0 }}` and `whileInView={{ width: "XX%" }}` with staggered delays.

Below the bar, show a legend:
- 🟩 90% to your chosen charity
- 🟪 7% keeps ScrollToll free for everyone
- 🟣 3% to Every.org (compliance + tax receipts)

**B) Three GlowCards below the bar:**

**Card 1 — "Real Charities"**
You choose from thousands of verified 501(c)(3) nonprofits. Feeding America, Doctors Without Borders, No Kid Hungry, St. Jude — or search for a cause you care about.

**Card 2 — "Powered by Every.org"**
Donations are processed through Every.org, a trusted 501(c)(3) nonprofit platform. They handle disbursement, regulatory compliance, and issue your tax receipts directly. The 3% platform fee covers all of this.

**Card 3 — "Tax-Deductible (US)"**
Every toll is a tax-deductible charitable donation. Thanks to the One Big Beautiful Bill Act, even non-itemizers can now deduct up to $1,000. Every.org sends your receipt automatically.

---

### 5. NEW SECTION: Tax Savings + Impact Calculator (replaces old ScreenTimeCalculator)

**Remove** the existing `ScreenTimeCalculator` component entirely. Replace with a new `TaxSavingsCalculator`.

**Section label:** "YOUR IMPACT + YOUR SAVINGS" (hot-pink)
**Heading:** "See What Your Tolls Actually Do."
**Subtitle:** "Adjust your toll amount and see the real-world impact — plus your estimated tax savings."

**A) Toll amount selector — 4 buttons:**
$1, $2, $5, $10. Default selected: $2. Use state: `const [tollAmount, setTollAmount] = useState(2)`. Active button: `bg-neon-green text-black`. Inactive: `border border-white/15 bg-[#141432] text-white/60`.

**B) Triggers-per-week slider:**
Label: "Times you'll probably exceed your limit per week: **{triggersPerWeek}x**"
Range: 1–7, step 1, default 3.
Left label: "1x (disciplined)" / Right label: "7x (be honest)"
Style the slider track with hot-pink gradient like the existing sliders.

**C) Four result cards (grid, responsive):**

All values are computed live from `tollAmount * triggersPerWeek * 52`:

| Value | Label | Color | Border |
|-------|-------|-------|--------|
| `$annualDonation` | donated per year | white | white/10 |
| `annualDonation * 10` | meals provided* | neon-green | white/10 |
| `~$Math.round(annualDonation * 0.22)` | back on your taxes (US) | neon-green | neon-green/20, bg-[#0d1a0d] |
| `$Math.round(annualDonation - taxSavings)` | actual cost after deduction | hot-pink | hot-pink/20, bg-[#1a0d14] |

**Tax math must match the app's TaxBenefitCalculator:**
- `annualDonation = tollAmount × triggersPerWeek × 52`
- `taxSavings = Math.round(annualDonation × 0.22)` (22% marginal rate — most common US bracket)
- `mealsProvided = Math.round(annualDonation × 10)` (Feeding America's ~10 meals per $1)

**D) Disclaimer text:**
"*Based on Feeding America's estimate of ~10 meals per $1. Tax savings estimated at 22% marginal rate. Receipts issued by Every.org. This is not tax advice."

**E) CTA button:** "MAKE YOUR SCROLLING COUNT →" linking to `#waitlist`

---

### 6. Phone Mockup — Update to Match Current App

Update the phone mockup content to reflect the current app UI:

**Remove:** "LIMIT EXCEEDED" label, "TIME'S UP" heading, "FEED THE VOID — $1.00" button, "I'll stop scrolling (sure you will)" button

**Replace with:**
- Heading: "THE TROLL DEMANDS PAYMENT" (split across two lines)
- Subtext: "You've been on Instagram for 32 minutes past your limit."
- Charity line: "$2.00 → Feeding America" (mono, neon-green)
- Primary button: "PAY THE TOLL — $2.00"
- Secondary button: "CLOSE INSTAGRAM"

Also update the description below the mockup:
"A full-screen shield drops over the app. It shows exactly what you owe and where it goes. One tap donates to charity. Or close the app. Your call."

---

### 7. NEW SECTION: Impact / Social Proof (after Phone Mockup, before Troll Speaks)

**Section label:** "REAL IMPACT" (electric-purple)
**Heading:** "Your Worst Habit. Their Best Day."
**Subtitle:** "Every toll you pay goes to a real, verified nonprofit. You pick which one. Here are some of the charities ScrollToll users can support."

**A) Charity name grid (2 cols mobile, 3 cols desktop):**
- Feeding America
- Doctors Without Borders
- No Kid Hungry
- St. Jude Children's Research Hospital
- charity: water
- World Food Programme

Each in a card: `rounded-xl border border-white/10 bg-[#141432] px-4 py-5 text-center`. Animate on scroll.

**B) "What $2 can do" highlight card:**
Rounded card with neon-green/15 border, bg-[#0a140a]. Three stats side by side:
- 20 meals provided
- 40 liters of clean water
- 1 child fed for a week

Disclaimer: "Estimates based on published charity impact data. Actual impact varies by organization."

---

### 8. NEW SECTION: FAQ (after Troll Speaks, before Waitlist)

Add `id="faq"`. Accordion-style Q&A with expand/collapse animation.

**Section label:** "QUESTIONS" (toxic-yellow)
**Heading:** "Frequently Asked."

**Questions and answers:**

**Q: Where does my money actually go?**
A: 90% goes directly to the charity you choose. 7% keeps ScrollToll free — servers and people cost money, and this is how we keep the app free for everyone without selling your data or showing you ads. 3% goes to Every.org, the nonprofit platform that handles transactions, compliance, and makes your donation tax-deductible.

**Q: Is the app really free?**
A: Yes. ScrollToll is 100% free to download and use. You set your own limits, pick your apps, and see when you go over. Donating when the troll appears is encouraged — that's the whole point — but it's never required. You can always close the app and walk away. The troll will just judge you silently.

**Q: Is my donation tax-deductible?**
A: Yes, for US taxpayers. Every toll is a charitable donation to a verified 501(c)(3) nonprofit. Thanks to the One Big Beautiful Bill Act (2026), even people who take the standard deduction can now deduct up to $1,000 in charitable gifts — meaning ~90% of taxpayers benefit. Every.org issues your tax receipt automatically via email.

**Q: How does the screen time monitoring work?**
A: ScrollToll uses Apple's built-in Screen Time APIs (FamilyControls and DeviceActivity). Your usage data stays on your device — we never see which apps you use or how long you use them. All we know is when you've exceeded the limit you set.

**Q: Can I change my toll amount or charity?**
A: Anytime. Open Settings in the app to change your toll amount ($1, $2, $5, or $10 per trigger), swap your charity, adjust your time limit, or change which apps are monitored. No commitments, no subscriptions.

**Q: What if I don't want to pay when the troll appears?**
A: Tap "Close Instagram" (or whatever app triggered it) and walk away. No charge. The troll doesn't block your phone or hold anything hostage. But next time you go over your limit, it'll be back. And hungrier.

**Q: Is my payment information secure?**
A: Payments are handled entirely by Stripe, one of the world's most trusted payment processors. Your card details never touch ScrollToll's servers. Everything is encrypted with 256-bit SSL.

**Accordion behavior:** Each question is a button with a "+" icon (neon-green) that rotates 45° to become "×" when open. Answer animates in with height/opacity. Only one open at a time. Use `AnimatePresence` for exit animation.

---

### 9. Footer — Expand

Add a tagline: "Turning screen time into impact. One toll at a time."

Add links row below founder names:
- "For Investors" → `/deck`
- "Privacy Policy" → `mailto:hello@scrolltoll.me?subject=Privacy%20Policy`
- "Terms" → `mailto:hello@scrolltoll.me?subject=Terms`

Separated by `|` characters in gray-700.

---

### 10. Final Page Component Order

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-void pb-20 text-white md:pb-0">
      <Nav />
      <Hero />
      <HowItWorks />
      <WhereMoneyGoes />
      <TaxSavingsCalculator />
      <PhoneMockup />
      <ImpactSection />
      <TrollSpeaks />
      <FAQ />
      <Waitlist />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}
```

---

## DO NOT CHANGE

- `src/app/layout.tsx` — metadata, fonts, OG tags
- `src/app/globals.css` — global styles
- `src/components/GlowCard.tsx` — reusable card component
- `src/components/AnimatedSection.tsx` — reusable animation wrapper
- `src/components/CountUp.tsx` — number animation
- `src/app/deck/` — investor page (separate task)
- `public/` assets — troll.png, troll2.mp4, favicon.svg
- Formspree form action URL
- WaitlistCounter component (keep as-is)
- StickyMobileCTA component (keep as-is)
- TrollSpeaks / TrollQuotes components (keep as-is)

## KEY CONSTRAINTS

- Everything stays in `page.tsx` as a single "use client" file (current pattern)
- Use Framer Motion for all scroll animations (already imported)
- Use the existing `<GlowCard>` component for cards
- Maintain the neon-on-dark aesthetic throughout
- All new sections should use `motion.div` with `whileInView` for scroll-triggered animations
- The tax calculator values must update live as the user interacts with buttons/slider
- The app is FREE. There is no subscription. Donations are optional. Do not use language like "cancel anytime" or imply any recurring billing.

# Codex Prompt: ScrollToll Website Updates — Full Pass

## Context
- **Repo:** scrolltoll-web (Next.js 14, React 18, Tailwind CSS, Framer Motion, TypeScript)
- **Domain:** https://scrolltoll.me
- **Contact email:** hello@scrolltoll.me (confirmed, this is the only active email)
- **Design system colors:** Background #0A0A0A (currently #000000 in CSS), Neon Green #39FF14, Hot Pink #FF2E97, Electric Purple #BF00FF, Toxic Yellow #CCFF00
- **Tailwind config:** `tailwind.config.ts` has custom color tokens defined
- **App directory structure:** `src/app/` contains `page.tsx`, `layout.tsx`, `globals.css`, `deck/` (investor deck)
- **Current footer** (in `page.tsx` ~line 925-968): Privacy and Terms links are `mailto:` links, not actual pages

## What to Build — In This Order

---

### 1. Create Privacy Policy Page (`/privacy`)

Create `src/app/privacy/page.tsx` with the following content, styled to match the site's dark theme. Use the same fonts, background, and color scheme as the main page.

**Privacy Policy Content:**

```
PRIVACY POLICY
Last updated: March 16, 2026

ScrollToll ("we", "us", "our") is operated by Rock Paper Reality, LLC. This Privacy Policy describes how we collect, use, and protect your information when you use the ScrollToll mobile application and website (scrolltoll.me).

INFORMATION WE COLLECT

Account Information
When you create an account, we collect your email address through Apple Sign In or Google Sign In. We use this to identify your account and deliver tax receipts for your donations.

Screen Time Data
ScrollToll monitors your device screen time usage through Apple's Screen Time API (DeviceActivityFramework). This data stays on your device and is processed locally — we do not collect, transmit, or store your screen time data on our servers. We only know that a donation was triggered, not which apps you were using or for how long.

Payment Information
When you add a payment method, your card details are collected and processed by Stripe, our payment processor. We do not store your full card number. We retain only the last four digits and card brand for display purposes in the app. All payment processing is handled by Stripe in compliance with PCI DSS standards.

Donation Records
We record the date, amount, and recipient charity of each donation you make. This information is used to display your donation history, calculate impact metrics, and generate tax-related summaries.

HOW WE USE YOUR INFORMATION

- To process charitable donations on your behalf
- To deliver tax receipts via our nonprofit giving partner
- To display your donation history and impact in the app
- To send you notifications related to your screen time limits and donations
- To improve the app experience and fix bugs

WHO WE SHARE DATA WITH

Stripe: Payment processing. Stripe receives your card details to process charges. See Stripe's privacy policy at stripe.com/privacy.

Every.org (or equivalent nonprofit giving platform): Charitable donation disbursement. They receive the donation amount, charity selection, and your email (for tax receipts). See every.org/privacy.

Firebase (Google): Authentication and analytics. Google receives your authentication credentials and basic app usage analytics. See Firebase's privacy policy at firebase.google.com/support/privacy.

We do not sell your personal information to anyone. We do not share your data with advertisers.

DATA RETENTION

We retain your account information and donation history for as long as your account is active. You can request deletion of your account and associated data by emailing hello@scrolltoll.me.

YOUR RIGHTS

You may request access to, correction of, or deletion of your personal data at any time by contacting hello@scrolltoll.me. California residents have additional rights under the CCPA. EU residents have additional rights under the GDPR.

CHILDREN'S PRIVACY

ScrollToll is not intended for children under 13. We do not knowingly collect personal information from children under 13.

CHANGES TO THIS POLICY

We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on this page with a revised "Last updated" date.

CONTACT US

If you have questions about this Privacy Policy, contact us at:
hello@scrolltoll.me

Rock Paper Reality, LLC
San Diego, CA
```

**Page styling requirements:**
- Dark background matching the site (#0A0A0A or the void color)
- Same nav bar as main page (ScrollToll logo + links)
- Clean, readable typography using the body font (Inter)
- Headings in the heading font (Space Grotesk), neon green color
- Max width ~700px, centered, with generous padding
- Back to home link at top
- Footer same as main page

---

### 2. Create Terms of Service Page (`/terms`)

Create `src/app/terms/page.tsx` with the following content, same styling as privacy page.

**Terms of Service Content:**

```
TERMS OF SERVICE
Last updated: March 16, 2026

Welcome to ScrollToll. By using our mobile application or website (scrolltoll.me), you agree to these Terms of Service. ScrollToll is operated by Rock Paper Reality, LLC ("we", "us", "our").

THE SERVICE

ScrollToll is a mobile application that monitors your screen time and facilitates charitable micro-donations when you exceed self-set limits. When you surpass your chosen screen time threshold, the app prompts you to make a small donation to a charity of your choice.

ELIGIBILITY

You must be at least 18 years old to use ScrollToll. By using the app, you represent that you are at least 18 years of age and have the legal capacity to enter into these terms.

ACCOUNT REGISTRATION

You may sign in using Apple Sign In or Google Sign In. You are responsible for maintaining the security of your account. You agree to provide accurate information and to update it as needed.

DONATIONS AND PAYMENTS

Voluntary nature: All donations made through ScrollToll are voluntary. You choose your donation amount and can skip any individual toll. ScrollToll does not automatically charge you without your knowledge — returning users with a card on file are shown a confirmation screen before any charge is processed.

Processing: Payments are processed by Stripe. By adding a payment method, you agree to Stripe's terms of service.

Fees: ScrollToll retains approximately 7% of each donation as a platform fee to sustain operations. Approximately 90% goes to your selected charity, and approximately 3% covers payment processing. The exact split is displayed transparently in the app.

Disbursement: Charitable donations are disbursed through our nonprofit giving partner to 501(c)(3) organizations. Tax receipts are provided by the giving partner, not by ScrollToll.

Refunds: Because donations are made to third-party charitable organizations, refunds are generally not available once a donation has been processed and disbursed. If you believe a charge was made in error, contact us at hello@scrolltoll.me within 7 days and we will investigate.

Tax deductibility: Donations made through ScrollToll may be tax-deductible to the extent permitted by law. ScrollToll does not provide tax advice. Consult a tax professional for guidance on your specific situation.

SCREEN TIME MONITORING

ScrollToll uses Apple's Screen Time API (DeviceActivityFramework) to monitor your app usage. This monitoring occurs entirely on your device. You grant permission for this monitoring during onboarding, and you can revoke it at any time through your device's Settings.

ScrollToll does not access, collect, or transmit the specific apps you use or your detailed usage patterns. We only detect when your cumulative usage exceeds the threshold you set.

INTELLECTUAL PROPERTY

All content, design, trademarks, and code comprising ScrollToll are the property of Rock Paper Reality, LLC. You may not copy, modify, distribute, or reverse-engineer any part of the service.

LIMITATION OF LIABILITY

ScrollToll is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you have paid through the app in the 12 months preceding any claim.

We are not responsible for the operations, performance, or policies of third-party charities receiving your donations.

TERMINATION

You may stop using ScrollToll at any time by deleting the app and revoking Screen Time permissions. We may suspend or terminate your account if you violate these terms.

CHANGES TO TERMS

We may update these Terms from time to time. Continued use of ScrollToll after changes constitutes acceptance of the updated terms.

GOVERNING LAW

These terms are governed by the laws of the State of California, without regard to conflict of law principles.

CONTACT US

Questions about these Terms? Contact us at:
hello@scrolltoll.me

Rock Paper Reality, LLC
San Diego, CA
```

---

### 3. Update Footer Links

In `src/app/page.tsx`, update the footer (~lines 948-960) to link to the actual pages instead of mailto:

**Before:**
```tsx
<a
  href="mailto:hello@scrolltoll.me?subject=Privacy%20Policy"
  className="text-xs text-gray-600 transition-colors hover:text-gray-400"
>
  Privacy Policy
</a>
<span className="text-gray-700">|</span>
<a
  href="mailto:hello@scrolltoll.me?subject=Terms"
  className="text-xs text-gray-600 transition-colors hover:text-gray-400"
>
  Terms
</a>
```

**After:**
```tsx
<Link
  href="/privacy"
  className="text-xs text-gray-600 transition-colors hover:text-gray-400"
>
  Privacy Policy
</Link>
<span className="text-gray-700">|</span>
<Link
  href="/terms"
  className="text-xs text-gray-600 transition-colors hover:text-gray-400"
>
  Terms
</Link>
```

Make sure `Link` is imported from `next/link` (it already is at the top of the file).

---

### 4. Standardize Email to hello@scrolltoll.me

In `src/app/deck/page.tsx`, replace all instances of `hello@scrolltoll.com` with `hello@scrolltoll.me`:

- Line 803: `href="mailto:hello@scrolltoll.com"` → `href="mailto:hello@scrolltoll.me"`
- Line 804: `Hello@scrolltoll.com` → `hello@scrolltoll.me`
- Line 815: `href="mailto:hello@scrolltoll.com?subject=Let's%20Feed%20the%20Void"` → `href="mailto:hello@scrolltoll.me?subject=Let's%20Feed%20the%20Void"`

Search the entire codebase for any other `scrolltoll.com` references and update them all.

---

### 5. Add OG Image Metadata

In `src/app/layout.tsx`, update the `openGraph` and `twitter` metadata to include an image:

```tsx
openGraph: {
  title: "ScrollToll — Your Doom Scrolling Feeds the World",
  description: "The app that turns your worst screen time habit into charitable donations.",
  url: "https://scrolltoll.me",
  siteName: "ScrollToll",
  type: "website",
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "ScrollToll — Your Doom Scrolling Feeds the World",
    },
  ],
},
twitter: {
  card: "summary_large_image",
  title: "ScrollToll — Your Doom Scrolling Feeds the World",
  description: "Set a limit. Blow past it. Pay the toll. Change a life.",
  images: ["/og-image.png"],
},
```

Also add canonical URL:
```tsx
alternates: {
  canonical: "https://scrolltoll.me",
},
```

**For the OG image itself:** Create a simple 1200x630 image programmatically or use Next.js OG image generation (`app/opengraph-image.tsx`). The image should have:
- Dark background (#0A0A0A)
- "SCROLLTOLL" in the heading font, with "SCROLL" in neon green (#39FF14) and "TOLL" in hot pink (#FF2E97)
- Tagline: "Your Doom Scrolling Feeds the World" in white
- Clean, minimal — matches the site aesthetic

If generating via `opengraph-image.tsx`, use Next.js ImageResponse API. Otherwise, create a static PNG in the `public/` directory.

---

### 6. Add robots.txt, sitemap, and Canonical URL

**robots.txt:** Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://scrolltoll.me/sitemap.xml
```

**Sitemap:** Create `src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://scrolltoll.me",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://scrolltoll.me/privacy",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://scrolltoll.me/terms",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://scrolltoll.me/deck",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
```

---

### 7. Add Accessibility Improvements

In `src/app/page.tsx`:

**FAQ section:** Add `aria-expanded` to the FAQ toggle buttons. Find the FAQ component and update the button:
```tsx
<button
  onClick={() => setOpen(prev => !prev)}
  aria-expanded={isOpen}
  aria-controls={`faq-answer-${index}`}
>
```

**Range slider (Tax Calculator section):** Add `aria-label`:
```tsx
<input
  type="range"
  aria-label="Number of triggers per week"
  // ... existing props
/>
```

**Hero video:** Add a text alternative:
```tsx
<video autoPlay muted playsInline loop aria-label="Animated troll character">
```

**Emojis:** Where emoji characters are used as icons (🏠, 🔒, 🥘, etc.), wrap them:
```tsx
<span role="img" aria-label="house">🏠</span>
```

---

### 8. Add Custom 404 Page

Create `src/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="font-heading text-6xl font-bold tracking-widest">
        <span className="text-neon-green">4</span>
        <span className="text-hot-pink">0</span>
        <span className="text-electric-purple">4</span>
      </h1>
      <p className="mt-6 font-heading text-xl font-bold text-white">
        THE TROLL CAN&apos;T FIND WHAT YOU&apos;RE LOOKING FOR
      </p>
      <p className="mt-3 text-sm text-gray-500">
        This page doesn&apos;t exist. Maybe you doom-scrolled too far.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-neon-green/30 px-6 py-3 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10 hover:shadow-[0_0_24px_rgba(57,255,20,0.25)]"
      >
        &larr; Back to the Bridge
      </Link>
    </div>
  );
}
```

---

### 9. Add Schema.org Structured Data

In `src/app/layout.tsx`, add JSON-LD structured data inside the `<head>` via a script tag in the body or using Next.js metadata. Add this inside the `<body>` tag:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: "ScrollToll",
          url: "https://scrolltoll.me",
          logo: "https://scrolltoll.me/favicon.svg",
          contactPoint: {
            "@type": "ContactPoint",
            email: "hello@scrolltoll.me",
            contactType: "customer support",
          },
          founder: [
            { "@type": "Person", name: "Pat Johnson" },
            { "@type": "Person", name: "Jon" },
          ],
        },
        {
          "@type": "SoftwareApplication",
          name: "ScrollToll",
          operatingSystem: "iOS",
          applicationCategory: "LifestyleApplication",
          description:
            "The app that turns your worst screen time habit into charitable donations.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      ],
    }),
  }}
/>
```

Also add `FAQPage` schema to the FAQ section data (extract the questions/answers and format as JSON-LD).

---

### 10. Optimize Hero Video Loading

In `src/app/page.tsx`, update the hero video element:

**Before:** (raw `<video>` tag with autoPlay)
**After:**
```tsx
<video
  autoPlay
  muted
  playsInline
  loop
  preload="metadata"
  poster="/troll-poster.jpg"
  aria-label="Animated troll character"
>
  <source src="/troll2.webm" type="video/webm" />
  <source src="/troll2.mp4" type="video/mp4" />
</video>
```

Also: compress `troll2.mp4` to <500KB using ffmpeg (or note this as a manual step if not possible in the codebase). Create a WebM variant if ffmpeg is available. Create a poster JPEG from the first frame.

---

## Files to Create
1. `src/app/privacy/page.tsx` — Privacy Policy page
2. `src/app/terms/page.tsx` — Terms of Service page
3. `src/app/not-found.tsx` — Custom 404 page
4. `src/app/sitemap.ts` — Dynamic sitemap
5. `public/robots.txt` — Robots file
6. `src/app/opengraph-image.tsx` OR `public/og-image.png` — OG image

## Files to Modify
1. `src/app/page.tsx` — Footer links (mailto → Link), accessibility improvements, video optimization
2. `src/app/layout.tsx` — OG image metadata, canonical URL, Schema.org JSON-LD
3. `src/app/deck/page.tsx` — Replace `scrolltoll.com` → `scrolltoll.me` (3 instances)

## Do NOT Change
- The main page layout, hero, calculator, or waitlist functionality
- The investor deck content (only fix the email domain)
- Tailwind config (color token cleanup is a separate task)
- The waitlist counter behavior (separate task)

## Testing
After implementation, verify:
1. `/privacy` renders with full Privacy Policy content, styled to match site
2. `/terms` renders with full Terms of Service content, styled to match site
3. Footer "Privacy Policy" and "Terms" links navigate to actual pages (not mailto)
4. All `scrolltoll.com` references replaced with `scrolltoll.me`
5. OG image appears when sharing link on Twitter/LinkedIn (test with https://www.opengraph.xyz/)
6. `robots.txt` accessible at `/robots.txt`
7. Sitemap accessible at `/sitemap.xml`
8. 404 page renders for invalid URLs (e.g., `/nonexistent`)
9. No accessibility warnings in Lighthouse audit
10. Build passes: `npm run build`

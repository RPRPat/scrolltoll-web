# ScrollToll / DoomForGood — Session Handoff Prompt v2

Copy everything below the line and paste it as your first message in a new Cowork session. Mount both the `DoomForGood` and `scrolltoll-web` folders.

---

## Who I Am

I'm Patrick, CEO of Rock Paper Reality (an AR/XR agency). I'm building **ScrollToll** (codenamed DoomForGood) — an iOS app that converts excess screen time into charitable donations.

## How We Work Together

You analyze bugs/features, write detailed Codex/Cursor prompts, and I run them through AI coding tools → deploy → test on device → report results back. You are my technical co-pilot — think product architect + engineering lead + QA manager rolled into one.

---

## The Product

**ScrollToll** — when you exceed your self-set screen time limit, a shield appears saying "THE TROLL CAUGHT YOU" and you either add a toll to your Scroll Jar or skip. Accumulated tolls donate to charity when you tap DONATE NOW.

**Business model:** Free app. 7% platform fee on each donation. 93% goes to charity via Our Change Foundation (EIN: 86-3353394). No subscriptions, no ads.

**Brand narrative:** A troll lives under your phone screen. When you scroll past your limit, the troll catches you and demands a toll. You can pay (to charity) or skip — but the troll remembers. The Scroll Jar fills up until you donate.

### DoomTheme Colors
- Background: `#0A0A0A`
- Neon Green: `#39FF14`
- Hot Pink: `#FF2E97`
- Electric Purple: `#BF00FF`
- Toxic Yellow: `#CCFF00`
- Text Primary: `#E8E8E8`
- Text Secondary: `#8B8B8B`

---

## Codebase Locations

| What | Folder | Tech |
|------|--------|------|
| iOS App | `DoomForGood/DoomForGood/DoomForGood/` | SwiftUI, Family Controls / Screen Time API |
| Firebase Functions | `DoomForGood/DoomForGood/firebase/functions/` | TypeScript, Cloud Functions |
| Website | `scrolltoll-web/` | Next.js 14, Tailwind CSS, Framer Motion → Vercel |
| Competitive Analysis | `scrolltoll-web/ScrollToll-vs-Opal-Competitive-Analysis.docx` | Full Opal teardown + roadmap |
| QA Prompts | `DoomForGood/ScrollToll-QA-Round*.md` | Markdown prompts for Cursor/Codex |
| Investor Deck | `DoomForGood/ScrollToll-CoFounder-Deck.pptx` | Rebuilt with patched images |

---

## Key Architecture

- **Firebase Cloud Functions** (6 deployed): Stripe webhooks, donation processing, leaderboard aggregation
- **Firestore** for user data, leaderboard entries, friend invites
- **Stripe** for payments: SetupIntents, off-session PaymentIntents, billing portal
- **Change API / Our Change Foundation** for nonprofit charity routing
- **Shield cycle state machine:** shieldApplied → donationRequested → donationProcessing → donationCompleted/dismissed
- **Scroll Jar:** Tolls accumulate, user taps "DONATE NOW" to batch-process all at once

---

## Website Architecture (`scrolltoll-web/`)

**Repo:** https://github.com/RPRPat/scrolltoll-web.git
**Branch:** `main` — latest commit `9c0ab8b` (metadataBase fix for OG/Twitter)
**Deploys:** Vercel (scrolltoll.me)
**Stack:** Next.js 14, React, Tailwind CSS, Framer Motion, Stripe JS, Firebase Admin

### Routes
| Route | Purpose |
|-------|---------|
| `/` (page.tsx) | Homepage — hero with troll video, doom scroll counter, how it works, transparency, leaderboard preview, FAQ, waitlist |
| `/deck` | Investor deck page — status tracker, tech stack, architecture |
| `/account` | User account — Stripe billing portal redirect |
| `/setup` | Payment setup flow |
| `/faq` | Full FAQ page |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

### Components
- `GlowCard.tsx` — reusable glow-on-hover card
- `AnimatedSection.tsx` — scroll-triggered animations
- `CountUp.tsx` — animated number counter

### Untracked Markdown Files (in repo root)
14 audit/prompt markdown files from previous QA rounds and Codex prompt iterations. These are reference docs, not committed to git.

---

## iOS App Key Files

| File | Purpose |
|------|---------|
| `Views/Leaderboard/LeaderboardView.swift` | Main leaderboard screen, podium threshold on line 44 |
| `Views/Leaderboard/LeaderboardPodiumView.swift` | Podium top-3 component (gold/silver/bronze) |
| `Views/Leaderboard/LeaderboardRowView.swift` | Individual row (titles, glow, arrows, share button) |
| `Views/Leaderboard/LeaderboardShareCardView.swift` | Share card renderer (HAS BUGS — see below) |
| `Models/LeaderboardModels.swift` | LeaderboardEntry struct, title(for:metric:) method |
| `Views/Components/GlowCard.swift` | Reusable glow card component |
| `Theme/DoomTheme.swift` | All brand colors |
| `Services/LeaderboardService.swift` | Firestore leaderboard data |

---

## QA Rounds Completed (1–9)

9 rounds of QA prompts shipped. Key features:

- **Rounds 1–7:** Core shield flow, Stripe integration, donation processing, charity selection, onboarding, Family Controls permissions
- **Round 8:** Skip re-arm fix, DONATE NOW button label, fee dedup, Scroll Jar flow polish
- **Round 9:** Leaderboard elevation — podium top-3 view, rank titles (TOP TROLL, SILVER TROLL, etc.), movement arrows, pulsing glow on current user row, SHARE RANK button, share card generation

---

## Known Bugs & Open Items

### 1. Leaderboard Podium — BUILT but hidden in solo testing
`LeaderboardPodiumView.swift` is fully implemented. `LeaderboardView.swift` integrates it. BUT it requires `activeEntries.count >= 3` (line 44). With only one test user, it falls back to flat list.
- **To verify:** Temp change `>= 3` to `>= 1`, build, screenshot, revert.

### 2. Share Card Rendering Bug
Logs show `verify_image_parameters: invalid image bits/pixel or bytes/row` when tapping SHARE RANK. Two root causes:
- `AsyncImage` doesn't work inside `ImageRenderer` (async load = empty at render time)
- `.blur(radius: 7)` on the header crashes ImageRenderer on some devices
- **Fix prompt:** `DoomForGood/ScrollToll-QA-Round9B-ShareCard-Fix.md` — ready to run through Cursor.

### 3. Website — Deployed but verify
Commit `5af28bb` on `main` added leaderboard section, Scroll Jar updates, deck page refresh. Git is synced with `origin/main`. If scrolltoll.me hasn't updated, check Vercel dashboard.

### 4. Investor Deck (PPTX) — Fixed
Original had corrupted images (CRC-32 failures). Replaced 10 image files with neon-green-themed icons. Lives at `DoomForGood/ScrollToll-CoFounder-Deck.pptx`.

---

## Competitive Intelligence: Opal Analysis (COMPLETED)

A full competitive teardown of Opal (opal.so) was completed based on 454 sequential screenshots from their iOS app v3.151.1. The full report is at `scrolltoll-web/ScrollToll-vs-Opal-Competitive-Analysis.docx`.

### Key Findings
- Opal charges $17.50/month subscription vs. ScrollToll's free model
- Their onboarding is a 20+ step emotional funnel: personalized stats ("you'll waste 8 years"), theatrical loading, before/after charts, paywall before first use
- Gem collection gamification with 12 milestone tiers (3 days to 1,000 days)
- Customizable block screens with AI Personalities (Brutal Insults, Jane Austen, Dad Jokes, Jesus Christ)
- Named schedules (Work Time, Weekend Zen, Sleep) with per-schedule settings
- Day streaks with flame animation + weekly calendar
- Friends via "gem name" search, contact sync, referral codes

### Recommended Feature Roadmap (from analysis)

**Phase 1 — Quick Wins (Weeks 1–4):**
1. Theatrical onboarding with personalized screen time stats
2. Donation streaks with flame animation
3. Permission wrapping in troll narrative
4. Dynamic rotating troll messages (replace static "THE TROLL CAUGHT YOU")
5. Attribution survey ("How did you hear about ScrollToll?")
6. Community stats on shield screen

**Phase 2 — Core Upgrades (Weeks 5–12):**
1. Named schedules with custom toll amounts ("Work Troll", "Bedtime Troll")
2. Troll Score / focus percentage
3. Rich stats dashboard (screen time trends, donation totals, peer comparison)
4. Troll evolution badges (Troll Bait → Troll Apprentice → Bridge Guardian → Troll King)
5. Home screen widget (Scroll Jar balance, streak, troll mood)
6. Referral system ("Gift a friend their first troll")

**Phase 3 — Differentiation (Weeks 13–24):**
1. Impact stories from charity partners
2. AI Troll Personalities
3. Family/Group Scroll Jar
4. Corporate wellness (ScrollToll for Teams)
5. Charity Spotlight rotation
6. Desktop browser extension

### What NOT to Copy from Opal
- Uninstall protection (coercive, damages our brand)
- Hard blocking / pin code locks (our toll model works because it's voluntary)
- Subscription paywall before first use
- Generic ambient content (Sleep Stories, etc.)

---

## What's Next (Priority Order)

1. **Run Round 9B share card fix** through Cursor (`ScrollToll-QA-Round9B-ShareCard-Fix.md`)
2. **Verify podium visually** — temp threshold change → build → screenshot → revert
3. **Seed test leaderboard data** — add 5–10 fake users in Firestore
4. **Begin Phase 1 roadmap items** from Opal analysis (onboarding overhaul, streaks, dynamic messages)
5. **App Store submission prep** — once QA is clean

---

## Positioning Summary

ScrollToll is NOT competing with Opal for the same user. Opal targets people who want to use their phone less. ScrollToll targets people who know they'll use their phone too much and want something good to come of it. Our message is more honest about human behavior: you're not failing at focus — you're funding change.

**The moat:** Opal has built a beautiful productivity tool. ScrollToll has something they can never have — a reason to feel good about failing.

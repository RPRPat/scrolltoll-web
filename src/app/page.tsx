"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import GlowCard from "@/components/GlowCard";

const faqItems = [
  {
    q: "Where does my money actually go?",
    a: "100% of your donation goes directly to your chosen charity through Our Change Foundation (EIN: 86-3353394). ScrollToll charges a 7% platform fee and standard processing costs separately — these are never deducted from your donation.",
  },
  {
    q: "Is the app really free?",
    a: "Yes. ScrollToll is 100% free to download and use. You set your own limits, pick your apps, and see when you go over. Donating when the troll appears is encouraged — that's the whole point — but it's never required. You can always close the app and walk away. The troll will just judge you silently.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "Yes, for US taxpayers. Your full donation amount is tax-deductible to the extent allowed by law. The platform fee and processing costs are not tax-deductible. Our Change Foundation issues the tax receipt automatically via email after your Scroll Jar charge is processed.",
  },
  {
    q: "How does the screen time monitoring work?",
    a: "ScrollToll uses Apple's built-in Screen Time APIs (FamilyControls and DeviceActivity). Your usage data stays on your device — we never see which apps you use or how long you use them. All we know is when you've exceeded the limit you set.",
  },
  {
    q: "Can I change my toll amount or charity?",
    a: "Anytime. Open Settings in the app to change your toll amount ($1, $2, $5, or $10 per trigger), swap your charity, adjust your time limit, or change which apps are monitored. No commitments, no subscriptions.",
  },
  {
    q: "What if I don't want to pay when the troll appears?",
    a: "Tap \"Skip This Time\" and keep scrolling. No charge. The troll doesn't block your phone or hold anything hostage. But next time you go over your limit, it'll be back. And hungrier.",
  },
  {
    q: "What is the Scroll Jar?",
    a: "Tolls accumulate in your Scroll Jar instead of charging you immediately. When you're ready, tap \"Donate Now\" to send the full amount to your chosen charity. Think of it as a guilt piggy bank.",
  },
  {
    q: "How does the leaderboard work?",
    a: "Weekly leaderboards rank users by total donated, donation streak, screen time reduced, or most doom scrolling. You can also create private friend leaderboards with invite codes. Rankings reset each week so everyone starts fresh.",
  },
  {
    q: "Is my payment information secure?",
    a: "Payments are handled entirely by Stripe, one of the world's most trusted payment processors. Your card details never touch ScrollToll's servers. Everything is encrypted with 256-bit SSL.",
  },
];

/* ─────────────────────── NAV ─────────────────────── */

function Nav() {
  return (
    <motion.nav
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/70 px-5 py-4 backdrop-blur-md md:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="font-heading text-xl font-bold tracking-widest">
          <span className="text-neon-green text-glow-green">SCROLL</span>
          <span className="text-hot-pink text-glow-pink">TOLL</span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            href="#how-it-works"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            How It Works
          </a>
          <a
            href="#where-money-goes"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            Transparency
          </a>
          <a
            href="#faq"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            FAQ
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-full border border-neon-green/30 px-4 py-2 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10 hover:shadow-[0_0_24px_rgba(57,255,20,0.25)]"
          >
            Join Waitlist &rarr;
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

/* ─────────────────────── HERO ─────────────────────── */

function DoomScrollCounter() {
  const [count, setCount] = useState(14293847);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 47) + 12);
    }, 100);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-400">
      <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      <span>
        <span className="font-mono font-bold tabular-nums text-white">
          {count.toLocaleString()}
        </span>{" "}
        hours doom-scrolled today worldwide
      </span>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-20 pb-8 text-center md:pt-24 md:pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,46,151,0.08),transparent_24%),linear-gradient(180deg,rgba(17,17,40,0.45),transparent_35%)]" />
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center"
      >
        <div className="mb-2 md:mb-3">
          <video
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            aria-label="Animated troll character"
            className="mx-auto h-[220px] w-[155px] object-contain md:h-[260px] md:w-[175px]"
            style={{
              maskImage:
                "radial-gradient(ellipse 85% 85% at center, black 60%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 85% 85% at center, black 60%, transparent 100%)",
            }}
            poster="/troll-poster.jpg"
          >
            <source src="/troll2.mp4" type="video/mp4" />
          </video>
        </div>

        <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-[4.5rem]">
          <span className="text-neon-green text-glow-green">SCROLL</span>
          <span className="text-hot-pink text-glow-pink">TOLL</span>
        </h1>

        <DoomScrollCounter />

        <p className="max-w-3xl font-heading text-[2.3rem] leading-tight text-white sm:text-4xl">
          Your doom scrolling just fed someone.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
          The app that turns your worst habit into someone else's best day. Set a screen time
          limit. Blow past it. Pay the toll. Feed the world.
        </p>

        <a
          href="#waitlist"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-neon-green px-8 py-4 font-heading text-lg font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(57,255,20,0.45)]"
        >
          JOIN THE WAITLIST &rarr;
        </a>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="text-neon-green" aria-hidden="true">&#10003;</span> Your full donation is tax-deductible (US)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-neon-green" aria-hidden="true">&#10003;</span> 100% of your donation goes to charity
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-neon-green" aria-hidden="true">&#10003;</span> Free to use, always
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 md:bottom-6"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <div className="text-[10px] font-mono uppercase tracking-[0.3em]">Scroll</div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="h-2 w-2 rotate-45 border-b border-r border-neon-green" />
            <span className="h-2 w-2 rotate-45 border-b border-r border-neon-green/70" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── HOW IT WORKS ─────────────────── */

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Set Your Limit",
      desc: "Choose your daily screen time cap for TikTok, Instagram, X, Reddit — whatever your poison.",
      icon: "&#9881;",
    },
    {
      num: "02",
      title: "The Troll Appears",
      desc: "Blow past your limit and a full-screen shield drops over the app. The troll demands payment.",
      icon: "&#128737;",
    },
    {
      num: "03",
      title: "Add to Your Jar",
      desc: "Tolls accumulate in your Scroll Jar. When you\u2019re ready, donate it all to a charity you chose. Or skip \u2014 the troll will remember.",
      icon: "&#128154;",
    },
    {
      num: "04",
      title: "Keep Scrolling (or Don\u2019t)",
      desc: "Shield clears. You\u2019re back. But the leaderboard is watching \u2014 and your friends just got notified.",
      icon: "&#9851;",
    },
  ];

  return (
    <section id="how-it-works" className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-hot-pink">
            How It Works
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            A Toll Booth for Your Doom Scrolling.
          </h2>
          <p className="mt-4 text-base text-gray-400">
            Not a blocker. Not a timer. A toll — with teeth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
            >
              <GlowCard
                className="h-full border-white/10 bg-[#141432]"
                glowColor="rgba(57,255,20,0.12)"
              >
                <div className="font-mono text-4xl font-bold text-neon-green">{step.num}</div>
                <h3 className="mt-6 font-heading text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-400">{step.desc}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── WHERE YOUR MONEY GOES ─────────────── */

function WhereMoneyGoes() {
  return (
    <section id="where-money-goes" className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-neon-green">
            Full Transparency
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Where Your Money Goes.
          </h2>
          <p className="mt-4 text-base text-gray-400">
            100% of every donation is delivered through Our Change Foundation for your chosen
            charity. ScrollToll&apos;s platform fee and payment processing costs are charged
            separately on top.
          </p>
        </motion.div>

        {/* Fee breakdown bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mb-12 max-w-3xl"
        >
          <div className="mb-3 flex items-end justify-between text-sm">
            <span className="text-gray-400">Your $2.00 donation</span>
            <span className="font-mono text-neon-green">$2.00 to charity</span>
          </div>
          <div className="flex h-12 overflow-hidden rounded-xl">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="flex items-center justify-center bg-neon-green"
            >
              <span className="text-sm font-bold text-black">100% to Charity — $2.00</span>
            </motion.div>
          </div>
          <div className="mt-3 rounded-xl border border-hot-pink/20 bg-hot-pink/10 px-4 py-3 text-xs text-hot-pink">
            7% platform fee + standard payment processing costs are charged separately on top and
            never deducted from your donation.
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span role="img" aria-label="green square">🟩</span> 100% to your chosen charity through Our Change Foundation
            </span>
            <span className="flex items-center gap-1.5">
              <span role="img" aria-label="purple square">🟪</span> 7% platform fee charged separately to keep ScrollToll free
            </span>
            <span className="flex items-center gap-1.5">
              <span role="img" aria-label="yellow square">🟨</span> Standard processing costs charged separately
            </span>
          </div>
        </motion.div>

        {/* Charity partners + trust signals */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(57,255,20,0.1)">
            <div className="mb-4 text-3xl">
              <span role="img" aria-label="house">🏠</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Real Charities</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              You choose from thousands of verified 501(c)(3) nonprofits. Feeding America, Doctors Without Borders, No Kid Hungry, St. Jude — or search for a cause you care about.
            </p>
          </GlowCard>

          <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(255,46,151,0.1)" delay={0.1}>
            <div className="mb-4 text-3xl">
              <span role="img" aria-label="lock">🔒</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Powered by Our Change Foundation</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              100% of each donation is delivered to your chosen charity through Our Change
              Foundation (EIN: 86-3353394), a 501(c)(3) partner that handles charitable
              disbursement and tax receipts.
            </p>
          </GlowCard>

          <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(191,0,255,0.1)" delay={0.2}>
            <div className="mb-4 text-3xl">
              <span role="img" aria-label="bank">🏦</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Tax-Deductible (US)</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Your full donation amount may be tax-deductible to the extent allowed by law. The
              platform fee and processing costs are not tax-deductible. Our Change Foundation sends
              your receipt automatically after your Scroll Jar charge is processed.
            </p>
          </GlowCard>

          <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(204,255,0,0.1)" delay={0.3}>
            <div className="mb-4 text-3xl">
              <span role="img" aria-label="bullseye">🎯</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Donate Directly</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Give any time, not just when scrolling. Donate directly to any of our partner
              charities with the same 100%-to-charity guarantee.
            </p>
          </GlowCard>
        </div>
      </div>
    </section>
  );
}

/* ────────────────── TAX SAVINGS CALCULATOR ────────────────── */

function TaxSavingsCalculator() {
  const [tollAmount, setTollAmount] = useState(2);
  const [triggersPerWeek, setTriggersPerWeek] = useState(3);

  const annualTollTotal = tollAmount * triggersPerWeek * 52;
  const annualDonation = annualTollTotal;
  const annualPlatformFee = Math.round(annualDonation * 0.07);
  const taxSavings = Math.round(annualDonation * 0.22);
  const mealsProvided = Math.round(annualDonation * 10);

  const tollOptions = [1, 2, 5, 10];

  return (
    <section className="px-6 py-20 md:px-10 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        <div className="text-center">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-hot-pink">
            YOUR IMPACT + YOUR SAVINGS
          </p>
          <h2 className="mb-4 font-heading text-3xl font-black text-white md:text-5xl">
            See What Your Tolls <span className="text-neon-green">Actually Do.</span>
          </h2>
          <p className="mb-10 text-base text-gray-400">
            Adjust your toll amount and see the real-world impact — plus your estimated tax savings.
          </p>
        </div>

        {/* Toll amount selector */}
        <div className="mb-8">
          <label className="mb-3 block text-center text-sm font-mono uppercase tracking-wider text-gray-400">
            Your toll per trigger
          </label>
          <div className="flex justify-center gap-3">
            {tollOptions.map((amount) => (
              <button
                key={amount}
                onClick={() => setTollAmount(amount)}
                className={`rounded-xl px-5 py-3 font-mono text-lg font-bold transition-all ${
                  tollAmount === amount
                    ? "bg-neon-green text-black shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                    : "border border-white/15 bg-[#141432] text-white/60 hover:border-neon-green/40 hover:text-white"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Triggers per week slider */}
        <div className="mb-10">
          <label className="mb-2 block text-center text-lg text-white">
            Times you'll probably exceed your limit per week:{" "}
            <span className="font-bold text-hot-pink">{triggersPerWeek}x</span>
          </label>
          <input
            type="range"
            aria-label="Number of triggers per week"
            min={1}
            max={7}
            step={1}
            value={triggersPerWeek}
            onChange={(e) => setTriggersPerWeek(Number.parseInt(e.target.value, 10))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full"
            style={{
              background: `linear-gradient(to right, #FF2E97 ${(triggersPerWeek / 7) * 100}%, #1a1a2e ${(triggersPerWeek / 7) * 100}%)`,
            }}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500">
            <span>1x (disciplined)</span>
            <span>7x (be honest)</span>
          </div>
        </div>

        {/* Results grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#141432] p-5 text-center">
            <p className="text-3xl font-black text-white md:text-4xl">
              ${annualDonation.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-400">to charity per year</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#141432] p-5 text-center">
            <p className="text-3xl font-black text-neon-green md:text-4xl">
              {mealsProvided.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-gray-400">meals provided*</p>
          </div>
          <div className="rounded-xl border border-neon-green/20 bg-[#0d1a0d] p-5 text-center">
            <p className="text-3xl font-black text-neon-green md:text-4xl">
              ~${taxSavings}
            </p>
            <p className="mt-1 text-sm text-gray-400">back on your taxes (US)</p>
          </div>
          <div className="rounded-xl border border-hot-pink/20 bg-[#1a0d14] p-5 text-center">
            <p className="text-3xl font-black text-hot-pink md:text-4xl">
              ${Math.round(annualDonation + annualPlatformFee - taxSavings)}
            </p>
            <p className="mt-1 text-sm text-gray-400">actual cost after deduction (excl. processing)</p>
          </div>
        </div>

        <p className="mb-6 text-center text-sm text-gray-500">
          *Based on Feeding America&apos;s estimate of ~10 meals per $1. Tax savings estimated at
          a 22% marginal rate on your full donation amount. ScrollToll charges a separate 7%
          platform fee and standard processing costs on top. Receipts issued by Our Change
          Foundation. This is not tax advice.
        </p>

        <div className="text-center">
          <a
            href="#waitlist"
            className="inline-block rounded-full bg-neon-green px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
          >
            MAKE YOUR SCROLLING COUNT &rarr;
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── PHONE MOCKUP ─────────────────── */

function PhoneMockup() {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:px-10 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(57,255,20,0.08),transparent_18%),radial-gradient(circle_at_70%_20%,rgba(191,0,255,0.08),transparent_20%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl rounded-[2rem] border border-white/8 bg-[#0a0a14]/70 px-6 py-12 text-center"
      >
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-neon-green">
          WHEN THE TROLL APPEARS
        </p>
        <h2 className="mb-12 font-heading text-3xl font-black text-white md:text-4xl">
          This Is What Happens.
        </h2>

        <div className="flex justify-center">
          <div className="relative h-[560px] w-[280px] rounded-[40px] border-4 border-gray-700 bg-black p-3 shadow-[0_0_40px_rgba(57,255,20,0.12)]">
            <div className="absolute top-0 left-1/2 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-black" />

            <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[30px] bg-black px-4">
              <div className="absolute inset-0 rounded-[30px] bg-gradient-to-b from-purple-900/30 to-black" />

              <div className="relative z-10 text-center">
                <Image
                  src="/troll.png"
                  alt="Troll"
                  width={80}
                  height={80}
                  className="mx-auto mb-4 drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                />
                <p className="mb-1 text-xl font-black text-white">THE TROLL CAUGHT YOU</p>
                <p className="mb-2 text-sm text-gray-400">
                  Review your toll or skip this one.
                </p>
                <p className="mb-5 font-mono text-sm text-neon-green">
                  $2.00 &rarr; Feeding America
                </p>

                <button className="mb-2 w-full rounded-full bg-neon-green py-3 text-sm font-black text-black">
                  ADD TO JAR — $2.00
                </button>
                <button className="mb-2 w-full rounded-full border border-white/20 py-2.5 text-sm text-gray-400">
                  SKIP THIS TIME
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-md text-sm text-gray-400">
          A full-screen shield drops over the app. Add the toll to your Scroll Jar, or skip this one.
          When you&apos;re ready, empty the jar and donate it all to your chosen charity.
        </p>
      </motion.div>
    </section>
  );
}

/* ─────────────────── LEADERBOARD ─────────────────── */

function LeaderboardPreview() {
  const podium = [
    { rank: 2, name: "DarkScroller", donated: "$76", ringColor: "border-gray-400", barH: "h-16" },
    { rank: 1, name: "SarahDoom", donated: "$94", ringColor: "border-[#CCFF00]", barH: "h-24" },
    { rank: 3, name: "TikTokTyrant", donated: "$62", ringColor: "border-orange-600", barH: "h-12" },
  ];

  return (
    <section className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-hot-pink">
            The Leaderboard
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Compete. Share. Get Shamed.
          </h2>
          <p className="mt-4 text-base text-gray-400">
            See who&apos;s donating the most, who can&apos;t stop scrolling, and where you rank.
            Challenge friends. Share your rank card. Let the shame drive impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Podium mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-[#141432] p-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-neon-green">TOP TROLLS</h3>
              <div className="flex gap-2">
                <span className="rounded-full bg-neon-green/15 px-3 py-1 text-xs font-bold text-neon-green">Donated</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-500">Streak</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-500">Doom</span>
              </div>
            </div>

            <div className="flex items-end justify-center gap-4 py-6">
              {podium.map((p, i) => (
                <motion.div
                  key={p.rank}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  {p.rank === 1 && <span className="mb-1 text-xl">👑</span>}
                  <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] ${p.ringColor} bg-white/10`}>
                    <span className="text-lg font-bold text-white/80">{p.name.charAt(0)}</span>
                    <span className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-black ${
                      p.rank === 1 ? "bg-[#CCFF00]" : p.rank === 2 ? "bg-gray-400" : "bg-orange-600"
                    }`}>
                      {p.rank}
                    </span>
                  </div>
                  <span className="mt-2 max-w-[5rem] truncate text-xs font-medium text-white/80">{p.name}</span>
                  <span className="font-mono text-xs font-bold text-neon-green">{p.donated}</span>
                  <div className={`${p.barH} mt-2 w-16 rounded-t-lg border border-neon-green/20 bg-neon-green/10`} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(57,255,20,0.1)">
              <p className="mb-2 text-2xl">🏆</p>
              <h4 className="font-heading text-base font-bold text-white">Weekly Rankings</h4>
              <p className="mt-2 text-sm text-gray-400">
                Compete on total donated, donation streaks, screen time reduced, or most doom scrolling.
              </p>
            </GlowCard>
            <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(255,46,151,0.1)" delay={0.1}>
              <p className="mb-2 text-2xl">👥</p>
              <h4 className="font-heading text-base font-bold text-white">Friend Leaderboards</h4>
              <p className="mt-2 text-sm text-gray-400">
                Private invite-code leaderboards. Challenge friends directly and keep each other accountable.
              </p>
            </GlowCard>
            <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(191,0,255,0.1)" delay={0.2}>
              <p className="mb-2 text-2xl">📤</p>
              <h4 className="font-heading text-base font-bold text-white">Share Your Rank</h4>
              <p className="mt-2 text-sm text-gray-400">
                One-tap share cards for Instagram Stories. Flex your generosity or shame your scroll time.
              </p>
            </GlowCard>
            <GlowCard className="border-white/10 bg-[#141432]" glowColor="rgba(204,255,0,0.1)" delay={0.3}>
              <p className="mb-2 text-2xl">🧌</p>
              <h4 className="font-heading text-base font-bold text-white">Rank Titles</h4>
              <p className="mt-2 text-sm text-gray-400">
                Earn titles like VOID CHAMPION, CHAOS AGENT, or SCROLL NOVICE based on your weekly ranking.
              </p>
            </GlowCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── TROLL SPEAKS ─────────────────── */

function TrollQuotes() {
  const quotes = [
    { text: "You set a 30 minute limit.\nIt's been 2 hours.\nFeed me." },
    { text: "I see you scrolling at 2am.\nThat costs double." },
    { text: "Your screen time report?\nI AM your screen time report." },
    { text: "You said '5 more minutes'\ntwenty minutes ago.\nPay up." },
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => window.clearInterval(interval);
  }, [quotes.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        <p className="whitespace-pre-line font-heading text-2xl font-bold italic text-neon-green md:text-3xl">
          &ldquo;{quotes[index].text}&rdquo;
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

function TrollSpeaks() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:px-10 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(57,255,20,0.08),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(191,0,255,0.08),transparent_20%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 rounded-[2rem] border border-white/8 bg-[#0a0a14]/85 px-6 py-10 md:flex-row md:px-10"
      >
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 scale-110 rounded-full bg-neon-green/10 blur-3xl" />
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Image
              src="/troll.png"
              alt="ScrollToll troll"
              width={220}
              height={220}
              className="relative z-10 mx-auto w-[180px] sm:w-[220px]"
            />
          </motion.div>
        </div>

        <div className="max-w-2xl text-center md:text-left">
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-neon-green/80">
            The Troll Speaks
          </p>
          <div className="mt-5">
            <TrollQuotes />
          </div>
          <p className="mt-5 text-sm uppercase tracking-[0.25em] text-gray-500">
            — The ScrollToll Troll
          </p>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────── IMPACT / SOCIAL PROOF ─────────────────── */

function ImpactSection() {
  const charities = [
    "Feeding America",
    "Doctors Without Borders",
    "No Kid Hungry",
    "St. Jude Children\u2019s Research Hospital",
    "charity: water",
    "World Food Programme",
  ];

  return (
    <section className="px-6 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-electric-purple">
            Real Impact
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Your Worst Habit. Their Best Day.
          </h2>
          <p className="mt-4 text-base text-gray-400">
            100% of each donation is delivered through Our Change Foundation to a real, verified
            nonprofit you choose. Here are some of the charities ScrollToll users can support.
          </p>
        </motion.div>

        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
          {charities.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-[#141432] px-4 py-5 text-center"
            >
              <span className="text-sm font-medium text-white/80">{name}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl rounded-2xl border border-neon-green/15 bg-[#0a140a] p-8 text-center"
        >
          <p className="mb-2 font-mono text-sm uppercase tracking-wider text-neon-green/70">
            What $2 can do
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-black text-neon-green">20</p>
              <p className="text-sm text-gray-400">meals provided</p>
            </div>
            <div>
              <p className="text-3xl font-black text-neon-green">40</p>
              <p className="text-sm text-gray-400">liters of clean water</p>
            </div>
            <div>
              <p className="text-3xl font-black text-neon-green">1</p>
              <p className="text-sm text-gray-400">child fed for a week</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Estimates based on published charity impact data. Actual impact varies by organization.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────── FAQ ─────────────────────── */

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="px-6 py-20 md:px-10 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-toxic-yellow">
            Questions
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Frequently Asked.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#141432] px-6 py-5 text-left transition-all hover:border-neon-green/30"
              >
                <span className="pr-4 font-heading text-base font-semibold text-white sm:text-lg">
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-xl text-neon-green"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 text-sm leading-7 text-gray-400">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── WAITLIST ─────────────────── */

function WaitlistCounter() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (Math.random() > 0.3) {
        setCount((prev) => prev + 1);
      }
    }, 25000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <p className="mt-4 text-sm font-mono tracking-wider text-neon-green">
      Already{" "}
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block"
      >
        {count.toLocaleString()}
      </motion.span>{" "}
      doom scrollers waiting.
    </p>
  );
}

function Waitlist() {
  return (
    <section id="waitlist" className="px-6 py-20 md:px-10 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#111128] px-6 py-10 text-center shadow-[0_0_50px_rgba(57,255,20,0.06)] md:px-12"
      >
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.35em] text-hot-pink">
          Join The Movement
        </p>
        <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
          Be first to turn your screen time into something that matters.
        </h2>
        <p className="mt-5 text-base leading-7 text-gray-400">
          Launch updates, early access, and the first shot at feeding the troll on purpose.
        </p>

        <form
          action="https://formspree.io/f/xzdjvnez"
          method="POST"
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={() => posthog.capture("waitlist_joined", { source: "homepage_section" })}
        >
          <input
            type="email"
            name="email"
            required
            placeholder="your@email.com"
            className="flex-1 rounded-full border border-white/15 bg-[#141432] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green/50"
          />
          <button
            type="submit"
            className="rounded-full bg-neon-green px-6 py-3 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
          >
            JOIN WAITLIST
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400">No spam. Just launch updates and early access.</p>
        <WaitlistCounter />
      </motion.div>
    </section>
  );
}

/* ─────────────────── STICKY MOBILE CTA ─────────────────── */

function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 p-3 backdrop-blur-lg md:hidden"
        >
          <form
            action="https://formspree.io/f/xzdjvnez"
            method="POST"
            className="mx-auto flex max-w-md gap-2"
            onSubmit={() => posthog.capture("waitlist_joined", { source: "mobile_sticky_cta" })}
          >
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 rounded-full border border-white/15 bg-[#141432] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-green/50"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-full bg-neon-green px-4 py-2 text-sm font-bold text-black"
            >
              JOIN
            </button>
          </form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ─────────────────── FOOTER ─────────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12 text-center md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="font-heading text-2xl font-bold tracking-[0.2em] text-white">SCROLLTOLL</div>
        <p className="mt-4 text-sm text-gray-500">
          Turning screen time into impact. One toll at a time.
        </p>
        <p className="mt-3 text-sm text-gray-500">Pat &amp; Jon, Founders</p>
        <a
          href="mailto:hello@scrolltoll.me"
          className="mt-2 inline-block text-sm text-neon-green transition-colors hover:text-white"
        >
          hello@scrolltoll.me
        </a>
        <div className="mt-6 flex items-center justify-center gap-6">
          <Link
            href="/deck"
            className="text-xs text-gray-600 transition-colors hover:text-gray-400"
          >
            For Investors
          </Link>
          <span className="text-gray-700">|</span>
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
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gray-500">
          &copy; 2026 ScrollToll. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/* ─────────────────── PAGE ─────────────────── */

export default function Home() {
  return (
    <main className="min-h-screen bg-void pb-20 text-white md:pb-0">
      <Nav />
      <Hero />
      <HowItWorks />
      <WhereMoneyGoes />
      <TaxSavingsCalculator />
      <PhoneMockup />
      <LeaderboardPreview />
      <ImpactSection />
      <TrollSpeaks />
      <FAQ />
      <Waitlist />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import GlowCard from "@/components/GlowCard";

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
        <a
          href="#waitlist"
          className="inline-flex items-center gap-2 rounded-full border border-neon-green/30 px-4 py-2 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10 hover:shadow-[0_0_24px_rgba(57,255,20,0.25)]"
        >
          Join Waitlist &rarr;
        </a>
      </div>
    </motion.nav>
  );
}

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28 pb-16 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,255,20,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,46,151,0.08),transparent_24%),linear-gradient(180deg,rgba(17,17,40,0.45),transparent_35%)]" />
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center"
      >
        <div className="mb-6">
          <video
            autoPlay
            muted
            playsInline
            className="mx-auto h-[320px] w-[200px] object-contain"
            style={{
              maskImage:
                "radial-gradient(ellipse 85% 85% at center, black 60%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 85% 85% at center, black 60%, transparent 100%)",
            }}
            src="/troll2.mp4"
            poster="/troll.png"
          />
        </div>

        <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <span className="text-neon-green text-glow-green">SCROLL</span>
          <span className="text-hot-pink text-glow-pink">TOLL</span>
        </h1>

        <DoomScrollCounter />

        <p className="max-w-3xl font-heading text-3xl leading-tight text-white sm:text-4xl">
          Your doom scrolling just fed someone.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
          The app that turns your worst habit into someone else's best day. Set a screen time
          limit. Blow past it. Pay the toll. Change a life.
        </p>

        <a
          href="#waitlist"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-neon-green px-8 py-4 font-heading text-lg font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(57,255,20,0.45)]"
        >
          JOIN THE WAITLIST &rarr;
        </a>

        <p className="mt-6 max-w-xl text-sm text-gray-400 sm:text-base">
          "Every scroll past your limit donates to charity. Automatically."
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Set Your Limit",
      desc: "Choose your daily screen time cap for TikTok, Instagram, X, Reddit — whatever your poison.",
    },
    {
      num: "02",
      title: "Doom Scroll Past It",
      desc: "We all do. When you blow past your limit, the troll appears.",
    },
    {
      num: "03",
      title: "Pay the Toll",
      desc: "One tap. $1 to charity. Your guilt becomes someone's groceries.",
    },
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
            How It Works
          </p>
          <h2 className="mt-4 font-heading text-4xl font-bold text-white sm:text-5xl">
            Three Steps Between Your Habit and Something Good.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
                <h3 className="mt-6 font-heading text-2xl font-bold text-white">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-gray-400">{step.desc}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScreenTimeCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [daysPerWeek, setDaysPerWeek] = useState(7);

  const hoursPerYear = hoursPerDay * daysPerWeek * 52;
  const daysPerYear = Math.round(hoursPerYear / 24);
  const donationPerYear = Math.round(hoursPerYear * 0.3);

  return (
    <section id="calculator" className="px-6 py-16 md:px-10 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-neon-green">
          THE REALITY CHECK
        </p>
        <h2 className="mb-12 font-heading text-3xl font-black text-white md:text-5xl">
          How Much Are You <span className="text-hot-pink">Really</span> Scrolling?
        </h2>

        <div className="mb-12 space-y-8">
          <div>
            <label className="mb-2 block text-lg text-white">
              Hours per day on social media:{" "}
              <span className="font-bold text-neon-green">{hoursPerDay}h</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number.parseFloat(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #39FF14 ${(hoursPerDay / 8) * 100}%, #1a1a2e ${(hoursPerDay / 8) * 100}%)`,
              }}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>30min</span>
              <span>8h</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-lg text-white">
              Days per week: <span className="font-bold text-neon-green">{daysPerWeek}</span>
            </label>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number.parseInt(e.target.value, 10))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #FF2E97 ${(daysPerWeek / 7) * 100}%, #1a1a2e ${(daysPerWeek / 7) * 100}%)`,
              }}
            />
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#141432] p-4">
            <p className="text-3xl font-black text-white md:text-4xl">
              {hoursPerYear.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">hours/year scrolling</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#141432] p-4">
            <p className="text-3xl font-black text-hot-pink md:text-4xl">{daysPerYear}</p>
            <p className="text-sm text-gray-400">full days lost</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#141432] p-4">
            <p className="text-3xl font-black text-neon-green md:text-4xl">
              ${donationPerYear}
            </p>
            <p className="text-sm text-gray-400">you could donate</p>
          </div>
        </div>

        <p className="mb-6 text-sm text-gray-400">
          That's <span className="font-bold text-white">{daysPerYear} days</span> of your life per
          year. ScrollToll turns that guilt into{" "}
          <span className="font-bold text-neon-green">${donationPerYear}</span> for charity.
        </p>

        <a
          href="#waitlist"
          className="inline-block rounded-full bg-neon-green px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]"
        >
          MAKE IT COUNT &rarr;
        </a>
      </motion.div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <section className="px-6 py-16 md:px-10 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center"
      >
        <p className="mb-4 font-mono text-sm uppercase tracking-[0.3em] text-neon-green">
          WHEN THE TROLL APPEARS
        </p>
        <h2 className="mb-12 font-heading text-3xl font-black text-white md:text-4xl">
          This Is What Happens.
        </h2>

        <div className="flex justify-center">
          <div className="relative h-[560px] w-[280px] rounded-[40px] border-4 border-gray-700 bg-black p-3 shadow-[0_0_60px_rgba(57,255,20,0.15)]">
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
                <p className="mb-2 font-mono text-xs text-red-500">LIMIT EXCEEDED</p>
                <p className="mb-1 text-xl font-black text-white">TIME'S UP</p>
                <p className="mb-6 text-sm text-gray-400">
                  You've been on Instagram
                  <br />
                  for 47 minutes over your limit.
                </p>

                <button className="mb-3 w-full rounded-full bg-neon-green py-3 text-sm font-black text-black">
                  FEED THE VOID — $1.00
                </button>
                <button className="w-full rounded-full border border-white/20 py-3 text-sm text-gray-400">
                  I'll stop scrolling (sure you will)
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-md text-sm text-gray-400">
          A full-screen shield drops over the app. One tap donates to charity. Or close the app.
          Your call.
        </p>
      </motion.div>
    </section>
  );
}

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
          "{quotes[index].text}"
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

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12 text-center md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="font-heading text-2xl font-bold tracking-[0.2em] text-white">SCROLLTOLL</div>
        <p className="mt-5 text-sm text-gray-500">Pat &amp; Jon, Founders</p>
        <a
          href="mailto:hello@scrolltoll.me"
          className="mt-2 inline-block text-sm text-neon-green transition-colors hover:text-white"
        >
          hello@scrolltoll.me
        </a>
        <div className="mt-6">
          <Link href="/deck" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
            For Investors
          </Link>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gray-500">
          © 2026 ScrollToll. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-void pb-20 text-white md:pb-0">
      <Nav />
      <Hero />
      <HowItWorks />
      <ScreenTimeCalculator />
      <PhoneMockup />
      <TrollSpeaks />
      <Waitlist />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}

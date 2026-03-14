"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
        <video
          autoPlay
          muted
          playsInline
          poster="/troll.png"
          className="mx-auto h-[320px] w-[200px] object-contain"
          src="/troll2.mp4"
        />

        <h1 className="mt-4 font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <span className="text-neon-green text-glow-green">SCROLL</span>
          <span className="text-hot-pink text-glow-pink">TOLL</span>
        </h1>

        <p className="mt-5 max-w-3xl font-heading text-3xl leading-tight text-white sm:text-4xl">
          Your doom scrolling just fed someone.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
          The app that turns your worst habit into someone else&apos;s best day. Set a screen
          time limit. Blow past it. Pay the toll. Change a life.
        </p>

        <a
          href="#waitlist"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-neon-green px-8 py-4 font-heading text-lg font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(57,255,20,0.45)]"
        >
          JOIN THE WAITLIST &rarr;
        </a>

        <p className="mt-6 max-w-xl text-sm text-gray-400 sm:text-base">
          &ldquo;Every scroll past your limit donates to charity. Automatically.&rdquo;
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
      desc: "One tap. $1 to charity. Your guilt becomes someone&apos;s groceries.",
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
          <blockquote className="mt-5 font-heading text-3xl italic leading-tight text-neon-green sm:text-4xl">
            &ldquo;You set a 30 minute limit.
            <br />
            It&apos;s been 2 hours.
            <br />
            Feed me.&rdquo;
          </blockquote>
          <p className="mt-5 text-sm uppercase tracking-[0.25em] text-gray-500">
            — The ScrollToll Troll
          </p>
        </div>
      </motion.div>
    </section>
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
        <p className="mt-5 font-mono text-sm text-neon-green/85">
          Already 1,247 doom scrollers waiting.
        </p>
      </motion.div>
    </section>
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
          <Link
            href="/deck"
            className="text-sm font-semibold text-hot-pink transition-colors hover:text-neon-green"
          >
            For Investors &rarr;
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
    <main className="min-h-screen bg-void text-white">
      <Nav />
      <Hero />
      <HowItWorks />
      <TrollSpeaks />
      <Waitlist />
      <Footer />
    </main>
  );
}

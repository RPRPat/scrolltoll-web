"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import GlowCard from "@/components/GlowCard";

function Nav() {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-black/80 backdrop-blur-md border-b border-white/5"
    >
      <span className="font-heading font-bold text-xl tracking-widest text-neon-green text-glow-green">
        SCROLLTOLL
      </span>
      <a
        href="#contact"
        className="px-5 py-2 rounded-full border border-neon-green/50 text-neon-green text-sm font-medium hover:bg-neon-green/10 transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]"
      >
        Feed the Void &rarr;
      </a>
    </motion.nav>
  );
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale, y }}
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neon-green/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-neon-green/5 blur-[120px] animate-glow-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [-1, 1, -1],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 rounded-full bg-neon-green/10 blur-2xl scale-110" />
          <Image
            src="/troll.png"
            alt="ScrollToll Troll"
            width={180}
            height={180}
            className="relative z-10 drop-shadow-[0_0_40px_rgba(57,255,20,0.5)] drop-shadow-[0_0_80px_rgba(57,255,20,0.2)]"
            priority
          />
        </motion.div>

        <h1 className="font-heading font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
          <span className="text-neon-green text-glow-green">SCROLL</span>
          <span className="text-hot-pink text-glow-pink">TOLL</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="font-heading text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mb-3"
        >
          Your Doom Scrolling Feeds the Void.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="font-heading text-xl md:text-2xl lg:text-3xl text-white/70 max-w-3xl mb-10"
        >
          The Void Feeds the World.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-white/50 text-lg md:text-xl max-w-xl"
        >
          The app that turns your worst habit<br />into someone else&apos;s best day.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function Problem() {
  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-hot-pink font-mono text-sm font-semibold tracking-widest uppercase mb-4 block"
        >
          The Problem
        </motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          We&apos;re All Addicts.
        </h2>
        <p className="text-white/50 text-xl mb-16 max-w-2xl">
          Nobody&apos;s doing anything about it.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "2hrs 23min", label: "Average daily social media time globally", color: "text-neon-green", glow: "rgba(57,255,20,0.15)" },
            { num: "$226B", label: "Social media ad revenue (they profit from your addiction)", color: "text-hot-pink", glow: "rgba(255,46,151,0.15)" },
            { num: "0", label: "Apps that make your scrolling actually matter", color: "text-electric-purple", glow: "rgba(191,0,255,0.15)" },
          ].map((stat, i) => (
            <GlowCard key={i} delay={i * 0.15} glowColor={stat.glow}>
              <div className={`font-heading text-4xl md:text-5xl font-bold mb-4 ${stat.color}`}>{stat.num}</div>
              <p className="text-white/60 text-base">{stat.label}</p>
            </GlowCard>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-hot-pink/80 mt-12 text-lg font-medium"
        >
          Screen time apps use friction. We use consequences &mdash; fun ones.
        </motion.p>
      </div>
    </AnimatedSection>
  );
}

function Solution() {
  const steps = [
    { num: "01", title: "SET YOUR LIMIT", desc: "Choose which apps to monitor and how long you're \"allowed\" to scroll.", icon: "⚙️" },
    { num: "02", title: "SCROLL INTO THE VOID", desc: "Use your phone normally. We monitor in the background via Apple Screen Time.", icon: "📱" },
    { num: "03", title: "THE TOLL APPEARS", desc: "Exceed your limit? A full-screen shield drops: FEED THE VOID or walk away.", icon: "🛡️" },
    { num: "04", title: "YOUR GUILT DOES GOOD", desc: "One tap donates to charity. Your doom scrolling just fed a child.", icon: "💚" },
  ];

  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12 relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-neon-green/3 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-neon-green font-mono text-sm font-semibold tracking-widest uppercase mb-4 block"
        >
          The Solution
        </motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          A Toll Booth for Your<br /><span className="text-neon-green text-glow-green">Doom Scrolling.</span>
        </h2>
        <p className="text-white/50 text-lg mb-16 max-w-2xl">Not a blocker. Not a timer. A toll &mdash; with teeth.</p>
        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="flex items-start gap-6 group"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-dark-card border border-white/10 flex items-center justify-center text-2xl group-hover:border-neon-green/50 group-hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all">
                {step.icon}
              </div>
              <div className="flex-1 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-neon-green font-mono text-sm font-bold">{step.num}</span>
                  <h3 className="font-heading text-lg md:text-xl font-semibold tracking-wide">{step.title}</h3>
                </div>
                <p className="text-white/50 text-base">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function Voice() {
  const quotes = [
    { text: "\"DOOM SCROLLING DETECTED.\nTHE VOID HUNGERS.\"", attribution: "Shield notification", color: "border-neon-green/30 hover:border-neon-green/60" },
    { text: "\"Congratulations. You just doom scrolled for 47 minutes and fed a child. Hero.\"", attribution: "Post-donation confirmation", color: "border-hot-pink/30 hover:border-hot-pink/60" },
    { text: "\"Not now, mortal.\"", attribution: "Dismiss button (the walk of shame)", color: "border-electric-purple/30 hover:border-electric-purple/60" },
  ];

  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-electric-purple font-mono text-sm font-semibold tracking-widest uppercase mb-4 block"
        >
          The Voice
        </motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Shame, Cloaked in Humor.</h2>
        <p className="text-white/50 text-xl mb-16 max-w-2xl">Not self-help. Self-awareness.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.7 }}
              whileHover={{ scale: 1.03 }}
              className={`bg-[#141432] rounded-2xl p-8 border ${q.color} transition-all flex flex-col justify-between min-h-[250px]`}
            >
              <p className="text-neon-green font-mono text-base md:text-lg leading-relaxed whitespace-pre-line">{q.text}</p>
              <p className="text-white/30 text-sm mt-6">&mdash; {q.attribution}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center max-w-2xl mx-auto"
        >
          <p className="text-white/40 text-base italic">
            The goal isn&apos;t to make people feel bad. It&apos;s to make the habit visible &mdash; so they can change it.
            Like a casino showing the clock. Except we&apos;re on your side.
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Market() {
  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-hot-pink/3 via-transparent to-electric-purple/3" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-toxic-yellow font-mono text-sm font-semibold tracking-widest uppercase mb-4 block"
        >
          Market Opportunity
        </motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Proven Demand. <span className="text-toxic-yellow">Untapped Model.</span>
        </h2>
        <p className="text-white/50 text-lg mb-16">Digital wellness market: $2.1B by 2027 &nbsp;|&nbsp; Charitable giving via apps: $4.1B annually</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlowCard glowColor="rgba(255,46,151,0.1)">
            <h3 className="text-hot-pink font-heading font-bold text-lg tracking-wide mb-6">OPAL (THE BENCHMARK)</h3>
            <div className="space-y-4">
              {[
                { label: "ARR", value: "$10.3M", color: "text-neon-green" },
                { label: "Monthly Revenue", value: "$400K", color: "text-neon-green" },
                { label: "Downloads/Month", value: "200K", color: "text-neon-green" },
                { label: "Employees", value: "66", color: "text-neon-green" },
                { label: "Time to $10M ARR", value: "~2 years", color: "text-neon-green" },
                { label: "Model", value: "Subscription only", color: "text-white/50" },
              ].map((row, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-white/50 text-sm">{row.label}</span>
                  <span className={`font-mono font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </GlowCard>
          <GlowCard glowColor="rgba(57,255,20,0.1)" delay={0.2}>
            <h3 className="text-neon-green font-heading font-bold text-lg tracking-wide mb-6">SCROLLTOLL (THE OPPORTUNITY)</h3>
            <div className="space-y-4">
              {[
                "Subscription + donation platform fee",
                "7% on every donation (recurring revenue)",
                "B2B corporate wellness licensing",
                "Sponsored charity placements",
                "Social/viral sharing mechanics",
                "Brand partnerships & campaigns",
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-3 pb-3 border-b border-white/5">
                  <span className="text-neon-green">&#x2726;</span>
                  <span className="text-white/80 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </AnimatedSection>
  );
}

function Revenue() {
  const streams = [
    { icon: "💰", title: "PLATFORM FEE (7%)", desc: "On every donation processed. User pays $2, we keep $0.14, charity gets $1.86.", when: "DAY 1", color: "text-neon-green", glow: "rgba(57,255,20,0.15)" },
    { icon: "👑", title: "PREMIUM ($4.99/mo)", desc: "Multi-app monitoring, analytics dashboard, custom themes, leaderboards, tax receipts.", when: "MONTH 3", color: "text-hot-pink", glow: "rgba(255,46,151,0.15)" },
    { icon: "🏢", title: "B2B WELLNESS", desc: "$5-10/employee/month. Corporate digital wellness with ESG reporting.", when: "MONTH 6", color: "text-electric-purple", glow: "rgba(191,0,255,0.15)" },
    { icon: "📣", title: "SPONSORED CAUSES", desc: "Nonprofits pay for featured placement in the donation shield. $500-5K/month.", when: "MONTH 6", color: "text-toxic-yellow", glow: "rgba(204,255,0,0.15)" },
  ];

  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-neon-green font-mono text-sm font-semibold tracking-widest uppercase mb-4 block">Revenue Model</motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-16">Multiple Revenue Streams.<br /><span className="text-white/40">Not Just One Trick.</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {streams.map((s, i) => (
            <GlowCard key={i} delay={i * 0.12} glowColor={s.glow} className="flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className={`font-heading font-bold text-base tracking-wide mb-3 ${s.color}`}>{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
              <div className={`mt-6 font-mono text-xs font-bold ${s.color}`}>{s.when}</div>
            </GlowCard>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function Leaderboard() {
  const entries = [
    { rank: 1, name: "SarahDoom", hours: "47h", donated: "$94", title: "VOID CHAMPION", highlight: false },
    { rank: 2, name: "DarkScroller", hours: "38h", donated: "$76", title: "CHAOS AGENT", highlight: false },
    { rank: 3, name: "TikTokTyrant", hours: "31h", donated: "$62", title: "DOOM DEALER", highlight: false },
    { rank: 4, name: "ReelAddict", hours: "24h", donated: "$48", title: "VOID FEEDER", highlight: false },
    { rank: 5, name: "You", hours: "12h", donated: "$24", title: "SCROLL NOVICE", highlight: true },
  ];

  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-neon-green/2 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-hot-pink font-mono text-sm font-semibold tracking-widest uppercase mb-4 block">The Leaderboard</motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Shame Is the Feature.</h2>
        <p className="text-white/50 text-xl mb-16">Sharing is the growth engine.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlowCard glowColor="rgba(57,255,20,0.1)" className="overflow-hidden">
            <h3 className="text-neon-green font-heading font-bold text-lg tracking-wide mb-6">🏆 HALL OF DOOM</h3>
            <div className="space-y-1">
              {entries.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.1 }}
                  className={`grid grid-cols-[2rem_1fr_4rem_4.5rem_auto] gap-2 items-center py-3 px-3 rounded-xl text-sm ${e.highlight ? "bg-neon-green/15 border border-neon-green/20" : "hover:bg-white/5"} transition-colors`}
                >
                  <span className="text-neon-green font-mono font-bold">{e.rank}</span>
                  <span className={`font-medium ${e.highlight ? "text-neon-green" : "text-white/80"}`}>{e.name}</span>
                  <span className="text-hot-pink font-mono text-xs">{e.hours}</span>
                  <span className="text-neon-green font-mono text-xs">{e.donated}</span>
                  <span className="text-white/30 font-mono text-xs hidden sm:block">{e.title}</span>
                </motion.div>
              ))}
            </div>
          </GlowCard>
          <GlowCard glowColor="rgba(255,46,151,0.1)" delay={0.2}>
            <h3 className="text-hot-pink font-heading font-bold text-lg tracking-wide mb-6">📢 BUILT TO SHARE</h3>
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-dark-surface rounded-xl p-4 border border-neon-green/10">
                <p className="text-neon-green font-mono text-sm leading-relaxed">&quot;Well done! You fed the troll AND a child by throwing your time into the void.&quot;</p>
              </motion.div>
              {[
                "Auto-generated doom scrolling report cards \u2014 shareable to Instagram Stories",
                "Challenge friends: \"I bet I can scroll less than you this week\"",
                "Monthly \"Doom Awards\" \u2014 Most Improved, Biggest Donor, Lost Cause",
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.15 }} className="flex items-start gap-3">
                  <span className="text-hot-pink mt-1">&#x25B8;</span>
                  <p className="text-white/60 text-sm">{item}</p>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </AnimatedSection>
  );
}

function AlternativeTolls() {
  const tolls = [
    { title: "CHARITY DONATION", desc: "The core toll. One tap, money goes to a real nonprofit. Guilt becomes impact.", tag: "CORE", tagColor: "bg-neon-green text-black" },
    { title: "SWEAR JAR", desc: "Set a dollar amount. Every time you exceed your limit, it goes into a pot. Cash out or donate monthly.", tag: "V2", tagColor: "bg-hot-pink text-white" },
    { title: "SOCIAL SHAME", desc: "Auto-post your scroll time to social. \"I just spent 2 hours on TikTok. I'm not okay.\" (opt-in, obviously.)", tag: "V2", tagColor: "bg-electric-purple text-white" },
    { title: "FRIEND TAX", desc: "Your doom scrolling buys your friend a coffee via Venmo. They'll definitely tell you about it.", tag: "V3", tagColor: "bg-toxic-yellow text-black" },
    { title: "ACCOUNTABILITY BUDDY", desc: "Automated text to someone you trust: \"Hey, Patrick just doom scrolled for 45 minutes straight.\"", tag: "V3", tagColor: "bg-toxic-yellow text-black" },
    { title: "CORPORATE WELLNESS", desc: "Teams compete. Lowest collective scroll time wins a team lunch. Worst team buys pizza.", tag: "B2B", tagColor: "bg-hot-pink text-white" },
  ];

  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-electric-purple font-mono text-sm font-semibold tracking-widest uppercase mb-4 block">Beyond Donations</motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">The Toll Can Be <span className="text-electric-purple text-glow-purple">Anything.</span></h2>
        <p className="text-white/50 text-xl mb-16">Donations Are Just the Start.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tolls.map((t, i) => (
            <GlowCard key={i} delay={i * 0.1} glowColor={i % 3 === 0 ? "rgba(57,255,20,0.1)" : i % 3 === 1 ? "rgba(255,46,151,0.1)" : "rgba(191,0,255,0.1)"}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-base text-neon-green tracking-wide">{t.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${t.tagColor}`}>{t.tag}</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{t.desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function TechTraction() {
  const stack = [
    "SwiftUI + MVVM architecture (iOS 16+)",
    "Apple Screen Time API (FamilyControls)",
    "Stripe Connect (payment processing)",
    "Every.org / Change API (charity disbursement)",
    "Firebase Auth + Firestore + Cloud Functions",
    "OS-level shield (appears over any app)",
    "App Group shared data across extensions",
  ];
  const status = [
    { item: "Core app built & running on device", state: "DONE", color: "text-neon-green" },
    { item: "Screen Time monitoring integrated", state: "DONE", color: "text-neon-green" },
    { item: "Stripe payment flow working", state: "DONE", color: "text-neon-green" },
    { item: "Doom metal UI/UX complete", state: "DONE", color: "text-neon-green" },
    { item: "Charity API integrated", state: "DONE", color: "text-neon-green" },
    { item: "Change.io partnership (in talks)", state: "IN PROGRESS", color: "text-toxic-yellow" },
    { item: "Firebase backend deployment", state: "NEXT", color: "text-white/30" },
    { item: "TestFlight beta launch", state: "Q2 2026", color: "text-white/30" },
  ];

  return (
    <AnimatedSection className="py-16 md:py-24 px-6 md:px-12 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-surface/50 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-neon-green font-mono text-sm font-semibold tracking-widest uppercase mb-4 block">Built & Ready</motion.span>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-16">Not a Pitch. <span className="text-neon-green text-glow-green">A Product.</span></h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlowCard glowColor="rgba(57,255,20,0.08)">
            <h3 className="text-hot-pink font-heading font-bold text-lg tracking-wide mb-6">TECH STACK</h3>
            <div className="space-y-3">
              {stack.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green flex-shrink-0" />
                  <span className="text-white/70">{item}</span>
                </motion.div>
              ))}
            </div>
          </GlowCard>
          <GlowCard glowColor="rgba(57,255,20,0.08)" delay={0.15}>
            <h3 className="text-hot-pink font-heading font-bold text-lg tracking-wide mb-6">STATUS</h3>
            <div className="space-y-3">
              {status.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between text-sm border-b border-white/5 pb-3">
                  <span className="text-white/60">{s.item}</span>
                  <span className={`font-mono font-bold text-xs ${s.color}`}>{s.state}</span>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </div>
      </div>
    </AnimatedSection>
  );
}

function Close() {
  return (
    <section id="contact" className="relative py-32 md:py-40 px-6 md:px-12 text-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neon-green/5 blur-[150px]" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-hot-pink/5 blur-[100px]" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [-0.5, 0.5, -0.5],
              scale: [1, 1.015, 1],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto w-fit mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-neon-green/10 blur-2xl scale-110" />
            <Image
              src="/troll.png"
              alt="ScrollToll Troll"
              width={140}
              height={140}
              className="relative z-10 mx-auto drop-shadow-[0_0_40px_rgba(57,255,20,0.5)] drop-shadow-[0_0_80px_rgba(57,255,20,0.2)]"
            />
          </motion.div>
          <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="text-neon-green text-glow-green">THE VOID</span><br />
            <span className="text-hot-pink text-glow-pink">IS OPEN.</span>
          </h2>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-white/60 text-lg md:text-xl mb-12 max-w-xl mx-auto">
          Your doom scrolling could feed a child, plant a tree, or provide clean water &mdash; every single day. All it costs is your guilt.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="space-y-4">
          <div className="font-heading text-xl font-semibold text-white">Pat &amp; Jon, Founders</div>
          <a href="mailto:hello@scrolltoll.com" className="inline-block text-neon-green hover:underline">Hello@scrolltoll.com</a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 }} className="mt-16">
          <a href="mailto:hello@scrolltoll.com?subject=Let's%20Feed%20the%20Void" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-neon-green text-black font-heading font-bold text-lg hover:shadow-[0_0_40px_rgba(57,255,20,0.5)] hover:scale-105 transition-all">
            FEED THE VOID &rarr;
          </a>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 }} className="mt-20 pt-8 border-t border-white/5 text-white/20 text-sm">
          SCROLLTOLL &nbsp;|&nbsp; 2026
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-void min-h-screen">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <Voice />
      <Market />
      <Revenue />
      <Leaderboard />
      <AlternativeTolls />
      <TechTraction />
      <Close />
    </main>
  );
}

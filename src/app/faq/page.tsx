import Link from "next/link";

const faqItems = [
  {
    question: "What is Our Change Foundation?",
    answer:
      "Our Change Foundation is a 501(c)(3) donor-advised fund partner for our donation platform. They help distribute funds to charities across the United States.",
  },
  {
    question: "Where does my donation go?",
    answer:
      "Your toll is split: 7% is a platform fee retained by ScrollToll, and 93% is a charitable donation processed through Our Change Foundation (EIN: 86-3353394) to your chosen nonprofit.",
  },
  {
    question: "Are my donations tax-deductible?",
    answer:
      "The charitable donation portion (93% of your toll) is tax-deductible to the extent allowed by law. Tax receipts are issued by Our Change Foundation.",
  },
  {
    question: "How long until my charity receives the funds?",
    answer:
      "Our Change Foundation disburses grants to charities within 365 days of receiving the contribution, though most disbursements happen much sooner (typically monthly).",
  },
  {
    question: "How do I get a tax receipt?",
    answer:
      "Tax receipts are sent to the email associated with your ScrollToll account after each Scroll Jar charge is processed.",
  },
];

function LegalNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/70 px-5 py-4 backdrop-blur-md md:px-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="font-heading text-xl font-bold tracking-widest">
          <span className="text-neon-green text-glow-green">SCROLL</span>
          <span className="text-hot-pink text-glow-pink">TOLL</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/#how-it-works"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            How It Works
          </Link>
          <Link
            href="/#where-money-goes"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            Transparency
          </Link>
          <Link
            href="/#faq"
            className="hidden text-sm text-white/50 transition-colors hover:text-white sm:inline"
          >
            FAQ
          </Link>
          <Link
            href="/#waitlist"
            className="inline-flex items-center gap-2 rounded-full border border-neon-green/30 px-4 py-2 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10 hover:shadow-[0_0_24px_rgba(57,255,20,0.25)]"
          >
            Join Waitlist &rarr;
          </Link>
        </div>
      </div>
    </nav>
  );
}

function LegalFooter() {
  return (
    <footer className="border-t border-white/5 px-6 py-12 text-center md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="font-heading text-2xl font-bold tracking-[0.2em] text-white">SCROLLTOLL</div>
        <p className="mt-4 text-sm text-gray-500">Turning screen time into impact. One toll at a time.</p>
        <p className="mt-3 text-sm text-gray-500">Pat &amp; Jon, Founders</p>
        <a
          href="mailto:hello@scrolltoll.me"
          className="mt-2 inline-block text-sm text-neon-green transition-colors hover:text-white"
        >
          hello@scrolltoll.me
        </a>
        <div className="mt-6 flex items-center justify-center gap-6">
          <Link href="/deck" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
            For Investors
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/privacy" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
            Privacy Policy
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/terms" className="text-xs text-gray-600 transition-colors hover:text-gray-400">
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

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-void text-white">
      <LegalNav />
      <section className="px-6 pt-32 pb-16 md:px-10">
        <div className="mx-auto max-w-[700px]">
          <Link href="/" className="text-sm text-neon-green transition-colors hover:text-white">
            &larr; Back to home
          </Link>
          <h1 className="mt-6 font-heading text-4xl font-bold text-neon-green sm:text-5xl">FAQ</h1>
          <p className="mt-3 text-sm text-gray-500">
            Common questions about how ScrollToll, Our Change Foundation, and charitable tolls work.
          </p>

          <div className="mt-10 space-y-8">
            {faqItems.map((item) => (
              <section key={item.question} className="rounded-3xl border border-white/8 bg-[#111128]/70 p-6">
                <h2 className="font-heading text-2xl font-bold text-neon-green">{item.question}</h2>
                <p className="mt-4 text-base leading-8 text-gray-300">{item.answer}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
      <LegalFooter />
    </main>
  );
}

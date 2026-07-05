"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { authHeaders, captureToken } from "@/lib/client-token";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function BrandMark() {
  return (
    <Link href="/" className="font-heading text-xl font-bold tracking-widest">
      <span className="text-neon-green text-glow-green">SCROLL</span>
      <span className="text-hot-pink text-glow-pink">TOLL</span>
    </Link>
  );
}

type SetupPageClientProps = {
  uid: string;
  charity: string;
  amount: string;
};

export default function SetupPageClient({
  charity: charityParam,
  amount: amountParam,
}: SetupPageClientProps) {
  const charity = charityParam.trim() || "Your selected nonprofit";
  const parsedAmount = Number(amountParam);
  const amount = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 2;
  const platformFee = useMemo(() => Number((amount * 0.07).toFixed(2)), [amount]);
  const donationAmount = useMemo(() => Number(amount.toFixed(2)), [amount]);

  const [consentBilling, setConsentBilling] = useState(false);
  const [consentDisclosure, setConsentDisclosure] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  // The iOS app passes a short-lived Firebase ID token in the URL fragment.
  // Capture it (into sessionStorage, surviving the Stripe round-trip) on mount.
  useEffect(() => {
    setHasToken(Boolean(captureToken()));
  }, []);

  const canContinue = hasToken && consentBilling && consentDisclosure && !isLoading;

  async function handleCheckout() {
    if (!canContinue) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          charity,
          amount,
        }),
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to open Stripe Checkout");
      }

      window.location.assign(payload.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Unable to continue");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 text-white md:px-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between pb-8">
        <BrandMark />
        <Link
          href="/privacy"
          className="text-sm text-white/50 transition-colors hover:text-white"
        >
          Privacy
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-sm uppercase tracking-[0.35em] text-neon-green">
            Hosted Payment Setup
          </p>
          <h1 className="mt-4 font-heading text-4xl font-black text-white sm:text-5xl">
            SET UP YOUR GIVING
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-400">
            This is the only place ScrollToll saves a card. No charge happens here. You are authorizing
            future off-session toll charges only after you exceed your own limits.
          </p>
        </motion.div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-hot-pink">How It Works</p>
            <ol className="mt-5 space-y-3 text-sm leading-7 text-gray-300 sm:text-base">
              <li>1. You set screen time limits.</li>
              <li>2. When you go over, a toll is added to your Scroll Jar.</li>
              <li>3. Your jar empties weekly or at $10 - that's when you're charged.</li>
              <li>
                4. Your donation goes to <span className="text-white">{charity}</span> through Our
                Change Foundation.
              </li>
            </ol>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-hot-pink">
              Your Toll Breakdown
            </p>
            <div className="mt-5 space-y-2 text-sm text-gray-300 sm:text-base">
              <p className="text-xl font-bold text-white">{formatCurrency(donationAmount)} donation amount</p>
              <p>|-- {formatCurrency(donationAmount)} charitable donation (100%)</p>
              <p className="pl-6 text-neon-green">{"->"} {charity}</p>
              <p>|-- {formatCurrency(platformFee)} platform fee (7%) charged separately</p>
              <p>|-- standard payment processing costs charged separately</p>
            </div>
            <div className="mt-5 rounded-2xl border border-neon-green/15 bg-black/40 p-4 text-sm text-gray-400">
              <p>Donations received by</p>
              <p className="mt-1 font-heading text-lg font-bold text-white">Our Change Foundation</p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-neon-green">
                501(c)(3) • EIN 86-3353394
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
            <div className="space-y-5 text-sm leading-7 text-gray-300 sm:text-base">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consentBilling}
                  onChange={(event) => setConsentBilling(event.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-black text-neon-green focus:ring-neon-green"
                />
                <span>
                  I authorize ScrollToll to charge my saved payment method on a weekly basis
                  (or when my Scroll Jar reaches $10) for toll amounts I incur by exceeding my
                  screen time limits.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={consentDisclosure}
                  onChange={(event) => setConsentDisclosure(event.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-white/20 bg-black text-neon-green focus:ring-neon-green"
                />
                <span>
                  I understand that 100% of my donation is delivered to my chosen nonprofit
                  through Our Change Foundation (EIN 86-3353394). ScrollToll charges a separate 7%
                  platform fee and standard processing costs on top. These fees are not deducted
                  from my donation amount.
                </span>
              </label>
            </div>
          </section>
        </div>

        {error ? (
          <p className="mt-5 rounded-2xl border border-hot-pink/30 bg-hot-pink/10 px-4 py-3 text-sm text-hot-pink">
            {error}
          </p>
        ) : null}

        {!hasToken ? (
          <p className="mt-5 rounded-2xl border border-hot-pink/30 bg-hot-pink/10 px-4 py-3 text-sm text-hot-pink">
            Your secure session expired or is missing. Re-open this page from the ScrollToll app to continue.
          </p>
        ) : null}

        <button
          type="button"
          disabled={!canContinue}
          onClick={handleCheckout}
          className="mt-8 flex w-full items-center justify-center rounded-full bg-neon-green px-8 py-4 font-heading text-lg font-bold text-black transition-all hover:shadow-[0_0_28px_rgba(57,255,20,0.35)] disabled:cursor-not-allowed disabled:bg-[#263224] disabled:text-black/40 disabled:shadow-none"
        >
          {isLoading ? "OPENING STRIPE..." : "SET UP PAYMENT - STRIPE"}
        </button>

        <p className="mt-5 text-center text-sm text-gray-400">
          You can pause or cancel giving anytime in the ScrollToll app settings.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-gray-500">
          <Link href="/privacy" className="transition-colors hover:text-white">
            Privacy Policy
          </Link>
          <span className="text-gray-700">|</span>
          <Link href="/terms" className="transition-colors hover:text-white">
            Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authHeaders, captureToken } from "@/lib/client-token";
import posthog from "posthog-js";

type AccountStatus = {
  hasPaymentSetup: boolean;
  paused: boolean;
  cardBrand: string | null;
  cardLast4: string | null;
  charity: string | null;
  tollAmount: number | null;
};

function BrandMark() {
  return (
    <Link href="/" className="font-heading text-xl font-bold tracking-widest">
      <span className="text-neon-green text-glow-green">SCROLL</span>
      <span className="text-hot-pink text-glow-pink">TOLL</span>
    </Link>
  );
}

function titleCaseBrand(brand: string | null) {
  if (!brand) {
    return "Card";
  }

  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

export default function AccountPageClient() {
  const [status, setStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<"update" | "pause" | "cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Capture the Firebase ID token the app passed in the URL fragment.
    const token = captureToken();
    setHasToken(Boolean(token));

    async function loadStatus() {
      if (!token) {
        setLoading(false);
        setError("Your secure session expired or is missing. Open this page from the ScrollToll app.");
        return;
      }

      try {
        const response = await fetch("/api/payment-status", {
          cache: "no-store",
          headers: { ...authHeaders() },
        });
        const payload = (await response.json()) as AccountStatus & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load payment settings");
        }

        setStatus(payload);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load payment settings");
      } finally {
        setLoading(false);
      }
    }

    void loadStatus();
  }, []);

  const cardLabel = useMemo(() => {
    if (!status?.hasPaymentSetup || !status.cardLast4) {
      return "No payment method saved";
    }

    return `${titleCaseBrand(status.cardBrand)} ending in ${status.cardLast4}`;
  }, [status]);

  async function startUpdate() {
    if (!hasToken) {
      return;
    }

    setBusyAction("update");
    setError(null);

    try {
      const response = await fetch("/api/update-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to open Stripe Checkout");
      }

      posthog.capture("payment_update_started");
      window.location.assign(payload.url);
    } catch (updateError) {
      posthog.captureException(updateError);
      setBusyAction(null);
      setError(updateError instanceof Error ? updateError.message : "Unable to update payment method");
    }
  }

  async function togglePause(nextPaused: boolean) {
    if (!hasToken || !status) {
      return;
    }

    setBusyAction("pause");
    setError(null);

    try {
      const response = await fetch("/api/update-payment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          paused: nextPaused,
        }),
      });

      const payload = (await response.json()) as { error?: string; paused?: boolean };

      if (!response.ok || typeof payload.paused !== "boolean") {
        throw new Error(payload.error || "Unable to update giving status");
      }

      posthog.capture(payload.paused ? "giving_paused" : "giving_resumed");
      setStatus({
        ...status,
        paused: payload.paused,
      });
    } catch (pauseError) {
      posthog.captureException(pauseError);
      setError(pauseError instanceof Error ? pauseError.message : "Unable to update giving status");
    } finally {
      setBusyAction(null);
    }
  }

  async function cancelPayment() {
    if (!hasToken || !status) {
      return;
    }

    setBusyAction("cancel");
    setError(null);

    try {
      const response = await fetch("/api/cancel-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to remove payment method");
      }

      posthog.capture("payment_removed");
      setStatus({
        ...status,
        hasPaymentSetup: false,
        paused: false,
        cardBrand: null,
        cardLast4: null,
      });
    } catch (cancelError) {
      posthog.captureException(cancelError);
      setError(cancelError instanceof Error ? cancelError.message : "Unable to remove payment method");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-8 text-white md:px-10">
      <div className="mx-auto flex max-w-5xl items-center justify-between pb-8">
        <BrandMark />
        <a
          href="scrolltoll://payment-complete?source=portal"
          className="text-sm text-white/50 transition-colors hover:text-white"
        >
          Return to App
        </a>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.35em] text-neon-green">
            Payment Management
          </p>
          <h1 className="mt-4 font-heading text-4xl font-black text-white sm:text-5xl">
            Manage Your Scroll Jar
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-400">
            Update the card on file, pause weekly charges, or remove payment access entirely.
          </p>
        </div>

        {error ? (
          <p className="mb-5 rounded-2xl border border-hot-pink/30 bg-hot-pink/10 px-4 py-3 text-sm text-hot-pink">
            {error}
          </p>
        ) : null}

        <section className="rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-hot-pink">Card on File</p>
              <p className="mt-3 text-xl font-bold text-white">
                {loading ? "Loading..." : cardLabel}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {status?.charity
                  ? `Current charity: ${status.charity}${status.tollAmount ? ` • $${status.tollAmount.toFixed(2)} toll` : ""}`
                  : "Your saved payment method is only charged after tolls accumulate."}
              </p>
            </div>
            <button
              type="button"
              onClick={startUpdate}
              disabled={loading || !hasToken || busyAction !== null}
              className="rounded-full border border-neon-green/30 px-5 py-3 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30"
            >
              {busyAction === "update" ? "Opening Stripe..." : "Update Payment Method"}
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-[#141414] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-hot-pink">Pause Giving</p>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                When paused, ScrollToll can still track tolls, but your weekly or $10 Scroll Jar charge
                should not run until you turn giving back on.
              </p>
            </div>
            <button
              type="button"
              aria-pressed={Boolean(status?.paused)}
              onClick={() => togglePause(!status?.paused)}
              disabled={loading || !status?.hasPaymentSetup || busyAction !== null}
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors disabled:cursor-not-allowed ${
                status?.paused
                  ? "border-hot-pink/40 bg-hot-pink/20"
                  : "border-neon-green/30 bg-neon-green/15"
              }`}
            >
              <span
                className={`absolute h-6 w-6 rounded-full bg-white transition-transform ${
                  status?.paused ? "translate-x-1" : "translate-x-7"
                }`}
              />
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            {status?.paused ? "Giving is paused." : "Giving is active."}
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-hot-pink/20 bg-[#1A0D14] p-6 shadow-[0_0_40px_rgba(0,0,0,0.25)]">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-hot-pink">Cancel and Remove Card</p>
          <p className="mt-3 text-sm leading-7 text-gray-300">
            This removes your saved payment method from ScrollToll and prevents future off-session
            charges until you set up payment again.
          </p>
          <button
            type="button"
            onClick={cancelPayment}
            disabled={loading || !status?.hasPaymentSetup || busyAction !== null}
            className="mt-5 rounded-full border border-hot-pink/40 px-5 py-3 text-sm font-bold text-hot-pink transition-all hover:bg-hot-pink/10 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/30"
          >
            {busyAction === "cancel" ? "Removing..." : "Cancel and Remove Card"}
          </button>
        </section>

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

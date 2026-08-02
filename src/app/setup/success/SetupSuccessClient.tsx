"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import posthog from "posthog-js";

const APP_REDIRECT_URL = "https://www.scrolltoll.me/payment/return?success=true";

function BrandMark() {
  return (
    <Link href="/" className="font-heading text-xl font-bold tracking-widest">
      <span className="text-neon-green text-glow-green">SCROLL</span>
      <span className="text-hot-pink text-glow-pink">TOLL</span>
    </Link>
  );
}

type SetupSuccessClientProps = {
  sessionId: string;
  purpose: "setup" | "account";
};

export default function SetupSuccessClient({ sessionId, purpose }: SetupSuccessClientProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Saving your payment method...");
  const [showFallbackLink, setShowFallbackLink] = useState(false);

  const returnLabel = useMemo(() => {
    if (status === "success") {
      return "Return to ScrollToll";
    }

    if (status === "error") {
      return "Open ScrollToll";
    }

    return "Waiting for ScrollToll";
  }, [status]);

  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    async function finalizeSetup() {
      if (!sessionId) {
        setStatus("error");
        setMessage("Missing payment confirmation details. Re-open this flow from ScrollToll.");
        return;
      }

      setStatus("loading");

      try {
        const response = await fetch("/api/confirm-setup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId, purpose }),
        });

        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to save payment setup");
        }

        setStatus("success");
        setMessage("Payment method saved. Returning you to ScrollToll...");
        posthog.capture("payment_setup_completed");

        fallbackTimer = setTimeout(() => {
          setShowFallbackLink(true);
        }, 2000);

        redirectTimer = setTimeout(() => {
          window.location.href = APP_REDIRECT_URL;
        }, 2000);
      } catch (error) {
        posthog.capture("payment_setup_failed", {
          stage: "confirmation",
          failure_category: error instanceof Error ? error.name : "unknown",
        });
        posthog.captureException(error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to finalize setup");
        setShowFallbackLink(true);
      }
    }

    void finalizeSetup();

    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
  }, [sessionId, purpose]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-6 py-8 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#141414] p-8 text-center shadow-[0_0_50px_rgba(0,0,0,0.35)]">
        <div className="mb-8 flex justify-center">
          <BrandMark />
        </div>
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-neon-green">Payment Ready</p>
        <h1 className="mt-4 font-heading text-4xl font-black text-white">Setup Complete</h1>
        <p className="mt-4 text-base leading-7 text-gray-400">{message}</p>

        <button
          type="button"
          onClick={() => {
            window.location.href = APP_REDIRECT_URL;
          }}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-neon-green/30 px-6 py-3 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10"
        >
          {returnLabel}
        </button>

        {showFallbackLink ? (
          <div className="mt-5 text-sm text-gray-400">
            <p>If ScrollToll does not reopen automatically, use this link:</p>
            <a
              href={APP_REDIRECT_URL}
              onClick={(event) => {
                event.preventDefault();
                window.location.href = APP_REDIRECT_URL;
              }}
              className="mt-2 inline-flex text-neon-green underline underline-offset-4"
            >
              Open ScrollToll
            </a>
          </div>
        ) : null}

        {status === "error" ? (
          <p className="mt-5 text-sm text-gray-500">
            If the deep link fails, reopen the ScrollToll app manually and try again.
          </p>
        ) : null}
      </div>
    </main>
  );
}

import { NextResponse } from "next/server";
import { ensureStripeCustomerId, getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";
import { AuthError, requireUid } from "@/lib/require-auth";
import { getPostHogClient } from "@/lib/posthog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://scrolltoll.me";
}

export async function POST(request: Request) {
  try {
    const uid = await requireUid(request, "setup");

    const body = (await request.json()) as {
      charity?: string;
      amount?: number | string;
    };

    // Cap/clamp client-supplied values before persisting or sending to Stripe.
    // Charity is display-only text; Stripe metadata values are limited to 500
    // chars and we never want unbounded input stored/reflected.
    const rawCharity = body.charity?.trim() || "Your selected nonprofit";
    const charity = rawCharity.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 100);
    const amount = Number(body.amount);
    const MAX_TOLL_AMOUNT = 100; // dollars; matches the app's per-toll ceiling
    const normalizedAmount =
      Number.isFinite(amount) && amount > 0 ? Math.min(amount, MAX_TOLL_AMOUNT) : 2;

    const stripe = await getStripe();
    const customerId = await ensureStripeCustomerId(uid);
    const { ref } = await getUserPaymentProfile(uid);

    await ref.set(
      {
        selectedCharityName: charity,
        tollAmount: normalizedAmount,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    const baseUrl = getBaseUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      customer: customerId,
      payment_method_types: ["card"],
      success_url: `${baseUrl}/setup/success?session_id={CHECKOUT_SESSION_ID}&purpose=setup`,
      cancel_url:
        `${baseUrl}/setup?charity=${encodeURIComponent(charity)}` +
        `&amount=${encodeURIComponent(normalizedAmount)}&cancelled=1`,
      metadata: {
        firebaseUid: uid,
        purpose: "setup",
        charityName: charity,
        tollAmount: String(normalizedAmount),
      },
    });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: uid,
      event: "payment_setup_session_created",
      properties: {
        charity,
        amount: normalizedAmount,
      },
    });
    await posthog.shutdown();

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("create-checkout-session error", error);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}

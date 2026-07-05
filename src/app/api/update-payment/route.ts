import { NextResponse } from "next/server";
import { ensureStripeCustomerId, getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";
import { AuthError, requireUid } from "@/lib/require-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://scrolltoll.me";
}

export async function POST(request: Request) {
  try {
    const uid = await requireUid(request);

    const stripe = await getStripe();
    const customerId = await ensureStripeCustomerId(uid);
    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "setup",
      customer: customerId,
      payment_method_types: ["card"],
      success_url: `${baseUrl}/setup/success?session_id={CHECKOUT_SESSION_ID}&uid=${encodeURIComponent(uid)}`,
      cancel_url: `${baseUrl}/account?uid=${encodeURIComponent(uid)}`,
      metadata: {
        firebaseUid: uid,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("update-payment (POST) error", error);
    return NextResponse.json({ error: "Unable to update payment method" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const uid = await requireUid(request);

    const body = (await request.json()) as { paused?: boolean };

    if (typeof body.paused !== "boolean") {
      return NextResponse.json({ error: "Missing paused" }, { status: 400 });
    }

    const { ref } = await getUserPaymentProfile(uid);

    await ref.set(
      {
        givingPaused: body.paused,
        paymentConsentStatus: body.paused ? "paused" : "active",
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ success: true, paused: body.paused });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("update-payment (PATCH) error", error);
    return NextResponse.json({ error: "Unable to update payment state" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { ensureStripeCustomerId, getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://scrolltoll.me";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { uid?: string };
    const uid = body.uid?.trim();

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const stripe = getStripe();
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
    const message = error instanceof Error ? error.message : "Unable to update payment method";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as { uid?: string; paused?: boolean };
    const uid = body.uid?.trim();

    if (!uid || typeof body.paused !== "boolean") {
      return NextResponse.json({ error: "Missing uid or paused" }, { status: 400 });
    }

    const { ref } = await getUserPaymentProfile(uid);

    await ref.set(
      {
        givingPaused: body.paused,
        paymentConsentStatus: body.paused ? "paused" : "active",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return NextResponse.json({ success: true, paused: body.paused });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update payment state";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

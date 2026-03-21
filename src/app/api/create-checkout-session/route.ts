import { NextResponse } from "next/server";
import { ensureStripeCustomerId, getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "https://scrolltoll.me";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      uid?: string;
      charity?: string;
      amount?: number | string;
    };

    const uid = body.uid?.trim();

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const charity = body.charity?.trim() || "Your selected nonprofit";
    const amount = Number(body.amount);
    const normalizedAmount = Number.isFinite(amount) && amount > 0 ? amount : 2;

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
      success_url: `${baseUrl}/setup/success?session_id={CHECKOUT_SESSION_ID}&uid=${encodeURIComponent(uid)}`,
      cancel_url: `${baseUrl}/setup?uid=${encodeURIComponent(uid)}&charity=${encodeURIComponent(charity)}&amount=${encodeURIComponent(normalizedAmount)}`,
      metadata: {
        firebaseUid: uid,
        charityName: charity,
        tollAmount: String(normalizedAmount),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

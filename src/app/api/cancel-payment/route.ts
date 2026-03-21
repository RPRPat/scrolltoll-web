import { NextResponse } from "next/server";
import { getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { uid?: string };
    const uid = body.uid?.trim();

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

    const stripe = await getStripe();
    const { ref, data } = await getUserPaymentProfile(uid);

    if (data?.stripePaymentMethodId) {
      await stripe.paymentMethods.detach(data.stripePaymentMethodId);
    }

    await ref.set(
      {
        stripePaymentMethodId: null,
        stripeCardLast4: null,
        stripeCardBrand: null,
        hasPaymentSetup: false,
        givingPaused: false,
        paymentConsentStatus: "cancelled",
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to cancel payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

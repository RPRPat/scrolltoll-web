import { NextResponse } from "next/server";
import { getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";
import { AuthError, requireUid } from "@/lib/require-auth";
import { getPostHogClient, withEnvironment } from "@/lib/posthog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const uid = await requireUid(request, "account");

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

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: uid,
      event: "payment_cancelled",
      properties: withEnvironment(),
    });
    await posthog.shutdown();

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("cancel-payment error", error);
    return NextResponse.json({ error: "Unable to cancel payment" }, { status: 500 });
  }
}

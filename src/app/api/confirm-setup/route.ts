import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import type Stripe from "stripe";
import { getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      uid?: string;
    };

    const sessionId = body.sessionId?.trim();
    const uid = body.uid?.trim();

    if (!sessionId || !uid) {
      return NextResponse.json({ error: "Missing sessionId or uid" }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["setup_intent", "setup_intent.payment_method"],
    });

    if (session.mode !== "setup" || session.status !== "complete") {
      return NextResponse.json({ error: "Checkout session is not complete" }, { status: 400 });
    }

    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    const setupIntent = session.setup_intent as Stripe.SetupIntent | string | null;

    if (!customerId || !setupIntent) {
      return NextResponse.json({ error: "Missing setup intent or customer" }, { status: 400 });
    }

    const resolvedSetupIntent =
      typeof setupIntent === "string"
        ? await stripe.setupIntents.retrieve(setupIntent, { expand: ["payment_method"] })
        : setupIntent;

    const paymentMethod = resolvedSetupIntent.payment_method as Stripe.PaymentMethod | string | null;

    if (!paymentMethod) {
      return NextResponse.json({ error: "Missing payment method" }, { status: 400 });
    }

    const resolvedPaymentMethod =
      typeof paymentMethod === "string"
        ? await stripe.paymentMethods.retrieve(paymentMethod)
        : paymentMethod;

    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: resolvedPaymentMethod.id,
      },
    });

    const { ref } = await getUserPaymentProfile(uid);

    const updatePayload: Record<string, unknown> = {
      stripeCustomerId: customerId,
      stripePaymentMethodId: resolvedPaymentMethod.id,
      stripeCardLast4: resolvedPaymentMethod.card?.last4 ?? null,
      stripeCardBrand: resolvedPaymentMethod.card?.brand ?? null,
      hasPaymentSetup: true,
      givingPaused: false,
      paymentConsentAcceptedAt: FieldValue.serverTimestamp(),
      paymentConsentStatus: "active",
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (session.metadata?.charityName) {
      updatePayload.selectedCharityName = session.metadata.charityName;
    }

    if (session.metadata?.tollAmount) {
      updatePayload.tollAmount = Number(session.metadata.tollAmount);
    }

    await ref.set(updatePayload, { merge: true });

    return NextResponse.json({
      success: true,
      cardBrand: resolvedPaymentMethod.card?.brand ?? null,
      cardLast4: resolvedPaymentMethod.card?.last4 ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm setup";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

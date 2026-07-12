import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getUserPaymentProfile } from "@/lib/payment-store";
import { getStripe } from "@/lib/stripe";
import { getPostHogClient } from "@/lib/posthog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      sessionId?: string;
      uid?: string;
    };

    const sessionId = body.sessionId?.trim();
    const claimedUid = body.uid?.trim();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["setup_intent", "setup_intent.payment_method"],
    });

    if (session.mode !== "setup" || session.status !== "complete") {
      return NextResponse.json({ error: "Checkout session is not complete" }, { status: 400 });
    }

    // Identity comes from the Stripe session's own metadata (stamped at creation
    // by an authenticated create-checkout-session call), NOT from the request
    // body. This prevents an attacker from binding a completed session to a
    // different user's account by supplying someone else's uid.
    const uid =
      typeof session.metadata?.firebaseUid === "string" ?
        session.metadata.firebaseUid.trim() :
        "";

    if (!uid) {
      return NextResponse.json({ error: "Session is not bound to an account" }, { status: 400 });
    }

    // If the client supplied a uid, it must match the session's bound account.
    if (claimedUid && claimedUid !== uid) {
      return NextResponse.json({ error: "Session does not belong to this account" }, { status: 403 });
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
      paymentConsentAcceptedAt: new Date().toISOString(),
      paymentConsentStatus: "active",
      updatedAt: new Date().toISOString(),
    };

    if (session.metadata?.charityName) {
      updatePayload.selectedCharityName = session.metadata.charityName;
    }

    if (session.metadata?.tollAmount) {
      updatePayload.tollAmount = Number(session.metadata.tollAmount);
    }

    await ref.set(updatePayload, { merge: true });

    const posthog = getPostHogClient();
    posthog.capture({
      distinctId: uid,
      event: "payment_confirmed",
      properties: {
        card_brand: resolvedPaymentMethod.card?.brand ?? null,
      },
    });
    await posthog.shutdown();

    return NextResponse.json({
      success: true,
      cardBrand: resolvedPaymentMethod.card?.brand ?? null,
      cardLast4: resolvedPaymentMethod.card?.last4 ?? null,
    });
  } catch (error) {
    console.error("confirm-setup error", error);
    return NextResponse.json({ error: "Unable to confirm setup" }, { status: 500 });
  }
}

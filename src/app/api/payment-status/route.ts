import { NextResponse } from "next/server";
import { getUserPaymentProfile } from "@/lib/payment-store";
import { AuthError, requireUid } from "@/lib/require-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const uid = await requireUid(request, "account");

    const { data } = await getUserPaymentProfile(uid);

    return NextResponse.json({
      hasPaymentSetup: Boolean(data?.hasPaymentSetup && data?.stripePaymentMethodId),
      paused: Boolean(data?.givingPaused),
      cardBrand: data?.stripeCardBrand ?? null,
      cardLast4: data?.stripeCardLast4 ?? null,
      charity: data?.selectedCharityName ?? null,
      tollAmount: data?.tollAmount ?? null,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("payment-status error", error);
    return NextResponse.json({ error: "Unable to retrieve payment status" }, { status: 500 });
  }
}

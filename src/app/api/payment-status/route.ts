import { NextResponse } from "next/server";
import { getUserPaymentProfile } from "@/lib/payment-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid")?.trim();

    if (!uid) {
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });
    }

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
    const message = error instanceof Error ? error.message : "Unable to retrieve payment status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

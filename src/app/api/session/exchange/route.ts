import { NextResponse } from "next/server";
import { exchangeNonce, WEB_SESSION_COOKIE } from "@/lib/web-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { nonce?: string; purpose?: string };
    const nonce = body.nonce?.trim() ?? "";
    if (nonce.length < 32 || (body.purpose !== "setup" && body.purpose !== "account")) {
      return NextResponse.json({ error: "Invalid secure link" }, { status: 400 });
    }
    const session = await exchangeNonce(nonce, body.purpose);
    const response = NextResponse.json({ success: true });
    response.cookies.set(WEB_SESSION_COOKIE, session.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: session.expiresAt,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create secure session" },
      { status: 401 },
    );
  }
}

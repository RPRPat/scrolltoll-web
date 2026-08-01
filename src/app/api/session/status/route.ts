import { NextResponse } from "next/server";
import { AuthError, requireUid } from "@/lib/require-auth";

export async function GET(request: Request) {
  try {
    const purpose = new URL(request.url).searchParams.get("purpose");
    if (purpose !== "setup" && purpose !== "account") {
      return NextResponse.json({ authenticated: false }, { status: 400 });
    }
    await requireUid(request, purpose);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    const status = error instanceof AuthError ? error.status : 500;
    return NextResponse.json({ authenticated: false }, { status });
  }
}

import type Stripe from "stripe";

let stripeClient: Stripe | null = null;

export async function getStripe() {
  if (stripeClient) {
    return stripeClient;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  const mode = process.env.STRIPE_BACKEND_MODE ?? "test";
  const expectedPrefix = mode === "live" ? "sk_live_" : "sk_test_";
  if (!secretKey.startsWith(expectedPrefix)) {
    throw new Error(`Stripe credential does not match configured ${mode} mode`);
  }

  const { default: StripeSdk } = await import("stripe");
  stripeClient = new StripeSdk(secretKey);
  return stripeClient;
}

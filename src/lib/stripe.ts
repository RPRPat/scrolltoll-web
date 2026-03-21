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

  const { default: StripeSdk } = await import("stripe");
  stripeClient = new StripeSdk(secretKey);
  return stripeClient;
}

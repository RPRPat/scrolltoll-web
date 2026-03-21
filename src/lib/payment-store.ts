import { getAdminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe";

export type StoredPaymentProfile = {
  stripeCustomerId?: string | null;
  stripePaymentMethodId?: string | null;
  stripeCardLast4?: string | null;
  stripeCardBrand?: string | null;
  hasPaymentSetup?: boolean;
  givingPaused?: boolean;
  selectedCharityName?: string | null;
  tollAmount?: number | null;
};

const USER_COLLECTION = "users";

export async function getUserPaymentProfile(uid: string) {
  const adminDb = await getAdminDb();
  const userRef = adminDb.collection(USER_COLLECTION).doc(uid);
  const snapshot = await userRef.get();
  const data = snapshot.data() as StoredPaymentProfile | undefined;

  return {
    ref: userRef,
    data: data ?? null,
  };
}

export async function ensureStripeCustomerId(uid: string) {
  const { ref, data } = await getUserPaymentProfile(uid);

  if (data?.stripeCustomerId) {
    return data.stripeCustomerId;
  }

  const stripe = await getStripe();
  const customer = await stripe.customers.create({
    metadata: {
      firebaseUid: uid,
    },
  });

  await ref.set(
    {
      stripeCustomerId: customer.id,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  return customer.id;
}

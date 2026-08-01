import { createHash, randomBytes } from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";

export const WEB_SESSION_COOKIE = "scrolltoll_web_session";
const SESSION_TTL_MS = 15 * 60 * 1000;
export type WebSessionPurpose = "setup" | "account";

export type WebSessionIdentity = {
  uid: string;
  purpose: WebSessionPurpose;
};

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function exchangeNonce(nonce: string, purpose: WebSessionPurpose) {
  const db = await getAdminDb();
  const nonceRef = db.collection("webSessionNonces").doc(hash(nonce));
  const token = randomBytes(32).toString("base64url");
  const sessionRef = db.collection("webSessions").doc(hash(token));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

  const uid = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(nonceRef);
    const data = snapshot.data();
    const nonceExpiresAt = data?.expiresAt?.toDate?.() as Date | undefined;
    if (!snapshot.exists || data?.status !== "issued" || data?.purpose !== purpose ||
        !nonceExpiresAt || nonceExpiresAt <= now || typeof data.uid !== "string") {
      throw new Error("This secure link is invalid, expired, or already used.");
    }
    transaction.update(nonceRef, { status: "consumed", consumedAt: now });
    transaction.set(sessionRef, { uid: data.uid, purpose, createdAt: now, expiresAt });
    return data.uid as string;
  });

  return { token, uid, expiresAt };
}

export async function identityForWebSession(token: string): Promise<WebSessionIdentity | null> {
  if (!token) return null;
  const db = await getAdminDb();
  const snapshot = await db.collection("webSessions").doc(hash(token)).get();
  const data = snapshot.data();
  const expiresAt = data?.expiresAt?.toDate?.() as Date | undefined;
  if (!snapshot.exists || !data || !expiresAt || expiresAt <= new Date() ||
      typeof data.uid !== "string" ||
      (data.purpose !== "setup" && data.purpose !== "account")) {
    return null;
  }
  return { uid: data.uid, purpose: data.purpose };
}

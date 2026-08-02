import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";

type ServiceAccountPayload = {
  project_id: string;
  client_email: string;
  private_key: string;
};

let firebaseAdminApp: App | null = null;
let firestoreDb: Firestore | null = null;

function getServiceAccount() {
  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!rawKey) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
  }

  const parsedKey = JSON.parse(rawKey) as ServiceAccountPayload;
  const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT ?? "staging";
  const expectedProject =
    environment === "production" ? "scrolltoll-238a6" : "scrolltoll-staging";

  if (parsedKey.project_id !== expectedProject) {
    throw new Error(
      `Firebase credential project mismatch for ${environment}: expected ${expectedProject}`,
    );
  }

  return {
    projectId: parsedKey.project_id,
    clientEmail: parsedKey.client_email,
    privateKey: parsedKey.private_key.replace(/\\n/g, "\n"),
  };
}

async function getFirebaseAdminApp() {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  const { cert, getApp, getApps, initializeApp } = await import("firebase-admin/app");

  if (getApps().length > 0) {
    firebaseAdminApp = getApp();
    return firebaseAdminApp;
  }

  firebaseAdminApp = initializeApp({
    credential: cert(getServiceAccount()),
  });
  return firebaseAdminApp;
}

export async function getAdminDb() {
  if (firestoreDb) {
    return firestoreDb;
  }

  const adminApp = await getFirebaseAdminApp();
  const { getFirestore } = await import("firebase-admin/firestore");
  firestoreDb = getFirestore(adminApp);
  return firestoreDb;
}

export async function getAdminAuth() {
  const adminApp = await getFirebaseAdminApp();
  const { getAuth } = await import("firebase-admin/auth");
  return getAuth(adminApp);
}

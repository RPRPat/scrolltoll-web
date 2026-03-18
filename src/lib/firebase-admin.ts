import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type ServiceAccountPayload = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function getServiceAccount() {
  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!rawKey) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
  }

  const parsedKey = JSON.parse(rawKey) as ServiceAccountPayload;

  return {
    projectId: parsedKey.project_id,
    clientEmail: parsedKey.client_email,
    privateKey: parsedKey.private_key.replace(/\\n/g, "\n"),
  };
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert(getServiceAccount()),
  });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

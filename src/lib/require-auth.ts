import { getAdminAuth } from "@/lib/firebase-admin";

/**
 * Thrown when a request does not carry a valid Firebase ID token.
 * Carries an HTTP status so route handlers can translate it directly.
 */
export class AuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

/**
 * The ONLY trusted source of caller identity for the payment/PII API routes.
 *
 * Reads the `Authorization: Bearer <Firebase ID token>` header, verifies it
 * with the Admin SDK, and returns the authenticated uid. Callers must NEVER
 * trust a `uid` from the request body/query — doing so is an IDOR, since
 * Firebase uids are observable (URLs, logs, the client) and not secret.
 */
export async function requireUid(request: Request): Promise<string> {
  const header =
    request.headers.get("authorization") ?? request.headers.get("Authorization");
  const match = header?.match(/^Bearer\s+(.+)$/i);

  if (!match) {
    throw new AuthError("Missing authentication token");
  }

  const idToken = match[1].trim();
  if (!idToken) {
    throw new AuthError("Missing authentication token");
  }

  try {
    const auth = await getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);
    return decoded.uid;
  } catch {
    throw new AuthError("Invalid or expired authentication token");
  }
}

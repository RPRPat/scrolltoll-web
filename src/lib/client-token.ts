"use client";

const LEGACY_TOKEN_KEY = "scrolltoll-legacy-firebase-token";

export async function captureToken(purpose: "setup" | "account"): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  const nonce = params.get("nonce");
  if (nonce) {
    const response = await fetch("/api/session/exchange", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nonce, purpose }),
    });
    params.delete("nonce");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
    return response.ok;
  }

  // Migration bridge for already-installed app versions. New app builds never
  // send this fragment; remove after the minimum supported iOS version uses
  // createWebSessionNonce exclusively.
  const legacyToken = new URLSearchParams(window.location.hash.slice(1)).get("token");
  if (legacyToken) {
    window.sessionStorage.setItem(LEGACY_TOKEN_KEY, legacyToken);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    return true;
  }
  try {
    if (window.sessionStorage.getItem(LEGACY_TOKEN_KEY)) return true;
  } catch {
    // Continue with the HttpOnly session check when storage is unavailable.
  }

  const response = await fetch(`/api/session/status?purpose=${purpose}`, {
    cache: "no-store",
    credentials: "same-origin",
  });
  return response.ok;
}

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const legacyToken = window.sessionStorage.getItem(LEGACY_TOKEN_KEY);
    return legacyToken ? { Authorization: `Bearer ${legacyToken}` } : {};
  } catch {
    return {};
  }
}

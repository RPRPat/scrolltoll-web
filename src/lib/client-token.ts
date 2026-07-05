"use client";

/**
 * Client-side handling of the Firebase ID token the iOS app passes when it
 * opens the setup/account pages.
 *
 * The token arrives in the URL *fragment* (`#token=...`) — fragments are never
 * sent to the server, never appear in Referer headers, and aren't stored in
 * server access logs. We capture it into sessionStorage (so it survives the
 * Stripe Checkout round-trip within the same SFSafariViewController session)
 * and immediately scrub it from the visible URL.
 */

const TOKEN_STORAGE_KEY = "st_id_token";

/**
 * Pull the token from the URL fragment (or fall back to sessionStorage), then
 * strip it from the address bar. Call once on mount.
 */
export function captureToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const hash = window.location.hash ?? "";
  const match = hash.match(/(?:^#|&)token=([^&]+)/);

  if (match) {
    const token = decodeURIComponent(match[1]);
    try {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // sessionStorage may be unavailable (private mode); token stays in memory
      // for this page load via the return value.
    }
    // Remove the token from the URL so it isn't bookmarked/screenshotted.
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    return token;
  }

  try {
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Authorization header for API calls, or an empty object if no token. */
export function authHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

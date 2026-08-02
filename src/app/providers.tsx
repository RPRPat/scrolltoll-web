"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });

  posthog.register({
    environment: process.env.NEXT_PUBLIC_APP_ENVIRONMENT ?? "staging",
    release_channel:
      process.env.NEXT_PUBLIC_APP_ENVIRONMENT === "production"
        ? "production_web"
        : "staging_web",
  });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

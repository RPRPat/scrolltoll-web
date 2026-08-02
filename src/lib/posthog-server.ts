import { PostHog } from "posthog-node";

export function getPostHogClient() {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}

export function withEnvironment(properties: Record<string, unknown> = {}) {
  const environment = process.env.NEXT_PUBLIC_APP_ENVIRONMENT ?? "staging";
  return {
    ...properties,
    environment,
    release_channel: environment === "production" ? "production_web" : "staging_web",
  };
}

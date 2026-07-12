"use client";

import posthog from "posthog-js";

type InviteActionsProps = {
  appLink: string;
  code: string;
};

export function InviteActions({ appLink, code }: InviteActionsProps) {
  function handleOpenApp() {
    posthog.capture("invite_app_opened", { invite_code: code });
    window.location.href = appLink;
  }

  return (
    <button
      type="button"
      onClick={handleOpenApp}
      className="rounded-full bg-neon-green px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_32px_rgba(57,255,20,0.45)]"
    >
      Open in the ScrollToll app
    </button>
  );
}

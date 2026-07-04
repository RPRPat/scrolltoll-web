import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join my ScrollToll leaderboard",
  description:
    "Accept a ScrollToll friend invite and compete on the doomscrolling leaderboard — turn screen time into charity.",
};

type InvitePageProps = {
  params: { code: string };
};

function normalizeCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

export default function InvitePage({ params }: InvitePageProps) {
  const code = normalizeCode(params.code ?? "");
  const appLink = code ? `scrolltoll://invite?code=${code}` : "scrolltoll://invite";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-16 text-center text-white">
      <Link href="/" className="font-heading text-2xl font-bold tracking-widest">
        <span className="text-neon-green text-glow-green">SCROLL</span>
        <span className="text-hot-pink text-glow-pink">TOLL</span>
      </Link>

      <h1 className="font-heading mt-10 text-3xl font-bold md:text-4xl">
        You&apos;ve been challenged.
      </h1>
      <p className="mt-4 max-w-md text-white/60">
        A friend invited you to their ScrollToll leaderboard — where doomscrolling
        past your limit sends real money to charity. Join them and see who scrolls
        less (or donates more).
      </p>

      {code ? (
        <div className="mt-8 rounded-2xl border border-neon-green/30 bg-neon-green/5 px-10 py-6">
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Invite code</div>
          <div className="font-heading mt-2 text-4xl font-bold tracking-[0.35em] text-neon-green text-glow-green">
            {code}
          </div>
        </div>
      ) : (
        <p className="mt-8 text-sm text-hot-pink">
          This invite link looks incomplete — ask your friend to share it again.
        </p>
      )}

      <div className="mt-10 flex w-full max-w-xs flex-col gap-4">
        <a
          href={appLink}
          className="rounded-full bg-neon-green px-8 py-4 font-bold text-black transition-all hover:shadow-[0_0_32px_rgba(57,255,20,0.45)]"
        >
          Open in the ScrollToll app
        </a>
        <Link
          href="/#waitlist"
          className="rounded-full border border-white/20 px-8 py-4 font-bold text-white/80 transition-colors hover:border-white/50 hover:text-white"
        >
          Don&apos;t have the app yet?
        </Link>
      </div>

      <p className="mt-8 max-w-sm text-xs text-white/40">
        Already installed? The button above opens ScrollToll with the code filled in.
        You can also enter the code manually: Leaderboard &rarr; Friends &rarr; Add
        Friend &rarr; Enter Code. Codes are single-use and expire after 7 days.
      </p>
    </main>
  );
}

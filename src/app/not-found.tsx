import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <h1 className="font-heading text-6xl font-bold tracking-widest">
        <span className="text-neon-green">4</span>
        <span className="text-hot-pink">0</span>
        <span className="text-electric-purple">4</span>
      </h1>
      <p className="mt-6 font-heading text-xl font-bold text-white">
        THE TROLL CAN&apos;T FIND WHAT YOU&apos;RE LOOKING FOR
      </p>
      <p className="mt-3 text-sm text-gray-500">
        This page doesn&apos;t exist. Maybe you doom-scrolled too far.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-neon-green/30 px-6 py-3 text-sm font-bold text-neon-green transition-all hover:border-neon-green/60 hover:bg-neon-green/10 hover:shadow-[0_0_24px_rgba(57,255,20,0.25)]"
      >
        &larr; Back to the Bridge
      </Link>
    </div>
  );
}

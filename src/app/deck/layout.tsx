import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ScrollToll — Investor Deck",
  description: "ScrollToll pitch deck for investors and partners.",
};

export default function DeckLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

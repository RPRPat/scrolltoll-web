import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ScrollToll — Your Doom Scrolling Feeds the Void. The Void Feeds the World.",
  description: "The app that turns your worst habit into someone else's best day. Set a scroll limit, exceed it, pay the toll — and a child gets fed.",
  openGraph: {
    title: "ScrollToll — Feed the Void",
    description: "Your doom scrolling could feed a child. The toll booth for your worst habit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise-overlay">{children}</body>
    </html>
  );
}

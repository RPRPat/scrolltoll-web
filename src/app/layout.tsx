import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ScrollToll — Your Doom Scrolling Feeds the World",
  description:
    "The app that turns your worst screen time habit into charitable donations. Set a limit, blow past it, pay the toll, change a life.",
  openGraph: {
    title: "ScrollToll — Your Doom Scrolling Feeds the World",
    description: "The app that turns your worst screen time habit into charitable donations.",
    url: "https://scrolltoll.me",
    siteName: "ScrollToll",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrollToll — Your Doom Scrolling Feeds the World",
    description: "Set a limit. Blow past it. Pay the toll. Change a life.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} noise-overlay`}
      >
        {children}
      </body>
    </html>
  );
}

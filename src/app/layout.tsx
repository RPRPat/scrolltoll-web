import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PHProvider } from "./providers";

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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "ScrollToll",
      url: "https://scrolltoll.me",
      logo: "https://scrolltoll.me/favicon.svg",
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@scrolltoll.me",
        contactType: "customer support",
      },
      founder: [
        { "@type": "Person", name: "Pat Johnson" },
        { "@type": "Person", name: "Jon" },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "ScrollToll",
      operatingSystem: "iOS",
      applicationCategory: "LifestyleApplication",
      description:
        "The app that turns your worst screen time habit into charitable donations.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://scrolltoll.me"),
  title: "ScrollToll — Your Doom Scrolling Feeds the World",
  description:
    "The app that turns your worst screen time habit into charitable donations. Set a limit, blow past it, pay the toll, change a life.",
  icons: {
    icon: "/favicon.svg",
  },
  alternates: {
    canonical: "https://scrolltoll.me",
  },
  openGraph: {
    title: "ScrollToll — Your Doom Scrolling Feeds the World",
    description: "The app that turns your worst screen time habit into charitable donations.",
    url: "https://scrolltoll.me",
    siteName: "ScrollToll",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ScrollToll — Your Doom Scrolling Feeds the World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrollToll — Your Doom Scrolling Feeds the World",
    description: "Set a limit. Blow past it. Pay the toll. Change a life.",
    images: ["/opengraph-image"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PHProvider>{children}</PHProvider>
      </body>
    </html>
  );
}

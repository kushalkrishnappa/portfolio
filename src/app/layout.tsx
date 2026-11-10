import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import SmoothScroll from "./components/motion/SmoothScroll";
import Cursor from "./components/motion/Cursor";
import { profile } from "@/data/profile";

// Clean body sans.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Labels, meta, and chips.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Monumental wordmark and headings — a committed display grotesk with real
// presence (not Inter/Helvetica/Arial/Space Grotesk).
// Variable font: omit `weight` so all weights (incl. 900) stay available and
// `next dev --turbopack` resolves it correctly (an explicit weight array breaks
// the turbopack font loader).
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
});

const SITE_URL = "https://kushalkrishnappa.com";
const SITE_TITLE = "Kushal Krishnappa — Backend & Platform Engineer";
const SITE_DESCRIPTION =
  "Kushal Krishnappa — backend & platform engineer building distributed systems, multi-tenant isolation, and reliability at scale with Go, Kubernetes, Temporal, and AWS.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Kushal Krishnappa",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Kushal Krishnappa",
    "backend engineer",
    "platform engineer",
    "distributed systems",
    "multi-tenancy",
    "reliability engineering",
    "site reliability",
    "Go",
    "Golang",
    "Kubernetes",
    "Temporal",
    "AWS",
    "infrastructure",
    "SRE",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: '/kk.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/kk.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/kk.ico',
    apple: '/kk.svg',
  },
};

// JSON-LD Person structured data — sameAs points at the socials in profile.ts.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: SITE_URL,
  jobTitle: "Backend & Platform Engineer",
  email: `mailto:${profile.email}`,
  sameAs: profile.socials.map((s) => s.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/kk.ico" sizes="32x32" />
        <link rel="icon" href="/kk.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/kk.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}>
        <SmoothScroll>
          <Navigation />
          {children}
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}

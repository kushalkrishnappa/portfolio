import type { Metadata } from "next";
import "./globals.css";
import { profile } from "@/data/profile";

// Fonts: every page is a Field Manual surface (.fm root); its four families
// load via next/font in components/manual/fonts.ts.

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

// Field Manual motion gate. Runs before first paint (like v3's head script):
// on the homepage, unless the visitor prefers reduced motion, mark <html> with
// `motion` so sheets start undrawn. If the motion runtime has not started
// within 5s (JS failed or is very slow), fall back to the static, fully drawn
// layout and remember that so the runtime stays static too.
const fieldManualGate = `(function(){try{if(location.pathname!=="/")return;var d=document.documentElement;var m=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;if(!m)d.classList.add("motion");setTimeout(function(){if(!window.__fmStarted){window.__fmGaveUp=true;d.classList.remove("motion");}},5000);}catch(e){}})();`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: fieldManualGate }} />
        <link rel="icon" href="/kk.ico" sizes="32x32" />
        <link rel="icon" href="/kk.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/kk.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

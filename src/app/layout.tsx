import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

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
const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Kushal Krishnappa - MSCS @ Northeastern University",
  description: "Building systems that scale seamlessly",
  icons: {
    icon: [
      { url: '/kk.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/kk.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/kk.ico',
    apple: '/kk.svg',
  },
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

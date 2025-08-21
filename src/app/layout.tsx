import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sammerk.io"),
  title: {
    default: "Sam Merkovitz — Things I've Made and Thought About",
    template: "%s — Sam Merkovitz",
  },
  description:
    "Personal site of Sam Merkovitz — projects, writing, and things I'm thinking about.",
  icons: {
    icon: "/sam-logo-black.png",
    apple: "/sam-logo-black.png",
  },
  openGraph: {
    type: "website",
    siteName: "Sam Merkovitz",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@sammerkovitz",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

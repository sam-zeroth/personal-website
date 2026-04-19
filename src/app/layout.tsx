import type { Metadata, Viewport } from "next";
import { Pixelify_Sans, JetBrains_Mono, Young_Serif } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const youngSerif = Young_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/sam-logo-black.png",
  },
  openGraph: {
    type: "website",
    siteName: "Sam Merkovitz",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@sam_zeroth",
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
        className={`${pixelify.variable} ${jetbrains.variable} ${youngSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

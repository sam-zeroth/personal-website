import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://sammerk.io"),
  title: "Sam Merkovitz — Neural Portfolio",
  description: "Interactive 3D brain portfolio — explore work, writing, and more through neural pathways.",
  openGraph: {
    title: "Sam Merkovitz — Neural Portfolio",
    description: "Interactive 3D brain portfolio — explore work, writing, and more through neural pathways.",
    images: [
      {
        url: "/sam-logo-black.png",
        width: 345,
        height: 333,
        alt: "Sam Merkovitz Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Sam Merkovitz — Neural Portfolio",
    description: "Interactive 3D brain portfolio — explore work, writing, and more through neural pathways.",
    images: ["/sam-logo-black.png"],
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

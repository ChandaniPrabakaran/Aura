import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "AURA | Personal AI Assistant",
  description: "Your personalized AI-powered assistant with long-term memory and calendar integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-aura-bg text-aura-charcoal font-body selection:bg-aura-indigo/10" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

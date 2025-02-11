import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const manrope = Inter({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Derek Bowdle",
  description: "Derek Bowdle - Engineering a more productive tomorrow",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${manrope.variable} font-sans bg-gray-900 text-white`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobNest — Find Your Dream Job Faster",
  description:
    "Discover opportunities from thousands of companies worldwide. Search, filter, and apply to jobs aggregated from 9+ sources in one place.",
  keywords: [
    "jobs",
    "careers",
    "hiring",
    "remote jobs",
    "job board",
    "job search",
    "employment",
  ],
  openGraph: {
    title: "JobNest — Find Your Dream Job Faster",
    description:
      "Discover opportunities from thousands of companies worldwide.",
    type: "website",
    siteName: "JobNest",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


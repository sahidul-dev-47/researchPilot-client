import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ResearchPilot — AI-Powered Research Platform",
    template: "%s | ResearchPilot",
  },
  description:
    "ResearchPilot is an AI-powered research management platform that helps you generate comprehensive research reports, manage projects, and collaborate with an intelligent assistant.",
  keywords: [
    "AI research",
    "research management",
    "Gemini AI",
    "academic research",
    "research assistant",
  ],
  authors: [{ name: "ResearchPilot" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ResearchPilot",
    title: "ResearchPilot — AI-Powered Research Platform",
    description:
      "Generate publication-grade research reports with AI, manage your projects, and chat with an intelligent research assistant.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ResearchPilot — AI-Powered Research Platform",
    description:
      "Generate publication-grade research reports with AI, manage your projects, and chat with an intelligent research assistant.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

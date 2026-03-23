import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { BackButton } from "@/components/ui/back-button";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

export const metadata: Metadata = {
  title: {
    default: "DevRoast AI | Best AI Code Reviewer & GitHub Analyzer",
    template: "%s | DevRoast AI",
  },
  description: "Level up your GitHub profile with DevRoast AI. Get brutal AI-powered code roasts, automated PR reviews, commit audits, and developer analytics to write better code.",
  keywords: [
    "DevRoast AI", 
    "AI code review", 
    "GitHub profile analyzer", 
    "AI developer tools", 
    "code roast", 
    "automated code review", 
    "improve GitHub profile", 
    "developer productivity AI", 
    "AI code analysis", 
    "GitHub portfolio enhancer",
    "best AI coding assistant",
    "AI repository analyzer"
  ],
  authors: [{ name: "DevRoast AI Team" }],
  creator: "DevRoast AI",
  publisher: "DevRoast AI",
  verification: {
    google: "6tL5BnCXfeKk0mb3gEPf62HjgG-Ad-lB49u1wWjMeKA",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "DevRoast AI - Roast Your Code. Elevate Your GitHub.",
    description: "Discover the world's best AI code reviewer. Get your GitHub repositories brutally roasted and improved by DevRoast AI.",
    url: "https://dev-roast-ai-sand.vercel.app/",
    siteName: "DevRoast AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevRoast AI - AI Code Reviewer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DevRoast AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans min-h-screen`}
      >
        <div className="fixed inset-0 z-[-1] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none" />
        <div className="fixed inset-0 z-[-2] bg-background pointer-events-none" />
        <Providers>
          {children}
          <BackButton />
        </Providers>
      </body>
    </html>
  );
}

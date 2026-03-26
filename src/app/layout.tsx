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
  metadataBase: new URL("https://dev-roast-ai-sand.vercel.app/"),
  applicationName: "DevRoast AI",
  title: {
    default: "DevRoast AI - The World's #1 AI GitHub Roaster & Code Analyzer",
    template: "%s | DevRoast AI",
  },
  description: "The world's #1 AI GitHub roaster. Get brutal AI-powered code reviews, automated PR audits, and developer analytics to dominate your tech career.",
  alternates: {
    canonical: "https://dev-roast-ai-sand.vercel.app/",
  },
  category: "technology",
  keywords: [
    "dev",
    "roast",
    "ai",
    "devroast",
    "devroast ai",
    "AI code review",
    "GitHub roaster",
    "developer portfolio",
    "code analysis",
    "tech stack auditor",
    "programming roast",
    "software engineering",
    "repository analytics",
    "developer score",
    "coding skills",
    "AI-powered developer profile",
    "tech career audit",
    "best AI code reviewer",
    "brutally honest AI",
    "GitHub analysis tool",
    "developer profile audit",
    "software architect portfolio",
    "GitHub portfolio enhancer",
    "best AI coding assistant",
    "AI repository analyzer",
    "roast my code",
    "roast my github"
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
    description: "The world's #1 AI code reviewer. Get your GitHub repositories brutally roasted and improved by DevRoast AI. Stop writing garbage code.",
    url: "https://dev-roast-ai-sand.vercel.app/",
    siteName: "DevRoast AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevRoast AI - The Brutal AI Code Reviewer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevRoast AI - Roast Your GitHub Profile",
    description: "Is your code actually good or are you just lucky? Let DevRoast AI rip apart your GitHub and tell you the truth.",
    images: ["/og-image.png"],
    creator: "@AshwinJauhary",
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
    icon: [
      { url: "/icon.png" },
      { url: "/logo.png", media: "(prefers-color-scheme: light)" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DevRoast AI",
  },
  other: {
    "apple-mobile-web-app-title": "DevRoast AI",
    "classification": "AI Developer Tool",
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

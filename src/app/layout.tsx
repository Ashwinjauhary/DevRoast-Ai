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
    default: "DevRoast AI - The World's #1 AI GitHub Roaster & Code Analyzer | Developed by Ashwin Jauhary",
    template: "%s | DevRoast AI by Ashwin Jauhary",
  },
  description: "DevRoast AI is the world's #1 AI-powered GitHub roaster and code analysis platform, developed and designed by Ashwin Jauhary. Get brutal AI code reviews, automated PR audits, developer scoring, commit auditing, and actionable architecture fixes. Built with Next.js and advanced AI models.",
  alternates: {
    canonical: "https://dev-roast-ai-sand.vercel.app/",
  },
  category: "technology",
  keywords: [
    "DevRoast AI",
    "devroast",
    "dev roast ai",
    "Ashwin Jauhary",
    "Ashwin Jauhary developer",
    "Ashwin Jauhary DevRoast",
    "AI code review tool",
    "AI GitHub roaster",
    "GitHub profile analyzer",
    "AI code analysis",
    "developer portfolio analyzer",
    "tech stack auditor",
    "programming roast AI",
    "software engineering AI tool",
    "repository analytics AI",
    "developer score calculator",
    "AI-powered developer profile",
    "tech career audit tool",
    "best AI code reviewer 2026",
    "brutally honest AI code review",
    "GitHub analysis tool free",
    "developer profile audit AI",
    "GitHub portfolio enhancer",
    "AI coding assistant",
    "AI repository analyzer",
    "roast my code AI",
    "roast my github profile",
    "commit message auditor",
    "AI PR review tool",
    "code quality analyzer AI",
    "open source AI code reviewer",
    "LLM code review",
    "generative AI developer tools"
  ],
  authors: [{ name: "Ashwin Jauhary", url: "https://dev-roast-ai-sand.vercel.app/developer" }],
  creator: "Ashwin Jauhary",
  publisher: "Ashwin Jauhary",
  verification: {
    google: "6tL5BnCXfeKk0mb3gEPf62HjgG-Ad-lB49u1wWjMeKA",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "DevRoast AI - AI Code Reviewer & GitHub Roaster | Developed and Designed by Ashwin Jauhary",
    description: "DevRoast AI is the world's #1 AI-powered code review and GitHub profile analysis platform. Developed and designed by Ashwin Jauhary. Get brutal AI roasts, automated PR audits, developer scoring, and architecture fixes.",
    url: "https://dev-roast-ai-sand.vercel.app/",
    siteName: "DevRoast AI",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "DevRoast AI - AI Code Reviewer developed by Ashwin Jauhary",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevRoast AI - AI GitHub Roaster by Ashwin Jauhary",
    description: "DevRoast AI is developed and designed by Ashwin Jauhary. Get brutal AI-powered code reviews, GitHub profile analysis, and developer scoring.",
    images: ["/logo.png"],
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
    "author": "Ashwin Jauhary",
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

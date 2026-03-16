import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "DevRoast AI",
  description: "Roast your code. Improve your GitHub.",
  manifest: "/manifest.json",
  themeColor: "#6366f1",
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

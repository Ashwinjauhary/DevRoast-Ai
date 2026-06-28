import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ashwin Jauhary | Developer & Designer of DevRoast AI | Full Stack Architect",
  description: "Ashwin Jauhary is the developer and designer of DevRoast AI, the world's #1 AI-powered GitHub roaster and code analysis platform. He is a Full Stack Architect and Performance Engineer specializing in modern JavaScript ecosystems, high-performance frontend architectures, Next.js, React, TypeScript, and scalable real-time systems.",
  keywords: [
    "Ashwin Jauhary",
    "Ashwin Jauhary developer",
    "Ashwin Jauhary DevRoast AI",
    "DevRoast AI creator",
    "DevRoast AI developer",
    "Full Stack Developer India",
    "Full Stack Architect",
    "Performance Engineer",
    "React Architect",
    "Next.js Developer",
    "TypeScript Developer",
    "Software Architecture",
    "India Top Developers",
    "AI developer tools creator",
    "Ashwin Jauhary portfolio",
    "Ashwin Jauhary GitHub",
  ],
  openGraph: {
    title: "Ashwin Jauhary | Developer & Designer of DevRoast AI",
    description: "Ashwin Jauhary developed and designed DevRoast AI, the world's #1 AI-powered GitHub roaster. Full Stack Architect specializing in high-performance frontend architectures and scalable systems.",
    images: ["/Developer.png"],
  },
};

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}


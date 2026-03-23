import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ashwin Jauhary | Full Stack Architect & Performance Engineer",
  description: "Explore the professional profile of Ashwin Jauhary, the architect behind DevRoast AI. Specialized in modern JavaScript ecosystems, high-performance frontend architectures, and scalable real-time systems.",
  keywords: [
    "Ashwin Jauhary",
    "Full Stack Developer",
    "Performance Engineer",
    "React Architect",
    "Next.js Developer",
    "DevRoast AI Creator",
    "Software Architecture",
    "India Top Developers",
  ],
  openGraph: {
    title: "Ashwin Jauhary | Full Stack Architect",
    description: "Full Stack Architect & Performance Engineer. specialized in modern JavaScript ecosystems and scalable systems.",
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {},
  // @ts-ignore
  turbopack: {
    root: 'C:\\Users\\ashwi\\.gemini\\antigravity\\scratch\\devroast-ai',
  },
};

export default nextConfig;

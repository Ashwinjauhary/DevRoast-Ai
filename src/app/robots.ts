import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/"], // Usually, we don't want dashboard indexed
    },
    sitemap: "https://dev-roast-ai-sand.vercel.app/sitemap.xml",
  };
}

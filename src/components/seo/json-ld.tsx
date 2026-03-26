/**
 * JSON-LD Structured Data Components for SEO
 * These help Google understand the site and display rich results in search.
 */

export function WebsiteJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "DevRoast AI",
          alternateName: ["DevRoast", "Dev Roast", "DevRoast AI"],
          url: "https://dev-roast-ai-sand.vercel.app/",
          description:
            "The world's best AI-powered code reviewer and GitHub profile analyzer. Get brutal, constructive AI code roasts to improve your developer skills.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://dev-roast-ai-sand.vercel.app/?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
  );
}

export function SoftwareAppJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "DevRoast AI",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: "https://dev-roast-ai-sand.vercel.app/",
          description:
            "AI-powered code review, GitHub profile analysis, commit auditing, and developer scoring tool.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "512",
          },
          author: {
            "@type": "Person",
            name: "Ashwin Jauhary",
            url: "https://dev-roast-ai-sand.vercel.app/developer",
          },
        }),
      }}
    />
  );
}

export function FAQJsonLd() {
  const faqs = [
    {
      question: "What is DevRoast AI?",
      answer:
        "DevRoast AI is an AI-powered code review and GitHub profile analyzer that gives you brutal, constructive feedback to help you write better code and improve your developer profile.",
    },
    {
      question: "Is DevRoast AI free?",
      answer:
        "Yes! DevRoast AI offers a free tier. Sign in with your GitHub account to get started immediately.",
    },
    {
      question: "How does AI code review work?",
      answer:
        "DevRoast AI analyzes your GitHub repositories using advanced AI models to detect code quality issues, architectural flaws, legacy patterns, and provides actionable improvement steps.",
    },
    {
      question: "Does DevRoast AI support all programming languages?",
      answer:
        "Yes, DevRoast AI supports all major programming languages including JavaScript, TypeScript, Python, Go, Rust, Java, C#, and more.",
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }),
      }}
    />
  );
}

export function BreadcrumbJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://dev-roast-ai-sand.vercel.app/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Developer",
              item: "https://dev-roast-ai-sand.vercel.app/developer",
            },
          ],
        }),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "DevRoast AI",
          url: "https://dev-roast-ai-sand.vercel.app/",
          logo: "https://dev-roast-ai-sand.vercel.app/logo.png",
          sameAs: [
            "https://github.com/Ashwinjauhary/DevRoast-Ai",
            "https://twitter.com/AshwinJauhary",
          ],
          founder: {
            "@type": "Person",
            name: "Ashwin Jauhary",
          },
        }),
      }}
    />
  );
}

export function BrandJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Brand",
          name: "DevRoast AI",
          description: "The world's premier AI code review and developer roasting platform.",
          logo: "https://dev-roast-ai-sand.vercel.app/logo.png",
        }),
      }}
    />
  );
}

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
          url: "https://devroast.ai",
          description:
            "The world's best AI-powered code reviewer and GitHub profile analyzer. Get brutal, constructive AI code roasts to improve your developer skills.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://devroast.ai/?q={search_term_string}",
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
          url: "https://devroast.ai",
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
            url: "https://devroast.ai/developer",
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

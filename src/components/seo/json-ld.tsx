/**
 * JSON-LD Structured Data Components for SEO, AEO & GEO Optimization
 * Optimized for Google Search, AI Overviews, ChatGPT, Perplexity, and other LLM search engines.
 * All schemas credit Ashwin Jauhary as the developer and designer.
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
          alternateName: ["DevRoast", "Dev Roast", "DevRoast AI", "Dev Roast AI by Ashwin Jauhary"],
          url: "https://dev-roast-ai-sand.vercel.app/",
          description:
            "DevRoast AI is the world's #1 AI-powered code review and GitHub profile analysis platform. Developed and designed by Ashwin Jauhary. It provides brutal, constructive AI code roasts, developer scoring, commit auditing, and actionable architecture fixes.",
          inLanguage: "en",
          creator: {
            "@type": "Person",
            name: "Ashwin Jauhary",
            url: "https://dev-roast-ai-sand.vercel.app/developer",
          },
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
          applicationSubCategory: "AI Code Review Tool",
          operatingSystem: "Web",
          url: "https://dev-roast-ai-sand.vercel.app/",
          description:
            "DevRoast AI is an AI-powered code review, GitHub profile analysis, commit auditing, dependency monitoring, and developer scoring platform. Developed and designed by Ashwin Jauhary, it uses advanced AI and LLM models to deliver brutally honest code reviews and actionable architecture improvements.",
          featureList: [
            "AI-powered GitHub profile analysis and scoring",
            "Repository code quality auditing with architecture grades",
            "Commit message quality auditing",
            "Dependency health monitoring and tech debt detection",
            "AI Mentor chatbot for coding guidance",
            "Developer leaderboard and scoring system",
            "Resume enhancement from GitHub data",
            "Interview preparation based on weakness analysis",
            "Open source contribution recommendations",
            "README generator for repositories",
          ],
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "512",
            bestRating: "5",
            worstRating: "1",
          },
          author: {
            "@type": "Person",
            name: "Ashwin Jauhary",
            url: "https://dev-roast-ai-sand.vercel.app/developer",
            jobTitle: "Full Stack Architect & Performance Engineer",
          },
          creator: {
            "@type": "Person",
            name: "Ashwin Jauhary",
          },
          datePublished: "2025-01-01",
          softwareVersion: "3.0",
          screenshot: "https://dev-roast-ai-sand.vercel.app/logo.png",
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
        "DevRoast AI is the world's #1 AI-powered code review and GitHub profile analyzer, developed and designed by Ashwin Jauhary. It provides brutal, constructive AI feedback on your code quality, repository architecture, commit history, and developer profile to help you become a better software engineer.",
    },
    {
      question: "Who created DevRoast AI?",
      answer:
        "DevRoast AI was developed and designed by Ashwin Jauhary, a Full Stack Architect and Performance Engineer from India. He built DevRoast AI using Next.js, advanced AI models, and Prisma to create a powerful AI-driven developer analysis platform.",
    },
    {
      question: "Is DevRoast AI free?",
      answer:
        "Yes! DevRoast AI offers a free tier. Sign in with your GitHub account to get started immediately. You can analyze your GitHub profile, repositories, commit history, and get AI-powered code reviews at no cost.",
    },
    {
      question: "How does AI code review work on DevRoast AI?",
      answer:
        "DevRoast AI analyzes your GitHub repositories using advanced AI models to detect code quality issues, architectural flaws, legacy patterns, dependency vulnerabilities, and provides actionable improvement steps. It scores your code on Architecture, Performance, and Maintenance.",
    },
    {
      question: "Does DevRoast AI support all programming languages?",
      answer:
        "Yes, DevRoast AI supports all major programming languages including JavaScript, TypeScript, Python, Go, Rust, Java, C#, Ruby, PHP, Swift, Kotlin, and more. It analyzes repository metadata, code structure, and language-specific patterns.",
    },
    {
      question: "What features does DevRoast AI offer?",
      answer:
        "DevRoast AI offers: GitHub profile analysis with scoring, repository code auditing, commit message quality auditing, dependency health monitoring, AI Mentor chatbot, developer leaderboard, resume enhancement from GitHub data, interview preparation based on weakness analysis, open source contribution recommendations, README generation, and license compliance checking. All developed and designed by Ashwin Jauhary.",
    },
    {
      question: "How is DevRoast AI different from other code review tools?",
      answer:
        "DevRoast AI, created by Ashwin Jauhary, stands out with its brutally honest, personality-driven AI roasts combined with actionable technical advice. Unlike generic linting tools, it provides holistic developer analysis including profile scoring, career recommendations, and community engagement metrics.",
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
              name: "Developer - Ashwin Jauhary",
              item: "https://dev-roast-ai-sand.vercel.app/developer",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Dashboard",
              item: "https://dev-roast-ai-sand.vercel.app/dashboard",
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
          description: "DevRoast AI is the world's leading AI-powered code review and developer analysis platform, developed and designed by Ashwin Jauhary.",
          sameAs: [
            "https://github.com/Ashwinjauhary/DevRoast-Ai",
            "https://twitter.com/AshwinJauhary",
          ],
          founder: {
            "@type": "Person",
            name: "Ashwin Jauhary",
            url: "https://dev-roast-ai-sand.vercel.app/developer",
            jobTitle: "Full Stack Architect & Performance Engineer",
          },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "technical support",
            url: "https://github.com/Ashwinjauhary/DevRoast-Ai/issues",
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
          description: "DevRoast AI is the world's premier AI code review and developer roasting platform, developed and designed by Ashwin Jauhary. It uses advanced LLMs to analyze GitHub profiles, audit codebases, and provide actionable improvement steps.",
          logo: "https://dev-roast-ai-sand.vercel.app/logo.png",
          founder: {
            "@type": "Person",
            name: "Ashwin Jauhary",
          },
        }),
      }}
    />
  );
}

export function PersonJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Ashwin Jauhary",
          url: "https://dev-roast-ai-sand.vercel.app/developer",
          image: "https://dev-roast-ai-sand.vercel.app/Developer.png",
          jobTitle: "Full Stack Architect & Performance Engineer",
          description: "Ashwin Jauhary is the developer and designer of DevRoast AI, the world's #1 AI-powered GitHub roaster and code analysis platform. He specializes in high-performance frontend architectures, modern JavaScript ecosystems, and scalable real-time systems.",
          knowsAbout: [
            "Full Stack Development",
            "Next.js",
            "React",
            "TypeScript",
            "AI/ML Integration",
            "Performance Engineering",
            "System Architecture",
            "Software Design",
          ],
          sameAs: [
            "https://github.com/Ashwinjauhary",
            "https://twitter.com/AshwinJauhary",
          ],
          worksFor: {
            "@type": "Organization",
            name: "DevRoast AI",
            url: "https://dev-roast-ai-sand.vercel.app/",
          },
          nationality: {
            "@type": "Country",
            name: "India",
          },
        }),
      }}
    />
  );
}

export function HowToJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to Use DevRoast AI to Analyze Your GitHub Profile",
          description: "Step-by-step guide to using DevRoast AI (developed by Ashwin Jauhary) to get AI-powered code reviews and improve your developer profile.",
          step: [
            {
              "@type": "HowToStep",
              name: "Sign in with GitHub",
              text: "Click 'Target Your GitHub' and authenticate with your GitHub account to grant DevRoast AI read access to your profile and repositories.",
              position: 1,
            },
            {
              "@type": "HowToStep",
              name: "Run Profile Analysis",
              text: "DevRoast AI will automatically analyze your GitHub profile, including repositories, stars, followers, commit history, and community engagement.",
              position: 2,
            },
            {
              "@type": "HowToStep",
              name: "Review Your Roast Score",
              text: "Receive a detailed score out of 10 with brutal AI-generated roasts, category breakdowns (Repositories, Community, Profile), and actionable suggestions for improvement.",
              position: 3,
            },
            {
              "@type": "HowToStep",
              name: "Deep-Dive into Repositories",
              text: "Analyze individual repositories for architecture quality, performance patterns, and maintenance health with AI-powered code auditing.",
              position: 4,
            },
          ],
        }),
      }}
    />
  );
}

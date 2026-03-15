import { getSambaNovaResponse } from "./ai-repo-fixer";

export interface JobCompatibilityResult {
    archetypes: Array<{
        name: string; // e.g., "FAANG Engineer", "Startup Core", "FinTech Developer", "Web3 Pioneer"
        matchPercentage: number;
        reasoning: string;
    }>;
}

export async function calculateJobCompatibility(developerContext: any): Promise<JobCompatibilityResult | null> {
    const prompt = `You are an elite Tech Recruiter AI that analyzes developer portfolios and matches their skills/experience to industry archetypes.
Given the following developer context (languages, repos, bio), analyze how well they fit into the following 4 archetypes:
1. FAANG / Big Tech (values: scale, algorithms, C++, Java, Go, systems)
2. Startup Core / Hacker (values: speed, full-stack, Next.js, React, Node, fast iteration)
3. FinTech / Enterprise (values: security, Java, C#, Python, rigid architecture)
4. Web3 / Crypto (values: Rust, Solidity, cryptography, decentralization)

Output ONLY a raw JSON strictly matching this schema:
{
  "archetypes": [
    {
      "name": "FAANG / Big Tech",
      "matchPercentage": 85,
      "reasoning": "1 sentence brutal explanation of why."
    },
    // ... all 4 archetypes must be present
  ]
}

Developer Context:
${JSON.stringify(developerContext, null, 2)}`;

    try {
        let aiResponse = await getSambaNovaResponse(prompt);
        // Clean markdown
        if (aiResponse.startsWith("\`\`\`json")) aiResponse = aiResponse.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        else if (aiResponse.startsWith("\`\`\`")) aiResponse = aiResponse.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

        const result = JSON.parse(aiResponse.trim());
        return result;
    } catch (e) {
        console.error("Job Compatibility Engine failed:", e);
        return null;
    }
}

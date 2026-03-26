import { getSambaNovaResponse } from "./ai-repo-fixer";

const GITHUB_API = "https://api.github.com";

export async function auditDependencies(owner: string, repo: string, headers: HeadersInit) {
    const filesToTry = ["package.json", "requirements.txt", "go.mod", "pom.xml", "Cargo.toml", "composer.json"];

    let manifestName = null;
    let manifestContent = null;

    for (const file of filesToTry) {
        try {
            const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${file}`, { headers });
            if (res.ok) {
                const data = await res.json();
                manifestContent = Buffer.from(data.content, 'base64').toString('utf8');
                manifestName = file;
                break;
            }
        } catch {
            // Continue to next file
        }
    }

    if (!manifestContent) {
        return null;
    }

    // Limit processing to first 5000 chars to save tokens on massive lockfiles (though we shouldn't hit lockfiles directly)
    if (manifestContent.length > 5000) {
        manifestContent = manifestContent.substring(0, 5000) + "\n...[TRUNCATED]";
    }

    const prompt = `You are a brutal, highly-critical Security Architect.
Analyze the following dependency manifest from a GitHub repository.
Provide a savage, honest tech-debt & health score from 1.0 to 10.0 based on how bloated, outdated, or risky these dependencies are.
Return ONLY valid JSON matching this schema:
{
  "healthScore": 4.5,
  "analysis": "A concise, savage 2-sentence summary of their tech debt. Ridicule them for bloated frameworks."
}

Manifest File (${manifestName}):
${manifestContent}
`;

    try {
        let aiResponse = await getSambaNovaResponse(prompt);
        // Clean markdown
        if (aiResponse.startsWith("\`\`\`json")) aiResponse = aiResponse.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        else if (aiResponse.startsWith("\`\`\`")) aiResponse = aiResponse.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

        const result = JSON.parse(aiResponse.trim());
        return {
            name: manifestName,
            healthScore: result.healthScore,
            analysis: result.analysis
        };
    } catch {
        return { name: manifestName, healthScore: null, analysis: "Failed to audit tech debt." };
    }
}

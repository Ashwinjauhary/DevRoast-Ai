export const DEFAULT_MODEL = "Meta-Llama-3.3-70B-Instruct";

/**
 * Hybrid AI JSON Generator: Groq (Primary) -> SambaNova (Fallback)
 */
/**
 * Hybrid AI JSON Generator: Multi-Groq (Primary) -> Multi-SambaNova (Fallback)
 */
async function generateJsonResponse(prompt: string, attempt: number = 0, engineType: 'groq' | 'sambanova' = 'groq'): Promise<any> {
    const groqKeys = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
    const sambaKeys = (process.env.SAMBANOVA_API_KEYS || process.env.SAMBANOVA_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);

    if (engineType === 'groq') {
        if (attempt >= groqKeys.length) {
            console.warn(`[AI] All Groq keys exhausted (${groqKeys.length}). Falling back to SambaNova...`);
            return generateJsonResponse(prompt, 0, 'sambanova');
        }

        const currentKey = groqKeys[attempt];
        console.log(`[AI] Groq Attempt ${attempt + 1}/${groqKeys.length}...`);

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${currentKey}`, 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    stream: false,
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "system", content: prompt + "\n\nCRITICAL: Respond ONLY with a valid JSON object. No markdown." }],
                    response_format: { type: "json_object" },
                    temperature: 0.1,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.choices?.[0]?.message?.content;
                if (content) {
                    console.log("[AI] Groq success!");
                    return parseAIJson(content);
                }
            }
            
            console.warn(`[AI] Groq Key ${attempt + 1} failed (Status: ${response.status}). Trying next Groq key...`);
            return generateJsonResponse(prompt, attempt + 1, 'groq');
        } catch (error: any) {
            console.error(`[AI] Groq Exception on Key ${attempt + 1}: ${error.message}. Trying next Groq key...`);
            return generateJsonResponse(prompt, attempt + 1, 'groq');
        }
    }

    // --- SambaNova Logic ---
    if (attempt >= sambaKeys.length) {
        throw new Error(`CRITICAL AI FAILURE: All keys exhausted (Groq: ${groqKeys.length}, SambaNova: ${sambaKeys.length})`);
    }

    const currentKey = sambaKeys[attempt];
    console.log(`[AI] SambaNova Attempt ${attempt + 1}/${sambaKeys.length}...`);

    try {
        const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${currentKey}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                stream: false,
                model: DEFAULT_MODEL,
                messages: [{ role: "system", content: prompt + "\n\nOutput only raw JSON. No markdown blocks." }],
                temperature: 0.1,
            }),
        });

        if (!response.ok) {
            console.warn(`[AI] SambaNova Key ${attempt + 1} failed (${response.status}). Retrying next...`);
            return generateJsonResponse(prompt, attempt + 1, 'sambanova');
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error("Empty response from SambaNova");
        return parseAIJson(content);

    } catch (error: any) {
        console.warn(`[AI] SambaNova Key ${attempt + 1} error: ${error.message}. Retrying...`);
        return generateJsonResponse(prompt, attempt + 1, 'sambanova');
    }
}

/**
 * Shared Text Generator for Markdown/Non-JSON tasks
 */
async function generateTextResponse(prompt: string, attempt: number = 0, engineType: 'groq' | 'sambanova' = 'groq'): Promise<string> {
    const groqKeys = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
    const sambaKeys = (process.env.SAMBANOVA_API_KEYS || process.env.SAMBANOVA_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);

    if (engineType === 'groq') {
        if (attempt >= groqKeys.length) return generateTextResponse(prompt, 0, 'sambanova');
        const key = groqKeys[attempt];
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }], temperature: 0.5 }),
            });
            if (res.ok) {
                const data = await res.json();
                return data.choices?.[0]?.message?.content || "";
            }
            return generateTextResponse(prompt, attempt + 1, 'groq');
        } catch { return generateTextResponse(prompt, attempt + 1, 'groq'); }
    }

    if (attempt >= sambaKeys.length) return "# Error\n\nAll AI engines failed.";
    const key = sambaKeys[attempt];
    try {
        const res = await fetch("https://api.sambanova.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: DEFAULT_MODEL, messages: [{ role: "user", content: prompt }], temperature: 0.5 }),
        });
        if (res.ok) {
            const data = await res.json();
            return data.choices?.[0]?.message?.content || "";
        }
        return generateTextResponse(prompt, attempt + 1, 'sambanova');
    } catch { return generateTextResponse(prompt, attempt + 1, 'sambanova'); }
}

function parseAIJson(content: string): any {
    let clean = content.trim();
    if (clean.startsWith("```json")) clean = clean.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    else if (clean.startsWith("```")) clean = clean.replace(/^```\n?/, "").replace(/\n?```$/, "");
    try { 
        return JSON.parse(clean); 
    } catch {
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) {
            try { return JSON.parse(match[0]); } catch { throw new Error("Broken JSON structure in AI output"); }
        }
        throw new Error("Invalid format: No JSON object found in AI output");
    }
}

export async function generateProfileAnalysis(metrics: any) {
    const prompt = `
YOU ARE A BRUTAL, ELITE SENIOR DEVELOPER. Your job is to perform a "Developer Integrity Audit" on a GitHub profile. 
Be accurate, data-driven, and savage. Do not give participation trophies.

METRICS TO ANALYZE:
${JSON.stringify(metrics, null, 2)}

SCORING ALGORITHM (Internal Guidelines):
- REPOSITORIES (Weight 40%): Use total_repos (public + private). Look at total_stars relative to impact. Mention private_repos if they exist ("Private Operations"). High repo count with zero stars should be roasted for "Vaporware Production".
- COMMUNITY (Weight 30%): Look at followers vs following ratio. If following > followers, they are a "Social Climber" (Max 4/10). Look at total_stars and total_forks across ALL repos.
- PROFILE (Weight 30%): has_profile_readme, account_age_days, bio/location. recent_events_count (Activity check).

OUTPUT REQUIREMENT:
Return ONLY a valid JSON object with the following structure:
{
  "score": number (1.0 to 10.0 overall),
  "roastLines": [3-4 highly specific, brutal, data-driven roasts],
  "categories": {
    "Repositories": number (1-10),
    "Community": number (1-10),
    "Profile": number (1-10)
  },
  "suggestions": [3 actionable, real steps to not be a liability]
}

CRITICAL: Roast lines MUST explain specific numbers. If total_stars is low despite high total_repos, roast them for "Hidden Mediocrity" or "Empty Shell Architecture".
`;
    return generateJsonResponse(prompt);
}

export async function generateRepoAnalysis(repoData: any) {
    const prompt = `
YOU ARE A BRUTAL SENIOR ARCHITECT. Audit this specific repository for engineering integrity.
Be precise, technically accurate, and savage.

REPOSITORY DATA:
${JSON.stringify(repoData, null, 2)}

AUDIT CRITERIA:
- CODE QUALITY (30%): Analyze naming, structure, and complexity (if code snippet is provided).
- DOCUMENTATION (20%): Is there a README? Is it professional? Any missing license?
- IMPACT (30%): stars, forks, watchers. Is this a real tool or just a "Hello World"?
- TECH MATURITY (20%): Modern tech choices vs legacy disasters.

OUTPUT REQUIREMENT:
Return ONLY a valid JSON object:
{
  "score": number (1.0 to 10.0),
  "roastLines": [3 specific, technical roasts],
  "eli5Lines": [A 2-sentence simplified explanation of what this code actually does],
  "categories": {
    "Architecture": number (1-10),
    "Performance": number (1-10),
    "Maintenance": number (1-10)
  },
  "suggestions": [3 technical, actionable improvements]
}

CRITICAL: If the code is just boilerplate or empty, score it below 3/10 and roast the dev for wasting server bandwidth.
`;
    return generateJsonResponse(prompt);
}

export async function generateReadme(repoData: any): Promise<string> {
    const prompt = `You are a senior developer. Generate a complete, professional, and visually stunning README.md for a GitHub repository based on the following metadata. Use emoji, badges, and great formatting. Include: title, description, features, getting started, tech stack, contributing, license. Return ONLY the raw markdown text, nothing else.

Repository Data:
${JSON.stringify(repoData, null, 2)}`;

    return generateTextResponse(prompt);
}

export async function generateResumePoints(githubUsername: string, analyses: any[]): Promise<string[]> {
    const prompt = `You are a professional tech recruiter and resume writer. Based on the following developer profile data for GitHub user "${githubUsername}", generate 6 powerful, quantified resume bullet points. Each bullet should start with a strong action verb and include specifics. Return JSON: { "bullets": string[] }

Analysis Data: ${JSON.stringify(analyses.slice(0, 5))}`;
    const result = await generateJsonResponse(prompt);
    return result.bullets || [];
}

export async function reviewCodeSnippet(code: string, language: string): Promise<{ summary: string; issues: { line: number; severity: 'error' | 'warning' | 'info'; message: string; suggestion: string }[] }> {
    const prompt = `You are a brutal senior code reviewer. Review this ${language} code and return JSON: { "summary": string, "issues": [ { "line": number, "severity": "error" | "warning" | "info", "message": string, "suggestion": string } ] }. Be specific and brutal but constructive. If code is excellent, say so but still find minor improvements.

Code:
${code}`;
    return generateJsonResponse(prompt);
}

export async function generateInterviewQuestions(weaknesses: string[], techStack: string[]): Promise<{ question: string; hint: string; difficulty: 'easy' | 'medium' | 'hard' }[]> {
    const prompt = `You are a senior tech interviewer at a top FAANG company. Based on the developer's weak areas (${weaknesses.join(', ')}) and their tech stack (${techStack.join(', ')}), generate 8 interview questions. Return JSON: { "questions": [ { "question": string, "hint": string, "difficulty": "easy" | "medium" | "hard" } ] }`;
    const result = await generateJsonResponse(prompt);
    return result.questions || [];
}

export async function generateBranchName(description: string): Promise<string[]> {
    const prompt = `You are a senior developer. Generate 3 professional Git branch names for the following task. Follow conventions: feature/, fix/, chore/, refactor/. Use kebab-case. Return JSON: { "branches": string[] }

Task: ${description}`;
    const result = await generateJsonResponse(prompt);
    return result.branches || [];
}

export async function explainDiff(diff: string): Promise<{ summary: string; changes: { type: 'added' | 'removed' | 'modified'; description: string }[]; impact: string }> {
    const prompt = `You are a senior developer explaining a git diff to a junior developer. Explain this diff in plain English. Return JSON: { "summary": string, "changes": [ { "type": "added" | "removed" | "modified", "description": string } ], "impact": string }

Diff:
${diff.slice(0, 3000)}`;
    return generateJsonResponse(prompt);
}

export async function recommendOpenSource(skills: string[], stack: string[]): Promise<{ name: string; owner: string; description: string; why: string; difficulty: string; url: string }[]> {
    const prompt = `You are an open source mentor. Based on a developer's skills (${skills.join(', ')}) and stack (${stack.join(', ')}), recommend 5 real, popular GitHub repositories they should contribute to. Return JSON: { "repos": [ { "name": string, "owner": string, "description": string, "why": string, "difficulty": "beginner" | "intermediate" | "advanced", "url": string } ] }`;
    const result = await generateJsonResponse(prompt);
    return result.repos || [];
}

export async function auditCommitMessages(commits: { sha: string; message: string; date: string }[]): Promise<{ overall_score: number; verdict: string; commits: { sha: string; message: string; rating: 'professional' | 'acceptable' | 'embarrassing'; reason: string }[] }> {
    const prompt = `You are a senior developer reviewing commit message quality. Rate each commit message as: "professional", "acceptable", or "embarrassing". Give an overall_score out of 10. Return JSON: { "overall_score": number, "verdict": string, "commits": [ { "sha": string, "message": string, "rating": "professional" | "acceptable" | "embarrassing", "reason": string } ] }

Commits: ${JSON.stringify(commits.slice(0, 20))}`;
    return generateJsonResponse(prompt);
}

export async function checkLicenseCompliance(repoLicense: string, dependencies: { name: string; version: string; license?: string }[]): Promise<{ overall_status: 'compliant' | 'warning' | 'violation'; issues: { package: string; license: string; issue: string; severity: 'high' | 'medium' | 'low' }[]; summary: string }> {
    const prompt = `You are a software license compliance expert. Check if the main license (${repoLicense}) is compatible with the listed dependencies. Return JSON: { "overall_status": "compliant" | "warning" | "violation", "issues": [ { "package": string, "license": string, "issue": string, "severity": "high" | "medium" | "low" } ], "summary": string }

Dependencies: ${JSON.stringify(dependencies.slice(0, 30))}`;
    return generateJsonResponse(prompt);
}

export async function recommendTechStack(goal: string, currentStack: string): Promise<{ recommendations: { category: string; current: string; suggested: string; reason: string; migrationEffort: string }[]; summary: string }> {
    const prompt = `You are a senior software architect. Based on the project goal and current stack, recommend improvements and modern alternatives. Return JSON: { "recommendations": [ { "category": string, "current": string, "suggested": string, "reason": string, "migrationEffort": "low" | "medium" | "high" } ], "summary": string }

Project Goal: ${goal}
Current Stack: ${currentStack}`;
    return generateJsonResponse(prompt);
}

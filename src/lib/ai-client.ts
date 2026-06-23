export const DEFAULT_MODEL = "llama-3.3-70b-versatile";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Get all available Groq API keys from environment
 */
function getGroqKeys(): string[] {
    return (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
        .split(",")
        .map(k => k.trim())
        .filter(Boolean);
}

/**
 * Groq-Only AI JSON Generator with multi-key rotation.
 * Cycles through all available Groq keys on failure before giving up.
 */
export async function generateJsonResponse<T = unknown>(prompt: string, attempt: number = 0): Promise<T> {
    const keys = getGroqKeys();

    if (keys.length === 0) {
        throw new Error("CRITICAL: No GROQ_API_KEYS configured in environment.");
    }

    if (attempt >= keys.length) {
        throw new Error(`AI FAILURE: All ${keys.length} Groq keys exhausted.`);
    }

    const currentKey = keys[attempt];

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${currentKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stream: false,
                model: DEFAULT_MODEL,
                messages: [{ role: "system", content: prompt + "\n\nCRITICAL: Respond ONLY with a valid JSON object. No markdown." }],
                response_format: { type: "json_object" },
                temperature: 0.1,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
                return parseAIJson(content) as T;
            }
        }

        console.warn(`[AI] Groq Key ${attempt + 1}/${keys.length} failed (Status: ${response.status}). Rotating...`);
        return generateJsonResponse(prompt, attempt + 1);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`[AI] Groq Key ${attempt + 1} exception: ${errorMessage}. Rotating...`);
        return generateJsonResponse(prompt, attempt + 1);
    }
}

/**
 * Groq-Only Text Generator with multi-key rotation.
 * Used for Markdown/non-JSON tasks (README generation, etc.)
 */
async function generateTextResponse(prompt: string, attempt: number = 0): Promise<string> {
    const keys = getGroqKeys();

    if (keys.length === 0) return "# Error\n\nNo AI API keys configured.";
    if (attempt >= keys.length) return "# Error\n\nAll AI keys exhausted.";

    const key = keys[attempt];
    try {
        const res = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
            }),
        });
        if (res.ok) {
            const data = await res.json();
            return data.choices?.[0]?.message?.content || "";
        }
        return generateTextResponse(prompt, attempt + 1);
    } catch {
        return generateTextResponse(prompt, attempt + 1);
    }
}

/**
 * Groq-Only Streaming Text Generator with multi-key rotation.
 * Used for streaming responses (code review, etc.)
 */
export async function generateStreamResponse(
    messages: { role: string; content: string }[],
    attempt: number = 0
): Promise<Response> {
    const keys = getGroqKeys();

    if (keys.length === 0) throw new Error("No GROQ_API_KEYS configured.");
    if (attempt >= keys.length) throw new Error("All Groq keys exhausted for streaming.");

    const key = keys[attempt];
    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: DEFAULT_MODEL,
                messages,
                stream: true,
                temperature: 0.2,
            }),
        });

        if (response.ok) return response;

        console.warn(`[AI-Stream] Key ${attempt + 1} failed (${response.status}). Rotating...`);
        return generateStreamResponse(messages, attempt + 1);
    } catch {
        return generateStreamResponse(messages, attempt + 1);
    }
}

export interface ProfileAnalysis {
  score: number;
  roastLines: string[];
  categories: {
    Repositories: number;
    Community: number;
    Profile: number;
  };
  suggestions: string[];
}

export interface RepoAnalysis {
  score: number;
  roastLines: string[];
  eli5Lines: string[];
  categories: {
    Architecture: number;
    Performance: number;
    Maintenance: number;
  };
  suggestions: string[];
}

function parseAIJson(content: string): unknown {
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

export async function generateProfileAnalysis(metrics: Record<string, unknown>): Promise<ProfileAnalysis> {
    const prompt = `
YOU ARE A BRUTAL, ELITE SENIOR DEVELOPER. Your job is to perform a "Developer Integrity Audit" on a GitHub profile. 
Be accurate, data-driven, and savage. Do not give participation trophies.

METRICS TO ANALYZE:
${JSON.stringify(metrics, null, 2)}

SCORING ALGORITHM (Internal Guidelines):
- REPOSITORIES (Weight 40%): Use public_repos (Do NOT invent numbers). Look at total_stars relative to impact. High repo count with low stars should be roasted for "Vaporware Production".
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

CRITICAL: Roast lines MUST use the EXACT numbers provided in the metrics. Do NOT hallucinate or round different numbers of repositories or stars. If public_repos is 85, say 85. If total_stars is 38, say 38. Use public_repos for repository counts.
`;
    return generateJsonResponse<ProfileAnalysis>(prompt);
}

export async function generateRepoAnalysis(repoData: Record<string, unknown>): Promise<RepoAnalysis> {
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
    return generateJsonResponse<RepoAnalysis>(prompt);
}

export async function generateReadme(repoData: Record<string, unknown>): Promise<string> {
    const prompt = `You are a senior developer. Generate a complete, professional, and visually stunning README.md for a GitHub repository based on the following metadata. Use emoji, badges, and great formatting. Include: title, description, features, getting started, tech stack, contributing, license. Return ONLY the raw markdown text, nothing else.
 
 Repository Data:
 ${JSON.stringify(repoData, null, 2)}`;
 
     return generateTextResponse(prompt);
 }
 
 export async function generateResumePoints(githubUsername: string, analyses: Record<string, unknown>[]): Promise<string[]> {
    const prompt = `You are a professional tech recruiter and resume writer. Based on the following developer profile data for GitHub user "${githubUsername}", generate 6 powerful, quantified resume bullet points. Each bullet should start with a strong action verb and include specifics. Return JSON: { "bullets": string[] }

Analysis Data: ${JSON.stringify(analyses.slice(0, 5))}`;
    const result = await generateJsonResponse<{ bullets: string[] }>(prompt);
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
    const result = await generateJsonResponse<{ questions: { question: string; hint: string; difficulty: 'easy' | 'medium' | 'hard' }[] }>(prompt);
    return result.questions || [];
}

export async function generateBranchName(description: string): Promise<string[]> {
    const prompt = `You are a senior developer. Generate 3 professional Git branch names for the following task. Follow conventions: feature/, fix/, chore/, refactor/. Use kebab-case. Return JSON: { "branches": string[] }

Task: ${description}`;
    const result = await generateJsonResponse<{ branches: string[] }>(prompt);
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
    const result = await generateJsonResponse<{ repos: { name: string; owner: string; description: string; why: string; difficulty: string; url: string }[] }>(prompt);
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

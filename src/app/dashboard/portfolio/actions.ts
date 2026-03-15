"use server";

import { auth } from "@/auth";
import { getSambaNovaResponse } from "@/lib/ai-repo-fixer";
import { prisma } from "@/lib/prisma";
import { calculateJobCompatibility } from "@/lib/job-compatibility";

const GITHUB_API = "https://api.github.com";

async function getHeaders() {
    const session = await auth();
    if (!session?.user?.accessToken) {
        return null;
    }
    return {
        Authorization: `Bearer ${session.user.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
}

export async function generatePortfolioData(template: string = "crucible") {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");
        const headers = await getHeaders();

        // 1. Fetch User Profile
        if (!headers) throw new Error("GitHub access token required.");
        const userRes = await fetch(`${GITHUB_API}/user`, { headers });
        if (!userRes.ok) throw new Error(`GitHub Profile Error: ${await userRes.text()}`);
        const userData = await userRes.json();

        // 2. Fetch User Repos (High sample to find best 5)
        if (!headers) throw new Error("GitHub access token required.");
        const repoRes = await fetch(`${GITHUB_API}/user/repos?sort=updated&per_page=60`, { headers });
        if (!repoRes.ok) throw new Error(`GitHub Repos Error: ${await repoRes.text()}`);
        const allRepos = await repoRes.json();

        // 3. Filter out forks, noisy names, and sort by SIZE for preliminary candidate selection
        const candidateRepos = allRepos
            .filter((r: any) => {
                if (r.fork) return false;
                const name = r.name.toLowerCase();
                return !name.includes('source') &&
                       !name.includes('test') &&
                       !name.includes('demo') &&
                       !name.includes('hub') &&
                       !name.includes('smartwatch');
            })
            .sort((a: any, b: any) => b.size - a.size) 
            .slice(0, 15);

        // 4. Fetch Rich Metadata (README & Languages) for candidates in parallel
        const enrichedRepos = await Promise.all(candidateRepos.map(async (r: any) => {
            try {
                // Fetch Languages
                if (!headers) return null; // Skip this repo if headers are missing
                const langRes = await fetch(`${GITHUB_API}/repos/${userData.login}/${r.name}/languages`, { headers });
                const languages = langRes.ok ? await langRes.json() : {};

                // Fetch README snippet (first 1500 chars)
                if (!headers) return null; // Skip this repo if headers are missing
                const readmeRes = await fetch(`${GITHUB_API}/repos/${userData.login}/${r.name}/readme`, { headers });
                let readme = "";
                if (readmeRes.ok) {
                    const readmeData = await readmeRes.json();
                    readme = Buffer.from(readmeData.content, 'base64').toString('utf8').substring(0, 1500);
                }

                return {
                    name: r.name,
                    description: r.description,
                    language: r.language,
                    all_languages: Object.keys(languages),
                    stars: r.stargazers_count,
                    topics: r.topics,
                    url: r.html_url,
                    live_url: r.homepage || "", // Include deployment URL
                    readme_summary: readme,
                    size: r.size
                };
            } catch (e) {
                return {
                    name: r.name,
                    description: r.description,
                    language: r.language,
                    url: r.html_url,
                    stars: r.stargazers_count
                };
            }
        }));

        const developerContext = {
            login: userData.login,
            name: userData.name,
            bio: userData.bio,
            followers: userData.followers,
            following: userData.following,
            public_repos: userData.public_repos,
            topProjectCandidates: enrichedRepos,
            location: userData.location,
            company: userData.company,
            email: userData.email || `hello+${userData.login}@${userData.login}.dev`
        };

        // 3. Fetch User Certificates from Library
        const userCertificates = await (prisma as any).libraryAsset.findMany({
            where: { 
                user_id: session.user.id,
                type: "CERTIFICATE"
            },
            orderBy: { created_at: "desc" }
        });

        const certificateData = userCertificates.map((cert: any) => ({
            id: cert.id,
            title: cert.title,
            file_url: cert.file_url,
            created_at: cert.created_at
        }));

        // 4. SambaNova AI Generation
        const prompt = `You are the world's leading Digital Brand Strategist for the 1% of developers.
Transform this raw GitHub data into a WORLD-CLASS, ELITE engineering identity that feels like a multi-million dollar talent profile.

Context:
${JSON.stringify(developerContext, null, 2)}

Instructions:
1. NARRATIVE: Use 'The Architect' style. Focus on scale, impact, and complexity. 
2. VOCABULARY: Use high-level terms (e.g. 'Orchestrating', 'Optimizing', 'Engineered for Scale', 'Distributed Mastery').
3. PERSONALITY: Add a sharp, witty 'Roast' that shows they have an ego but the skills to back it up.
4. VIBE: Give them a legendary archetype title.

Generate JSON:
{
  "hero": {
    "tagline": "A legendary, high-impact career headline.",
    "about": "A 3-sentence narrative that makes them sound like a tech deity."
  },
  "vibe": {
    "title": "A legendary title (e.g. 'Cloud Orchestrator' / 'Concurrency King')",
    "description": "A 1-sentence analytical insight into their coding style."
  },
  "roast": "A witty, professional roast of their GitHub habits.",
  "status": "A short, dynamic 1-word status (e.g. 'Synthesizing', 'Architecting', 'Online')",
  "achievements": [
    { "label": "Technical Depth", "value": "e.g. '9.8/10'" },
    { "label": "System Efficiency", "value": "e.g. '99.9%'" }
  ],
  "roadmap": [
    { "phase": "Phase 1: Scale to Millions", "goal": "Architecting a globally distributed cache using Redis and Go." }
  ],
  "techStack": {
    "frontend": ["Tech 1", "Tech 2"],
    "backend": ["Tech 1", "Tech 2"],
    "infrastructure": ["Tech 1", "Tech 2"],
    "devTools": ["Tech 1", "Tech 2"]
  },
  "dnaStats": [
    { "label": "Code Velocity", "value": "High", "icon": "Zap" },
    { "label": "Architecture", "value": "Modular", "icon": "Box" },
    { "label": "Problem Solving", "value": "S-Tier", "icon": "Brain" }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "How this project solved a complex engineering problem.",
      "techStacks": ["List", "of", "Tech"],
      "impact": "A stunning metric (e.g. 'Reduced overhead by 40%')",
      "url": "THE ACTUAL GITHUB URL FROM CONTEXT",
      "liveUrl": "THE ACTUAL DEPLOYMENT/HOMEPAGE URL FROM CONTEXT OR EMPTY STRING"
    }
  ],
  "experience": {
    "summary": "A dynamic domain expertise summary.",
    "specialties": ["Distributed Systems", "AI Infrastructure"]
  },
  "skills": ["Their 8 strongest, most impressive skills"]
}

Important: 
- ONLY VALID JSON. 
- You MUST pick exactly 5 projects. 
- SELECTION CRITERIA: 
  1. Conceptual Depth: How innovative or complex is the solution?
  2. Technical Breadth: Prioritize projects using multiple languages/frameworks (check 'all_languages' and README).
  3. Real-World Utility: Does the README show a working, useful system?
- Ignore scratch/toy projects (like 'Time-Pass' or 'test') unless they demonstrate S-tier logic.
- Be AGGRESSIVE and STUNNING.`;

        let aiResponse = await getSambaNovaResponse(prompt);
        // Clean markdown
        if (aiResponse.startsWith("\`\`\`json")) aiResponse = aiResponse.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        else if (aiResponse.startsWith("\`\`\`")) aiResponse = aiResponse.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

        const portfolioData = JSON.parse(aiResponse.trim());

        // 5. Save to Database
        const portfolio = await prisma.portfolio.upsert({
            where: { username: userData.login },
            update: {
                hero: {
                    ...portfolioData.hero,
                    vibe: portfolioData.vibe,
                    roast: portfolioData.roast,
                    achievements: portfolioData.achievements,
                    roadmap: portfolioData.roadmap,
                    techStack: portfolioData.techStack,
                    dnaStats: portfolioData.dnaStats,
                    status: portfolioData.status || "Synchronized",
                    contactEmail: developerContext.email
                },
                projects: portfolioData.projects,
                experience: JSON.stringify(portfolioData.experience),
                skills: portfolioData.skills,
                certificates: certificateData as any,
                template: template
            } as any,
            create: {
                user_id: session.user.id,
                username: userData.login,
                hero: {
                    ...portfolioData.hero,
                    vibe: portfolioData.vibe,
                    roast: portfolioData.roast,
                    achievements: portfolioData.achievements,
                    roadmap: portfolioData.roadmap,
                    techStack: portfolioData.techStack,
                    dnaStats: portfolioData.dnaStats,
                    status: portfolioData.status || "Synchronized",
                    contactEmail: developerContext.email
                },
                projects: portfolioData.projects,
                experience: JSON.stringify(portfolioData.experience),
                skills: portfolioData.skills,
                certificates: certificateData as any,
                template: template
            } as any
        });

        // 5. Generate Job Compatibility Analysis in Background/Parallel
        const compatibility = await calculateJobCompatibility(developerContext);
        if (compatibility) {
            await prisma.analysis.create({
                data: {
                    user_id: session.user.id,
                    analysis_type: "job_compatibility",
                    target: userData.login,
                    score: 0, // N/A for this type
                    result_json: compatibility as any
                }
            });
        }

        return { success: true, portfolio };
    } catch (error: any) {
        console.error("Generate Portfolio Output Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getPortfolioData(username: string) {
    try {
        const portfolio = await prisma.portfolio.findUnique({
            where: { username }
        });

        if (!portfolio) return { success: false, error: "Portfolio not found" };

        const compatibilityScore = await prisma.analysis.findFirst({
            where: {
                target: username,
                analysis_type: "job_compatibility"
            },
            orderBy: { created_at: "desc" }
        });

        return {
            success: true,
            portfolio,
            compatibility: compatibilityScore?.result_json || null
        };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getUserPortfolio() {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const portfolio = await prisma.portfolio.findFirst({
            where: { user_id: session.user.id }
        });

        return { success: true, portfolio };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function saveManualPortfolio(portfolioData: any) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const portfolio = await prisma.portfolio.upsert({
            where: { username: portfolioData.username },
            update: {
                hero: portfolioData.hero,
                projects: portfolioData.projects,
                experience: JSON.stringify(portfolioData.experience),
                skills: portfolioData.skills,
                template: portfolioData.template
            } as any,
            create: {
                user_id: session.user.id,
                username: portfolioData.username,
                hero: portfolioData.hero,
                projects: portfolioData.projects,
                experience: JSON.stringify(portfolioData.experience),
                skills: portfolioData.skills,
                template: portfolioData.template
            } as any
        });

        return { success: true, portfolio };
    } catch (error: any) {
        console.error("Save Manual Portfolio Error:", error);
        return { success: false, error: error.message };
    }
}

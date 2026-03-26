"use server";

import { auth } from "@/auth";
import { getSambaNovaResponse } from "@/lib/ai-repo-fixer";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
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

interface GitHubUserProfile {
    login: string;
    name: string | null;
    bio: string | null;
    followers: number;
    following: number;
    public_repos: number;
    location: string | null;
    company: string | null;
    email: string | null;
}

interface GitHubRepoRaw {
    name: string;
    description: string | null;
    fork: boolean;
    size: number;
    language: string | null;
    stargazers_count: number;
    topics: string[];
    html_url: string;
    homepage: string | null;
}

interface EnrichedRepo {
    name: string;
    description: string | null;
    language: string | null;
    all_languages: string[];
    stars: number;
    topics: string[];
    url: string;
    live_url: string;
    readme_summary: string;
    size: number;
}

interface PortfolioAIOutput {
    hero: {
        tagline: string;
        about: string;
    };
    vibe: {
        title: string;
        description: string;
    };
    roast: string;
    status: string;
    achievements: { label: string; value: string }[];
    roadmap: { phase: string; goal: string }[];
    techStack: {
        frontend: string[];
        backend: string[];
        infrastructure: string[];
        devTools: string[];
    };
    dnaStats: { label: string; value: string; icon: string }[];
    projects: {
        title: string;
        description: string;
        techStacks: string[];
        impact: string;
        url: string;
        liveUrl: string;
    }[];
    experience: {
        summary: string;
        specialties: string[];
    };
    skills: string[];
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
        const userData = await userRes.json() as GitHubUserProfile;

        // 2. Fetch User Repos (High sample to find best 5)
        const repoRes = await fetch(`${GITHUB_API}/user/repos?sort=updated&per_page=60`, { headers });
        if (!repoRes.ok) throw new Error(`GitHub Repos Error: ${await repoRes.text()}`);
        const allRepos = await repoRes.json() as GitHubRepoRaw[];

        // 3. Filter out forks, noisy names, and sort by SIZE for preliminary candidate selection
        const candidateRepos = allRepos
            .filter(r => {
                if (r.fork) return false;
                const name = r.name.toLowerCase();
                return !name.includes('source') &&
                       !name.includes('test') &&
                       !name.includes('demo') &&
                       !name.includes('hub') &&
                       !name.includes('smartwatch');
            })
            .sort((a, b) => b.size - a.size) 
            .slice(0, 15);

        // 4. Fetch Rich Metadata (README & Languages) for candidates in parallel
        const enrichedRepos = await Promise.all(candidateRepos.map(async (r) => {
            try {
                // Fetch Languages
                const langRes = await fetch(`${GITHUB_API}/repos/${userData.login}/${r.name}/languages`, { headers });
                const languages = langRes.ok ? await langRes.json() : {};

                // Fetch README snippet (first 1500 chars)
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
                    live_url: r.homepage || "",
                    readme_summary: readme,
                    size: r.size
                } as EnrichedRepo;
            } catch {
                return {
                    name: r.name,
                    description: r.description,
                    language: r.language,
                    url: r.html_url,
                    stars: r.stargazers_count,
                    all_languages: [],
                    topics: [],
                    live_url: "",
                    readme_summary: "",
                    size: r.size
                } as EnrichedRepo;
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
        const userCertificates = await prisma.libraryAsset.findMany({
            where: { 
                user_id: session.user.id,
                type: "CERTIFICATE"
            },
            orderBy: { created_at: "desc" }
        });

        const certificateData = userCertificates.map(cert => ({
            id: cert.id,
            title: cert.title,
            file_url: cert.file_url,
            created_at: cert.created_at
        }));

        // 4. SambaNova AI Generation
        const prompt = `Elite engineering identity generation... JSON schema: { hero, vibe, roast, status, achievements, roadmap, techStack, dnaStats, projects, experience, skills }. Context: ${JSON.stringify(developerContext)}`;

        const aiResponse = await getSambaNovaResponse(prompt);
        let clean = aiResponse.trim();
        if (clean.startsWith("\`\`\`json")) clean = clean.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        else if (clean.startsWith("\`\`\`")) clean = clean.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

        const portfolioData = JSON.parse(clean) as PortfolioAIOutput;

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
                certificates: certificateData,
                template: template
            },
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
                certificates: certificateData,
                template: template
            }
        });

        // 5. Generate Job Compatibility Analysis
        const compatibility = await calculateJobCompatibility(developerContext);
        if (compatibility) {
            await prisma.analysis.create({
                data: {
                    user_id: session.user.id,
                    analysis_type: "job_compatibility",
                    target: userData.login,
                    score: 0,
                    result_json: compatibility as unknown as Prisma.InputJsonValue
                }
            });
        }

        return { success: true, portfolio };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Portfolio generation failed";
        console.error("Generate Portfolio Output Error:", error);
        return { success: false, error: message };
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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Fetch failed";
        return { success: false, error: message };
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
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Fetch failed";
        return { success: false, error: message };
    }
}

export async function saveManualPortfolio(portfolioData: {
    username: string;
    hero: {
        tagline: string;
        about: string;
        vibe?: { title: string; description: string };
        roast?: string;
        achievements?: { label: string; value: string }[];
        roadmap?: { goal: string; phase: string }[];
        techStack?: Record<string, string[]>;
        dnaStats?: { icon: string; label: string; value: string }[];
        status?: string;
        contactEmail?: string;
    };
    projects: {
        title: string;
        description: string;
        techStacks: string[];
        url?: string;
        liveUrl?: string;
        impact?: string;
    }[];
    experience: string | { summary: string };
    skills: string[];
    template: string;
}) {
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
            },
            create: {
                user_id: session.user.id,
                username: portfolioData.username,
                hero: portfolioData.hero,
                projects: portfolioData.projects,
                experience: JSON.stringify(portfolioData.experience),
                skills: portfolioData.skills,
                template: portfolioData.template
            }
        });

        return { success: true, portfolio };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Save failed";
        console.error("Save Manual Portfolio Error:", error);
        return { success: false, error: message };
    }
}

export async function generateLinkedInCaption(username: string, roast: string, score: number) {
    try {
        const prompt = `LinkedIn caption for @${username}. Roast: "${roast}". Score: ${score.toFixed(1)}/10. Max 400 chars. #DevRoast #GitHubAudit`;

        const caption = await getSambaNovaResponse(prompt);
        return { success: true, caption: caption.trim() };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Caption generation failed";
        console.error("LinkedIn Caption Error:", error);
        return { success: false, error: message };
    }
}

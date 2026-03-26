import { NextResponse } from "next/server";
import { generateRepoAnalysis } from "@/lib/sambanova";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { scanForSecrets } from "@/lib/secrets";
import { auditDependencies } from "@/lib/dependency-auditor";
import { validateApiKey } from "@/lib/api-key-auth";

const GITHUB_API_BASE = "https://api.github.com";

export async function POST(request: Request) {
    const session = await auth();
    
    // Support both session auth AND API key auth (Bearer drk_xxx)
    let resolvedUserId: string | null = session?.user?.id ?? null;
    let resolvedGithubToken: string | null = (session?.user as { accessToken?: string })?.accessToken ?? null;

    if (!resolvedUserId) {
        const apiKeyData = await validateApiKey(request.headers.get("authorization"));
        if (apiKeyData) {
            resolvedUserId = apiKeyData.userId;
            resolvedGithubToken = apiKeyData.githubAccessToken;
        }
    }

    try {
        const body = await request.json();
        const { owner, repo } = body;

        if (!owner || !repo) {
            return NextResponse.json({ error: "Owner and Repo are required" }, { status: 400 });
        }

        const headers = {
            "Accept": "application/vnd.github.v3+json",
            ...(resolvedGithubToken && { Authorization: `Bearer ${resolvedGithubToken}` }),
            ...(!resolvedGithubToken && process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
            ...(!resolvedGithubToken && process.env.AUTH_GITHUB_TOKEN && { Authorization: `Bearer ${process.env.AUTH_GITHUB_TOKEN}` })
        };

        // 1. Fetch Raw Repo Metadata
        const repoRes = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers });
        if (!repoRes.ok) {
            return NextResponse.json({ error: "Repository not found or rate limited." }, { status: repoRes.status });
        }
        const repoData = await repoRes.json();

        // Optionally fetch languages or recent commits, but basic repo metadata carries a lot of signals
        const languagesRes = await fetch(repoData.languages_url, { headers });
        let languages = languagesRes.ok ? await languagesRes.json() : {};

        // Truncate languages object if it's too large (some repos return hundreds of files mapped)
        if (Object.keys(languages).length > 5) {
            languages = Object.fromEntries(Object.entries(languages).slice(0, 5));
        }

        const originalDesc = Object.prototype.toString.call(repoData.description) === '[object String]' ? repoData.description : '';
        const scanResult = scanForSecrets(originalDesc);
        const safeDescription = scanResult.cleanText.length > 300 ? scanResult.cleanText.substring(0, 300) + "..." : scanResult.cleanText;

        const metrics = {
            name: repoData.name,
            full_name: repoData.full_name,
            description: safeDescription,
            stargazers_count: repoData.stargazers_count,
            watchers_count: repoData.watchers_count,
            forks_count: repoData.forks_count,
            open_issues_count: repoData.open_issues_count,
            has_issues: repoData.has_issues,
            has_wiki: repoData.has_wiki,
            has_pages: repoData.has_pages,
            created_at: repoData.created_at,
            updated_at: repoData.updated_at,
            pushed_at: repoData.pushed_at,
            language: repoData.language,
            languages_breakdown: languages || {},
            default_branch: repoData.default_branch,
            license: repoData.license?.name || "None",
            security_leaks: scanResult.hasSecrets ? Math.max(1, scanResult.matches.length) : 0
        };

        // 2. Pass to AI for Scoring and Roast
        const roastData = await generateRepoAnalysis(metrics);

        // 3. Audit Dependencies (Tech Debt)
        const depsAudit = await auditDependencies(owner, repo, headers);

// Mix the original request identifiers and technical metrics back in
        const finalResponse = {
            owner,
            repo,
            ...(roastData as object),
            languages_breakdown: languages || {},
            dependencyHealth: depsAudit,
            mainLanguage: repoData.language
        };

        let isSaved = false;
        // Save to Database if user is authenticated (session OR API key)
        if (resolvedUserId) {
            await prisma.analysis.create({
                data: {
                    user_id: resolvedUserId,
                    analysis_type: "repository",
                    target: `${owner}/${repo}`,
                    score: roastData.score || 5.0,
                    result_json: finalResponse
                }
            });
            isSaved = true;
        }

        return NextResponse.json({ ...finalResponse, isSaved });

    } catch (error: unknown) {
        console.error("Repo Analysis Error:", error);
        const message = error instanceof Error ? error.message : "Failed to process repository analysis";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

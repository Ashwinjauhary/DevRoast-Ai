import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const GITHUB_API_BASE = "https://api.github.com";

function logDebug(message: string) {
    console.log(`[DEBUG][github-profile] ${message}`);
}

export async function GET(request: Request) {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        logDebug(`Analyzing profile for: ${username}`);

        let githubToken = (session?.user as any)?.accessToken;
        let tokenSource = "session";

        if (!githubToken && session?.user?.id) {
            try {
                const account = await prisma.account.findFirst({
                    where: {
                        userId: session.user.id,
                        provider: "github"
                    }
                });
                githubToken = account?.access_token;
                tokenSource = "database";
            } catch (dbError) {
                logDebug(`Database error fetching token: ${dbError}`);
            }
        }

        if (!githubToken) {
            githubToken = process.env.GITHUB_TOKEN || process.env.AUTH_GITHUB_TOKEN;
            tokenSource = githubToken ? "environment" : "none";
        }

        logDebug(`Using token from ${tokenSource}`);

        const headers: any = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DevRoast-AI"
        };

        if (githubToken) {
            headers["Authorization"] = `Bearer ${githubToken}`;
        }

        const isSelfAnalysis = (session?.user as any)?.github_username?.toLowerCase() === username.toLowerCase() ||
            session?.user?.name?.toLowerCase() === username.toLowerCase();

        const reposUrl = (isSelfAnalysis && githubToken)
            ? `${GITHUB_API_BASE}/user/repos?type=all&per_page=100&sort=updated`
            : `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`;

        logDebug(`Fetching data from GitHub...`);
        
        const userRes = await fetch(`${GITHUB_API_BASE}/users/${username}`, { headers });
        
        if (!userRes.ok) {
            const status = userRes.status || 500;
            logDebug(`GitHub User API failed: ${status}`);
            return NextResponse.json({
                error: "GitHub user not found or rate limited.",
                details: `User API returned ${status}`
            }, { status });
        }

        const userData = await userRes.json();

        // Fetch repos and events in parallel
        const [reposRes, eventsRes] = await Promise.all([
            fetch(reposUrl, { headers }).catch(e => {
                logDebug(`Repos fetch failed: ${e.message}`);
                return null;
            }),
            fetch(`${GITHUB_API_BASE}/users/${username}/events/public?per_page=30`, { headers }).catch(e => {
                logDebug(`Events fetch failed: ${e.message}`);
                return null;
            })
        ]);

        const reposData = (reposRes && reposRes.ok) ? await reposRes.json() : [];
        const eventsData = (eventsRes && eventsRes.ok) ? await eventsRes.json() : [];

        const safeRepos = Array.isArray(reposData) ? reposData : [];
        const safeEvents = Array.isArray(eventsData) ? eventsData : [];

        if (!Array.isArray(reposData)) {
            logDebug(`reposData is not an array: ${typeof reposData}`);
        }

        // Compute derived metrics safely
        const totalStars = safeRepos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);
        const totalForks = safeRepos.reduce((acc: number, repo: any) => acc + (repo.forks_count || 0), 0);
        const totalWatchers = safeRepos.reduce((acc: number, repo: any) => acc + (repo.watchers_count || 0), 0);

        const languages = safeRepos
            .map((r: any) => r.language)
            .filter(Boolean)
            .reduce((acc: Record<string, number>, lang: string) => {
                acc[lang] = (acc[lang] || 0) + 1;
                return acc;
            }, {});

        const topLanguages = Object.entries(languages)
            .sort((a: any, b: any) => b[1] - a[1])
            .slice(0, 5)
            .map(([lang]) => lang);

        const repositoriesWithNoDescription = safeRepos.filter((r: any) => !r.description).length;
        const hasReadme = safeRepos.some((r: any) => r.name && r.name.toLowerCase() === username.toLowerCase());

        const totalRepos = safeRepos.length;
        const createdAt = userData.created_at ? new Date(userData.created_at) : new Date();
        const accountAgeDays = Math.max(0, Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));

        const rawMetrics = {
            total_repos: totalRepos,
            public_repos: userData.public_repos || 0,
            private_repos: userData.total_private_repos || Math.max(0, totalRepos - (userData.public_repos || 0)),
            followers: userData.followers || 0,
            following: userData.following || 0,
            account_age_days: accountAgeDays || 0,
            total_stars: totalStars,
            total_forks: totalForks,
            total_watchers: totalWatchers,
            top_languages: topLanguages,
            recent_events_count: safeEvents.length,
            repositories_missing_description: repositoriesWithNoDescription,
            has_profile_readme: hasReadme,
            bio: userData.bio || "No bio provided.",
            location: userData.location || "Ghost Town",
            company: userData.company || "Self-Employed",
        };

        return NextResponse.json(rawMetrics);

    } catch (error: any) {
        logDebug(`Critical Error: ${error.message}`);
        console.error("Critical GitHub Fetch Error:", error);
        return NextResponse.json({
            error: "Failed to fetch GitHub data",
            details: error.message
        }, { status: 500 });
    }
}

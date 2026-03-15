import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

const GITHUB_API_BASE = "https://api.github.com";
const LOG_FILE = "./api-debug.log";

function logDebug(message: string) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
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
        logDebug(`Session User ID: ${session?.user?.id}`);

        let githubToken = (session?.user as any)?.accessToken;
        let tokenSource = "session";

        // If no token in session, check if there's a linked GitHub account in DB
        if (!githubToken && session?.user?.id) {
            const account = await prisma.account.findFirst({
                where: {
                    userId: session.user.id,
                    provider: "github"
                }
            });
            githubToken = account?.access_token;
            tokenSource = "database";
        }

        if (!githubToken) {
            if (process.env.GITHUB_TOKEN) tokenSource = "env.GITHUB_TOKEN";
            else if (process.env.AUTH_GITHUB_TOKEN) tokenSource = "env.AUTH_GITHUB_TOKEN";
            else tokenSource = "none";
        }

        logDebug(`Using GitHub token from: ${tokenSource} (exists: ${!!githubToken || !!process.env.GITHUB_TOKEN || !!process.env.AUTH_GITHUB_TOKEN})`);

        const headers: any = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DevRoast-AI"
        };

        if (githubToken) {
            headers["Authorization"] = `Bearer ${githubToken}`;
        } else if (process.env.GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
        } else if (process.env.AUTH_GITHUB_TOKEN) {
            headers["Authorization"] = `Bearer ${process.env.AUTH_GITHUB_TOKEN}`;
        }

        // 1. Determine the correct endpoint for repos
        // If the username we are analyzing is the same as the authenticated user, we can fetch all repos (including private)
        const isSelfAnalysis = session?.user?.name?.toLowerCase() === username.toLowerCase() || (session?.user as any)?.github_username?.toLowerCase() === username.toLowerCase();
        const reposUrl = (isSelfAnalysis && githubToken)
            ? `${GITHUB_API_BASE}/user/repos?type=all&per_page=100&sort=updated`
            : `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`;

        // Parallel fetching for performance
        const [userRes, reposRes, eventsRes] = await Promise.all([
            fetch(`${GITHUB_API_BASE}/users/${username}`, { headers }),
            fetch(reposUrl, { headers }),
            fetch(`${GITHUB_API_BASE}/users/${username}/events/public?per_page=30`, { headers })
        ]);

        if (!userRes.ok) {
            return NextResponse.json({ error: "GitHub user not found or rate limited." }, { status: userRes.status });
        }

        const userData = await userRes.json();
        const reposData = reposRes.ok ? await reposRes.json() : [];
        const eventsData = eventsRes.ok ? await eventsRes.json() : [];

        // Compute derived metrics
        const totalStars = reposData.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);
        const totalForks = reposData.reduce((acc: number, repo: any) => acc + (repo.forks_count || 0), 0);
        const totalWatchers = reposData.reduce((acc: number, repo: any) => acc + (repo.watchers_count || 0), 0);
        
        const languages = reposData
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

        const repositoriesWithNoDescription = reposData.filter((r: any) => !r.description).length;
        const hasReadme = reposData.some((r: any) => r.name.toLowerCase() === username.toLowerCase());

        const totalRepos = reposData.length;
        const accountAgeDays = Math.floor((new Date().getTime() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24));

        const rawMetrics = {
            total_repos: totalRepos,
            public_repos: userData.public_repos,
            private_repos: userData.total_private_repos || (totalRepos - userData.public_repos),
            followers: userData.followers,
            following: userData.following,
            account_age_days: accountAgeDays,
            total_stars: totalStars,
            total_forks: totalForks,
            total_watchers: totalWatchers,
            top_languages: topLanguages,
            recent_events_count: eventsData.length,
            repositories_missing_description: repositoriesWithNoDescription,
            has_profile_readme: hasReadme,
            bio: userData.bio || "No bio provided.",
            location: userData.location || "Ghost Town",
            company: userData.company || "Self-Employed (Probably Unemployment)",
        };

        return NextResponse.json(rawMetrics);

    } catch (error) {
        console.error("GitHub Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
    }
}

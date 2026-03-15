import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateRepoAnalysis } from "@/lib/sambanova";
import { scanForSecrets } from "@/lib/secrets";

const GITHUB_API = "https://api.github.com";

export async function GET(request: Request) {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const org = searchParams.get("org");

    if (!org) return NextResponse.json({ error: "org parameter required" }, { status: 400 });

    try {
        const token = (session?.user as any)?.accessToken;
        const headers: HeadersInit = {
            Accept: "application/vnd.github.v3+json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
        };

        // Get top 10 repos
        const reposRes = await fetch(`${GITHUB_API}/orgs/${org}/repos?sort=updated&per_page=10&type=public`, { headers });
        if (!reposRes.ok) {
            // Try user endpoint as fallback (for personal accounts)
            const userReposRes = await fetch(`${GITHUB_API}/users/${org}/repos?sort=updated&per_page=10&type=public`, { headers });
            if (!userReposRes.ok) return NextResponse.json({ error: "Organization or user not found." }, { status: 404 });
        }

        const reposData = reposRes.ok
            ? await reposRes.json()
            : await (await fetch(`${GITHUB_API}/users/${org}/repos?sort=updated&per_page=10&type=public`, { headers })).json();

        const repos = reposData.slice(0, 10);

        // Analyze each repo (limited to avoid rate limits)
        const results = await Promise.all(
            repos.slice(0, 6).map(async (repo: any) => {
                try {
                    const langRes = await fetch(repo.languages_url, { headers });
                    const languages = langRes.ok ? await langRes.json() : {};
                    const descScan = scanForSecrets(repo.description || "");
                    const metrics = {
                        name: repo.name,
                        full_name: repo.full_name,
                        description: descScan.cleanText.slice(0, 200),
                        stargazers_count: repo.stargazers_count,
                        forks_count: repo.forks_count,
                        open_issues_count: repo.open_issues_count,
                        language: repo.language,
                        languages_breakdown: languages,
                        has_issues: repo.has_issues,
                        updated_at: repo.updated_at,
                        license: repo.license?.name || "None",
                        security_leaks: 0,
                    };
                    const analysis = await generateRepoAnalysis(metrics);
                    return { name: repo.name, score: analysis.score || 5.0, language: repo.language };
                } catch {
                    return { name: repo.name, score: 5.0, language: repo.language };
                }
            })
        );

        const scores = results.map(r => r.score);
        const avg_score = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const best = results.reduce((a, b) => a.score > b.score ? a : b, results[0]);
        const worst = results.reduce((a, b) => a.score < b.score ? a : b, results[0]);

        return NextResponse.json({
            org,
            total_repos: results.length,
            avg_score,
            best,
            worst,
            repos: results,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

"use server";

import { auth } from "@/auth";
import { generateProfileAnalysis } from "@/lib/sambanova";

const GITHUB_API = "https://api.github.com";

async function fetchGitHubProfile(username: string, token?: string) {
    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };

    const res = await fetch(`${GITHUB_API}/users/${username}`, { headers });
    if (!res.ok) throw new Error(`User @${username} not found on GitHub.`);
    const data = await res.json();

    const reposRes = await fetch(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100`, { headers });
    const repos = reposRes.ok ? await reposRes.json() : [];

    const eventsRes = await fetch(`${GITHUB_API}/users/${username}/events/public?per_page=100`, { headers });
    const events = eventsRes.ok ? await eventsRes.json() : [];

    return {
        login: data.login,
        name: data.name,
        bio: data.bio,
        location: data.location,
        followers: data.followers,
        following: data.following,
        public_repos: data.public_repos,
        created_at: data.created_at,
        avatar_url: data.avatar_url,
        total_stars: repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0),
        top_languages: Array.from(new Set(repos.map((r: any) => r.language).filter(Boolean))).slice(0, 5),
        recent_events_count: events.length,
        account_age_days: Math.floor((Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24)),
    };
}

export async function performDuel(user1: string, user2: string) {
    const session = await auth();
    const token = (session?.user as any)?.accessToken;

    try {
        const [data1, data2] = await Promise.all([
            fetchGitHubProfile(user1, token),
            fetchGitHubProfile(user2, token)
        ]);

        const [analysis1, analysis2] = await Promise.all([
            generateProfileAnalysis(data1),
            generateProfileAnalysis(data2)
        ]);

        // SambaNova decides the winner based on the technical depth and roast quality
        const duelPrompt = `
        YOU ARE THE GRAND MASTER OF THE NEURAL COLISEUM. 
        TWO DEVELOPERS ARE DUELING FOR TECHNICAL SUPREMACY.

        DEVELOPER 1: @${user1} (Score: ${analysis1.score})
        Analysis: ${JSON.stringify(analysis1.roastLines)}

        DEVELOPER 2: @${user2} (Score: ${analysis2.score})
        Analysis: ${JSON.stringify(analysis2.roastLines)}

        COMPARE THEM BRUTALLY. DECIDE A WINNER.
        
        OUTPUT JSON ONLY:
        {
            "winner": "${user1}" | "${user2}" | "DRAW",
            "verdict": "A 2-sentence savage explanation of why the winner dominated.",
            "statsComparison": {
                "stars": ["${data1.total_stars}", "${data2.total_stars}"],
                "repos": ["${data1.public_repos}", "${data2.public_repos}"],
                "followers": ["${data1.followers}", "${data2.followers}"],
                "impact": ["${analysis1.score}", "${analysis2.score}"]
            },
            "roastForLoser": "A specific, soul-crushing roast for the person who lost.",
            "victoryTitle": "e.g. The Architectural Overlord, The Script Kiddie Slayer, etc."
        }
        `;

        const { getSambaNovaResponse } = await import("@/lib/ai-repo-fixer");
        const duelResultText = await getSambaNovaResponse(duelPrompt);
        
        let cleaned = duelResultText.trim();
        if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\n?/, "").replace(/\n?```$/, "");
        
        const duelResult = JSON.parse(cleaned);

        return {
            success: true,
            players: {
                user1: { ...data1, analysis: analysis1 },
                user2: { ...data2, analysis: analysis2 },
            },
            result: duelResult
        };
    } catch (error: any) {
        console.error("Duel Error:", error);
        return { success: false, error: error.message };
    }
}

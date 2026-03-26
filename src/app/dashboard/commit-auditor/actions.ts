"use server";

import { auth } from "@/auth";
import { auditCommitMessages } from "@/lib/sambanova";

const GITHUB_API = "https://api.github.com";

export async function auditCommits(owner: string, repo: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    try {
        const token = (session.user as { accessToken?: string }).accessToken;
        const headers: HeadersInit = {
            Accept: "application/vnd.github.v3+json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=20`, { headers });
        if (!res.ok) return { error: "Failed to fetch commits. Make sure the repo is accessible." };

        const commits = await res.json() as { sha: string; commit: { message: string; author: { date: string } } }[];
        const commitData = commits.map(c => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message.split("\n")[0],
            date: c.commit.author.date,
        }));

        const result = await auditCommitMessages(commitData);
        return { result, repo, owner };
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Unknown error occurred" };
    }
}

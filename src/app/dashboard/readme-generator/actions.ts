"use server";

import { auth } from "@/auth";
import { generateReadme } from "@/lib/sambanova";

const GITHUB_API = "https://api.github.com";

export async function generateReadmeAction(owner: string, repo: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    try {
        const token = session.user.accessToken;
        const headers: HeadersInit = {
            Accept: "application/vnd.github.v3+json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        const [repoRes, langRes, treesRes] = await Promise.all([
            fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers }),
            fetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`, { headers }),
            fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers }),
        ]);

        if (!repoRes.ok) return { error: "Repository not found or access denied." };
        const repoData = await repoRes.json();
        const languages = langRes.ok ? await langRes.json() : {};
        const treeData = treesRes.ok ? await treesRes.json() : {};

        const fileList = (treeData.tree || [])
            .filter((f: { type: string }) => f.type === "blob")
            .map((f: { path: string }) => f.path)
            .slice(0, 50);

        const metrics = {
            name: repoData.name,
            full_name: repoData.full_name,
            description: repoData.description || "No description provided",
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            open_issues: repoData.open_issues_count,
            language: repoData.language,
            languages,
            license: repoData.license?.spdx_id || "None",
            topics: repoData.topics || [],
            homepage: repoData.homepage,
            has_wiki: repoData.has_wiki,
            file_structure: fileList,
        };

        const readme = await generateReadme(metrics);
        return { readme };
    } catch (error: unknown) {
        return { error: error instanceof Error ? error.message : "Failed to generate README" };
    }
}

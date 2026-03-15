"use server";

import { auth } from "@/auth";
import { getSambaNovaResponse } from "@/lib/ai-repo-fixer";

const GITHUB_API = "https://api.github.com";

export async function fetchRecentCommits() {
    const session = await auth();
    if (!session?.user?.id || !session.user.accessToken) {
        return { success: false, error: "Unauthorized" };
    }

    // Get the user's Github login. If not in session, fetch user profile first.
    // Assuming session.user contains the github login. If not, we have to look it up.
    let username = (session.user as any).github_username;
    console.log("[COMMITS] Fetching for user:", username);

    if (!username) {
        const userRes = await fetch(`${GITHUB_API}/user`, {
            headers: { Authorization: `Bearer ${session.user.accessToken}` }
        });
        if (userRes.ok) {
            const data = await userRes.json();
            username = data.login;
        } else {
            return { success: false, error: "Failed to fetch GitHub profile to get recent commits" };
        }
    }

    try {
        // Fetch User Events (includes private if token has scope)
        const res = await fetch(`${GITHUB_API}/users/${username}/events`, {
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
            cache: "no-store"
        });

        console.log("[COMMITS] GitHub Events Status:", res.status);

        if (!res.ok) {
            const errText = await res.text();
            console.error("[COMMITS] GitHub Error:", errText);
            throw new Error(`Failed to fetch events from GitHub: ${res.status}`);
        }

        const events = await res.json();
        console.log(`[COMMITS] Found ${events.length} total events`);
        
        const pushEvents = events.filter((e: any) => e.type === "PushEvent");
        console.log(`[COMMITS] Found ${pushEvents.length} push events`);

        let recentCommits: any[] = [];

        // Extract commits from PushEvents
        pushEvents.forEach((event: any) => {
            if (event.payload && event.payload.commits) {
                event.payload.commits.forEach((commit: any) => {
                    if (!commit.message.startsWith("Merge") && commit.message.length >= 3) {
                        recentCommits.push({
                            sha: commit.sha,
                            message: commit.message,
                            repo: event.repo.name,
                            branch: event.payload.ref?.replace("refs/heads/", ""),
                            url: `https://github.com/${event.repo.name}/commit/${commit.sha}`
                        });
                    }
                });
            }
        });

        // 2. Fallback: Check recently pushed repos directly if events are empty
        if (recentCommits.length === 0) {
            console.log("[COMMITS] No push events found, fallback to recently updated repos...");
            const reposRes = await fetch(`${GITHUB_API}/user/repos?sort=pushed&per_page=3`, {
                headers: { Authorization: `Bearer ${session.user.accessToken}` },
                cache: "no-store"
            });
            
            if (reposRes.ok) {
                const repos = await reposRes.json();
                for (const repo of repos) {
                    console.log(`[COMMITS] Checking fallback repo: ${repo.full_name}`);
                    const commitsRes = await fetch(`${GITHUB_API}/repos/${repo.full_name}/commits?per_page=3`, {
                        headers: { Authorization: `Bearer ${session.user.accessToken}` },
                        cache: "no-store"
                    });
                    if (commitsRes.ok) {
                        const commits = await commitsRes.json();
                        commits.forEach((c: any) => {
                            if (c.commit && !c.commit.message.startsWith("Merge") && c.commit.message.length >= 3) {
                                recentCommits.push({
                                    sha: c.sha,
                                    message: c.commit.message,
                                    repo: repo.full_name,
                                    branch: repo.default_branch,
                                    url: c.html_url
                                });
                            }
                        });
                    }
                }
            }
        }

        // Take up to 5 unique commits to analyze
        const uniqueCommits = Array.from(new Map(recentCommits.map(c => [c.sha, c])).values());
        return { success: true, commits: uniqueCommits.slice(0, 5) };
    } catch (error: any) {
        console.error("Fetch Recent Commits Error:", error);
        return { success: false, error: error.message };
    }
}

export async function suggestCommitFixes(commits: any[]) {
    if (!commits || commits.length === 0) return { success: false, error: "No commits provided" };

    // Check if they are already conventional
    const regex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.*\))?: .+/i;

    const commitsToFix = commits.filter(c => !regex.test(c.message));

    if (commitsToFix.length === 0) {
        return { success: true, fixedCommits: [], message: "All your commits are already beautiful!" };
    }

    const unformattedLogs = commitsToFix.map(c => `[${c.sha}] ${c.message}`).join("\n");

    const prompt = `You are a strict Open-Source Maintainer enforcing 'Conventional Commits'.
Review the following recent raw commit messages and rewrite them to perfectly match the 'Conventional Commits' specification (e.g. feat:, fix:, chore:, docs:).

Raw Commits:
${unformattedLogs}

Output ONLY valid JSON matching this schema:
{
  "fixedCommits": [
    {
       "sha": "full_sha_here",
       "suggested": "feat(ui): add new interactive button to dashboard"
    }
  ]
}`;

    try {
        let aiResponse = await getSambaNovaResponse(prompt);
        // Clean markdown
        if (aiResponse.startsWith("\`\`\`json")) aiResponse = aiResponse.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        else if (aiResponse.startsWith("\`\`\`")) aiResponse = aiResponse.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

        const result = JSON.parse(aiResponse.trim());

        // Merge AI suggestions with the sha/url context
        const finalFixes = result.fixedCommits.map((fix: any) => {
            const originalCommit = commitsToFix.find(c => c.sha === fix.sha);
            return {
                ...fix,
                original: originalCommit?.message,
                sha: fix.sha,
                url: originalCommit?.url,
                repo: originalCommit?.repo
            };
        });

        return { success: true, fixedCommits: finalFixes };
    } catch (error: any) {
        console.error("Suggest Commit Fixes Error:", error);
        return { success: false, error: "AI failed to parse commits" };
    }
}

export async function applyCommitFix(repo: string, branch: string, sha: string, newMessage: string) {
    const session = await auth();
    if (!session?.user?.id || !session.user.accessToken) return { success: false, error: "Unauthorized" };

    try {
        // 1. Get the current branch reference to ensure we are fixing the HEAD
        const refRes = await fetch(`${GITHUB_API}/repos/${repo}/git/refs/heads/${branch}`, {
            headers: { Authorization: `Bearer ${session.user.accessToken}` }
        });
        
        if (!refRes.ok) throw new Error("Could not find branch reference");
        const refData = await refRes.json();
        const headSha = refData.object.sha;

        if (headSha !== sha) {
            return { success: false, error: "Only the latest commit on a branch can be auto-fixed currently. Please rebase manually for older commits." };
        }

        // 2. Get the commit object to find parent and tree
        const commitRes = await fetch(`${GITHUB_API}/repos/${repo}/git/commits/${sha}`, {
            headers: { Authorization: `Bearer ${session.user.accessToken}` }
        });
        if (!commitRes.ok) throw new Error("Could not fetch commit data");
        const commitData = await commitRes.json();

        // 3. Create a NEW commit object with the fixed message
        const newCommitRes = await fetch(`${GITHUB_API}/repos/${repo}/git/commits`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: newMessage,
                tree: commitData.tree.sha,
                parents: commitData.parents.map((p: any) => p.sha)
            })
        });

        if (!newCommitRes.ok) throw new Error("Failed to create new commit object");
        const newCommitData = await newCommitRes.json();

        // 4. Update the branch reference (FORCE PUSH)
        const updateRefRes = await fetch(`${GITHUB_API}/repos/${repo}/git/refs/heads/${branch}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sha: newCommitData.sha,
                force: true
            })
        });

        if (!updateRefRes.ok) throw new Error("Failed to update branch reference");

        return { success: true, newSha: newCommitData.sha };
    } catch (error: any) {
        console.error("Apply Commit Fix Error:", error);
        return { success: false, error: error.message };
    }
}

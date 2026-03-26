"use server";

import { auth } from "@/auth";
import { getSambaNovaResponse } from "@/lib/ai-repo-fixer";
import { scanForSecrets } from "@/lib/secrets";
import { revalidatePath } from "next/cache";

const GITHUB_API = "https://api.github.com";

export interface GitHubRepository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    private: boolean;
    html_url: string;
    language: string | null;
    fork: boolean;
    default_branch: string;
    size: number;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    created_at: string;
    archived: boolean;
    homepage: string | null;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
    topics?: string[];
}

async function getHeaders(): Promise<Record<string, string> | undefined> {
    const session = await auth();
    const token = (session?.user as { accessToken?: string })?.accessToken;
    if (!token) {
        return undefined;
    }
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };
}

export async function fetchRepositories() {
    console.log("[GITHUB-ACTIONS] Starting fetchRepositories...");
    try {
        const headers = await getHeaders();
        if (!headers) {
            console.warn("[GITHUB-ACTIONS] Unauthorized: No headers returned from getHeaders().");
            return { success: false, error: "Unauthorized: GitHub access token missing. Please sign out and sign back in.", isUnauthorized: true };
        }
        
        console.log("[GITHUB-ACTIONS] Fetching repos with headers: OK");
        let allRepos: GitHubRepository[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
            console.log(`[GITHUB-ACTIONS] Fetching page ${page}...`);
            const response = await fetch(`${GITHUB_API}/user/repos?sort=updated&per_page=100&page=${page}`, {
                headers,
                cache: "no-store"
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[GITHUB-ACTIONS] GitHub API page ${page} failed: ${response.status} ${response.statusText}`, errorText);
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}. Details: ${errorText.substring(0, 100)}`);
            }

            const data = (await response.json()) as GitHubRepository[];

            if (!Array.isArray(data) || data.length === 0) {
                hasMore = false;
            } else {
                allRepos = [...allRepos, ...data];
                page++;
            }
        }

        console.log(`[GITHUB-ACTIONS] Successfully fetched ${allRepos.length} repositories total.`);
        // Deduplicate by ID to prevent rendering glitches (duplicate keys)
        const uniqueRepos = Array.from(new Map(allRepos.map(repo => [repo.id, repo])).values());

        return { success: true, data: uniqueRepos };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("[GITHUB-ACTIONS] Fatal error in fetchRepositories:", error);
        return { success: false, error: message || "An unexpected error occurred while fetching repositories." };
    }
}

export async function createRepository(data: { name: string; description?: string; private?: boolean }) {
    try {
        const headers = await getHeaders();
        if (!headers) throw new Error("GitHub access token required for repository creation.");
        const response = await fetch(`${GITHUB_API}/user/repos`, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`GitHub API error: ${errorBody.message || response.statusText}`);
        }

        const newRepo = (await response.json()) as GitHubRepository;
        revalidatePath("/dashboard/repositories");
        return { success: true, data: newRepo };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error creating repository:", error);
        return { success: false, error: message };
    }
}

export async function updateRepository(owner: string, repo: string, data: { name?: string; description?: string; private?: boolean }) {
    try {
        const headers = await getHeaders();
        if (!headers) throw new Error("GitHub access token required for repository update.");
        const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
            method: "PATCH",
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`GitHub API error: ${errorBody.message || response.statusText}`);
        }

        const updatedRepo = (await response.json()) as GitHubRepository;
        revalidatePath("/dashboard/repositories");
        return { success: true, data: updatedRepo };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error updating repository:", error);
        return { success: false, error: message };
    }
}

export async function deleteRepository(owner: string, repo: string) {
    try {
        const headers = await getHeaders();
        if (!headers) throw new Error("GitHub access token required for deletion.");
        const response = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
            method: "DELETE",
            headers,
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`GitHub API error: ${errorBody.message || response.statusText}`);
        }

        // DELETE usually returns 204 No Content
        revalidatePath("/dashboard/repositories");
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error deleting repository:", error);
        return { success: false, error: message };
    }
}

export async function autoImproveDescription(owner: string, repo: string) {
    try {
        const headers = await getHeaders();
        if (!headers) throw new Error("GitHub access token required for auto-improvement.");

        // 1. Fetch current repository details
        const repoResponse = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
        if (!repoResponse.ok) throw new Error("Failed to fetch repository details");
        const repoData = (await repoResponse.json()) as GitHubRepository;

        // 2. Fetch current README (if any)
        const readmeResponse = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, { headers });
        let currentReadme = "";
        if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            currentReadme = Buffer.from(readmeData.content, 'base64').toString('utf8');
        }

        // 3. Fetch file tree (top 50 files) to give structural context
        let fileTree = "";
        let snippets = "";
        try {
            const defaultBranch = repoData.default_branch || "main";
            const treeResponse = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
            if (treeResponse.ok) {
                const treeData = await treeResponse.json();
                if (treeData.tree && Array.isArray(treeData.tree)) {
                    const allBlobs = (treeData.tree as { type: string; path: string }[]).filter((item) => item.type === "blob");
                    const files = allBlobs.map((item) => item.path).slice(0, 50);
                    fileTree = files.join("\n");

                    // Get contents of up to 3 important feeling files
                    const contentExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.html', '.css', '.rs', '.go', '.java', '.php', '.rb'];
                    const interestingFiles = allBlobs.filter((item) => contentExtensions.some(ext => item.path.endsWith(ext))).slice(0, 3);

                    for (const file of interestingFiles) {
                        if (!headers) continue;
                        const fileRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${file.path}`, { headers });
                        if (fileRes.ok) {
                            const fileData = await fileRes.json();
                            if (fileData.content) {
                                const decoded = Buffer.from(fileData.content, 'base64').toString('utf8');
                                snippets += `\n--- File: ${file.path} ---\n${decoded.substring(0, 1500)}\n`;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Could not fetch file tree", e);
        }

        const repoContext = `
Repository Name: ${repoData.name}
Current Description: ${repoData.description || "None"}
Primary Language: ${repoData.language || "Unknown"}

Repository File Structure:
${fileTree || "Not available"}

Selected Code Snippets:
${snippets || "No code snippets available."}

Current README Context: ${currentReadme.substring(0, 2000)}...
`.trim();

        // 4. Generate new short description via AI
        const descriptionPrompt = `Based on the repository context (including its file structure and README), write a beautiful, detailed, medium-length description for this project (around 2 to 3 sentences). Make it highly engaging, attractive, and explain what the code actually does. CRITICAL RESTRICTION: The total output MUST BE STRICTLY UNDER 300 characters. Output ONLY the raw description text, no quotes, no conversational filler. \n\n${repoContext}`;
        let newDescription = await getSambaNovaResponse(descriptionPrompt);

        // Enforce the 350 character limit hard to prevent HTTP 422 Validation Failed errors from GitHub.
        newDescription = newDescription.trim();
        if (newDescription.length > 350) {
            newDescription = newDescription.substring(0, 347) + "...";
        }

        // 5. Update Repository Description on GitHub
        if (!headers) throw new Error("GitHub access token required for description update.");
        const updateDescRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, {
            method: "PATCH",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ description: newDescription })
        });
        if (!updateDescRes.ok) throw new Error(`Failed to update description: ${await updateDescRes.text()}`);
        
        const updatedRepo = (await updateDescRes.json()) as GitHubRepository;
        return { success: true, message: "Description successfully updated!", data: updatedRepo };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error improving repo description:", error);
        return { success: false, error: message };
    }
}

export async function autoImproveReadme(owner: string, repo: string) {
    try {
        const headers = await getHeaders();
        if (!headers) throw new Error("GitHub access token required for README improvement.");

        // 1. Fetch current repository details
        const repoResponse = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
        if (!repoResponse.ok) throw new Error("Failed to fetch repository details");
        const repoData = (await repoResponse.json()) as GitHubRepository;

        // 2. Fetch current README (if any)
        const readmeResponse = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/readme`, { headers });
        let currentReadme = "";
        let readmeSha = "";
        if (readmeResponse.ok) {
            const readmeData = await readmeResponse.json();
            currentReadme = Buffer.from(readmeData.content, 'base64').toString('utf8');
            readmeSha = readmeData.sha;
        }

        // 3. Fetch file tree (top 50 files) to give structural context
        let fileTree = "";
        try {
            const defaultBranch = repoData.default_branch || "main";
            const treeResponse = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
            if (treeResponse.ok) {
                const treeData = await treeResponse.json();
                if (treeData.tree && Array.isArray(treeData.tree)) {
                    const files = (treeData.tree as { type: string; path: string }[])
                        .filter((item) => item.type === "blob")
                        .map((item) => item.path)
                        .slice(0, 50);
                    fileTree = files.join("\n");
                }
            }
        } catch (e) {
            console.error("Could not fetch file tree", e);
        }

        const repoContext = `
Repository Name: ${repoData.name}
Current Description: ${repoData.description || "None"}
Primary Language: ${repoData.language || "Unknown"}
Repository File Structure:
${fileTree || "Not available"}

Current README Context: ${currentReadme.substring(0, 2000)}...
`.trim();

        // 3. Generate new beautiful README via AI
        const readmePrompt = `Write a beautiful, modern, high-quality GitHub README.md for the following repository. 
Make sure it includes standard sections like Features, Tech Stack, Installation, and Usage. 
Use modern formatting like badges or emojis where appropriate.
Avoid adding arbitrary "To Do" sections if there aren't any clear to dos.
Output ONLY the raw markdown text. Do not wrap it in a code block. Do not include conversational filler.
Context:\n\n${repoContext}`;

        let newReadme = await getSambaNovaResponse(readmePrompt);

        // Strip markdown if needed
        if (newReadme.startsWith("\`\`\`markdown")) {
            newReadme = newReadme.replace(/^\`\`\`markdown\n?/, "").replace(/\n?\`\`\`$/, "");
        } else if (newReadme.startsWith("\`\`\`")) {
            newReadme = newReadme.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
        }

        // 4. Commit new README to GitHub
        const readmeBody: { message: string; content: string; sha?: string } = {
            message: "docs(readme): auto-generated beautiful README by AI ✨",
            content: Buffer.from(newReadme).toString('base64'),
        };
        if (readmeSha) readmeBody.sha = readmeSha;
        if (!headers) throw new Error("GitHub access token required for committing README.");
        const commitReadmeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/README.md`, {
            method: "PUT",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(readmeBody)
        });
        if (!commitReadmeRes.ok) {
            throw new Error(`Failed to commit README: ${await commitReadmeRes.text()}`);
        }

        return { success: true, message: "README updated successfully!" };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error generating README:", error);
        return { success: false, error: message };
    }
}

export async function autoFixAnyRepository(owner: string, repo: string) {
    try {
        const headers = await getHeaders();

        // 1. Fetch Repository File Tree
        let fileTree = "";
        let defaultBranch = "main";
        try {
            if (!headers) throw new Error("GitHub access token required for auto-fix.");
            const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
            if (repoRes.ok) {
                const repoData = await repoRes.json();
                defaultBranch = repoData.default_branch || "main";
                if (!headers) throw new Error("GitHub access token required for repository tree fetching.");
                const treeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
                if (treeRes.ok) {
                    const treeData = await treeRes.json();
                    if (treeData.tree) {
                        fileTree = (treeData.tree as { type: string; path: string }[])
                            .filter((item) => item.type === "blob")
                            .map((item) => item.path)
                            .join("\n");
                    }
                }
            }
        } catch (e) {
            console.error("Failed to get file tree for auto-fix:", e);
        }

        // 2. Ask AI to pick up to 2 files to fix based on the file tree
        const fileSelectionPrompt = `Analyze the following file tree of a GitHub repository. Your goal is to identify exactly 1 to 2 specific file paths from the tree that are most likely to contain architectural flaws, bad practices, or security vulnerabilities based on their names. Focus on important logic files (e.g. controllers, services, lib, auth).
Output ONLY a raw JSON array of the literal string file paths. NO markdown blocks.
File Tree: \n${fileTree.substring(0, 3000)}`;

        const selectedFilesTextRaw = await getSambaNovaResponse(fileSelectionPrompt);
        
        // Robust Extraction of JSON array
        let filesToFix: string[] = [];
        try {
            const jsonMatch = selectedFilesTextRaw.match(/\[[\s\S]*\]/);
            const jsonText = jsonMatch ? jsonMatch[0] : selectedFilesTextRaw;
            filesToFix = JSON.parse(jsonText.trim());
            if (!Array.isArray(filesToFix)) filesToFix = [];
        } catch {
            console.error("AI returned malformed file list:", selectedFilesTextRaw);
            // Fallback: try to find anything that looks like a path in the tree
            const lines = selectedFilesTextRaw.split('\n');
            filesToFix = lines.filter(l => l.trim() && fileTree.includes(l.trim())).map(l => l.trim()).slice(0, 2);
            
            if (filesToFix.length === 0) {
                throw new Error("The AI provided an incompatible response format. Please try again.");
            }
        }

        if (filesToFix.length === 0) {
            return { success: false, error: "The AI couldn't identify any critical files to fix right now." };
        }

        let filesRewritten = 0;

        for (const filePath of filesToFix.slice(0, 2)) {
            try {
                if (!headers) continue;
                const fileRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, { headers });
                if (!fileRes.ok) continue;

                const fileData = await fileRes.json();
                const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');
                const scanResult = scanForSecrets(currentContent);

                const issuePrompt = `We are going to create a GitHub Issue to fix architectural flaws in the following file: '${filePath}'.
${scanResult.hasSecrets ? `\nCRITICAL SECURITY ALERT: Hardcoded secrets were detected in this file. They have been masked as [REDACTED_SECRET]. You MUST prominently mention this severe vulnerability in your issue description.\n` : ""}
Analyze this file. Then, write a comprehensive GitHub Issue body (in Markdown) that:
1. Briefly explains the vulnerability or bad practice found in this specific file.
2. Provides the EXACT rewritten code snippet(s) necessary to fix it.
3. Keeps it highly professional and constructive.
Do NOT output anything other than the raw Markdown intended for the issue body. Do not wrap the whole response in a markdown code block.

Original Code:\n\n${scanResult.cleanText}`;

                let issueBody = await getSambaNovaResponse(issuePrompt);

                // Clean up any potential markdown code blocks wrapping the content
                issueBody = issueBody.replace(/^```[a-z]*\n/i, '').replace(/\n```$/i, '').trim();

                const issueData = {
                    title: `Auto-Fix: Resolve Architecture flaws in ${filePath.split('/').pop()}`,
                    body: issueBody,
                    labels: ["enhancement", "ai-generated"]
                };

                const issueRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/issues`, {
                    method: "POST",
                    headers: { ...headers, "Content-Type": "application/json" },
                    body: JSON.stringify(issueData)
                });

                if (issueRes.ok) filesRewritten++;

            } catch (err) {
                console.error(`Failed to create issue for ${filePath}:`, err);
            }
        }

        if (filesRewritten === 0) {
            throw new Error("Attempted to create issues, but the GitHub API rejected them. (Is the issue tracker enabled on this repo?)");
        }

        return { success: true, message: `Successfully opened ${filesRewritten} Auto-Fix issues in the repository!` };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("AutoFix Repository Error:", error);
        return { success: false, error: message || "An unexpected error occurred." };
    }
}

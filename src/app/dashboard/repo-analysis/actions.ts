"use server";

import { auth } from "@/auth";
import { getSambaNovaResponse } from "@/lib/ai-repo-fixer";

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

export async function autoFixRepositoryCode(owner: string, repo: string, analysis: any) {
    try {
        const headers = await getHeaders();

        // 1. Fetch Repository File Tree
        let fileTree = "";
        let defaultBranch = "main";
        try {
            if (!headers) throw new Error("GitHub access token required for this action.");
            const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers });
            if (repoRes.ok) {
                const repoData = await repoRes.json();
                defaultBranch = repoData.default_branch || "main";
                if (!headers) throw new Error("GitHub access token required for this action.");
                const treeRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`, { headers });
                if (treeRes.ok) {
                    const treeData = await treeRes.json();
                    if (treeData.tree) {
                        fileTree = treeData.tree.filter((item: any) => item.type === "blob").map((item: any) => item.path).join("\n");
                    }
                }
            }
        } catch (e) {
            console.error("Failed to get file tree for auto-fix:", e);
        }

        // 2. Ask AI to pick up to 2 files to fix based on the analysis
        const fileSelectionPrompt = `We are going to automatically fix this repository. Based on the following architectural flaws and the file tree, select exactly 1 to 2 specific file paths from the tree that most desperately need rewriting to solve these vulnerabilities. 
Output ONLY a raw JSON array of the literal string file paths. NO markdown blocks.
Flaws: ${JSON.stringify(analysis.suggestions)}
File Tree: \n${fileTree.substring(0, 3000)}`;

        let selectedFilesText = await getSambaNovaResponse(fileSelectionPrompt);
        if (selectedFilesText.startsWith("\`\`\`json")) selectedFilesText = selectedFilesText.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        else if (selectedFilesText.startsWith("\`\`\`")) selectedFilesText = selectedFilesText.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

        let filesToFix: string[] = [];
        try {
            filesToFix = JSON.parse(selectedFilesText.trim());
            if (!Array.isArray(filesToFix)) filesToFix = [];
        } catch (e) {
            console.error("AI returned malformed file list:", selectedFilesText);
            throw new Error("The AI failed to identify the correct files to fix. Try again.");
        }

        if (filesToFix.length === 0) return { success: false, error: "No fixable files were identified by the AI." };

        // 3. Download the actual content of those files
        let filesRewritten = 0;

        for (const filePath of filesToFix.slice(0, 2)) {
            try {
                if (!headers) throw new Error("GitHub access token required for this action.");
                // Get current file
                const fileRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`, { headers });
                if (!fileRes.ok) continue; // Skip if we can't find it

                const fileData = await fileRes.json();
                const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');

                // 4. Ask AI to rewrite the code and generate an Issue Body
                const issuePrompt = `We are going to create a GitHub Issue to fix architectural flaws in the following file: '${filePath}'.

Analyze this file against the previously identified flaws. Then, write a comprehensive GitHub Issue body (in Markdown) that:
1. Briefly explains the vulnerability or bad practice found in this specific file.
2. Provides the EXACT rewritten code snippet(s) necessary to fix it.
3. Keeps it highly professional and constructive.
Do NOT output anything other than the raw Markdown intended for the issue body. Do not wrap the whole response in a markdown code block.

Original Code:\n\n${currentContent}`;

                let issueBody = await getSambaNovaResponse(issuePrompt);

                // Clean up any markdown blocks the AI might have stubbornly added wrapper-wise
                if (issueBody.startsWith("\`\`\`markdown")) issueBody = issueBody.replace(/^\`\`\`markdown\n?/, "").replace(/\n?\`\`\`$/, "");
                else if (issueBody.startsWith("\`\`\`")) issueBody = issueBody.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");

                // 5. Create a GitHub Issue
                const issueData = {
                    title: `Auto-Fix: Resolve Refactoring & Architecture flaws in ${filePath.split('/').pop()}`,
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
    } catch (error: any) {
        console.error("AutoFix Repository Error:", error);
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

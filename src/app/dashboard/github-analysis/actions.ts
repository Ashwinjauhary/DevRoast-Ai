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

export async function autoFixProfile(username: string, analysis: any) {
    try {
        const headers = await getHeaders();
        
        // Fetch the actual authenticated user data to get the correct login
        if (!headers) throw new Error("GitHub access token required.");
        const userRes = await fetch(`${GITHUB_API}/user`, { headers });
        if (!userRes.ok) throw new Error("Failed to fetch authenticated user data");
        const userData = await userRes.json();
        const authedUsername = userData.login;

        if (authedUsername.toLowerCase() !== username.toLowerCase()) {
            throw new Error("Critical Safety Violation: You can only Auto-Fix your own profile. Stop trying to steal other people's vibes.");
        }

        // 1. Generate optimized profile fields
        const profilePrompt = `Based on this brutal developer roast analysis, generate highly professional, completely optimized profile settings for this GitHub user to fix their reputation. Provide ONLY a valid JSON object with 'bio' (max 160 chars), 'company', 'blog' (make up a professional dev portfolio URL if missing based on their username), and 'location' (make up a tech hub if missing). No backticks, no markdown, just raw JSON. Analysis: ${JSON.stringify(analysis.roastLines)}`;

        let profileJsonText = await getSambaNovaResponse(profilePrompt);
        if (profileJsonText.startsWith("\`\`\`json")) {
            profileJsonText = profileJsonText.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        } else if (profileJsonText.startsWith("\`\`\`")) {
            profileJsonText = profileJsonText.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
        }

        const profileData = JSON.parse(profileJsonText.trim());

        // 2. Update actual GitHub profile settings via API
        const patchRes = await fetch(`${GITHUB_API}/user`, {
            method: "PATCH",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({
                bio: profileData.bio || "Crafting elegant solutions to complex problems.",
                company: profileData.company || "Independent Developer",
                blog: profileData.blog || `https://${authedUsername}.dev`,
                location: profileData.location || "San Francisco, CA"
            })
        });

        if (!patchRes.ok) {
            console.error("Failed to patch user profile:", await patchRes.text());
            // Proceed anyway to try and do the README
        }

        // 3. Generate stunning Profile README.md
        const readmePrompt = `Write a beautiful, modern, high-quality GitHub Profile README.md for the user @${username}. 
Context: They recently received a brutal architectural roast, and this README is meant to act as their redemption "Auto-Fix". 
Make it look like they are a 10x senior architect. Include cool badges, a sleek bio, their tech stack, and a "Current Focus" section. 
Output ONLY the raw markdown text. Do not wrap it in a code block. Do not include conversational filler.
Analysis context to address: ${JSON.stringify(analysis.suggestions)}`;

        let newReadme = await getSambaNovaResponse(readmePrompt);
        if (newReadme.startsWith("\`\`\`markdown")) {
            newReadme = newReadme.replace(/^\`\`\`markdown\n?/, "").replace(/\n?\`\`\`$/, "");
        } else if (newReadme.startsWith("\`\`\`")) {
            newReadme = newReadme.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
        }

        // 4. Ensure the <authedUsername>/<authedUsername> repo exists
        let repoExists = false;
        if (!headers) throw new Error("GitHub access token required.");
        const checkRepoRes = await fetch(`${GITHUB_API}/repos/${authedUsername}/${authedUsername}`, { headers });
        if (checkRepoRes.ok) {
            repoExists = true;
        } else {
            // Create the special repository (must be named exactly as the username)
            const createRepoRes = await fetch(`${GITHUB_API}/user/repos`, {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: authedUsername,
                    description: "My auto-generated GitHub profile ✨ | Optimized by DevRoast-AI",
                    private: false,
                    auto_init: true
                })
            });
            if (!createRepoRes.ok) throw new Error(`Failed to create profile repo: ${await createRepoRes.text()}`);
        }

        // 5. Check for existing README.md to get SHA for updating
        let readmeSha = "";
        if (!headers) throw new Error("GitHub access token required.");
        const checkReadmeRes = await fetch(`${GITHUB_API}/repos/${authedUsername}/${authedUsername}/readme`, { headers });
        if (checkReadmeRes.ok) {
            const readmeData = await checkReadmeRes.json();
            readmeSha = readmeData.sha;
        }

        // 6. Commit the new README
        const readmeBody: any = {
            message: "docs(profile): auto-generated 10x developer profile by AI ✨",
            content: Buffer.from(newReadme).toString('base64'),
        };
        if (readmeSha) readmeBody.sha = readmeSha;

        const commitReadmeRes = await fetch(`${GITHUB_API}/repos/${authedUsername}/${authedUsername}/contents/README.md`, {
            method: "PUT",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(readmeBody)
        });

        if (!commitReadmeRes.ok) {
            const errorData = await commitReadmeRes.json();
            throw new Error(`Failed to commit Profile README: ${JSON.stringify(errorData)}`);
        }

        return { success: true, message: "Profile completely overhauled!" };
    } catch (error: any) {
        console.error("AutoFix Profile Error:", error);
        return { success: false, error: error.message || "An unexpected error occurred." };
    }
}

"use server";

import { auth } from "@/auth";
import { checkLicenseCompliance } from "@/lib/sambanova";

const GITHUB_API = "https://api.github.com";

export async function checkLicense(owner: string, repo: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };

    try {
        const token = (session.user as any)?.accessToken;
        const headers: HeadersInit = {
            Accept: "application/vnd.github.v3+json",
            ...(token && { Authorization: `Bearer ${token}` }),
        };

        const [repoRes, pkgRes] = await Promise.all([
            fetch(`${GITHUB_API}/repos/${owner}/${repo}`, { headers }),
            fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/package.json`, { headers }),
        ]);

        if (!repoRes.ok) return { error: "Repository not found or access denied." };
        const repoData = await repoRes.json();
        const repoLicense = repoData.license?.spdx_id || "Unknown";

        let deps: { name: string; version: string }[] = [];
        if (pkgRes.ok) {
            const pkgFile = await pkgRes.json();
            const pkgContent = Buffer.from(pkgFile.content, "base64").toString("utf-8");
            const pkg = JSON.parse(pkgContent);
            const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
            deps = Object.entries(allDeps).map(([name, version]) => ({ name, version: version as string }));
        }

        const result = await checkLicenseCompliance(repoLicense, deps);
        return { result, repoLicense, repo, owner };
    } catch (error: any) {
        return { error: error.message };
    }
}

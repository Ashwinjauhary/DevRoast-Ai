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


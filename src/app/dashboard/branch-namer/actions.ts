"use server";

import { auth } from "@/auth";
import { generateBranchName } from "@/lib/sambanova";

export async function getBranchNames(description: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };
    try {
        const branches = await generateBranchName(description);
        return { branches };
    } catch (e: unknown) { return { error: e instanceof Error ? e.message : "Failed to generate branch name" }; }
}

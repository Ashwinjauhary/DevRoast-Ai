"use server";

import { auth } from "@/auth";
import { recommendOpenSource } from "@/lib/sambanova";

export async function getOssRecommendations(skills: string[], stack: string[]) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };
    try {
        const repos = await recommendOpenSource(skills, stack);
        return { repos };
    } catch (e: unknown) { return { error: e instanceof Error ? e.message : "Recommendation failed" }; }
}

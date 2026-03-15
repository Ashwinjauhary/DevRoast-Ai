"use server";

import { auth } from "@/auth";
import { recommendOpenSource } from "@/lib/sambanova";

export async function getOssRecommendations(skills: string[], stack: string[]) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };
    try {
        const repos = await recommendOpenSource(skills, stack);
        return { repos };
    } catch (e: any) { return { error: e.message }; }
}

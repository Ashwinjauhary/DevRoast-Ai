"use server";

import { auth } from "@/auth";
import { recommendTechStack } from "@/lib/sambanova";

export async function recommendStack(goal: string, currentStack: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };
    try {
        const result = await recommendTechStack(goal, currentStack);
        return { result };
    } catch (e: unknown) { return { error: e instanceof Error ? e.message : "An unknown error occurred" }; }
}

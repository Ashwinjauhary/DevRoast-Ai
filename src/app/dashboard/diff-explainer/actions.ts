"use server";

import { auth } from "@/auth";
import { explainDiff } from "@/lib/sambanova";

export async function explainGitDiff(diff: string) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };
    try {
        const result = await explainDiff(diff);
        return { result };
    } catch (e: any) { return { error: e.message }; }
}

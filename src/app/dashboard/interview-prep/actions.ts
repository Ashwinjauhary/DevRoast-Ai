"use server";

import { auth } from "@/auth";
import { generateInterviewQuestions } from "@/lib/sambanova";

export async function getInterviewQuestions(weaknesses: string[], techStack: string[]) {
    const session = await auth();
    if (!session?.user) return { error: "Not authenticated" };
    try {
        const questions = await generateInterviewQuestions(weaknesses, techStack);
        return { questions };
    } catch (e: unknown) { return { error: e instanceof Error ? e.message : "An unknown error occurred" }; }
}

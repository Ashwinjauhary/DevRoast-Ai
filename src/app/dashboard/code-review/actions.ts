"use server";

import { auth } from "@/auth";
import { getAIResponse } from "@/lib/ai-repo-fixer";

export async function reviewCode(code: string, language: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const prompt = `
        YOU ARE DEVROAST AI. REVIEW THIS ${language.toUpperCase()} CODE. 
        BE BRUTAL. BE ELITE. BE SASSY.
        
        FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
        
        [ROAST_START]
        * bullet point roast 1
        * bullet point roast 2
        * bullet point roast 3
        [ROAST_END]

        [ISSUES_START]
        * ERROR|Line X: Message | Suggestion
        * WARNING|Line Y: Message | Suggestion
        [ISSUES_END]

        [FIX_START]
        // The perfectly optimized code
        [FIX_END]

        CODE TO REVIEW:
        ${code}
    `;

    try {
        const result = await getAIResponse(prompt);
        return { content: result };
    } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "AI review failed" };
    }
}

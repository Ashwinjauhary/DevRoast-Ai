"use server";

import { auth } from "@/auth";

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

    const keys = (process.env.SAMBANOVA_API_KEYS || process.env.SAMBANOVA_API_KEY || "").split(",").map(k => k.trim()).filter(Boolean);
    const key = keys[0];

    try {
        const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "Meta-Llama-3.1-405B-Instruct",
                messages: [
                    { role: "system", content: "You are DevRoast AI. Your tone is arrogant, genius, and brutally honest." },
                    { role: "user", content: prompt }
                ],
                stream: true,
                temperature: 0.2,
            }),
        });

        if (!response.ok) throw new Error("SambaNova API failure");

        return response;
    } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "SambaNova review failed" };
    }
}


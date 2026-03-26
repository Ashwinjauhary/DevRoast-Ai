import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { code, language } = await req.json();

    const prompt = `
        YOU ARE DEVROAST AI. REVIEW THIS ${language.toUpperCase()} CODE. 
        BE BRUTAL. BE ELITE. BE SASSY.
        
        FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
        
        [ROAST_START]
        * Your roast point 1
        * Your roast point 2
        * Your roast point 3
        [ROAST_END]

        [ISSUES_START]
        * ERROR | Line X: Message | Suggestion
        * WARNING | Line Y: Message | Suggestion
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
                    { role: "system", content: "You are DevRoast AI. Your tone is arrogant, genius, and brutally honest. Do not use markdown backticks in your output except for the FIX section." },
                    { role: "user", content: prompt }
                ],
                stream: true,
                temperature: 0.2,
            }),
        });

        if (!response.ok) throw new Error("SambaNova API failure");

        return new Response(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "SambaNova connection failure";
        return new NextResponse(message, { status: 500 });
    }
}

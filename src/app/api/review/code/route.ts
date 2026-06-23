import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { generateStreamResponse } from "@/lib/ai-client";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const CodeReviewSchema = z.object({
    code: z.string().min(1),
    language: z.string().min(1),
});

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const rateLimitResult = await rateLimit(ip, 15, 60 * 1000); // 15 requests per minute
    if (!rateLimitResult.success) {
        return new NextResponse("Too many requests", { status: 429 });
    }

    const body = await req.json();
    const parsed = CodeReviewSchema.safeParse(body);
    if (!parsed.success) {
        return new NextResponse("Invalid payload", { status: 400 });
    }

    const { code, language } = parsed.data;

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

    try {
        const response = await generateStreamResponse([
            { role: "system", content: "You are DevRoast AI. Your tone is arrogant, genius, and brutally honest. Do not use markdown backticks in your output except for the FIX section." },
            { role: "user", content: prompt }
        ]);

        return new Response(response.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "AI connection failure";
        return new NextResponse(message, { status: 500 });
    }
}

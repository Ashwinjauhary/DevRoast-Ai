import { NextResponse } from "next/server";
import { generateProfileAnalysis } from "@/lib/ai-client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-key-auth";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const ProfileMetricsSchema = z.object({
    username: z.string().min(1),
    metrics: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
    try {
        const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const rateLimitResult = await rateLimit(ip, 10, 60 * 1000); // 10 requests per minute
        if (!rateLimitResult.success) {
            return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
        }

        const body = await request.json();
        
        // Zod Validation
        const parsed = ProfileMetricsSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid payload", details: parsed.error.format() }, { status: 400 });
        }

        const { username, metrics } = parsed.data;

        // Call the Groq AI API
        const roastData = await generateProfileAnalysis(metrics);

        let isSaved = false;
        // Support both session auth AND API key auth (Bearer drk_xxx)
        const session = await auth();
        let resolvedUserId: string | null = session?.user?.id ?? null;

        if (!resolvedUserId) {
            const apiKeyData = await validateApiKey(request.headers.get("authorization"));
            if (apiKeyData) resolvedUserId = apiKeyData.userId;
        }

        if (resolvedUserId && username) {
            await prisma.analysis.create({
                data: {
                    user_id: resolvedUserId!,
                    analysis_type: "profile",
                    target: username,
                    score: roastData.score || 5.0,
                    result_json: {
                        ...roastData,
                        top_languages: metrics.top_languages || []
                    }
                }
            });
            isSaved = true;
        }

        return NextResponse.json({ ...roastData, isSaved });

    } catch (error: unknown) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ error: "Failed to generate AI analysis" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { generateProfileAnalysis } from "@/lib/sambanova";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-key-auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, metrics } = body;

        if (!metrics) {
            return NextResponse.json({ error: "Metrics payload is required" }, { status: 400 });
        }

        // Call the SambaNova AI API
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

    } catch (error) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ error: "Failed to generate AI analysis" }, { status: 500 });
    }
}

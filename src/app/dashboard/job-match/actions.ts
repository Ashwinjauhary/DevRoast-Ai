"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSambaNovaResponse } from "@/lib/ai-repo-fixer";

export async function calculateJobMatch(jobDescription: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // Fetch most recent profile analysis for the user
        const lastAnalysis = await prisma.analysis.findFirst({
            where: { user_id: session.user.id, analysis_type: "profile" },
            orderBy: { created_at: "desc" }
        });

        if (!lastAnalysis) {
            return { success: false, error: "Profile analysis not found. Please analyze your profile first." };
        }

        const userContext = {
            result: lastAnalysis.result_json,
            score: lastAnalysis.score
        };

        const matchPrompt = `
        YOU ARE AN ELITE RECRUITER AND TECHNICAL ARCHITECT.
        MATCH THIS USER'S GITHUB PROFILE AGAINST THE TARGET JOB DESCRIPTION.

        USER PROFILE CONTEXT:
        ${JSON.stringify(userContext.result)}
        Overall Score: ${userContext.score}

        JOB DESCRIPTION:
        ${jobDescription}

        OUTPUT JSON ONLY:
        {
            "matchPercentage": 75,
            "compatiblityScore": 7.5,
            "strengths": ["List of 3 strengths matched to the JD"],
            "gaps": ["List of 3 technical gaps or missing skills"],
            "resumeAdvice": "Targeted advice on how to tweak their resume for this role.",
            "verdict": "A blunt but professional 1-sentence assessment of their chances."
        }
        `;

        const responseText = await getSambaNovaResponse(matchPrompt);
        let cleaned = responseText.trim();
        if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json\n?/, "").replace(/\n?```$/, "");
        else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\n?/, "").replace(/\n?```$/, "");

        const matchResult = JSON.parse(cleaned);

        return {
            success: true,
            result: matchResult
        };
    } catch (error: unknown) {
        console.error("Job Match Error:", error);
        return { success: false, error: error instanceof Error ? error.message : "Neural link failed" };
    }
}

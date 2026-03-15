import { ImageResponse } from "@vercel/og";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string; repo: string }> }) {
    const p = await params;
    const { username, repo } = p;
    const target = `${username}/${repo}`;

    try {
        // Find latest analysis
        const analysis = await prisma.analysis.findFirst({
            where: { target, analysis_type: "repository" },
            orderBy: { created_at: "desc" }
        });

        const scoreVal = typeof analysis?.score === "number" ? analysis.score : null;

        let rank = "UNSCANNED";
        let color = "#52525b"; // zinc-600
        let scoreText = "?";

        if (scoreVal !== null) {
            scoreText = scoreVal.toFixed(1);
            if (scoreVal > 8) {
                rank = "S-TIER";
                color = "#10b981"; // emerald
            } else if (scoreVal > 6) {
                rank = "A-TIER";
                color = "#3b82f6"; // blue
            } else if (scoreVal > 4) {
                rank = "B-TIER";
                color = "#f59e0b"; // amber
            } else {
                rank = "F-TIER";
                color = "#ef4444"; // red
            }
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#050505",
                        border: `2px solid ${color}40`,
                        padding: "0 24px",
                        fontFamily: "monospace",
                        color: "white",
                        borderRadius: "16px",
                        boxShadow: `0 0 20px ${color}20`,
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "14px", color: color, textTransform: "uppercase", letterSpacing: "2px" }}>
                            DEVROAST.COM
                        </span>
                        <span style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", letterSpacing: "-1px" }}>
                            {repo.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "12px", color: "#a1a1aa" }}>
                            ARCHITECTURAL INTEGRITY
                        </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <span style={{ fontSize: "12px", color: "#a1a1aa", textTransform: "uppercase" }}>Rank</span>
                            <span style={{ fontSize: "20px", fontWeight: "bold", color: color }}>
                                {rank}
                            </span>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: `${color}15`,
                            border: `3px solid ${color}`,
                            color: color,
                            fontSize: "36px",
                            fontWeight: "900",
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            boxShadow: `0 0 15px ${color}40 inset`,
                        }}>
                            {scoreText}
                        </div>
                    </div>
                </div>
            ),
            {
                width: 480,
                height: 140,
                headers: {
                    "Cache-Control": "public, max-age=3600",
                }
            }
        );
    } catch (e) {
        return new Response("Failed to generate badge", { status: 500 });
    }
}

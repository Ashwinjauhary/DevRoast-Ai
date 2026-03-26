import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
    try {
        const p = await params;
        const username = p.username;

        // Note: Edge runtime doesn't support Prisma client directly if it relies on Node APIs.
        // For Vercel Edge, Prisma needs the Edge extension or we fetch via a standard API endpoint.
        // Assuming Prisma is configured correctly for this environment, or we fallback if needed.
        // We will try to fetch the data directly, otherwise fallback to generic.
        let tagLine = "Full-Stack Engineer building scalable systems.";
        let skills = ["JavaScript", "TypeScript", "React"];
        let roast = "";
        let score = 0;

        try {
            const portfolio = await prisma.portfolio.findUnique({
                where: { username }
            });
            if (portfolio && portfolio.hero) {
                const hero = portfolio.hero as { tagline?: string; roast?: string; achievements?: { value: string }[] };
                tagLine = hero.tagline || tagLine;
                skills = (portfolio.skills as string[])?.slice(0, 3) || skills;
                roast = hero.roast || "";
                
                // Extract score from achievements if possible
                const achievements = hero.achievements || [];
                if (achievements[0]?.value) {
                    score = parseFloat(achievements[0].value);
                }
            }
        } catch (e) {
            console.error("Prisma Edge error in OG route:", e);
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        backgroundColor: "#050505",
                        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0%)",
                        backgroundSize: "40px 40px",
                        padding: "60px",
                        fontFamily: "sans-serif",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >
                    {/* Background Glow */}
                    <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "50%", height: "50%", background: "rgba(99, 102, 241, 0.15)", filter: "blur(100px)", borderRadius: "100%" }} />
                    <div style={{ position: "absolute", bottom: "-10%", left: "-10%", width: "40%", height: "40%", background: "rgba(244, 63, 94, 0.1)", filter: "blur(100px)", borderRadius: "100%" }} />

                    <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "20px", position: "relative", zIndex: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "32px", height: "32px", background: "#6366f1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ width: "16px", height: "16px", border: "3px solid black", borderRadius: "2px" }} />
                                </div>
                                <span style={{ fontSize: "28px", fontWeight: "black", color: "white", letterSpacing: "-0.05em" }}>DevRoast<span style={{ color: "#818cf8" }}>.ai</span></span>
                            </div>
                            <div style={{ padding: "8px 16px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "100px", color: "#a1a1aa", fontSize: "18px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                                Identity Audit // 2026
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "40px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                <h1 style={{ fontSize: "72px", fontWeight: "black", color: "white", margin: 0, lineHeight: 1, letterSpacing: "-0.05em" }}>
                                    {username}
                                </h1>
                                <p style={{ fontSize: "28px", color: "#818cf8", fontWeight: "bold", margin: 0, textTransform: "uppercase", letterSpacing: "0.2em" }}>
                                    Professional Roast & Score
                                </p>
                            </div>
                            {score > 0 && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                    <div style={{ fontSize: "100px", fontWeight: "black", color: "white", lineHeight: 1, textShadow: "0 0 30px rgba(99, 102, 241, 0.5)" }}>
                                        {score.toFixed(1)}
                                    </div>
                                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.4em", marginTop: "10px" }}>
                                        Dev Score / 10
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ position: "relative", zIndex: 10, width: "100%", paddingBottom: "40px" }}>
                        <div style={{ padding: "40px", background: "rgba(255, 255, 255, 0.03)", borderLeft: "8px solid #f43f5e", display: "flex", flexDirection: "column", gap: "15px" }}>
                            <span style={{ fontSize: "20px", fontWeight: "black", color: "#f43f5e", textTransform: "uppercase", letterSpacing: "0.2em" }}>The Roast</span>
                            <p style={{ fontSize: "32px", color: "#d4d4d8", fontWeight: "medium", fontStyle: "italic", margin: 0, lineHeight: 1.4 }}>
                                &quot;{roast || tagLine}&quot;
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "40px", position: "relative", zIndex: 10 }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                            {skills.map((skill, i) => (
                                <div key={i} style={{ padding: "10px 20px", background: "rgba(99, 102, 241, 0.05)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "12px", color: "#818cf8", fontSize: "20px", fontWeight: "bold" }}>
                                    {skill}
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: "20px", color: "#71717a", fontWeight: "semibold", letterSpacing: "0.1em" }}>
                            dev-roast-ai.vercel.app
                        </div>
                    </div>

                    {/* Watermark Overlay */}
                    <div style={{ position: "absolute", bottom: "-20px", right: "-30px", fontSize: "200px", fontWeight: "black", color: "rgba(255,255,255,0.03)", letterSpacing: "-0.1em", transform: "rotate(-5deg)", whiteSpace: "nowrap" }}>
                        DEVROAST
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Internal Server Error";
        return new Response(`Failed to generate the image: ${message}`, {
            status: 500,
        });
    }
}

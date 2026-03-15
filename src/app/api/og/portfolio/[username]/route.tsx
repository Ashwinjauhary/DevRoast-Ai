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

        try {
            const portfolio = await prisma.portfolio.findUnique({
                where: { username }
            });
            if (portfolio && portfolio.hero) {
                tagLine = (portfolio.hero as any).tagline || tagLine;
                skills = (portfolio.skills as any)?.slice(0, 3) || skills;
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
                        backgroundImage: "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)",
                        backgroundSize: "100px 100px",
                        padding: "80px",
                        fontFamily: "sans-serif",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div style={{ padding: "12px 24px", background: "rgba(99, 102, 241, 0.1)", border: "2px solid rgba(99, 102, 241, 0.2)", borderRadius: "100px", color: "#818cf8", fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                DevRoast Portfolio
                            </div>
                        </div>
                        <h1 style={{ fontSize: "80px", fontWeight: "black", color: "white", margin: "40px 0 0 0", lineHeight: 1.1, letterSpacing: "-0.05em" }}>
                            {username}'s<br /><span style={{ color: "#818cf8" }}>Architecture.</span>
                        </h1>
                        <p style={{ fontSize: "32px", color: "#a1a1aa", margin: "20px 0 0 0", maxWidth: "800px", lineHeight: 1.4 }}>
                            {tagLine}
                        </p>
                    </div>

                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                            {skills.map((skill, i) => (
                                <div key={i} style={{ padding: "12px 24px", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", color: "#d4d4d8", fontSize: "24px", fontWeight: 600 }}>
                                    {skill}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 20px rgba(99, 102, 241, 0.8)" }} />
                            <span style={{ fontSize: "24px", fontWeight: "black", color: "white", letterSpacing: "0.1em" }}>DEVROAST.AI</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}

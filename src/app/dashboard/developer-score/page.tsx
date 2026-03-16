import { Star, Trophy, Target, ShieldAlert, Code2, AlertTriangle, ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { ScoreVisuals } from "@/components/dashboard/score-visuals";
import Link from "next/link";

export default async function DeveloperScorePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const analyses = await prisma.analysis.findMany({
        where: { user_id: session.user.id },
        orderBy: { created_at: "desc" }
    });

    if (analyses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
                <div className="p-8 bg-zinc-900/50 rounded-full border border-white/5 animate-pulse">
                    <Trophy className="w-16 h-16 text-zinc-800" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-white">Silence of the Code</h2>
                    <p className="text-zinc-500 max-w-sm font-medium">No signals detected. Execute a scan to calculate your worth.</p>
                </div>
                <Link href="/dashboard" className="px-8 py-4 bg-white text-black rounded-2xl font-black hover:scale-105 transition-transform">
                    INITIATE ANALYSIS
                </Link>
            </div>
        );
    }

    let totalScore = 0;
    let counts = { codeQuality: 0, documentation: 0, consistency: 0, architecture: 0 };
    let totals = { codeQuality: 0, documentation: 0, consistency: 0, architecture: 0 };

    let allStrengths: string[] = [];
    let allWeaknesses: string[] = [];

    analyses.forEach((a: any) => {
        totalScore += a.score;
        const result = a.result_json as any;

        if (result.categories) {
            if (result.categories.codeQuality) { totals.codeQuality += result.categories.codeQuality; counts.codeQuality++; }
            if (result.categories.documentation) { totals.documentation += result.categories.documentation; counts.documentation++; }
            if (result.categories.consistency) { totals.consistency += result.categories.consistency; counts.consistency++; }
            if (result.categories.architecture) { totals.architecture += result.categories.architecture; counts.architecture++; }
        }

        if (result.suggestions) {
            allStrengths.push(...result.suggestions.slice(0, 1));
            allWeaknesses.push(...result.roastLines.slice(0, 2));
        }
    });

    const avgScore = (totalScore / analyses.length).toFixed(1);

    const scoreData = {
        overallScore: parseFloat(avgScore),
        globalRank: `Sourced from ${analyses.length} diagnostics`,
        title: parseFloat(avgScore) > 7 ? "Senior Architect" : parseFloat(avgScore) > 4 ? "Mid-Level Copy Paster" : "Junior Bug Generator",
        categories: {
            codeQuality: counts.codeQuality ? Math.round(totals.codeQuality / counts.codeQuality) : 0,
            documentation: counts.documentation ? Math.round(totals.documentation / counts.documentation) : 0,
            consistency: counts.consistency ? Math.round(totals.consistency / counts.consistency) : 0,
            architecture: counts.architecture ? Math.round(totals.architecture / counts.architecture) : 0,
        },
        strengths: Array.from(new Set(allStrengths)).slice(0, 3),
        weaknesses: Array.from(new Set(allWeaknesses)).slice(0, 3)
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-6xl mx-auto pb-24">
            <div className="space-y-4">
                <AnimatedText text="Developer Identity" className="text-5xl font-black tracking-tighter text-gradient" />
                <p className="text-xl text-zinc-500 font-light italic">Your digital footprint encoded as raw data.</p>
            </div>

            <ScoreVisuals
                score={scoreData.overallScore}
                title={scoreData.title}
                rank={scoreData.globalRank}
                categories={scoreData.categories}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <PremiumCard glowColor="secondary">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                                <Target className="w-6 h-6 text-secondary" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase">Anomalies Detected</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight italic">Functional Strengths</h3>
                        <ul className="space-y-4">
                            {scoreData.strengths.map((str, i) => (
                                <li key={i} className="flex gap-4 group/item">
                                    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shadow-[0_0_10px_rgba(var(--secondary),1)]" />
                                    <span className="text-zinc-400 font-medium group-hover/item:text-white transition-colors">{str}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </PremiumCard>

                <PremiumCard glowColor="accent">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                                <ShieldAlert className="w-6 h-6 text-accent" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase">Critical Vulnerabilities</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight italic">Legacy Failures</h3>
                        <ul className="space-y-4">
                            {scoreData.weaknesses.map((weak, i) => (
                                <li key={i} className="flex gap-4 group/item">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shadow-[0_0_10px_rgba(var(--accent),1)]" />
                                    <span className="text-zinc-400 font-medium group-hover/item:text-white transition-colors">"{weak}"</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </PremiumCard>
            </div>

            <PremiumCard glowColor="none" className="bg-white/1">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-4">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-xl font-black tracking-tight">Need a professional redemption?</h4>
                        <p className="text-zinc-500 font-medium">Our AI Mentor can help you fix these architectural disasters.</p>
                    </div>
                    <Link href="/dashboard/ai-mentor" className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-white hover:text-black transition-all">
                        CONSULT THE MENTOR <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </PremiumCard>
        </div>
    );
}


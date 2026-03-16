import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PremiumCard } from "@/components/ui/premium-card";
import { ScoreHistoryChart } from "@/components/ui/score-history-chart";
import { TrendingUp, BarChart2 } from "lucide-react";
import { AnimatedText } from "@/components/ui/animated-text";

export default async function ScoreHistoryPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const analyses = await prisma.analysis.findMany({
        where: { user_id: session.user.id },
        orderBy: { created_at: "asc" },
        select: { id: true, target: true, score: true, analysis_type: true, created_at: true },
    });

    const chartData = analyses.map((a) => ({
        date: new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        score: parseFloat(a.score.toFixed(1)),
        label: a.target,
        type: a.analysis_type,
    }));

    const avgScore = analyses.length > 0 ? (analyses.reduce((s, a) => s + a.score, 0) / analyses.length).toFixed(1) : "0.0";
    const highestScore = analyses.length > 0 ? Math.max(...analyses.map(a => a.score)).toFixed(1) : "0.0";
    const lowestScore = analyses.length > 0 ? Math.min(...analyses.map(a => a.score)).toFixed(1) : "0.0";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-24">
            <div className="space-y-3">
                <AnimatedText text="Score History" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 italic">Your growth over time — brutally charted.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Analyses", value: analyses.length, color: "text-primary" },
                    { label: "Average Score", value: avgScore, color: "text-secondary" },
                    { label: "Personal Best", value: highestScore, color: "text-emerald-400" },
                    { label: "Lowest Score", value: lowestScore, color: "text-red-400" },
                ].map(stat => (
                    <PremiumCard key={stat.label} glowColor="none">
                        <div className="text-center">
                            <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    </PremiumCard>
                ))}
            </div>

            {/* Chart */}
            <PremiumCard glowColor="primary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <BarChart2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-black tracking-tight">Score Progression</h3>
                    </div>
                    {analyses.length === 0 ? (
                        <div className="py-20 text-center space-y-3 opacity-40">
                            <TrendingUp className="w-12 h-12 mx-auto" />
                            <p className="font-black uppercase tracking-widest text-sm">No data yet — run your first analysis!</p>
                        </div>
                    ) : (
                        <ScoreHistoryChart data={chartData} />
                    )}
                </div>
            </PremiumCard>

            {/* Analysis Log */}
            {analyses.length > 0 && (
                <PremiumCard glowColor="secondary">
                    <div className="space-y-4">
                        <h3 className="text-lg font-black tracking-tight">Full Analysis Log</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-hide">
                            {[...analyses].reverse().map((a) => (
                                <div key={a.id} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl">
                                    <div>
                                        <p className="text-sm font-medium text-white">{a.target}</p>
                                        <p className="text-[10px] text-zinc-600">{new Date(a.created_at).toLocaleString()} · {a.analysis_type}</p>
                                    </div>
                                    <span className={`text-2xl font-black ${a.score >= 7 ? "text-emerald-400" : a.score >= 4 ? "text-amber-400" : "text-red-400"}`}>
                                        {a.score.toFixed(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </PremiumCard>
            )}
        </div>
    );
}

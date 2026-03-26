"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { recommendStack } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { Cpu, Loader2, ArrowRight } from "lucide-react";


interface Recommendation {
    category: string;
    migrationEffort: string;
    current: string;
    suggested: string;
    reason: string;
}

interface StackResult {
    summary: string;
    recommendations: Recommendation[];
}

export default function StackRecommenderPage() {
    const [goal, setGoal] = useState("");
    const [currentStack, setCurrentStack] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<StackResult | null>(null);

    async function handleRecommend() {
        if (!goal.trim() || !currentStack.trim()) { toast.error("Fill in both fields."); return; }
        setLoading(true); setResult(null);
        const data = await recommendStack(goal, currentStack);
        setLoading(false);
        if (data.error) {
            toast.error(data.error);
        } else if (data.result) {
            setResult(data.result as StackResult);
        }
    }

    const EFFORT_COLORS: Record<string, string> = { low: "text-emerald-400", medium: "text-amber-400", high: "text-red-400" };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">Stack Recommender</h1>
                <p className="text-xl text-zinc-500 italic">Tell us what you&apos;re building. We&apos;ll tell you if your tech choices are terrible.</p>
            </div>

            <PremiumCard glowColor="primary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-black tracking-tight">Your Project</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Project Goal</label>
                            <textarea
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                placeholder="e.g. Building a real-time multiplayer game with chat and leaderboards"
                                rows={3}
                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Current Stack</label>
                            <input
                                value={currentStack}
                                onChange={e => setCurrentStack(e.target.value)}
                                placeholder="e.g. React, Node.js, MySQL, REST API, AWS EC2"
                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleRecommend}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</> : "Get Recommendations"}
                    </button>
                </div>
            </PremiumCard>

            {result && (
                <div className="space-y-6">
                    <PremiumCard glowColor="none">
                        <p className="text-zinc-300 leading-relaxed italic">{result.summary}</p>
                    </PremiumCard>
                    <div className="space-y-4">
                        {result.recommendations?.map((rec: Recommendation, i: number) => (
                            <div key={i} className="p-6 bg-white/2 border border-white/5 rounded-2xl space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{rec.category}</span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${EFFORT_COLORS[rec.migrationEffort] || "text-zinc-400"}`}>
                                        {rec.migrationEffort} effort
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-bold">{rec.current}</span>
                                    <ArrowRight className="w-4 h-4 text-zinc-600" />
                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-bold">{rec.suggested}</span>
                                </div>
                                <p className="text-sm text-zinc-400">{rec.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

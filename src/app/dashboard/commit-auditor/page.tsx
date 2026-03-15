"use client";

import { useState } from "react";
import { auditCommits } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { GitCommit, Loader2, TrendingUp } from "lucide-react";

const RATING_STYLES = {
    professional: { text: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "PROFESSIONAL" },
    acceptable: { text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "ACCEPTABLE" },
    embarrassing: { text: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "EMBARRASSING" },
};

export default function CommitAuditorPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    async function handleAudit() {
        const parts = input.trim().replace(/^https?:\/\/github\.com\//, "").split("/");
        if (parts.length < 2) { setError("Enter a valid GitHub URL or owner/repo format"); return; }
        const [owner, repo] = parts;
        setLoading(true); setError(""); setResult(null);
        const data = await auditCommits(owner, repo);
        setLoading(false);
        if (data.error) setError(data.error);
        else setResult(data.result);
    }

    const counts = result ? {
        professional: result.commits?.filter((c: any) => c.rating === "professional").length || 0,
        acceptable: result.commits?.filter((c: any) => c.rating === "acceptable").length || 0,
        embarrassing: result.commits?.filter((c: any) => c.rating === "embarrassing").length || 0,
    } : null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">Commit Auditor</h1>
                <p className="text-xl text-zinc-500 italic">Is your commit history a masterpiece or a disaster?</p>
            </div>

            <PremiumCard glowColor="accent">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <GitCommit className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-black tracking-tight">Target Repository</h3>
                    </div>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="github.com/owner/repo  or  owner/repo"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-600 font-mono text-sm focus:outline-none focus:border-accent/50 transition-colors"
                    />
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        onClick={handleAudit}
                        disabled={loading || !input.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-accent text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-accent/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Auditing commits...</> : "Audit Commits"}
                    </button>
                </div>
            </PremiumCard>

            {result && (
                <div className="space-y-6">
                    {/* Overall Result */}
                    <PremiumCard glowColor="primary">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-black">Overall Commit Quality</h3>
                                </div>
                                <p className="text-zinc-400 italic text-sm max-w-sm">{result.verdict}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-6xl font-black ${result.overall_score >= 7 ? "text-emerald-400" : result.overall_score >= 4 ? "text-amber-400" : "text-red-400"}`}>
                                    {result.overall_score}
                                </span>
                                <span className="text-zinc-600 text-2xl">/10</span>
                            </div>
                        </div>
                        {counts && (
                            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                                <div className="text-center">
                                    <p className="text-2xl font-black text-emerald-400">{counts.professional}</p>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Professional</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-amber-400">{counts.acceptable}</p>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Acceptable</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-red-400">{counts.embarrassing}</p>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Embarrassing</p>
                                </div>
                            </div>
                        )}
                    </PremiumCard>

                    {/* Commit List */}
                    <div className="space-y-3">
                        {result.commits?.map((commit: any, i: number) => {
                            const style = RATING_STYLES[commit.rating as keyof typeof RATING_STYLES] || RATING_STYLES.acceptable;
                            return (
                                <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <code className="text-[10px] font-mono text-zinc-600 shrink-0 mt-0.5">{commit.sha}</code>
                                        <div>
                                            <p className="text-sm font-medium text-white">{commit.message}</p>
                                            <p className="text-xs text-zinc-500 mt-1 italic">{commit.reason}</p>
                                        </div>
                                    </div>
                                    <span className={`shrink-0 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${style.bg} ${style.text}`}>
                                        {style.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

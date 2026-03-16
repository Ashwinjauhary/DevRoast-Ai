"use client";

import { useState } from "react";
import { PremiumCard } from "@/components/ui/premium-card";
import { Building2, Loader2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export default function OrgAnalysisPage() {
    const [orgName, setOrgName] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");

    async function handleAnalyze() {
        const org = orgName.trim().replace(/^https?:\/\/github\.com\//, "").split("/")[0];
        if (!org) { setError("Enter a valid GitHub org name"); return; }
        setLoading(true); setError(""); setResult(null);
        try {
            const res = await fetch(`/api/analyze/org?org=${encodeURIComponent(org)}`);
            const data = await res.json();
            if (data.error) setError(data.error);
            else setResult(data);
        } catch (e: any) { setError(e.message); }
        finally { setLoading(false); }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">Org Dashboard</h1>
                <p className="text-xl text-zinc-500 italic">Analyze an entire GitHub organization. Rate your company's code quality.</p>
            </div>

            <PremiumCard glowColor="primary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-black tracking-tight">GitHub Organization</h3>
                    </div>
                    <input
                        value={orgName}
                        onChange={e => setOrgName(e.target.value)}
                        placeholder="e.g.  vercel  or  github.com/vercel"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-600 font-mono text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !orgName.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing organization...</> : "Analyze Organization"}
                    </button>
                    <p className="text-[10px] text-zinc-600 text-center">Analyzes up to 10 most recently updated public repos</p>
                </div>
            </PremiumCard>

            {result && (
                <div className="space-y-6">
                    {/* Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Repos Analyzed", value: result.total_repos, color: "text-primary" },
                            { label: "Avg Score", value: result.avg_score?.toFixed(1), color: "text-secondary" },
                            { label: "Best Repo", value: result.best?.score?.toFixed(1), color: "text-emerald-400" },
                            { label: "Worst Repo", value: result.worst?.score?.toFixed(1), color: "text-red-400" },
                        ].map(s => (
                            <PremiumCard key={s.label} glowColor="none">
                                <div className="text-center">
                                    <p className={`text-3xl font-black ${s.color}`}>{s.value || "N/A"}</p>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">{s.label}</p>
                                </div>
                            </PremiumCard>
                        ))}
                    </div>

                    {/* Repo List */}
                    <PremiumCard glowColor="secondary">
                        <div className="space-y-4">
                            <h3 className="text-lg font-black tracking-tight">Repository Breakdown</h3>
                            <div className="space-y-3">
                                {result.repos?.map((repo: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/2 border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            {repo.score >= result.avg_score
                                                ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                                                : <TrendingDown className="w-4 h-4 text-red-400" />
                                            }
                                            <div>
                                                <p className="text-sm font-medium text-white">{repo.name}</p>
                                                <p className="text-[10px] text-zinc-600">{repo.language}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xl font-black ${repo.score >= 7 ? "text-emerald-400" : repo.score >= 4 ? "text-amber-400" : "text-red-400"}`}>
                                            {repo.score?.toFixed(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PremiumCard>
                </div>
            )}
        </div>
    );
}

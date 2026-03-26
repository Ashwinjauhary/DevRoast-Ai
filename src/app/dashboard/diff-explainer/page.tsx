"use client";

import { useState } from "react";
import { explainGitDiff } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { GitMerge, Loader2, Plus, Minus, Edit } from "lucide-react";

const CHANGE_ICONS = {
    added: { icon: Plus, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    removed: { icon: Minus, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    modified: { icon: Edit, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
};

interface DiffChange {
    type: "added" | "removed" | "modified";
    description: string;
}

interface DiffResult {
    summary: string;
    changes: DiffChange[];
    impact: string;
}

export default function DiffExplainerPage() {
    const [diff, setDiff] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<DiffResult | null>(null);
    const [error, setError] = useState("");

    async function handleExplain() {
        if (!diff.trim()) { setError("Paste a git diff first!"); return; }
        setLoading(true); setError(""); setResult(null);
        const data = await explainGitDiff(diff);
        setLoading(false);
        if (data.error) setError(data.error);
        else setResult(data.result as DiffResult);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">Diff Explainer</h1>
                <p className="text-xl text-zinc-500 italic">What does this pull request actually do? Let the AI explain it like you&apos;re 5.</p>
            </div>

            <PremiumCard glowColor="primary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <GitMerge className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-black tracking-tight">Paste Git Diff</h3>
                    </div>
                    <textarea
                        value={diff}
                        onChange={e => setDiff(e.target.value)}
                        placeholder={"--- a/src/app.ts\n+++ b/src/app.ts\n@@ -1,5 +1,6 @@\n import express from 'express';\n+import cors from 'cors';\n ..."}
                        rows={12}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-zinc-300 font-mono text-xs focus:outline-none focus:border-primary/40 transition-colors resize-none leading-relaxed"
                    />
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        onClick={handleExplain}
                        disabled={loading || !diff.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Explaining...</> : "Explain This Diff"}
                    </button>
                </div>
            </PremiumCard>

            {result && (
                <div className="space-y-6">
                    <PremiumCard glowColor="secondary">
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Summary</p>
                            <p className="text-lg text-white leading-relaxed font-medium">{result.summary}</p>
                        </div>
                    </PremiumCard>

                    {result.changes?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black tracking-tight">What Changed</h3>
                            {result.changes.map((change, i) => {
                                const style = CHANGE_ICONS[change.type as keyof typeof CHANGE_ICONS] || CHANGE_ICONS.modified;
                                const Icon = style.icon;
                                return (
                                    <div key={i} className={`flex items-start gap-4 p-5 rounded-2xl border ${style.bg}`}>
                                        <Icon className={`w-5 h-5 ${style.color} shrink-0 mt-0.5`} />
                                        <p className="text-sm text-zinc-300">{change.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <PremiumCard glowColor="accent">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Impact Assessment</p>
                            <p className="text-sm text-zinc-300 leading-relaxed">{result.impact}</p>
                        </div>
                    </PremiumCard>
                </div>
            )}
        </div>
    );
}

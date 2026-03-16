"use client";

import { useState } from "react";
import { getBranchNames } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { GitBranch, Loader2, Copy, CheckCircle } from "lucide-react";

export default function BranchNamerPage() {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [branches, setBranches] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    async function handleGenerate() {
        if (!description.trim()) { setError("Describe the task first!"); return; }
        setLoading(true); setError(""); setBranches([]);
        const data = await getBranchNames(description);
        setLoading(false);
        if (data.error) setError(data.error);
        else setBranches(data.branches || []);
    }

    function copy(idx: number, text: string) {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-3xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">Branch Namer</h1>
                <p className="text-xl text-zinc-500 italic">Stop naming branches <code className="text-primary">fix-stuff-2</code>. Get professional names instantly.</p>
            </div>

            <PremiumCard glowColor="secondary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <GitBranch className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-black tracking-tight">Describe Your Task</h3>
                    </div>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="e.g. Add user authentication with email/password and OAuth via GitHub..."
                        rows={4}
                        className="w-full bg-white/3 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-secondary/50 transition-colors resize-none"
                    />
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !description.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-secondary/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</> : "Generate Branch Names"}
                    </button>
                </div>
            </PremiumCard>

            {branches.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">Suggested Branches</h3>
                    {branches.map((branch, i) => (
                        <div key={i} className="group flex items-center justify-between p-5 bg-white/3 border border-white/10 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-black text-sm">
                                    {i + 1}
                                </div>
                                <code className="text-sm font-mono text-white">{branch}</code>
                            </div>
                            <button onClick={() => copy(i, branch)} className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black transition-all">
                                {copiedIdx === i ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                                {copiedIdx === i ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

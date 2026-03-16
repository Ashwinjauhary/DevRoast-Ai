"use client";

import { useState } from "react";
import { checkLicense } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { Scale, Loader2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const STATUS_STYLES = {
    compliant: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "COMPLIANT" },
    warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "WARNING" },
    violation: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "VIOLATION" },
};

const SEV_COLORS = { high: "text-red-400", medium: "text-amber-400", low: "text-blue-400" };

export default function LicenseCheckerPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [repoLicense, setRepoLicense] = useState("");
    const [error, setError] = useState("");

    async function handleCheck() {
        const parts = input.trim().replace(/^https?:\/\/github\.com\//, "").split("/");
        if (parts.length < 2) { setError("Enter a valid GitHub URL or owner/repo format"); return; }
        const [owner, repo] = parts;
        setLoading(true); setError(""); setResult(null);
        const data = await checkLicense(owner, repo);
        setLoading(false);
        if (data.error) setError(data.error);
        else { setResult(data.result); setRepoLicense((data as any).repoLicense || ""); }
    }

    const statusStyle = result ? STATUS_STYLES[result.overall_status as keyof typeof STATUS_STYLES] || STATUS_STYLES.warning : null;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">License Checker</h1>
                <p className="text-xl text-zinc-500 italic">Is your codebase legally ticking? Find out before your lawyers do.</p>
            </div>

            <PremiumCard glowColor="accent">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Scale className="w-5 h-5 text-accent" />
                        <h3 className="text-lg font-black tracking-tight">Target Repository</h3>
                    </div>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="github.com/owner/repo  or  owner/repo"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-600 font-mono text-sm focus:outline-none focus:border-accent/50 transition-colors"
                    />
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        onClick={handleCheck}
                        disabled={loading || !input.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-accent text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-accent/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Checking licenses...</> : "Check Compliance"}
                    </button>
                </div>
            </PremiumCard>

            {result && statusStyle && (
                <div className="space-y-6">
                    <PremiumCard glowColor="none">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl border ${statusStyle.bg}`}>
                                    <statusStyle.icon className={`w-8 h-8 ${statusStyle.color}`} />
                                </div>
                                <div>
                                    <p className={`text-2xl font-black ${statusStyle.color}`}>{statusStyle.label}</p>
                                    <p className="text-xs text-zinc-500 mt-1">Main License: <span className="text-white font-bold">{repoLicense}</span></p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-zinc-400 leading-relaxed pt-4 border-t border-white/5">{result.summary}</p>
                    </PremiumCard>

                    {result.issues?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black tracking-tight">Issues Found ({result.issues.length})</h3>
                            {result.issues.map((issue: any, i: number) => (
                                <div key={i} className="p-5 bg-white/2 border border-white/5 rounded-2xl space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 ${SEV_COLORS[issue.severity as keyof typeof SEV_COLORS]}`}>{issue.severity}</span>
                                        <span className="text-sm font-bold text-white">{issue.package}</span>
                                        <span className="text-xs text-zinc-500">({issue.license})</span>
                                    </div>
                                    <p className="text-xs text-zinc-400">{issue.issue}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {result.issues?.length === 0 && (
                        <div className="text-center py-8 text-emerald-400 space-y-2">
                            <CheckCircle className="w-12 h-12 mx-auto" />
                            <p className="font-black uppercase tracking-widest">No license conflicts detected!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GitBranch, Play, Loader2, AlertCircle, Download, TerminalSquare, Wand2, Sparkles, Code2 } from "lucide-react";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { autoFixRepositoryCode } from "./actions";
import { ShareRoast } from "@/components/dashboard/share-roast";

export default function RepoAnalysisPage() {
    const { data: session } = useSession();
    const [repoUrl, setRepoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
    const [isPending, startTransition] = useTransition();
    const [fixSuccess, setFixSuccess] = useState<string | null>(null);
    const [isEli5, setIsEli5] = useState(false);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoUrl) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const cleanUrl = repoUrl.replace("https://github.com/", "").replace(".git", "");
            const parts = cleanUrl.split("/");
            if (parts.length !== 2) throw new Error("Format invalid. Use owner/repo or full GitHub link.");

            const [owner, repo] = parts;

            const engineRes = await fetch(`/api/analyze/engine-repo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ owner, repo })
            });

            if (!engineRes.ok) throw new Error("The probe failed. The code might be too toxic even for us.");
            const data = await engineRes.json();

            setResult(data);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const handleAutoFix = () => {
        if (!result) return;
        setFixSuccess(null);
        setError(null);
        startTransition(async () => {
            const res = await autoFixRepositoryCode(result.owner, result.repo, result);
            if (res.success) {
                setFixSuccess("Fixes generated! Check the new Issues in your GitHub repository.");
            } else {
                setError(res.error || "Failed to generate fix issues.");
            }
        });
    };

    const copyBadgeToClipboard = () => {
        if (!result) return;
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const badgeUrl = `${origin}/api/badge/${result.owner}/${result.repo}`;
        const markdown = `[![DevRoast](${badgeUrl})](${origin})`;
        navigator.clipboard.writeText(markdown);
        setFixSuccess("Dynamic README badge copied to clipboard!");
        setTimeout(() => setFixSuccess(null), 3000);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-5xl mx-auto pb-24">
            <div className="space-y-4">
                <AnimatedText text="Deep Repo Scan" className="text-5xl font-black tracking-tighter text-gradient-primary" />
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-zinc-500 font-light"
                >
                    Deep architectural audit. We find the skeletons in your codebase.
                </motion.p>
            </div>

            <PremiumCard glowColor="primary">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-primary" />
                            Target Acquisition
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium">Paste the repository coordinates.</p>
                    </div>

                    <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder="owner/repo or https://github.com/owner/repo"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-base font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 glass-darker"
                            />
                        </div>
                        <Button
                            disabled={loading || !repoUrl}
                            type="submit"
                            className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 px-8 py-7 rounded-2xl font-black tracking-tight text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <div className="flex items-center gap-2"><Play className="w-5 h-5" /> PROBE</div>}
                        </Button>
                    </form>

                    <AnimatePresence>
                        {(error || fixSuccess) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`p-4 border rounded-xl flex items-center gap-3 text-sm font-bold ${fixSuccess
                                    ? "bg-primary/10 border-primary/20 text-primary"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                                    }`}
                            >
                                {fixSuccess ? <Wand2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                                {fixSuccess || error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PremiumCard>

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        // Analysis is always saved now

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Scan Results</span>
                                <h3 className="text-3xl font-black tracking-tighter">Architecture Map</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <Button
                                    onClick={handleAutoFix}
                                    disabled={isPending}
                                    variant="outline"
                                    className="gap-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 flex-1 sm:flex-none"
                                >
                                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                    Auto-Fix Codebase
                                </Button>
                                <Button onClick={copyBadgeToClipboard} variant="outline" className="gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-white flex-1 sm:flex-none">
                                    <Code2 className="w-4 h-4" /> Get Badge
                                </Button>
                                <ShareRoast 
                                    data={{
                                        username: result.owner,
                                        score: result.score,
                                        label: result.roastLines[0],
                                        avatarUrl: session?.user?.image || undefined,
                                        type: "repo",
                                        name: result.repo
                                    }} 
                                />
                            </div>
                        </div>

                        {result.security_leaks > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/50 p-6 rounded-2xl flex items-start gap-4 text-red-200"
                            >
                                <div className="p-2 flex-shrink-0 bg-red-500/20 rounded-full">
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black tracking-tight text-red-400 shadow-red-500 uppercase">Critical Vulnerability Detected</h4>
                                    <p className="text-sm opacity-90 leading-relaxed font-mono">
                                        Our pre-processor intercepted <span className="text-white font-bold">{result.security_leaks} hardcoded secret(s)</span> in your repository metadata. They have been forcefully redacted from AI processing via <span className="blur-[2px] transition-all hover:blur-none select-none">[Privacy Blur]</span>. You must rotate these keys immediately before unauthorized access occurs.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        <div id="roast-card-export" className="group relative rounded-[2rem] p-px overflow-hidden theme-primary">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-500 to-purple-600 opacity-20" />

                            <div className="relative bg-[#050505] p-8 sm:p-12 rounded-[1.95rem] overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
                                    <div className="flex-1 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                                                <GitBranch className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h2 className="text-4xl font-black tracking-tighter text-white uppercase">{result.repo}</h2>
                                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Architectural Integrity Report • {result.owner}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden glass-darker">
                                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-primary bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full w-fit">
                                                    <TerminalSquare className="w-3 h-3" /> ATTACH_DEBUGGER...
                                                </div>

                                                <button
                                                    onClick={() => setIsEli5(!isEli5)}
                                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${isEli5 ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" : "bg-transparent text-zinc-500 border-zinc-700 hover:text-white hover:border-zinc-500"
                                                        }`}
                                                >
                                                    {isEli5 ? "ELI5 Mode: ON" : "ELI5 Mode: OFF"}
                                                </button>
                                            </div>

                                            <div className="space-y-4 font-mono">
                                                {(isEli5 && result.eli5Lines ? result.eli5Lines : result.roastLines).map((line: string, i: number) => (
                                                    <motion.p
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 * i }}
                                                        key={`roast-${i}-${isEli5}`}
                                                        className="text-zinc-400 text-base md:text-lg leading-relaxed flex gap-4"
                                                    >
                                                        <span className="text-secondary opacity-50 flex-shrink-0">[{i + 1}]</span>
                                                        <span className="text-zinc-300">"{line}"</span>
                                                    </motion.p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-80 space-y-6">
                                        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center relative overflow-hidden group/score">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/score:opacity-100 transition-opacity duration-700" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block relative z-10">Health Score</span>
                                            <div className="text-8xl font-black tracking-tighter text-white relative z-10 mb-2">
                                                {result.score}<span className="text-zinc-700 text-4xl">/10</span>
                                            </div>
                                            <div className="px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30 w-fit mx-auto relative z-10">
                                                <span className="text-[10px] font-black text-primary uppercase">{result.score > 7 ? "Solid" : result.score > 4 ? "Unstable" : "Critically Flawed"}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {Object.entries(result.categories).map(([key, val]: [string, any], i: number) => (
                                                <div key={key} className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                                                        <span>{key}</span>
                                                        <span className="text-white">{val}/10</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${val * 10}%` }}
                                                            transition={{ duration: 1.5, ease: "circOut", delay: 0.5 + (i * 0.1) }}
                                                            className="h-full bg-primary rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {result.dependencyHealth && result.dependencyHealth.name !== "None" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="mt-8 bg-[#0a0a0a] border border-white/5 p-6 sm:p-8 rounded-[1.5rem] space-y-4 shadow-inner"
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black tracking-tight flex items-center gap-2 text-white">
                                                    <Wand2 className="w-5 h-5 text-primary" />
                                                    Tech Debt Auditor
                                                </h3>
                                                <p className="text-xs text-zinc-500 font-medium">Manifest scanned: <span className="text-zinc-300 font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{result.dependencyHealth.name}</span></p>
                                            </div>
                                            <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block">Health</span>
                                                <div className={`text-2xl font-black ${(result.dependencyHealth.healthScore || 0) > 7 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : (result.dependencyHealth.healthScore || 0) > 4 ? 'text-amber-400' : 'text-red-400'}`}>
                                                    {result.dependencyHealth.healthScore || "?"}<span className="text-sm text-zinc-700">/10</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-5 bg-white/[0.02] rounded-xl border border-white/5 font-mono text-xs sm:text-sm text-zinc-400 leading-relaxed border-l-2 border-l-primary shadow-sm relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <p className="relative z-10 m-0">{result.dependencyHealth.analysis}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="mt-12 flex flex-col gap-3 relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Architectural Fixes</span>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {result.suggestions.map((sug: string, i: number) => (
                                            <div key={i} className="flex gap-3 items-start p-4 bg-white/[0.03] border border-white/10 rounded-2xl transition-all hover:bg-white/[0.05] hover:-translate-y-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shadow-[0_0_10px_rgba(var(--primary),1)]" />
                                                <span className="text-sm font-medium text-zinc-400 leading-relaxed">{sug}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute bottom-6 right-8 opacity-20">
                                    <span className="text-[10px] font-black tracking-tighter text-white">DEVROAST.AI</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

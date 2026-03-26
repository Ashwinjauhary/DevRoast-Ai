"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { GitCommit, Settings2, RefreshCcw, Check, Copy, Wand2 } from "lucide-react";
import { fetchRecentCommits, suggestCommitFixes, applyCommitFix, type GitHubCommit } from "@/app/dashboard/commits/actions";
import { AnimatePresence, motion } from "framer-motion";

interface CommitFix { sha: string; suggested: string }

export function CommitFixerWidget() {
    const [commits, setCommits] = useState<GitHubCommit[]>([]);
    const [fixes, setFixes] = useState<CommitFix[]>([]);
    const [loading, setLoading] = useState(true);
    const [fixing, setFixing] = useState(false);
    const [applyingSha, setApplyingSha] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const [mounted, setMounted] = useState(false);

    const loadCommits = async () => {
        setLoading(true);
        const res = await fetchRecentCommits();
        if (res.success && res.commits) {
            setCommits(res.commits);
        }
        setLoading(false);
    };

    const handleFixCommits = async () => {
        setFixing(true);
        const res = await suggestCommitFixes(commits);
        if (res.success && res.fixedCommits) {
            setFixes(res.fixedCommits);
        }
        setFixing(false);
    };

    const handleApplyCommitFix = async (commit: GitHubCommit, newMessage: string) => {
        if (!commit.branch) {
            toast.error("Branch information is missing for this commit.");
            return;
        }
        
        setApplyingSha(commit.sha);
        const res = await applyCommitFix(commit.repo, commit.branch, commit.sha, newMessage);
        
        if (res.success) {
            toast.success("Commit message updated on GitHub!");
            loadCommits(); // Refresh list
        } else {
            toast.error(`Error: ${res.error}`);
        }
        setApplyingSha(null);
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    useEffect(() => {
        // Use setTimeout to avoid synchronous setState inside effect
        const timer = setTimeout(() => {
            setMounted(true);
            loadCommits();
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return (
        <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-6 lg:p-8 h-full flex items-center justify-center min-h-[400px]">
            <RefreshCcw className="w-8 h-8 text-white/5 animate-spin" />
        </div>
    );



    return (
        <div className="bg-[#050505] border border-white/5 rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 lg:p-6 relative overflow-hidden group h-full flex flex-col shadow-2xl">
            {/* Animated background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col gap-4 mb-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                            <GitCommit className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black tracking-tight text-white uppercase opacity-90">Commit Fixer</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Compliance Active</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={loadCommits}
                        disabled={loading || fixing}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50 active:scale-95"
                    >
                        <RefreshCcw className={`w-3.5 h-3.5 text-zinc-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <button
                    onClick={handleFixCommits}
                    disabled={loading || fixing || commits.length === 0}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/3 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-zinc-300 hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 group/fixbtn"
                >
                    {fixing ? (
                        <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Settings2 className="w-3.5 h-3.5 text-indigo-500 group-hover/fixbtn:scale-110 transition-transform" />
                    )}
                    Optimize All Messages
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 relative z-10 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-4 py-20">
                            <div className="relative">
                                <RefreshCcw className="w-6 h-6 text-indigo-500/20 animate-spin" />
                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl animate-pulse" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Syncing_Refs...</span>
                        </motion.div>
                    ) : commits.length === 0 ? (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center px-6 py-20">
                            <GitCommit className="w-8 h-8 text-white/5 mb-3" />
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">No recent activity detected.</span>
                        </motion.div>
                    ) : (
                        commits.map((commit, i) => {
                            const fix = fixes.find(f => f.sha === commit.sha);
                            return (
                                <motion.div
                                    key={commit.sha}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-4 rounded-2xl bg-white/1 border border-white/5 hover:border-white/10 transition-all relative group/commit"
                                >
                                    <div className="flex justify-between items-center mb-2.5">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 shrink-0">
                                                {commit.repo.split('/')[1] || commit.repo}
                                            </div>
                                            <span className="text-[8px] font-mono text-zinc-600 truncate">{commit.sha.substring(0, 7)}</span>
                                        </div>
                                        {commit.branch && (
                                            <div className="text-[8px] font-black text-zinc-700 uppercase">{commit.branch}</div>
                                        )}
                                    </div>

                                    <p className={`text-[11px] font-medium text-zinc-500 leading-snug truncate ${fix ? 'mb-3 opacity-30 select-none' : ''}`}>
                                        {commit.message}
                                    </p>

                                    {fix && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col gap-3"
                                        >
                                            <p className="text-[11px] font-bold text-indigo-200 font-mono leading-tight wrap-break-word pr-12 relative">
                                                {fix.suggested}
                                                <span className="absolute -top-4 -left-1 text-[8px] font-black text-indigo-500/50 uppercase">Suggested Patch</span>
                                            </p>
                                            
                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <button
                                                    onClick={() => copyToClipboard(fix.suggested, i)}
                                                    className="p-1.5 rounded-lg bg-black/40 text-zinc-500 hover:text-white transition-all border border-white/5"
                                                    title="Copy"
                                                >
                                                    {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                                <button
                                                    onClick={() => handleApplyCommitFix(commit, fix.suggested)}
                                                    disabled={applyingSha === commit.sha}
                                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                                                >
                                                    {applyingSha === commit.sha ? (
                                                        <RefreshCcw className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Wand2 className="w-3 h-3" />
                                                            <span className="text-[9px] font-black uppercase">Patch HEAD</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-black to-transparent pointer-events-none z-20" />
        </div>
    );
}

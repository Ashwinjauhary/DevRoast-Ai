"use client";

import { useState } from "react";
import { calculateJobMatch } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    Zap,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Target,
    Terminal,
    Sparkles,
    ArrowUpRight,
    Trophy,
    MessageSquareQuote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JobMatchResult {
    matchPercentage: number;
    compatiblityScore: number;
    verdict: string;
    strengths: string[];
    gaps: string[];
    resumeAdvice: string;
}

export default function JobMatchPage() {
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<JobMatchResult | null>(null);
    const [error, setError] = useState("");

    async function handleAnalyze() {
        if (!jd || jd.length < 50) {
            setError("Job Description is too short for a neural match.");
            return;
        }
        setLoading(true);
        setError("");
        setResult(null);

        const res = await calculateJobMatch(jd);
        setLoading(false);

        if (res.success) {
            setResult(res.result as JobMatchResult);
        } else {
            setError(res.error || "Neural link failed. Try again.");
        }
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-24 px-4 sm:px-0">
            <div className="space-y-4 text-center py-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    <Target className="w-3 h-3" />
                    Career Optimizer v2.4
                </div>
                <AnimatedText text="Job Match Engine" className="text-6xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto italic">
                    Paste a job description to see how your GitHub DNA stacks up against the market.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Input Area */}
                <div className="lg:col-span-7 space-y-6">
                    <PremiumCard glowColor="primary">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-white flex items-center gap-2 uppercase tracking-widest text-xs">
                                    <Terminal className="w-4 h-4 text-primary" />
                                    Job Description Archive
                                </h3>
                                <span className="text-[10px] text-zinc-600 font-mono">{jd.length} chars</span>
                            </div>
                            <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the job requirements, tech stack, and responsibilities here..."
                                rows={15}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-zinc-300 font-mono text-xs focus:outline-none focus:border-primary/40 transition-colors resize-none custom-scrollbar"
                            />
                            <Button
                                onClick={handleAnalyze}
                                disabled={loading || !jd}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 transition-all font-black uppercase tracking-widest text-xs rounded-xl"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                                {loading ? "Analyzing Compatibility..." : "Process Neural Match"}
                            </Button>
                        </div>
                    </PremiumCard>
                    {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest px-2">{error}</p>}
                </div>

                {/* Info / Tips Area */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                        <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            How it works
                        </h4>
                        <div className="space-y-4 text-xs text-zinc-500 leading-relaxed font-light">
                            <p>1. Our AI pulls your latest <strong>Architectural Analysis</strong> from your GitHub history.</p>
                            <p>2. It parses the Job Description for required tech stacks, seniority signals, and soft skills.</p>
                            <p>3. A mathematical comparison is performed on your <strong>Technical DNA</strong> to find perfect overlaps and critical gaps.</p>
                        </div>
                    </div>

                    <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl space-y-4">
                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Recruiter Tips
                        </h4>
                        <ul className="space-y-3 text-[11px] text-zinc-400">
                            <li className="flex gap-2">
                                <ArrowUpRight className="w-3 h-3 text-primary shrink-0" />
                                Highlight projects where you migrated legacy code.
                            </li>
                            <li className="flex gap-2">
                                <ArrowUpRight className="w-3 h-3 text-primary shrink-0" />
                                Use our **Resume Architect** after this to fix gaps.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 pt-10"
                    >
                        {/* Score Card */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <PremiumCard glowColor="accent" className="md:col-span-1">
                                <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 h-full">
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="60"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-white/5"
                                            />
                                            <motion.circle
                                                cx="64"
                                                cy="64"
                                                r="60"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={377}
                                                initial={{ strokeDashoffset: 377 }}
                                                animate={{ strokeDashoffset: 377 - (377 * result.matchPercentage) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="text-accent"
                                            />
                                        </svg>
                                        <span className="absolute text-3xl font-black text-white">{result.matchPercentage}%</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Compatibility Rating</p>
                                        <h4 className="text-lg font-black text-accent">{result.compatiblityScore}/10</h4>
                                    </div>
                                </div>
                            </PremiumCard>

                            <PremiumCard glowColor="none" className="md:col-span-2">
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-accent" />
                                        <h3 className="text-xl font-black text-white italic">The Verdict</h3>
                                    </div>
                                    <p className="text-xl text-zinc-300 font-light leading-relaxed">
                                        &quot;{result.verdict}&quot;
                                    </p>
                                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Key Strengths
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {result.strengths.map((s: string, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase rounded">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PremiumCard>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <PremiumCard glowColor="none">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Technical Gaps
                                    </h3>
                                    <div className="space-y-3">
                                        {result.gaps.map((gap: string, i: number) => (
                                            <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                <p className="text-sm text-zinc-400 font-light">{gap}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PremiumCard>

                            <PremiumCard glowColor="primary">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                        <MessageSquareQuote className="w-4 h-4" /> Optimization Roadmap
                                    </h3>
                                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                        <p className="text-sm text-zinc-300 leading-relaxed font-light italic">
                                            {result.resumeAdvice}
                                        </p>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <Button className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] h-9 rounded-lg">
                                            Update Resume with Fixes <ArrowUpRight className="ml-2 w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </PremiumCard>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github, Play, Loader2, AlertCircle, Download, TerminalSquare, Wand2, Zap } from "lucide-react";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { ShareRoast } from "@/components/dashboard/share-roast";

interface GitHubMetrics {
    followers: number;
    public_repos: number;
    totalStars: number;
    topLanguages: string[];
}

interface AnalysisResult {
    score: number;
    roastLines: string[];
    categories: Record<string, number>;
    suggestions: string[];
}

interface GithubAnalysis {
    metrics: GitHubMetrics;
    analysis: AnalysisResult;
}

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    github_username?: string;
}

export default function GithubAnalysisPage() {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GithubAnalysis | null>(null);
    const [isPending, startTransition] = useTransition();
    const [revealed, setRevealed] = useState(true);
    const { data: session } = useSession();

    const loggedInGithubUser = (session?.user as SessionUser)?.github_username;
    const isOwnAccount = loggedInGithubUser?.toLowerCase() === username.toLowerCase();

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) return;

        setLoading(true);
        setResult(null);
        setRevealed(false);

        try {
            const metricsRes = await fetch(`/api/analyze/github-profile?username=${encodeURIComponent(username)}`);
            if (!metricsRes.ok) throw new Error("Target hidden in shadows. Check username or rate limits.");
            const metrics = await metricsRes.json();

            const engineRes = await fetch(`/api/analyze/engine-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, metrics })
            });
            if (!engineRes.ok) throw new Error("The engine choked on this code. Failed to process.");
            const analysis = await engineRes.json();

            setResult({ metrics, analysis });
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-5xl mx-auto pb-24">
            <div className="space-y-4">
                <AnimatedText text="Profile Analysis" className="text-5xl font-black tracking-tighter text-gradient" />
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-zinc-500 font-light"
                >
                    Identify the architectural disasters hiding in your GitHub profile.
                </motion.p>
            </div>

            <PremiumCard glowColor="secondary">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                            <Github className="w-5 h-5 text-secondary" />
                            Target Intelligence
                        </h2>
                        <p className="text-sm text-zinc-500 font-medium">Who are we dissecting today?</p>
                    </div>

                    <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 transition-colors group-focus-within:text-secondary" />
                            <input
                                type="text"
                                placeholder="GitHub Username (e.g. torvalds)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-base font-medium focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all placeholder:text-zinc-700 glass-darker"
                            />
                        </div>
                        <Button
                            disabled={loading || !username}
                            type="submit"
                            className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 px-8 py-7 rounded-2xl font-black tracking-tight text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <div className="flex items-center gap-2"><Play className="w-5 h-5" /> EXAMINE</div>}
                        </Button>
                    </form>
                </div>
            </PremiumCard>

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        {/* Revealed Logic */}
                        {!revealed ? (
                            <PremiumCard glowColor="accent" className="py-20 text-center space-y-8 animate-pulse">
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <div className="w-24 h-24 border-4 border-white/5 border-t-accent rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Zap className="w-8 h-8 text-accent animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter text-white">Neural Sinkhole Detected</h2>
                                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Awaiting decryption of @{username}&apos;s reputation...</p>
                                </div>
                                <Button 
                                    onClick={() => setRevealed(true)}
                                    className="bg-accent text-black font-black uppercase tracking-widest px-10 h-14 rounded-2xl hover:bg-accent/80 transition-all hover:scale-105"
                                >
                                    Reveal Genetic Roast
                                </Button>
                            </PremiumCard>
                        ) : (
                            <div className="space-y-8 animate-in zoom-in-95 duration-700">

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Generated Intelligence</span>
                                <h3 className="text-3xl font-black tracking-tighter">Analysis Complete</h3>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                {isOwnAccount && (
                                    <Button
                                        onClick={() => {
                                            toast((t) => (
                                                <div className="flex flex-col gap-4 max-w-md">
                                                    <p className="text-xs font-black text-white uppercase tracking-tighter">
                                                        Manual Redemption Path 🌪️ <br/>
                                                        <span className="text-primary opacity-80 lowercase font-medium italic">Follow these protocols to repair your reputation.</span>
                                                    </p>
                                                    <ul className="space-y-2 text-[10px] text-zinc-400 font-mono list-disc pl-4">
                                                        <li>Craft an elite <span className="text-white">Bio</span> (max 160 chars) focusing on architect-level impact.</li>
                                                        <li>Update your <span className="text-white">Profile README</span> with modern tech stack badges.</li>
                                                        <li>Ensure your <span className="text-white">Location</span> and <span className="text-white">Company</span> fields are industrial-certified.</li>
                                                        <li>Pin your most high-integrity repositories to the top.</li>
                                                    </ul>
                                                    <div className="flex justify-end">
                                                        <button 
                                                            onClick={() => toast.dismiss(t.id)}
                                                            className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all"
                                                        >
                                                            Understood
                                                        </button>
                                                    </div>
                                                </div>
                                            ), { duration: 10000, position: "top-center" });
                                        }}
                                        variant="outline"
                                        className="gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:text-primary flex-1 sm:flex-none font-bold"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Improve Profile
                                    </Button>
                                )}
                                    <ShareRoast 
                                        data={{
                                            username: username,
                                            score: result.analysis.score,
                                            label: result.analysis.roastLines[0],
                                            avatarUrl: session?.user?.image || undefined,
                                            type: "profile"
                                        }} 
                                    />
                            </div>
                        </div>

                        <div id="roast-card-export" className="group relative rounded-[2rem] p-px overflow-hidden">
                            {/* Animated Border Background */}
                            <div className="absolute inset-0 bg-linear-to-br from-primary via-secondary to-accent opacity-20" />

                            <div className="relative bg-[#050505] p-8 sm:p-12 rounded-[1.95rem] overflow-hidden">
                                {/* Decorative elements */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

                                <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
                                    <div className="flex-1 space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                                                <Github className="w-8 h-8 text-secondary" />
                                            </div>
                                            <div>
                                                <h2 className="text-4xl font-black tracking-tighter text-white">@{username}</h2>
                                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Developer Integrity Report</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/2 border border-white/5 rounded-3xl p-8 relative overflow-hidden glass-darker">
                                            <div className="flex items-center gap-2 mb-6 text-[10px] font-black text-secondary bg-secondary/5 border border-secondary/20 px-3 py-1.5 rounded-full w-fit">
                                                <TerminalSquare className="w-3 h-3" /> ANALYZING_SOURCE...
                                            </div>

                                            <div className="space-y-4">
                                                {result.analysis.roastLines.map((line: string, i: number) => (
                                                    <motion.p
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 * i }}
                                                        key={i}
                                                        className="text-zinc-300 text-lg md:text-xl font-light leading-relaxed italic"
                                                    >
                                                        <span className="text-primary font-black mr-4 not-italic font-mono">»</span>
                                                        &quot;{line}&quot;
                                                    </motion.p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-80 space-y-6">
                                        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 text-center relative overflow-hidden group/score">
                                            <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover/score:opacity-100 transition-opacity duration-700" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block relative z-10">Integrity Score</span>
                                            <div className="text-8xl font-black tracking-tighter text-white relative z-10 mb-2">
                                                {result.analysis.score}<span className="text-zinc-700 text-4xl">/10</span>
                                            </div>
                                            <div className="px-4 py-1.5 bg-primary/20 rounded-full border border-primary/30 w-fit mx-auto relative z-10 transition-transform group-hover/score:scale-110">
                                                <span className="text-[10px] font-black text-primary uppercase">{result.analysis.score > 7 ? "Superior" : result.analysis.score > 4 ? "Mid-Tier" : "Liability"}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {Object.entries(result.analysis.categories).map(([key, val], i: number) => (
                                                <div key={key} className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
                                                        <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                        <span className="text-white">{val}/10</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${val * 10}%` }}
                                                            transition={{ duration: 1.5, ease: "circOut", delay: 0.5 + (i * 0.1) }}
                                                            className="h-full bg-linear-to-r from-primary to-accent rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex flex-wrap gap-2 relative z-10">
                                    {result.analysis.suggestions.slice(0, 3).map((sug: string, i: number) => (
                                        <div key={i} className="px-4 py-2 bg-white/3 border border-white/10 rounded-xl text-xs font-bold text-zinc-400">
                                            {sug}
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute bottom-6 right-8 opacity-20">
                                    <span className="text-[10px] font-black tracking-tighter text-white">DEVROAST.AI</span>
                                </div>
                            </div>
                        </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

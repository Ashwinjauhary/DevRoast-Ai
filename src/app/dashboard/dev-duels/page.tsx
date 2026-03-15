"use client";

import { useState } from "react";
import { performDuel } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { 
    Swords, Trophy, Skull, Zap, Loader2, 
    ArrowRight, Github, Star, Users, Code,
    Skull as SkullIcon, ShieldAlert, Sparkles,
    Flame
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface DuelPlayer {
    login: string;
    avatar_url: string;
    followers: number;
    public_repos: number;
    total_stars: number;
    analysis: {
        score: number;
        roastLines: string[];
    };
}

interface DuelResponse {
    success: boolean;
    result: {
        winner: string;
        victoryTitle: string;
        verdict: string;
        roastForLoser: string;
    };
    players: {
        user1: DuelPlayer;
        user2: DuelPlayer;
    };
    error?: string;
}

export default function DevDuelsPage() {
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");
    const [loading, setLoading] = useState(false);
    const [duelData, setDuelData] = useState<DuelResponse | null>(null);
    const [error, setError] = useState("");

    async function handleBattle() {
        if (!user1 || !user2) return;
        setLoading(true);
        setError("");
        setDuelData(null);

        const res = await performDuel(user1, user2);
        setLoading(false);

        if (res.success) {
            setDuelData(res as unknown as DuelResponse);
            if (res.result.winner !== "DRAW") {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ff0000', '#ffffff', '#00ff00']
                });
            }
        } else {
            setError(res.error || "The arena collapsed. Try again.");
        }
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-24 relative">
            {/* Background Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-red-500/10 via-transparent to-transparent blur-[120px] -z-10" />

            <div className="space-y-4 text-center py-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Swords className="w-3 h-3" />
                    Neural Coliseum v1.0
                </div>
                <AnimatedText text="Dev Duels" className="text-7xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 italic max-w-2xl mx-auto">
                    Two enter. One leaves with their dignity intact. The AI decides who rules the commit history.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Player 1 Input */}
                <div className="lg:col-span-5">
                    <PremiumCard glowColor="secondary">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                    <Github className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight text-white">Challenger Alpha</h3>
                            </div>
                            <input
                                value={user1}
                                onChange={(e) => setUser1(e.target.value)}
                                placeholder="GitHub Username 1"
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white placeholder-zinc-700 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                        </div>
                    </PremiumCard>
                </div>

                {/* VS Divider */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        <span className="text-2xl font-black text-black">VS</span>
                    </div>
                </div>

                {/* Player 2 Input */}
                <div className="lg:col-span-5">
                    <PremiumCard glowColor="primary">
                        <div className="space-y-6 text-right">
                            <div className="flex items-center justify-end gap-3 mb-2">
                                <h3 className="text-lg font-black tracking-tight text-white">Challenger Sigma</h3>
                                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                                    <Github className="w-5 h-5 text-red-400" />
                                </div>
                            </div>
                            <input
                                value={user2}
                                onChange={(e) => setUser2(e.target.value)}
                                placeholder="GitHub Username 2"
                                className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-white text-right placeholder-zinc-700 font-mono text-sm focus:outline-none focus:border-red-500/50 transition-all"
                            />
                        </div>
                    </PremiumCard>
                </div>
            </div>

            <div className="flex justify-center pt-8">
                <Button
                    onClick={handleBattle}
                    disabled={loading || !user1 || !user2}
                    className="h-16 px-12 bg-white text-black hover:bg-zinc-200 transition-all text-xl font-black uppercase tracking-[0.2em] rounded-none shadow-[0_0_50px_rgba(255,255,255,0.1)] group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-red-500/10 group-hover:translate-x-full transition-transform duration-500" />
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Zap className="w-6 h-6 mr-3 text-red-600" />}
                    {loading ? "Analyzing DNA..." : "Engage Battle"}
                </Button>
            </div>

            {error && <p className="text-center text-red-500 font-black uppercase tracking-widest text-xs">{error}</p>}

            {/* Duel Results */}
            <AnimatePresence>
                {duelData && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12 pt-12"
                    >
                        {/* Winner Reveal Card */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl" />
                            <PremiumCard glowColor="accent" className="overflow-hidden border-primary/20 bg-black/60 relative z-10">
                                <div className="flex flex-col items-center text-center space-y-6 py-8">
                                    <div className="p-4 bg-accent/20 rounded-full border border-accent/40 animate-bounce">
                                        <Trophy className="w-12 h-12 text-accent" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-black text-accent uppercase tracking-[0.5em]">{duelData.result.victoryTitle}</h4>
                                        <h2 className="text-6xl font-black text-white italic">
                                            {duelData.result.winner === "DRAW" ? "NO SURVIVORS" : `${duelData.result.winner} DOMINATED`}
                                        </h2>
                                    </div>
                                    <p className="text-xl text-zinc-300 font-light max-w-3xl leading-relaxed border-t border-white/5 pt-6 italic">
                                        &quot;{duelData.result.verdict}&quot;
                                    </p>
                                </div>
                            </PremiumCard>
                        </div>

                        {/* Head-to-Head Comparison Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {[1, 2].map((i) => {
                                const key = `user${i}` as keyof DuelResponse['players'];
                                const player = duelData.players[key];
                                const isWinner = duelData.result.winner === player.login;
                                return (
                                    <motion.div
                                        key={player.login}
                                        initial={{ x: i === 1 ? -20 : 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <PremiumCard glowColor={isWinner ? "accent" : "none"} className={!isWinner ? "opacity-60 saturate-50" : ""}>
                                            <div className="flex items-center gap-6 mb-8">
                                                <img src={player.avatar_url} className="w-20 h-20 rounded-2xl border-2 border-white/10" alt="" />
                                                <div>
                                                    <h3 className="text-2xl font-black text-white">@{player.login}</h3>
                                                    <div className="flex gap-2 mt-1">
                                                        {isWinner ? (
                                                            <span className="px-2 py-0.5 bg-accent/20 text-accent text-[9px] font-black uppercase rounded border border-accent/30 tracking-widest flex items-center gap-1">
                                                                <Flame className="w-2.5 h-2.5" /> VICTOR
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[9px] font-black uppercase rounded border border-red-500/30 tracking-widest flex items-center gap-1">
                                                                <SkullIcon className="w-2.5 h-2.5" /> DECAPITATED
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-auto text-right">
                                                    <span className="text-4xl font-black text-white">{player.analysis.score}</span>
                                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">DNA Score</p>
                                                </div>
                                            </div>

                                            {/* Sub-Stats */}
                                            <div className="grid grid-cols-3 gap-4 mb-8">
                                                {[
                                                    { icon: Star, label: "Stars", val: player.total_stars, color: "text-amber-400" },
                                                    { icon: Code, label: "Repos", val: player.public_repos, color: "text-blue-400" },
                                                    { icon: Users, label: "Followers", val: player.followers, color: "text-emerald-400" },
                                                ].map((s) => (
                                                    <div key={s.label} className="bg-black/40 p-3 rounded-xl border border-white/5">
                                                        <s.icon className={`w-3.5 h-3.5 mb-2 ${s.color}`} />
                                                        <p className="text-lg font-black text-white">{s.val}</p>
                                                        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{s.label}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Roasts */}
                                            <div className="space-y-4 pt-6 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <ShieldAlert className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Post-Mortem Findings</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {player.analysis.roastLines.map((line: string, idx: number) => (
                                                        <p key={idx} className="text-xs text-zinc-400 italic bg-white/5 p-3 rounded-lg border-l-2 border-red-500/40">
                                                            {line}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>

                                            {!isWinner && (
                                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                                    <p className="text-xs text-red-500 font-bold mb-1 uppercase tracking-widest flex items-center gap-2">
                                                        <Skull className="w-3.5 h-3.5" /> Finishing Move
                                                    </p>
                                                    <p className="text-sm text-zinc-300 italic">&quot;{duelData.result.roastForLoser}&quot;</p>
                                                </div>
                                            )}
                                        </PremiumCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

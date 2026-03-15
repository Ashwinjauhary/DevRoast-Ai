"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface ScoreVisualsProps {
    score: number;
    title: string;
    rank: string;
    categories: Record<string, number>;
}

export function ScoreVisuals({ score, title, rank, categories }: ScoreVisualsProps) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 10) * circumference;

    useEffect(() => {
        if (score >= 8.0) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    }, [score]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="relative group/score flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] glass-darker overflow-hidden h-full min-h-[400px]">
                    {/* Animated Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover/score:opacity-100 transition-opacity duration-1000" />

                    <div className="relative z-10">
                        <svg className="w-48 h-48 transform -rotate-90">
                            {/* Background Circle */}
                            <circle
                                cx="96"
                                cy="96"
                                r={radius}
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="12"
                                fill="none"
                            />
                            {/* Progress Circle */}
                            <motion.circle
                                cx="96"
                                cy="96"
                                r={radius}
                                stroke="url(#scoreGradient)"
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 2, ease: "circOut" }}
                                strokeLinecap="round"
                                fill="none"
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--primary)" />
                                    <stop offset="100%" stopColor="var(--accent)" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-6xl font-black tracking-tighter text-white"
                            >
                                {score}
                            </motion.span>
                            <span className="text-zinc-500 font-black text-xs uppercase tracking-widest mt-1">Dev Score</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center space-y-2 relative z-10">
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <Trophy className="w-5 h-5" />
                            <span className="text-xl font-black tracking-tight uppercase">{title}</span>
                        </div>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest leading-none">{rank}</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] glass h-full">
                    <h3 className="text-xl font-black tracking-tight mb-8 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(var(--secondary),1)]" />
                        Capability Matrix
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                        {Object.entries(categories).map(([key, val], i) => (
                            <div key={key} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="text-sm font-black text-white">{val}/10</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${val * 10}%` }}
                                        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 * i }}
                                        className="h-full bg-gradient-to-r from-secondary to-emerald-500 rounded-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

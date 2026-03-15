"use client";

import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { Github, GitBranch, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface HistoryListProps {
    analyses: any[];
}

export function HistoryList({ analyses }: HistoryListProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {analyses.map((run) => (
                <motion.div key={run.id} variants={item}>
                    <PremiumCard
                        glowColor={run.analysis_type === "profile" ? "secondary" : "primary"}
                        className="h-full flex flex-col group cursor-default"
                    >
                        <div className="space-y-6 h-full flex flex-col">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl border ${run.analysis_type === "profile"
                                            ? "bg-secondary/10 border-secondary/20 text-secondary"
                                            : "bg-primary/10 border-primary/20 text-primary"
                                        }`}>
                                        {run.analysis_type === "profile" ? <Github className="w-5 h-5" /> : <GitBranch className="w-5 h-5" />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                        {run.analysis_type}
                                    </span>
                                </div>
                                <div className="text-3xl font-black tracking-tighter text-white group-hover:scale-110 transition-transform">
                                    {run.score}<span className="text-xs text-zinc-600 ml-0.5">/10</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-black tracking-tight text-zinc-100 truncate group-hover:text-white transition-colors">
                                {run.target}
                            </h3>

                            <div className="flex-1">
                                <p className="text-sm text-zinc-500 italic font-medium line-clamp-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                                    "{((run.result_json as any)?.roastLines?.[0]) || "The silence is deafening. No roast logs found."}"
                                </p>
                            </div>

                            <div className="pt-6 flex items-center justify-between border-t border-white/5 mt-auto">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(run.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <Link
                                    href={run.analysis_type === "profile" ? "/dashboard/github-analysis" : "/dashboard/repo-analysis"}
                                    className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </PremiumCard>
                </motion.div>
            ))}
        </motion.div>
    );
}

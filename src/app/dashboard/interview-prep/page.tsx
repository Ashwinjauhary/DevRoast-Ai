"use client";

import { useState } from "react";
import { getInterviewQuestions } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { Brain, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const WEAK_AREAS = ["Data Structures", "System Design", "Algorithms", "Security", "Testing", "Database Design", "API Design", "Performance", "DevOps", "Architecture"];
const STACKS = ["React", "Node.js", "Python", "Java", "TypeScript", "Go", "AWS", "Docker", "GraphQL", "PostgreSQL"];

const DIFF_COLORS = { easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", medium: "text-amber-400 bg-amber-500/10 border-amber-500/20", hard: "text-red-400 bg-red-500/10 border-red-500/20" };

export default function InterviewPrepPage() {
    const [weaknesses, setWeaknesses] = useState<string[]>([]);
    const [techStack, setTechStack] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const [error, setError] = useState("");

    function toggle(arr: string[], item: string, set: (v: string[]) => void) {
        set(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item]);
    }

    async function handleGenerate() {
        if (weaknesses.length === 0 || techStack.length === 0) { setError("Select at least 1 weakness and 1 tech."); return; }
        setLoading(true); setError(""); setQuestions([]);
        const data = await getInterviewQuestions(weaknesses, techStack);
        setLoading(false);
        if (data.error) setError(data.error);
        else setQuestions(Array.isArray(data.questions) ? data.questions : []);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">Interview Prep</h1>
                <p className="text-xl text-zinc-500 italic">FAANG-level questions tailored to your actual weak spots.</p>
            </div>

            <PremiumCard glowColor="primary">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Brain className="w-5 h-5 text-primary" />
                            <h3 className="font-black tracking-tight">Your Weak Areas</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {WEAK_AREAS.map(w => (
                                <button
                                    key={w}
                                    onClick={() => toggle(weaknesses, w, setWeaknesses)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${weaknesses.includes(w) ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/[0.02] border-white/10 text-zinc-500 hover:border-white/20"}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-black tracking-tight">Your Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {STACKS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggle(techStack, s, setTechStack)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${techStack.includes(s) ? "bg-secondary/20 border-secondary/50 text-secondary" : "bg-white/[0.02] border-white/10 text-zinc-500 hover:border-white/20"}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Preparing questions...</> : "Generate Interview Questions"}
                    </button>
                </div>
            </PremiumCard>

            {questions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">{questions.length} Questions Generated</h3>
                    {questions.map((q, i) => {
                        const diffStyle = DIFF_COLORS[q.difficulty as keyof typeof DIFF_COLORS] || DIFF_COLORS.medium;
                        return (
                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                                <button className="w-full p-5 text-left flex items-center justify-between gap-4" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                                    <div className="flex items-start gap-4">
                                        <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${diffStyle}`}>{q.difficulty}</span>
                                        <p className="text-sm text-white font-medium">{q.question}</p>
                                    </div>
                                    {openIdx === i ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
                                </button>
                                {openIdx === i && (
                                    <div className="px-5 pb-5 pt-0">
                                        <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-xl">
                                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-2">💡 Hint</p>
                                            <p className="text-sm text-zinc-400">{q.hint}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

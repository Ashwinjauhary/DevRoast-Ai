"use client";

import { useState } from "react";
import { getOssRecommendations } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { Github, Loader2, ExternalLink, Star } from "lucide-react";

const SKILL_OPTIONS = ["React", "TypeScript", "Python", "Node.js", "Go", "Rust", "Java", "DevOps", "ML/AI", "Mobile", "Database", "Security"];
const DIFF_STYLES: Record<string, string> = { beginner: "text-emerald-400", intermediate: "text-amber-400", advanced: "text-red-400" };

export default function OssRecommenderPage() {
    const [skills, setSkills] = useState<string[]>([]);
    const [stackInput, setStackInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [repos, setRepos] = useState<any[]>([]);
    const [error, setError] = useState("");

    function toggleSkill(skill: string) {
        setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    }

    async function handleRecommend() {
        if (skills.length === 0) { setError("Select at least one skill area."); return; }
        setLoading(true); setError(""); setRepos([]);
        const stack = stackInput.split(",").map(s => s.trim()).filter(Boolean);
        const data = await getOssRecommendations(skills, stack.length ? stack : skills);
        setLoading(false);
        if (data.error) setError(data.error);
        else setRepos(Array.isArray(data.repos) ? data.repos : []);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">OSS Recommender</h1>
                <p className="text-xl text-zinc-500 italic">Contribute to projects that actually match your skills. Build your reputation.</p>
            </div>

            <PremiumCard glowColor="secondary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Github className="w-5 h-5 text-secondary" />
                        <h3 className="text-lg font-black tracking-tight">Your Skills & Interests</h3>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Skill areas</p>
                        <div className="flex flex-wrap gap-2">
                            {SKILL_OPTIONS.map(s => (
                                <button
                                    key={s}
                                    onClick={() => toggleSkill(s)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${skills.includes(s) ? "bg-secondary/20 border-secondary/50 text-secondary" : "bg-white/[0.02] border-white/10 text-zinc-500 hover:border-white/20"}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Current Tech Stack (optional, comma separated)</label>
                        <input
                            value={stackInput}
                            onChange={e => setStackInput(e.target.value)}
                            placeholder="e.g. React, PostgreSQL, Docker"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-secondary/50 transition-colors"
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        onClick={handleRecommend}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-secondary/90 transition-all disabled:opacity-40"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Finding projects...</> : "Find Projects to Contribute"}
                    </button>
                </div>
            </PremiumCard>

            {repos.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-2xl font-black tracking-tight">Recommended Repositories</h3>
                    {repos.map((repo, i) => (
                        <PremiumCard key={i} glowColor="none">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-5 h-5 text-secondary" />
                                        <div>
                                            <h4 className="font-black text-white">{repo.owner}/{repo.name}</h4>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${DIFF_STYLES[repo.difficulty] || "text-zinc-400"}`}>{repo.difficulty}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={repo.url || `https://github.com/${repo.owner}/${repo.name}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-xl text-xs font-black text-secondary hover:bg-secondary/20 transition-all"
                                    >
                                        <ExternalLink className="w-3 h-3" /> View
                                    </a>
                                </div>
                                <p className="text-sm text-zinc-400">{repo.description}</p>
                                <div className="p-3 bg-secondary/5 border border-secondary/10 rounded-xl">
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Why This Fits You</p>
                                    <p className="text-xs text-zinc-400">{repo.why}</p>
                                </div>
                            </div>
                        </PremiumCard>
                    ))}
                </div>
            )}
        </div>
    );
}

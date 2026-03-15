"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { PremiumCard } from "@/components/ui/premium-card";
import { 
    Code2, Loader2, AlertTriangle, Info, XCircle, Save, 
    ChevronDown, Check, Play, Zap, AlertCircle, Trophy 
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "SQL"];

const SEVERITY_STYLES = {
    error: { icon: XCircle, text: "text-red-400", bg: "bg-red-500/10 border-red-500/20", label: "ERROR" },
    warning: { icon: AlertTriangle, text: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "WARNING" },
    info: { icon: Info, text: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", label: "INFO" },
};

export default function CodeReviewPage() {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("JavaScript");
    const [loading, setLoading] = useState(false);
    
    // Streaming state
    const [roast, setRoast] = useState<string[]>([]);
    const [issues, setIssues] = useState<any[]>([]);
    const [fix, setFix] = useState("");

    async function handleReview() {
        if (!code.trim()) { toast.error("Paste some code first!"); return; }
        
        setLoading(true);
        setRoast([]);
        setIssues([]);
        setFix("");

        try {
            const response = await fetch("/api/review/code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) throw new Error(await response.text());

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Stream failed to initialize.");

            const decoder = new TextDecoder();
            let fullText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
                
                for (const line of lines) {
                    try {
                        const jsonStr = line.replace("data: ", "").trim();
                        if (jsonStr === "[DONE]") continue;
                        const data = JSON.parse(jsonStr);
                        const delta = data.choices?.[0]?.delta?.content || "";
                        fullText += delta;
                        parseStream(fullText);
                    } catch (e) {
                        // Sometimes chunks are fragmented
                    }
                }
            }
        } catch (err: any) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    const parseStream = (text: string) => {
        // Extract Roast
        const roastMatch = text.match(/\[ROAST_START\]([\s\S]*?)(\[ROAST_END\]|$)/);
        if (roastMatch) {
            const points = roastMatch[1].split("\n")
                .map(p => p.trim().replace(/^\* /, ""))
                .filter(p => p.length > 3);
            setRoast(points);
        }

        // Extract Issues
        const issuesMatch = text.match(/\[ISSUES_START\]([\s\S]*?)(\[ISSUES_END\]|$)/);
        if (issuesMatch) {
            const lines = issuesMatch[1].split("\n").filter(l => l.includes("|"));
            const parsedIssues = lines.map(line => {
                const [sev, rest] = line.split("|").map(s => s.trim().replace(/^\* /, ""));
                const [lineInfo, msg, sugg] = (rest || "").split(":").map(s => s.trim());
                return {
                    severity: sev?.toLowerCase() === "error" ? "error" : "warning",
                    line: lineInfo?.replace("Line ", "") || "?",
                    message: msg || "",
                    suggestion: sugg || ""
                };
            }).filter(i => i.message);
            setIssues(parsedIssues);
        }

        // Extract Fix
        const fixMatch = text.match(/\[FIX_START\]([\s\S]*?)(\[FIX_END\]|$)/);
        if (fixMatch) {
            setFix(fixMatch[1].trim());
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-24">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
                    <Code2 className="w-4 h-4" />
                    <span className="font-black text-[10px] tracking-widest uppercase">Expert Code Audit</span>
                </div>
                <h1 className="text-6xl font-black tracking-tighter text-white">AI Code Review</h1>
                <p className="text-xl text-zinc-500 italic max-w-2xl mx-auto">Paste your snippet. Our AI will tear it apart and then show you how to actually write it like a professional.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <PremiumCard glowColor="primary">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                        <Code2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="font-black tracking-tight text-lg">Input Source</h3>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-white uppercase tracking-wider focus:outline-none flex items-center gap-2 hover:bg-white/[0.05] transition-colors outline-none cursor-pointer">
                                        {language}
                                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-zinc-950 border border-white/10 rounded-xl p-1 shadow-2xl min-w-[140px] z-50">
                                        {LANGUAGES.map(l => (
                                            <DropdownMenuItem
                                                key={l}
                                                onClick={() => setLanguage(l)}
                                                className="flex items-center justify-between px-3 py-2 text-xs font-black text-zinc-400 uppercase tracking-wider hover:bg-primary/10 hover:text-primary rounded-lg transition-colors cursor-pointer outline-none"
                                            >
                                                {l}
                                                {language === l && <Check className="w-3 h-3" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            
                            <textarea
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder={`// Paste your ${language} code here...\nfunction example() {\n  // your mess goes here\n}`}
                                className="w-full bg-black/60 border border-white/5 rounded-2xl px-6 py-6 text-sm text-zinc-300 font-mono placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all h-[500px] resize-none leading-relaxed shadow-inner"
                            />
                            
                            <button
                                onClick={handleReview}
                                disabled={loading || !code.trim()}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-40 hover:-translate-y-1 active:scale-[0.98] shadow-2xl"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Integrity...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5" />
                                        Initiate Roast
                                    </>
                                )}
                            </button>
                        </div>
                    </PremiumCard>
                </div>

                <div className="space-y-6">
                    {/* The Roast */}
                    <AnimatePresence>
                        {(roast.length > 0 || loading) && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 px-2">
                                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                        <Zap className="w-4 h-4 text-orange-400" />
                                    </div>
                                    <h3 className="font-black tracking-tight text-lg text-white font-mono uppercase italic">The Roast</h3>
                                </div>
                                
                                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-4 glass-dark">
                                    {roast.length === 0 && loading && <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-white/5 rounded w-3/4"></div><div className="h-4 bg-white/5 rounded w-5/6"></div></div></div>}
                                    {roast.map((point, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i} 
                                            className="flex gap-4 group"
                                        >
                                            <span className="text-primary font-black mt-1 group-hover:scale-125 transition-transform">»</span>
                                            <p className="text-zinc-300 text-lg font-light italic leading-snug">"{point}"</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Critical Issues */}
                    <AnimatePresence>
                        {issues.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 px-2">
                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                    </div>
                                    <h3 className="font-black tracking-tight text-lg text-white font-mono uppercase italic">Defects Found</h3>
                                </div>
                                <div className="space-y-3">
                                    {issues.map((issue, i) => {
                                        const style = SEVERITY_STYLES[issue.severity as keyof typeof SEVERITY_STYLES] || SEVERITY_STYLES.info;
                                        const Icon = style.icon;
                                        return (
                                            <div key={i} className={`p-6 rounded-2xl border ${style.bg} transition-all hover:scale-[1.02]`}>
                                                <div className="flex items-start gap-4">
                                                    <Icon className={`w-5 h-5 shrink-0 ${style.text} mt-1`} />
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${style.text}`}>{style.label}</span>
                                                            <span className="text-[10px] font-mono text-zinc-500 uppercase">Marker: L{issue.line}</span>
                                                        </div>
                                                        <p className="text-sm text-white font-black leading-tight">{issue.message}</p>
                                                        <p className="text-xs text-zinc-400 font-medium italic mt-1 opacity-80">{issue.suggestion}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Optimized Fix */}
                    <AnimatePresence>
                        {(fix || (loading && issues.length > 0)) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <Trophy className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <h3 className="font-black tracking-tight text-lg text-white font-mono uppercase italic">Corrected Source</h3>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            navigator.clipboard.writeText(fix);
                                            toast.success("Corrected source copied!");
                                        }}
                                        className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Copy Fix
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-emerald-500/10 blur-[50px] opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity" />
                                    <pre className="relative bg-black/80 border border-emerald-500/20 rounded-3xl p-8 text-sm font-mono text-zinc-300 overflow-x-auto selection:bg-emerald-500/30">
                                        <code>{fix || "// Generating corrected version..."}</code>
                                    </pre>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

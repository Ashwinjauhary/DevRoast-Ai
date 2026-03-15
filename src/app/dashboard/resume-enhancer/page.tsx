"use client";

import { useState, useRef, useEffect } from "react";
import { generateResumeLatex, fetchResumeContext } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Button } from "@/components/ui/button";
import { 
    Loader2, Sparkles, FileText, Copy, Download, 
    Code, Eye, Wand2, PencilLine, Check, ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeEnhancerPage() {
    const [prompt, setPrompt] = useState("");
    const [latex, setLatex] = useState("");
    const [loading, setLoading] = useState(false);
    const [contextLoading, setContextLoading] = useState(true);
    const [error, setError] = useState("");
    const [view, setView] = useState<"edit" | "preview">("preview");
    const [template, setTemplate] = useState("modern");
    const [copied, setCopied] = useState(false);
    const [userContext, setUserContext] = useState<any>(null);

    useEffect(() => {
        async function loadContext() {
            setContextLoading(true);
            const res = await fetchResumeContext();
            if (res.success) {
                setUserContext(res.data);
            }
            setContextLoading(false);
        }
        loadContext();
    }, []);

    async function handleGenerate() {
        setLoading(true);
        setError("");
        const res = await generateResumeLatex(prompt, template);
        setLoading(false);
        if (res.success && res.latex) {
            setLatex(res.latex);
            setView("edit");
        } else {
            setError(res.error || "Failed to generate resume.");
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(latex);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([latex], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `resume_${template}.tex`;
        document.body.appendChild(element);
        element.click();
    };

    if (contextLoading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto pb-24">
            <div className="space-y-4 text-center py-10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                    <Sparkles className="w-3 h-3" />
                    Neural Resume Architect v3.0
                </div>
                <AnimatedText text="AI LaTeX Resume Architect" className="text-6xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 italic max-w-2xl mx-auto">
                    Generate the 1% of elite, ATS-friendly resumes Synthesized from your technical core.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <PremiumCard glowColor="primary">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                                    <Wand2 className="w-5 h-5 text-primary" />
                                    Synthesis DNA
                                </h3>
                                <div className="grid grid-cols-1 gap-2 mt-4">
                                    {[
                                        { id: "modern", name: "The Modern", desc: "Sans-serif, clean, startup-ready.", color: "blue-400" },
                                        { id: "executive", name: "The Executive", desc: "Classic serif, formal, high-impact.", color: "zinc-400" },
                                        { id: "brutalist", name: "The Brutalist", desc: "Bold, monospace, distinct tech.", color: "white" },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTemplate(t.id)}
                                            className={`p-4 border text-left transition-all relative overflow-hidden group rounded-2xl ${
                                                template === t.id
                                                    ? "bg-white/[0.05] border-white/20 shadow-xl"
                                                    : "bg-black/20 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${template === t.id ? 'text-primary' : 'text-zinc-500'}`}>
                                                    {t.name}
                                                </span>
                                                {template === t.id && <Check className="w-3 h-3 text-primary" />}
                                            </div>
                                            <p className="text-[10px] text-zinc-600 font-medium">{t.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Customization Prompt</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. 'Target Senior Backend roles, focus on system scale and Kubernetes...'"
                                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3 text-sm text-zinc-300 font-medium placeholder-zinc-700 focus:outline-none focus:border-primary/40 transition-colors h-28 resize-none"
                                />
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-sm rounded-xl"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                {loading ? "Synthesizing..." : "Generate 10/10 Resume"}
                            </Button>

                            {error && <p className="text-xs text-red-400 font-bold">{error}</p>}
                        </div>
                    </PremiumCard>

                    {latex && (
                        <PremiumCard glowColor="secondary">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Download className="w-4 h-4 text-zinc-500" />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Export Options</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={handleCopy} className="bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest">
                                        {copied ? <Check className="w-3.3 h-3 mr-2 text-emerald-500" /> : <Copy className="w-3 h-3 mr-2" />}
                                        {copied ? "Copied" : "Copy .tex"}
                                    </Button>
                                    <Button onClick={handleDownload} className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-[10px] font-black uppercase tracking-widest">
                                        <Download className="w-3 h-3 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </PremiumCard>
                    )}
                </div>

                {/* Editor/Preview Area */}
                <div className="lg:col-span-8">
                    {!latex ? (
                        <div className="h-[600px] flex flex-col items-center justify-center border border-white/5 rounded-[3rem] bg-white/[0.01] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-20" />
                            <div className="relative z-10 flex flex-col items-center">
                                <FileText className="w-20 h-20 mb-8 text-zinc-800 animate-pulse" />
                                <p className="font-black uppercase tracking-[0.4em] text-sm text-zinc-700">Neural Synthesis Hub</p>
                                <p className="text-[10px] text-zinc-800 mt-3 font-mono border border-white/5 px-4 py-1 rounded-full">// Architecture_Ready</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-6 py-3 bg-zinc-900/50 border border-white/5 rounded-3xl">
                                <div className="flex gap-6">
                                    <button 
                                        onClick={() => setView("preview")}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'preview' ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        <Eye className="w-3.5 h-3.5" />
                                        ATS Preview
                                    </button>
                                    <button 
                                        onClick={() => setView("edit")}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${view === 'edit' ? 'text-primary' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        <Code className="w-3.5 h-3.5" />
                                        Elite Code
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-mono text-zinc-600 uppercase">Verification: Passed</span>
                                </div>
                            </div>

                            <div className="relative group">
                                <AnimatePresence mode="wait">
                                    {view === "edit" ? (
                                        <motion.div
                                            key="edit"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="relative"
                                        >
                                            <textarea
                                                value={latex}
                                                onChange={(e) => setLatex(e.target.value)}
                                                className="w-full h-[700px] bg-black border border-white/10 rounded-[3rem] p-10 font-mono text-sm text-zinc-400 focus:outline-none focus:border-primary/40 leading-relaxed shadow-3xl overflow-y-auto custom-scrollbar"
                                            />
                                            <div className="absolute top-8 right-10 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-500">
                                                <PencilLine className="w-4 h-4" />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            className="w-full h-[700px] bg-white text-zinc-900 rounded-[3rem] p-12 overflow-y-auto shadow-2xl relative custom-scrollbar-light"
                                        >
                                            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />
                                            
                                            <div className={`max-w-3xl mx-auto space-y-12 relative z-10 ${template === 'executive' ? 'font-serif' : 'font-sans'}`}>
                                                {/* ELITE HEADER */}
                                                <div className="text-center space-y-3 pb-8">
                                                    <h1 className="text-5xl font-black tracking-tight uppercase leading-tight text-zinc-900">{userContext?.name}</h1>
                                                    <p className="text-sm font-black text-zinc-600 uppercase tracking-[0.2em] border-y border-zinc-100 py-1">
                                                        Software Engineer | Global Technical Impact
                                                    </p>
                                                    <div className="flex justify-center gap-4 text-[11px] text-zinc-500 font-bold uppercase tracking-widest pt-2">
                                                       <span>{userContext?.email}</span>
                                                       <span>|</span>
                                                       <span>github.com/{userContext?.username}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-12">
                                                    {/* PROFESSIONAL SUMMARY */}
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <h2 className="text-xl font-black tracking-widest text-zinc-900">PROFESSIONAL SUMMARY</h2>
                                                            <div className="h-[2px] bg-zinc-900 w-full" />
                                                        </div>
                                                        <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                                                            High-impact Software Engineer with a focus on scalable systems and technical excellence. 
                                                            Demonstrated ability to architect robust solutions across multiple domains, leveraging 
                                                            AI-driven workflows and modern tech stacks to deliver premium products.
                                                        </p>
                                                    </div>

                                                    {/* CORE TECHNICAL SKILLS */}
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <h2 className="text-xl font-black tracking-widest text-zinc-900">CORE TECHNICAL SKILLS</h2>
                                                            <div className="h-[2px] bg-zinc-900 w-full" />
                                                        </div>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            <p className="text-sm text-zinc-800"><span className="font-black uppercase text-[10px] tracking-widest mr-2">Top Technologies:</span> {userContext?.topRepos?.map((r:any) => r.lang).filter(Boolean).slice(0, 5).join(", ")}</p>
                                                        </div>
                                                    </div>

                                                    {/* ENGINEERING PROJECTS */}
                                                    <div className="space-y-6">
                                                        <div className="space-y-1">
                                                            <h2 className="text-xl font-black tracking-widest text-zinc-900">ENGINEERING PROJECTS</h2>
                                                            <div className="h-[2px] bg-zinc-900 w-full" />
                                                        </div>
                                                        <div className="space-y-8">
                                                            {userContext?.projects?.map((p: any, i: number) => (
                                                                <div key={i} className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <h3 className="text-base font-black uppercase tracking-tight">{p.name}</h3>
                                                                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                                                                    </div>
                                                                    <ul className="text-sm space-y-1.5 list-disc list-inside text-zinc-700 leading-snug">
                                                                        <li>{p.desc}</li>
                                                                        <li className="list-none pt-1"><span className="italic text-zinc-500 font-serif">{p.tech}</span></li>
                                                                    </ul>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="pt-20 text-center opacity-20">
                                                    <p className="text-[10px] text-zinc-900 font-black tracking-[0.5em] uppercase">Built with DevRoast AI • Neural Resume Architect</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

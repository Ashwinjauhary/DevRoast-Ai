"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, ArrowRight, Briefcase, ExternalLink, Code, Sparkles, Wand, Copy, Check, Activity, Edit3, Save, X, Plus, Trash2, FileCode, Monitor, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { generatePortfolioData, saveManualPortfolio, getUserPortfolio } from "./actions";
import Link from "next/link";
import { useSession } from "next-auth/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Project {
    title: string;
    description: string;
    techStacks: string[];
}

interface PortfolioData {
    username: string;
    template: string;
    hero: {
        tagline: string;
        about: string;
    };
    projects: Project[];
    skills: string[];
}

export default function PortfolioGeneratorPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [template, setTemplate] = useState("crucible");
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCodeMode, setIsCodeMode] = useState(false);
    const [editData, setEditData] = useState<PortfolioData | null>(null);
    const [jsonEdit, setJsonEdit] = useState("");
    const portfolioRef = useRef<HTMLDivElement>(null);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const loadExisting = async () => {
            const res = await getUserPortfolio();
            if (res.success && res.portfolio) {
                const data = res.portfolio as unknown as PortfolioData;
                setPortfolio(data);
                setTemplate(data.template || "crucible");
                setEditData(data);
                setJsonEdit(JSON.stringify(data, null, 2));
            }
        };
        loadExisting();
    }, []);

    const handleCopy = () => {
        if (!portfolio) return;
        const url = `${window.location.origin}/portfolio/${portfolio.username}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const templates = [
        { id: "crucible", name: "The Crucible", desc: "Industrial, high-contrast, brutalist.", color: "white" },
        { id: "neon", name: "Neon Cyber", desc: "Glow-heavy, futuristic, midnight.", color: "primary" },
        { id: "minimalist", name: "Mono Minimal", desc: "Clean, professional, typographic.", color: "zinc-400" },
        { id: "cyberpunk", name: "High Voltage", desc: "Aggressive yellow, black, glitchy.", color: "amber-400" },
        { id: "blueprint", name: "The Architect", desc: "Blueprint blue, grid lines, technical.", color: "blue-400" },
        { id: "hacker", name: "Source Code", desc: "Green on black, terminal aesthetic.", color: "emerald-400" },
        { id: "prism", name: "Glass Prism", desc: "Glassmorphism, vibrant gradients.", color: "fuchsia-400" },
        { id: "aura", name: "Crystal Aura", desc: "Soft, glowing, ethereal design.", color: "violet-400" },
    ];

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await generatePortfolioData(template);
            if (res.success && res.portfolio) {
                const data = res.portfolio as unknown as PortfolioData;
                setPortfolio(data);
                setEditData(data);
                setJsonEdit(JSON.stringify(data, null, 2));
                setIsEditing(false);
                setIsCodeMode(false);
            } else {
                setError(res.error || "Failed to generate portfolio.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            let dataToSave = editData;
            
            if (isCodeMode) {
                try {
                    dataToSave = JSON.parse(jsonEdit);
                } catch (e) {
                    throw new Error("Invalid JSON code. Please check your syntax.");
                }
            }

            const res = await saveManualPortfolio({ ...dataToSave, template });
            if (res.success && res.portfolio) {
                const data = res.portfolio as unknown as PortfolioData;
                setPortfolio(data);
                setEditData(data);
                setJsonEdit(JSON.stringify(data, null, 2));
                setIsEditing(false);
                setIsCodeMode(false);
                alert("Portfolio details evolved successfully!");
            } else {
                setError(res.error || "Failed to save portfolio.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleExportPDF = async () => {
        if (!portfolioRef.current) return;
        setExporting(true);
        try {
            const element = portfolioRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#000000",
                logging: false,
            });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save(`${portfolio?.username || 'developer'}-portfolio-roast.pdf`);
        } catch (err) {
            console.error("PDF Export error:", err);
            setError("Failed to generate PDF. The matrix is unstable.");
        } finally {
            setExporting(false);
        }
    };

    const toggleCodeMode = () => {
        if (!isCodeMode) {
            // Entering code mode: sync editData to jsonEdit
            setJsonEdit(JSON.stringify(editData, null, 2));
        } else {
            // Exiting code mode: sync jsonEdit to editData (if valid)
            try {
                const parsed = JSON.parse(jsonEdit);
                setEditData(parsed);
                setError(null);
            } catch (e) {
                setError("Invalid JSON detected. Fix it before switching back to visual mode.");
                return; // Prevent switching if invalid
            }
        }
        setIsCodeMode(!isCodeMode);
    };

    const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
        setEditData(prev => {
            if (!prev) return null;
            const projects = [...prev.projects];
            projects[index] = { ...projects[index], [field]: value };
            return { ...prev, projects };
        });
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-5xl mx-auto pb-24">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="space-y-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    <Sparkles className="w-3 h-3" />
                    Neural Synthesis v1.0
                </div>
                <AnimatedText text="AI Portfolio Generator" className="text-4xl md:text-6xl font-black tracking-tighter text-gradient" />
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-zinc-500 font-light max-w-2xl mx-auto"
                >
                    Transform your messy GitHub history into a stunning, professional developer portfolio in one click.
                </motion.p>
            </div>

            <PremiumCard glowColor="primary">
                <div className="space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Wand className="w-6 h-6 text-primary" />
                            Synthesis Engine
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Select a design DNA and our AI will build your professional identity.
                        </p>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-zinc-500" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Design DNA:</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                            template === 'neon' ? 'bg-primary/20 text-primary' : 
                            template === 'cyberpunk' ? 'bg-amber-400 text-black' :
                            template === 'minimalist' ? 'bg-white text-black' :
                            template === 'blueprint' ? 'bg-blue-500 text-white' :
                            template === 'hacker' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-zinc-800 text-zinc-400'
                        }`}>
                            {templates.find(t => t.id === template)?.name}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                        {templates.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTemplate(t.id)}
                                className={`flex flex-col text-left p-2 border transition-all relative overflow-hidden group ${
                                    template === t.id
                                        ? "bg-white/[0.05] border-white/40 ring-1 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                        : "bg-black/20 border-white/5 hover:border-white/20"
                                }`}
                            >
                                {template === t.id && (
                                    <div className={`absolute top-0 right-0 p-1 bg-${t.color === 'white' ? 'white' : (t.color.startsWith('text-') ? t.color.replace('text-', '') : t.color)}`}>
                                        <ArrowRight className={`w-2 h-2 ${t.color === 'white' ? 'text-black' : 'text-white'}`} />
                                    </div>
                                )}
                                <span className={`text-[8px] font-black uppercase tracking-tight mb-1 truncate ${
                                    template === t.id ? (t.id === 'cyberpunk' ? 'text-amber-400' : t.id === 'crucible' ? 'text-white' : 'text-primary') : 'text-zinc-600'
                                }`}>
                                    {t.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="flex-1 min-w-[200px] h-12 bg-white text-black hover:bg-zinc-200 transition-all font-semibold rounded-none"
                            onClick={handleGenerate}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Synthesizing...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="mr-2 h-5 w-5" />
                                    {portfolio ? "Re-Generate Identity" : "Generate Premium Portfolio"}
                                </>
                            )}
                        </Button>
                        {portfolio && (
                            <div className="flex gap-2">
                                <Button
                                    size="lg"
                                    className={`h-12 border rounded-none px-6 ${isEditing && !isCodeMode ? 'bg-primary text-white border-primary' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'}`}
                                    onClick={() => {
                                        setIsEditing(!isEditing || isCodeMode);
                                        setIsCodeMode(false);
                                    }}
                                >
                                    {isEditing && !isCodeMode ? <><X className="mr-2 w-4 h-4" /> Cancel</> : <><Edit3 className="mr-2 w-4 h-4" /> Visual Edit</>}
                                </Button>
                                <Button
                                    size="lg"
                                    className={`h-12 border rounded-none px-6 ${isCodeMode ? 'bg-primary text-white border-primary' : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'}`}
                                    onClick={toggleCodeMode}
                                >
                                    {isCodeMode ? <><Monitor className="mr-2 w-4 h-4" /> Visual Mode</> : <><FileCode className="mr-2 w-4 h-4" /> Edit JSON</>}
                                </Button>
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 bg-red-950/30 border border-red-900/50 text-red-200 text-sm font-mono"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PremiumCard>

            <AnimatePresence>
                {portfolio && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h3 className="text-2xl font-black flex items-center gap-2">
                                <Code className="w-6 h-6 text-zinc-400" />
                                {isCodeMode ? "Source Code Integration" : isEditing ? "Editing Portfolio DNA" : "Current Matrix Output"}
                            </h3>
                            <div className="flex items-center gap-3">
                                {!(isEditing || isCodeMode) && (
                                    <>
                                        <Button 
                                            onClick={handleExportPDF}
                                            disabled={exporting}
                                            className="bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800 border rounded-none"
                                        >
                                            {exporting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Rendering...</> : <><Download className="mr-2 w-4 h-4" /> Export PDF</>}
                                        </Button>
                                        <Button 
                                            onClick={handleCopy}
                                            className="bg-zinc-900 text-zinc-400 hover:text-white border-zinc-800 border rounded-none"
                                        >
                                            {copied ? <><Check className="mr-2 w-4 h-4 text-emerald-500" /> Copied!</> : <><Copy className="mr-2 w-4 h-4" /> Copy Link</>}
                                        </Button>
                                        <Link href={`/portfolio/${portfolio.username}`} target="_blank">
                                            <Button className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 border rounded-none">
                                                <ExternalLink className="mr-2 w-4 h-4" />
                                                View Live Portfolio
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                {(isEditing || isCodeMode) && (
                                    <Button 
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold rounded-none px-8"
                                    >
                                        {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Persisting...</> : <><Save className="mr-2 h-4 w-4" /> Commit Changes</>}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isCodeMode ? (
                            <PremiumCard glowColor="primary">
                                <div className="p-1 bg-zinc-950">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/20 mr-1" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500/20 mr-1" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                                            <span className="ml-4 text-[10px] text-zinc-500 font-mono tracking-widest uppercase">portfolio_manifest.json</span>
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full h-[600px] bg-black text-emerald-400 p-6 font-mono text-xs focus:outline-none resize-none scrollbar-hide selection:bg-emerald-500/30"
                                        value={jsonEdit}
                                        onChange={(e) => setJsonEdit(e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                            </PremiumCard>
                        ) : (
                            <PremiumCard glowColor={isEditing ? "primary" : "secondary"}>
                                <div ref={portfolioRef} className="space-y-12 font-mono text-sm p-8 bg-black">
                                    {/* HERO SECTION */}
                                    <div className="space-y-4">
                                        <div className="text-zinc-500 uppercase tracking-widest text-xs flex justify-between">
                                            <span>Hero Section</span>
                                            {isEditing && <span className="text-primary text-[10px]">Editing Mode Active</span>}
                                        </div>
                                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-zinc-600 uppercase font-black">Tagline</label>
                                                {isEditing ? (
                                                    <input 
                                                        className="w-full bg-black border border-zinc-700 p-2 text-white font-bold focus:border-primary outline-none transition-all"
                                                        value={editData?.hero.tagline || ""}
                                                        onChange={e => setEditData(prev => prev ? {...prev, hero: {...prev.hero, tagline: e.target.value}} : null)}
                                                    />
                                                ) : (
                                                    <div className="font-bold text-white text-lg">{portfolio?.hero.tagline}</div>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-zinc-600 uppercase font-black">About Narrative</label>
                                                {isEditing ? (
                                                    <textarea 
                                                        rows={3}
                                                        className="w-full bg-black border border-zinc-700 p-2 text-zinc-300 focus:border-primary outline-none transition-all resize-none"
                                                        value={editData?.hero.about || ""}
                                                        onChange={e => setEditData(prev => prev ? {...prev, hero: {...prev.hero, about: e.target.value}} : null)}
                                                    />
                                                ) : (
                                                    <div className="text-zinc-400 leading-relaxed text-sm">{portfolio?.hero.about}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* PROJECTS SECTION */}
                                    <div className="space-y-4">
                                        <div className="text-zinc-500 uppercase tracking-widest text-xs">Architectural Projects</div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {(isEditing ? editData : portfolio)!.projects.map((p: Project, i: number) => (
                                                <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 space-y-4 group">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-zinc-600 uppercase font-black">Project Title</label>
                                                        {isEditing ? (
                                                            <input 
                                                                className="w-full bg-black border border-zinc-700 p-2 text-white font-bold focus:border-primary outline-none"
                                                                value={p.title}
                                                                onChange={e => updateProject(i, 'title', e.target.value)}
                                                            />
                                                        ) : (
                                                            <div className="font-bold text-white">{p.title}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] text-zinc-600 uppercase font-black">Description</label>
                                                        {isEditing ? (
                                                            <textarea 
                                                                rows={3}
                                                                className="w-full bg-black border border-zinc-700 p-2 text-zinc-400 text-xs outline-none resize-none"
                                                                value={p.description}
                                                                onChange={e => updateProject(i, 'description', e.target.value)}
                                                            />
                                                        ) : (
                                                            <div className="text-xs text-zinc-400 leading-relaxed">{p.description}</div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-zinc-600 uppercase font-black">Tech Stack (comma separated)</label>
                                                        {isEditing ? (
                                                            <input 
                                                                className="w-full bg-black border border-zinc-700 p-2 text-[10px] text-primary"
                                                                value={p.techStacks.join(", ")}
                                                                onChange={e => updateProject(i, 'techStacks', e.target.value.split(",").map(t => t.trim()))}
                                                            />
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2">
                                                                {p.techStacks.map((tech: string) => (
                                                                    <span key={tech} className="px-2 py-0.5 bg-zinc-800 text-[9px] text-zinc-500 uppercase font-black">
                                                                        {tech}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SKILLS SECTION */}
                                    <div className="space-y-4">
                                        <div className="text-zinc-500 uppercase tracking-widest text-xs">Core Skillset</div>
                                        <div className="p-6 bg-zinc-900/50 border border-zinc-800">
                                            {isEditing ? (
                                                <textarea 
                                                    rows={2}
                                                    className="w-full bg-black border border-zinc-700 p-2 text-primary focus:border-primary outline-none transition-all resize-none"
                                                    value={editData?.skills.join(", ") || ""}
                                                    onChange={e => setEditData(prev => prev ? {...prev, skills: e.target.value.split(",").map(s => s.trim())} : null)}
                                                    placeholder="Enter skills separated by commas..."
                                                />
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {portfolio?.skills.map((skill: string) => (
                                                        <span key={skill} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase italic">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </PremiumCard>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { generateReadmeAction } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { FileText, Copy, Download, Loader2 } from "lucide-react";

export default function ReadmeGeneratorPage() {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [readme, setReadme] = useState("");

    async function handleGenerate() {
        const parts = input.trim().replace(/^https?:\/\/github\.com\//, "").split("/");
        if (parts.length < 2) { toast.error("Enter a valid GitHub URL or owner/repo format"); return; }
        const [owner, repo] = parts;
        setLoading(true); setReadme("");
        const result = await generateReadmeAction(owner, repo);
        setLoading(false);
        if (result.error) toast.error(result.error);
        else setReadme(result.readme || "");
    }

    function handleCopy() {
        navigator.clipboard.writeText(readme);
        toast.success("README copied to clipboard!");
    }

    function handleDownload() {
        const blob = new Blob([readme], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "README.md"; a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-4xl mx-auto pb-24">
            <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-tighter text-white">README Generator</h1>
                <p className="text-xl text-zinc-500 italic">AI-crafted, stunning README.md from your repo in seconds.</p>
            </div>

            <PremiumCard glowColor="primary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-black tracking-tight">Target Repository</h3>
                    </div>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="github.com/owner/repo  or  owner/repo"
                        className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-zinc-600 font-mono text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !input.trim()}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating README...</> : "Generate README.md"}
                    </button>
                </div>
            </PremiumCard>

            {readme && (
                <PremiumCard glowColor="secondary">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black tracking-tight text-white">Generated README</h3>
                            <div className="flex gap-3">
                                <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-300 hover:bg-white/10 transition-all">
                                    <Copy className="w-4 h-4" /> Copy
                                </button>
                                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-all">
                                    <Download className="w-4 h-4" /> Download .md
                                </button>
                            </div>
                        </div>
                        <pre className="text-xs text-zinc-300 font-mono bg-black/40 rounded-2xl p-6 overflow-auto max-h-[600px] whitespace-pre-wrap border border-white/5 leading-relaxed">
                            {readme}
                        </pre>
                    </div>
                </PremiumCard>
            )}
        </div>
    );
}

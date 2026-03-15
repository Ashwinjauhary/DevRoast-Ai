"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Share2, Download, Check, Loader2 } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ShareRoastProps {
    data: {
        username: string;
        score: number;
        label: string;
        avatarUrl?: string;
        type: "profile" | "repo";
        name?: string;
    };
}

export function ShareRoast({ data }: ShareRoastProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        
        try {
            // Give time for images to load if any
            await new Promise(r => setTimeout(r, 500));
            
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                quality: 1,
                pixelRatio: 2,
            });
            
            const link = document.createElement('a');
            link.download = `devroast-${data.username || data.name}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            
            setIsDone(true);
            setTimeout(() => setIsDone(false), 3000);
        } catch (err) {
            console.error("Failed to generate image:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* The actual card that will be screenshotted (hidden from view or positioned off-screen) */}
            <div className="fixed left-[-9999px] top-[-9999px]">
                <div 
                    ref={cardRef}
                    className="w-[600px] h-[400px] bg-black p-10 flex flex-col justify-between relative overflow-hidden"
                    style={{ fontFamily: "var(--font-sans)" }}
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-6 h-6"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
                                </div>
                                <span className="font-black text-2xl tracking-tighter text-white">DevRoast<span className="text-secondary">.ai</span></span>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-8">
                                {data.avatarUrl ? (
                                    <img src={data.avatarUrl} alt={data.username} className="w-16 h-16 rounded-full border-2 border-primary/50" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-black text-white border-2 border-white/10 uppercase">
                                        {data.username?.charAt(0) || data.name?.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-2xl font-black text-white">{data.name || data.username}</h3>
                                    <p className="text-primary font-bold tracking-widest text-xs uppercase opacity-70">@{data.username}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="text-[80px] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                                {data.score.toFixed(1)}
                            </div>
                            <div className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mt-2">Dev Score / 10</div>
                        </div>
                    </div>

                    <div className="relative z-10 pb-4">
                        <p className="text-2xl font-black italic text-zinc-500 tracking-tight leading-tight">
                            "{data.label}"
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                            {data.type === "profile" ? "GitHub Profile Audit" : "Repository Roast"} • {new Date().toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">devroast-ai.vercel.app</span>
                    </div>

                    {/* Watermark Logo */}
                    <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none transform -rotate-12 translate-y-4">
                        <span className="text-[120px] font-black tracking-tighter">DEVR<span className="text-secondary">OAST</span></span>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                        <div className="w-[400px] h-[400px] border border-white/5 rounded-full" />
                    </div>
                </div>
            </div>

            <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="group relative flex items-center gap-3 px-8 py-4 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
            >
                <AnimatePresence mode="wait">
                    {isGenerating ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </motion.div>
                    ) : isDone ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Check className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="icon"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Share2 className="w-5 h-5 group-hover:text-primary transition-colors" />
                        </motion.div>
                    )}
                </AnimatePresence>
                <span className="font-black uppercase tracking-widest text-xs">
                    {isGenerating ? "Generating..." : isDone ? "Downloaded!" : "Share My Roast"}
                </span>
            </button>
        </div>
    );
}

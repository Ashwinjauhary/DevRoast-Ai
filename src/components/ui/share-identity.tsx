"use client";

import { toast } from "react-hot-toast";
import { Github, Loader2, Linkedin, Check, Copy } from "lucide-react";
import { useState } from "react";
import { generateLinkedInCaption } from "@/app/dashboard/portfolio/actions";

interface ShareIdentityProps {
    username: string;
    template: string;
    roast?: string;
    score?: number;
}

export function ShareIdentity({ username, template, roast, score }: ShareIdentityProps) {
    const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
    const [isCaptionReady, setIsCaptionReady] = useState(false);
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    const handleLinkedInShare = async () => {
        if (!roast || !score) {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
            return;
        }

        setIsGeneratingCaption(true);
        try {
            const res = await generateLinkedInCaption(username, roast, score);
            if (res.success && res.caption) {
                await navigator.clipboard.writeText(res.caption);
                toast.success('AI Caption copied! Open LinkedIn to post.');
                setIsCaptionReady(true);
                setTimeout(() => {
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
                    setIsCaptionReady(false);
                }, 1500);
            } else {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
            }
        } catch (err) {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
        } finally {
            setIsGeneratingCaption(false);
        }
    };

    return (
        <section className="pt-24 border-t border-white/5">
            <div className={`p-12 rounded-[2.5rem] relative overflow-hidden transition-all ${
                template === 'neon' ? 'bg-primary/5 border border-primary/20' : 
                template === 'hacker' ? 'bg-emerald-500/5 border border-emerald-500/20' :
                template === 'blueprint' ? 'bg-blue-500/5 border border-blue-500/20' :
                template === 'minimalist' ? 'bg-zinc-100 border border-zinc-200' :
                'bg-white/5 border border-white/10'
            }`}>
                <div className="max-w-xl mx-auto text-center space-y-8 relative z-10">
                    <h3 className={`text-3xl font-black uppercase tracking-tighter italic ${
                        template === 'hacker' ? 'text-emerald-500' : 
                        template === 'blueprint' ? 'text-blue-400' : 
                        template === 'minimalist' ? 'text-zinc-900' : 'text-white'
                    }`}>
                        Share Your Identity
                    </h3>
                    <p className={`text-sm leading-relaxed ${
                        template === 'minimalist' ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                        Your developer DNA is unique. Let the world see your AI-processed architecture and career archetypes.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <button 
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 ${
                                template === 'hacker' ? 'bg-emerald-500 text-black' : 
                                template === 'blueprint' ? 'bg-blue-500 text-white' : 
                                template === 'minimalist' ? 'bg-zinc-900 text-white' : 'bg-white text-black'
                            }`}
                        >
                            <Copy className="w-4 h-4" />
                            Copy Portfolio Link
                        </button>
                        <div className="flex gap-4">
                            <a 
                                href={`https://github.com/${username}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                                    template === 'minimalist' ? 'border-zinc-200 hover:bg-zinc-50' : 'border-white/10 hover:bg-white/5'
                                }`}
                                title="View GitHub Profile"
                            >
                                <Github className={`w-5 h-5 ${template === 'minimalist' ? 'text-zinc-900' : 'text-white'}`} />
                            </a>
                            <button 
                                onClick={handleLinkedInShare}
                                disabled={isGeneratingCaption}
                                className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors disabled:opacity-50 ${
                                    template === 'minimalist' ? 'border-zinc-200 hover:bg-zinc-50' : 'border-white/10 hover:bg-white/5'
                                }`}
                                title="Share Roast to LinkedIn"
                            >
                                {isGeneratingCaption ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                ) : isCaptionReady ? (
                                    <Check className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <Linkedin className={`w-5 h-5 ${template === 'minimalist' ? 'text-zinc-900' : 'text-white'}`} />
                                )}
                            </button>
                        </div>
                    </div>
                    {roast && (
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 opacity-50">
                            * Clicking LinkedIn will generate an AI caption and copy it to your clipboard
                        </p>
                    )}
                </div>
                <div className={`absolute top-0 left-0 w-full h-1 opacity-20 ${
                    template === 'hacker' ? 'bg-emerald-500' : 
                    template === 'blueprint' ? 'bg-blue-500' : 'bg-primary'
                }`} />
            </div>
        </section>
    );
}

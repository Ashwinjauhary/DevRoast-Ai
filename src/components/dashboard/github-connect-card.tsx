"use client";

import { signIn } from "next-auth/react";
import { Github, Zap, Github as GithubIcon } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function GitHubConnectCard() {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            await signIn("github", { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error("Failed to connect GitHub:", error);
            setLoading(false);
        }
    };

    return (
        <PremiumCard glowColor="secondary" className="h-full bg-linear-to-br from-zinc-900/50 to-black/50 border-zinc-800/50">
            <div className="flex flex-col h-full space-y-6">
                <div className="flex items-center justify-between">
                    <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
                        <GithubIcon className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-[10px] font-black uppercase tracking-widest">
                        <Zap className="w-3 h-3" />
                        Action Required
                    </div>
                </div>

                <div className="space-y-3 flex-1">
                    <h3 className="text-2xl font-black tracking-tighter text-white">Connect Technical DNA</h3>
                    <p className="text-sm text-zinc-400 font-light leading-relaxed">
                        Your neural suite is currently limited. Connect your GitHub account to unlock full repository analysis, automated README generation, and architectural auto-fixes.
                    </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <Button 
                        onClick={handleConnect}
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-zinc-200 h-12 font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <Github className="w-4 h-4" />
                                Link GitHub Account
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </PremiumCard>
    );
}

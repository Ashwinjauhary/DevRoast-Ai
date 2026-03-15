"use client";

import { useState, useTransition } from "react";
import { updateNotificationPrefs } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Bell, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const PREF_LABELS: Record<string, { label: string; desc: string }> = {
    analysisComplete: {
        label: "Analysis Complete",
        desc: "Get notified when a codebase roast finishes processing.",
    },
    weeklyDigest: {
        label: "Weekly Score Digest",
        desc: "Receive a weekly summary of your developer score progress.",
    },
    portfolioViewed: {
        label: "Portfolio Views",
        desc: "Know when someone opens your AI-generated portfolio.",
    },
    aiMentorTips: {
        label: "AI Mentor Tips",
        desc: "Daily improvement suggestions tailored to your skill gaps.",
    },
};

interface NotificationsClientProps {
    prefs: Record<string, boolean>;
}

export default function NotificationsClient({ prefs }: NotificationsClientProps) {
    const [values, setValues] = useState<Record<string, boolean>>(prefs);
    const [result, setResult] = useState<{ success?: string; error?: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const toggle = (key: string) => {
        setValues((prev) => ({ ...prev, [key]: !prev[key] }));
        setResult(null);
    };

    const handleSave = () => {
        startTransition(async () => {
            const res = await updateNotificationPrefs(values);
            setResult(res);
        });
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-3xl mx-auto pb-24">
            <div className="space-y-4">
                <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500">
                        <Bell className="w-8 h-8" />
                    </div>
                    <AnimatedText text="Notifications" className="text-5xl font-black tracking-tighter text-white" />
                </div>
                <p className="text-xl text-zinc-500 font-light">Configure how and when you want to be interrogated.</p>
            </div>

            <PremiumCard glowColor="accent">
                <div className="space-y-8">
                    {Object.entries(PREF_LABELS).map(([key, { label, desc }]) => (
                        <div key={key} className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="font-black text-white">{label}</p>
                                <p className="text-sm text-zinc-500 font-medium">{desc}</p>
                            </div>
                            <button
                                onClick={() => toggle(key)}
                                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${values[key] ? "bg-primary" : "bg-zinc-700"}`}
                            >
                                <motion.span
                                    layout
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-md`}
                                    style={{ x: values[key] ? 22 : 4 }}
                                />
                            </button>
                        </div>
                    ))}

                    <div className="pt-6 border-t border-white/5 space-y-4">
                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold border ${result.success
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                        : "bg-red-500/10 border-red-500/20 text-red-400"
                                        }`}
                                >
                                    {result.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {result.success || result.error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Button
                            onClick={handleSave}
                            disabled={isPending}
                            className="bg-white text-black hover:bg-zinc-200 font-black tracking-tight rounded-2xl px-8"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Preferences"}
                        </Button>
                    </div>
                </div>
            </PremiumCard>
        </div>
    );
}

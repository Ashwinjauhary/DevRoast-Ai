"use client";

import { useState, useTransition } from "react";
import { updateName, updatePassword } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Shield, User, Lock, Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function StatusBanner({ result }: { result: { success?: string; error?: string } | null }) {
    if (!result) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-bold border ${result.success
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
            >
                {result.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                {result.success || result.error}
            </motion.div>
        </AnimatePresence>
    );
}

interface SecurityClientProps {
    userName: string | null;
    hasPassword: boolean;
}

export default function SecurityClient({ userName, hasPassword }: SecurityClientProps) {
    const [nameResult, setNameResult] = useState<{ success?: string; error?: string } | null>(null);
    const [passResult, setPassResult] = useState<{ success?: string; error?: string } | null>(null);
    const [isPendingName, startNameTransition] = useTransition();
    const [isPendingPass, startPassTransition] = useTransition();

    const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startNameTransition(async () => {
            const res = await updateName(formData);
            setNameResult(res);
        });
    };

    const handlePassSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startPassTransition(async () => {
            const res = await updatePassword(formData);
            setPassResult(res);
            if (res.success) (e.target as HTMLFormElement).reset();
        });
    };

    const inputClass = "w-full bg-black/40 border border-white/5 rounded-2xl py-3 px-4 text-base font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 glass-darker text-zinc-200";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-3xl mx-auto pb-24">
            <div className="space-y-4">
                <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500">
                        <Shield className="w-8 h-8" />
                    </div>
                    <AnimatedText text="Security & Access" className="text-5xl font-black tracking-tighter text-white" />
                </div>
                <p className="text-xl text-zinc-500 font-light">Manage your identity and authentication credentials.</p>
            </div>

            {/* Display Name */}
            <PremiumCard glowColor="primary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-black tracking-tight">Display Name</h2>
                    </div>
                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <input
                            name="name"
                            type="text"
                            defaultValue={userName || ""}
                            placeholder="Your display name"
                            className={inputClass}
                        />
                        <StatusBanner result={nameResult} />
                        <Button
                            type="submit"
                            disabled={isPendingName}
                            className="bg-white text-black hover:bg-zinc-200 font-black tracking-tight rounded-2xl px-8"
                        >
                            {isPendingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Name"}
                        </Button>
                    </form>
                </div>
            </PremiumCard>

            {/* Change Password */}
            <PremiumCard glowColor="secondary">
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-secondary" />
                        <h2 className="text-xl font-black tracking-tight">Change Password</h2>
                    </div>
                    {!hasPassword && (
                        <div className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium border bg-blue-500/5 border-blue-500/20 text-blue-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            Your account uses GitHub/Google OAuth — no password is set. Fill in the form below to set one.
                        </div>
                    )}
                    <form onSubmit={handlePassSubmit} className="space-y-4">
                        {hasPassword && (
                            <input
                                name="currentPassword"
                                type="password"
                                placeholder="Current password"
                                className={inputClass}
                                required
                            />
                        )}
                        <input
                            name="newPassword"
                            type="password"
                            placeholder="New password (min 8 chars)"
                            className={inputClass}
                            required
                        />
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className={inputClass}
                            required
                        />
                        <StatusBanner result={passResult} />
                        <Button
                            type="submit"
                            disabled={isPendingPass}
                            className="bg-white text-black hover:bg-zinc-200 font-black tracking-tight rounded-2xl px-8"
                        >
                            {isPendingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                        </Button>
                    </form>
                </div>
            </PremiumCard>
        </div>
    );
}

"use client";

import { useState, useTransition } from "react";
import { createApiKey, deleteApiKey } from "./actions";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Key, Loader2, CheckCircle2, AlertCircle, Copy, Trash2, Plus, ArrowLeft, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ApiKeyEntry {
    id: string;
    name: string;
    prefix: string;
    created_at: Date;
}

interface ApiKeyClientProps {
    keys: ApiKeyEntry[];
}

export default function ApiKeyClient({ keys: initialKeys }: ApiKeyClientProps) {
    const [keys, setKeys] = useState<ApiKeyEntry[]>(initialKeys);
    const [newKeyName, setNewKeyName] = useState("");
    const [createdToken, setCreatedToken] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleCreate = () => {
        if (!newKeyName.trim()) return;
        setError(null);
        startTransition(async () => {
            const res = await createApiKey(newKeyName);
            if (res.error) {
                setError(res.error);
            } else if (res.token) {
                setCreatedToken(res.token);
                setNewKeyName("");
                // Add new key to local list
                setKeys(prev => [...prev, {
                    id: crypto.randomUUID(),
                    name: newKeyName,
                    prefix: res.prefix!,
                    created_at: new Date()
                }]);
            }
        });
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
        startTransition(async () => {
            const res = await deleteApiKey(id);
            if (res.success) {
                setKeys(prev => prev.filter(k => k.id !== id));
            } else {
                setError(res.error || "Failed to delete key.");
            }
            setDeletingId(null);
        });
    };

    const copyToken = () => {
        if (!createdToken) return;
        navigator.clipboard.writeText(createdToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-3xl mx-auto pb-24">
            <div className="space-y-4">
                <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-4">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500">
                        <Key className="w-8 h-8" />
                    </div>
                    <AnimatedText text="API Keys" className="text-5xl font-black tracking-tighter text-white" />
                </div>
                <p className="text-xl text-zinc-500 font-light">Create personal tokens for external integrations. Max 5 keys.</p>
            </div>

            {/* One-time token reveal */}
            <AnimatePresence>
                {createdToken && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-4"
                    >
                        <div className="flex items-center gap-3">
                            <Eye className="w-5 h-5 text-emerald-400" />
                            <p className="font-black text-emerald-400 uppercase tracking-widest text-xs">Copy Now — This Key Will Not Be Shown Again</p>
                        </div>
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-sm text-zinc-300 break-all">
                            <span className="flex-1">{createdToken}</span>
                            <button onClick={copyToken} className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
                                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <Button variant="ghost" onClick={() => setCreatedToken(null)} className="text-zinc-500 hover:text-white text-xs font-bold">
                            I have saved my key, dismiss
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create New Key */}
            <PremiumCard glowColor="primary">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Plus className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-black tracking-tight">Create New Key</h2>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            placeholder="Key name (e.g. CI/CD Pipeline)"
                            className="flex-1 bg-black/40 border border-white/5 rounded-2xl py-3 px-4 text-base font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-zinc-700 glass-darker text-zinc-200"
                        />
                        <Button
                            onClick={handleCreate}
                            disabled={isPending || !newKeyName.trim()}
                            className="bg-white text-black hover:bg-zinc-200 font-black rounded-2xl px-6 shrink-0"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                        </Button>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-400 font-bold">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                </div>
            </PremiumCard>

            {/* Existing Keys */}
            <div className="space-y-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">Active Keys ({keys.length}/5)</h2>
                {keys.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-white/10 rounded-3xl text-zinc-600 font-medium italic">
                        No keys yet. Generate one above.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {keys.map((key) => (
                            <PremiumCard key={key.id} glowColor="none" className="py-4 px-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-1 min-w-0">
                                        <p className="font-black text-white truncate">{key.name}</p>
                                        <p className="font-mono text-xs text-zinc-500">{key.prefix}••••••••••••••••••••••••••••••</p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hidden sm:block">
                                            {new Date(key.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                        <button
                                            onClick={() => handleDelete(key.id)}
                                            disabled={deletingId === key.id}
                                            className="p-2 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            {deletingId === key.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </PremiumCard>
                        ))}
                    </div>
                )}
            </div>

            {/* Usage Instructions */}
            <PremiumCard glowColor="none" className="border-blue-500/10">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-white mb-1">How to Use</h2>
                        <p className="text-sm text-zinc-500 font-medium">Pass your key as a <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded-md border border-white/10 text-zinc-300">Authorization</span> header in any API call.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 border-t border-white/5">
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Why to Use</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs text-zinc-400">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <span>Automate code quality analysis in your delivery pipeline.</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs text-zinc-400">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <span>Integrate DevRoast metrics into custom internal tools.</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs text-zinc-400">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <span>Secure machine-to-machine communication without a browser.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Where to Use</h3>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs text-zinc-400">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <span>CI/CD Pipelines (GitHub Actions, GitLab CI, Jenkins).</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs text-zinc-400">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <span>Local Git hooks and automated developer scripts.</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs text-zinc-400">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <span>External reporting dashboards and quality portals.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Implementation Examples</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Roast a Repository</p>
                        <pre className="bg-black/60 border border-white/5 rounded-2xl p-5 text-xs font-mono text-zinc-400 overflow-x-auto leading-relaxed">
{`curl -X POST https://your-domain.com/api/analyze/engine-repo \\
  -H "Authorization: Bearer drk_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"owner": "torvalds", "repo": "linux"}'`}
                        </pre>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Roast a GitHub Profile</p>
                        <pre className="bg-black/60 border border-white/5 rounded-2xl p-5 text-xs font-mono text-zinc-400 overflow-x-auto leading-relaxed">
{`curl -X POST https://your-domain.com/api/analyze/engine-profile \\
  -H "Authorization: Bearer drk_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"username": "octocat", "metrics": {...}}'`}
                        </pre>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                        <div className="flex items-start gap-3 text-sm text-zinc-500">
                            <span className="text-blue-400 font-black mt-0.5">•</span>
                            Keys start with <span className="font-mono text-zinc-300 mx-1">drk_</span> and are shown <span className="font-bold text-white mx-1">only once</span> at creation.
                        </div>
                        <div className="flex items-start gap-3 text-sm text-zinc-500">
                            <span className="text-blue-400 font-black mt-0.5">•</span>
                            Results are automatically saved to your Analysis History.
                        </div>
                        <div className="flex items-start gap-3 text-sm text-zinc-500">
                            <span className="text-blue-400 font-black mt-0.5">•</span>
                            Maximum <span className="font-bold text-white mx-1">5 keys</span> per account. Delete unused keys regularly.
                        </div>
                    </div>
                </div>
            </PremiumCard>
        </div>
    );
}


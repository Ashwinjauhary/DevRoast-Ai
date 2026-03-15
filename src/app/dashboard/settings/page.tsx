import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Shield, Bell, Key, ArrowRight, Github, Mail, Calendar, BarChart2, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteAccountButton } from "./delete-account-button";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            accounts: { select: { provider: true } },
            _count: { select: { analyses: true, chats: true, portfolios: true } }
        }
    });

    const settingsOptions = [
        {
            title: "Security & Access",
            description: "Update your display name and change your password.",
            icon: Shield,
            classNames: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
            href: "/dashboard/settings/security"
        },
        {
            title: "Notification Preferences",
            description: "Configure how and when you want to be insulted.",
            icon: Bell,
            classNames: "bg-orange-500/10 border-orange-500/20 text-orange-500",
            href: "/dashboard/settings/notifications"
        },
        {
            title: "Developer API Keys",
            description: "Manage your Personal Access Tokens for external integrations.",
            icon: Key,
            classNames: "bg-blue-500/10 border-blue-500/20 text-blue-500",
            href: "/dashboard/settings/api-keys"
        }
    ];

    const providers = user?.accounts.map(a => a.provider) ?? [];
    const joinDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : "Unknown";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-5xl mx-auto pb-24">
            <div className="space-y-4">
                <AnimatedText text="System Preferences" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 font-light italic">Configure your parameters before the AI overrides them.</p>
            </div>

            {/* Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {settingsOptions.map((opt, i) => (
                    <Link key={i} href={opt.href} className="group block">
                        <PremiumCard glowColor="none" className="h-full group-hover:bg-white/[0.04] transition-colors">
                            <div className="space-y-6 flex flex-col h-full">
                                <div className={`p-4 rounded-2xl border w-fit ${opt.classNames}`}>
                                    <opt.icon className="w-8 h-8" />
                                </div>

                                <div className="space-y-2 flex-1">
                                    <h3 className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors">{opt.title}</h3>
                                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">{opt.description}</p>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase text-zinc-500 group-hover:text-white transition-colors">
                                        Configure <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </PremiumCard>
                    </Link>
                ))}
            </div>

            {/* Account Overview */}
            <PremiumCard glowColor="none">
                <div className="space-y-6">
                    <h2 className="text-xl font-black tracking-tight text-white">Account Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Email</p>
                                <p className="text-sm font-bold text-zinc-300 truncate">{user?.email ?? "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <Github className="w-4 h-4 text-zinc-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Auth Provider</p>
                                <p className="text-sm font-bold text-zinc-300 capitalize">{providers.length > 0 ? providers.join(", ") : "Credentials"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Member Since</p>
                                <p className="text-sm font-bold text-zinc-300">{joinDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <BarChart2 className="w-4 h-4 text-zinc-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Analyses Run</p>
                                <p className="text-sm font-bold text-zinc-300">{user?._count.analyses ?? 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </PremiumCard>

            {/* Danger Zone */}
            <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.03] p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-xl font-black tracking-tight text-red-400">Danger Zone</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <div>
                        <p className="font-black text-white">Delete Account</p>
                        <p className="text-sm text-zinc-500 font-medium mt-0.5">Permanently delete your account and all associated data. This cannot be undone.</p>
                    </div>
                    <DeleteAccountButton />
                </div>
            </div>
        </div>
    );
}

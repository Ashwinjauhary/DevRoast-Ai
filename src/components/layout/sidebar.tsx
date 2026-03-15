"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, User, Github, GitBranch, Star, MessageSquareDiff,
    History, Settings, LogOut, Library, Briefcase, Trophy, TrendingUp,
    FileText, GitCommit, Scale, Cpu, Building2, Shield, Map, Save,
    GitMerge, Code2, Brain, ExternalLink, ScrollText, BookOpen, Crown,
    Swords, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/dashboard/handle-sign-out";
import { motion } from "framer-motion";

const ROUTE_GROUPS = [
    {
        label: "Overview",
        routes: [
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/dashboard/profile", label: "Profile", icon: User },
        ],
    },
    {
        label: "MVP Features",
        routes: [
            { href: "/dashboard/github-analysis", label: "GitHub Analysis", icon: Github },
            { href: "/dashboard/repo-analysis", label: "Repo Analysis", icon: GitBranch },
            { href: "/dashboard/portfolio", label: "AI Portfolio", icon: Briefcase },
            { href: "/dashboard/resume-enhancer", label: "Resume Enhancer", icon: ScrollText },
            { href: "/dashboard/code-review", label: "Code Review Bot", icon: Code2 },
        ],
    },
    {
        label: "Core Engagement",
        routes: [
            { href: "/dashboard/repositories", label: "Repositories", icon: Library },
            { href: "/dashboard/dev-duels", label: "Dev Duels", icon: Swords },
            { href: "/dashboard/badges", label: "Achievements", icon: Trophy },
        ],
    },
    {
        label: "Advanced Analysis",
        routes: [
            { href: "/dashboard/org-analysis", label: "Org Dashboard", icon: Building2 },
            { href: "/dashboard/developer-score", label: "Developer Score", icon: Star },
            { href: "/dashboard/leaderboard", label: "Global Leaderboard", icon: Crown },
            { href: "/dashboard/score-history", label: "Score History", icon: TrendingUp },
            { href: "/dashboard/language-map", label: "Language Map", icon: Map },
        ],
    },
    {
        label: "AI Developer Suite",
        routes: [
            { href: "/dashboard/ai-mentor", label: "AI Mentor Chat", icon: MessageSquareDiff },
            { href: "/dashboard/readme-generator", label: "README Generator", icon: FileText },
            { href: "/dashboard/commit-auditor", label: "Commit Auditor", icon: GitCommit },
            { href: "/dashboard/diff-explainer", label: "Diff Explainer", icon: GitMerge },
            { href: "/dashboard/branch-namer", label: "Branch Namer", icon: GitBranch },
            { href: "/dashboard/stack-recommender", label: "Stack Recommender", icon: Cpu },
        ],
    },
    {
        label: "Career & Growth",
        routes: [
            { href: "/dashboard/job-match", label: "Job Match", icon: Target },
            { href: "/dashboard/interview-prep", label: "Interview Prep", icon: Brain },
            { href: "/dashboard/oss-recommender", label: "OSS Recommender", icon: ExternalLink },
        ],
    },
    {
        label: "Security & Quality",
        routes: [
            { href: "/dashboard/license-checker", label: "License Checker", icon: Scale },
            { href: "/dashboard/dependency-monitor", label: "Dependency Monitor", icon: Shield },
        ],
    },
    {
        label: "System Library",
        routes: [
            { href: "/dashboard/library", label: "Neural Library", icon: BookOpen },
            { href: "/dashboard/history", label: "History", icon: History },
        ],
    },
    {
        label: "Account Settings",
        routes: [
            { href: "/dashboard/settings", label: "Settings", icon: Settings },
        ],
    },
];

interface SidebarProps {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen?.(false)}
            />

            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-[#050505] border-r border-white/5 flex flex-col text-zinc-400 transform transition-transform duration-300 lg:relative lg:translate-x-0 font-sans",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="p-8 pb-4 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-primary/20">
                            <Image
                                src="/logo.png"
                                alt="DevRoast Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-white">DevRoast<span className="text-secondary">.ai</span></span>
                    </div>
                </div>

                {/* Scrollable nav */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6 scrollbar-hide">
                    {ROUTE_GROUPS.map((group) => (
                        <div key={group.label}>
                            <p className="px-4 mb-2 text-[9px] font-black text-zinc-700 uppercase tracking-widest">{group.label}</p>
                            <nav className="flex flex-col gap-0.5">
                                {group.routes.map((route) => {
                                    const Icon = route.icon;
                                    const isActive = pathname === route.href;
                                    return (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            onClick={() => setIsOpen?.(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                                                isActive
                                                    ? "text-white bg-white/5 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                                                    : "hover:text-white hover:bg-white/[0.02]"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                                                />
                                            )}
                                            <Icon className={cn("w-4 h-4 transition-colors duration-300 shrink-0", isActive ? "text-primary" : "text-zinc-600 group-hover:text-primary")} />
                                            <span className="truncate">{route.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Sign out */}
                <div className="shrink-0 p-6 pt-4 border-t border-white/5">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-zinc-500 hover:text-white hover:bg-white/[0.03] px-4 py-5 rounded-xl transition-all"
                        onClick={async () => {
                            try {
                                await handleSignOut();
                            } catch (err) {
                                // Next.js redirects throw an error that should not be caught for redirection to work,
                                // but we provide a hard fallback to landing just in case.
                                window.location.href = "/";
                            }
                        }}
                    >
                        <LogOut className="w-4 h-4 mr-3 text-accent shrink-0" />
                        <span className="font-bold">Sign Out</span>
                    </Button>
                </div>
            </div>
        </>
    );
}

function Terminal(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    );
}

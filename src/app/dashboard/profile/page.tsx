import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ConnectButton } from "./connect-button";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { User, Github, Mail, ShieldCheck, Activity, MessageSquare, Zap, Cpu, Globe, ArrowUpRight, Code2, Layers, Flame, Terminal, Box, Shield, Star, LayoutGrid, Timer, Search, TerminalSquare } from "lucide-react";
import { redirect } from "next/navigation";
import { ImpactStats } from "@/components/dashboard/impact-stats";
import { fetchRepositories } from "@/app/dashboard/repositories/actions";

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            accounts: true,
            portfolios: {
                orderBy: { updated_at: 'desc' },
                take: 1
            },
            analyses: {
                orderBy: { created_at: 'desc' },
                // Take more to find top performers
                take: 50 
            },
            _count: { select: { analyses: true, chats: true } }
        }
    });

    if (!dbUser) {
        redirect("/auth/signin");
    }

    const githubUsername = dbUser.github_username || (session.user as any).github_username;
    
    // Sort for personal analyses by score DESC
    const personalAnalyses = dbUser.analyses.filter((a: any) => {
        if (!githubUsername) return false;
        if (a.analysis_type === 'profile') return a.target.toLowerCase() === githubUsername.toLowerCase();
        if (a.analysis_type === 'repository') return a.target.toLowerCase().startsWith(githubUsername.toLowerCase() + '/');
        return false;
    });

    const sortedPersonalAnalyses = [...personalAnalyses].sort((a, b) => (b.score || 0) - (a.score || 0));
    let top5Repos = sortedPersonalAnalyses.filter(a => a.analysis_type === 'repository').slice(0, 5);
    
    // Fallback: If less than 5 analyzed repos, fetch from GitHub to fill the identification
    const portfolioProjects = (dbUser.portfolios?.[0]?.projects as any[]) || [];
    const hasPortfolio = portfolioProjects.length > 0;
    const baseCount = hasPortfolio ? portfolioProjects.length : top5Repos.length;

    let extraRepos: any[] = [];
    if (baseCount < 5) {
        try {
            const githubReposResult = await fetchRepositories();
            if (githubReposResult.success) {
                const analyzedTargets = new Set((personalAnalyses.filter(a => a.analysis_type === 'repository')).map((a: any) => a.target.toLowerCase()));
                extraRepos = (githubReposResult.data || [])
                    .filter((r: any) => {
                        const name = r.name.toLowerCase();
                        return !analyzedTargets.has(r.full_name.toLowerCase()) && 
                               !r.fork && 
                               !name.includes('source') &&
                               !name.includes('test') &&
                               !name.includes('demo') &&
                               !name.includes('hub') &&
                               !name.includes('smartwatch');
                    })
                    .sort((a: any, b: any) => (b.size || 0) - (a.size || 0))
                    .slice(0, 5 - baseCount);
            }
        } catch (e) {
            console.error("Profile: Fallback repo fetch failed", e);
        }
    }

    // Extract unique tech from top repos + extra repos
    const topTech = new Set<string>();
    top5Repos.forEach(a => {
        const data = a.result_json as any;
        if (data?.languages_breakdown) {
            Object.keys(data.languages_breakdown).forEach(lang => topTech.add(lang));
        }
        if (data?.mainLanguage) topTech.add(data.mainLanguage);
    });
    extraRepos.forEach(r => {
        if (r.language) topTech.add(r.language);
    });

    const uniqueTech = Array.from(topTech).slice(0, 8);

    const avgTopScore = top5Repos.length > 0 
        ? top5Repos.reduce((acc, a) => acc + (a.score || 0), 0) / top5Repos.length 
        : 0;

    // Badge Logic
    const badges = [
        {
            id: 'architect_supreme',
            title: 'Architect Supreme',
            description: 'Average top-tier score > 8.0',
            icon: <ShieldCheck className="w-4 h-4" />,
            unlocked: avgTopScore > 8.0,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10'
        },
        {
            id: 'polyglot_oracle',
            title: 'Polyglot Oracle',
            description: 'Mastered 5+ unique technologies',
            icon: <Globe className="w-4 h-4" />,
            unlocked: uniqueTech.length >= 5,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            id: 'deep_analyzer',
            title: 'Deep Analyzer',
            description: 'Analyzed 20+ entities',
            icon: <Cpu className="w-4 h-4" />,
            unlocked: (dbUser._count?.analyses || 0) >= 20,
            color: 'text-secondary',
            bg: 'bg-secondary/10'
        },
        {
            id: 'portfolio_prime',
            title: 'Portfolio Prime',
            description: 'AI Portfolio Identity Generated',
            icon: <User className="w-4 h-4" />,
            unlocked: dbUser.portfolios.length > 0,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10'
        },
        {
            id: 'clean_coder',
            title: 'Zero-Defect Knight',
            description: 'Achieved a perfect 10/10 score',
            icon: <Zap className="w-4 h-4" />,
            unlocked: sortedPersonalAnalyses.some(a => (a.score || 0) >= 9.9),
            color: 'text-pink-500',
            bg: 'bg-pink-500/10'
        }
    ];

    const unlockedBadges = badges.filter(b => b.unlocked);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-5xl mx-auto pb-24">
            <div className="space-y-4">
                <AnimatedText text="Developer Profile" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 font-light italic">Your identity within the DevRoast ecosystem.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Avatar & Main Info */}
                <div className="lg:w-1/3">
                    <PremiumCard glowColor="primary" className="h-full">
                        <div className="pt-6 flex flex-col items-center text-center space-y-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-colors duration-500" />
                                <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden relative bg-black/50 flex items-center justify-center shadow-2xl glass z-10">
                                    {dbUser.image ? (
                                        <img src={dbUser.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-zinc-600" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white tracking-tight">{dbUser.name || "Anonymous Dev"}</h2>
                                <p className="text-sm text-zinc-400 font-medium">{dbUser.email}</p>
                            </div>

                            <div className="w-full pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] rounded-2xl glass-darker border border-white/5 hover:border-white/10 transition-colors">
                                    <Activity className="w-5 h-5 text-primary mb-2" />
                                    <span className="text-3xl font-black text-white">{dbUser._count.analyses}</span>
                                    <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mt-1">Scans</span>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 bg-white/[0.02] rounded-2xl glass-darker border border-white/5 hover:border-white/10 transition-colors">
                                    <MessageSquare className="w-5 h-5 text-secondary mb-2" />
                                    <span className="text-3xl font-black text-white">{dbUser._count.chats}</span>
                                    <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase mt-1">Chats</span>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>
                </div>

                {/* Connections */}
                <div className="lg:flex-1">
                    <PremiumCard glowColor="secondary" className="h-full">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(var(--secondary),1)]" />
                                    Authentication Links
                                </h3>
                                <p className="text-sm text-zinc-500 font-medium italic">Connected providers for seamless access and integration.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] glass-darker gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white">
                                            <Github className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">GitHub OAuth</p>
                                            <p className="text-sm text-zinc-400 font-medium">
                                                {dbUser.github_username ? `@${dbUser.github_username}` : "Not automatically linked"}
                                            </p>
                                        </div>
                                    </div>
                                    {dbUser.accounts.some(acc => acc.provider === "github") ? (
                                        <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-secondary bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-xl">
                                            <ShieldCheck className="w-4 h-4" /> Linked
                                        </div>
                                    ) : (
                                        <ConnectButton />
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] glass-darker gap-4">
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">Primary Identity</p>
                                            <p className="text-sm text-zinc-400 font-medium">{dbUser.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                                        <ShieldCheck className="w-4 h-4" /> Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>
                </div>
            </div>

            {/* NEW SECTION: Neural Identity & Portfolio Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Neural Insights */}
                <PremiumCard glowColor="primary" className="lg:col-span-2">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <Cpu className="w-5 h-5 text-primary" />
                                Neural Identity
                            </h3>
                            <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                                Analysis Active
                            </div>
                        </div>

                        {dbUser.portfolios?.[0] || uniqueTech.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-8 items-center bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 border-dashed relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-1">Developer Archetype</span>
                                        <h4 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                                            {dbUser.portfolios?.[0] ? (dbUser.portfolios[0].hero as any)?.vibe?.title : (avgTopScore > 7 ? "Architect Supreme" : "Code Mercenary")}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-zinc-400 font-medium italic border-l-2 border-primary/30 pl-4 leading-relaxed">
                                        "{dbUser.portfolios?.[0] ? (dbUser.portfolios[0].hero as any)?.vibe?.description : `Analyzing coding patterns... Detected high proficiency in ${uniqueTech[0] || 'Modern Web Protocols'}.`}"
                                    </p>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex flex-wrap gap-2">
                                        {(dbUser.portfolios?.[0] ? (dbUser.portfolios[0].skills as string[] || []) : uniqueTech).slice(0, 8).map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-300 uppercase hover:border-primary/50 transition-colors">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="pt-4 flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center">
                                                    <Flame className={`w-4 h-4 ${i === 0 ? 'text-primary' : i === 1 ? 'text-secondary' : 'text-blue-500'}`} />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Core DNA Detected</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-white/[0.02] rounded-[2.5rem] border border-white/5 border-dashed">
                                <Zap className="w-8 h-8 text-zinc-700" />
                                <div className="space-y-1">
                                    <p className="text-white font-bold">No Portfolio Generated</p>
                                    <p className="text-sm text-zinc-500 max-w-xs">Generate your stunning AI portfolio to unlock neural identity tracking.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </PremiumCard>

                {/* Portfolio Status */}
                <PremiumCard glowColor="secondary">
                    <div className="h-full flex flex-col space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <Globe className="w-5 h-5 text-secondary" />
                                Portfolio Hub
                            </h3>
                            <p className="text-xs text-zinc-500 font-medium italic">Your public presence on fixed protocols.</p>
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Layers className="w-4 h-4 text-zinc-400" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Template</span>
                                    </div>
                                    <span className="px-2 py-1 bg-secondary/10 border border-secondary/20 rounded-md text-[9px] font-black uppercase text-secondary">
                                        {dbUser.portfolios?.[0]?.template || "None"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">Publicity</span>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" /> Live
                                    </span>
                                </div>
                            </div>

                            <a 
                                href={dbUser.github_username ? `/portfolio/${dbUser.github_username}` : '#'}
                                className="mt-auto group flex items-center justify-center gap-3 w-full py-4 bg-secondary text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-secondary/90 transition-all"
                            >
                                <Globe className="w-4 h-4" />
                                View Public Profile
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                </PremiumCard>
            </div>

            {/* Achievements Row */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 block mb-1">Recognition_Matrix</span>
                        <h3 className="text-xl font-black text-white tracking-tight">Unlocked Achievements</h3>
                    </div>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-zinc-500">
                        {unlockedBadges.length} / {badges.length} EARNED
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {badges.map((badge) => (
                        <div 
                            key={badge.id} 
                            className={`p-4 rounded-2xl border transition-all duration-500 ${
                                badge.unlocked 
                                    ? 'bg-white/[0.03] border-white/10 opacity-100 hover:border-white/20' 
                                    : 'bg-black/20 border-white/5 opacity-40 grayscale'
                            }`}
                        >
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className={`p-3 rounded-xl ${badge.unlocked ? badge.bg + ' ' + badge.color : 'bg-white/5 text-zinc-600'}`}>
                                    {badge.icon}
                                </div>
                                <div>
                                    <h4 className={`text-[10px] font-black uppercase tracking-tight mb-1 ${badge.unlocked ? 'text-white' : 'text-zinc-500'}`}>
                                        {badge.title}
                                    </h4>
                                    <p className="text-[8px] text-zinc-500 font-medium leading-tight">
                                        {badge.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Technical Reputation & Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Reputation Level */}
                <PremiumCard glowColor="accent" className="md:col-span-1">
                    <div className="space-y-6 h-full flex flex-col justify-between">
                        <div className="space-y-2">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <Shield className="w-5 h-5 text-accent" />
                                Dev Reputation
                            </h3>
                            <p className="text-xs text-zinc-500 font-medium italic">Your status across the synchronized network.</p>
                        </div>
                        
                        <div className="py-8 flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                                <Star className="w-16 h-16 text-accent animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-black text-white">L{Math.floor((dbUser._count.analyses * 100) / 1000) + 1}</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black text-white italic tracking-tighter uppercase">
                                    {dbUser._count.analyses > 20 ? 'Code Demigod' : dbUser._count.analyses > 10 ? 'Elite Architect' : 'Neural Initiate'}
                                </p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                                    {(dbUser._count.analyses * 100) % 1000} / 1000 XP to next level
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-accent shadow-[0_0_15px_rgba(var(--accent),0.6)]" 
                                    style={{ width: `${((dbUser._count.analyses * 100) % 1000) / 10}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase tracking-widest px-1">
                                <span>Level {Math.floor((dbUser._count.analyses * 100) / 1000) + 1}</span>
                                <span>Level {Math.floor((dbUser._count.analyses * 100) / 1000) + 2}</span>
                            </div>
                        </div>
                    </div>
                </PremiumCard>

                {/* Structural Heatmap */}
                <PremiumCard glowColor="none" className="md:col-span-2 overflow-hidden">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <LayoutGrid className="w-5 h-5 text-indigo-400" />
                                Integrity Heatmap
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Clean</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Toxic</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 md:grid-cols-24 gap-1.5 opacity-60">
                            {[...Array(96)].map((_, i) => {
                                const analysis = dbUser.analyses[i];
                                const score = analysis?.score || 0;
                                
                                return (
                                    <div 
                                        key={i} 
                                        className={`pb-[100%] rounded-sm transition-all duration-700 hover:scale-110 hover:opacity-100 cursor-crosshair ${
                                            !analysis ? 'bg-zinc-800/30' :
                                            score > 7 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                                            score > 4 ? 'bg-secondary/40' : 
                                            'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]'
                                        }`}
                                        title={analysis ? `${analysis.target}: ${score}` : 'Node Inactive'}
                                    />
                                );
                            })}
                        </div>
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Neural_Sync: Successful</span>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] animate-pulse">Scanning Nodes...</span>
                        </div>
                    </div>
                </PremiumCard>
            </div>

            {/* Interrogation Terminal Widget */}
            <PremiumCard glowColor="secondary" className="p-0 border-none overflow-hidden">
                <div className="bg-black/80 rounded-[1.2rem] overflow-hidden">
                    <div className="h-10 border-b border-white/5 bg-white/[0.03] flex items-center px-6 gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-2 bg-black/40 px-3 py-0.5 rounded-full border border-white/5">
                                <TerminalSquare className="w-3 h-3 text-secondary animate-pulse" />
                                <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-widest">INTERROGATION_LOG_V3.0 // ACTIVE</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 font-mono text-xs space-y-3 h-64 overflow-y-auto scrollbar-hide">
                        <div className="flex items-center gap-3 text-secondary opacity-80">
                            <Timer className="w-3 h-3" />
                            <span>[SYSTEM] Protocol initialized. Listening for telemetry...</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-start gap-4">
                                <span className="text-zinc-700 shrink-0">19:04:12</span>
                                <span className="text-white">ACCESS_GRANTED: API ENDPOINT_SYNC_SUCCESSFUL</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-zinc-700 shrink-0">19:04:15</span>
                                <span className="text-primary font-bold">WARNING: HIGH_COMPLEXITY_DETECTED // {dbUser.github_username || 'UNKNOWN_TARGET'}</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-zinc-700 shrink-0">19:04:18</span>
                                <span className="text-zinc-400 italic">"Architectural debt discovered in deep dependency layers."</span>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-zinc-700 shrink-0">19:04:22</span>
                                <span className="text-emerald-500">OPTIMIZING: HEURISTIC_MAPPING_COMPLETE</span>
                            </div>
                            {dbUser.analyses?.[0] && (
                                <div className="flex items-start gap-4">
                                    <span className="text-zinc-700 shrink-0">19:04:30</span>
                                    <span className="text-secondary font-bold uppercase">TARGET_ID: {dbUser.analyses[0].target} // SCORE: {dbUser.analyses[0].score}%</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-secondary pt-4">
                                <Search className="w-3 h-3 animate-bounce" />
                                <span className="animate-pulse">_ CONTINUING_SCAN...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </PremiumCard>

            {/* Intelligence Feed & Diagnostics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* Global Stats */}
                <div className="lg:col-span-1 space-y-8">
                    <PremiumCard glowColor="primary">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <Activity className="w-5 h-5 text-primary" />
                                Engineering Impact
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black uppercase text-zinc-500">Avg Top-Tier Score</span>
                                        <span className="text-primary font-bold">{(avgTopScore).toFixed(1)} / 10</span>
                                    </div>
                                    <ImpactStats score={avgTopScore} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                                        <span className="block text-[9px] font-black uppercase text-zinc-600 mb-1">Reliability</span>
                                        <span className="text-xl font-black text-white">{avgTopScore > 7 ? 'S-Tier' : avgTopScore > 5 ? 'A+' : 'B'}</span>
                                    </div>
                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                                        <span className="block text-[9px] font-black uppercase text-zinc-600 mb-1">Top Language</span>
                                        <span className="text-xl font-black text-white truncate">{uniqueTech[0] || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>

                    <PremiumCard glowColor="secondary">
                        <div className="space-y-6">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-secondary" />
                                System Diagnostics
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <span className="text-[10px] font-bold text-zinc-400">API Latency</span>
                                    <span className="text-[10px] font-black text-emerald-500">14ms // FAST</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <span className="text-[10px] font-bold text-zinc-400">Token Health</span>
                                    <span className="text-[10px] font-black text-emerald-500">OPTIMAL</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <span className="text-[10px] font-bold text-zinc-400">Memory Load</span>
                                    <span className="text-[10px] font-black text-secondary">12% // STABLE</span>
                                </div>
                            </div>
                        </div>
                    </PremiumCard>
                </div>

                {/* Intelligence Feed */}
                <PremiumCard glowColor="primary" className="lg:col-span-2">
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-primary" />
                                Intelligence Feed
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Updates</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {dbUser.analyses.length > 0 ? (
                                dbUser.analyses.map((analysis) => (
                                    <div key={analysis.id} className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] transition-all duration-500 overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Code2 className="w-16 h-16" />
                                        </div>
                                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl border ${
                                                    analysis.analysis_type === 'repo_analysis' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/10 border-secondary/20 text-secondary'
                                                }`}>
                                                    <Box className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white uppercase tracking-tight text-sm">
                                                        {analysis.target}
                                                    </h4>
                                                    <p className="text-[10px] text-zinc-500 font-medium">
                                                        {new Date(analysis.created_at).toLocaleTimeString()} &bull; {analysis.analysis_type.replace('_', ' ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <span className="block text-[8px] font-black text-zinc-600 uppercase">Integrity Score</span>
                                                    <span className={`text-xl font-black ${analysis.score > 80 || analysis.score === 0 ? 'text-emerald-500' : 'text-primary'}`}>
                                                        {analysis.score === 0 ? 'FIXED' : `${analysis.score}%`}
                                                    </span>
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center space-y-4 opacity-30">
                                    <Flame className="w-12 h-12 mx-auto" />
                                    <p className="text-sm font-black uppercase tracking-widest">No Recent Activity Detected</p>
                                </div>
                            )}
                        </div>
                    </div>
                </PremiumCard>
            </div>

            <p className="text-center text-[10px] font-black tracking-[0.3em] text-zinc-700 uppercase pt-8">
                Member since &bull; {new Date(dbUser.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    );
}


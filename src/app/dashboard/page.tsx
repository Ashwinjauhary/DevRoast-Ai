import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Code2, Flame, GitBranch, TerminalSquare, ArrowRight, Briefcase, ScrollText, Crown, Swords } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PremiumCard } from "@/components/ui/premium-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StackBento } from "@/components/ui/stack-bento";
import { CommitFixerWidget } from "@/components/ui/commit-fixer-widget";
import { fetchRepositories } from "@/app/dashboard/repositories/actions";
import { GitHubConnectCard } from "@/components/dashboard/github-connect-card";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const dbUser = await (prisma as any).user.findUnique({
        where: { id: session.user.id },
        include: {
            _count: {
                select: { analyses: true }
            },
            analyses: {
                orderBy: { created_at: 'desc' },
            },
            portfolios: {
                orderBy: { created_at: 'desc' },
                take: 1
            }
        }
    });

    const githubUsername = dbUser?.github_username || (session?.user as any)?.github_username;
    
    // Filter for personal analyses (own profile or own repos)
    const personalAnalyses = dbUser?.analyses?.filter((a: any) => {
        if (!githubUsername) return false;
        if (a.analysis_type === 'profile') {
            return a.target.toLowerCase() === githubUsername.toLowerCase();
        }
        if (a.analysis_type === 'repository') {
            return a.target.toLowerCase().startsWith(githubUsername.toLowerCase() + '/');
        }
        return false;
    }) || [];

    // Separate and sort for prioritization
    const repoAnalyses = personalAnalyses.filter((a: any) => a.analysis_type === 'repository');
    const profileAnalyses = personalAnalyses.filter((a: any) => a.analysis_type === 'profile');

    const topRepos = [...repoAnalyses].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);
    const topProfile = [...profileAnalyses].sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 1);

    // Get Curation from Portfolio if available
    const portfolioProjects = (dbUser as any)?.portfolios?.[0]?.projects || [];
    const portfolioProjectNames = new Set(portfolioProjects.map((p: any) => p.title.toLowerCase()));

    // Fallback: If less than 5 analyzed repos, fetch from GitHub to fill the grid
    const hasPortfolio = portfolioProjects.length > 0;
    const baseCount = hasPortfolio ? portfolioProjects.length : topRepos.length;
    let extraRepos: any[] = [];
    const hasGitHubToken = !!(session?.user as any)?.accessToken;

    if (baseCount < 5 && hasGitHubToken) {
        try {
            const githubReposResult = await fetchRepositories();
            if (githubReposResult.success) {
                const analyzedTargets = new Set(repoAnalyses.map((a: any) => a.target.toLowerCase()));
                extraRepos = (githubReposResult.data || [])
                    .filter((r: any) => {
                        const name = r.name.toLowerCase();
                        return !analyzedTargets.has(r.full_name.toLowerCase()) && 
                               !r.fork && 
                               !portfolioProjectNames.has(name) &&
                               !name.includes('source') &&
                               !name.includes('test') &&
                               !name.includes('demo') &&
                               !name.includes('hub') &&
                               !name.includes('smartwatch');
                    })
                    // Weight: Size (Concept) + Language diversity indication
                    .sort((a: any, b: any) => (b.size || 0) - (a.size || 0))
                    .slice(0, 5 - baseCount);
            }
        } catch (e) {
            console.error("Dashboard: Fallback repo fetch failed", e);
        }
    }

    // Combine for graph data — Prioritize Portfolio selection if it exists
    const topAnalyses = portfolioProjects.length > 0 
        ? portfolioProjects.map((p: any) => ({ 
            analysis_type: 'repository', 
            target: p.title, 
            result_json: { name: p.title, languages_breakdown: { [p.techStacks?.[0] || 'Unknown']: 100 } } 
          }))
        : [...topRepos, ...topProfile];

    const latestPersonalAnalysis = [...personalAnalyses].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
    const devScore = latestPersonalAnalysis?.score?.toFixed(1) || "0.0";
    const scoreStatus = parseFloat(devScore) >= 7 ? "Excellent" : parseFloat(devScore) >= 4 ? "Needs Improvement" : "Not Analyzed Successfully";
    
    // Stats
    const personalReposAnalyzed = personalAnalyses.filter((a: any) => a.analysis_type === 'repository').length;
    const totalRoasts = personalAnalyses.length;

    // Build Graph Data from Top 5 Analyses
    const nodesMap = new Map();
    const linksMap = new Map();

    nodesMap.set("User", { id: "User", group: 0, val: 30 });

    topAnalyses.forEach((analysis: any) => {
        const data = analysis.result_json as any;
        if (!data) return;

        if (analysis.analysis_type === 'repository') {
            const repoName = data.name || data.repo || analysis.target.split('/').pop() || "unknown";
            if (!nodesMap.has(repoName)) {
                nodesMap.set(repoName, { id: repoName, group: 1, val: 20 });
                linksMap.set(`User-${repoName}`, { source: "User", target: repoName });
            }

            if (data.languages_breakdown) {
                Object.keys(data.languages_breakdown).forEach(lang => {
                    if (!nodesMap.has(lang)) {
                        nodesMap.set(lang, { id: lang, group: 2, val: 15 });
                    }
                    const linkId = `${repoName}-${lang}`;
                    if (!linksMap.has(linkId)) {
                        linksMap.set(linkId, { source: repoName, target: lang });
                    }
                });
            }

            if (data.dependencyHealth && data.dependencyHealth.name) {
                const depName = data.dependencyHealth.name;
                if (!nodesMap.has(depName)) {
                    nodesMap.set(depName, { id: depName, group: 3, val: 10 });
                }
                const linkId = `${repoName}-${depName}`;
                if (!linksMap.has(linkId)) {
                    linksMap.set(linkId, { source: repoName, target: depName });
                }
            }

            if (data.categories) {
                Object.keys(data.categories).forEach(cat => {
                    const catId = `SYS_${cat.toUpperCase().replace(/\s+/g, '_')}`;
                    if (!nodesMap.has(catId)) {
                        nodesMap.set(catId, { id: catId, group: 4, val: 12 });
                    }
                });
            }
        } else if (analysis.analysis_type === 'profile') {
            // ... profile logic ...
            if (data.top_languages) {
                data.top_languages.forEach((lang: string) => {
                    if (!nodesMap.has(lang)) {
                        nodesMap.set(lang, { id: lang, group: 2, val: 15 });
                    }
                    const linkId = `User-${lang}`;
                    if (!linksMap.has(linkId)) {
                        linksMap.set(linkId, { source: "User", target: lang });
                    }
                });
            }
            if (data.categories) {
                Object.keys(data.categories).forEach(cat => {
                    const catId = `SYS_${cat.toUpperCase().replace(/\s+/g, '_')}`;
                    if (!nodesMap.has(catId)) {
                        nodesMap.set(catId, { id: catId, group: 4, val: 12 });
                    }
                });
            }
        }
    });

    // Handle Extra (Un-analyzed) Repos
    extraRepos.forEach((repo: any) => {
        const repoName = repo.name;
        if (!nodesMap.has(repoName)) {
            nodesMap.set(repoName, { id: repoName, group: 1, val: 20 });
            linksMap.set(`User-${repoName}`, { source: "User", target: repoName });
        }

        if (repo.language) {
            if (!nodesMap.has(repo.language)) {
                nodesMap.set(repo.language, { id: repo.language, group: 2, val: 15 });
            }
            const linkId = `${repoName}-${repo.language}`;
            if (!linksMap.has(linkId)) {
                linksMap.set(linkId, { source: repoName, target: repo.language });
            }
        }
    });

    // Fallback/Seed Data if the stack looks too empty
    if (nodesMap.size <= 2) {
        ["TypeScript", "React", "Node.js"].forEach(tech => {
            if (!nodesMap.has(tech)) {
                nodesMap.set(tech, { id: tech, group: 2, val: 15 });
            }
        });
    }

    const graphData = {
        nodes: Array.from(nodesMap.values()),
        links: Array.from(linksMap.values())
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100">
            <DashboardHeader />

            <div className="w-full">
                <StackBento data={nodesMap.size > 1 ? graphData : undefined} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PremiumCard glowColor="primary">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Dev Score</span>
                        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                            <Flame className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black">{devScore}</span>
                        <span className="text-zinc-600 font-bold text-sm">/ 10</span>
                    </div>
                    <div className="mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                        <span className="text-[10px] font-bold text-zinc-400 capitalize">{scoreStatus}</span>
                    </div>
                </PremiumCard>

                <PremiumCard glowColor="secondary">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Personal Assets</span>
                        <div className="p-2 bg-secondary/10 rounded-lg border border-secondary/20">
                            <GitBranch className="w-5 h-5 text-secondary" />
                        </div>
                    </div>
                    <div className="text-4xl font-black">{personalReposAnalyzed}</div>
                    <div className="mt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Your Repositories Scanned</div>
                </PremiumCard>

                <PremiumCard glowColor="accent">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Total Burns</span>
                        <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                            <TerminalSquare className="w-5 h-5 text-accent" />
                        </div>
                    </div>
                    <div className="text-4xl font-black">{totalRoasts}</div>
                    <div className="mt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Successful Roasts</div>
                </PremiumCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
                <div className="lg:col-span-3 space-y-8">
                    {/* Primary Tools Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Link href="/dashboard/github-analysis" className="group block">
                            <PremiumCard
                                glowColor="secondary"
                                className="h-full hover:bg-white/[0.04] transition-colors overflow-hidden"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4">
                                        <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20 w-fit">
                                            <Code2 className="text-secondary w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">Surface Analysis</h3>
                                        <p className="text-zinc-500 font-light leading-relaxed max-w-sm">
                                            Scan your global GitHub presence. We analyze languages, activity spikes, and profile aesthetics.
                                        </p>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </PremiumCard>
                        </Link>

                        <Link href="/dashboard/repo-analysis" className="group block">
                            <PremiumCard
                                glowColor="primary"
                                className="h-full hover:bg-white/[0.04] transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-4">
                                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 w-fit">
                                            <GitBranch className="text-primary w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight group-hover:text-secondary transition-colors">Deep Probe Scan</h3>
                                        <p className="text-zinc-500 font-light leading-relaxed max-w-sm">
                                            Target a specific repository. We perform a total architectural audit and deliver a lethal roast report.
                                        </p>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </div>
                            </PremiumCard>
                        </Link>
                    </div>

                    {/* AI Engineering Suite Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-1 h-4 bg-primary rounded-full" />
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Neural Engineering Suite</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link href="/dashboard/code-review" className="group">
                                <PremiumCard glowColor="primary" className="p-6 hover:bg-white/[0.02] transition-colors border-white/5 h-full">
                                    <div className="flex flex-col gap-4">
                                        <div className="p-2.5 bg-primary/10 rounded-lg w-fit">
                                            <Code2 className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white group-hover:text-primary transition-colors">Code Review Bot</h4>
                                            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Brutal line-by-line roasts and AI-optimized code fixes.</p>
                                        </div>
                                    </div>
                                </PremiumCard>
                            </Link>

                            <Link href="/dashboard/resume-enhancer" className="group">
                                <PremiumCard glowColor="secondary" className="p-6 hover:bg-white/[0.02] transition-colors border-white/5 h-full">
                                    <div className="flex flex-col gap-4">
                                        <div className="p-2.5 bg-secondary/10 rounded-lg w-fit">
                                            <ScrollText className="w-5 h-5 text-secondary" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white group-hover:text-secondary transition-colors">Resume Architect</h4>
                                            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Quantified STAR-method LaTeX resumes built from your DNA.</p>
                                        </div>
                                    </div>
                                </PremiumCard>
                            </Link>

                            <Link href="/dashboard/dev-duels" className="group">
                                <PremiumCard glowColor="accent" className="p-6 hover:bg-white/[0.02] transition-colors border-white/5 h-full">
                                    <div className="flex flex-col gap-4">
                                        <div className="p-2.5 bg-accent/10 rounded-lg w-fit">
                                            <Swords className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white group-hover:text-accent transition-colors">Dev Duels</h4>
                                            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Challenge another user head-to-head. AI picks the winner.</p>
                                        </div>
                                    </div>
                                </PremiumCard>
                            </Link>

                            <Link href="/dashboard/job-match" className="group">
                                <PremiumCard glowColor="primary" className="p-6 hover:bg-white/[0.02] transition-colors border-white/5 h-full">
                                    <div className="flex flex-col gap-4">
                                        <div className="p-2.5 bg-primary/10 rounded-lg w-fit">
                                            <Crown className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white group-hover:text-primary transition-colors">Job Match</h4>
                                            <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Compare your stack against any JD for compatibility.</p>
                                        </div>
                                    </div>
                                </PremiumCard>
                            </Link>
                        </div>
                        
                        {!hasGitHubToken && (
                            <div className="w-full">
                                <GitHubConnectCard />
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/portfolio" className="group block">
                        <PremiumCard
                            glowColor="accent"
                            className="h-full hover:bg-white/[0.04] transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-accent/10 rounded-xl border border-accent/20 w-fit">
                                            <Briefcase className="text-accent w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-2 py-1 rounded border border-accent/10">Engineered Portfolio</span>
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight group-hover:text-white transition-colors">AI Portfolio Generator</h3>
                                    <p className="text-zinc-500 font-light leading-relaxed">
                                        Synthesize your entire GitHub activity into a polished, professional developer portfolio with AI-generated taglines and job compatibility charts.
                                    </p>
                                </div>
                                <ArrowRight className="w-6 h-6 text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </div>
                        </PremiumCard>
                    </Link>
                </div>

                <div className="lg:col-span-1 h-full min-h-[400px]">
                    <CommitFixerWidget />
                </div>
            </div>
        </div>
    );
}

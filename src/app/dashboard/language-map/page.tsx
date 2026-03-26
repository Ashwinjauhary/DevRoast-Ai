import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Map, AlertCircle, Calendar, Code2 } from "lucide-react";
import { fetchRepositories, type GitHubRepository } from "@/app/dashboard/repositories/actions";

interface LanguageAnalysisResult {
    languages_breakdown?: Record<string, number>;
    mainLanguage?: string;
}

export default async function LanguageMapPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const [analyses, githubReposResult] = await Promise.all([
        prisma.analysis.findMany({
            where: { user_id: session.user.id, analysis_type: "repository" },
            select: { result_json: true, created_at: true, target: true },
            orderBy: { created_at: "asc" },
        }),
        fetchRepositories()
    ]);

    // Aggregate language data
    const langTotals: Record<string, number> = {};
    const langFirstSeen: Record<string, Date> = {};
    const analyzedRepos = new Set<string>();

    // 1. Process Analyses (High precision byte data)
    analyses.forEach(a => {
        const json = a.result_json as unknown as LanguageAnalysisResult;
        const langs: Record<string, number> = json?.languages_breakdown || {};
        const date = new Date(a.created_at);
        analyzedRepos.add(a.target.toLowerCase());

        Object.entries(langs).forEach(([lang, bytes]) => {
            langTotals[lang] = (langTotals[lang] || 0) + (bytes as number);
            if (!langFirstSeen[lang] || date < langFirstSeen[lang]) {
                langFirstSeen[lang] = date;
            }
        });

        if (json?.mainLanguage && !langs[json.mainLanguage]) {
            langTotals[json.mainLanguage] = (langTotals[json.mainLanguage] || 0) + 10000; // Give weight to main language
            if (!langFirstSeen[json.mainLanguage] || date < langFirstSeen[json.mainLanguage]) {
                langFirstSeen[json.mainLanguage] = date;
            }
        }
    });

    // 2. Process GitHub Metadata (Low precision but breadth coverage)
    if (githubReposResult.success && githubReposResult.data) {
        githubReposResult.data.forEach((repo: GitHubRepository) => {
            const lang = repo.language;
            const creationDate = new Date(repo.created_at);
            if (lang) {
                // If not already heavily weighted by bytes, give it a baseline
                if (!langTotals[lang]) {
                    langTotals[lang] = 5000; // Baseline weight for metadata discovery
                }
                if (!langFirstSeen[lang] || creationDate < langFirstSeen[lang]) {
                    langFirstSeen[lang] = creationDate;
                }
            }
        });
    }

    const totalBytes = Object.values(langTotals).reduce((a, b) => a + b, 0);
    const sortedLangs = Object.entries(langTotals).sort((a, b) => b[1] - a[1]); // All languages, no slice

    const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#3b82f6", "#14b8a6", "#84cc16", "#f97316"];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-24">
            <div className="space-y-3">
                <AnimatedText text="Language Evolution Map" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 italic">Your programming language universe — visualized.</p>
            </div>

            {sortedLangs.length === 0 ? (
                <PremiumCard glowColor="none">
                    <div className="py-12 text-center space-y-3 opacity-40">
                        <Map className="w-12 h-12 mx-auto" />
                        <p className="font-black uppercase tracking-widest text-sm">No repository data yet. Analyze some repos first!</p>
                    </div>
                </PremiumCard>
            ) : (
                <div className="space-y-8">
                    {/* Bar Chart */}
                    <PremiumCard glowColor="primary">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Map className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-black tracking-tight">Language Distribution</h3>
                            </div>
                            <div className="space-y-3">
                                {sortedLangs.map(([lang, bytes], i) => {
                                    const pct = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : "0";
                                    return (
                                        <div key={lang} className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                    <span className="text-sm font-bold text-white">{lang}</span>
                                                </div>
                                                <span className="text-xs font-black text-zinc-500">{pct}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-1000"
                                                    style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </PremiumCard>

                    {/* Language Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortedLangs.map(([lang, bytes], i) => {
                            const pct = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : "0";
                            const firstSeen = langFirstSeen[lang];
                            
                            return (
                                <div 
                                    key={lang} 
                                    className="group p-6 rounded-[2rem] border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-500 relative overflow-hidden flex flex-col justify-between"
                                    style={{ borderLeft: `4px solid ${COLORS[i % COLORS.length]}` }}
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-5 transition-opacity group-hover:opacity-20 pointer-events-none" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex items-start justify-between">
                                            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                                                <Code2 className="w-5 h-5" style={{ color: COLORS[i % COLORS.length] }} />
                                            </div>
                                            <div className="text-2xl font-black italic tracking-tighter" style={{ color: COLORS[i % COLORS.length] }}>{pct}%</div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-lg font-black text-white uppercase tracking-tight truncate">{lang}</h4>
                                            <div className="flex items-center gap-1.5 mt-1 opacity-40">
                                                <Calendar className="w-3 h-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                                                    First Detected: {firstSeen ? firstSeen.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                                         <div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Rank #{i + 1}</div>
                                         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length], boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <PremiumCard glowColor="none">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm text-zinc-400 font-bold uppercase tracking-wider">Historical Intelligence Matrix</p>
                                <p className="text-sm text-zinc-500">Data is aggregated from all {githubReposResult.data?.length || 0} discovered repositories and {analyses.length} detailed code analyses. This represents your entire technical journey from the first commit to the latest probe.</p>
                            </div>
                        </div>
                    </PremiumCard>
                </div>
            )}
        </div>
    );
}

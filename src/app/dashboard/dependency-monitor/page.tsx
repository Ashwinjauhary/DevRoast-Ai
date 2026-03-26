import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { Shield, AlertTriangle, CheckCircle, XCircle, ExternalLink } from "lucide-react";



interface DependencyHealth {
    critical: number;
    outdated: number;
    upToDate: number;
    vulnerabilities: {
        name: string;
        version: string;
        severity: string;
    }[];
}

interface RepoAnalysisResult {
    dependencyHealth?: DependencyHealth;
}



export default async function DependencyMonitorPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    // Get the last analyzed repo with a result_json.dependencyHealth
    const recentAnalyses = await prisma.analysis.findMany({
        where: { user_id: session.user.id, analysis_type: "repository" },
        orderBy: { created_at: "desc" },
        take: 5,
        select: { target: true, result_json: true, created_at: true },
    });

    const analysesWithDeps = recentAnalyses.filter(a => {
        const json = a.result_json as unknown as RepoAnalysisResult;
        return json?.dependencyHealth;
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-5xl mx-auto pb-24">
            <div className="space-y-3">
                <AnimatedText text="Dependency Monitor" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 italic">Track the health of your dependencies. Know before your users do.</p>
            </div>

            {analysesWithDeps.length === 0 ? (
                <PremiumCard glowColor="none">
                    <div className="py-12 text-center space-y-3 opacity-40">
                        <Shield className="w-12 h-12 mx-auto" />
                        <p className="font-black uppercase tracking-widest text-sm">No dependency data found.</p>
                        <p className="text-sm text-zinc-500">Run a Repo Analysis first — dependency health is tracked automatically.</p>
                    </div>
                </PremiumCard>
            ) : (
                <div className="space-y-8">
                    {analysesWithDeps.map(analysis => {
                        const json = analysis.result_json as unknown as RepoAnalysisResult;
                        const health = json?.dependencyHealth;
                        if (!health) return null;

                        const totalDeps = (health.critical || 0) + (health.outdated || 0) + (health.upToDate || 0);
                        const healthScore = totalDeps > 0 ? Math.round(((health.upToDate || 0) / totalDeps) * 100) : 100;

                        return (
                            <PremiumCard key={analysis.target} glowColor={health.critical > 0 ? "accent" : "secondary"}>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-black text-white text-lg">{analysis.target}</h3>
                                            <p className="text-[10px] text-zinc-500">{new Date(analysis.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl border text-sm font-black ${
                                            healthScore >= 80 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                            healthScore >= 50 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                            "bg-red-500/10 border-red-500/20 text-red-400"
                                        }`}>
                                            {healthScore}% Healthy
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                                            <p className="text-2xl font-black text-emerald-400">{health.upToDate || 0}</p>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Up To Date</p>
                                        </div>
                                        <div className="text-center p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                            <AlertTriangle className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                                            <p className="text-2xl font-black text-amber-400">{health.outdated || 0}</p>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Outdated</p>
                                        </div>
                                        <div className="text-center p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                                            <XCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
                                            <p className="text-2xl font-black text-red-400">{health.critical || 0}</p>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Critical</p>
                                        </div>
                                    </div>

                                    {health.vulnerabilities?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vulnerabilities</p>
                                            {health.vulnerabilities.slice(0, 5).map((vuln, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                                                    <div>
                                                        <span className="text-sm font-bold text-white">{vuln.name}</span>
                                                        <span className="text-xs text-zinc-500 ml-2">{vuln.version}</span>
                                                    </div>
                                                    <span className="text-[9px] font-black text-red-400 uppercase">{vuln.severity || "unknown"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <a
                                        href={`https://github.com/${analysis.target}/blob/HEAD/package.json`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs font-black text-zinc-500 hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-3 h-3" /> View package.json on GitHub
                                    </a>
                                </div>
                            </PremiumCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

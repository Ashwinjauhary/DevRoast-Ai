import { Github, Briefcase, Code2, Award, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { CertificatesList } from "@/components/ui/certificates-list";
import { LiveIndicator } from "@/components/ui/live-indicator";

export default function BentoLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    const dnaStats = Array.isArray(hero?.dnaStats) ? hero.dnaStats : [];
    
    return (
        <div className="min-h-screen bg-[#f1f5f9] text-slate-900 p-4 md:p-8 selection:bg-blue-200">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* BENTO GRID HEADER */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Main Identity Box */}
                    <div className="md:col-span-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-medium text-sm">
                                    <Github className="w-4 h-4" />
                                    <span>@{username}</span>
                                </div>
                                <LiveIndicator status={hero?.status || 'Online'} template="bento" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                                {hero?.tagline}
                            </h1>
                            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                                {hero?.about}
                            </p>
                        </div>
                    </div>

                    {/* Vibe / Roast Box */}
                    <div className="md:col-span-4 flex flex-col gap-6">
                        {hero?.vibe?.title && (
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-sm flex-1 flex flex-col justify-center">
                                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2 block">Archetype</span>
                                <h2 className="text-3xl font-black italic tracking-tighter mb-4">{hero.vibe.title}</h2>
                                <p className="text-blue-100 text-sm font-medium">{hero.vibe.description}</p>
                            </div>
                        )}
                        {hero?.roast && (
                            <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 text-red-700 flex-1 flex flex-col justify-center">
                                <span className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 block">AI Roast</span>
                                <p className="font-semibold italic">"{hero.roast}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ACHIEVEMENTS & STATS STRIP */}
                {(achievements.length > 0 || dnaStats.length > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {achievements.map((item, i) => (
                            <div key={`ach-${i}`} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
                                <span className="text-3xl font-black text-slate-900 mb-2">{item.value}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                        {dnaStats.map((stat, i) => (
                            <div key={`dna-${i}`} className="bg-slate-900 rounded-[1.5rem] p-6 shadow-sm flex flex-col justify-center items-center text-center text-white">
                                {stat.icon === 'Zap' && <Zap className="w-6 h-6 text-yellow-400 mb-3" />}
                                {stat.icon === 'Box' && <Box className="w-6 h-6 text-blue-400 mb-3" />}
                                {stat.icon === 'Brain' && <Brain className="w-6 h-6 text-pink-400 mb-3" />}
                                <span className="text-xl font-bold">{stat.value}</span>
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* SKILLS & EXPERIENCE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-8 text-slate-400">
                            <Code2 className="w-5 h-5" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Tech Stack</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-8 text-slate-400">
                            <Briefcase className="w-5 h-5" />
                            <h3 className="text-sm font-bold uppercase tracking-widest">Experience</h3>
                        </div>
                        <p className="text-lg text-slate-700 font-medium leading-relaxed">
                            {typeof experience === 'string' ? (
                                experience.startsWith('{') ? (
                                    (() => {
                                        try { return (JSON.parse(experience) as any).summary || experience; } 
                                        catch { return experience; }
                                    })()
                                ) : experience
                            ) : (experience as any)?.summary || "No experience summary provided."}
                        </p>
                    </div>
                </div>

                {/* BOTTOM GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {compatibility && (
                        <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
                            <JobCompatibilityChart data={compatibility} />
                        </div>
                    )}
                    
                    <div className={`${compatibility ? 'lg:col-span-7' : 'lg:col-span-12'} flex flex-col gap-6`}>
                        {projects.length > 0 && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex-1">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Selected Works</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {projects.slice(0, 4).map((project, i) => (
                                        <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md">
                                            <h4 className="font-bold text-slate-900 text-lg mb-2">{project.title}</h4>
                                            <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

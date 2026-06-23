import { Github, Briefcase, Code2, Zap, Brain, Box, Mail, Twitter, Linkedin, ExternalLink, ChevronRight } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import Link from "next/link";

export default function BentoLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    const dnaStats = Array.isArray(hero?.dnaStats) ? hero.dnaStats : [];
    
    // Format experience string into an array if possible
    let expSummary = "No experience summary provided.";
    if (typeof experience === 'string') {
        if (experience.startsWith('{')) {
            try { expSummary = (JSON.parse(experience) as any).summary || experience; } 
            catch { expSummary = experience; }
        } else {
            expSummary = experience;
        }
    } else if (experience) {
        expSummary = (experience as any).summary || "No experience summary provided.";
    }

    return (
        <div className="min-h-screen bg-[#f1f5f9] text-slate-900 p-4 md:p-8 font-sans selection:bg-blue-200">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* TOP GRID (Profile + Vibe) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Profile Card (Bento Large) */}
                    <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200 flex flex-col justify-between group hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${username}&background=random&size=128&bold=true`} 
                                        alt={username} 
                                        className="w-20 h-20 rounded-2xl shadow-sm border border-slate-100"
                                    />
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold text-sm mb-2">
                                            <Github className="w-4 h-4" />
                                            <span>@{username}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LiveIndicator status={hero?.status || 'Available for work'} template="bento" />
                                        </div>
                                    </div>
                                </div>
                                
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                                    {hero?.tagline}
                                </h1>
                                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                                    {hero?.about}
                                </p>
                            </div>
                            
                            {/* Social / Contact Actions */}
                            <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                <Link href={`https://github.com/${username}`} target="_blank" className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                    <Github className="w-5 h-5" />
                                </Link>
                                {hero?.contactEmail && (
                                    <Link href={`mailto:${hero.contactEmail}`} className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vibe / AI Roast (Bento Tall/Stacked) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {hero?.vibe?.title && (
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-sm flex-1 flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                    <Zap className="w-32 h-32" />
                                </div>
                                <span className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-3 block">Architectural Vibe</span>
                                <h2 className="text-3xl font-black italic tracking-tight mb-2 relative z-10">{hero.vibe.title}</h2>
                                <p className="text-blue-100 text-sm font-medium leading-relaxed relative z-10">{hero.vibe.description}</p>
                            </div>
                        )}
                        {hero?.roast && (
                            <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100 text-red-700 flex-1 flex flex-col justify-center relative overflow-hidden group">
                                <span className="text-red-400 text-xs font-bold uppercase tracking-widest mb-3 block">AI Code Roast</span>
                                <p className="font-bold italic text-lg leading-relaxed relative z-10">"{hero.roast}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* MIDDLE GRID (Stats + Skills) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Skills Bento */}
                    <div className="lg:col-span-6 bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <Code2 className="w-6 h-6 text-blue-500" />
                                Tech Arsenal
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 hover:bg-white hover:shadow-sm hover:border-slate-300 transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats Bento */}
                    {(achievements.length > 0 || dnaStats.length > 0) && (
                        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                            {achievements.slice(0, 3).map((item, i) => (
                                <div key={`ach-${i}`} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center hover:border-blue-200 transition-colors">
                                    <span className="text-3xl font-black text-slate-900 mb-2">{item.value}</span>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                            {dnaStats.slice(0, 3).map((stat, i) => (
                                <div key={`dna-${i}`} className="bg-slate-900 rounded-[2rem] p-6 shadow-sm flex flex-col justify-center items-center text-center text-white hover:bg-slate-800 transition-colors">
                                    {stat.icon === 'Zap' && <Zap className="w-6 h-6 text-yellow-400 mb-3" />}
                                    {stat.icon === 'Box' && <Box className="w-6 h-6 text-blue-400 mb-3" />}
                                    {stat.icon === 'Brain' && <Brain className="w-6 h-6 text-pink-400 mb-3" />}
                                    <span className="text-xl font-bold">{stat.value}</span>
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTTOM GRID (Experience + Projects) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Experience Bio */}
                    <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200 flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-8">
                            <Briefcase className="w-6 h-6 text-indigo-500" />
                            Professional Bio
                        </h3>
                        <div className="relative pl-6 border-l-2 border-slate-100 flex-1">
                            <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-2" />
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                {expSummary}
                            </p>
                        </div>
                        {compatibility && (
                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Market Match</h4>
                                <JobCompatibilityChart data={compatibility} />
                            </div>
                        )}
                    </div>
                    
                    {/* Projects Grid */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {projects.length > 0 && (
                            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-200 flex-1">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-8">
                                    <Box className="w-6 h-6 text-emerald-500" />
                                    Featured Projects
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    {projects.slice(0, 4).map((project, i) => (
                                        <div key={i} className="group bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex flex-col h-full relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-bold text-slate-900 text-xl leading-tight pr-8">{project.title}</h4>
                                                {(project.liveUrl || project.url) && (
                                                    <Link href={project.liveUrl || project.url || '#'} target="_blank" className="absolute top-6 right-6 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 flex-1">{project.description}</p>
                                            <div className="flex flex-wrap gap-2 mt-auto">
                                                {project.techStacks?.slice(0, 3).map(tech => (
                                                    <span key={tech} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
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

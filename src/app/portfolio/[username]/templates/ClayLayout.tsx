import { Github, Briefcase, Code2, ExternalLink, Mail, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import Link from "next/link";

export default function ClayLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    
    let expSummary = "No experience summary provided.";
    if (typeof experience === 'string') {
        if (experience.startsWith('{')) {
            try { expSummary = (JSON.parse(experience) as any).summary || experience; } 
            catch { expSummary = experience; }
        } else { expSummary = experience; }
    } else if (experience) {
        expSummary = (experience as any).summary || "No experience summary provided.";
    }

    // Custom Clay classes for inflated 3D feel
    const clayCard = "bg-[#f1f5f9] rounded-[3rem] shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff,inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-4px_-4px_8px_rgba(0,0,0,0.05)] border-4 border-white/50";
    const clayButton = "bg-[#f1f5f9] rounded-2xl shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff] hover:shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] active:shadow-[inset_6px_6px_12px_#cbd5e1,inset_-6px_-6px_12px_#ffffff] transition-all border-2 border-white flex items-center justify-center text-slate-500 hover:text-blue-500 font-bold";
    const clayPill = "bg-[#f1f5f9] rounded-full shadow-[4px_4px_8px_#cbd5e1,-4px_-4px_8px_#ffffff,inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.05)] border-2 border-white px-5 py-2 text-sm font-bold text-slate-600";

    return (
        <div className="min-h-screen bg-[#e2e8f0] text-slate-800 font-sans selection:bg-blue-300 overflow-x-hidden">
            <div className="max-w-6xl mx-auto px-6 py-24 space-y-16">
                
                {/* Hero Section */}
                <header className={`${clayCard} p-12 md:p-16 flex flex-col items-center text-center relative`}>
                    <div className="absolute top-12 right-12">
                        <LiveIndicator status={hero?.status || "Online"} template="clay" />
                    </div>
                    
                    <div className="w-40 h-40 rounded-full mb-10 shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff,inset_8px_8px_16px_rgba(255,255,255,0.8),inset_-8px_-8px_16px_rgba(0,0,0,0.1)] border-8 border-[#f1f5f9] p-2 flex items-center justify-center bg-[#e2e8f0]">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${username}&background=3B82F6&color=ffffff&size=150&bold=true`} 
                            alt={username} 
                            className="w-full h-full rounded-full object-cover shadow-inner"
                        />
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-[#f8fafc] rounded-full shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff] text-slate-500 font-bold">
                        <Github className="w-5 h-5 text-blue-500" />
                        <span>@{username}</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-800 mb-6 drop-shadow-[2px_4px_6px_rgba(0,0,0,0.1)]">
                        {hero?.tagline}
                    </h1>
                    
                    <p className="text-xl text-slate-600 font-medium max-w-3xl leading-relaxed mb-10">
                        {hero?.about}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6">
                        <Link href={`https://github.com/${username}`} target="_blank" className={`${clayButton} px-8 py-4 gap-3 text-lg`}>
                            <Github className="w-6 h-6" /> GitHub
                        </Link>
                        {hero?.contactEmail && (
                            <Link href={`mailto:${hero.contactEmail}`} className={`${clayButton} px-8 py-4 gap-3 text-lg`}>
                                <Mail className="w-6 h-6 text-blue-500" /> Let's Talk
                            </Link>
                        )}
                    </div>
                </header>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Skills Clay Card */}
                    <div className={`md:col-span-5 ${clayCard} p-10`}>
                        <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-700">
                            <Code2 className="text-blue-500 w-8 h-8" /> Tech Stack
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {skills.map(skill => (
                                <span key={skill} className={clayPill}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Experience Clay Card */}
                    <div className={`md:col-span-7 ${clayCard} p-10 md:p-14`}>
                        <h2 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-700">
                            <Briefcase className="text-indigo-500 w-8 h-8" /> Experience
                        </h2>
                        <div className="relative pl-8 border-l-4 border-white/50">
                            <div className="absolute top-1 -left-[10px] w-4 h-4 rounded-full bg-indigo-500 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.5),2px_2px_4px_rgba(0,0,0,0.2)]" />
                            <p className="text-xl font-medium leading-relaxed text-slate-600">
                                {expSummary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <section className="space-y-12 pt-8">
                        <h2 className="text-4xl font-black text-center text-slate-800 drop-shadow-[2px_4px_6px_rgba(0,0,0,0.1)]">Featured Projects</h2>
                        <div className="grid md:grid-cols-2 gap-10">
                            {projects.map((project, i) => (
                                <div key={i} className={`${clayCard} p-10 flex flex-col hover:scale-[1.02] transition-transform duration-300`}>
                                    <div className="flex justify-between items-start mb-8">
                                        <h3 className="text-3xl font-black text-slate-800 pr-4">{project.title}</h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className={`${clayButton} w-14 h-14 shrink-0`}>
                                                <ExternalLink className="w-6 h-6" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-slate-600 font-medium mb-10 flex-1 leading-relaxed text-lg">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-3 mt-auto">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="bg-[#e2e8f0] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 shadow-[inset_2px_2px_4px_#cbd5e1,inset_-2px_-2px_4px_#ffffff]">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
import { Github, Briefcase, Code2, ExternalLink, Mail, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import Link from "next/link";

export default function AuroraLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
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

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-fuchsia-500/30 overflow-x-hidden relative">
            
            {/* Aurora Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[radial-gradient(circle,rgba(168,85,247,0.3)_0%,transparent_60%)] blur-[80px] animate-[pulse_10s_ease-in-out_infinite_alternate]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(236,72,153,0.25)_0%,transparent_60%)] blur-[100px] animate-[pulse_12s_ease-in-out_infinite_alternate_reverse]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 space-y-32">
                
                {/* Hero Section */}
                <header className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-tr from-fuchsia-500 to-purple-600 shrink-0 shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-[spin_10s_linear_infinite]">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${username}&background=020617&color=E879F9&size=256&bold=true`} 
                            alt={username} 
                            className="w-full h-full rounded-full border-4 border-[#020617] animate-[spin_10s_linear_infinite_reverse]"
                        />
                    </div>
                    
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <LiveIndicator status={hero?.status || "Online"} template="aurora" />
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-sm font-medium border border-white/10">
                                <Github className="w-4 h-4 text-fuchsia-400" />
                                <span>@{username}</span>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-100 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.3)]">
                            {hero?.tagline}
                        </h1>
                        
                        <p className="text-xl text-fuchsia-100/70 max-w-2xl leading-relaxed font-light">
                            {hero?.about}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                            <Link href={`https://github.com/${username}`} target="_blank" className="px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-400 text-white rounded-xl flex items-center gap-2 font-medium transition-colors shadow-[0_0_20px_rgba(217,70,239,0.4)]">
                                <Github className="w-5 h-5" /> GitHub
                            </Link>
                            {hero?.contactEmail && (
                                <Link href={`mailto:${hero.contactEmail}`} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 font-medium backdrop-blur-md transition-colors text-white">
                                    <Mail className="w-5 h-5 text-fuchsia-400" /> Contact
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Skills Aurora Card */}
                    <div className="md:col-span-5 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
                        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 text-fuchsia-50">
                            <Code2 className="text-fuchsia-400" /> Core Technologies
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {skills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-sm text-fuchsia-200 hover:bg-fuchsia-500/20 hover:border-fuchsia-500/40 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Experience Aurora Card */}
                    <div className="md:col-span-7 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
                        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3 text-fuchsia-50">
                            <Briefcase className="text-purple-400" /> Professional Journey
                        </h2>
                        <div className="relative pl-6 border-l border-white/10">
                            <div className="absolute top-2 -left-[5px] w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
                            <p className="text-lg font-light leading-relaxed text-fuchsia-100/70">
                                {expSummary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <section className="space-y-12">
                        <h2 className="text-4xl font-bold text-center text-fuchsia-50">Featured Architecture</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((project, i) => (
                                <div key={i} className="group bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-10 flex flex-col hover:bg-white/[0.04] transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2 relative overflow-hidden">
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/10 blur-[50px] rounded-full group-hover:bg-fuchsia-500/20 transition-colors" />
                                    
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <h3 className="text-3xl font-semibold text-fuchsia-50">{project.title}</h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-fuchsia-400 hover:text-fuchsia-100 hover:bg-fuchsia-500 transition-all backdrop-blur-md">
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-fuchsia-100/60 font-light mb-8 flex-1 leading-relaxed text-lg relative z-10">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                                        {project.techStacks?.slice(0, 4).map(tech => (
                                            <span key={tech} className="text-xs font-medium tracking-wide text-fuchsia-300 bg-fuchsia-950/50 border border-fuchsia-500/20 px-3 py-1.5 rounded-lg">
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
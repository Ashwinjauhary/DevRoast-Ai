import { Github, Briefcase, Code2, Award, Zap, Brain, Box, ExternalLink, Mail } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import Link from "next/link";

export default function SpatialLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    
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
        <div className="min-h-screen bg-[#05050a] text-zinc-100 py-24 px-4 md:px-12 font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
            {/* Spatial Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(74,43,102,0.6)_0%,rgba(13,14,21,0.8)_50%,#000_100%)]" />
                <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="max-w-6xl mx-auto space-y-16 relative z-10">
                
                {/* Hero Spatial Card */}
                <header className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col md:flex-row gap-12 items-center md:items-start relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] shrink-0">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${username}&background=random&size=200&bold=true`} 
                            alt={username} 
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium">
                                <Github className="w-4 h-4 text-purple-400" />
                                <span>@{username}</span>
                            </div>
                            <LiveIndicator status={hero?.status || "Synchronized"} template="spatial" />
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight drop-shadow-2xl">
                            {hero?.tagline}
                        </h1>
                        
                        <p className="text-xl md:text-2xl font-light text-white/70 max-w-2xl leading-relaxed">
                            {hero?.about}
                        </p>

                        <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                            <Link href={`https://github.com/${username}`} target="_blank" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl flex items-center gap-2 backdrop-blur-md transition-all shadow-lg hover:scale-105">
                                <Github className="w-5 h-5" />
                                <span className="font-medium">GitHub Profile</span>
                            </Link>
                            {hero?.contactEmail && (
                                <Link href={`mailto:${hero.contactEmail}`} className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-100 rounded-2xl flex items-center gap-2 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:scale-105">
                                    <Mail className="w-5 h-5" />
                                    <span className="font-medium">Contact</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Skills Spatial Glass */}
                    <div className="md:col-span-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                        <h2 className="text-xl font-medium mb-8 flex items-center gap-3 text-white/90">
                            <Code2 className="text-purple-400" /> Technology
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {skills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl text-sm font-light text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Experience Glass */}
                    <div className="md:col-span-8 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                        <h2 className="text-2xl font-medium mb-8 flex items-center gap-3 text-white/90">
                            <Briefcase className="text-purple-400" /> Career Trajectory
                        </h2>
                        <div className="pl-6 border-l border-white/10 relative">
                            <div className="absolute top-2 -left-[5px] w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
                            <p className="text-lg font-light leading-relaxed text-white/70">
                                {expSummary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Projects Spatial Grid */}
                {projects.length > 0 && (
                    <section className="space-y-8">
                        <h2 className="text-3xl font-light pl-4 flex items-center gap-3"><Box className="text-purple-400" /> Featured Interfaces</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((project, i) => (
                                <div key={i} className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col hover:bg-white/10 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
                                    
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <h3 className="text-2xl font-medium tracking-wide">{project.title}</h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md hover:scale-110">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-white/60 font-light mb-8 flex-1 leading-relaxed relative z-10">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="text-[10px] font-medium uppercase tracking-widest text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
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
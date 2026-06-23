import { Github, Briefcase, Code2, Award, Zap, Brain, Box, Mail, ExternalLink } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import Link from "next/link";

export default function Glass3DLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
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
        <div className="min-h-screen bg-black text-zinc-100 py-20 px-4 md:px-8 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
            
            {/* Glass 3D Background Orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-24 relative z-10">
                
                {/* Hero */}
                <header className="flex flex-col items-center text-center space-y-10 pt-12">
                    <div className="relative group cursor-default">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                        <img 
                            src={`https://ui-avatars.com/api/?name=${username}&background=0D1117&color=06B6D4&size=120&bold=true`} 
                            alt={username} 
                            className="relative w-24 h-24 rounded-full border border-white/10 shadow-2xl"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <LiveIndicator status={hero?.status || "Online"} template="glass3d" />
                            <div className="px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-cyan-300">
                                @{username}
                            </div>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                            {hero?.tagline}
                        </h1>
                        
                        <p className="text-xl md:text-2xl font-light text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                            {hero?.about}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link href={`https://github.com/${username}`} target="_blank" className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-full flex items-center gap-2 font-semibold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <Github className="w-5 h-5" />
                            GitHub
                        </Link>
                        {hero?.contactEmail && (
                            <Link href={`mailto:${hero.contactEmail}`} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center gap-2 font-medium backdrop-blur-md transition-colors text-white">
                                <Mail className="w-5 h-5 text-cyan-400" />
                                Contact
                            </Link>
                        )}
                    </div>
                </header>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-12 gap-6">
                    {/* Skills Glass Card */}
                    <div className="md:col-span-4 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl hover:bg-white/[0.05] transition-colors group">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Code2 className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-bold mb-6 text-white">Technical Arsenal</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Experience Glass Card */}
                    <div className="md:col-span-8 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl hover:bg-white/[0.05] transition-colors group">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-8 text-white">Career Profile</h2>
                        <div className="relative pl-6 border-l border-white/10">
                            <div className="absolute top-2 -left-[5px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                            <p className="text-lg font-light leading-relaxed text-zinc-400">
                                {expSummary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Projects Carousel / Grid */}
                {projects.length > 0 && (
                    <section className="space-y-10">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
                            <h2 className="text-3xl font-bold text-center flex items-center gap-3">
                                <Box className="w-8 h-8 text-cyan-400" /> 
                                Featured Work
                            </h2>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            {projects.map((project, i) => (
                                <div key={i} className="group bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col hover:bg-white/[0.08] hover:border-cyan-500/30 transition-all duration-300 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{project.title}</h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-cyan-500 hover:border-cyan-400 transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-zinc-400 font-light mb-8 flex-1 leading-relaxed relative z-10">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-auto relative z-10">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
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
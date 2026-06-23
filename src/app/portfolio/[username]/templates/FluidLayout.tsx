import { Github, Briefcase, Code2, ExternalLink, Mail, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import Link from "next/link";

export default function FluidLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
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
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-300 overflow-x-hidden relative">
            
            {/* Fluid SVG Background Blobs */}
            <div className="fixed inset-0 pointer-events-none opacity-50">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-teal-300 to-emerald-300 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-3xl animate-[spin_15s_linear_infinite]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-cyan-300 to-blue-300 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-3xl animate-[spin_20s_linear_infinite_reverse]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-24">
                
                {/* Hero */}
                <header className="flex flex-col items-center text-center space-y-10">
                    <div className="relative w-48 h-48 md:w-56 md:h-56">
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[spin_10s_linear_infinite] opacity-50 blur-md" />
                        <img 
                            src={`https://ui-avatars.com/api/?name=${username}&background=0D9488&color=ffffff&size=200&bold=true`} 
                            alt={username} 
                            className="relative w-full h-full object-cover border-4 border-white shadow-xl bg-white"
                            style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                        />
                    </div>
                    
                    <div className="space-y-6 flex flex-col items-center">
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <LiveIndicator status={hero?.status || "Online"} template="fluid" />
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-sm shadow-sm rounded-full text-sm font-bold text-teal-700">
                                <Github className="w-4 h-4" />
                                <span>@{username}</span>
                            </div>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-800 max-w-4xl leading-tight">
                            {hero?.tagline}
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-2xl leading-relaxed">
                            {hero?.about}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href={`https://github.com/${username}`} target="_blank" className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 font-bold" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}>
                            <Github className="w-5 h-5" /> GitHub Portfolio
                        </Link>
                        {hero?.contactEmail && (
                            <Link href={`mailto:${hero.contactEmail}`} className="px-8 py-4 bg-white hover:bg-slate-50 text-teal-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all border border-teal-100 flex items-center gap-2 font-bold" style={{ borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%' }}>
                                <Mail className="w-5 h-5" /> Contact Me
                            </Link>
                        )}
                    </div>
                </header>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Skills */}
                    <div className="md:col-span-4 bg-white/80 backdrop-blur-xl border border-white p-10 shadow-xl" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}>
                        <h2 className="text-2xl font-black mb-8 text-teal-800 flex items-center gap-2">
                            <Code2 /> Expertise
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 text-teal-800 font-bold text-sm hover:scale-105 transition-transform cursor-default" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Experience */}
                    <div className="md:col-span-8 bg-white/80 backdrop-blur-xl border border-white p-10 md:p-14 shadow-xl" style={{ borderRadius: '20% 80% 40% 60% / 50% 20% 80% 50%' }}>
                        <h2 className="text-2xl font-black mb-8 text-blue-800 flex items-center gap-2">
                            <Briefcase /> Career Bio
                        </h2>
                        <p className="text-lg font-medium leading-relaxed text-slate-700">
                            {expSummary}
                        </p>
                    </div>
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <section className="space-y-16 pt-8">
                        <h2 className="text-4xl font-black text-center text-slate-800">Organic Creations</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            {projects.map((project, i) => (
                                <div key={i} className="group bg-white/80 backdrop-blur-xl border border-white p-10 flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative" 
                                     style={{ borderRadius: i % 2 === 0 ? '60% 40% 30% 70% / 60% 30% 70% 40%' : '40% 60% 70% 30% / 40% 50% 60% 50%' }}>
                                    
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-3xl font-black text-slate-800 group-hover:text-teal-600 transition-colors">{project.title}</h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center hover:bg-teal-500 hover:text-white transition-colors shrink-0">
                                                <ExternalLink className="w-5 h-5" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-slate-600 font-medium mb-10 flex-1 leading-relaxed text-lg">{project.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="text-xs font-bold uppercase tracking-widest text-teal-700 bg-white border border-teal-100 px-3 py-1" style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}>
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
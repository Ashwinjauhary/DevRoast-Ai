import { Github, Briefcase, Code2, ExternalLink, Mail, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import Link from "next/link";

export default function DarkMinimalLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
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
        <div className="min-h-screen bg-black text-[#e5e5e5] font-sans selection:bg-white selection:text-black">
            
            <div className="max-w-5xl mx-auto px-6 py-32 space-y-32">
                
                {/* Header / Hero */}
                <header className="space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 border-b border-zinc-800">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${username}&background=ffffff&color=000000&size=100&bold=true`} 
                                    alt={username} 
                                    className="w-16 h-16 grayscale"
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">@{username}</h2>
                                    <div className="flex items-center mt-1">
                                        <LiveIndicator status={hero?.status || "Online"} template="dark_minimal" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href={`https://github.com/${username}`} target="_blank" className="text-zinc-500 hover:text-white transition-colors">
                                <Github className="w-6 h-6" />
                            </Link>
                            {hero?.contactEmail && (
                                <Link href={`mailto:${hero.contactEmail}`} className="text-zinc-500 hover:text-white transition-colors">
                                    <Mail className="w-6 h-6" />
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter text-white leading-[1.1]">
                            {hero?.tagline}
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-400 font-normal max-w-3xl leading-relaxed">
                            {hero?.about}
                        </p>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* Skills */}
                    <div className="space-y-8">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-zinc-800" /> Technologies
                        </h2>
                        <div className="flex flex-col gap-3">
                            {skills.map(skill => (
                                <div key={skill} className="py-3 border-b border-zinc-800 text-lg font-medium text-zinc-300 hover:text-white transition-colors hover:pl-2 cursor-default">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Experience */}
                    <div className="space-y-8">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-zinc-800" /> Biography
                        </h2>
                        <p className="text-lg text-zinc-400 font-normal leading-relaxed">
                            {expSummary}
                        </p>
                    </div>
                </div>

                {/* Projects */}
                {projects.length > 0 && (
                    <section className="space-y-16">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-zinc-800" /> Selected Works
                        </h2>
                        <div className="flex flex-col gap-12">
                            {projects.map((project, i) => (
                                <div key={i} className="group relative pl-0 hover:pl-6 transition-all duration-300">
                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-4">
                                        <h3 className="text-3xl md:text-5xl font-medium tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                                            {project.title}
                                        </h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors shrink-0">
                                                Visit <ExternalLink className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                    
                                    <p className="text-xl text-zinc-500 max-w-3xl mb-6">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="text-xs font-medium text-zinc-600">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                <footer className="pt-32 pb-8 flex justify-between items-center border-t border-zinc-900 text-sm text-zinc-600 font-medium">
                    <span>© {new Date().getFullYear()} {username}</span>
                    <span className="uppercase tracking-widest">Dark Minimal</span>
                </footer>
            </div>
        </div>
    );
}
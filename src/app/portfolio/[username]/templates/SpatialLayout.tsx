import { Github, Briefcase, Code2, Award, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";

export default function SpatialLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_30%,#4a2b66_0%,#0d0e15_50%,#111_100%)] text-zinc-100 py-20 px-6 font-sans">
            <div className="max-w-5xl mx-auto space-y-20">
                
                {/* Hero */}
                <header className="text-center space-y-8 flex flex-col items-center">
                    <LiveIndicator status={hero?.status || "Online"} template="spatial" />
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-sm font-bold tracking-wider">
                        <Github className="w-5 h-5" />
                        <span>@{username}</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                        {hero?.tagline}
                    </h1>
                    
                    <p className="text-xl max-w-2xl leading-relaxed opacity-90">
                        {hero?.about}
                    </p>
                </header>

                <div className="grid md:grid-cols-12 gap-8">
                    {/* Skills */}
                    <div className="md:col-span-4 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Code2 /> Stack</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="px-3 py-1 rounded-full text-sm font-medium border border-current opacity-80 hover:opacity-100 transition-opacity">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    {/* Experience */}
                    <div className="md:col-span-8 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-8 md:p-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase /> Experience</h2>
                        <p className="text-lg leading-relaxed opacity-90">
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

                {/* Projects */}
                {projects.length > 0 && (
                    <section className="space-y-8">
                        <h2 className="text-3xl font-bold text-center">Selected Works</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((project, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-8 flex flex-col hover:scale-[1.02] transition-transform">
                                    <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                                    <p className="opacity-80 mb-6 flex-1">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="text-xs font-bold uppercase tracking-wider opacity-60">
                                                #{tech}
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
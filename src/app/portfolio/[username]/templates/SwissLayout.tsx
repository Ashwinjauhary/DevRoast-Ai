import { Github, Briefcase, Code2, Award, Zap, Brain, Box, ExternalLink, Mail } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { CertificatesList } from "@/components/ui/certificates-list";
import Link from "next/link";

export default function SwissLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    
    return (
        <div className="min-h-screen bg-[#e30513] text-white font-sans selection:bg-black selection:text-white">
            <div className="max-w-7xl mx-auto border-l-[16px] border-white min-h-screen pl-8 py-24 md:pl-16 space-y-32">
                
                <header className="border-b-[12px] border-white pb-12 mb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                        <div className="flex items-center gap-6">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${username}&background=000000&color=ffffff&size=120&bold=true`} 
                                alt={username} 
                                className="w-24 h-24 grayscale contrast-125 object-cover border-4 border-white"
                            />
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.8] mb-2 text-white">
                                    {hero?.tagline}
                                </h1>
                                <div className="flex items-center gap-4 text-white">
                                    <div className="inline-flex items-center gap-2 font-bold text-lg">
                                        <Github className="w-6 h-6" />
                                        <span>@{username}</span>
                                    </div>
                                    <LiveIndicator status={hero?.status || "Online"} template="swiss" />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Link href={`https://github.com/${username}`} target="_blank" className="p-3 bg-white text-black hover:bg-black hover:text-white transition-colors">
                                <Github className="w-8 h-8" />
                            </Link>
                            {hero?.contactEmail && (
                                <Link href={`mailto:${hero.contactEmail}`} className="p-3 bg-white text-black hover:bg-black hover:text-white transition-colors">
                                    <Mail className="w-8 h-8" />
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                <div className="border-t-[12px] border-black pt-16">
                    <h2 className="text-4xl font-black uppercase mb-12 flex items-center gap-4">
                        <span className="w-12 h-12 bg-black text-white flex items-center justify-center">01</span>
                        Systems & Tooling
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {skills.map(skill => (
                            <span key={skill} className="bg-white text-black text-2xl font-black uppercase px-6 py-3 shadow-[8px_8px_0_#000]">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="border-t-[12px] border-black pt-16">
                    <h2 className="text-4xl font-black uppercase mb-12 flex items-center gap-4">
                        <span className="w-12 h-12 bg-black text-white flex items-center justify-center">02</span>
                        Operational History
                    </h2>
                    <div className="bg-black text-white p-12 text-2xl font-bold leading-relaxed shadow-[16px_16px_0_rgba(255,255,255,1)]">
                        {typeof experience === 'string' ? (
                            experience.startsWith('{') ? (
                                (() => {
                                    try { return (JSON.parse(experience) as any).summary || experience; } 
                                    catch { return experience; }
                                })()
                            ) : experience
                        ) : (experience as any)?.summary || "No experience summary provided."}
                    </div>
                </div>

                {projects.length > 0 && (
                    <div className="border-t-[12px] border-black pt-16">
                        <h2 className="text-4xl font-black uppercase mb-12 flex items-center gap-4">
                            <span className="w-12 h-12 bg-black text-white flex items-center justify-center">03</span>
                            Selected Works
                        </h2>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                            {projects.map((project, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="h-64 bg-white border-8 border-black mb-6 shadow-[12px_12px_0_#000] group-hover:translate-x-2 group-hover:-translate-y-2 group-hover:shadow-[20px_20px_0_#000] transition-all flex items-center justify-center">
                                        <Code2 className="w-16 h-16 text-black opacity-20" />
                                    </div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-3xl font-black uppercase mb-4">{project.title}</h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className="bg-white p-2 text-black hover:bg-black hover:text-white transition-colors">
                                                <ExternalLink className="w-6 h-6" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-xl font-bold leading-snug bg-black text-white p-4">
                                        {project.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {compatibility && (
                    <div className="border-t-[12px] border-black pt-16 pb-24">
                        <h2 className="text-4xl font-black uppercase mb-12 flex items-center gap-4">
                            <span className="w-12 h-12 bg-black text-white flex items-center justify-center">04</span>
                            Market Fit Analysis
                        </h2>
                        <div className="bg-white text-black p-8 border-8 border-black shadow-[16px_16px_0_#000]">
                            <JobCompatibilityChart data={compatibility} />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

import { Github, Briefcase, Code2, Award, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { CertificatesList } from "@/components/ui/certificates-list";

export default function SwissLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    
    return (
        <div className="min-h-screen bg-[#e30513] text-white font-sans selection:bg-black selection:text-white">
            <div className="max-w-7xl mx-auto border-l-[16px] border-white min-h-screen pl-8 py-24 md:pl-16 space-y-32">
                
                <header>
                    <div className="bg-black text-white px-4 py-2 inline-flex items-center gap-2 font-bold mb-8 uppercase tracking-widest text-sm">
                        <Github className="w-4 h-4" />
                        <span>@{username}</span>
                    </div>
                    
                    <h1 className="text-7xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.85] mb-12">
                        {hero?.tagline}
                    </h1>
                    
                    <div className="grid md:grid-cols-12 gap-8 items-start">
                        <p className="md:col-span-8 text-3xl font-bold max-w-3xl leading-tight">
                            {hero?.about}
                        </p>
                        <div className="md:col-span-4 bg-white text-black p-8 shadow-[12px_12px_0_#000]">
                            <h2 className="text-xl font-black uppercase mb-2">Architectural Profile</h2>
                            <p className="font-bold">{hero?.vibe?.title || 'Engineer'}</p>
                            <p className="text-sm mt-2 font-medium">{hero?.vibe?.description}</p>
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
                                    <h3 className="text-3xl font-black uppercase mb-4">{project.title}</h3>
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

import { Github, Briefcase, Code2, Award, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { CertificatesList } from "@/components/ui/certificates-list";

export default function NeoBrutalismLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    
    return (
        <div className="min-h-screen bg-[#fff0db] text-black font-sans selection:bg-[#ff90e8] selection:text-black font-bold pb-32 overflow-x-hidden">
            <div className="max-w-6xl mx-auto px-4 py-12 md:py-24 space-y-24">
                
                {/* Hero Header */}
                <header className="relative">
                    <div className="absolute top-12 left-8 md:-left-12 w-full h-full bg-[#ff90e8] border-4 border-black shadow-[16px_16px_0_#000] -z-10 transform rotate-1" />
                    
                    <div className="bg-white border-4 border-black p-8 md:p-16 shadow-[16px_16px_0_#000] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#ffeb3b] border-4 border-black shadow-[6px_6px_0_#000] font-black uppercase tracking-widest text-sm mb-12 transform -rotate-2">
                            <Github className="w-5 h-5" />
                            <span>@{username}</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 drop-shadow-[4px_4px_0_#ff90e8]">
                            {hero?.tagline}
                        </h1>
                        
                        <p className="text-2xl md:text-3xl font-bold max-w-3xl leading-snug bg-[#00e5ff] border-4 border-black p-6 shadow-[8px_8px_0_#000] inline-block transform rotate-1">
                            {hero?.about}
                        </p>

                        {(hero?.vibe?.title || hero?.roast) && (
                            <div className="grid md:grid-cols-2 gap-8 mt-16">
                                {hero?.vibe?.title && (
                                    <div className="bg-[#ffeb3b] border-4 border-black p-6 shadow-[8px_8px_0_#000]">
                                        <h2 className="text-xl font-black uppercase mb-2">Vibe Check</h2>
                                        <p className="text-3xl font-black uppercase">{hero.vibe.title}</p>
                                        <p className="text-lg mt-2 font-bold">{hero.vibe.description}</p>
                                    </div>
                                )}
                                {hero?.roast && (
                                    <div className="bg-[#ff5252] border-4 border-black p-6 shadow-[8px_8px_0_#000] text-white">
                                        <h2 className="text-xl font-black uppercase mb-2">AI Roast</h2>
                                        <p className="text-2xl font-black italic">"{hero.roast}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* Achievements */}
                {achievements.length > 0 && (
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {achievements.map((item, i) => (
                            <div key={i} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_#000] flex flex-col justify-center items-center text-center transform hover:-translate-y-2 hover:translate-x-2 hover:shadow-[0_0_0_#000] transition-all">
                                <span className="text-4xl font-black text-black mb-2">{item.value}</span>
                                <span className="text-sm font-bold text-black uppercase tracking-widest bg-[#00e5ff] px-2 py-1 border-2 border-black">{item.label}</span>
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills Stack */}
                <section className="relative">
                    <div className="bg-[#b2ff59] border-4 border-black p-8 md:p-12 shadow-[16px_16px_0_#000]">
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 bg-white border-4 border-black px-6 py-2 inline-block shadow-[8px_8px_0_#000] transform -rotate-2">
                            Tech Stack
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            {skills.map(skill => (
                                <span key={skill} className="bg-white text-black text-xl font-black uppercase px-6 py-3 border-4 border-black shadow-[6px_6px_0_#000] hover:bg-[#ff90e8] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_#000] transition-all cursor-pointer">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Experience */}
                <section>
                    <div className="bg-[#ff90e8] border-4 border-black p-8 md:p-12 shadow-[16px_16px_0_#000] transform rotate-1">
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 bg-white border-4 border-black px-6 py-2 inline-block shadow-[8px_8px_0_#000] transform -rotate-1">
                            Experience Log
                        </h2>
                        <div className="bg-white border-4 border-black p-8 text-2xl font-bold leading-relaxed shadow-[12px_12px_0_#000]">
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
                </section>

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <h2 className="text-5xl md:text-7xl font-black uppercase mb-16 text-center drop-shadow-[6px_6px_0_#00e5ff]">
                            Selected Works
                        </h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            {projects.map((project, i) => (
                                <div key={i} className="bg-white border-4 border-black p-8 shadow-[16px_16px_0_#000] flex flex-col group relative">
                                    <div className="absolute top-4 right-4 bg-[#b2ff59] border-4 border-black w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-[4px_4px_0_#000] group-hover:rotate-180 transition-transform">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-3xl font-black uppercase mb-6 pr-16">{project.title}</h3>
                                    <p className="text-xl font-bold leading-snug mb-8 flex-1">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="bg-[#ffeb3b] border-2 border-black px-3 py-1 text-sm font-black uppercase shadow-[2px_2px_0_#000]">
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

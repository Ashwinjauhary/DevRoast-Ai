import { Github, Briefcase, Code2, Award, Zap, Brain, Box } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";

export default function SynthwaveLayout({ portfolio, compatibility }: PortfolioTemplateProps) {
    const { username, hero, skills, projects, certificates, experience } = portfolio;
    const achievements = Array.isArray(hero?.achievements) ? hero.achievements : [];
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-pink-400 font-sans selection:bg-cyan-400 selection:text-black relative overflow-hidden pb-32">
            
            {/* 3D Perspective Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute bottom-[-10%] left-[-50%] w-[200%] h-[60%] bg-[linear-gradient(transparent_65%,#ff007f_65%),linear-gradient(90deg,transparent_65%,#00ffff_65%)] bg-[size:30px_30px] [transform:perspective(500px)_rotateX(60deg)] animate-[pulse_4s_linear_infinite]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-32">
                
                {/* Hero */}
                <header className="text-center space-y-12">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-black/50 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_10px_#00ffff,inset_0_0_10px_#00ffff] font-black uppercase tracking-widest text-sm backdrop-blur-md">
                        <Github className="w-5 h-5" />
                        <span>SYS.OP // {username}</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-widest drop-shadow-[0_0_15px_#ff007f] text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-purple-600 italic">
                        {hero?.tagline}
                    </h1>
                    
                    <p className="text-xl md:text-2xl font-mono text-cyan-400 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_0_8px_#00ffff]">
                        &gt; {hero?.about} <span className="animate-pulse">_</span>
                    </p>

                    {(hero?.vibe?.title || hero?.roast) && (
                        <div className="grid md:grid-cols-2 gap-8 mt-16 text-left">
                            {hero?.vibe?.title && (
                                <div className="bg-black/60 border-2 border-purple-500 p-8 shadow-[0_0_20px_rgba(168,85,247,0.4),inset_0_0_10px_rgba(168,85,247,0.2)] backdrop-blur-md">
                                    <h2 className="text-purple-400 text-sm font-black uppercase tracking-widest mb-4 font-mono">:: Profile</h2>
                                    <p className="text-3xl font-black uppercase text-purple-300 drop-shadow-[0_0_10px_#a855f7] italic">{hero.vibe.title}</p>
                                    <p className="text-purple-200 mt-4 font-mono">{hero.vibe.description}</p>
                                </div>
                            )}
                            {hero?.roast && (
                                <div className="bg-black/60 border-2 border-pink-500 p-8 shadow-[0_0_20px_rgba(236,72,153,0.4),inset_0_0_10px_rgba(236,72,153,0.2)] backdrop-blur-md">
                                    <h2 className="text-pink-400 text-sm font-black uppercase tracking-widest mb-4 font-mono">:: System_Scan</h2>
                                    <p className="text-xl font-mono text-pink-300">"{hero.roast}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </header>

                {/* Achievements */}
                {achievements.length > 0 && (
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {achievements.map((item, i) => (
                            <div key={i} className="bg-[#0f0c29]/80 border-2 border-cyan-500 p-6 shadow-[0_0_15px_#00ffff,inset_0_0_10px_#00ffff] flex flex-col justify-center items-center text-center backdrop-blur-md">
                                <span className="text-4xl font-black text-cyan-300 mb-2 drop-shadow-[0_0_8px_#00ffff]">{item.value}</span>
                                <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">{item.label}</span>
                            </div>
                        ))}
                    </section>
                )}

                {/* Skills Stack */}
                <section>
                    <h2 className="text-3xl md:text-5xl font-black uppercase mb-12 text-center text-cyan-400 drop-shadow-[0_0_10px_#00ffff] italic">
                        &lt; Technologies /&gt;
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {skills.map(skill => (
                            <span key={skill} className="bg-black/40 text-pink-400 font-mono uppercase px-6 py-2 border border-pink-500 shadow-[0_0_8px_#ff007f] hover:bg-pink-500/20 hover:text-pink-300 transition-all cursor-crosshair">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Experience */}
                <section className="bg-black/40 border border-purple-500 p-8 md:p-12 shadow-[0_0_30px_rgba(168,85,247,0.2),inset_0_0_20px_rgba(168,85,247,0.1)] backdrop-blur-lg">
                    <h2 className="text-2xl font-mono text-purple-400 uppercase mb-8 flex items-center gap-4">
                        <Zap className="w-6 h-6" /> Experience_Log
                    </h2>
                    <div className="text-lg md:text-xl font-mono text-purple-200 leading-relaxed">
                        {typeof experience === 'string' ? (
                            experience.startsWith('{') ? (
                                (() => {
                                    try { return (JSON.parse(experience) as any).summary || experience; } 
                                    catch { return experience; }
                                })()
                            ) : experience
                        ) : (experience as any)?.summary || "No experience summary provided."}
                    </div>
                </section>

                {/* Projects */}
                {projects.length > 0 && (
                    <section>
                        <h2 className="text-3xl md:text-5xl font-black uppercase mb-12 text-center text-pink-400 drop-shadow-[0_0_10px_#ff007f] italic">
                            // Mainframe_Uploads
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {projects.map((project, i) => (
                                <div key={i} className="bg-black/60 border-2 border-cyan-500 p-8 shadow-[0_0_20px_rgba(0,255,255,0.2)] flex flex-col group hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all backdrop-blur-md">
                                    <h3 className="text-2xl font-black uppercase mb-4 text-cyan-300 drop-shadow-[0_0_5px_#00ffff]">{project.title}</h3>
                                    <p className="text-lg font-mono text-cyan-100/70 mb-8 flex-1">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="bg-cyan-500/10 border border-cyan-500/50 px-2 py-1 text-xs font-mono uppercase text-cyan-400">
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

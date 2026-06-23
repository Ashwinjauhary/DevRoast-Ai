import { Github, Briefcase, Code2, Award, Zap, Brain, Box, Mail, ExternalLink } from "lucide-react";
import { PortfolioTemplateProps } from "../types";
import { JobCompatibilityChart } from "@/components/ui/job-compatibility-chart";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { CertificatesList } from "@/components/ui/certificates-list";
import Link from "next/link";

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
                <header className="relative z-10 pt-20 pb-12 flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between gap-12 text-center md:text-left border-b-2 border-[#ff00ff] bg-black/60 backdrop-blur-sm p-12 rounded-t-3xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#00ffff] blur-xl opacity-50 rounded-full animate-pulse" />
                            <img 
                                src={`https://ui-avatars.com/api/?name=${username}&background=ff00ff&color=ffffff&size=120&bold=true`} 
                                alt={username} 
                                className="w-24 h-24 rounded-full border-4 border-[#00ffff] relative z-10 shadow-[0_0_20px_#00ffff]"
                            />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                                <LiveIndicator status={hero?.status || "Online"} template="synthwave" />
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-[#00ffff] text-[#00ffff] font-mono text-sm tracking-widest uppercase shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                                    <Github className="w-4 h-4" />
                                    <span>@{username}</span>
                                </div>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#ff00ff] to-[#00ffff] drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] mb-4">
                                {hero?.tagline}
                            </h1>
                            <p className="text-xl md:text-2xl font-mono text-[#00ffff] max-w-2xl leading-relaxed drop-shadow-[0_0_5px_#00ffff]">
                                {hero?.about}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link href={`https://github.com/${username}`} target="_blank" className="p-4 bg-black/50 border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.8)]">
                            <Github className="w-6 h-6" />
                        </Link>
                        {hero?.contactEmail && (
                            <Link href={`mailto:${hero.contactEmail}`} className="p-4 bg-black/50 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]">
                                <Mail className="w-6 h-6" />
                            </Link>
                        )}
                    </div>
                </header>

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
                                <div key={i} className="bg-black/60 border-2 border-[#ff00ff] p-8 shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] hover:-translate-y-2 transition-all group flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ffff] opacity-10 blur-[50px] group-hover:opacity-20 transition-opacity" />
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-3xl font-black italic uppercase text-[#00ffff] pr-4 drop-shadow-[0_0_5px_#00ffff]">{project.title}</h3>
                                        {(project.liveUrl || project.url) && (
                                            <Link href={project.liveUrl || project.url || '#'} target="_blank" className="w-12 h-12 bg-black/50 border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-white flex items-center justify-center transition-all shrink-0">
                                                <ExternalLink className="w-6 h-6" />
                                            </Link>
                                        )}
                                    </div>
                                    <p className="text-lg font-mono text-zinc-300 mb-8 flex-1 leading-relaxed">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 relative z-10">
                                        {project.techStacks?.slice(0, 3).map(tech => (
                                            <span key={tech} className="bg-black border border-[#00ffff] text-[#00ffff] px-3 py-1 font-mono text-xs uppercase tracking-widest shadow-[0_0_5px_rgba(0,255,255,0.3)]">
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

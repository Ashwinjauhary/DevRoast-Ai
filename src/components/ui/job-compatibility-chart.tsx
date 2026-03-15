"use client";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Info, Target, Zap, ShieldCheck, Activity } from "lucide-react";

export function JobCompatibilityChart({ data }: { data: any }) {
    if (!data || !data.archetypes) return null;

    return (
        <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 relative group overflow-hidden shadow-2xl">
            {/* High-tech grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-mono text-[10px] uppercase tracking-[0.3em]">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Neural Identity Scan
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                        Career DNA
                    </h3>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                    <Target className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-8 font-mono">
                    {data.archetypes.map((archetype: any, i: number) => {
                        const match = archetype.matchPercentage || 0;
                        return (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-3 relative group/item cursor-help"
                                onClick={() => toast(
                                    (t) => (
                                        <div className="space-y-2">
                                            <p className="font-black text-[10px] uppercase tracking-widest text-primary">Deep Intel: {archetype.name}</p>
                                            <p className="text-xs text-zinc-300 leading-relaxed">{archetype.reasoning}</p>
                                            <p className="text-[10px] text-zinc-500 italic">Conclusion: Classic {archetype.name.toLowerCase()} behavioral patterns detected.</p>
                                        </div>
                                    ),
                                    { duration: 6000 }
                                )}
                            >
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Role Type</span>
                                        <span className="text-sm font-black text-zinc-100 uppercase tracking-tight flex items-center gap-2">
                                            {archetype.name}
                                            {match > 80 && <Zap className="w-3 h-3 text-primary" />}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black italic text-primary">
                                            {match}
                                            <span className="text-xs ml-0.5 opacity-50">%</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="h-4 w-full bg-white/5 rounded-sm overflow-hidden p-[2px] border border-white/10 group-hover/item:border-primary/50 transition-colors relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${match}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 + (i * 0.1) }}
                                        className={`h-full relative overflow-hidden ${
                                            match > 70 ? 'bg-primary shadow-[0_0_15px_rgba(255,255,255,0.3)]' : match > 40 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'bg-zinc-600'
                                        }`}
                                    >
                                        <motion.div 
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                        />
                                    </motion.div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <span className="text-[8px] font-black uppercase text-white drop-shadow-md">Click for Deep Intel</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group/box">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-primary mb-4 flex items-center gap-2">
                            <Info className="w-3 h-3" />
                            AI Synthesis Result
                        </h4>
                        <div className="space-y-4">
                            {data.archetypes.filter((a: any) => a.matchPercentage > 60).slice(0, 2).map((archetype: any, i: number) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + (i * 0.2) }}
                                    className="p-4 bg-white/5 rounded-xl border border-white/5 group-hover/box:border-primary/20 transition-colors"
                                >
                                    <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                                        <span className="text-white font-bold block mb-1 uppercase tracking-tighter">Why {archetype.name}?</span>
                                        {archetype.reasoning}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl text-center space-y-1">
                            <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-2" />
                            <div className="text-[9px] text-primary font-black uppercase tracking-widest">Confidence</div>
                            <div className="text-xl font-black text-white italic">HIGH</div>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                            <Activity className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
                            <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Stability</div>
                            <div className="text-xl font-black text-white italic">STABLE</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background glowing elements */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}

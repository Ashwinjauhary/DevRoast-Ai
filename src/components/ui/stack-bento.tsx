"use client";

import { motion } from "framer-motion";
import { Server, Layout, Database, Cpu, Globe } from "lucide-react";

interface TechItem {
  id: string;
  group: number;
  val: number;
}

interface StackBentoProps {
  data?: {
    nodes: TechItem[];
    links: any[];
  }
}

export function StackBento({ data }: StackBentoProps) {
  // Use mock data if none provided
  const nodes = data?.nodes || [
    { id: "TypeScript", group: 1, val: 20 },
    { id: "Next.js", group: 2, val: 15 },
    { id: "React", group: 2, val: 15 },
    { id: "Tailwind", group: 3, val: 10 },
    { id: "Node.js", group: 4, val: 10 },
    { id: "Prisma", group: 4, val: 12 },
    { id: "PostgreSQL", group: 5, val: 18 }
  ];

  // Map Dashboard groups to logical Bento categories
  const repos = nodes.filter(n => n.group === 1);
  const languages = nodes.filter(n => n.group === 2);
  const tools = nodes.filter(n => n.group === 3);
  const others = nodes.filter(n => n.group > 3);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-2 relative z-20">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500/60 block mb-1">Architecture_Manifest // Best_Performers</span>
          <h3 className="text-2xl font-black text-white tracking-tight italic">Top Projects Topology</h3>
        </div>
        <div className="hidden md:flex gap-4">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Neural_Scan_Active</span>
            </div>
        </div>
      </div>

      <div className="relative">
        {/* Energy Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
          <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <motion.path
              d="M 500 250 L 250 125 M 500 250 L 750 125 M 500 250 L 500 400"
              stroke="white"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
          </svg>
        </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Languages (Group 2) */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.01, rotateX: 2, rotateY: -2 }}
          className="md:col-span-2 p-6 sm:p-8 pb-12 sm:pb-16 rounded-3xl sm:rounded-[2.5rem] bg-indigo-950/20 backdrop-blur-xl border border-indigo-500/10 relative overflow-hidden group shadow-2xl min-h-[240px]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] group-hover:bg-indigo-500/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Cpu className="w-6 h-6 text-indigo-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Neural_Foundation</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {languages.length > 0 ? languages.map(n => (
                <div key={n.id} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-default group/btn">
                  <span className="text-sm font-black text-white group-hover/btn:text-indigo-400 transition-colors uppercase italic">{n.id}</span>
                </div>
              )) : (
                <>
                  <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 opacity-50 animate-pulse">
                    <span className="text-lg font-black text-zinc-700 uppercase italic">ANALYZING...</span>
                  </div>
                  <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 opacity-30">
                    <span className="text-lg font-black text-zinc-800 uppercase italic">SCANNING_DNA</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="absolute bottom-6 left-8 text-[9px] font-mono text-zinc-700 tracking-[0.2em] group-hover:text-indigo-500/40 transition-colors uppercase">
            // Primary_Logic_Processors
          </div>
        </motion.div>

        {/* Repositories (Group 1) */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.01, rotateX: -2, rotateY: 2 }}
          className="md:col-span-2 p-6 sm:p-8 pb-12 sm:pb-16 rounded-3xl sm:rounded-[2.5rem] bg-emerald-950/20 backdrop-blur-xl border border-emerald-500/10 relative overflow-hidden group shadow-2xl min-h-[240px]"
        >
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <Layout className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Active_Projects</h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {repos.length > 0 ? repos.map(n => (
                <div key={n.id} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-default group/btn">
                  <span className="text-sm font-black text-white group-hover/btn:text-emerald-400 transition-colors uppercase italic">{n.id}</span>
                </div>
              )) : (
                <span className="text-xs font-mono text-zinc-600">// INITIALIZING_REPOS...</span>
              )}
            </div>
          </div>
          <div className="absolute top-6 right-8 text-[9px] font-mono text-zinc-700 tracking-[0.2em] group-hover:text-emerald-500/40 transition-colors uppercase">
            Deploy_State: Synchronized
          </div>
        </motion.div>

        {/* Tools (Group 3) */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="md:col-span-1 p-6 sm:p-8 pb-12 sm:pb-16 rounded-3xl sm:rounded-[2.5rem] bg-rose-950/20 backdrop-blur-xl border border-rose-500/10 relative overflow-hidden group shadow-2xl min-h-[300px]"
        >
          <div className="absolute inset-0 bg-linear-to-b from-rose-500/10 to-transparent opacity-30" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <Database className="w-6 h-6 text-rose-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Utility_Vault</h4>
            </div>
            <div className="space-y-4">
              {tools.length > 0 ? tools.slice(0, 5).map(n => (
                <div key={n.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-rose-500/30 transition-all group/v">
                  <div className="text-[10px] font-black text-white mb-1 uppercase tracking-widest group-hover/v:text-rose-400 transition-colors truncate">{n.id}</div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                        className="h-full bg-rose-500/50 group-hover:bg-rose-500 transition-colors" 
                    />
                  </div>
                </div>
              )) : (
                <div className="space-y-4 w-full">
                    <div className="p-4 rounded-2xl bg-white/2 border border-white/5 opacity-40">
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 2, repeat: Infinity }} className="w-1/2 h-full bg-rose-500/20" />
                        </div>
                    </div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-6 text-[8px] font-black uppercase text-zinc-600 tracking-[0.3em]">
                Integrity_Check: Verified
            </div>
          </div>
        </motion.div>

        {/* Infrastructure/Backbone (Group 4+) */}
        <motion.div 
          variants={item}
          whileHover={{ scale: 1.01 }}
          className="md:col-span-3 p-6 sm:p-8 pb-12 sm:pb-16 rounded-3xl sm:rounded-[2.5rem] bg-amber-950/20 backdrop-blur-xl border border-amber-500/10 relative overflow-hidden group shadow-2xl min-h-[300px]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-amber-500/5 blur-[100px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <Server className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">Systems_Analysis</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {others.slice(0, 16).length > 0 ? others.slice(0, 16).map((n, idx) => (
                <div key={n.id} className="relative group/item p-4 rounded-3xl bg-white/1 border border-white/5 hover:border-amber-500/20 hover:bg-amber-500/2 transition-all duration-500 overflow-hidden flex flex-col justify-between h-[100px] shadow-sm">
                  {/* Background Neural Glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 blur-[30px] group-hover/item:bg-amber-500/10 transition-all opacity-0 group-hover/item:opacity-100" />
                  
                  <div className="flex justify-between items-start">
                    <div className="text-[6px] font-black text-zinc-600 tracking-[0.2em] uppercase italic flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-500/40 animate-pulse" />
                      SYSTEM_{idx.toString().padStart(2, '0')}
                    </div>
                    <div className="text-[6px] font-mono text-amber-500/20 group-hover/item:text-amber-500/40 transition-colors uppercase">
                      0x{(n.id.length * 11).toString(16).toUpperCase()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] font-black text-white group-hover/item:text-amber-300 transition-all uppercase italic leading-tight truncate" title={n.id.replace(/^(AUDIT_|PROFILE_|SYS_)/, '').replace(/_/g, ' ')}>
                      {n.id.replace(/^(AUDIT_|PROFILE_|SYS_)/, '').replace(/_/g, ' ')}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                       <div className="flex-1 h-[3px] flex gap-[2px]">
                          {[1, 2, 3, 4, 5, 6].map((b) => (
                            <motion.div 
                              key={b}
                              initial={{ opacity: 0.05 }}
                              whileInView={{ opacity: [0.1, 0.5, 0.1] }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                delay: (idx * 0.1) + (b * 0.2),
                                ease: "easeInOut"
                              }}
                              className="flex-1 bg-amber-500/60 rounded-[1px]"
                            />
                          ))}
                       </div>
                       <div className="text-[5px] font-black text-zinc-700 group-hover/item:text-amber-500/40 transition-colors uppercase tracking-widest">Active</div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-4 flex flex-col items-center justify-center h-32 border border-dashed border-white/5 rounded-[2.5rem] bg-white/2 gap-4">
                     <div className="flex gap-3">
                         <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 opacity-50 animate-pulse">
                            <span className="text-lg font-black text-zinc-700 uppercase italic">AWAITING_NEURAL_EXPANSION...</span>
                         </div>
                     </div>
                     <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-[0.4em]">Background_Process: Idling</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="absolute bottom-4 right-8 flex items-center gap-4">
             <div className="text-[8px] font-mono text-zinc-800 tracking-[0.4em] uppercase group-hover:text-zinc-500 transition-colors underline decoration-amber-500/20 decoration-2 underline-offset-4">Distributed_Compute_Active</div>
             <Globe className="w-3 h-3 text-zinc-800 animate-spin-slow group-hover:text-amber-500/40" />
          </div>
        </motion.div>
      </motion.div>
    </div>
    </div>
  );
}

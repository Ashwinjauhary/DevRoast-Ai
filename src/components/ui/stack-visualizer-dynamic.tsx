"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

export const DynamicStackVisualizer = dynamic<{ data?: any }>(
    () => import("./stack-visualizer").then((mod) => mod.StackVisualizer),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[350px] md:h-[450px] rounded-[2rem] border border-white/5 bg-[#050505] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-20" />
                <Loader2 className="w-8 h-8 text-primary animate-spin relative z-10" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500 relative z-10">Initializing WebGL Engine...</span>
            </div>
        )
    }
);

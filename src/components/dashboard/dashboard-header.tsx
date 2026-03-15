"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/animated-text";
import { ShieldAlert } from "lucide-react";

export function DashboardHeader() {
    return (
        <div className="flex flex-col gap-4 relative z-10 mb-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 w-fit backdrop-blur-md"
            >
                <ShieldAlert className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent drop-shadow-[0_0_8px_rgba(var(--accent),0.8)]">System Override Active</span>
            </motion.div>

            <AnimatedText
                text="Command Center"
                className="text-3xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />

            <motion.p
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-lg md:text-2xl text-zinc-400 font-medium max-w-2xl"
            >
                Welcome back, Commander. Your <span className="text-white font-bold tracking-tight">code architecture</span> is currently under critical evaluation.
            </motion.p>
        </div>
    );
}


"use client";

import { motion } from "framer-motion";

interface ImpactStatsProps {
    score: number;
}

export function ImpactStats({ score }: ImpactStatsProps) {
    return (
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score * 10}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
            />
        </div>
    );
}

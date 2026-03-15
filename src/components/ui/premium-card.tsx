"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    glowColor?: "primary" | "secondary" | "accent" | "none";
}

export function PremiumCard({
    children,
    className,
    glowColor = "primary",
    ...props
}: PremiumCardProps) {
    const glowStyles = {
        primary: "group-hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]",
        secondary: "group-hover:shadow-[0_0_30px_-5px_rgba(var(--secondary),0.3)]",
        accent: "group-hover:shadow-[0_0_30px_-5px_rgba(var(--accent),0.3)]",
        none: "",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-px",
                className
            )}
            {...props}
        >
            {/* Border Gradient edge */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/0 opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative h-full w-full rounded-[0.95rem] bg-zinc-950/40 backdrop-blur-xl p-6 glass">
                {/* Subtle internal glow */}
                <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-3xl"
                    style={{ background: glowColor !== 'none' ? `var(--${glowColor})` : 'transparent', opacity: 0.05 }} />

                {children}
            </div>
        </motion.div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowUp } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function BackButton() {
    const router = useRouter();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isLanding = pathname === "/";
    const isAuthPage = pathname?.includes("/auth/") || pathname === "/auth";
    
    // Hide completely on auth pages, show on landing only when scrolled, show elsewhere always
    const isVisible = !isAuthPage && (!isLanding || scrolled);

    const handleClick = () => {
        if (isLanding) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            router.back();
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClick}
                    className="fixed top-24 right-5 z-[100] group md:right-10"
                    aria-label={isLanding ? "Scroll to top" : "Go back"}
                >
                    <div className="relative p-3 rounded-xl glass-darker border border-white/10 hover:border-primary/50 transition-all duration-300 shadow-2xl group-hover:shadow-primary/20">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity rounded-xl" />
                        
                        <div className="relative flex items-center justify-center">
                            {isLanding ? (
                                <ArrowUp className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                            ) : (
                                <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                            )}
                        </div>

                        {/* Text Label (Hidden on small screens, shown on hover/desktop) */}
                        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                {isLanding ? "To_Top" : "Previous_Module"}
                            </span>
                        </div>
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}

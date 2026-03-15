"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function TypingText({ text, speed = 50, delay = 0 }: { text: string; speed?: number; delay?: number }) {
    const [displayedText, setDisplayedText] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsStarted(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;
        
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, isStarted]);

    return (
        <span className="relative">
            {displayedText}
            {isStarted && displayedText.length < text.length && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-1.5 h-5 bg-emerald-500 ml-1 align-middle"
                />
            )}
        </span>
    );
}

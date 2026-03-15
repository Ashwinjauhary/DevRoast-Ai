"use client";

import { useEffect, useState } from "react";
import { Activity, Clock } from "lucide-react";

export function LiveIndicator({ status, template }: { status: string; template: string }) {
    const [time, setTime] = useState("");
    const [ping, setPing] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setPing(Math.floor(Math.random() * (45 - 15 + 1) + 15));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const isHacker = template === 'hacker';
    const isBlueprint = template === 'blueprint';
    const isCyberpunk = template === 'cyberpunk';

    return (
        <div className={`flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.2em] px-4 py-2 border rounded-full backdrop-blur-md transition-all duration-500 ${
            isHacker ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' :
            isBlueprint ? 'border-white/20 bg-white/5 text-blue-200' :
            isCyberpunk ? 'border-black bg-white text-black font-black shadow-[4px_4px_0px_rgba(0,0,0,1)]' :
            'border-white/10 bg-white/5 text-zinc-400'
        }`}>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                    isHacker ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                    isCyberpunk ? 'bg-red-500' : 'bg-primary'
                }`} />
                <span className="opacity-50">Status:</span>
                <span className="font-bold">{status}</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-6">
                <Clock className="w-3 h-3 opacity-40" />
                <span className="opacity-50">Local_Time:</span>
                <span className="tabular-nums">{time || "--:--:--"}</span>
            </div>

            <div className="hidden md:flex items-center gap-2 border-l border-white/10 pl-6">
                <Activity className="w-3 h-3 opacity-40" />
                <span className="opacity-50">Ping:</span>
                <span className="tabular-nums text-primary">{ping}ms</span>
            </div>
        </div>
    );
}

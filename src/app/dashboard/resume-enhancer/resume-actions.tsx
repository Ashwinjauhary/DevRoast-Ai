"use client";

import { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";

export function ResumeActions({ bullets }: { bullets: string[] }) {
    const [copied, setCopied] = useState(false);

    function copyAll() {
        navigator.clipboard.writeText(bullets.map(b => `▹ ${b}`).join("\n"));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <button
            onClick={copyAll}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-300 hover:bg-white/10 transition-all"
        >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy All"}
        </button>
    );
}

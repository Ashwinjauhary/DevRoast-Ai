"use client";

import { useState } from "react";
import { Award, ChevronDown, ChevronUp, ExternalLink, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface Certificate {
    id: string;
    title: string;
    file_url: string;
    created_at: string;
}

interface CertificatesListProps {
    certificates: Certificate[];
    template: string;
}

export function CertificatesList({ certificates, template }: CertificatesListProps) {
    const [showAll, setShowAll] = useState(false);
    
    if (!certificates || certificates.length === 0) return null;

    const displayedCertificates = showAll ? certificates : certificates.slice(0, 6);
    const hasMore = certificates.length > 6;

    const isDark = !['minimalist', 'cyberpunk'].includes(template);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {displayedCertificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative p-6 border transition-all duration-500 overflow-hidden ${
                                template === 'neon' ? 'bg-black border-white/5 hover:border-primary/50 rounded-[2rem]' : 
                                template === 'minimalist' ? 'bg-white border-zinc-200 shadow-sm rounded-xl' : 
                                template === 'cyberpunk' ? 'bg-white text-black border-4 border-black rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)]' :
                                template === 'blueprint' ? 'bg-blue-900/10 border-2 border-dashed border-white/10 rounded-none' :
                                template === 'hacker' ? 'bg-[#050505] border border-emerald-500/20 p-4' :
                                template === 'prism' ? 'bg-white/2 border-white/10 backdrop-blur-3xl rounded-[2.5rem]' :
                                template === 'aura' ? 'bg-violet-950/40 border border-violet-500/20 rounded-[2rem]' :
                                'bg-[#0a0a0a] border border-white/10 rounded-xl'
                            }`}
                        >
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl ${
                                        template === 'neon' ? 'bg-primary/10 text-primary' :
                                        template === 'hacker' ? 'bg-emerald-500/10 text-emerald-500' :
                                        'bg-white/5 text-zinc-400'
                                    }`}>
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <a 
                                        href={cert.file_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`p-2 rounded-xl transition-colors ${
                                            isDark ? 'hover:bg-white/10 text-zinc-500 hover:text-white' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900'
                                        }`}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                                <div>
                                    <h4 className={`font-bold leading-tight ${
                                        template === 'cyberpunk' ? 'uppercase italic text-lg' : 'text-lg'
                                    }`}>
                                        {cert.title}
                                    </h4>
                                    <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2">
                                        Verified: {formatDate(cert.created_at)}
                                    </p>
                                </div>
                                
                                {cert.file_url.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 mt-4">
                                        <FileText className="w-3 h-3" /> Digital Copy (PDF)
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-xl overflow-hidden aspect-4/3 bg-black/40 border border-white/5 transition-transform duration-500 group-hover:scale-105 relative">
                                        <Image 
                                            src={cert.file_url} 
                                            alt={cert.title} 
                                            fill
                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className={`inline-flex items-center gap-2 px-8 py-3 font-black uppercase tracking-widest transition-all ${
                            template === 'neon' ? 'bg-white/5 text-white hover:bg-white/10 rounded-2xl border border-white/10' :
                            template === 'cyberpunk' ? 'bg-black text-white px-6 py-2 shadow-[4px_4px_0px_white]' :
                            template === 'hacker' ? 'text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/5' :
                            'bg-white/5 text-zinc-400 hover:text-white rounded-xl'
                        }`}
                    >
                        {showAll ? (
                            <>Collapse <ChevronUp className="w-4 h-4" /></>
                        ) : (
                            <>Show All ({certificates.length}) <ChevronDown className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

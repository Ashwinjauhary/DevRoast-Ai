"use client";

import { motion } from "framer-motion";
import { Trophy, Crown, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface LeaderboardUser {
    rank: number;
    id: string; // The analysis ID, useful for linking directly to the roast
    userId: string;
    name: string;
    username: string;
    image: string | null;
    score: number;
    date: Date;
}

export function LeaderboardTable({ data, currentUserId }: { data: LeaderboardUser[], currentUserId: string }) {
    if (data.length === 0) {
        return (
            <div className="py-20 text-center text-zinc-500 font-bold uppercase tracking-widest border border-dashed border-white/10 rounded-3xl mt-8">
                No scores recorded yet. Be the first to get roasted!
            </div>
        );
    }

    return (
        <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden mt-8 shadow-2xl relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-50" />
            
            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 uppercase tracking-widest text-[10px] text-zinc-500 font-black">
                            <th className="px-8 py-6 w-24 text-center">Rank</th>
                            <th className="px-8 py-6">Developer</th>
                            <th className="px-8 py-6 text-center">Score</th>
                            <th className="px-8 py-6 text-right">Time</th>
                            <th className="px-8 py-6 w-32"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((user, i) => (
                            <motion.tr
                                key={user.userId}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`border-b border-white/5 transition-colors ${user.userId === currentUserId ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-white/2"}`}
                            >
                                <td className="px-8 py-6">
                                    <div className="flex justify-center">
                                        {user.rank === 1 ? (
                                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30">
                                                <Crown className="w-5 h-5" />
                                            </div>
                                        ) : user.rank === 2 ? (
                                            <div className="w-10 h-10 rounded-full bg-zinc-300/20 text-zinc-300 flex items-center justify-center border border-zinc-300/30">
                                                <Trophy className="w-4 h-4" />
                                            </div>
                                        ) : user.rank === 3 ? (
                                            <div className="w-10 h-10 rounded-full bg-amber-700/20 text-amber-600 flex items-center justify-center border border-amber-700/30">
                                                <Trophy className="w-4 h-4" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center font-black">
                                                #{user.rank}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        {user.image ? (
                                            <Image src={user.image} alt={user.username} width={40} height={40} className="rounded-full border border-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/10 uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-white text-base">{user.name}</p>
                                                {user.userId === currentUserId && (
                                                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-primary text-white">You</span>
                                                )}
                                            </div>
                                            <Link href={`https://github/${user.username}`} target="_blank" className="text-xs text-zinc-500 hover:text-primary transition-colors">
                                                @{user.username}
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex justify-center items-center gap-2">
                                        <span className={`text-2xl font-black ${user.score >= 8 ? 'text-emerald-400' : user.score >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {user.score.toFixed(1)}
                                        </span>
                                        <span className="text-zinc-600 font-bold">/ 10</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                                        {formatDistanceToNow(new Date(user.date))} ago
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link 
                                        href={`/dashboard/history?view=${user.id}`}
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 hover:text-primary text-zinc-400 transition-colors border border-white/5"
                                        title="View Roast"
                                    >
                                        <Zap className="w-4 h-4" />
                                    </Link>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

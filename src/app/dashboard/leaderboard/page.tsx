import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AnimatedText } from "@/components/ui/animated-text";
import { Trophy, Medal, Star, UserCircle2 } from "lucide-react";
import { LeaderboardTable } from "./leaderboard-table";

export default async function LeaderboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    // Fetch highest profile score per user
    // Prisma doesn't support SELECT DISTINCT ON, so we fetch top profile analyses
    // and distinct them in memory.
    const allProfileAnalyses = await prisma.analysis.findMany({
        where: { analysis_type: "profile" },
        orderBy: { score: "desc" },
        include: {
            user: {
                select: {
                    name: true,
                    github_username: true,
                    image: true,
                }
            }
        }
    });

    // Keep only the highest score per user
    const userBestScores = new Map<string, any>();
    for (const analysis of allProfileAnalyses) {
        if (!analysis.user) continue;
        const userId = analysis.user_id;
        if (!userBestScores.has(userId)) {
            userBestScores.set(userId, analysis);
        }
    }

    // Convert to array, sort by score descending, take top 50
    const topUsers = Array.from(userBestScores.values())
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 50)
        .map((a, index) => ({
            rank: index + 1,
            id: a.id,
            userId: a.user_id,
            name: a.user.name || a.user.github_username || "Unknown Dev",
            username: a.user.github_username,
            image: a.user.image,
            score: a.score,
            date: a.created_at
        }));

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-5xl mx-auto pb-24">
            <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-4">
                    <Trophy className="w-5 h-5" />
                    <span className="font-black text-xs tracking-widest uppercase">Global Rankings</span>
                </div>
                <AnimatedText text="Developer Leaderboard" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 font-light italic max-w-2xl">
                    The absolute pinnacle of code quality. See how your highest roast score stacks up against the rest of the world.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { title: "Your Rank", value: topUsers.findIndex(u => u.userId === session.user.id) + 1 || "Unranked", icon: Medal, color: "text-blue-400" },
                    { title: "Total Contenders", value: userBestScores.size, icon: UserCircle2, color: "text-emerald-400" },
                    { title: "Average Score", value: (Array.from(userBestScores.values()).reduce((acc, curr) => acc + (curr.score || 0), 0) / userBestScores.size || 0).toFixed(1), icon: Star, color: "text-purple-400" }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.title}</p>
                            <p className="text-4xl font-black text-white">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-8 h-8" />
                        </div>
                    </div>
                ))}
            </div>

            <LeaderboardTable data={topUsers} currentUserId={session.user.id} />
        </div>
    );
}

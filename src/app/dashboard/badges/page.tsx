import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ALL_BADGES, computeEarnedBadges } from "@/lib/badges";
import { AnimatedText } from "@/components/ui/animated-text";
import { PremiumCard } from "@/components/ui/premium-card";
import { Trophy, Lock } from "lucide-react";

export default async function BadgesPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            analyses: { orderBy: { created_at: "asc" } },
            chats: true,
            portfolios: true,
            badges: true,
        },
    });

    if (!dbUser) redirect("/auth/signin");

    const existingBadgeIds = dbUser.badges.map((b: any) => b.badge_id);
    const earnedIds = computeEarnedBadges({
        analyses: dbUser.analyses,
        chats: dbUser.chats,
        portfolios: dbUser.portfolios,
        existingBadges: existingBadgeIds,
    });

    // Persist any newly earned badges
    const newlyEarned = earnedIds.filter(id => !existingBadgeIds.includes(id));
    if (newlyEarned.length > 0) {
        await prisma.userBadge.createMany({
            data: newlyEarned.map(badge_id => ({ user_id: session.user.id!, badge_id })),
            skipDuplicates: true,
        });
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-5xl mx-auto pb-24">
            <div className="space-y-4">
                <AnimatedText text="Achievement Badges" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 font-light italic">
                    {earnedIds.length}/{ALL_BADGES.length} unlocked — Keep grinding, legend.
                </p>
            </div>

            {/* Progress Bar */}
            <PremiumCard glowColor="primary">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Trophy className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-black tracking-tight">Collection Progress</h3>
                        </div>
                        <span className="text-primary font-black text-2xl">{Math.round((earnedIds.length / ALL_BADGES.length) * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-1000 rounded-full"
                            style={{ width: `${(earnedIds.length / ALL_BADGES.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        <span>0 Badges</span>
                        <span>{earnedIds.length} Earned</span>
                        <span>{ALL_BADGES.length} Total</span>
                    </div>
                </div>
            </PremiumCard>

            {/* Badge Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ALL_BADGES.map((badge) => {
                    const earned = earnedIds.includes(badge.id);
                    return (
                        <div
                            key={badge.id}
                            className={`relative group p-6 rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center space-y-3 ${
                                earned
                                    ? "bg-white/4 border-white/10 hover:bg-white/8 hover:-translate-y-1"
                                    : "bg-black/20 border-white/3 opacity-40 grayscale"
                            }`}
                        >
                            {!earned && (
                                <div className="absolute top-3 right-3">
                                    <Lock className="w-3 h-3 text-zinc-700" />
                                </div>
                            )}
                            {earned && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            )}
                            <span className="text-4xl">{badge.icon}</span>
                            <div>
                                <p className={`font-black text-sm ${earned ? badge.color : "text-zinc-600"}`}>{badge.name}</p>
                                <p className="text-[10px] text-zinc-600 mt-1 leading-relaxed">{badge.description}</p>
                            </div>
                            {earned && (
                                <div className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">EARNED</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

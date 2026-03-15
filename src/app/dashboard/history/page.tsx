import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TerminalSquare, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { HistoryList } from "@/components/dashboard/history-list";
import { AnimatedText } from "@/components/ui/animated-text";
import Link from "next/link";

export default async function HistoryPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const analyses = await prisma.analysis.findMany({
        where: {
            NOT: {
                analysis_type: "job_compatibility"
            }
        },
        orderBy: { created_at: "desc" },
        take: 50
    });

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-zinc-100 max-w-6xl mx-auto pb-24">
            <div className="space-y-4">
                <AnimatedText text="Analysis Archive" className="text-5xl font-black tracking-tighter text-white" />
                <p className="text-xl text-zinc-500 font-light italic">Your history of architectural catastrophes and rare wins.</p>
            </div>

            {analyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-vh-[60vh] py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] text-center space-y-8">
                    <div className="p-8 bg-zinc-900/50 rounded-full border border-white/5">
                        <ShieldAlert className="w-16 h-16 text-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black tracking-tight text-white uppercase italic">Zero Evidence Found</h3>
                        <p className="max-w-xs mx-auto text-zinc-500 font-medium italic">You haven't been audited yet. Perhaps your code is hiding in the shadows?</p>
                    </div>
                    <Link href="/dashboard" className="px-10 py-4 bg-white text-black rounded-2xl font-black hover:scale-105 transition-transform active:scale-95">
                        START FIRST SCAN
                    </Link>
                </div>
            ) : (
                <HistoryList analyses={analyses} />
            )}
        </div>
    );
}


import type { Metadata } from "next";
import Link from "next/link";
import { TerminalSquare, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the DevRoast AI Terms of Service. By using DevRoast AI, you agree to these terms governing AI code review, roast analysis, and GitHub profile usage.",
};


export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-primary/30">
            <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[3rem_3rem] pointer-events-none" />
            
            <header className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <TerminalSquare className="w-6 h-6 text-primary" />
                        <span className="font-black tracking-tighter text-white">DevRoast AI</span>
                    </Link>
                    <Link href="/auth/signin" className="text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
                        Authenticate
                    </Link>
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-6 py-24 max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
                </Link>

                <h1 className="text-5xl font-black tracking-tighter text-white mb-4">Terms of Service</h1>
                <p className="text-zinc-500 font-medium mb-12 italic">Last Updated: March 15, 2026</p>

                <div className="space-y-12 text-lg leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-primary mb-4">1. Acceptance of Terms</h2>
                        <p>Welcome to the gauntlet. By entering DevRoast AI, you agree to these terms. If you can't handle the heat, stay out of the terminal.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-secondary mb-4">2. The Roast Protocol</h2>
                        <p>All analysis data, scores, and roasts are AI-generated. We provide zero guarantees of professional "kindness". We aim for objective, data-driven brutality to encourage better engineering practices.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-accent mb-4">3. User Responsibility</h2>
                        <p>You are responsible for any code you submit for review. Do not upload secrets, credentials, or proprietary company code that you do not have permission to share.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-white mb-4">4. Limitation of Liability</h2>
                        <p>DevRoast AI is not responsible for any ego damage, failed interviews, or architectural realizations that lead to career changes. Use at your own risk.</p>
                    </section>

                    <section className="p-8 border border-white/10 rounded-3xl bg-white/2 backdrop-blur-md">
                        <p className="text-sm text-zinc-500 italic">
                            Licensed under MIT. Respect the code, improve the craft.
                        </p>
                    </section>
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 py-12 text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
                &copy; 2026 DevRoast AI. ROAST WITH CAUTION.
            </footer>
        </div>
    );
}

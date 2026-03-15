import Link from "next/link";
import { TerminalSquare, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-primary/30">
            <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
            
            <header className="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <TerminalSquare className="w-6 h-6 text-primary" />
                        <span className="font-black tracking-tighter text-white">DEVROAST.AI</span>
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

                <h1 className="text-5xl font-black tracking-tighter text-white mb-4">Privacy Policy</h1>
                <p className="text-zinc-500 font-medium mb-12 italic">Last Updated: March 15, 2026</p>

                <div className="space-y-12 text-lg leading-relaxed font-medium">
                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-primary mb-4">1. Information We Collect</h2>
                        <p>We only collect information about you if we have a reason to do so—for example, to provide our services, to communicate with you, or to make our services better.</p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-zinc-400">
                            <li><span className="text-white">Account Information</span>: Email, name, and profile picture from OAuth providers.</li>
                            <li><span className="text-white">GitHub Data</span>: Public profile metadata and activity stats.</li>
                            <li><span className="text-white">AI Interactions</span>: Code snippets and chat logs processed by Groq/SambaNova.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-secondary mb-4">2. How We Use Information</h2>
                        <p>Your data is used specifically to fuel the interrogation engine. We generate roasts, calculate performance metrics, and provide AI mentorship. We do not use your source code for LLM training.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase tracking-widest text-accent mb-4">3. Data Security</h2>
                        <p>We leverage industry-standard encryption and secure tunnels to protect your identity. Your GitHub tokens are never stored in plaintext and are used only for the duration of the analysis.</p>
                    </section>

                    <section className="p-8 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-md">
                        <p className="text-sm text-zinc-500 italic">
                            By using DevRoast AI, you acknowledge that your architectural sins will be exposed. This is for your growth.
                        </p>
                    </section>
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 py-12 text-center text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
                &copy; 2026 DEVROAST AI. ROAST WITH CAUTION.
            </footer>
        </div>
    );
}

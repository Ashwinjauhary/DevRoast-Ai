"use client";

// Note: metadata must be in a server component (parent layout or a dedicated server wrapper).
// We keep this client component as-is; SEO metadata is inherited from root layout.
// Per-page SEO for /auth/signin is handled by adding a generateMetadata to a
// server page wrapper if needed. Current layout title template covers this.

import { signIn } from "next-auth/react";
import { Github, AlertCircle, TerminalSquare, Shield } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const [loading, setLoading] = useState<"github" | "google" | "credentials" | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (provider: "github" | "google" | "credentials") => {
        setLoading(provider);
        if (provider === "credentials") {
            await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
        } else {
            await signIn(provider, { callbackUrl: "/dashboard" });
        }
    };

    return (
        <>
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center gap-3 text-red-400 text-sm animate-in zoom-in-95 w-full backdrop-blur-sm shadow-xl shadow-red-500/5">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">Authentication failed or cancelled. Try again.</span>
                </div>
            )}

            <div className="space-y-4 w-full mt-4">
                <form onSubmit={(e) => { e.preventDefault(); handleLogin("credentials"); }} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            suppressHydrationWarning
                            className="w-full h-12 bg-zinc-900/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all placeholder:text-zinc-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            suppressHydrationWarning
                            className="w-full h-12 bg-zinc-900/50 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-green-500 transition-all placeholder:text-zinc-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!!loading}
                        suppressHydrationWarning
                        className="group relative w-full h-12 bg-green-500 hover:bg-green-600 text-black rounded-xl font-bold text-sm flex items-center justify-center transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading === "credentials" ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <span>Sign In / Create Account</span>
                        )}
                    </button>
                </form>

                <div className="relative flex items-center py-4">
                    <div className="grow border-t border-white/10"></div>
                    <span className="shrink-0 mx-4 text-xs font-medium uppercase text-zinc-600 tracking-widest">Or continue with</span>
                    <div className="grow border-t border-white/10"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button
                        onClick={() => handleLogin("github")}
                        disabled={!!loading}
                        suppressHydrationWarning
                        className="group relative w-full h-14 bg-white hover:bg-zinc-100 text-black rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        {loading === "github" ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        ) : (
                            <Github className="w-5 h-5" />
                        )}
                        <span>Continue with GitHub</span>
                    </button>

                    <button
                        onClick={() => handleLogin("google")}
                        disabled={!!loading}
                        suppressHydrationWarning
                        className="group relative w-full h-14 bg-zinc-900/50 hover:bg-zinc-800/80 border border-white/10 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {loading === "google" ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        <span>Google</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-black flex font-sans text-zinc-100 selection:bg-green-500/30">
            {/* Left Panel - Branding & Visuals */}
            <div className="hidden lg:flex w-1/2 relative bg-[#050505] flex-col justify-between p-12 border-r border-white/5 overflow-hidden">
                {/* Background Grid & Glow */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

                <Link href="/" className="relative z-10 flex items-center gap-2 w-fit group">
                    <TerminalSquare className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-extrabold text-2xl tracking-tighter text-white">DevRoast<span className="text-green-400">.ai</span></span>
                </Link>

                <div className="relative z-10 space-y-6 max-w-md">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold tracking-widest uppercase text-zinc-400 backdrop-blur-md">
                        <Shield className="w-3 h-3 text-green-400" /> Secure Login
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-linear-to-br from-white via-zinc-200 to-zinc-500">
                        Prepare for the brutal truth.
                    </h1>
                    <p className="text-lg text-zinc-400 font-light leading-relaxed">
                        Connect your GitHub to let our LLaMA 3 70B engine analyze your architectural sins, expose your flaws, and dynamically generate your developer scorecard.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-sm font-mono text-zinc-600">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-${900 - i * 100} flex items-center justify-center`}>
                                <Github className="w-4 h-4 text-zinc-500" />
                            </div>
                        ))}
                    </div>
                    <p>Join thousands of criticized developers.</p>
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative">
                <div className="w-full max-w-sm flex flex-col items-center gap-8 relative z-10">
                    {/* Mobile Header (Hidden on Desktop) */}
                    <div className="lg:hidden flex flex-col items-center space-y-4 mb-4">
                        <Link href="/" className="flex items-center justify-center w-14 h-14 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl shadow-green-500/10">
                            <TerminalSquare className="w-7 h-7 text-green-400" />
                        </Link>
                        <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
                    </div>

                    <div className="w-full text-center lg:text-left space-y-2 hidden lg:block">
                        <h2 className="text-3xl font-bold tracking-tight text-white">Get Started</h2>
                        <p className="text-zinc-500 text-sm">Create an account or sign in to continue.</p>
                    </div>

                    <Suspense fallback={<div className="w-full h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>}>
                        <SignInForm />
                    </Suspense>

                    <div className="pt-8 text-center text-xs text-zinc-500 max-w-[280px]">
                        By proceeding, you agree to our <Link href="/terms" className="text-zinc-300 hover:text-white underline underline-offset-4 pointer-events-auto">Terms of Service</Link> and <Link href="/privacy" className="text-zinc-300 hover:text-white underline underline-offset-4 pointer-events-auto">Privacy Policy</Link>.
                    </div>
                </div>
            </div>

        </div>
    );
}

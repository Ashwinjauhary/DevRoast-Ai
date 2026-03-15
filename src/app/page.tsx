"use client";

import Link from "next/link";
import { Github, Code2, TerminalSquare, ArrowRight, Shield, GitBranch, Cpu, Star, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { NeuralBg } from "@/components/ui/neural-bg";
import React from "react";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-primary/30">

      {/* Immersive Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute inset-0 noise-bg mix-blend-overlay opacity-40" />

        {/* Animated Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-float" />
        <div className="absolute bottom-[10%] right-[-5%] w-[60vw] h-[60vw] bg-accent/20 rounded-full blur-[150px] mix-blend-screen animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[20%] w-[50vw] h-[50vw] bg-secondary/15 rounded-full blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: '4s' }} />
        
        <NeuralBg />

        {/* Dynamic Grid Pattern (Defined in App globals.css globally, but we can add a subtle vignette here) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
      </motion.div>

      <header className="fixed top-0 inset-x-0 border-b border-white/5 bg-black/40 backdrop-blur-2xl z-50 transition-all">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 group"
          >
            <div className="relative flex items-center gap-2 bg-white/[0.03] px-4 py-2 rounded-xl border border-white/10 glass-darker group-hover:border-primary/50 transition-colors">
              <TerminalSquare className="w-5 h-5 text-primary group-hover:text-white transition-colors animate-pulse" />
              <span className="font-black tracking-tighter text-white text-lg lg:text-xl">DEVROAST<span className="text-secondary opacity-80">_AI</span></span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
            <Link href="#how-it-works" className="hover:text-white transition-colors">Architecture</Link>
            <Link href="#features" className="hover:text-white transition-colors">Diagnostics</Link>
            <Link href="/auth/signin" className="hover:text-white transition-colors">Authenticate</Link>
            <Link href="/auth/signin" className="group relative px-6 py-3 rounded-2xl overflow-hidden bg-white text-black font-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
              <span className="relative z-10 flex items-center gap-2">INITIALIZE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </nav>

          {/* Mobile Entry */}
          <Link href="/auth/signin" className="md:hidden px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
            AUTHENTICATE
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-40 md:pt-52 pb-24">
        {/* Dynamic Hero Section */}
        <section className="px-6 max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/50 border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-400 glass backdrop-blur-3xl shadow-2xl"
          >
            <div className="relative flex items-center justify-center w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-secondary"></span>
            </div>
            <span>Deep Code Analysis Active</span>
          </motion.div>

          <div className="space-y-8 relative">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[80vw] h-40 bg-primary/20 blur-[100px] rounded-[100%] pointer-events-none" />

            <AnimatedText
              text="ARCHITECTURAL DESTRUCTION."
              className="text-[14vw] md:text-[8rem] lg:text-[9rem] font-black tracking-tighter leading-[0.85] text-white mix-blend-overlay opacity-90 block"
            />
            <AnimatedText
              delay={0.4}
              text="ELEVATED INTELLIGENCE."
              className="text-[10vw] md:text-[5rem] lg:text-[6rem] font-black tracking-tighter leading-[0.9] text-gradient-primary block mt-4"
            />

            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-medium mt-12"
            >
              The definitive AI analysis engine that rips apart your codebase with <span className="text-white italic">zero mercy</span>. Exposing structural flaws, legacy dependencies, and copy-pasted logic.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 w-full sm:w-auto relative z-20"
          >
            <Link href="/auth/signin" className="group relative w-full sm:w-auto flex items-center justify-center gap-4 bg-white text-black px-12 py-6 rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_60px_rgba(var(--primary),0.3)] border border-white/20">
              <Github className="w-6 h-6" />
              <span className="relative z-10 tracking-widest uppercase text-sm">Target Your GitHub</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link href="#demo" className="group w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 rounded-2xl font-black tracking-widest uppercase text-sm border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-300 transition-all backdrop-blur-xl glass-darker">
              <Sparkles className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
              <span>View Interrogation</span>
            </Link>
          </motion.div>

          {/* Ultra-Premium Dashboard Mockup */}
          <motion.div
            id="demo"
            initial={{ opacity: 0, y: 150, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ perspective: "2000px" }}
            className="w-full max-w-6xl mx-auto mt-40 relative z-20"
          >
            {/* Massive Underglow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-primary/30 via-accent/20 to-secondary/10 rounded-[3rem] blur-[80px] opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-30 pointer-events-none" />

            <div className="relative bg-[#020202]/90 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl transform-gpu">

              {/* Sleek Mac-like Header */}
              <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center px-8 gap-4 relative">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 px-4 py-1.5 rounded-full border border-white/5">
                  <Shield className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">DevRoast Interrogation Terminal v3.0</span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-8 md:p-16 h-[500px] flex flex-col justify-between relative">
                {/* Fake Scanline */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_20px_rgba(var(--primary),1)] animate-[scan_3s_ease-in-out_infinite]" />

                <div className="font-mono text-xs md:text-sm text-zinc-400 space-y-6 flex-1">
                  <div className="flex items-center gap-4 mb-12">
                    <span className="animate-pulse w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_rgba(var(--secondary),1)]"></span>
                    <span className="text-secondary font-black uppercase tracking-[0.3em]">Connecting to GitHub API...</span>
                  </div>

                  {[
                    { c: "primary", t: "Target locked: github.com/OverconfidentDev..." },
                    { c: "zinc", t: "Fetching repository metadata..." },
                    { c: "accent", t: "WARNING: High concentration of 'fix' commits detected." },
                    { c: "secondary", t: "Analyzing React architecture..." },
                    { c: "accent", t: "ERROR: Prop drilling depth exceeded 15 levels. What are you doing?" },
                  ].map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.3) }}
                      className="flex items-start gap-4"
                    >
                      <span suppressHydrationWarning className={`text-${log.c === 'zinc' ? 'zinc-600' : log.c} opacity-50 shrink-0 select-none`}>{`[${new Date().toISOString().split('T')[1].slice(0, 8)}]`}</span>
                      <span className={`text-${log.c === 'zinc' ? 'zinc-400' : log.c === 'accent' ? 'accent font-bold' : log.c === 'secondary' ? 'secondary font-bold' : 'white'}`}>{log.t}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Dramatic Score Reveal */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, filter: "blur(20px)" }}
                  whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 2, duration: 1, type: "spring" }}
                  className="mt-8 p-1 bg-gradient-to-r from-accent via-primary to-accent rounded-3xl"
                >
                  <div className="bg-black rounded-[1.4rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                    <div className="space-y-4">
                      <div className="text-accent text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></div> FATAL DIAGNOSIS REACHED</div>
                      <h3 className="text-4xl md:text-6xl text-white font-black tracking-tighter mix-blend-difference">Score: <span className="text-accent">2.4</span><span className="text-zinc-600 text-3xl">/10</span></h3>
                    </div>
                    <Link href="/auth/signin" className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 text-center w-full md:w-auto">
                      <span className="relative z-10">Repair Dignity</span>
                      <div className="absolute inset-0 bg-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 max-w-7xl mx-auto mt-64">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white">Surgical Precision.</h2>
            <p className="text-xl md:text-3xl text-zinc-500 max-w-4xl mx-auto font-medium italic">We don't just insult your code. We deconstruct it using highly advanced logic analysis models.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <GitBranch className="w-10 h-10 text-primary" />, title: "Vector Graph Analysis", desc: "We map your directory chaos, detect circular dependencies, and objectively judge your terrifying folder structure.", color: "primary" },
              { icon: <Star className="w-10 h-10 text-secondary" />, title: "Quantified Skill Rating", desc: "Get a brutal percentile mapping against 5M+ developers. Discover if your code is actually production-ready.", color: "secondary" },
              { icon: <Cpu className="w-10 h-10 text-accent" />, title: "AI Guided Remediation", desc: "Receive direct architectural refactoring steps from an AI Mentor. We show you exactly how to stop writing garbage.", color: "accent" },
            ].map((feature, i) => (
              <PremiumCard
                key={i}
                glowColor={feature.color as any}
                transition={{ delay: i * 0.15 }}
                className="group"
              >
                <div className="w-20 h-20 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-10 glass-darker group-hover:border-white/20 transition-colors">
                  {React.cloneElement(feature.icon as React.ReactElement, { className: `w-10 h-10 text-${feature.color}` } as any)}
                </div>
                <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium">{feature.desc}</p>
              </PremiumCard>
            ))}
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 bg-black py-32 text-center text-zinc-500 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-12 opacity-50 hover:opacity-100 transition-opacity cursor-default">
            <TerminalSquare className="w-8 h-8 text-white" />
            <span className="font-black tracking-tighter text-2xl text-white">DEVROAST.AI</span>
          </div>
          <p className="text-base max-w-md mx-auto leading-relaxed mb-16 font-medium italic">
            Engineered to destroy egos and elevate codebases. Proceed at your own risk.
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-xs font-black uppercase tracking-[0.3em]">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="https://github.com/Ashwinjauhary/DevRoast-Ai#readme" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="https://github.com/Ashwinjauhary/DevRoast-Ai" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


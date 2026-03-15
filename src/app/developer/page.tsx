"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
    Github, 
    Linkedin, 
    Mail, 
    Phone, 
    MapPin, 
    GraduationCap, 
    Code2, 
    Database, 
    Layers, 
    Cpu, 
    ExternalLink, 
    TerminalSquare,
    Briefcase,
    Zap,
    Trophy,
    ArrowRight,
    Star
} from "lucide-react";
import Link from "next/link";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { NeuralBg } from "@/components/ui/neural-bg";
import Image from "next/image";

const skills = [
    { category: "Programming", items: ["JavaScript (ES6+)", "TypeScript", "Python", "C", "C++"], icon: <TerminalSquare className="w-5 h-5 text-primary" /> },
    { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Bootstrap", "Framer Motion"], icon: <Layers className="w-5 h-5 text-secondary" /> },
    { category: "Backend", items: ["Node.js", "Express.js"], icon: <Cpu className="w-5 h-5 text-accent" /> },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "SQLite"], icon: <Database className="w-5 h-5 text-primary" /> },
    { category: "Tools", items: ["Git", "GitHub", "Vercel", "Figma", "VS Code", "Cursor"], icon: <Code2 className="w-5 h-5 text-secondary" /> },
];

const projects = [
    {
        title: "ClubSphere",
        desc: "College club management platform with role-based system.",
        tech: ["React", "TypeScript", "Supabase", "PostgreSQL"],
        features: ["Event management", "Role based authentication", "Approval workflows"]
    },
    {
        title: "Catalyst Crew Website",
        desc: "Production-ready company website with SEO optimization.",
        tech: ["React", "TypeScript", "Tailwind", "Vercel"],
        features: ["SEO", "Performance", "Modern UI"]
    },
    {
        title: "Hi-Tech Portfolio",
        desc: "High performance developer portfolio with advanced animations.",
        tech: ["React", "Vite", "Tailwind", "Framer Motion"],
        features: ["60fps Animations", "Responsive", "Glassmorphism"]
    },
    {
        title: "SolarFlow Viz",
        desc: "3D workflow visualization platform.",
        tech: ["React", "Three.js", "React Three Fiber"],
        features: ["3D Rendering", "Interactive Nodes", "Real-time Viz"]
    },
    {
        title: "Invoicyy",
        desc: "GST billing and invoice generator.",
        tech: ["Python", "Streamlit", "SQLite"],
        features: ["GST calculation", "PDF generation", "UPI workflows"]
    }
];

const experience = [
    {
        role: "Codester Club",
        org: "PSIT College",
        desc: "Organized technical events, managed workshops and club activities."
    },
    {
        role: "Full Stack Developer",
        org: "Catalyst Crew",
        desc: "Built production web applications, worked on architecture and deployments."
    },
    {
        role: "Outreach Lead",
        org: "Posterwa",
        desc: "User outreach and product feedback analysis."
    }
];

export default function DeveloperProfilePage() {
    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-primary/30">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <NeuralBg />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
            </div>

            <main className="relative z-10 container mx-auto px-6 py-20 max-w-7xl">
                {/* Header/Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Back to Command Center
                    </Link>
                </motion.div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
                            <Shield className="w-3 h-3" /> Root Access Verified
                        </div>
                        <AnimatedText 
                            text="ASHWIN JAUHARY" 
                            className="text-5xl md:text-8xl font-black tracking-tighter mb-4"
                        />
                        <div className="text-2xl md:text-3xl font-bold text-zinc-400 mb-8 italic">
                            Full Stack Architect <span className="text-zinc-800">//</span> Performance Engineer
                        </div>
                        <p className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-3xl mb-12">
                            Specializing in modern JavaScript ecosystems, high-performance frontend architectures, and scalable real-time systems. Building the future, one node at a time.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ContactItem icon={<Mail className="w-4 h-4" />} label="Email" value="ashwin2431333@gmail.com" href="mailto:ashwin2431333@gmail.com" />
                            <ContactItem icon={<Phone className="w-4 h-4" />} label="Network" value="+91-9555681211" href="tel:+919555681211" />
                            <ContactItem icon={<Github className="w-4 h-4" />} label="Repositories" value="GitHub/ashwinjauhary" href="https://github.com/ashwinjauhary" />
                            <ContactItem icon={<Linkedin className="w-4 h-4" />} label="Professional" value="LinkedIn/ashwin-jauhary" href="https://linkedin.com/in/ashwin-jauhary" />
                            <ContactItem icon={<MapPin className="w-4 h-4" />} label="Location" value="UP, India" />
                            <ContactItem icon={<GraduationCap className="w-4 h-4" />} label="Education" value="BCA Candidate '27" />
                        </div>
                    </motion.div>

                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative group rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl transform -rotate-2 hover:rotate-0 transition-transform duration-700"
                        >
                            <div className="aspect-[4/5] relative">
                                <Image 
                                    src="/Developer.png" 
                                    alt="Ashwin Jauhary" 
                                    fill 
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            </div>
                            <div className="absolute bottom-10 left-10 right-10">
                                <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-2">Subject_Profile</div>
                                <div className="h-1 w-20 bg-primary" />
                            </div>
                        </motion.div>

                        <PremiumCard glowColor="accent" className="p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                <Zap className="w-3 h-3 text-accent" /> Statistics
                            </h3>
                            <div className="space-y-6">
                                <StatItem label="Real-world Applications" value="10+" />
                                <StatItem label="Systems Architected" value="04" />
                                <StatItem label="Integrity Score" value="9.8" />
                            </div>
                        </PremiumCard>
                    </div>
                </div>

                {/* Skills Grid */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-0.5 flex-1 bg-white/5" />
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
                            <TerminalSquare className="w-4 h-4" /> Neural_Stack_Infrastructure
                        </h2>
                        <div className="h-0.5 flex-1 bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {skills.map((s, idx) => (
                            <PremiumCard key={idx} glowColor={idx % 3 === 0 ? "primary" : idx % 3 === 1 ? "secondary" : "accent"} className="p-6 h-full">
                                <div className="mb-4">{s.icon}</div>
                                <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4">{s.category}</h4>
                                <ul className="space-y-2">
                                    {s.items.map((item, i) => (
                                        <li key={i} className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </PremiumCard>
                        ))}
                    </div>
                </section>

                {/* Projects Bento */}
                <section className="mb-24">
                   <div className="flex items-center gap-4 mb-12">
                        <div className="h-0.5 flex-1 bg-white/5" />
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3">
                            <Briefcase className="w-4 h-4" /> Artifact_Deployment_Logs
                        </h2>
                        <div className="h-0.5 flex-1 bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((p, idx) => (
                            <PremiumCard key={idx} className="group h-full flex flex-col">
                                <div className="p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-black italic">{p.title}</h3>
                                        <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium">
                                        {p.desc}
                                    </p>
                                    <div className="mt-auto">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {p.tech.map((t, i) => (
                                                <span key={i} className="text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-400">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="space-y-2">
                                            {p.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                                    <div className="w-1.5 h-[1px] bg-primary/50" />
                                                    {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </PremiumCard>
                        ))}
                    </div>
                </section>

                {/* Experience & Community */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-12 flex items-center gap-3">
                            <Trophy className="w-4 h-4 text-accent" /> Professional_Evolution
                        </h2>
                        <div className="space-y-8">
                            {experience.map((ex, idx) => (
                                <div key={idx} className="relative pl-8 border-l border-white/5">
                                    <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent),0.5)]" />
                                    <div className="mb-1 text-[10px] font-black text-accent uppercase tracking-widest">{ex.org}</div>
                                    <h4 className="text-2xl font-black mb-3">{ex.role}</h4>
                                    <p className="text-zinc-500 font-medium leading-relaxed italic">{ex.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 mb-12 flex items-center gap-3">
                            <Star className="w-4 h-4 text-secondary" /> Core_Integrity_Matrix
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <StrengthBadge text="Scalable Architecture" />
                            <StrengthBadge text="Modern Frontend Engineering" />
                            <StrengthBadge text="API Development" />
                            <StrengthBadge text="Cloud Deployments" />
                            <StrengthBadge text="UI/UX Focused" />
                            <StrengthBadge text="Team Collaboration" />
                        </div>

                        <div className="mt-12 p-8 rounded-[2rem] bg-secondary/5 border border-secondary/20 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                               <Shield className="w-16 h-16 text-secondary" />
                           </div>
                           <p className="text-sm font-bold text-zinc-400 leading-relaxed italic relative z-10">
                               "Design is not just what it looks like and feels like. Design is how it works. And performance is the invisible soul of design."
                           </p>
                        </div>
                    </section>
                </div>

                {/* Footer Link */}
                <footer className="text-center pt-12 border-t border-white/5">
                    <AnimatedText text="ESTABLISHED MMXXVI" className="text-[10px] font-black text-zinc-800 tracking-[1em]" />
                </footer>
            </main>
        </div>
    );
}

function ContactItem({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string, href?: string }) {
    const Content = (
        <div className="flex items-center gap-4 group/item cursor-pointer">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover/item:border-primary/50 group-hover/item:bg-primary/5 transition-all text-zinc-500 group-hover/item:text-primary">
                {icon}
            </div>
            <div>
                <div className="text-[10px] font-black uppercase text-zinc-600 tracking-tighter mb-0.5">{label}</div>
                <div className="text-sm font-bold text-zinc-300 group-hover/item:text-white transition-colors truncate">{value}</div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} target={href.startsWith('http') ? '_blank' : undefined}>{Content}</Link>;
    }
    return Content;
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">{label}</span>
            <span className="text-xl font-black text-white">{value}</span>
        </div>
    );
}

function StrengthBadge({ text }: { text: string }) {
    return (
        <div className="px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-secondary/30 hover:bg-secondary/5 transition-all group">
            <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white transition-colors flex items-center gap-3 tracking-widest">
                <div className="w-2 h-[1px] bg-secondary" /> {text}
            </span>
        </div>
    );
}

function Shield(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    );
}

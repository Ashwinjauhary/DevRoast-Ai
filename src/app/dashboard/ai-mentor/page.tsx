"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TerminalSquare, User, Loader2, Send } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function AiMentorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Welcome, commander. I've finished auditing your repositories. To put it mildly: your architectural choices are interesting. I'm here to help you refactor this mess, or just provide a brutal reality check. What's on your mind?"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] })
            });

            if (!response.ok) throw new Error("Connection lost in the void.");

            const data = await response.json();

            if (data.message) {
                setMessages(prev => [...prev, data.message as Message]);
            } else {
                throw new Error("Invalid intelligence format.");
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error processing your request. Even the AI is struggling with this logic. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-2">
                <AnimatedText text="AI Mentor" className="text-5xl font-black tracking-tighter text-gradient-secondary" />
                <p className="text-lg text-zinc-500 font-medium italic">High-frequency architectural guidance and brutal honesty.</p>
            </div>

            <div className="flex-1 min-h-0 relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="h-full flex flex-col bg-white/2 border border-white/5 rounded-[2.5rem] glass overflow-hidden shadow-2xl">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex gap-4 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === "assistant"
                                        ? "bg-secondary/20 text-secondary border border-secondary/30"
                                        : "bg-primary/20 text-primary border border-primary/30"
                                        }`}>
                                        {msg.role === "assistant" ? <TerminalSquare className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </div>

                                    <div className={`max-w-[85%] md:max-w-[70%] rounded-[2rem] px-6 py-4 text-base leading-relaxed ${msg.role === "assistant"
                                        ? "bg-white/3 border border-white/5 text-zinc-300 glass-darker rounded-tl-none"
                                        : "bg-primary text-white shadow-[0_10px_30px_rgba(var(--primary),0.3)] rounded-tr-none font-medium"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0">
                                    <TerminalSquare className="w-5 h-5 text-secondary animate-pulse" />
                                </div>
                                <div className="bg-white/3 border border-white/5 rounded-[2rem] rounded-tl-none px-6 py-4 flex items-center gap-3 text-zinc-400 glass-darker">
                                    <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                                    <span className="text-sm font-black uppercase tracking-widest italic">Calculating your worth...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 md:p-8 bg-black/40 border-t border-white/5 backdrop-blur-xl">
                        <form onSubmit={handleSubmit} className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Consult the mentor about your architectural decisions..."
                                className="w-full bg-white/3 border border-white/10 rounded-3xl py-5 pl-8 pr-24 text-base text-zinc-100 focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all placeholder:text-zinc-700 glass-darker font-medium"
                                disabled={loading}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="bg-white text-black hover:bg-zinc-200 h-auto py-3 px-6 rounded-2xl font-black transition-all hover:-translate-x-1"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="flex items-center gap-2">SEND <Send className="w-4 h-4" /></div>}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <p className="text-center text-[10px] font-black tracking-[0.3em] text-zinc-700 uppercase">
                The AI Mentor is currently operational. Proceed with caution.
            </p>
        </div>
    );
}

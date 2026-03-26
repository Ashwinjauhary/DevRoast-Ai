"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { NeuralBg } from "@/components/ui/neural-bg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative flex h-screen bg-black text-white overflow-hidden selection:bg-primary/30 font-sans">
            {/* Background elements */}
            <div className="absolute inset-0 noise-bg z-0" />
            <NeuralBg />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="relative z-10 flex-1 overflow-y-auto bg-transparent flex flex-col">
                {/* Mobile Header Bar */}
                <header className="lg:hidden flex items-center justify-between px-6 h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="font-black tracking-tighter text-white">DEVROAST</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white hover:bg-white/10"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                </header>

                <div className="container mx-auto p-4 md:p-8 lg:p-12 max-w-7xl animate-in fade-in duration-1000 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}

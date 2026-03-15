import { Sidebar } from "@/components/layout/sidebar";
import { NeuralBg } from "@/components/ui/neural-bg";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex h-screen bg-black text-white overflow-hidden selection:bg-primary/30">
            {/* Background elements */}
            <div className="absolute inset-0 noise-bg z-0" />
            <NeuralBg />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <Sidebar />

            <main className="relative z-10 flex-1 overflow-y-auto bg-transparent">
                <div className="container mx-auto p-6 md:p-12 max-w-7xl animate-in fade-in duration-1000">
                    {children}
                </div>
            </main>
        </div>
    );
}

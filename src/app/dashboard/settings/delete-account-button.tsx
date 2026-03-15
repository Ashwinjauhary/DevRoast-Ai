"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { deleteAccount } from "./actions";
import { toast } from "react-hot-toast";

export function DeleteAccountButton() {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        toast((t) => (
            <div className="flex flex-col gap-4">
                <p className="text-xs font-black text-white uppercase tracking-tighter">
                    TERMINATE ACCOUNT? <br/>
                    <span className="text-red-400 opacity-80 lowercase font-medium italic">All data will be purged. This is final.</span>
                </p>
                <div className="flex gap-2 justify-end">
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all"
                    >
                        Abort
                    </button>
                    <button 
                        onClick={() => {
                            toast.dismiss(t.id);
                            startTransition(async () => {
                                await deleteAccount();
                            });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all font-bold"
                    >
                        PURGE DATA
                    </button>
                </div>
            </div>
        ), { duration: 8000, position: "top-center" });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center justify-center gap-2 shrink-0 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-black uppercase tracking-widest hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-50"
        >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Account
        </button>
    );
}

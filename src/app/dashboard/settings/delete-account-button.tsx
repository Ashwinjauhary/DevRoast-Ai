"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { deleteAccount } from "./actions";

export function DeleteAccountButton() {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you sure? This will permanently delete your account and ALL data. This cannot be undone.")) {
            return;
        }
        startTransition(async () => {
            await deleteAccount();
        });
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

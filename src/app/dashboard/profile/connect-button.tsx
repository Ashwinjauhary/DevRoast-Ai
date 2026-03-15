"use client";

import { handleGithubSignIn } from "./actions";
import { Button } from "@/components/ui/button";

export function ConnectButton() {
    return (
        <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
            onClick={async () => {
                console.log("Connect button clicked");
                await handleGithubSignIn();
            }}
        >
            Connect
        </Button>
    );
}

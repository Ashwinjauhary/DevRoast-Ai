"use server";

import { signIn } from "@/auth";

export async function handleGithubSignIn() {
    try {
        console.log("Initiating GitHub Sign-In...");
        await signIn("github", { redirectTo: "/dashboard/profile" });
    } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error("GitHub Sign-In Error:", error);
        throw error;
    }
}

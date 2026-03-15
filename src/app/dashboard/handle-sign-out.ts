"use server";

import { signOut } from "@/auth";

export async function handleSignOut() {
    console.log("Server Action: handleSignOut triggered");
    try {
        await signOut({ redirectTo: "/auth/signin" });
    } catch (error) {
        // NextAuth redirects by throwing a special error, so we should re-throw it
        // but we can log that we are here.
        console.log("Sign out redirecting...");
        throw error;
    }
}

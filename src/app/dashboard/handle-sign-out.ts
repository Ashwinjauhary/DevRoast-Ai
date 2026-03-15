"use server";

import { signOut } from "@/auth";

export async function handleSignOut() {
    console.log("Server Action: handleSignOut triggered");
    try {
        await signOut({ 
            redirectTo: "/auth/signin",
            redirect: true 
        });
    } catch (error) {
        console.log("Sign out in progress or encountered redirect error...");
        throw error;
    }
}

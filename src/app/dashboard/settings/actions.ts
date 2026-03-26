"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function deleteAccount() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await prisma.user.delete({ where: { id: session.user.id } });

    // Sign out and redirect
    await signOut({ redirectTo: "/" });
}

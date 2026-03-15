"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function createApiKey(name: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };
    if (!name || name.trim().length < 2) return { error: "Key name must be at least 2 characters." };

    // Count existing keys
    const existingCount = await (prisma as any).apiKey.count({
        where: { user_id: session.user.id }
    });
    if (existingCount >= 5) return { error: "Maximum 5 API keys allowed. Delete one to create a new one." };

    // Generate a secure token
    const rawToken = `drk_${crypto.randomBytes(32).toString("hex")}`;
    const prefix = rawToken.slice(0, 12); // "drk_" + 8 chars
    const keyHash = await bcrypt.hash(rawToken, 10);

    await (prisma as any).apiKey.create({
        data: {
            user_id: session.user.id,
            name: name.trim(),
            key_hash: keyHash,
            prefix,
        }
    });

    revalidatePath("/dashboard/settings/api-keys");
    // Return the raw token ONCE — it will never be shown again
    return { success: true, token: rawToken, prefix };
}

export async function deleteApiKey(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const key = await (prisma as any).apiKey.findUnique({ where: { id } });
    if (!key || key.user_id !== session.user.id) return { error: "Key not found." };

    await (prisma as any).apiKey.delete({ where: { id } });
    revalidatePath("/dashboard/settings/api-keys");
    return { success: true };
}

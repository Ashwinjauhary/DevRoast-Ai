"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function createApiKey(name: string): Promise<{ error?: string; token?: string; prefix?: string; success?: boolean }> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: "Unauthorized" };
    if (!name || name.trim().length < 2) return { error: "Key name must be at least 2 characters." };

    // Count existing keys
    const prismaWithKeys = prisma as unknown as { apiKey: { count: (args: { where: { user_id: string } }) => Promise<number>, create: (args: { data: { user_id: string, name: string, key_hash: string, prefix: string } }) => Promise<unknown>, delete: (args: { where: { id: string } }) => Promise<unknown>, findUnique: (args: { where: { id: string } }) => Promise<{ user_id: string } | null> } };
    const existingCount = await prismaWithKeys.apiKey.count({
        where: { user_id: userId }
    });
    if (existingCount >= 5) return { error: "Maximum 5 API keys allowed. Delete one to create a new one." };

    // Generate a secure token
    const rawToken = `drk_${crypto.randomBytes(32).toString("hex")}`;
    const prefix = rawToken.slice(0, 12); // "drk_" + 8 chars
    const keyHash = await bcrypt.hash(rawToken, 10);

    await prismaWithKeys.apiKey.create({
        data: {
            user_id: userId,
            name: name.trim(),
            key_hash: keyHash,
            prefix,
        }
    });

    revalidatePath("/dashboard/settings/api-keys");
    // Return the raw token ONCE — it will never be shown again
    return { success: true, token: rawToken, prefix };
}

export async function deleteApiKey(id: string): Promise<{ success?: boolean; error?: string }> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { error: "Unauthorized" };

    const prismaWithKeys = prisma as unknown as { apiKey: { findUnique: (args: { where: { id: string } }) => Promise<{ user_id: string } | null>, delete: (args: { where: { id: string } }) => Promise<unknown> } };
    const key = await prismaWithKeys.apiKey.findUnique({ where: { id } });
    if (!key || key.user_id !== userId) return { error: "Key not found." };

    await prismaWithKeys.apiKey.delete({ where: { id } });
    revalidatePath("/dashboard/settings/api-keys");
    return { success: true };
}

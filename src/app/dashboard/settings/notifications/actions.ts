"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const DEFAULT_PREFS = {
    analysisComplete: true,
    weeklyDigest: false,
    portfolioViewed: true,
    aiMentorTips: false,
};

export async function updateNotificationPrefs(prefs: Record<string, boolean>) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    await (prisma.user as any).update({
        where: { id: session.user.id },
        data: { notifications: prefs }
    });

    revalidatePath("/dashboard/settings/notifications");
    return { success: "Notification preferences saved!" };
}

export async function getNotificationPrefs() {
    const session = await auth();
    if (!session?.user?.id) return DEFAULT_PREFS;

    const user = await (prisma.user as any).findUnique({
        where: { id: session.user.id },
        select: { notifications: true }
    });

    const saved = (user?.notifications as Record<string, boolean>) || {};
    return { ...DEFAULT_PREFS, ...saved };
}

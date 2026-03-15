"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function updateName(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const name = formData.get("name") as string;
    if (!name || name.trim().length < 2) return { error: "Name must be at least 2 characters." };

    await prisma.user.update({
        where: { id: session.user.id },
        data: { name: name.trim() }
    });

    revalidatePath("/dashboard/settings/security");
    return { success: "Display name updated!" };
}

export async function updatePassword(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!newPassword || newPassword.length < 8) return { error: "New password must be at least 8 characters." };
    if (newPassword !== confirmPassword) return { error: "Passwords do not match." };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "User not found." };

    // OAuth-only users have no password
    if (!user.password) {
        return { error: "Your account uses social login (GitHub/Google). You cannot set a password here." };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { error: "Current password is incorrect." };

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
    });

    return { success: "Password updated successfully!" };
}

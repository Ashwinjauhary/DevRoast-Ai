"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getSnippets() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const snippets = await prisma.snippet.findMany({
        where: { user_id: session.user.id },
        orderBy: { created_at: "desc" },
    });
    return { snippets };
}

export async function deleteSnippet(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    await prisma.snippet.delete({ where: { id, user_id: session.user.id } });
    return { success: true };
}

export async function saveSnippet(title: string, code: string, language: string, notes?: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const snippet = await prisma.snippet.create({
        data: { user_id: session.user.id, title, code, language, notes },
    });
    return { snippet };
}

export async function updateSnippet(id: string, title: string, code: string, language: string, notes?: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const snippet = await prisma.snippet.update({
        where: { id, user_id: session.user.id },
        data: { title, code, language, notes },
    });
    return { snippet };
}

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ApiKeyClient from "./api-key-client";

export default async function ApiKeysPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const prismaWithKeys = prisma as unknown as { apiKey: { findMany: (args: { where: { user_id: string }, orderBy: { created_at: string }, select: { id: boolean, name: boolean, prefix: boolean, created_at: boolean } }) => Promise<Array<{ id: string, name: string, prefix: string, created_at: Date }>> } };
    const keys = await prismaWithKeys.apiKey.findMany({
        where: { user_id: session.user.id },
        orderBy: { created_at: "desc" },
        select: { id: true, name: true, prefix: true, created_at: true }
    });

    return <ApiKeyClient keys={keys} />;
}

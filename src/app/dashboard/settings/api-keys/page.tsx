import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ApiKeyClient from "./api-key-client";

export default async function ApiKeysPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const keys = await (prisma as any).apiKey.findMany({
        where: { user_id: session.user.id },
        orderBy: { created_at: "desc" },
        select: { id: true, name: true, prefix: true, created_at: true }
    });

    return <ApiKeyClient keys={keys} />;
}

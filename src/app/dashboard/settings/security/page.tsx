import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SecurityClient from "./security-client";

export default async function SecurityPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, password: true }
    });

    return <SecurityClient userName={user?.name ?? null} hasPassword={!!user?.password} />;
}

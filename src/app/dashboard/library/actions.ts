"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function getLibraryAssets() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const assets = await prisma.libraryAsset.findMany({
        where: { user_id: session.user.id },
        orderBy: { created_at: "desc" },
    });
    return { assets };
}

export async function getCloudinarySignature() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        { 
            timestamp, 
            folder: "devroast_library",
        },
        process.env.CLOUDINARY_API_SECRET!
    );

    return {
        signature,
        timestamp,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
    };
}

export async function saveLibraryAsset(type: "NOTE" | "CERTIFICATE", title: string, content?: string, file_url?: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const asset = await prisma.libraryAsset.create({
        data: { 
            user_id: session.user.id, 
            type, 
            title, 
            content, 
            file_url 
        },
    });
    return { success: true, asset };
}

export async function updateLibraryAsset(id: string, title: string, content?: string, file_url?: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const asset = await prisma.libraryAsset.update({
        where: { id, user_id: session.user.id },
        data: { title, content, file_url },
    });
    return { success: true, asset };
}

export async function deleteLibraryAsset(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    await prisma.libraryAsset.delete({
        where: { id, user_id: session.user.id },
    });
    return { success: true };
}

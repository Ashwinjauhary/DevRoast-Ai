import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Validates a DevRoast API key from an Authorization header.
 * Supports: "Authorization: Bearer drk_xxxxxxxx..."
 *
 * Returns the user_id and githubAccessToken if the key is valid, null otherwise.
 */
export async function validateApiKey(authHeader: string | null): Promise<{
    userId: string;
    githubAccessToken: string | null;
} | null> {
    if (!authHeader || !authHeader.startsWith("Bearer drk_")) return null;

    const rawToken = authHeader.slice(7); // strip "Bearer "

    // Find candidate keys by prefix (first 12 chars = "drk_" + 8)
    const prefix = rawToken.slice(0, 12);
    const candidates = await (prisma as any).apiKey.findMany({
        where: { prefix },
        select: { key_hash: true, user_id: true }
    });

    for (const candidate of candidates) {
        const valid = await bcrypt.compare(rawToken, candidate.key_hash);
        if (valid) {
            // Fetch the GitHub access token for this user so routes can call GitHub API
            const account = await prisma.account.findFirst({
                where: { userId: candidate.user_id, provider: "github" },
                select: { access_token: true }
            });
            return {
                userId: candidate.user_id,
                githubAccessToken: account?.access_token ?? null,
            };
        }
    }

    return null;
}

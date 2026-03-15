import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    providers: [
        ...authConfig.providers,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user) {
                    const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials.email as string,
                            password: hashedPassword,
                        }
                    });
                    return {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                    };
                }

                if (!user.password) return null;

                const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);
                if (!isPasswordValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            }
        }),
    ],
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            console.log("Session Callback - Token:", { sub: token.sub, github: token.github_username });
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.accessToken = token.accessToken as string | undefined;
                session.user.github_username = token.github_username as string | undefined;
            }
            return session;
        },
        async jwt({ token, user, profile, account }) {
            // Initial sign in
            if (user) {
                token.sub = user.id;
                // If user object has github_username (from DB), persist it to token
                if ((user as any).github_username) {
                    token.github_username = (user as any).github_username;
                }
            }
            
            // If currently signing in with GitHub, ensure we have the latest username
            if (account?.provider === "github" && (profile as any)?.login) {
                token.github_username = (profile as any).login as string;
                token.accessToken = account.access_token;
            } else if (account) {
                // For other providers, still persist the access token if needed
                token.accessToken = account.access_token;
            }
            
            return token;
        },
    },
    events: {
        async linkAccount({ user, profile, account }) {
            console.log("linkAccount Event Triggered", { userId: user.id, provider: account.provider });
            if (account.provider === "github" && (profile as any)?.login) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { github_username: (profile as any).login as string }
                });
                console.log("Updated github_username in DB via linkAccount");
            }
        },
        async signIn({ user, account, profile }) {
            // Ensure github_username is synced on every GitHub sign in
            if (account?.provider === "github" && (profile as any)?.login) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { github_username: (profile as any).login as string }
                });
                console.log("Synced github_username in DB via signIn");
            }
        },
    }
});

import { type DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            accessToken?: string
            github_username?: string
        } & DefaultSession["user"]
    }

    interface User {
        id?: string
        github_username?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
        github_username?: string
        sub?: string
    }
}

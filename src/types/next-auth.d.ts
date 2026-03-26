import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            accessToken?: string;
            github_username?: string;
        } & DefaultSession["user"];
    }

    interface User {
        github_username?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        github_username?: string;
    }
}

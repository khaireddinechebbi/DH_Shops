import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string;
        username?: string;
        userCode?: string;
    }

    interface Session {
        user: {
            id?: string;
            username?: string;
            userCode?: string;
            sub?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        username?: string;
        userCode?: string;
    }
}

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extend built-in session
declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
        idToken?: string;
    }

    interface User extends DefaultUser {
        accessToken?: string;
        idToken?: string;
    }
}

// Extend JWT
declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        idToken?: string;
    }
}

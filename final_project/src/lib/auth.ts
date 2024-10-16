import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";


if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    throw new Error("Missing Google OAuth credentials in environment variables");
}
if (!process.env.AUTH_FACEBOOK_ID || !process.env.AUTH_FACEBOOK_SECRET) {
    throw new Error("Missing Facebook OAuth credentials in environment variables");
}
if (!process.env.AUTH_SECRET) {
    throw new Error("Missing AUTH_SECRET in environment variables");
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Sign in",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    await connectDB();
                    const user = await User.findOne({ email: credentials?.email }).select("+password");

                    if (!user) {
                        console.error("User not found with email:", credentials?.email);
                        throw new Error("Incorrect email or password");
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordMatch) {
                        console.error("Incorrect password for user:", credentials.email);
                        throw new Error("Incorrect email or password");
                    }

                    console.log("User authenticated:", user.email);
                    return user;
                } catch (error) {
                    console.error("Error during authorization:", error);
                    throw new Error("Authorization failed");
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string
        }),
        FacebookProvider({
            clientId: process.env.AUTH_FACEBOOK_ID as string,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET as string
        }),
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.AUTH_SECRET,
    },
    callbacks: {
        async jwt({ token, user }) {
            
            if (user) {
                token.id = user._id ? user._id.toString() : undefined;
            }
            return token;
        },
        async session({ session, token }) {
            
            if (token && token.id) {
                session.user = {
                    ...session.user,
                    id: token.id,
                };
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            return `${baseUrl}/home`;
        },
    },
    debug: true
};

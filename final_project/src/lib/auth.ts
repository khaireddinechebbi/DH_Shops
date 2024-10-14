import { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({ email: credentials?.email }).select("+password");

                if (!user) throw new Error("Wrong Email");
                const passwordMatch = await bcrypt.compare(credentials!.password, user.password);

                if (!passwordMatch) throw new Error("Wrong Password");
                
                console.log("User authenticated:", user);
                return user; // Make sure this returns the user object
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.AUTH_SECRET, // Ensure this is set
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id.toString(); // Ensure the user ID is set
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id; // Assign the token's user ID to the session
            }
            return session;
        },
    },
};

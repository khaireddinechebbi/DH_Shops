import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";


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
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required");
                    }

                    await connectDB();
                    const user = await User.findOne({ email: credentials.email }).select("+password");

                    if (!user) {
                        console.error("User not found with email:", credentials.email);
                        throw new Error("Incorrect email or password");
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordMatch) {
                        console.error("Incorrect password for user:", credentials.email);
                        throw new Error("Incorrect email or password");
                    }

                    console.log("User authenticated:", user.email);
                    return {
                        ...user.toObject(),
                        _id: user._id.toString(), // Ensure _id is a string
                    };
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
        async signIn({ user, account }) {
            if (account?.provider === "google" || account?.provider === "facebook") {
                try {
                    await connectDB();
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Generate unique userCode for new OAuth user
                        let userCode = crypto.randomBytes(4).toString('hex');
                        let codeExists = await User.findOne({ userCode });
                        while (codeExists) {
                            userCode = crypto.randomBytes(4).toString('hex');
                            codeExists = await User.findOne({ userCode });
                        }

                        // Create new user with userCode
                        // Note: We need to handle username generation too since it's required
                        let baseUsername = user.email?.split('@')[0].toLowerCase() || 'user';
                        baseUsername = baseUsername.replace(/[^a-z0-9_]/g, '_');
                        let username = baseUsername;
                        let counter = 1;
                        while (await User.findOne({ username })) {
                            username = `${baseUsername}${counter}`;
                            counter++;
                        }

                        const newUser = new User({
                            name: user.name,
                            email: user.email,
                            image: [user.image],
                            username: username,
                            userCode: userCode,
                            password: crypto.randomBytes(16).toString('hex'), // Random password for OAuth users
                        });
                        await newUser.save();
                        user.userCode = userCode; // Attach to user object for JWT callback
                    } else {
                        // Ensure existing OAuth user has userCode (migration fallback)
                        if (!existingUser.userCode) {
                            let userCode = crypto.randomBytes(4).toString('hex');
                            let codeExists = await User.findOne({ userCode });
                            while (codeExists) {
                                userCode = crypto.randomBytes(4).toString('hex');
                                codeExists = await User.findOne({ userCode });
                            }
                            existingUser.userCode = userCode;
                            await existingUser.save();
                        }
                        user.userCode = existingUser.userCode;
                    }
                } catch (error) {
                    console.error("Error in OAuth sign in:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user._id ? user._id.toString() : token.id;
                token.username = user.username;
                token.userCode = user.userCode;
                token.sub = (user as { sub?: string }).sub || (account && account.providerAccountId) || token.sub;
            }

            // If token doesn't have userCode but has email, fetch it from database
            if (!token.userCode && token.email) {
                try {
                    await connectDB();
                    const dbUser = await User.findOne({ email: token.email }).select('username userCode');
                    if (dbUser) {
                        token.username = dbUser.username;
                        token.userCode = dbUser.userCode;
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user,
                    id: token.id,
                    username: token.username,
                    userCode: token.userCode,
                    sub: token.sub,
                };
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // If URL already contains a valid path, use it
            if (url.startsWith(baseUrl)) {
                return url;
            }
            // Default redirect to home
            return `${baseUrl}/home`;
        },
    },

    debug: true
};

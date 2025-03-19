"use client";
import { FormEvent, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [error, setError] = useState("");
    const router = useRouter();
    const { data: session } = useSession(); // Get the session data

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        // Log the response to check its structure
        console.log("SignIn Response:", res);

        if (res?.error) {
            setError(res.error as string);
        } else if (res?.ok) {
            // After sign in, retrieve session to get user info
            const userSub = session?.user?.sub; // Check session for user sub

            // Redirect to the user's home
            if (userSub) {
                return router.push(`/home/${userSub}`);
            } else {
                console.error("User sub is not available, redirecting to default home.");
                return router.push("/home");
            }
        }
    };

    return (
        <section className="w-full h-screen flex items-center justify-center">
            <form
                className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 
                border border-solid border-black bg-white rounded"
                onSubmit={handleSubmit}>
                {error && <div className="text-black">{error}</div>}
                <h1 className="mb-5 w-full text-2xl font-bold">Sign In</h1>
                <label className="w-full text-sm">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-8 border border-solid border-black rounded p-2"
                    name="email" />
                <label className="w-full text-sm">Password</label>
                <div className="flex w-full">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full h-8 border border-solid border-black rounded p-2"
                        name="password" />
                </div>
                <button className="w-full border border-solid border-black rounded">
                    Sign In
                </button>

                <Link
                    href="/register"
                    className="text-sm text-[#888] transition duration-150 ease hover:text-black">
                    Don&apos;t have an account?
                </Link>
            </form>
        </section>
    );
}

"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";

export default function Login() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        if (res?.error) {
            setError(res.error as string);
            setLoading(false);
        } else if (res?.ok) {
            router.push("/home");
        }
    };

    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: "/home" });
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
            {/* Animated Background */}
            <div className="absolute inset-0 gradient-mesh"></div>
            <div className="absolute inset-0 gradient-animated opacity-30"></div>

            {/* Floating Orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl animate-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl animate-pulse"></div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                {/* Left Side - Branding */}
                <div className="hidden md:block text-white animate-slide-right">
                    <h1 className="text-7xl font-display font-bold mb-6 leading-tight">
                        Welcome to
                        <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            Designer&apos;s Haven
                        </span>
                    </h1>
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">
                        Where creativity meets commerce. Discover unique fashion pieces from talented designers around the world.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Curated Collections</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                            <span>Global Designers</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="animate-slide-left">
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>

                        {/* Form Card */}
                        <div className="relative glass-card rounded-3xl p-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    Sign In
                                </h2>
                                <p className="text-gray-600">Enter your credentials to continue</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-slide-down">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div className="space-y-2 animate-slide-up delay-100">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-2 animate-slide-up delay-200">
                                    <label className="text-sm font-semibold text-gray-700">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaLock className="text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up delay-300"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Signing in...</span>
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8 animate-slide-up delay-400">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white/70 text-gray-500 font-medium">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-4 animate-slide-up delay-500">
                                <button
                                    onClick={() => handleSocialLogin("google")}
                                    className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    <FaGoogle className="text-red-500" />
                                    <span className="font-semibold text-gray-700">Google</span>
                                </button>
                                <button
                                    onClick={() => handleSocialLogin("facebook")}
                                    className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    <FaFacebook className="text-blue-600" />
                                    <span className="font-semibold text-gray-700">Facebook</span>
                                </button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center animate-slide-up delay-600">
                                <p className="text-gray-600">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:underline"
                                    >
                                        Sign up for free
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

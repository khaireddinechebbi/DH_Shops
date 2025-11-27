"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook, FaCheckCircle } from "react-icons/fa";

export default function Signup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Signup failed");
      }

      // Auto login after successful signup
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push("/home");
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    signIn(provider, { callbackUrl: "/home" });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-mesh"></div>
      <div className="absolute inset-0 gradient-animated opacity-30"></div>

      {/* Floating Orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-400/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-pink-400/20 rounded-full blur-2xl animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden md:block text-white animate-slide-right">
          <h1 className="text-7xl font-display font-bold mb-6 leading-tight">
            Join the
            <span className="block bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Creative Revolution
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Become part of a global community where designers showcase their art and fashion lovers discover unique pieces.
          </p>

          <div className="space-y-4">
            {[
              "Access exclusive designer collections",
              "Connect with talented creators worldwide",
              "Discover one-of-a-kind fashion pieces",
              "Support independent designers"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FaCheckCircle className="text-green-300" />
                </div>
                <span className="text-lg text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="animate-slide-left">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>

            {/* Form Card */}
            <div className="relative glass-card rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-display font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">Start your fashion journey today</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm animate-slide-down">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2 animate-slide-up delay-100">
                  <label className="text-sm font-semibold text-gray-700">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2 animate-slide-up delay-200">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2 animate-slide-up delay-300">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up delay-400"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 animate-slide-up delay-500">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/70 text-gray-500 font-medium">Or sign up with</span>
                </div>
              </div>

              {/* Social Signup Buttons */}
              <div className="grid grid-cols-2 gap-4 animate-slide-up delay-600">
                <button
                  onClick={() => handleSocialSignup("google")}
                  className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <FaGoogle className="text-red-500" />
                  <span className="font-semibold text-gray-700">Google</span>
                </button>
                <button
                  onClick={() => handleSocialSignup("facebook")}
                  className="flex items-center justify-center gap-2 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <FaFacebook className="text-blue-600" />
                  <span className="font-semibold text-gray-700">Facebook</span>
                </button>
              </div>

              {/* Login Link */}
              <div className="mt-8 text-center animate-slide-up delay-700">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent hover:underline"
                  >
                    Sign in
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

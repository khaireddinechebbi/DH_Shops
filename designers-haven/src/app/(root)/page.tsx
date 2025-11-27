"use client";
import Link from "next/link";
import { FaStar, FaPalette, FaGlobe, FaHeart, FaArrowRight, FaShoppingBag } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Landing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "authenticated") {
    return null; // Will redirect
  }

  return (
    <main className="relative overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh"></div>
        <div className="absolute inset-0 gradient-animated opacity-20"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400/15 rounded-full blur-2xl animate-pulse"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-down">
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-display font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Designer's Haven
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-3xl mx-auto font-light animate-slide-up delay-200">
              Where <span className="font-display font-semibold italic bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">creativity</span> meets <span className="font-display font-semibold italic bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">commerce</span>
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto animate-slide-up delay-300">
              Discover unique fashion pieces from talented designers around the world. Support independent creators and find your next statement piece.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up delay-400">
            <Link href="/signup">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <button className="relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl text-lg flex items-center gap-3 hover:scale-105 transition-transform">
                  Start Your Journey
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
            <Link href="/login">
              <button className="px-10 py-5 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-2xl text-lg hover:border-purple-500 hover:shadow-xl transition-all">
                Sign In
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up delay-500">
            {[
              { number: "500+", label: "Designers" },
              { number: "10K+", label: "Products" },
              { number: "50+", label: "Countries" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-subtle">
          <div className="w-6 h-10 border-2 border-purple-600 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-300 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience fashion like never before with our curated marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: FaPalette,
                title: "Unique Designs",
                description: "Discover one-of-a-kind pieces you won't find anywhere else",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: FaGlobe,
                title: "Global Creators",
                description: "Connect with talented designers from around the world",
                gradient: "from-pink-500 to-red-500"
              },
              {
                icon: FaHeart,
                title: "Support Artists",
                description: "Every purchase directly supports independent designers",
                gradient: "from-red-500 to-orange-500"
              },
              {
                icon: FaShoppingBag,
                title: "Curated Quality",
                description: "Hand-picked collections ensuring premium quality",
                gradient: "from-indigo-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500`}></div>
                  <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Loved by Creators
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Designer's Haven gave me the platform to showcase my work globally. It's been life-changing!",
                author: "Sarah Chen",
                role: "Fashion Designer"
              },
              {
                quote: "I've discovered so many unique pieces here. It's my go-to for statement fashion.",
                author: "Marcus Johnson",
                role: "Fashion Enthusiast"
              },
              {
                quote: "The community here is incredible. Supporting independent designers has never been easier.",
                author: "Emma Rodriguez",
                role: "Boutique Owner"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.author}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-animated"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 animate-slide-down">
            Ready to Start Your Fashion Journey?
          </h2>
          <p className="text-xl mb-12 text-white/90 animate-slide-up delay-200">
            Join thousands of designers and fashion lovers in our creative community
          </p>
          <Link href="/signup">
            <div className="inline-block group animate-scale-in delay-400">
              <div className="absolute -inset-1 bg-white rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
              <button className="relative px-12 py-6 bg-white text-purple-600 font-bold rounded-2xl text-xl hover:scale-105 transition-transform shadow-2xl">
                Get Started Free
              </button>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Designer's Haven
              </h3>
              <p className="text-gray-400">
                Bridging fashion designers with the world
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/home" className="hover:text-white transition">Browse</Link></li>
                <li><Link href="/signup" className="hover:text-white transition">Become a Designer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.holbertonschool.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Holberton School</a></li>
                <li><a href="https://github.com/khaireddinechebbi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="https://www.linkedin.com/in/khaireddine-chebbi-57b424172/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 Designer's Haven. A Holberton School Portfolio Project.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

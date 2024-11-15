"use client";
import { Hero } from "@/components";
import { FeatureCard } from "@/components/FeatureCard";
import Link from "next/link";

export default function Landing() {

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center`}>
      <Hero/>
      <section className="relative w-full h-[80vh] flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: "url('/fashion-illustration.jpeg')" }}>
        <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0"></div>
        <div className="relative z-10 text-white p-6">
          <h1 className="text-5xl font-bold mb-4">Designer&apos;s Haven</h1>
          <p className="text-lg font-light mb-8">Bridging Fashion Designers with the World</p>
          <nav className="flex gap-4 justify-center mb-6">
            <Link href="#features" className="text-lg text-white underline">Features</Link>
            <Link href="#about" className="text-lg text-white underline">About</Link>
          </nav>
        </div>
      </section>

      <section id="features" className="py-16 bg-white w-full text-center">
        <h2 className="text-4xl font-bold mb-8">Key Features</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <FeatureCard
            imageUrl="/fashion-clothes.jpg"
            title="Browse Unique Designs"
            description="Discover a curated collection of fashion designs created by emerging designers worldwide."
          />
          <FeatureCard
            imageUrl="/connecting.jpg"
            title="Connect with Designers"
            description="Easily connect with designers, learn about their stories, and purchase exclusive items."
          />
          <FeatureCard
            imageUrl="/background-and-tailor.jpg"
            title="Customized Fit"
            description="Get items tailored to your measurements, ensuring a perfect fit every time."
          />
        </div>
      </section>
      <section id="about" className="py-16 bg-gray-100 w-full text-center">
        <h2 className="text-4xl font-bold mb-8">About Designer&apos;s Haven</h2>
        <div className="max-w-3xl mx-auto px-4 text-lg mb-8">
          <p>
            Designer&apos;s Haven was inspired by the stories of fashion designers who struggle to reach a broader audience. 
            By creating this platform, we aim to provide a place for these creators to showcase their work. Our mission 
            is to bridge the gap between designers and fashion enthusiasts worldwide.
          </p>
          <p>
            This project is part of my portfolio for Holberton School. I’m grateful for the support and learning that 
            allowed me to build this platform. <Link href="https://www.holbertonschool.com" className="text-blue-600 underline">Learn more about Holberton School</Link>.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          <Link href="https://github.com/khaireddinechebbi" target="_blank" className="text-blue-600 underline">GitHub</Link>
          <Link href="https://www.linkedin.com/in/khaireddine-chebbi-57b424172/" target="_blank" className="text-blue-600 underline">LinkedIn</Link>
          
        </div>
      </section>
    </main>
  );
}

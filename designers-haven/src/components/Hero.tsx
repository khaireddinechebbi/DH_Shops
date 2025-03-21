import Link from 'next/link';
import React from 'react';
import { FacebookButton, GoogleButton } from './LoginButtons';

export default function Hero() {
    return (
        <section
            className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat h-screen w-full"
            style={{
                backgroundImage: 'url("/hanger-suits.jpg")',
            }}
        >
            <div className="absolute inset-0 bg-white/75 sm:bg-transparent sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></div>

            <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
                <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                    <h1 className="text-3xl font-extrabold sm:text-5xl text-white">
                        Discover Unique Designs
                        <strong className="block font-extrabold text-rose-700"> Made Just For You. </strong>
                    </h1>

                    

                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                        <GoogleButton />
                        <FacebookButton />
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4 text-center">
                        <Link
                            className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:text-blue-600 hover:bg-transparent focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                            href="/login"
                        >
                            Login
                        </Link>

                        <Link
                            className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-blue-600 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                            href="/signup"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

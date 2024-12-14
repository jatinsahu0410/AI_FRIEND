"use client";

import Image from "next/image";
import React from "react";

const AboutPage: React.FC = () => {
    return (
        <div className="relative text-white min-h-screen py-16 px-8 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                {/* Floating Blur Rings */}
                <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-30 animate-floating"></div>
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20 animate-floating delay-2000"></div>
                {/* Subtle Starfield */}
                <div className="absolute inset-0 bg-[url('/path-to-starfield.png')] bg-cover opacity-10"></div>
            </div>

            <div className="relative max-w-5xl mx-auto space-y-16 z-10">
                {/* Header Section */}
                <header className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient-move">
                        About AI Friend
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-300 italic">
                        Redefining companionship in the digital era — your empathetic virtual companion.
                    </p>
                </header>

                {/* Section 1: Platform Overview */}
                <section className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                        What is AI Friend?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        AI Friend is an innovative platform where users can create and personalize their virtual companion — a chatbot with a unique personality and avatar. Before every interaction, the user&lsquo;s emotions are detected using advanced face detection algorithms, enabling the chatbot to respond empathetically and tailor conversations to the user&#39;s current state of mind.
                    </p>
                    <div className="flex justify-center">
                        <Image
                            src="/logo.jpg"
                            alt="AI Friend Features"
                            className="w-96 h-auto rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-500"
                            width={800}
                            height={600}
                        />
                    </div>
                </section>

                {/* Section 2: Tackling Loneliness */}
                <section className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent">
                        Addressing Loneliness
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        Loneliness is a growing challenge in today’s fast-paced and digitally connected yet emotionally isolated world. Many people feel unheard and unsupported, which can impact mental health and overall well-being.
                    </p>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        AI Friend aims to bridge this emotional gap by providing a supportive virtual companion that listens without judgment or demands. Whether you need someone to share your day with or seek encouragement during tough times, AI Friend is always there for you.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-500">
                            <h3 className="text-xl font-bold text-white">Empathy at Core</h3>
                            <p className="mt-4 text-gray-200">
                                AI Friend understands your emotions and adapts its responses to match your mood.
                            </p>
                        </div>
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform duration-500">
                            <h3 className="text-xl font-bold text-white">Always Available</h3>
                            <p className="mt-4 text-gray-200">
                                Be it day or night, AI Friend is just a click away, ready to connect.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 3: Key Features */}
                <section className="space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-400 bg-clip-text text-transparent">
                        Key Features
                    </h2>
                    <ul className="list-disc pl-8 space-y-4 text-lg md:text-xl text-gray-300">
                        <li>Personalized chatbots with customizable personalities and avatars.</li>
                        <li>Real-time emotion detection for empathetic conversations.</li>
                        <li>Insights and suggestions to improve emotional well-being.</li>
                        <li>Interactive, easy-to-use interface with vibrant visuals.</li>
                    </ul>
                </section>

                {/* Section 4: Join the Journey */}
                <section className="text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Join the Journey
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        AI Friend is more than a platform; it’s a mission to combat loneliness and foster meaningful digital connections. Be part of the revolution and rediscover companionship in a unique way.
                    </p>
                    <a
                        href="/login"
                        className="inline-block px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg transform transition-transform hover:scale-110 duration-500"
                    >
                        Get Started
                    </a>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;

import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          {/* Glowing dots */}
          <div className="absolute w-4 h-4 bg-blue-500 rounded-full glowing-dot top-1/4 left-1/3"></div>
          <div className="absolute w-6 h-6 bg-purple-500 rounded-full glowing-dot top-3/4 right-1/4"></div>
          <div className="absolute w-3 h-3 bg-blue-400 rounded-full glowing-dot top-2/3 left-2/3"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white">
          {/* Central Image */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.jpg"
              alt="AI Friend Illustration"
              className="frontPage w-64 h-auto rounded-lg shadow-2xl shadow-purple-600 transform rotate-3 transition-transform hover:rotate-0 hover:scale-105"
              width={1000}
              height={800}
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            AI Friend{" "}
            <span className="text-blue-400">— Always There for You</span>
          </h1>

          {/* Subtitle/Quote */}
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            &ldquo;Your companion, your confidant, always by your side in every emotion.&ldquo;
          </p>

          {/* Get Started Button */}
          <div className="mt-8">
            <a
              href="/login"
              className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg transform transition-transform hover:scale-110"
            >
              Get Started
            </a>
          </div>

          {/* Scroll Down Indicator */}
          <div className="mt-16">
            <div className="text-gray-400 animate-bounce">
              <span>↓ Scroll Down</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

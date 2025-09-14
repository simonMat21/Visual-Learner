import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white text-sm font-bold">VL</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:via-pink-400 group-hover:to-blue-400 transition-all duration-300">
                Visual Learner
              </span>
            </div>
          </Link>

          {/* Right side - GitHub and About buttons */}
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/simonMat21/Visual-Learner"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
            >
              {/* GitHub Icon */}
              <svg
                className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300 group-hover:scale-110 group-hover:rotate-12 transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Animated ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-purple-500/50 group-hover:animate-pulse"></div>
            </a>

            {/* About Button */}
            <Link
              href="/about"
              className="group relative px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <span className="text-gray-300 group-hover:text-white transition-colors duration-300 text-sm font-medium">
                About
              </span>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Animated ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-500/50 group-hover:animate-pulse"></div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

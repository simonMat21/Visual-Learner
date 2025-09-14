"use client";

import React from "react";
import { Sparkles, Code, Package, Layers, Github, Atom } from "lucide-react";

const teamMembers = [
  { name: "John Doe", github: "https://github.com/johndoe" },
  { name: "Jane Smith", github: "https://github.com/janesmith" },
  { name: "Alex Lee", github: "https://github.com/alexlee" },
  { name: "Sara Khan", github: "https://github.com/sarakhan" },
  { name: "Dev Patel", github: "https://github.com/devpatel" },
  { name: "Lara Croft", github: "https://github.com/laracroft" },
  { name: "Tony Stark", github: "https://github.com/tonystark" },
];

const libraries = [
  { name: "React", icon: <Atom size={28} color="#61DAFB" />, link: "https://react.dev" },
  { name: "Next.js", icon: <Layers size={28} />, link: "https://nextjs.org" },
  { name: "Tailwind CSS", icon: <Code size={28} color="#38BDF8" />, link: "https://tailwindcss.com" },
  { name: "Framer Motion", icon: <Sparkles size={28} color="#e91e63" />, link: "https://www.framer.com/motion/" },
  { name: "ShadCN/UI", icon: <Package size={28} color="#a855f7" />, link: "https://ui.shadcn.com" },
  { name: "Lucide React", icon: <Github size={28} />, link: "https://lucide.dev" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-8">
      {/* About Section */}
      <div className="max-w-4xl mx-auto text-center mb-10 rounded-xl p-6 shadow-[0_0_25px_#8b5cf6] border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-border">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg mb-3">
          We are a team of passionate developers contributing to open source and
          solving real-world problems with creativity and code.
        </p>
        <p className="text-lg mb-3">
          This website is an <span className="font-semibold text-pink-200">open-source project</span>, 
          built to showcase collaborative development and knowledge sharing. 
          Our goal is to create tools and content that empower developers at every level.
        </p>
        <p className="text-lg">
          Anyone can <span className="font-semibold text-blue-200">contribute</span> to this project! 
          Whether it’s fixing bugs, improving features, or writing documentation — 
          your contributions are always welcome. Together, we grow stronger as a community.
        </p>
      </div>

      {/* Team Section */}
      <h2 className="text-4xl font-semibold mb-6 text-center">Meet the Team</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto mb-12">
        {teamMembers.map((member) => (
          <a
            key={member.github}
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square flex flex-col justify-center items-center text-center rounded-xl p-3 text-sm bg-gradient-to-br from-slate-900 via-gray-900 to-black border-2 border-transparent bg-clip-padding backdrop-blur shadow-[0_0_15px_#8b5cf6] transition-all duration-300 hover:shadow-[0_0_25px_#ec4899] hover:scale-105"
            style={{
              borderImage: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899) 1",
            }}
          >
            <p className="text-base font-semibold">{member.name}</p>
            <p className="text-xs text-pink-300 mt-1">View GitHub →</p>
          </a>
        ))}
      </div>

      {/* Libraries Section */}
      <h2 className="text-3xl font-semibold text-center mb-6">Libraries & Packages</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {libraries.map((lib, index) => (
          <a
            key={index}
            href={lib.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-5 rounded-xl bg-gradient-to-br from-gray-900 to-black border-2 border-transparent bg-clip-padding backdrop-blur shadow-[0_0_15px_#3b82f6] hover:shadow-[0_0_25px_#ec4899] hover:scale-105 transition-all duration-300"
            style={{
              borderImage: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899) 1",
            }}
          >
            {lib.icon}
            <p className="mt-3 font-medium">{lib.name}</p>
          </a>
        ))}
      </div>
    </main>
  );
}

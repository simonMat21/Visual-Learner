"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Code, Package, Layers, Github, Atom } from "lucide-react";

const libraries = [
  {
    name: "React",
    icon: <Atom size={32} color="#61DAFB" />,
    link: "https://react.dev",
    use: "UI Library",
  },
  {
    name: "Next.js",
    icon: <Layers size={32} color="#ffffff" />,
    link: "https://nextjs.org",
    use: "React Framework",
  },
  {
    name: "Tailwind CSS",
    icon: <Code size={32} color="#38BDF8" />,
    link: "https://tailwindcss.com",
    use: "CSS Framework",
  },
  {
    name: "Framer Motion",
    icon: <Sparkles size={32} color="#e91e63" />,
    link: "https://www.framer.com/motion/",
    use: "Animations",
  },
  {
    name: "ShadCN/UI",
    icon: <Package size={32} color="#a855f7" />,
    link: "https://ui.shadcn.com",
    use: "Components",
  },
  {
    name: "Lucide React",
    icon: <Github size={32} color="#ffffff" />,
    link: "https://lucide.dev",
    use: "Icons",
  },
  {
    name: "P5.js",
    icon: <Code size={32} color="#ed225d" />,
    link: "https://p5js.org",
    use: "Visualizations",
  },
  {
    name: "Vercel",
    icon: <Layers size={32} color="#ffffff" />,
    link: "https://vercel.com",
    use: "Deployment",
  },
];

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch contributors from GitHub API
    const fetchContributors = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/simonMat21/Visual-Learner/contributors"
        );
        const contributors = await response.json();

        const formattedMembers = contributors.map((contributor) => ({
          name: contributor.login, // Use login as name, could be enhanced
          github: contributor.html_url,
          username: contributor.login,
          contributions: contributor.contributions,
        }));

        setTeamMembers(formattedMembers);
      } catch (error) {
        console.error("Error fetching contributors:", error);
        // Fallback to default list if API fails
        setTeamMembers([
          {
            name: "simonMat21",
            github: "https://github.com/simonMat21",
            username: "simonMat21",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-8">
      {/* About Section */}
      <div className="max-w-6xl mx-auto mb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Visual Learner
          </h1>
          <p className="text-2xl text-gray-300 mb-8 font-light">
            Making complex concepts simple through interactive visualizations
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Educational Excellence</h3>
            <p className="text-gray-300">
              Interactive tools that transform learning algorithms, data
              structures, and mathematical concepts into engaging visual
              experiences.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Open Source</h3>
            <p className="text-gray-300">
              Built by the community, for the community. Every line of code is
              open source and welcomes contributions from developers worldwide.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-gray-300">
              Cutting-edge web technologies and creative coding techniques to
              deliver smooth, responsive, and beautiful learning experiences.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            Whether you&apos;re a student exploring algorithms, an educator
            seeking interactive tools, or a developer passionate about open
            source - there&apos;s a place for you in our community.
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/simonMat21/Visual-Learner"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold"
            >
              🎯 Learn & Explore
            </a>
            <a
              href="https://github.com/simonMat21/Visual-Learner/discussions"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold"
            >
              💡 Contribute Ideas
            </a>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <h2 className="text-4xl font-semibold mb-6 text-center">Meet the Team</h2>

      {loading ? (
        <div className="text-center mb-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <p className="mt-2 text-gray-400">Loading contributors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto mb-12 place-items-center">
          {teamMembers.map((member) => (
            <a
              key={member.github}
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center group"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-[0_0_15px_#8b5cf6] transition-all duration-300 group-hover:shadow-[0_0_25px_#ec4899] group-hover:scale-110">
                  <img
                    src={`https://github.com/${member.username}.png`}
                    alt={`${member.name} profile picture`}
                    className="w-full h-full object-cover rounded-full bg-gray-800"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=8b5cf6&color=fff&size=80`;
                    }}
                  />
                </div>
              </div>
              <p className="text-sm font-semibold mt-2 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                {member.name}
              </p>
            </a>
          ))}
        </div>
      )}

      {/* Libraries Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Built With Amazing Tools
          </h2>
          <p className="text-lg text-gray-300">
            Powered by the best open-source technologies
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {libraries.map((lib, index) => (
            <a
              key={index}
              href={lib.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                {lib.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                {lib.name}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {lib.use}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

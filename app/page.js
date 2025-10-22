"use client";
import React, { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Algorithms");

  const algorithmLinkers = [
    {
      title: "Sorting",
      icon: "🔄",
      color: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/50",
      links: [
        { href: "algorithms/sorting/bubble-sort", val: "Bubble Sort" },
        { href: "algorithms/sorting/selection-sort", val: "Selection Sort" },
        { href: "algorithms/sorting/insertion-sort", val: "Insertion Sort" },
        { href: "algorithms/sorting/merge-sort", val: "Merge Sort" },
        { href: "algorithms/sorting/quick-sort", val: "Quick Sort" },
        { href: "algorithms/sorting/heap-sort", val: "Heap Sort" },
        { href: "algorithms/sorting/count-sort", val: "Count Sort" },
        { href: "algorithms/sorting/bucket-sort", val: "Bucket Sort" },
        { href: "algorithms/sorting/radix-sort", val: "Radix Sort" },
      ],
    },
    {
      title: "Search",
      icon: "🔍",
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/50",
      links: [
        { href: "algorithms/search/binary-search", val: "Binary Search" },
        { href: "algorithms/search/linear-search", val: "Linear Search" },
      ],
    },
    {
      title: "Binary Search Tree",
      icon: "🌳",
      color: "from-green-500 to-emerald-500",
      shadowColor: "shadow-green-500/50",
      links: [
        { href: "algorithms/bst/basic", val: "BST Basic" },
        { href: "algorithms/bst/advanced", val: "BST Advanced" },
        { href: "algorithms/bst/operations", val: "BST Operations" },
      ],
    },
    {
      title: "Linked List",
      icon: "🔗",
      color: "from-orange-500 to-red-500",
      shadowColor: "shadow-orange-500/50",
      links: [
        { href: "algorithms/linked-list/single", val: "Linked List" },
        { href: "algorithms/linked-list/double", val: "Double Linked List" },
      ],
    },
    {
      title: "Heap",
      icon: "📊",
      color: "from-yellow-500 to-orange-500",
      shadowColor: "shadow-yellow-500/50",
      links: [
        { href: "algorithms/heap/min-heap", val: "Min Heap" },
        { href: "algorithms/heap/max-heap", val: "Max Heap" },
        { href: "algorithms/sorting/heap-sort", val: "Heap Sort" },
      ],
    },
    {
      title: "Hash",
      icon: "🗝️",
      color: "from-indigo-500 to-purple-500",
      shadowColor: "shadow-indigo-500/50",
      links: [
        { href: "algorithms/hash-table", val: "Hash Table" },
        { href: "algorithms/sorting/count-sort", val: "Count Sort" },
        { href: "algorithms/hash-table/linear-probing", val: "Linear Probing" },
        {
          href: "algorithms/hash-table/quadratic-probing",
          val: "Quadratic Probing",
        },
        { href: "algorithms/hash-table/chaining", val: "Hash Table Chaining" },
        { href: "algorithms/sorting/bucket-sort", val: "Bucket Sort" },
      ],
    },
    {
      title: "Graph",
      icon: "🌐",
      color: "from-green-500 to-emerald-500",
      shadowColor: "shadow-green-500/50",
      links: [
        {
          href: "algorithms/graphs/adjm-undirected",
          val: "Adjacency Matrix (undirected)",
        },
        {
          href: "algorithms/graphs/adjm-directed",
          val: "Adjacency Matrix (directed)",
        },
        {
          href: "algorithms/graphs/adjl-directed",
          val: "Adjacency List (undirected/directed)",
        },
        {
          href: "algorithms/graphs/adjm-weighted",
          val: "Adjacency Matrix (weighted)",
        },
        {
          href: "algorithms/graphs/adjm-input",
          val: "Adjacency Matrix (input)",
        },
      ],
    },
  ];

  const mathLinkers = [
    {
      title: "Vectors",
      icon: "📐",
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/50",
      links: [
        { href: "math/vector/vector-rep", val: "Vector Representation" },
        { href: "math/vector/vector-addition", val: "Vector Addition" },
        { href: "math/vector/vector-subtraction", val: "Vector Subtraction" },
        { href: "math/vector/vector-dot-product", val: "Vector Dot Product" },
      ],
    },
    {
      title: "Coordinate Geometry",
      icon: "📊",
      color: "from-green-500 to-emerald-500",
      shadowColor: "shadow-green-500/50",
      links: [
        { href: "math/coordGeometry/line", val: "Line" },
        { href: "math/coordGeometry/circle", val: "Circle" },
        { href: "math/coordGeometry/ellipse", val: "Ellipse" },
        { href: "math/coordGeometry/hyperbola", val: "Hyperbola" },
        { href: "math/coordGeometry/parabola", val: "Parabola" },
      ],
    },
  ];

  const physicsLinkers = [
    {
      title: "Functions",
      icon: "📈",
      color: "from-orange-500 to-red-500",
      shadowColor: "shadow-orange-500/50",
      links: [
        { href: "physics/damping-function", val: "Damping Function" },
        { href: "physics/color-mixing-light", val: "Color Mixing Light" },
        { href: "physics/color-mixing-pigment", val: "Color Mixing Pigment" },
        { href: "physics/light-refraction", val: "Light Refraction" },
      ],
    },
  ];

  const getCurrentLinkers = () => {
    switch (activeTab) {
      case "Algorithms":
        return algorithmLinkers;
      case "Math":
        return mathLinkers;
      case "Physics":
        return physicsLinkers;
      default:
        return [];
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Visual Learner
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Master data structures and algorithms through interactive
          visualizations
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6"></div>

        {/* Navigation */}
        <div className="flex justify-center mt-8 px-4">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-2 w-full max-w-4xl">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {["Algorithms", "Math", "Physics", "Logic Design"].map(
                (item, index) => (
                  <button
                    key={item}
                    onClick={() => setActiveTab(item)}
                    className={`
                    px-1 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300
                    text-xs sm:text-base text-center
                    ${
                      activeTab === item
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }
                    transform hover:scale-105 active:scale-95
                  `}
                  >
                    <span className="block sm:hidden">
                      {item === "Algorithms"
                        ? "Algo"
                        : item === "Logic Design"
                        ? "Logic"
                        : item}
                    </span>
                    <span className="hidden sm:block">{item}</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto space-y-12">
        {getCurrentLinkers().length > 0 ? (
          getCurrentLinkers().map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 transition-all duration-300"
            >
              {/* Category Header */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl sm:text-4xl">{category.icon}</span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {category.title}
                  </h2>
                </div>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {category.links.map((link, linkIndex) => (
                  <a href={link.href} key={linkIndex} className="group">
                    <div
                      className={`
                      relative overflow-hidden rounded-xl p-4 sm:p-6 h-28 sm:h-32 
                      bg-gradient-to-br ${category.color} 
                      shadow-lg ${category.shadowColor}
                      transform transition-all duration-300 
                      hover:scale-105 hover:shadow-2xl
                      active:scale-95
                      flex items-center justify-center
                      border border-white/20
                    `}
                    >
                      {/* Animated background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                      {/* Content */}
                      <div className="relative z-10 text-center">
                        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg leading-tight">
                          {link.val}
                        </h3>
                      </div>

                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="relative">
              {/* Animated dots */}
              <div className="flex justify-center space-x-2 mb-6">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce delay-300"></div>
              </div>

              {/* Coming Soon Text */}
              <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4 animate-pulse">
                Coming Soon
              </h2>

              <p className="text-gray-400 text-lg mb-8">
                {activeTab} visualizations are under development
              </p>

              {/* Animated progress bar */}
              <div className="max-w-md mx-auto bg-gray-700 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse w-1/3"></div>
              </div>

              {/* Floating particles */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping top-1/4 left-1/4"></div>
                <div className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-ping delay-700 top-3/4 right-1/4"></div>
                <div className="absolute w-1 h-1 bg-pink-400 rounded-full opacity-60 animate-ping delay-1000 top-1/2 left-3/4"></div>
                <div className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-ping delay-300 top-1/3 right-1/3"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

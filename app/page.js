import React from "react";

export default function Home() {
  const linkers = [
    {
      title: "Sorting",
      icon: "🔄",
      color: "from-purple-500 to-pink-500",
      shadowColor: "shadow-purple-500/50",
      links: [
        { href: "/page_bubbleSort", val: "Bubble Sort" },
        { href: "/page_selectionSort", val: "Selection Sort" },
        { href: "/page_insertionSort", val: "Insertion Sort" },
        { href: "/page_mergeSort", val: "Merge Sort" },
        { href: "/page_quickSort", val: "Quick Sort" },
        { href: "/page_heapSort", val: "Heap Sort" },
        { href: "/page_countSort", val: "Count Sort" },
        { href: "/page_BucketSort", val: "Bucket Sort" },
        { href: "/page_radixSort", val: "Radix Sort" },
      ],
    },
    {
      title: "Search",
      icon: "🔍",
      color: "from-blue-500 to-cyan-500",
      shadowColor: "shadow-blue-500/50",
      links: [
        { href: "/page_binarySearch", val: "Binary Search" },
        { href: "/page_linearSearch", val: "Linear Search" },
      ],
    },
    {
      title: "Binary Search Tree",
      icon: "🌳",
      color: "from-green-500 to-emerald-500",
      shadowColor: "shadow-green-500/50",
      links: [
        { href: "/page_bst", val: "BST Basic" },
        { href: "/page_bst_2", val: "BST Advanced" },
        { href: "/page_bst_3", val: "BST Operations" },
      ],
    },
    {
      title: "Linked List",
      icon: "🔗",
      color: "from-orange-500 to-red-500",
      shadowColor: "shadow-orange-500/50",
      links: [
        { href: "/page_linkedList", val: "Linked List" },
        { href: "/page_doubleLinkedList", val: "Double Linked List" },
      ],
    },
    {
      title: "Heap",
      icon: "📊",
      color: "from-yellow-500 to-orange-500",
      shadowColor: "shadow-yellow-500/50",
      links: [
        { href: "/page_heap", val: "Heap Structure" },
        { href: "/page_heapSort", val: "Heap Sort" },
      ],
    },
    {
      title: "Hash",
      icon: "🗝️",
      color: "from-indigo-500 to-purple-500",
      shadowColor: "shadow-indigo-500/50",
      links: [
        { href: "/page_hashTable", val: "Hash Table" },
        { href: "/page_countSort", val: "Count Sort" },
        { href: "/page_linearProbing", val: "Linear Probing" },
        { href: "/page_quadraticProbing", val: "Quadratic Probing" },
        { href: "/page_hasgTableChaining", val: "Hash Table Chaining" },
        { href: "/page_BucketSort", val: "Bucket Sort" },
      ],
    },
  ];

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
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto space-y-12">
        {linkers.map((category, categoryIndex) => (
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
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-gray-500">
        <p className="text-sm sm:text-base">
          Click on any algorithm to start your visual learning journey
        </p>
      </div>
    </main>
  );
}

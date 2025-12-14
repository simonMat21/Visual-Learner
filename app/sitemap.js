// Dynamic Sitemap for SEO - Next.js automatically serves this at /sitemap.xml

export default function sitemap() {
  const baseUrl = "https://visuallearner.org"; // UPDATE THIS with your actual domain

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy_policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Algorithm pages
  const algorithmPages = [
    // Sorting
    "algorithms/sorting/bubble-sort",
    "algorithms/sorting/selection-sort",
    "algorithms/sorting/insertion-sort",
    "algorithms/sorting/merge-sort",
    "algorithms/sorting/quick-sort",
    "algorithms/sorting/heap-sort",
    "algorithms/sorting/count-sort",
    "algorithms/sorting/bucket-sort",
    "algorithms/sorting/radix-sort",
    // Search
    "algorithms/search/binary-search",
    "algorithms/search/linear-search",
    // BST
    "algorithms/bst/basic",
    "algorithms/bst/advanced",
    "algorithms/bst/operations",
    // Heap
    "algorithms/heap/min-heap",
    "algorithms/heap/max-heap",
    // Linked List
    "algorithms/linked-list/single",
    "algorithms/linked-list/double",
    // Hash Table
    "algorithms/hash-table",
    "algorithms/hash-table/chaining",
    "algorithms/hash-table/linear-probing",
    "algorithms/hash-table/quadratic-probing",
    // Graphs
    "algorithms/graphs/adjl-directed",
    "algorithms/graphs/adjm-directed",
    "algorithms/graphs/adjm-undirected",
    "algorithms/graphs/adjm-weighted",
    "algorithms/graphs/adjm-input",
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  // Math pages
  const mathPages = [
    // Vectors
    "math/vector/vector-rep",
    "math/vector/vector-addition",
    "math/vector/vector-subtraction",
    "math/vector/vector-dot-product",
    // Matrix
    "math/matrix/basic-calc",
    "math/matrix/matrix-mult",
    "math/matrix/eigen-values",
    "math/matrix/psudo-inverse",
    "math/matrix/SVD",
    // Coordinate Geometry
    "math/coordGeometry/line",
    "math/coordGeometry/circle",
    "math/coordGeometry/parabola",
    "math/coordGeometry/ellipse",
    "math/coordGeometry/hyperbola",
    // Functions
    "math/functions/graph-playground",
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Physics pages
  const physicsPages = [
    "physics/color-mixing-light",
    "physics/color-mixing-pigment",
    "physics/damping-function",
    "physics/light-refraction",
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...algorithmPages, ...mathPages, ...physicsPages];
}

// Catalogue of every visualization on the site.
// Used by the home page (topic index) and by the breadcrumbs on each page.

export const subjects = [
  {
    id: "algorithms",
    name: "Algorithms",
    blurb: "Data structures and the algorithms that move them, one step at a time.",
    pen: "rust",
    groups: [
      {
        title: "Sorting",
        slug: "sorting",
        topics: [
          { href: "/algorithms/sorting/bubble-sort", name: "Bubble Sort", blurb: "Swap neighbours until nothing moves." },
          { href: "/algorithms/sorting/selection-sort", name: "Selection Sort", blurb: "Pick the smallest, place it, repeat." },
          { href: "/algorithms/sorting/insertion-sort", name: "Insertion Sort", blurb: "Slide each item into a sorted prefix." },
          { href: "/algorithms/sorting/merge-sort", name: "Merge Sort", blurb: "Split in half, sort, merge back." },
          { href: "/algorithms/sorting/quick-sort", name: "Quick Sort", blurb: "Partition around a pivot, recurse." },
          { href: "/algorithms/sorting/heap-sort", name: "Heap Sort", blurb: "Build a heap, pull out the maximum." },
          { href: "/algorithms/sorting/count-sort", name: "Count Sort", blurb: "Tally values instead of comparing." },
          { href: "/algorithms/sorting/bucket-sort", name: "Bucket Sort", blurb: "Scatter into buckets, gather in order." },
          { href: "/algorithms/sorting/radix-sort", name: "Radix Sort", blurb: "Sort digit by digit." },
        ],
      },
      {
        title: "Search",
        slug: "search",
        topics: [
          { href: "/algorithms/search/linear-search", name: "Linear Search", blurb: "Check every element in turn." },
          { href: "/algorithms/search/binary-search", name: "Binary Search", blurb: "Halve a sorted range each step." },
        ],
      },
      {
        title: "Binary Search Tree",
        slug: "bst",
        topics: [
          { href: "/algorithms/bst/basic", name: "BST Basics", blurb: "Insert, search and delete keys." },
          { href: "/algorithms/bst/advanced", name: "BST Advanced", blurb: "Min, max, successor, predecessor." },
          { href: "/algorithms/bst/operations", name: "BST Traversals", blurb: "Inorder, preorder, postorder." },
        ],
      },
      {
        title: "Linked List",
        slug: "linked-list",
        topics: [
          { href: "/algorithms/linked-list/single", name: "Singly Linked List", blurb: "Nodes that point forward." },
          { href: "/algorithms/linked-list/double", name: "Doubly Linked List", blurb: "Nodes that point both ways." },
        ],
      },
      {
        title: "Heap",
        slug: "heap",
        topics: [
          { href: "/algorithms/heap/min-heap", name: "Min Heap", blurb: "Smallest key always on top." },
          { href: "/algorithms/heap/max-heap", name: "Max Heap", blurb: "Largest key always on top." },
        ],
      },
      {
        title: "Hashing",
        slug: "hash-table",
        topics: [
          { href: "/algorithms/hash-table", name: "Hash Table", blurb: "Map keys to slots with a hash." },
          { href: "/algorithms/hash-table/linear-probing", name: "Linear Probing", blurb: "On collision, try the next slot." },
          { href: "/algorithms/hash-table/quadratic-probing", name: "Quadratic Probing", blurb: "On collision, jump 1, 4, 9…" },
          { href: "/algorithms/hash-table/chaining", name: "Chaining", blurb: "Each slot keeps a list." },
        ],
      },
      {
        title: "Graphs",
        slug: "graphs",
        topics: [
          { href: "/algorithms/graphs/adjm-undirected", name: "Adjacency Matrix", blurb: "Undirected graph as a matrix." },
          { href: "/algorithms/graphs/adjm-directed", name: "Directed Matrix", blurb: "Directed graph as a matrix." },
          { href: "/algorithms/graphs/adjl-directed", name: "Adjacency List", blurb: "Edges as lists, with BFS and DFS." },
          { href: "/algorithms/graphs/adjm-weighted", name: "Weighted Graph", blurb: "Shortest paths with Dijkstra." },
          { href: "/algorithms/graphs/adjm-input", name: "Matrix Input", blurb: "Type a matrix, see the graph." },
        ],
      },
    ],
  },
  {
    id: "math",
    name: "Math",
    blurb: "Vectors, matrices and curves you can push around.",
    pen: "blue",
    groups: [
      {
        title: "Vectors",
        slug: "vector",
        topics: [
          { href: "/math/vector/vector-rep", name: "Representation", blurb: "Magnitude, direction, components." },
          { href: "/math/vector/vector-addition", name: "Addition", blurb: "Head to tail, component-wise." },
          { href: "/math/vector/vector-subtraction", name: "Subtraction", blurb: "Add the opposite vector." },
          { href: "/math/vector/vector-dot-product", name: "Dot Product", blurb: "Projection and the angle between." },
        ],
      },
      {
        title: "Coordinate Geometry",
        slug: "coordGeometry",
        topics: [
          { href: "/math/coordGeometry/line", name: "Line", blurb: "Slope, intercepts, equation forms." },
          { href: "/math/coordGeometry/circle", name: "Circle", blurb: "Centre, radius, general form." },
          { href: "/math/coordGeometry/parabola", name: "Parabola", blurb: "Focus, directrix, vertex." },
          { href: "/math/coordGeometry/ellipse", name: "Ellipse", blurb: "Axes, foci, eccentricity." },
          { href: "/math/coordGeometry/hyperbola", name: "Hyperbola", blurb: "Foci and asymptotes." },
        ],
      },
      {
        title: "Matrices",
        slug: "matrix",
        topics: [
          { href: "/math/matrix/basic-calc", name: "Matrix Operations", blurb: "Add, scale, transpose, determinant." },
          { href: "/math/matrix/matrix-mult", name: "Multiplication", blurb: "Row by column, step by step." },
          { href: "/math/matrix/eigen-values", name: "Eigenvalues", blurb: "Directions a matrix only stretches." },
          { href: "/math/matrix/psudo-inverse", name: "Pseudo-Inverse", blurb: "Inverting non-square matrices." },
          { href: "/math/matrix/SVD", name: "SVD", blurb: "Rotate, scale, rotate." },
        ],
      },
      {
        title: "Functions",
        slug: "functions",
        topics: [
          { href: "/math/functions/graph-playground", name: "Graph Playground", blurb: "Type f(x) and plot it." },
        ],
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    blurb: "Motion and light, simulated.",
    pen: "green",
    groups: [
      {
        title: "Oscillations",
        slug: "damping-function",
        topics: [
          { href: "/physics/damping-function", name: "Damped Oscillation", blurb: "How damping shapes a wave." },
        ],
      },
      {
        title: "Light",
        slug: "light",
        topics: [
          { href: "/physics/color-mixing-light", name: "Additive Colour", blurb: "Mixing red, green and blue light." },
          { href: "/physics/color-mixing-pigment", name: "Subtractive Colour", blurb: "Mixing cyan, magenta, yellow ink." },
          { href: "/physics/light-refraction", name: "Refraction", blurb: "Snell's law through a glass block." },
        ],
      },
    ],
  },
];

export const allTopics = subjects.flatMap((s) =>
  s.groups.flatMap((g) => g.topics.map((t) => ({ ...t, subject: s, group: g })))
);

export function findTopic(pathname) {
  return allTopics.find((t) => t.href === pathname) || null;
}

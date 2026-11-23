// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Prim's Algorithm – Minimum Spanning Tree Visualizer",
  description:
    "Watch Prim's algorithm grow a minimum spanning tree step by step. Type your own undirected weighted graph as an adjacency matrix and follow the keys, parents and pseudocode.",
  alternates: {
    canonical: "/algorithms/mst/prims-algorithm",
  },
  openGraph: {
    title: "Prim's Algorithm – Minimum Spanning Tree | Visual Learner",
    description:
      "Watch Prim's algorithm grow a minimum spanning tree step by step on your own weighted graph.",
    url: "/algorithms/mst/prims-algorithm",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

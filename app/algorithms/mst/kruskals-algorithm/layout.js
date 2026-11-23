// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Kruskal's Algorithm – Minimum Spanning Tree Visualizer",
  description:
    "Watch Kruskal's algorithm build a minimum spanning tree edge by edge. Type your own undirected weighted graph as an adjacency matrix and follow the sorted edges, union-find sets and pseudocode.",
  alternates: {
    canonical: "/algorithms/mst/kruskals-algorithm",
  },
  openGraph: {
    title: "Kruskal's Algorithm – Minimum Spanning Tree | Visual Learner",
    description:
      "Watch Kruskal's algorithm build a minimum spanning tree edge by edge on your own weighted graph.",
    url: "/algorithms/mst/kruskals-algorithm",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

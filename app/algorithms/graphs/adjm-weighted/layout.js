// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Weighted Graphs and Dijkstra's Algorithm",
  description:
    "Build a weighted directed graph, view its adjacency matrix and find shortest paths with Dijkstra's algorithm.",
  alternates: {
    canonical: "/algorithms/graphs/adjm-weighted",
  },
  openGraph: {
    title: "Weighted Graphs and Dijkstra's Algorithm | Visual Learner",
    description:
      "Build a weighted directed graph, view its adjacency matrix and find shortest paths with Dijkstra's algorithm.",
    url: "/algorithms/graphs/adjm-weighted",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

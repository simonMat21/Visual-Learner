// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Dijkstra's Algorithm Visualizer",
  description:
    "Watch Dijkstra's algorithm find shortest paths step by step on your own weighted graph: distances, the priority choice, edge relaxation and the shortest-path tree.",
  alternates: {
    canonical: "/algorithms/shortest-path/dijkstra",
  },
  openGraph: {
    title: "Dijkstra's Algorithm Visualizer | Visual Learner",
    description:
      "Watch Dijkstra's algorithm find shortest paths step by step on your own weighted graph: distances, the priority choice, edge relaxation and the shortest-path tree.",
    url: "/algorithms/shortest-path/dijkstra",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

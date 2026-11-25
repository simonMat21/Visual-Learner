// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Breadth-First Search (BFS) Visualizer",
  description:
    "Watch breadth-first search explore a graph layer by layer with a queue. Build your own graph as an adjacency matrix and follow the queue, distances, parents and pseudocode step by step.",
  alternates: {
    canonical: "/algorithms/graphs/bfs",
  },
  openGraph: {
    title: "Breadth-First Search (BFS) Visualizer | Visual Learner",
    description:
      "Watch breadth-first search explore a graph layer by layer with a queue. Build your own graph as an adjacency matrix and follow the queue, distances, parents and pseudocode step by step.",
    url: "/algorithms/graphs/bfs",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

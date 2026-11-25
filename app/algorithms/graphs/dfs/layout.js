// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Depth-First Search (DFS) Visualizer",
  description:
    "Watch depth-first search go deep and backtrack with the call stack. Build your own graph as an adjacency matrix and follow the visit order, parents and pseudocode step by step.",
  alternates: {
    canonical: "/algorithms/graphs/dfs",
  },
  openGraph: {
    title: "Depth-First Search (DFS) Visualizer | Visual Learner",
    description:
      "Watch depth-first search go deep and backtrack with the call stack. Build your own graph as an adjacency matrix and follow the visit order, parents and pseudocode step by step.",
    url: "/algorithms/graphs/dfs",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

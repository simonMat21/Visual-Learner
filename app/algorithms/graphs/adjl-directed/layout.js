// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Adjacency List for Directed Graphs",
  description:
    "Represent a directed graph as an adjacency list and explore BFS and DFS traversals interactively.",
  alternates: {
    canonical: "/algorithms/graphs/adjl-directed",
  },
  openGraph: {
    title: "Adjacency List for Directed Graphs | Visual Learner",
    description:
      "Represent a directed graph as an adjacency list and explore BFS and DFS traversals interactively.",
    url: "/algorithms/graphs/adjl-directed",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

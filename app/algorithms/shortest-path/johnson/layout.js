// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Johnson's Algorithm Visualizer",
  description:
    "Follow Johnson's algorithm: Bellman-Ford potentials, edge reweighting and one Dijkstra run per vertex to get all-pairs shortest paths with negative edges.",
  alternates: {
    canonical: "/algorithms/shortest-path/johnson",
  },
  openGraph: {
    title: "Johnson's Algorithm Visualizer | Visual Learner",
    description:
      "Follow Johnson's algorithm: Bellman-Ford potentials, edge reweighting and one Dijkstra run per vertex to get all-pairs shortest paths with negative edges.",
    url: "/algorithms/shortest-path/johnson",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

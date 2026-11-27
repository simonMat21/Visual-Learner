// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Topological Sort Visualizer",
  description:
    "Order the vertices of a directed acyclic graph with Kahn's algorithm: in-degrees, a queue of ready vertices and cycle detection.",
  alternates: {
    canonical: "/algorithms/connectivity/topological-sort",
  },
  openGraph: {
    title: "Topological Sort Visualizer | Visual Learner",
    description:
      "Order the vertices of a directed acyclic graph with Kahn's algorithm: in-degrees, a queue of ready vertices and cycle detection.",
    url: "/algorithms/connectivity/topological-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

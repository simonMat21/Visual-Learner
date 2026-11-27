// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Connected Components Visualizer",
  description:
    "Find the connected components of an undirected graph by flood fill, step by step, on a graph you build as an adjacency matrix.",
  alternates: {
    canonical: "/algorithms/connectivity/connected-components",
  },
  openGraph: {
    title: "Connected Components Visualizer | Visual Learner",
    description:
      "Find the connected components of an undirected graph by flood fill, step by step, on a graph you build as an adjacency matrix.",
    url: "/algorithms/connectivity/connected-components",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

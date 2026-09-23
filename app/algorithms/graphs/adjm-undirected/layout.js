// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Adjacency Matrix for Undirected Graphs",
  description:
    "See how an undirected graph maps to a symmetric adjacency matrix, with an interactive visualization and code.",
  alternates: {
    canonical: "/algorithms/graphs/adjm-undirected",
  },
  openGraph: {
    title: "Adjacency Matrix for Undirected Graphs | Visual Learner",
    description:
      "See how an undirected graph maps to a symmetric adjacency matrix, with an interactive visualization and code.",
    url: "/algorithms/graphs/adjm-undirected",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

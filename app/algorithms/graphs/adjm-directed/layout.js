// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Adjacency Matrix for Directed Graphs",
  description:
    "See how a directed graph maps to its adjacency matrix, with an interactive visualization and code.",
  alternates: {
    canonical: "/algorithms/graphs/adjm-directed",
  },
  openGraph: {
    title: "Adjacency Matrix for Directed Graphs | Visual Learner",
    description:
      "See how a directed graph maps to its adjacency matrix, with an interactive visualization and code.",
    url: "/algorithms/graphs/adjm-directed",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

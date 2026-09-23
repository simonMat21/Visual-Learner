// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Graph from an Adjacency Matrix",
  description:
    "Type in an adjacency matrix and see the directed graph it describes drawn instantly.",
  alternates: {
    canonical: "/algorithms/graphs/adjm-input",
  },
  openGraph: {
    title: "Graph from an Adjacency Matrix | Visual Learner",
    description:
      "Type in an adjacency matrix and see the directed graph it describes drawn instantly.",
    url: "/algorithms/graphs/adjm-input",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

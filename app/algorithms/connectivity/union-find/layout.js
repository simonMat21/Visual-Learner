// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Union-Find (Disjoint Set Union) Visualizer",
  description:
    "Union and find on a disjoint-set forest with union by rank and path compression, shown step by step with the parent array.",
  alternates: {
    canonical: "/algorithms/connectivity/union-find",
  },
  openGraph: {
    title: "Union-Find (Disjoint Set Union) Visualizer | Visual Learner",
    description:
      "Union and find on a disjoint-set forest with union by rank and path compression, shown step by step with the parent array.",
    url: "/algorithms/connectivity/union-find",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

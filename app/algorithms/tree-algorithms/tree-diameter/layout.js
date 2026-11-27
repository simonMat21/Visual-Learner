// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Tree Diameter Visualizer",
  description:
    "Find the longest path in a tree with two breadth-first searches, step by step on a tree you can edit.",
  alternates: {
    canonical: "/algorithms/tree-algorithms/tree-diameter",
  },
  openGraph: {
    title: "Tree Diameter Visualizer | Visual Learner",
    description:
      "Find the longest path in a tree with two breadth-first searches, step by step on a tree you can edit.",
    url: "/algorithms/tree-algorithms/tree-diameter",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

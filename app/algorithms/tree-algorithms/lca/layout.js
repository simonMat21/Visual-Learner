// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Lowest Common Ancestor Visualizer",
  description:
    "Find the lowest common ancestor of two nodes by climbing parents or with binary lifting, step by step on a tree you can edit.",
  alternates: {
    canonical: "/algorithms/tree-algorithms/lca",
  },
  openGraph: {
    title: "Lowest Common Ancestor Visualizer | Visual Learner",
    description:
      "Find the lowest common ancestor of two nodes by climbing parents or with binary lifting, step by step on a tree you can edit.",
    url: "/algorithms/tree-algorithms/lca",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

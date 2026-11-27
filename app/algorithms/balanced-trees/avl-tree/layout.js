// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "AVL Tree Visualizer",
  description:
    "Insert and delete in an AVL tree and watch heights, balance factors and the four rotation cases keep it balanced.",
  alternates: {
    canonical: "/algorithms/balanced-trees/avl-tree",
  },
  openGraph: {
    title: "AVL Tree Visualizer | Visual Learner",
    description:
      "Insert and delete in an AVL tree and watch heights, balance factors and the four rotation cases keep it balanced.",
    url: "/algorithms/balanced-trees/avl-tree",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Red-Black Tree Visualizer",
  description:
    "Insert and delete in a red-black tree and watch recolouring and rotations keep every path's black height equal.",
  alternates: {
    canonical: "/algorithms/balanced-trees/red-black-tree",
  },
  openGraph: {
    title: "Red-Black Tree Visualizer | Visual Learner",
    description:
      "Insert and delete in a red-black tree and watch recolouring and rotations keep every path's black height equal.",
    url: "/algorithms/balanced-trees/red-black-tree",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

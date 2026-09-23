// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "BST Tree Traversals",
  description:
    "Visualize inorder, preorder and postorder traversals of a binary search tree step by step.",
  alternates: {
    canonical: "/algorithms/bst/operations",
  },
  openGraph: {
    title: "BST Tree Traversals | Visual Learner",
    description:
      "Visualize inorder, preorder and postorder traversals of a binary search tree step by step.",
    url: "/algorithms/bst/operations",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

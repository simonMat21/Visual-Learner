// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Binary Search Tree (BST)",
  description:
    "Build a binary search tree and insert, search and delete keys with step-by-step animations and code.",
  alternates: {
    canonical: "/algorithms/bst/basic",
  },
  openGraph: {
    title: "Binary Search Tree (BST) | Visual Learner",
    description:
      "Build a binary search tree and insert, search and delete keys with step-by-step animations and code.",
    url: "/algorithms/bst/basic",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

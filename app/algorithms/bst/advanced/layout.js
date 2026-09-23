// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "BST Advanced Operations",
  description:
    "Find the minimum, maximum, successor and predecessor in a binary search tree with animated walkthroughs.",
  alternates: {
    canonical: "/algorithms/bst/advanced",
  },
  openGraph: {
    title: "BST Advanced Operations | Visual Learner",
    description:
      "Find the minimum, maximum, successor and predecessor in a binary search tree with animated walkthroughs.",
    url: "/algorithms/bst/advanced",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

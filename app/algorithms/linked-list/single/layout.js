// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Singly Linked List Visualization",
  description:
    "Insert, delete and search nodes in a singly linked list with pointer-by-pointer animations.",
  alternates: {
    canonical: "/algorithms/linked-list/single",
  },
  openGraph: {
    title: "Singly Linked List Visualization | Visual Learner",
    description:
      "Insert, delete and search nodes in a singly linked list with pointer-by-pointer animations.",
    url: "/algorithms/linked-list/single",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

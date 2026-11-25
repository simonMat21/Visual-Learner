// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Circular Linked List Visualization",
  description:
    "Insert, delete, search and rotate a circular linked list, where the last node points back to the head, with pointer-by-pointer animations and pseudocode.",
  alternates: {
    canonical: "/algorithms/linked-list/circular",
  },
  openGraph: {
    title: "Circular Linked List Visualization | Visual Learner",
    description:
      "Insert, delete, search and rotate a circular linked list with pointer-by-pointer animations.",
    url: "/algorithms/linked-list/circular",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

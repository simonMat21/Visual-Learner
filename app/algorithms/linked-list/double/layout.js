// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Doubly Linked List Visualization",
  description:
    "Visualize doubly linked list operations with next and previous pointers updated step by step.",
  alternates: {
    canonical: "/algorithms/linked-list/double",
  },
  openGraph: {
    title: "Doubly Linked List Visualization | Visual Learner",
    description:
      "Visualize doubly linked list operations with next and previous pointers updated step by step.",
    url: "/algorithms/linked-list/double",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

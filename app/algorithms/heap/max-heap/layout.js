// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Max Heap Visualization",
  description:
    "Insert and extract from a max heap with animated heapify operations, shown as a tree and an array.",
  alternates: {
    canonical: "/algorithms/heap/max-heap",
  },
  openGraph: {
    title: "Max Heap Visualization | Visual Learner",
    description:
      "Insert and extract from a max heap with animated heapify operations, shown as a tree and an array.",
    url: "/algorithms/heap/max-heap",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

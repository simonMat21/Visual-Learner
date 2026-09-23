// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Min Heap Visualization",
  description:
    "Insert and extract from a min heap and watch heapify-up and heapify-down restore the heap property.",
  alternates: {
    canonical: "/algorithms/heap/min-heap",
  },
  openGraph: {
    title: "Min Heap Visualization | Visual Learner",
    description:
      "Insert and extract from a min heap and watch heapify-up and heapify-down restore the heap property.",
    url: "/algorithms/heap/min-heap",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

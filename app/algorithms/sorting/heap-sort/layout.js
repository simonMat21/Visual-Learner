// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Heap Sort Visualization",
  description:
    "Watch heap sort build a heap and repeatedly extract the largest element, with animated steps and code.",
  alternates: {
    canonical: "/algorithms/sorting/heap-sort",
  },
  openGraph: {
    title: "Heap Sort Visualization | Visual Learner",
    description:
      "Watch heap sort build a heap and repeatedly extract the largest element, with animated steps and code.",
    url: "/algorithms/sorting/heap-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

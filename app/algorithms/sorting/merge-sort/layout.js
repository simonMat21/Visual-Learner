// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Merge Sort Visualization",
  description:
    "Visualize merge sort's divide-and-conquer splitting and merging, step by step, with code.",
  alternates: {
    canonical: "/algorithms/sorting/merge-sort",
  },
  openGraph: {
    title: "Merge Sort Visualization | Visual Learner",
    description:
      "Visualize merge sort's divide-and-conquer splitting and merging, step by step, with code.",
    url: "/algorithms/sorting/merge-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

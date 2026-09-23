// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Selection Sort Visualization",
  description:
    "See selection sort find the minimum and build the sorted array one element at a time, with animated steps and code.",
  alternates: {
    canonical: "/algorithms/sorting/selection-sort",
  },
  openGraph: {
    title: "Selection Sort Visualization | Visual Learner",
    description:
      "See selection sort find the minimum and build the sorted array one element at a time, with animated steps and code.",
    url: "/algorithms/sorting/selection-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}

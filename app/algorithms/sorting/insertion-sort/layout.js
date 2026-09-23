// Server-side metadata for this route (page.js is a client component).
export const metadata = {
  title: "Insertion Sort Visualization",
  description:
    "Animated insertion sort: watch each element slide into place in the sorted prefix, with example code.",
  alternates: {
    canonical: "/algorithms/sorting/insertion-sort",
  },
  openGraph: {
    title: "Insertion Sort Visualization | Visual Learner",
    description:
      "Animated insertion sort: watch each element slide into place in the sorted prefix, with example code.",
    url: "/algorithms/sorting/insertion-sort",
    siteName: "Visual Learner",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }) {
  return children;
}
